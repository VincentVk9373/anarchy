import { Damage } from "./damage.js";
import { Enums } from "./enums.js";
import { Grammar } from "./grammar.js";
import { Icons } from "./icons.js";
import { Weapon } from "./item/weapon.js";
import { Misc } from "./misc.js";


export const HOOK_GET_HANDLEPAR_PARTIALS = "anarchy-getHandlebarPartials";
export const HOOK_GET_HANDLEPAR_HELPERS = "anarchy-getHandlebarHelpers";

const HBS_PARTIAL_TEMPLATES = [
  // -- monitors
  'systems/anarchy/templates/actor/monitors/anarchy.hbs',
  'systems/anarchy/templates/actor/monitors/armor.hbs',
  'systems/anarchy/templates/actor/monitors/edge.hbs',
  'systems/anarchy/templates/actor/parts/matrix-cyberdeck.hbs',
  'systems/anarchy/templates/common/matrix.hbs',
  'systems/anarchy/templates/actor/monitors/physical.hbs',
  'systems/anarchy/templates/actor/monitors/structure.hbs',
  'systems/anarchy/templates/actor/monitors/stun.hbs',
  // character
  'systems/anarchy/templates/actor/character/capacity.hbs',
  'systems/anarchy/templates/actor/character/essence.hbs',
  'systems/anarchy/templates/actor/character/genre.hbs',
  'systems/anarchy/templates/actor/character/karma.hbs',
  'systems/anarchy/templates/actor/character/metatype.hbs',
  // character parts
  'systems/anarchy/templates/actor/parts/words.hbs',
  'systems/anarchy/templates/actor/parts/contact.hbs',
  'systems/anarchy/templates/actor/parts/contacts.hbs',
  'systems/anarchy/templates/actor/parts/gear.hbs',
  'systems/anarchy/templates/actor/parts/gears.hbs',
  // actor common
  'systems/anarchy/templates/actor/parts/attributebutton.hbs',
  'systems/anarchy/templates/actor/parts/attributebuttons.hbs',
  'systems/anarchy/templates/actor/parts/attribute.hbs',
  'systems/anarchy/templates/actor/parts/attributes.hbs',
  'systems/anarchy/templates/actor/parts/description.hbs',
  'systems/anarchy/templates/actor/parts/gmnotes.hbs',
  'systems/anarchy/templates/actor/parts/owned-actor.hbs',
  'systems/anarchy/templates/actor/parts/owned-actors.hbs',
  'systems/anarchy/templates/actor/parts/ownership.hbs',
  'systems/anarchy/templates/actor/parts/qualities.hbs',
  'systems/anarchy/templates/actor/parts/quality.hbs',
  'systems/anarchy/templates/actor/parts/shadowamp.hbs',
  'systems/anarchy/templates/actor/parts/shadowamps.hbs',
  'systems/anarchy/templates/actor/parts/cyberdeck.hbs',
  'systems/anarchy/templates/actor/parts/cyberdecks.hbs',
  'systems/anarchy/templates/actor/parts/skill.hbs',
  'systems/anarchy/templates/actor/parts/skills.hbs',
  'systems/anarchy/templates/actor/parts/weapon-range.hbs',
  'systems/anarchy/templates/actor/parts/weapon.hbs',
  'systems/anarchy/templates/actor/parts/weapons.hbs',
  //-- NPC
  'systems/anarchy/templates/actor/npc-parts/quality.hbs',
  'systems/anarchy/templates/actor/npc-parts/qualities.hbs',
  'systems/anarchy/templates/actor/npc-parts/shadowamp.hbs',
  'systems/anarchy/templates/actor/npc-parts/shadowamps.hbs',
  'systems/anarchy/templates/actor/npc-parts/skill.hbs',
  'systems/anarchy/templates/actor/npc-parts/skills.hbs',
  'systems/anarchy/templates/actor/npc-parts/weapon.hbs',
  'systems/anarchy/templates/actor/npc-parts/weapons.hbs',
  // Vehicles
  'systems/anarchy/templates/actor/vehicle/vehicle-attributes.hbs',
  'systems/anarchy/templates/actor/vehicle/vehicle-category.hbs',
  'systems/anarchy/templates/actor/vehicle/vehicle-skill.hbs',
  // item
  'systems/anarchy/templates/item/parts/inactive.hbs',
  'systems/anarchy/templates/item/parts/itemname.hbs',
  'systems/anarchy/templates/item/parts/references.hbs',
  // common&technical partials
  'systems/anarchy/templates/common/anarchy-bar.hbs',
  'systems/anarchy/templates/common/check-element.hbs',
  'systems/anarchy/templates/common/checkbar.hbs',
  'systems/anarchy/templates/common/damage-code.hbs',
  'systems/anarchy/templates/common/enum-value-label.hbs',
  'systems/anarchy/templates/common/item-control-add.hbs',
  'systems/anarchy/templates/common/item-controls.hbs',
  // dialogs
  'systems/anarchy/templates/dialog/roll-modifier.hbs',
  // apps
  'systems/anarchy/templates/app/gm-anarchy.hbs',
  'systems/anarchy/templates/app/gm-difficulty.hbs',
  'systems/anarchy/templates/app/gm-difficulty-buttons.hbs',
];

export class HandlebarsManager {

  constructor() {
    game.system.anarchy.hooks.register(HOOK_GET_HANDLEPAR_PARTIALS);
    game.system.anarchy.hooks.register(HOOK_GET_HANDLEPAR_HELPERS);
    Hooks.once(HOOK_GET_HANDLEPAR_PARTIALS, list => HBS_PARTIAL_TEMPLATES.forEach(tpl => list.push(tpl)));
    Hooks.once(HOOK_GET_HANDLEPAR_HELPERS, () => this.registerBasicHelpers());
    Hooks.once('ready', () => this.onReady());
  }

  async onReady() {
    let partials = [];
    Hooks.callAll(HOOK_GET_HANDLEPAR_HELPERS);
    Hooks.off(HOOK_GET_HANDLEPAR_HELPERS, () => { });
    Hooks.callAll(HOOK_GET_HANDLEPAR_PARTIALS, partials);
    Hooks.off(HOOK_GET_HANDLEPAR_PARTIALS, () => { });
    await loadTemplates(Misc.distinct(partials));
  }

  registerBasicHelpers() {
    Handlebars.registerHelper('concat', (...args) => Misc.join(args.slice(0, -1)));
    Handlebars.registerHelper('substring', (str, from, to) => str?.substring(from, to));
    Handlebars.registerHelper('toUpperCase', Grammar.toUpperCaseNoAccent);
    Handlebars.registerHelper('damageLetter', Damage.letter);
    Handlebars.registerHelper('damageCode', Weapon.getDamageCode);
    Handlebars.registerHelper('damageValue', Weapon.getDamageValue);
    Handlebars.registerHelper('skillValue', (actor, skillId) => actor.getSkillValue(skillId, false));
    Handlebars.registerHelper('specializationValue', (actor, skillId) => actor.getSkillValue(skillId, true));
    Handlebars.registerHelper('for', HandlebarsManager.hbsForLoop);
    Handlebars.registerHelper('modulo', (value, divisor) => value % divisor);
    Handlebars.registerHelper('divint', Misc.divint);
    Handlebars.registerHelper('divup', Misc.divup);
    Handlebars.registerHelper('sum', (v1, v2) => v1 + v2);
    Handlebars.registerHelper('diff', (v1, v2) => v1 - v2);
    Handlebars.registerHelper('either', (a, b) => a ? a : b);
    Handlebars.registerHelper('isInteger', a => a !== undefined && Number.isInteger(a));
    Handlebars.registerHelper('actorAttribute', (actor, attribute) => actor.getAttributeValue(attribute));
    Handlebars.registerHelper('localizeAttribute', Enums.localizeAttribute);
    Handlebars.registerHelper('iconFA', Icons.fontAwesome);
    Handlebars.registerHelper('iconSrc', Icons.iconSrc);
    Handlebars.registerHelper('iconD6', Icons.iconD6);
  }

  static hbsForLoop(start, end, options) {
    let accum = '';
    for (let i = start; i < end; ++i) {
      accum += options.fn(i);
    }
    return accum;
  }
}