import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ListModeService extends Service {
  @tracked currentMode = "regular";
  _topicThumbnails = new Map();

  setMode(mode) {
    this.currentMode = mode;
    this._applyBodyClass(mode);
  }

  setTopicThumbnails(topicId, thumbnails) {
    this._topicThumbnails.set(parseInt(topicId, 10), thumbnails);
  }

  getTopicThumbnails(topicId) {
    return this._topicThumbnails.get(parseInt(topicId, 10));
  }

  _applyBodyClass(mode) {
    document.body.classList.remove(
      "list-mode-regular",
      "list-mode-thumbnails",
      "list-mode-gallery"
    );
    if (mode !== "regular") {
      document.body.classList.add(`list-mode-${mode}`);
    } else {
      document.body.classList.add("list-mode-regular");
    }
  }
}
