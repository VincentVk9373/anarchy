import { ErrorManager } from "../error-manager.js";
import { ANARCHY } from "../config.js";
import { AnarchyUsers } from "../users.js";
import { Icons } from "../icons.js";
import { HOOK_GET_HANDLEPAR_HELPERS } from "../handlebars-manager.js";
import { Enums } from "../enums.js";

const MONITORS = ANARCHY.actor.monitors;
const COUNTERS = ANARCHY.actor.counters;

export const CHECKBARS = {
  armor: {
    path: 'data.monitors.armor.value',
    max: it => it.data.data.monitors.armor.max,
    iconChecked: Icons.fontAwesome('fas fa-skull-crossbones'),
    iconUnchecked: Icons.fontAwesome('fas fa-shield-alt'),
    iconHit: Icons.fontAwesome('fas fa-bahai'),
    resource: MONITORS.armor
  },
  stun: {
    path: 'data.monitors.stun.value',
    max: it => it.data.data.monitors.stun.max,
    iconChecked: Icons.fontAwesome('fas fa-grimace'),
    iconUnchecked: Icons.fontAwesome('far fa-smile'),
    iconHit: Icons.fontAwesome('fas fa-bahai'),
    resource: MONITORS.stun,
    useArmor: true
  },
  physical: {
    path: 'data.monitors.physical.value',
    max: it => it.data.data.monitors.physical.max,
    iconChecked: Icons.fontAwesome('fas fa-heartbeat'),
    iconUnchecked: Icons.fontAwesome('far fa-heart'),
    iconHit: Icons.fontAwesome('fas fa-bahai'),
    resource: MONITORS.physical,
    useArmor: true
  },
  structure: {
    path: 'data.monitors.structure.value',
    max: it => it.data.data.monitors.structure.max,
    iconChecked: Icons.fontAwesome('fas fa-car-crash'),
    iconUnchecked: Icons.fontAwesome('fas fa-car-alt'),
    iconHit: Icons.fontAwesome('fas fa-bahai'),
    resource: MONITORS.structure
  },
  matrix: {
    path: 'data.monitors.matrix.value',
    max: it => it.data.data.monitors.matrix.max,
    iconChecked: Icons.fontAwesome('fas fa-laptop-medical'),
    iconUnchecked: Icons.fontAwesome('fas fa-laptop'),
    iconHit: Icons.fontAwesome('fas fa-laptop-code'),
    resource: MONITORS.matrix
  },
  marks: {
    path: undefined,
    max: it => 9,
    iconChecked: Icons.fontAwesome('fas fa-bookmark'),
    iconUnchecked: Icons.fontAwesome('far fa-bookmark'),
    iconHit: Icons.fontAwesome('fas fa-fingerprint'),
    resource: MONITORS.marks
  },
  anarchy: {
    path: 'data.counters.anarchy.value',
    max: it => it.data.data.counters.anarchy.max,
    iconChecked: Icons.iconSrc('style/anarchy-point.webp', 'checkbar-img'),
    iconUnchecked: Icons.iconSrc('style/anarchy-point-off.webp', 'checkbar-img'),
    resource: COUNTERS.anarchy
  },
  danger: {
    path: 'data.counters.anarchy.value',
    max: it => it.data.data.counters.anarchy.max,
    iconChecked: Icons.iconSrc('style/danger-point.webp', 'checkbar-img'),
    iconUnchecked: Icons.iconSrc('style/danger-point-off.webp', 'checkbar-img'),
    resource: COUNTERS.anarchy
  },
  sceneAnarchy: {
    path: 'data.counters.anarchy.value',
    max: it => (it.data.data.counters.sceneAnarchy.value + 1),
    iconChecked: Icons.iconSrc('style/anarchy-point-scene.webp', 'checkbar-img'),
    iconUnchecked: Icons.iconSrc('style/anarchy-point-off.webp', 'checkbar-img'),
    resource: COUNTERS.sceneAnarchy
  },
  edge: {
    path: 'data.counters.edge.value',
    max: it => it.data.data.attributes.edge.value,
    iconChecked: Icons.fontAwesome('fas fa-star'),
    iconUnchecked: Icons.fontAwesome('far fa-star'),
    resource: COUNTERS.edge
  },
}

export class Checkbars {

  static init() {
    Hooks.once(HOOK_GET_HANDLEPAR_HELPERS, () => Checkbars.registerHandleBarHelpers());
  }

  static registerHandleBarHelpers() {
    Handlebars.registerHelper('iconCheckbar', Checkbars.iconCheckbar);
    Handlebars.registerHelper('iconCheckbarHit', Checkbars.iconHit);
  }

  static iconCheckbar(monitor, checked) {
    return checked ? Checkbars.iconChecked(monitor) : Checkbars.iconUnchecked(monitor)
  }

  static iconChecked(monitor) {
    return CHECKBARS[monitor]?.iconChecked;
  }

  static iconUnchecked(monitor) {
    return CHECKBARS[monitor]?.iconUnchecked;
  }

  static iconHit(monitor) {
    return CHECKBARS[monitor]?.iconHit ?? CHECKBARS[monitor]?.iconChecked;
  }

  static useArmor(monitor) {
    return CHECKBARS[monitor]?.useArmor;
  }

  static newValue(index, checked) {
    return index + (checked ? 0 : 1);
  }
  static async switchMonitorCheck(target, monitor, index, checked, sourceActorId = undefined) {
    await Checkbars.setCounter(target, monitor, Checkbars.newValue(index, checked), sourceActorId)
  }

  static async setCounter(target, monitor, value, sourceActorId = undefined) {
    switch (monitor) {
      case 'marks':
        return await Checkbars.setActorMarks(target, value, sourceActorId);
      case 'anarchy':
        return await Checkbars.setAnarchy(target, value);
    }
    return await Checkbars.setCheckbar(target, monitor, value);
  }

  static async setCheckbar(target, monitor, value) {
    const checkbar = CHECKBARS[monitor];
    if (checkbar && checkbar.path) {
      ErrorManager.checkOutOfRange(checkbar.resource, value, 0, checkbar.max(target));
      await target.update({ [checkbar.path]: value });
    }
  }

  static async setAnarchy(target, newValue) {
    if (!target.hasOwnAnarchy()) {
      return;
    }

    if (target.hasGMAnarchy()) {
      await game.system.anarchy.gmAnarchy.setAnarchy(newValue);
      target.render();
      return;
    }

    const current = target.data.data.counters.anarchy.value;
    await Checkbars.setCheckbar(target, monitor, newValue);
    if (newValue < current) {
      await game.system.anarchy.gmAnarchy.actorGivesAnarchyToGM(target, current - newValue);
    }
    if (!game.user.isGM) {
      Checkbars.notifyAnarchyChange(target, current, newValue);
    }
  }

  static notifyAnarchyChange(target, current, newValue) {
    AnarchyUsers.blindMessageToGM({
      from: game.user.id,
      content: game.i18n.format(ANARCHY.gmManager.playerChangedAnarchy,
        {
          user: game.user.name,
          actor: target.name,
          from: current,
          to: newValue
        })
    });
  }

  static getActorMarks(target, sourceActorId) {
    return Checkbars._findActorMarks(target.data.data.monitors.matrix.marks, sourceActorId);
  }

  static async addActorMark(target, sourceActorId) {
    const previous = Checkbars._findActorMarks(target.data.data.monitors.matrix.marks, sourceActorId);
    Checkbars.setActorMarks(target, (previous.marks ?? 0) + 1, sourceActorId);
  }

  static async setActorMarks(target, value, sourceActorId) {
    if (target.canReceiveMarks()) {
      let targetMarks = deepClone(target.data.data.monitors.matrix.marks);
      ErrorManager.checkOutOfRange(CHECKBARS.marks.resource, value, 0, CHECKBARS.marks.max(target));
      const sourceActorMarks = Checkbars._findActorMarks(targetMarks, sourceActorId);
      if (sourceActorMarks.marks == undefined) {
        targetMarks.push(sourceActorMarks);
      }
      sourceActorMarks.marks = Math.max(0, value);
      await target.update({ ['data.monitors.matrix.marks']: targetMarks.filter(target => target.marks > 0) });
    }
  }

  static _findActorMarks(marks, sourceActorId) {
    return marks.find(source => source.actorId == sourceActorId) ?? { actorId: sourceActorId };
  }
}