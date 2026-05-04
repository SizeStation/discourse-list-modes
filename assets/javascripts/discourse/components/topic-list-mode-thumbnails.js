import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import I18n from "I18n";

export default class TopicListModeThumbnails extends Component {
  @service siteSettings;

  get shouldShow() {
    return document.body.classList.contains("list-mode-thumbnails") && 
           this.args.outletArgs?.topic?.thumbnails?.length > 0;
  }

  get shouldShowGallery() {
    return document.body.classList.contains("list-mode-gallery") && 
           this.args.outletArgs?.topic?.thumbnails?.length > 0;
  }

  get firstImage() {
    return this.thumbnails[0];
  }

  get thumbnails() {
    return this.args.outletArgs?.topic?.thumbnails || [];
  }

  get displayThumbnails() {
    const thumbs = this.thumbnails;
    if (thumbs.length <= 4) {
      return thumbs.map(url => ({ url, isMore: false }));
    } else {
      // More than 4
      const result = thumbs.slice(0, 3).map(url => ({ url, isMore: false }));
      result.push({
        isMore: true,
        count: I18n.t("list_modes.more", { count: thumbs.length - 3 })
      });
      return result;
    }
  }
}
