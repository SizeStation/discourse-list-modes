import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class ListModesSelector extends Component {
  @service listModes;

  get availableModes() {
    return this.listModes.selectableModes.map((m) => {
      return {
        id: m.id,
        name: m.name,
      };
    });
  }

  @action
  onChange(modeId) {
    this.listModes.setMode(modeId);
  }
}
