import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";

export default class ListModesService extends Service {
  @service siteSettings;
  @service currentUser;

  @tracked currentMode = "normal";
  @tracked currentCategoryId = null;

  get selectableModes() {
    let modes = [];
    if (this.siteSettings.list_modes_normal_selectable) {
      modes.push({ id: "normal", name: I18n.t("discourse_list_modes.normal") });
    }
    if (this.siteSettings.list_modes_images_selectable) {
      modes.push({ id: "images", name: I18n.t("discourse_list_modes.images") });
    }
    if (this.siteSettings.list_modes_gallery_selectable) {
      modes.push({
        id: "gallery",
        name: I18n.t("discourse_list_modes.gallery"),
      });
    }
    return modes;
  }

  get showSelector() {
    return this.selectableModes.length >= 2 && this.currentCategoryId != null;
  }

  getModeForCategory(category) {
    if (!category || !category.id) return "normal";

    const catId = category.id.toString();

    // 1. Check user preference
    if (this.currentUser && this.currentUser.list_modes_preferences) {
      const pref = this.currentUser.list_modes_preferences[catId];
      if (pref && this.isSelectable(pref)) {
        return pref;
      }
    }

    // 2. Fallback to site setting
    if (
      this.isCategoryDefault("images", catId) &&
      this.isSelectable("images")
    ) {
      return "images";
    }
    if (
      this.isCategoryDefault("gallery", catId) &&
      this.isSelectable("gallery")
    ) {
      return "gallery";
    }

    // 3. Ultimate fallback
    return "normal";
  }

  isCategoryDefault(mode, categoryId) {
    const defaultSetting =
      this.siteSettings[`list_modes_${mode}_default_categories`];
    if (!defaultSetting) return false;
    const catArray = defaultSetting.split("|");
    return catArray.includes(categoryId.toString());
  }

  isSelectable(mode) {
    return this.siteSettings[`list_modes_${mode}_selectable`];
  }

  updateCategory(category) {
    this.currentCategoryId = category ? category.id : null;
    this.currentMode = this.getModeForCategory(category);
  }

  setMode(mode) {
    if (!this.currentCategoryId || !this.isSelectable(mode)) return;
    this.currentMode = mode;

    if (this.currentUser) {
      // Optimistic update
      if (!this.currentUser.list_modes_preferences) {
        this.currentUser.list_modes_preferences = {};
      }
      this.currentUser.list_modes_preferences[
        this.currentCategoryId.toString()
      ] = mode;

      ajax("/list-modes/preferences", {
        type: "POST",
        data: {
          category_id: this.currentCategoryId,
          mode: mode,
        },
      }).catch((e) => {
        // eslint-disable-next-line no-console
        console.error("Failed to save list mode preference", e);
      });
    }
  }
}
