import { withPluginApi } from "discourse/lib/plugin-api";
import { action } from "@ember/object";

export default {
  name: "discourse-list-modes",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.modifyClass("controller:discovery/categories", {
        pluginId: "discourse-list-modes",
      });

      api.onPageChange((url, title) => {
        // Detect if we are in a category list
        const categoryRoute = api.container.lookup("route:discovery.category");
        if (categoryRoute && categoryRoute.isActive) {
          const category = categoryRoute.modelFor("discovery.category").category;
          this._applyListMode(api, category);
        } else {
          document.body.classList.remove("list-mode-thumbnails", "list-mode-gallery");
        }
      });
    });
  },

  _applyListMode(api, category) {
    if (!category) return;

    const currentUser = api.getCurrentUser();
    const categoryId = category.id;
    let mode = "regular";

    // 1. Check user preference
    const userModes = currentUser?.category_list_modes || {};
    if (userModes[categoryId]) {
      mode = userModes[categoryId];
    } else {
      // 2. Check site settings defaults
      const thumbCats = (api.settings.list_modes_thumbnails_categories || "").split(",").map(id => id.trim());
      const galleryCats = (api.settings.list_modes_gallery_categories || "").split(",").map(id => id.trim());

      if (thumbCats.includes(categoryId.toString())) {
        mode = "thumbnails";
      } else if (galleryCats.includes(categoryId.toString())) {
        mode = "gallery";
      }
    }

    document.body.classList.remove("list-mode-thumbnails", "list-mode-gallery");
    if (mode !== "regular") {
      document.body.classList.add(`list-mode-${mode}`);
    }
  }
};
