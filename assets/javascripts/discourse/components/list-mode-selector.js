import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";
import { ajax } from "discourse/lib/ajax";

export default class ListModeSelector extends Component {
  @service router;
  @service currentUser;
  @service siteSettings;

  @tracked currentMode = "regular";

  get shouldShow() {
    return this.siteSettings.list_modes_enabled && 
           (this.router.currentRouteName.startsWith("discovery.category") || 
            this.router.currentRouteName.startsWith("discovery.latest") ||
            this.router.currentRouteName.startsWith("discovery.top"));
  }

  get category() {
    const categoryRoute = this.router._router.lookup("route:discovery.category");
    return categoryRoute?.modelFor("discovery.category")?.category;
  }

  get modes() {
    return [
      { id: "regular", name: I18n.t("list_modes.regular") },
      { id: "thumbnails", name: I18n.t("list_modes.thumbnails") },
      { id: "gallery", name: I18n.t("list_modes.gallery") },
    ];
  }

  constructor() {
    super(...arguments);
    this._initMode();
  }

  _initMode() {
    const categoryId = this.category?.id;
    if (!categoryId) return;

    const userModes = this.currentUser?.category_list_modes || {};
    if (userModes[categoryId]) {
      this.currentMode = userModes[categoryId];
    } else {
      const thumbCats = (this.siteSettings.list_modes_thumbnails_categories || "").split(",").map(id => id.trim());
      const galleryCats = (this.siteSettings.list_modes_gallery_categories || "").split(",").map(id => id.trim());

      if (thumbCats.includes(categoryId.toString())) {
        this.currentMode = "thumbnails";
      } else if (galleryCats.includes(categoryId.toString())) {
        this.currentMode = "gallery";
      }
    }

    // Apply class on init
    document.body.classList.remove("list-mode-thumbnails", "list-mode-gallery");
    if (this.currentMode !== "regular") {
      document.body.classList.add(`list-mode-${this.currentMode}`);
    }
  }

  @action
  changeMode(newMode) {
    this.currentMode = newMode;
    const categoryId = this.category?.id;
    if (!categoryId) return;

    // Apply class immediately
    document.body.classList.remove("list-mode-thumbnails", "list-mode-gallery");
    if (newMode !== "regular") {
      document.body.classList.add(`list-mode-${newMode}`);
    }

    // Save preference if logged in
    if (this.currentUser) {
      const userModes = { ...(this.currentUser.category_list_modes || {}) };
      userModes[categoryId] = newMode;
      
      ajax(`/u/${this.currentUser.username}/custom_fields`, {
        type: "PUT",
        data: {
          custom_fields: { category_list_mode: JSON.stringify(userModes) }
        }
      }).then(() => {
        this.currentUser.set("category_list_modes", userModes);
      });
    }
  }
}
