import { withPluginApi } from "discourse/lib/plugin-api";
import ItemTopicCell from "discourse/components/topic-list/item/topic-cell";
import HeaderTopicCell from "discourse/components/topic-list/header/topic-cell";
import ItemLikesCell from "discourse/components/topic-list/item/likes-cell";
import HeaderLikesCell from "discourse/components/topic-list/header/likes-cell";
import ItemRepliesCell from "discourse/components/topic-list/item/replies-cell";
import HeaderRepliesCell from "discourse/components/topic-list/header/replies-cell";
import ItemViewsCell from "discourse/components/topic-list/item/views-cell";
import HeaderViewsCell from "discourse/components/topic-list/header/views-cell";
import LastReplyCell, {
  LAST_REPLY_HEADER,
} from "../components/last-reply-cell";

export default {
  name: "discourse-list-modes",

  initialize(container) {
    // Set default body class before any component renders, preventing layout flash
    document.body.classList.add("list-mode-regular");

    withPluginApi("0.8.31", (api) => {
      api.modifyClass("model:topic", {
        pluginId: "discourse-list-modes",
        thumbnails: null,
      });

      // Always produce standard XenForo-style columns.
      // Visual differences between modes are handled entirely by CSS,
      // so the cached column result is always correct and no router.refresh() is needed.
      api.registerValueTransformer(
        "topic-list-columns",
        ({ value: columns }) => {
          for (const [key] of columns.entries()) {
            columns.delete(key);
          }

          columns.add("topic", {
            item: ItemTopicCell,
            header: HeaderTopicCell,
          });

          columns.add("last-reply", {
            item: LastReplyCell,
            header: LAST_REPLY_HEADER,
            after: "topic",
          });

          columns.add("likes", {
            item: ItemLikesCell,
            header: HeaderLikesCell,
            after: "last-reply",
          });

          columns.add("replies", {
            item: ItemRepliesCell,
            header: HeaderRepliesCell,
            after: "likes",
          });

          columns.add("views", {
            item: ItemViewsCell,
            header: HeaderViewsCell,
            after: "replies",
          });

          return columns;
        }
      );

      api.registerValueTransformer(
        "topic-list-item-mobile-layout",
        ({ value }) => {
          if (
            document.body.classList.contains("list-mode-regular") ||
            document.body.classList.contains("list-mode-gallery")
          ) {
            return false;
          }
          return value;
        }
      );
    });
  },
};
