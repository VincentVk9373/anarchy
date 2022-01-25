import { ANARCHY } from "../config.js";
import { AnarchyBaseActorSheet } from "./base-actor-sheet.js";
import { CharacterEssence } from "./character-actor.js";
import { TEMPLATES_PATH } from "../constants.js";

export class CharacterActorSheet extends AnarchyBaseActorSheet {

  get template() {
    return `${TEMPLATES_PATH}/actor/character.hbs`;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 720,
      height: 700
    });
  }

  getData(options) {
    let hbsData = mergeObject(
      super.getData(options), {
      essence: {
        adjust: CharacterEssence.getAdjust(this.actor.data.data.counters?.essence?.value)
      },
    });
    return hbsData;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // cues, dispositions, keywords
    html.find('.click-word-add').click(async event => {
      this.createNewWord(this.getEventWordType(event));
    });

    html.find('.click-word-say').click(async event => {
      this.actor.sayWord(
        this.getEventWordType(event),
        this.getEventWordId(event));
    });

    html.find('.click-word-edit').click(async event => {
      this.actor.editWord(
        this.getEventWordType(event),
        this.getEventWordId(event));
    });

    html.find('.change-word-value').change(async event => {
      const newWordValue = event.currentTarget.value;
      await this.actor.updateWord(
        this.getEventWordType(event),
        this.getEventWordId(event),
        newWordValue);
    });

    html.find('.click-word-delete').click(async event => {
      this.actor.deleteWord(
        this.getEventWordType(event),
        this.getEventWordId(event));
    });
  }

  createNewWord(wordType) {
    const word = game.i18n.localize(ANARCHY.common.newEntry);
    this.actor.createWord(wordType, word);
  }

  getEventWordType(event) {
    return $(event.currentTarget).closest('.define-wordType').attr('data-word-type');
  }

  getEventWordId(event) {
    return $(event.currentTarget).closest('.define-wordType').attr('data-word-id');
  }

}