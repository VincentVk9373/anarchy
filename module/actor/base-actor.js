import { SRA } from "../config.js";
import { SRARollDialog } from "../dialog/roll-dialog.js";
import { Enums } from "../enums.js";
import { ErrorManager } from "../error-manager.js";
import { Misc } from "../misc.js";


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
    let values = Misc.distinct(mutate(this.data.data[listType]));
    await this.update({ [`data.{listType}`]: values });
  }

  async setCounter(monitor, value) {
    const checkbar = CHECKBARS[monitor];
    if (checkbar) {
      ErrorManager.checkOutOfRange(checkbar.resource, value, 0, checkbar.maxForActor(this));
      await this.update({ [`${checkbar.value}`]: value });
    }
  }

  async skillRoll(skill, specialization) {
    const rollData = SRARollDialog.prepareSkillRollData(this, skill, specialization);
    const dialog = await SRARollDialog.create(rollData);
    dialog.render(true);
  }

  async attributeRoll(attribute, attribute2 = undefined) {
    const rollData = SRARollDialog.prepareAttributeRollData(this, attribute, attribute2);
    const dialog = await SRARollDialog.create(rollData);
    dialog.render(true);
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

  async removeOtherMetatype(metatype) {
    const metatypeIds = this.items.filter(it => it.isMetatype)
      .filter(it => it.id != metatype.id)
      .map(it => it.id);
    this.deleteEmbeddedDocuments("Item", metatypeIds);
  }
}