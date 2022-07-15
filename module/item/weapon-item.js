import { ICONS_PATH, TEMPLATE, TEMPLATES_PATH } from "../constants.js";
import { ANARCHY } from "../config.js";
import { Enums } from "../enums.js";
import { AnarchyBaseItem } from "./anarchy-base-item.js";
import { Checkbars } from "../common/checkbars.js";
import { AnarchyUsers } from "../users.js";
import { ROLL_PARAMETER_CATEGORY } from "../roll/roll-parameters.js";
import { ANARCHY_HOOKS } from "../hooks-manager.js";

const AREA_TARGETS = {
  none: { targets: 1, adjust: [0] },
  shotgun: { targets: 2, adjust: [0, -2] },
  circle: { targets: undefined },
  cone: { targets: undefined },
  rect: { targets: undefined },
  ray: { targets: undefined },
}

// weapon range
const WEAPON_RANGE_PARAMETER = {
  code: 'weapon-range',
  options: {
    flags: { editable: true, },
    order: 20, category: ROLL_PARAMETER_CATEGORY.pool,
    labelkey: ANARCHY.common.roll.modifiers.weaponRange,
    hbsTemplateRoll: `${TEMPLATES_PATH}/roll/parts/select-option.hbs`,
    hbsTemplateChat: undefined, //``
  },
  condition: context => context.weapon,
  factory: context => {
    const ranges = context.weapon.getRanges();
    return {
      value: ranges[0].value,
      choices: ranges,
      selected: game.i18n.localize(ranges[0].labelkey)
    }
  }
}
const WEAPON_AREA_PARAMETER = {
  code: 'weapon-area',
  options: {
    flags: { used: true, },
    order: 20, category: ROLL_PARAMETER_CATEGORY.pool,
    labelkey: ANARCHY.common.roll.modifiers.weaponArea,
    hbsTemplateRoll: `${TEMPLATES_PATH}/roll/parts/input-numeric.hbs`,
    hbsTemplateChat: undefined, //``
  },
  condition: context => context.weapon && context.weapon.getArea() != TEMPLATE.area.none,
  factory: context => {
    const countTargets = context.targeting.targetedTokenIds?.length ?? 1;
    return {
      value: context.weapon.getAreaModifier(countTargets),
      flags: { used: countTargets > 1 },
    }
  }
}

export class WeaponItem extends AnarchyBaseItem {

  static init() {
    Hooks.once(ANARCHY_HOOKS.REGISTER_ROLL_PARAMETERS, register => {
      register(WEAPON_AREA_PARAMETER);
      register(WEAPON_RANGE_PARAMETER);
    });
  }

  static get defaultIcon() {
    return `${ICONS_PATH}/weapons/mac-10.svg`;
  }

  isWeaponSkill(item) {
    return item.type == 'skill' && item.system.code === this.system.skill;
  }

  getDefense() {
    return this.system.defense;
  }

  getDamage() {
    if (!this.parent) {
      return undefined;
    }
    const damageAttributeValue = this.system.damageAttribute
      ? (this.parent.getAttributeValue(this.system.damageAttribute) ?? 0)
      : 0;
    return {
      value: WeaponItem.damageValue(
        this.system.monitor,
        this.system.damage,
        this.system.damageAttribute,
        damageAttributeValue
      ),
      monitor: this.system.monitor,
      noArmor: this.system.noArmor,
      armorMode: WeaponItem.armorMode(this.system.monitor, this.system.noArmor)
    }
  }

  static damageValue(monitor, damage, damageAttribute, actorAttribute) {
    if (monitor == TEMPLATE.monitors.marks) {
      return 1;
    }
    damage = Number(damage);
    if (damageAttribute) {
      if (actorAttribute !== undefined) {
        damage = damage + Math.ceil(Number(actorAttribute) / 2);
      }
      else {
        console.warn('Weapon not attached to an actor');
        return game.i18n.localize(ANARCHY.item.weapon.weaponWithoutActor);
      }
    }
    return damage;
  }

  getDamageCode() {
    return WeaponItem.damageCode(
      this.system.monitor,
      this.system.damage,
      this.system.damageAttribute,
    );
  }

  static damageCode(monitor, damage, damageAttribute) {
    if (monitor == TEMPLATE.monitors.marks) {
      return '1';
    }
    let code = '';
    if (damageAttribute && ANARCHY.attributes[damageAttribute]) {
      code += game.i18n.localize(ANARCHY.attributes[damageAttribute]).substring(0, 3).toUpperCase() + '/2 + ';
    }
    code += String(damage);
    return code;
  }

  static armorMode(monitor, noArmor) {
    if (Checkbars.useArmor(monitor)) {
      return noArmor ? 'noArmor' : 'withArmor'
    }
    return '';
  }

  getRanges() {
    let ranges = [
      this._getRange('short'),
    ]
    if (this.system.range.max != 'short') {
      ranges.push(this._getRange('medium'));
    }
    if (this.system.range.max == 'long') {
      ranges.push(this._getRange('long'));
    }
    return ranges
  }

  _getRange(range) {
    return { value: this.system.range[range], labelkey: Enums.getFromList(Enums.getEnums().ranges, range) };
  }

  prepareShortcut() {
    return {
      img: this.img,
      label: this.name,
      callback: token => token.actor.rollWeapon(this)
    };
  }

  validateTargets(actor) {
    const targets = AnarchyUsers.getTargets(game.user);
    if (targets.length == 0) {
      ui.notifications.info(game.i18n.format(ANARCHY.common.errors.noTargetSelected, {
        weapon: this.name ?? game.i18n.localize(ANARCHY.itemType.singular.weapon)
      }));
    }
    else {
      this.checkWeaponTargets(targets);
      // TODO: could check LOS, distance? ...
    }
    return targets;
  }

  checkWeaponTargets(targets) {
    const area = this.system.area;
    const areaTargets = AREA_TARGETS[area] ?? {};
    if (areaTargets.targets && targets.length > areaTargets.targets) {
      const error = game.i18n.format(ANARCHY.common.errors.maxTargetsExceedeed, {
        weapon: this.name,
        area: game.i18n.localize(ANARCHY.area[area]),
        count: targets.length,
        max: areaTargets.targets
      });
      ui.notifications.error(error);
      throw error;
    }
  }

  getAreaModifier(countTargets) {
    const area = this.getArea();
    const areaTargets = AREA_TARGETS[area] ?? {};
    if (areaTargets.targets && areaTargets.adjust && countTargets <= areaTargets.targets) {
      return areaTargets.adjust[countTargets - 1] ?? 0;
    }
    return 0;
  }

  getArea() {
    if (this.system.area == '') {
      return TEMPLATE.area.none;
    }
    return this.system.area ?? TEMPLATE.area.none;
  }
}