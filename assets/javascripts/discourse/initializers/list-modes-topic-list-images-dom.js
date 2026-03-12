import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";
import { schedule } from "@ember/runloop";

export default {
  name: "list-modes-topic-list-images-dom",
  initialize() {
    withPluginApi("0.8", (api) => {
      api.modifyClass("component:topic-list-item", {
        pluginId: "discourse-list-modes",
        listModes: service("list-modes"),

        didInsertElement() {
          this._super(...arguments);
          this._renderImages();
        },

        didRender() {
          this._super(...arguments);
          this._renderImages();
        },

        _renderImages() {
          schedule("afterRender", () => {
            if (this.isDestroying || this.isDestroyed || !this.element) return;

            // Only render thumbnails if in images mode
            if (this.listModes.currentMode !== "images") {
              const existing = this.element.querySelector(
                ".list-mode-thumbnails"
              );
              if (existing) existing.remove();
              return;
            }

            // Prevent duplicate rendering
            if (this.element.querySelector(".list-mode-thumbnails")) return;

            const images = this.topic.get("list_modes_images");
            if (!images || images.length === 0) return;

            const maxImages = 4;
            const container = document.createElement("div");
            container.className = "list-mode-thumbnails";

            for (let i = 0; i < Math.min(images.length, maxImages); i++) {
              if (i === maxImages - 1 && images.length > maxImages) {
                const moreCount = images.length - maxImages + 1;
                const div = document.createElement("div");
                div.className = "more-images";
                div.innerText = `+${moreCount}`;
                container.appendChild(div);
              } else {
                const img = document.createElement("img");
                img.className = "thumbnail";
                img.src = images[i];
                img.loading = "lazy";
                container.appendChild(img);
              }
            }

            this.element.appendChild(container);
          });
        },
      });
    });
  },
};
