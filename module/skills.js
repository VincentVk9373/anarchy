import { ANARCHY } from "./config.js";
import { ICONS_SKILLS_PATH, LOG_HEAD, SYSTEM_NAME, SYSTEM_PATH, TEMPLATE } from "./constants.js";
import { Misc } from "./misc.js";

export const HOOK_PROVIDE_SKILL_SET = "anarchy-provideSkillSet";

const SELECTED_SKILL_LIST = "selected-skill-list";
const SELECTED_SKILL_LIST_KEY = `${SYSTEM_NAME}.${SELECTED_SKILL_LIST}`;

const ATTR = TEMPLATE.attributes;

const ANARCHY_SKILLS = [
  { code: 'athletics', attribute: ATTR.strength, icon: `${ICONS_SKILLS_PATH}/athletics.svg` },
  { code: 'acrobatics', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/escape-artist.svg`, lang: 'fr' },
  { code: 'closeCombat', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/close-combat.svg` },
  { code: 'projectileWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/projectile-weapons.svg` },
  { code: 'firearms', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/firearms.svg` },
  { code: 'heavyWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/heavy-weapons.svg` },
  { code: 'vehicleWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/vehicle-weapons.svg` },
  { code: 'stealth', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/stealth.svg` },
  { code: 'pilotingGround', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/piloting-ground.svg` },
  { code: 'pilotingOther', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/piloting-other.svg` },
  { code: 'escapeArtist', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/escape-artist.svg`, lang: 'en' },
  { code: 'conjuring', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/conjuring.svg` },
  { code: 'sorcery', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/sorcery.svg` },
  { code: 'astralCombat', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/astral-combat.svg` },
  { code: 'survival', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/survival.svg` },
  { code: 'biotech', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/biotech.svg` },
  { code: 'hacking', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/hacking.svg` },
  { code: 'electronics', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/electronics.svg` },
  { code: 'engineering', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/engineering.svg` },
  { code: 'tasking', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/tasking.svg` },
  { code: 'tracking', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/tracking.svg` },
  { code: 'animals', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/animals.svg`, lang: 'fr' },
  { code: 'con', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/con-art.svg` },
  { code: 'etiquette', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/etiquette.svg`, lang: 'fr' },
  { code: 'intimidation', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/intimidation.svg` },
  { code: 'negotiation', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/negotiation.svg` },
  { code: 'disguise', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/disguise.svg`, lang: 'en' },
]

export class Skills {

  constructor() {
    game.system.anarchy.hooks.register(HOOK_PROVIDE_SKILL_SET);
    Hooks.on(HOOK_PROVIDE_SKILL_SET, provide => provide('shadowrun-anarchy-en', 'Shadowrun Anarchy EN', ANARCHY_SKILLS.filter(it => !it.lang || it.lang == 'en'), { lang: 'en' }));
    Hooks.on(HOOK_PROVIDE_SKILL_SET, provide => provide('shadowrun-anarchy-fr', 'Shadowrun Anarchy FR', ANARCHY_SKILLS.filter(it => !it.lang || it.lang == 'fr'), { lang: 'fr' }));
    Hooks.once('ready', () => this.onReady());
    Hooks.on('updateSetting', async (setting, update, options, id) => this.onUpdateSetting(setting, update, options, id));
    this.skillSets = {};
  }

  async onReady() {
    Hooks.callAll(HOOK_PROVIDE_SKILL_SET, (name, lang, skills, details) => {
      const skillSet = this._prepareSkillSet(name, lang, skills, details)
      if (skillSet) {
        this.skillSets[skillSet.id] = skillSet;
      }
    });

    const skillSetChoices = Object.fromEntries(Object.values(this.skillSets).map(e => [e.id, e.name]));
    game.settings.register(SYSTEM_NAME, SELECTED_SKILL_LIST, {
      scope: "world",
      name: game.i18n.localize(ANARCHY.settings.skillSet.name),
      hint: game.i18n.localize(ANARCHY.settings.skillSet.hint),
      config: true,
      default: 'shadowrun-anarchy-en',
      choices: skillSetChoices,
      type: String
    });
    this.selectedSkills = game.settings.get(SYSTEM_NAME, SELECTED_SKILL_LIST);
  }

  async onUpdateSetting(setting, update, options, id) {
    if (setting.key == SELECTED_SKILL_LIST_KEY) {
      this.selectedSkills = game.settings.get(SYSTEM_NAME, SELECTED_SKILL_LIST);
    }
  }

  getSkillLabels() {
    const selected = this.getSelectedSkillSet();
    return selected.skills.map(skill => { return { value: skill.code, label: skill.labelkey }; });
  }
  getSelectedSkillSet() {
    return this.skillSets[this.selectedSkills];
  }

  get(code) {
    return this.getSelectedSkillSet().skills.find(it => it.code == code);
  }

  _prepareSkillSet(id, name, skills, details) {
    const skillSet = mergeObject({ id: id, name: name, skills: skills }, details);
    if (this._validateSkillSet(skillSet)) {
      skillSet.skills.forEach(skill => {
        skill.labelkey = skill.labelkey ?? ANARCHY.skill[skill.code];
        skill.icon = skill.icon ?? `${SYSTEM_PATH}/icons/skills/skills.svg`;
      });
      return skillSet;
    }
    return undefined;
  }

  _validateSkillSet(skillSet) {
    function check(check, error = '') { if (!check) { throw error; } }

    try {
      check(skillSet.id && skillSet.name, `Skills list does not have an id or name`);
      const existing = this.skillSets[skillSet.id];
      check(!existing, `Skills list ${skillSet.id} is already registered under name ${existing?.name}`);
      check(Array.isArray(skillSet.skills), `Missing skills array`);
      skillSet.skills.forEach(skill => {
        check(skill.code, `Missing skill code for ${skill} in ${skillSet.id}`);
        check(skill.labelkey || ANARCHY.skill[skill.code], `Missing skill localization key for ${skill.code}`);
        check(skill.attribute, `Missing skill attribute for ${skill.code}`);
      });
      const skillCodes = skillSet.skills.map(it => it.code);
      check(skillSet.skills.length == Misc.distinct(skillCodes).length, `Duplicate skill codes in ${skillCodes}`)
      return true;
    }
    catch (error) {
      console.warn(error + (skillSet.id ? ` in list ${skillSet.id}` : ' in unidentified list'), skillSet);
      return false;
    }
  }

}