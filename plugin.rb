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
  add_to_serializer(:topic_list_item, :thumbnails) do
    return [] unless SiteSetting.list_modes_enabled
    
    # Get images from the first post
    post = object.first_post
    return [] unless post

    # Extract image URLs from cooked content
    # We want up to 4 images
    doc = Nokogiri::HTML5.fragment(post.cooked)
    images = doc.css("img").map { |img| img["src"] }.reject { |src| src.include?("/images/emoji/") }
    
    images.uniq.take(5) # Take up to 5 to handle the "+x" logic more easily on frontend
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
