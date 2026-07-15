import Component from "@glimmer/component";
import { service } from "@ember/service";

export default class TopicListBeforeStatusTopicListModeThumbnails extends Component {
  @service listMode;
  @service siteSettings;

  get topic() {
    return this.args.outletArgs?.topic;
  }

  get posterUser() {
    return this.topic?.posters?.[0]?.user;
  }

  get thumbnails() {
    return this.topic?.thumbnails || [];
  }

  get firstImage() {
    return (
      this.thumbnails[0] ||
      this.siteSettings.list_modes_gallery_default_image ||
      null
    );
  }

  get showPosterAvatar() {
    return this.listMode.currentMode === "regular" && this.posterUser;
  }

  get showGalleryBg() {
    return this.listMode.currentMode === "gallery" && this.firstImage;
  }
}
