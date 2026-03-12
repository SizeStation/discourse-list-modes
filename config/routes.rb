# frozen_string_literal: true

require_dependency "discourse_list_modes/engine"

DiscourseListModes::Engine.routes.draw do
  post "/preferences" => "preferences#update"
end

Discourse::Application.routes.append do
  mount ::DiscourseListModes::Engine, at: "/list-modes"
end
