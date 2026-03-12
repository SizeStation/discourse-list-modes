import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";

export default {
  name: "list-modes-init",

  initialize(container) {
    withPluginApi("0.8", (api) => {
      const listModes = container.lookup("service:list-modes");

      api.onPageChange((url, title) => {
        // We need to check if we are in a category
        const router = container.lookup("service:router");
        const currentRoute = router.currentRoute;

        let category = null;
        if (
          currentRoute &&
          currentRoute.attributes &&
          currentRoute.attributes.category
        ) {
          category = currentRoute.attributes.category;
        } else if (
          currentRoute &&
          currentRoute.parent &&
          currentRoute.parent.attributes &&
          currentRoute.parent.attributes.category
        ) {
          category = currentRoute.parent.attributes.category;
        }

        listModes.updateCategory(category);

        // Update document body class based on mode
        document.body.classList.remove(
          "list-mode-normal",
          "list-mode-images",
          "list-mode-gallery"
        );

        if (category) {
          document.body.classList.add(`list-mode-${listModes.currentMode}`);
        }
      });
    });
  },
};
