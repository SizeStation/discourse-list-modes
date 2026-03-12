# frozen_string_literal: true

require_dependency "discourse_list_modes/engine"

DiscourseListModes::Engine.routes.draw { post "/preferences" => "preferences#update" }
