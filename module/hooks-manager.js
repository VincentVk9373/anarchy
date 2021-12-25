import { SRACharacter } from './actor/character.js'
import { SRACharacterSheet } from './actor/character-sheet.js';
import { SRA } from './config.js';
import { SYSTEM_NAME } from './constants.js';
import { HandlebarsManager } from './handlebars-manager.js';
import { SRABaseItemSheet } from './item/base-item-sheet.js';
import { SRASkillSheet } from './item/skill-item-sheet.js';
import { SRABaseItem } from './item/base-item.js';
import { Enums } from './enums.js';
import { GMManager } from './app/gm-manager.js';
import { RemoteCall } from './remotecall.js';
import { Users } from './users.js';
import { GMAnarchy } from './app/gm-anarchy.js';
import { GMDifficulty } from './app/gm-difficulty.js';
import { SRANPCSheet } from './actor/npc-sheet.js';

export class HooksManager {

  static register() {
    console.log('Shadowrun Anarchy | Registering system hooks');
    Hooks.once('init', HooksManager.onInit);
    Hooks.once('ready', async () => await HooksManager.onReady());
  }

  static async onInit() {
    console.log('Shadowrun Anarchy | onInit | loading system');
    game.system.sra = {
      SRACharacter
    };
    CONFIG.Actor.documentClass = SRACharacter;
    CONFIG.Item.documentClass = SRABaseItem;
    CONFIG.Combat.initiative = { formula: "2d6" }

    console.log('Shadowrun Anarchy | ', game.i18n.localize(SRA.actor.characterSheet));
    console.log('Shadowrun Anarchy | ', game.i18n.localize(SRA.item.sheet));

    CONFIG.SRA = SRA;

    Enums.registerEnums();
    HooksManager.registerSheets();


    // initialize remote calls registry first
    RemoteCall.init();
    Users.init();
    GMAnarchy.init();
    GMDifficulty.init();
    GMManager.init();
    SRABaseItem.init();
    await HandlebarsManager.init();
    console.log('Shadowrun Anarchy | init done');
  }

  static async onReady() {
    GMManager.create();
  }

  static registerSheets() {
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet(SYSTEM_NAME, SRACharacterSheet, {
      label: game.i18n.localize(SRA.actor.characterSheet),
      makeDefault: true,
      types: ['character']
    });
    Actors.registerSheet(SYSTEM_NAME, SRANPCSheet, {
      label: game.i18n.localize(SRA.actor.npcSheet),
      makeDefault: false,
      types: ['character']
    });

    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet(SYSTEM_NAME, SRABaseItemSheet, {
      types: ["metatype", "quality", "shadowamp", "weapon", "gear", "contact"],
      makeDefault: true
    });
    Items.registerSheet(SYSTEM_NAME, SRASkillSheet, {
      types: ["skill"],
      makeDefault: true
    });
  }
}