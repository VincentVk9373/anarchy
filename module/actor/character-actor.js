import { ANARCHY } from "../config.js";
import { BASE_MONITOR, TEMPLATE } from "../constants.js";
import { AnarchyBaseActor, CHECKBARS } from "./base-actor.js";
import { ErrorManager } from "../error-manager.js";
import { Misc } from "../misc.js";
import { AnarchyUsers } from "../users.js";

const essenceRange = [
  { from: 5, to: 6, adjust: 0 },
  { from: 3, to: 5, adjust: -1 },
  { from: 1, to: 3, adjust: -2 },
  { from: 0, to: 1, adjust: -3 }
]

export class CharacterEssence {
  static getAdjust(essence) {
    return this.getEssenceRange(essence)?.adjust ?? 0;
  }

  static getEssenceRange(essence) {
    return essenceRange.find(r => r.from < essence && essence <= r.to) ?? essenceRange[0];
  }
}

export class CharacterActor extends AnarchyBaseActor {

  static reindexWordIds(list) {
    let index = 1;
    list.forEach(it => it.id = (index++));
    return list;
  }

  prepareData() {
    super.prepareData();
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    this.data.data.monitors.physical.max = BASE_MONITOR + Misc.divup(this.data.data.attributes.strength.value, 2)
    this.data.data.monitors.stun.max = BASE_MONITOR + Misc.divup(this.data.data.attributes.willpower.value, 2)
  }

  getAttributes() {
    return [
      TEMPLATE.attributes.agility,
      TEMPLATE.attributes.strength,
      TEMPLATE.attributes.willpower,
      TEMPLATE.attributes.logic,
      TEMPLATE.attributes.charisma,
      TEMPLATE.attributes.edge
    ];
  }

  async createWord(wordType, added) {
    this._mutateWords(wordType, values => values.concat([{ word: added, audio: '' }]));
  }

  async sayWord(wordType, wordId) {
    const wordsToSay = this.getWord(wordType, wordId);
    if (wordsToSay) {
      if (wordsToSay?.audio) {
        // TODO: play audio file
      }
      ChatMessage.create({
        speaker: { alias: this.token?.name ?? this.name },
        content: wordsToSay.word // TODO: improve the tchat content (add the character image)
      });
    }
  }

  getWord(wordType, wordId) {
    return wordType ? this.data.data[wordType].find(it => it.id == wordId) : undefined;
  }

  async editWord(wordType, wordId) {
    // TODO: dialog to edit the word audio
  }

  async updateWord(wordType, wordId, updated) {
    this._appyWordUpdate(wordType, wordId, it => mergeObject(it, { word: updated }, { overwrite: true }));
  }

  async _appyWordUpdate(wordType, wordId, updateFunction) {
    this._mutateWords(wordType, values => values.map(it => it.id == wordId ? updateFunction(it) : it));
  }

  async deleteWord(wordType, deletedId) {
    this._mutateWords(wordType, values => values.filter(it => it.id != deletedId));
  }

  async _mutateWords(wordType, mutate = values => values) {
    if (!wordType) {
      return;
    }
    let newValues = mutate(this.data.data[wordType]);
    CharacterActor.reindexWordIds(newValues);
    await this.update({ [`data.${wordType}`]: newValues });
  }

  async setAnarchy(newValue) {
    if (this.hasPlayerOwner) {
      const current = this.data.data.counters.anarchy.value;
      ErrorManager.checkOutOfRange(CHECKBARS.anarchy.resource, newValue, 0, CHECKBARS.anarchy.maxForActor(this));
      if (!game.user.isGM) {
        AnarchyUsers.blindMessageToGM({
          from: game.user.id,
          content: game.i18n.format(ANARCHY.gmManager.playerChangedAnarchy,
            {
              user: game.user.name,
              actor: this.name,
              from: current,
              to: newValue
            })
        });
      }
      if (newValue < current) {
        await game.system.anarchy.gmManager.gmAnarchy.actorGivesAnarchyToGM(this, current - newValue);
      }
      await this.update({ [`${CHECKBARS.anarchy.dataPath}`]: newValue });
    }
    else {
      super.setAnarchy(newValue);
    }
  }

  getAnarchy() {
    if (this.hasPlayerOwner) {
      return {
        value: this.data.data.counters.anarchy.value,
        max: this.data.data.counters.anarchy.max,
        scene: 0
      };
    }
    return super.getAnarchy();
  }

  async spendAnarchy(count) {
    if (count) {
      if (this.hasPlayerOwner) {
        let current = this.getAnarchyValue();
        ErrorManager.checkSufficient(ANARCHY.common.anarchy.anarchy, count, current);
        await game.system.anarchy.gmManager.gmAnarchy.actorGivesAnarchyToGM(this, count);
        await this.update({ 'data.counters.anarchy.value': (current - count) });
      }
      else {
        super.spendAnarchy(count);
      }
    }
  }

  async spendEdge(count) {
    if (count) {
      let current = this.data.data.counters.edge.value;
      ErrorManager.checkSufficient(ANARCHY.actor.counters.edge, count, current);
      await this.update({ 'data.counters.edge.value': (current - count) });
    }
  }

  getSkillValue(skillId, specialization = undefined) {
    const skill = this.items.get(skillId);
    const attribute = this.data.data.attributes[skill.data.data.attribute];
    return skill.data.data.value + (attribute?.value ?? 0) + (specialization && skill.data.data.specialization ? 2 : 0);
  }

  getWounds() {
    return Misc.divint(this.data.data.monitors.stun.value, 3)
      + Misc.divint(this.data.data.monitors.physical.value, 3);
  }

}