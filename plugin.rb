# frozen_string_literal: true

# name: discourse-list-modes
# about: A plugin to add Normal, Images, and Gallery modes to category topic lists
# meta_topic_id: TODO
# version: 0.0.1
# authors: User
# url: https://github.com/SizeStation/discourse-list-modes
# required_version: 2.7.0

enabled_site_setting :list_modes_enabled

module ::DiscourseListModes
  PLUGIN_NAME = "discourse-list-modes"
end

require_relative "lib/discourse_list_modes/engine"

after_initialize do
  User.register_custom_field_type("list_modes_preferences", :json)
  register_editable_user_custom_field(:list_modes_preferences)

  add_to_serializer(:current_user, :list_modes_preferences) do
    object.custom_fields["list_modes_preferences"] || {}
  end

  add_to_serializer(:topic_list_item, :list_modes_images, include_condition: -> { scope.is_admin? || true }) do
    # Ensure we include images. object is a Topic
    # We grab the image_url or thumbnails
    if object.image_url.present?
      # Return as array for consistency
      [object.image_url]
    else
      []
    end
  end
end
