import { SRA } from "../config.js";
import { SRASkillRoll } from "../dialog/skill-roll.js";
import { Enums } from "../enums.js";
import { ErrorManager } from "../error-manager.js";
import { Misc } from "../misc.js";
import { Modifiers } from "../modifiers.js";
import { SRARoll } from "../roll.js";


const CHECKBARS = {
  physical: { value: 'data.monitors.physical.value', maxForActor: actor => actor.data.data.monitors.physical.max, resource: SRA.actor.monitors.physical },
  stun: { value: 'data.monitors.stun.value', maxForActor: actor => actor.data.data.monitors.stun.max, resource: SRA.actor.monitors.stun },
  armor: { value: 'data.monitors.armor.value', maxForActor: actor => actor.data.data.monitors.armor.max, resource: SRA.actor.monitors.armor },
  anarchy: { value: 'data.counters.anarchy.value', maxForActor: actor => actor.data.data.counters.anarchy.max, resource: SRA.actor.counters.anarchy },
  edge: { value: 'data.counters.edge.value', maxForActor: actor => actor.data.data.attributes.edge.value, resource: SRA.actor.counters.edge }
}

export class SRABaseActor extends Actor {

  prepareData() {
    super.prepareData();
  }

  async createWordlistWord(wordlist, added) {
    this._mutateWordlist(wordlist, values => values.concat([added]));
  }

  async updateWordlistWord(wordlist, previous, updated) {
    this._mutateWordlist(wordlist, values => values.map(it => it == previous ? updated : it));
  }

  async deleteWordlistWord(wordlist, word) {
    this._mutateWordlist(wordlist, values => values.filter(it => it != word));
  }

  async _mutateWordlist(wordlist, mutate = values => values) {
    const listType = Enums.getActorDescriptionType(wordlist);
    if (!listType) {
      return;
    }
    let values = Misc.distinct(mutate(this.data.data.description[listType]));
    await this.update({ [`data.description.${listType}`]: values });
  }

  async setCounter(monitor, value) {
    const checkbar = CHECKBARS[monitor];
    if (checkbar) {
      ErrorManager.checkOutOfRange(checkbar.resource, value, 0, checkbar.maxForActor(this));
      await this.update({ [`${checkbar.value}`]: value });
    }
  }

  async skillRoll(skill, specialization) {
    const rollData = Modifiers.prepareSkillRollData(this, skill, specialization);
    const dialog = await SRASkillRoll.create(rollData, async r => this.onSkillRoll(r));
    dialog.render(true);
  }

  async onSkillRoll(rollData) {
    console.log('onSkillRoll', rollData);

    rollData.param = Modifiers.computeRollParameters(rollData);
    await this.spendEdge(rollData.param.edge);
    await this.spendAnarchy(rollData.param.anarchy);
    this.rollToChat(rollData);
  }

  async rollToChat(rollData) {
    const target = rollData.param.edge > 0 ? 4 : 5;
    const roll = SRARoll.create(rollData.param);
    await roll.evaluate();
    await roll.toMessage({ flavor: rollData.title + ' ' + roll.total });
    //TODO: use SRARoll
  }

  async spendAnarchy(count) {
    let value = this.data.data.counters.anarchy.value;
    ErrorManager.checkSufficient(SRA.actor.counters.anarchy, count, value);
    await this.update({ 'data.counters.anarchy.value': (value - count) });
  }

  async spendEdge(spend) {
    if (spend) {
      let current = this.data.data.counters.edge.value;
      let available = this.data.data.attributes.edge.value - current;
      ErrorManager.checkSufficient(SRA.actor.counters.edge, spend, available);
      await this.update({ 'data.counters.edge.value': (current + 1) });
    }
  }

  getAttributeValue(attribute) {
    const selected = this.data.data.attributes[attribute];
    return selected ? selected.value : `?`;
  }

  getWounds(skillCode) {
    // TODO: for matrix skill, should use the matrix condition monitor of the cyberdeck

    return -Misc.divint(this.data.data.monitors.stun.value, 3)
      - Misc.divint(this.data.data.monitors.physical.value, 3);
  }

}