import { Checkbars } from "../common/checkbars.js";
import { ANARCHY } from "../config.js";
import { SYSTEM_NAME, TEMPLATE } from "../constants.js";
import { ANARCHY_HOOKS, HooksManager } from "../hooks-manager.js";

const DAMAGE_MODE = 'damage-mode'
const SELECTED_DAMAGE_MODE = `${SYSTEM_NAME}.${DAMAGE_MODE}`;

const damageModeChoices = {};
const damageModeMethods = {};

export class ActorDamageManager {

  static init() {
    HooksManager.register(ANARCHY_HOOKS.PROVIDE_DAMAGE_MODE);
    Hooks.on('updateSetting', async (setting, update, options, id) => ActorDamageManager.onUpdateSetting(setting, update, options, id));

    Hooks.on(ANARCHY_HOOKS.PROVIDE_DAMAGE_MODE, provide => {
      provide('resistanceArmorMonitor', ANARCHY.settings.damageMode.values.resistanceArmorMonitor, ActorDamageManager.sufferDamageResistanceArmorMonitor);
      provide('armorResistanceMonitor', ANARCHY.settings.damageMode.values.armorResistanceMonitor, ActorDamageManager.sufferDamageArmorResistanceMonitor);
      provide('armorGivesResistance', ANARCHY.settings.damageMode.values.armorGivesResistance, ActorDamageManager.sufferDamageArmorAsResistance);
    });
    Hooks.once('ready', () => ActorDamageManager.onReady());
  }

  static onReady() {
    ActorDamageManager._registerDamageModeSetting();
    ActorDamageManager._selectDamageMode();
  }

  static _registerDamageModeSetting() {
    Hooks.callAll(ANARCHY_HOOKS.PROVIDE_DAMAGE_MODE, (code, labelkey, method) => {
      damageModeChoices[code] = game.i18n.localize(labelkey);
      damageModeMethods[code] = method;
    });
    game.settings.register(SYSTEM_NAME, DAMAGE_MODE, {
      scope: "world",
      name: game.i18n.localize(ANARCHY.settings.damageMode.name),
      hint: game.i18n.localize(ANARCHY.settings.damageMode.hint),
      config: true,
      default: Object.keys(damageModeChoices)[0],
      choices: damageModeChoices,
      type: String
    });
  }

  static async onUpdateSetting(setting, update, options, id) {
    if (setting.key == SELECTED_DAMAGE_MODE) {
      ActorDamageManager._selectDamageMode();
    }
  }

  static _selectDamageMode() {
    let damageModeCode = game.settings.get(SYSTEM_NAME, DAMAGE_MODE)
    if (!damageModeMethods[damageModeCode]) {
      damageModeCode = Object.keys(damageModeChoices)[0];
    }
    ActorDamageManager.damageModeCode = damageModeCode;
    ActorDamageManager.damageModeMethod = damageModeMethods[damageModeCode];
  }

  static async sufferDamage(actor, monitor, damage, success, avoidArmor, sourceActor) {
    const sufferDamageMethod = ActorDamageManager.damageModeMethod ?? ActorDamageManager.sufferDamageResistanceArmorMonitor;
    return await sufferDamageMethod(actor, monitor, damage, success, avoidArmor, sourceActor);
  }

  static async sufferMarks(actor, sourceActor) {
    await Checkbars.addCounter(actor, TEMPLATE.monitors.marks, 1, sourceActor.id);
  }

  static async sufferDamageResistanceArmorMonitor(actor, monitor, damage, success, avoidArmor, sourceActor) {
    if (monitor == TEMPLATE.monitors.marks) {
      await ActorDamageManager.sufferMarks(actor, sourceActor)
      return;
    }
    const resistance = Checkbars.resistance(actor, monitor);
    let total = 0;

    if (avoidArmor) {
      const resisted1 = Math.min(resistance, damage);
      const resisted2 = Math.min(resistance - resisted1, success);
      total = damage - resisted1;
      if (Checkbars.useArmor(monitor)) {
        total -= await ActorDamageManager._damageToArmor(actor, total);
      }
      total += success - resisted2;
    }
    else {
      total = damage + success - resistance;
      if (Checkbars.useArmor(monitor)) {
        total -= await ActorDamageManager._damageToArmor(actor, total);
      }
    }
    if (total > 0) {
      await Checkbars.addCounter(actor, monitor, total);
    }
  }

  static async sufferDamageArmorResistanceMonitor(actor, monitor, damage, success, avoidArmor, sourceActor) {
    if (monitor == TEMPLATE.monitors.marks) {
      await ActorDamageManager.sufferMarks(actor, sourceActor)
      return;
    }
    let total = 0;
    if (Checkbars.useArmor(monitor)) {
      if (avoidArmor) {
        damage -= await ActorDamageManager._damageToArmor(actor, damage);
        total = success + damage;
      }
      else {
        total = success + damage;
        total -= await ActorDamageManager._damageToArmor(actor, total);
      }
    }
    else {
      total = damage + success;
    }
    total -= Checkbars.resistance(actor, monitor);
    if (total > 0) {
      await Checkbars.addCounter(actor, monitor, total);
    }
    return total;
  }

  static async _damageToArmor(actor, value) {
    if (value > 0) {
      const armorMax = Checkbars.max(actor, TEMPLATE.monitors.armor);
      const armor = Checkbars.getCounterValue(actor, TEMPLATE.monitors.armor);
      const armorReduction = Math.min(armorMax - armor, value);
      const armorResistance = Checkbars.resistance(actor, TEMPLATE.monitors.armor);
      const armorDmg = Math.max(0, armorReduction - armorResistance);
      if (armorDmg > 0) {
        await Checkbars.addCounter(actor, TEMPLATE.monitors.armor, armorDmg);
      }
      return armorReduction;
    }
    else {
      return 0;
    }
  }


  static async sufferDamageArmorAsResistance(actor, monitor, damage, success, avoidArmor, sourceActor) {
    if (monitor == TEMPLATE.monitors.marks) {
      await ActorDamageManager.sufferMarks(actor, sourceActor)
      return;
    }
    let total = damage + success;
    if (Checkbars.useArmor(monitor) && avoidArmor && total > 0) {
      const armorReduction = await ActorDamageManager._applyArmorResistance(actor, total);
      total -= armorReduction;
    }
    total -= Checkbars.resistance(actor, monitor);
    if (total > 0) {
      await Checkbars.addCounter(actor, monitor, total);
    }
    return total;
  }

  static async _applyArmorResistance(actor, value) {
    const armorMax = Checkbars.max(actor, 'armor');
    const armorCurrent = Checkbars.getCounterValue(actor, 'armor');
    const armor = Math.max(0, armorMax - armorCurrent);
    const armorReduction = Math.max(0, Math.min(Math.ceil(armor / 3), value));
    if (armorReduction > 0) {
      await Checkbars.addCounter(actor, 'armor', 1);
    }
    return armorReduction;
  }
}