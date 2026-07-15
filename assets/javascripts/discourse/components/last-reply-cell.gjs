import Component from "@glimmer/component";
import dAvatar from "discourse/ui-kit/helpers/d-avatar";
import dFormatDate from "discourse/ui-kit/helpers/d-format-date";
import DUserLink from "discourse/ui-kit/d-user-link";
import { i18n } from "discourse-i18n";

export const LAST_REPLY_HEADER = <template>
  <th class="last-reply topic-list-data" ...attributes>
    {{i18n "list_modes.last_reply"}}
  </th>
</template>;

export default class LastReplyCell extends Component {
  get lastPosterUser() {
    const posters = this.args.topic.posters || [];
    return (
      posters.find(
        (p) => p.extras === "latest" || p.description?.includes("Most Recent")
      )?.user || posters[posters.length - 1]?.user
    );
  }

  <template>
    <td class="last-reply topic-list-data">
      <span class="last-reply-avatar">
        <DUserLink @username={{this.lastPosterUser.username}}>
          {{dAvatar this.lastPosterUser imageSize="small"}}
        </DUserLink>
      </span>
      <span class="last-reply-time">{{dFormatDate
          @topic.bumpedAt
          format="tiny"
          noTitle="true"
        }}</span>
    </td>
  </template>
}
