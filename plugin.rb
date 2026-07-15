# frozen_string_literal: true

# name: discourse-list-modes
# about: Adds extra list modes (thumbnails, gallery) to category thread lists.
# version: 0.1
# authors: Antigravity
# url: https://github.com/discourse/discourse-list-modes
# required_version: 2.7.0

enabled_site_setting :list_modes_enabled

module ::DiscourseListModes
  PLUGIN_NAME = "discourse-list-modes"
end

register_asset "stylesheets/discourse-list-modes.scss"

after_initialize do
  [:basic_topic, :topic_list_item].each do |s|
    add_to_serializer(s, :thumbnails) do
      return [] unless SiteSetting.list_modes_enabled
      
      # 1. Get images from first post
      cooked = Post.where(topic_id: object.id, post_number: 1).pluck(:cooked).first
      images = []
      if cooked.present?
        doc = Nokogiri::HTML.fragment(cooked)
        images = doc.css("img").map { |img| img["src"] }.reject do |src| 
          src.include?("/images/emoji/") || src.include?("/images/avatar/") || src.blank?
        end
      end
      
      # 2. Add topic image_url as fallback/first
      images.unshift(object.image_url) if object.image_url.present?

      # 3. Normalize all to absolute and deduplicate by canonical path
      images.map! do |url|
        if url.start_with?("http") || url.start_with?("//")
          url
        else
          "#{Discourse.base_url}#{url.start_with?("/") ? "" : "/"}#{url}"
        end
      end

      images.uniq! do |url| 
        sha = url.match(/([a-f0-9]{40})/)
        sha ? sha[1] : url.split("?").first.gsub(/^https?:/, "")
      end
      images.take(5)
    end
  end

  # Allow users to save their category preference
  User.register_custom_field_type("category_list_mode", :json)
  register_editable_user_custom_field :category_list_mode
  
  add_to_serializer(:current_user, :category_list_modes) do
    # Ensure custom_fields are loaded
    fields = object.custom_fields["category_list_mode"]
    fields.is_a?(String) ? JSON.parse(fields) : (fields || {})
  end
end
