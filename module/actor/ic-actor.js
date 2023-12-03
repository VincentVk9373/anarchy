import { ICONS_PATH, TEMPLATE } from "../constants.js";
import { AnarchyBaseActor } from "./base-actor.js";


export class ICActor extends AnarchyBaseActor {

  static get defaultIcon() {
    return `${ICONS_PATH}/misc/rub-el-hizb.svg`;
  }

  static get initiative() {
    return AnarchyBaseActor.initiative + " + @attributes.logic.value";
  }

  getMatrixDetails() {
    return {
      hasMatrix: false,
      logic: TEMPLATE.attributes.firewall,
      firewall: TEMPLATE.attributes.firewall,
      monitor: this.system.monitors.matrix,
      overflow: undefined,
    }
  }

  canSetMarks() { return false }

  getAttributes() {
    return [
      TEMPLATE.attributes.firewall,
      TEMPLATE.attributes.logic,
    ];
  }
}