import Component from "@glimmer/component";
import { service } from "@ember/service";
import I18n from "I18n";

export default class TopicListMainLinkBottomTopicListModeThumbnails extends Component {
  @service listMode;

  get topic() {
    return this.args.outletArgs?.topic;
  }

  get thumbnails() {
    return this.topic?.thumbnails || [];
  }

  get posterUser() {
    return this.topic?.posters?.[0]?.user;
  }

  get showImagesStrip() {
    return (
      this.listMode.currentMode === "regular" && this.thumbnails.length > 0
    );
  }

  get showGalleryContent() {
    return this.listMode.currentMode === "gallery" && this.posterUser;
  }

  get topicUrl() {
    return this.topic?.url;
  }

  get displayThumbnails() {
    const thumbs = this.thumbnails;
    if (thumbs.length <= 4) {
      return thumbs.map((url) => ({ url, isMore: false }));
    }
    const result = thumbs.slice(0, 3).map((url) => ({ url, isMore: false }));
    result.push({
      isMore: true,
      label: I18n.t("list_modes.more", { count: thumbs.length - 3 }),
    });
    return result;
  }
}
