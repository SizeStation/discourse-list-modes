import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";

export default {
  name: "list-modes-topic-list-item",
  initialize(container) {
    withPluginApi("0.8", (api) => {
      const modifier = {
        pluginId: "discourse-list-modes",
        listModes: service("list-modes"),

        attributeBindings: ["galleryBackgroundStyle:style", "class"],

        get class() {
          let classes = this._super(...arguments) || "";
          if (this.listModes.currentMode === "gallery") {
            classes += " gallery-mode-item";
          }
          if (this.listModes.currentMode === "images") {
            classes += " images-mode-item";
          }
          return classes;
        },

        get galleryBackgroundStyle() {
          if (this.listModes.currentMode !== "gallery") {
            return htmlSafe("");
          }

          const images = this.topic.get("list_modes_images");
          if (images && images.length > 0) {
            return htmlSafe(`background-image: url(${images[0]});`);
          }

          return htmlSafe("");
        },
      };

      api.modifyClass("component:topic-list-item", modifier);
      // Horizon theme card component
      api.modifyClass("component:topic-list-card", modifier);
    });
  },
};
