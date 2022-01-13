import { ANARCHY } from "../config.js";
import { SYSTEM_NAME, TEMPLATE } from "../constants.js";
import { ErrorManager } from "../error-manager.js";
import { RemoteCall } from "../remotecall.js";

const GM_ANARCHY = "anarchy-gm";
const GM_SCENE_ANARCHY = "scene-anarchy-gm";
const GM_ADD_ANARCHY = 'GMAnarchy.addAnarchy';

export class GMAnarchy {

  constructor() {
    game.settings.register(SYSTEM_NAME, GM_ANARCHY, {
      scope: "world",
      config: false,
      default: 1,
      type: Number
    });
    game.settings.register(SYSTEM_NAME, GM_SCENE_ANARCHY, {
      scope: "world",
      config: false,
      default: 1,
      type: Number
    });

    RemoteCall.register(GM_ADD_ANARCHY, {
      callback: data => game.system.anarchy.gmAnarchy.addAnarchy(data),
      condition: user => user.isGM
    });
    this.anarchy = game.settings.get(SYSTEM_NAME, GM_ANARCHY);
    this.sceneAnarchy = game.settings.get(SYSTEM_NAME, GM_SCENE_ANARCHY);
  }

  getAnarchy() {
    return {
      isGM: true,
      value: this.anarchy,
      max: this.anarchy + 1,
      scene: this.sceneAnarchy
    }
  }

  async actorGivesAnarchyToGM(actor, count) {
    if (count > 0) {
      ChatMessage.create({
        user: game.user,
        whisper: ChatMessage.getWhisperRecipients('GM'),
        content: game.i18n.format(ANARCHY.gmManager.gmReceivedAnarchy,
          {
            anarchy: count,
            actor: actor.name
          })
      });
      await this.addAnarchy(count);
    }
  }

  async npcConsumesAnarchy(actor, count) {
    await this.addAnarchy(-count);
  }

  async addAnarchy(count) {
    if (!RemoteCall.call(GM_ADD_ANARCHY, count)) {
      ErrorManager.checkSufficient(ANARCHY.actor.counters.danger, -count, this.anarchy);
      await this.setAnarchy(TEMPLATE.monitors.anarchy, this.anarchy + count);
    }
  }

  async setAnarchy(monitor, newAnarchy) {
    this.anarchy = newAnarchy;
    const setting = monitor == TEMPLATE.monitors.sceneAnarchy ? GM_SCENE_ANARCHY : GM_ANARCHY;
    game.settings.set(SYSTEM_NAME, setting, newAnarchy);
    await this._rebuild();
    this._syncGMAnarchySheets();
  }

  async activateListeners(html) {
    this.toolbar = html.find(".gm-anarchy-bar");
    await this._rebuild();
  }

  async _rebuild() {
    this.toolbar.find('.checkbar-root').replaceWith(await this._renderBar());
    this.toolbar.find('a.click-checkbar-element').click(async (event) => await this._onClickAnarchyCheckbar(event));
  }

  async _onClickAnarchyCheckbar(event) {
    const current = $(event.currentTarget);
    const index = Number.parseInt(current.attr('data-index'));
    const isChecked = current.attr('data-checked') == 'true';
    const newAnarchy = index + (isChecked ? 0 : 1);

    await this.setAnarchy(newAnarchy);
  }

  async _renderBar() {
    return await renderTemplate("systems/anarchy/templates/monitors/anarchy-bar.hbs", {
      code: 'danger',
      rowlength: 6,
      value: this.getAnarchy().value,
      max: this.getAnarchy().max,
      scene: this.getAnarchy().scene,
      labelkey: ANARCHY.actor.counters.danger
    });
  }

  _syncGMAnarchySheets() {
    for (let actor of game.actors) {
      this._syncNPCSheetAnarchy(actor);
    }
    for (let token of game.canvas.tokens.documentCollection.values()) {
      if (token.actor && !token.data.actorLink) {
        this._syncNPCSheetAnarchy(token.actor);
      }
    }
  }

  _syncNPCSheetAnarchy(actor) {
    if (!actor.hasPlayerOwner) {
      actor.render();
    }
  }
}