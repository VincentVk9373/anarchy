import { ICONS_PATH } from "../constants.js";
import { AnarchyBaseItem } from "./anarchy-base-item.js";

export class ShadowampItem extends AnarchyBaseItem {

  get defaultIcon() {
    return `${ICONS_PATH}/shadowamps/other.svg`;
  }

}