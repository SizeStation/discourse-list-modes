import Component from "@glimmer/component";
import { service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import I18n from "I18n";

export default class BeforeCreateTopicButtonListModeSelector extends Component {
  @service currentUser;
  @service siteSettings;
  @service listMode;

  @tracked _currentMode = null;

  constructor() {
    super(...arguments);
    this.listMode.setMode(this.currentMode);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.listMode.setMode("regular");
  }

  get category() {
    // The before-create-topic-button outlet passes category in outletArgs
    return this.args.outletArgs?.category;
  }

  get categoryId() {
    return this.category?.id;
  }

  get shouldShow() {
    // Only show on actual category pages (category is present)
    return this.siteSettings.list_modes_enabled && !!this.categoryId;
  }

  get currentMode() {
    // Return tracked value if user has changed it this session,
    // otherwise resolve from prefs/settings
    if (this._currentMode !== null) return this._currentMode;
    return this._resolveMode();
  }

  get modes() {
    return [
      { id: "regular", name: I18n.t("list_modes.regular") },
      { id: "thumbnails", name: I18n.t("list_modes.thumbnails") },
      { id: "gallery", name: I18n.t("list_modes.gallery") },
    ];
  }

  _resolveMode() {
    const catId = this.categoryId;
    if (!catId) return "regular";

    const userModes = this.currentUser?.category_list_modes || {};
    if (userModes[catId]) return userModes[catId];

    const thumbCats = (this.siteSettings.list_modes_thumbnails_categories || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const galleryCats = (this.siteSettings.list_modes_gallery_categories || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (thumbCats.includes(String(catId))) return "thumbnails";
    if (galleryCats.includes(String(catId))) return "gallery";
    return "regular";
  }

  @action
  changeMode(newMode) {
    this._currentMode = newMode;
    this.listMode.setMode(newMode);

    const catId = this.categoryId;
    if (!catId || !this.currentUser) {
      return;
    }

    const userModes = { ...(this.currentUser.category_list_modes || {}) };
    userModes[catId] = newMode;

    ajax(`/u/${this.currentUser.username}.json`, {
      type: "PUT",
      data: {
        custom_fields: { category_list_mode: JSON.stringify(userModes) },
      },
    }).then(() => {
      this.currentUser.set("category_list_modes", userModes);
    });
  }
}
