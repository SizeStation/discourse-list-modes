# frozen_string_literal: true

module ::DiscourseListModes
  class PreferencesController < ::ApplicationController
    requires_plugin PLUGIN_NAME
    requires_login

    def update
      category_id = params.require(:category_id).to_i
      mode = params.require(:mode).to_s

      # Validate mode
      unless %w[normal images gallery].include?(mode)
        raise Discourse::InvalidParameters.new(:mode)
      end

      # Load or initialize preferences
      preferences = current_user.custom_fields["list_modes_preferences"] || {}
      
      # Update for the specific category
      preferences[category_id.to_s] = mode

      # Save
      current_user.custom_fields["list_modes_preferences"] = preferences
      current_user.save_custom_fields

      render json: success_json
    end
  end
end
