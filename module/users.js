import { ANARCHY } from "./config.js";
import { Misc } from "./misc.js";
import { RemoteCall } from "./remotecall.js";

const BLIND_MESSAGE_TO_GM = 'Users.blindMessageToGM';

export class AnarchyUsers {

  static init() {
    RemoteCall.register(BLIND_MESSAGE_TO_GM, {
      callback: data => AnarchyUsers.blindMessageToGM(data),
      condition: user => user.isGM
    })
  }


  static blindMessageToGM(message) {
    if (!RemoteCall.call(BLIND_MESSAGE_TO_GM, message)) {
      ChatMessage.create({
        user: message.user,
        whisper: ChatMessage.getWhisperRecipients('GM'),
        blind: true,
        content: game.i18n.format(ANARCHY.chat.blindMessageToGM, {
          user: game.user.name,
          message: message.content
        })
      });
    }
  }

  static getUsers(filter = user => true) {
    return (game.version ? game.users : game.users.entities).filter(filter);
  }

  static oneGM() {
    return AnarchyUsers.getUsers(u => u.isGM).at(0);
  }

  static firstConnectedGM() {
    return AnarchyUsers.getUsers(u => u.isGM && u.active).sort(Misc.ascending(u => u.id)).at(0);
  }

  /**
   * @returns true pour un seul utilisateur: le premier GM connecté par ordre d'id
   */
  static isUniqueConnectedGM(user = game.user) {
    return user.id == AnarchyUsers.firstConnectedGM()?.id;
  }
  static getTargets(user) {
    const targets = [];
    user.targets.forEach(element => targets.push(element));
    return targets;
  }
}