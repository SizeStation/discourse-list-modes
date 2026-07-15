import Component from "@glimmer/component";
import { service } from "@ember/service";

export default class TopicListItemAfterMainLinkTopicListModeThumbnails extends Component {
  @service listMode;

  get topic() {
    return this.args.outletArgs?.topic;
  }

  get shouldShow() {
    return false;
  }
}
