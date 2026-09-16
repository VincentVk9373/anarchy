import { BaseItemSheet } from "./base-item-sheet.js";

export class ShadowampItemSheet extends BaseItemSheet {

  async getData(options) {
    let hbsData = await super.getData(options);
    return hbsData;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
