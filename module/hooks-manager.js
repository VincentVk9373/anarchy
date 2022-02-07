import { LOG_HEAD, SYSTEM_NAME } from "./constants.js";

export const ANARCHY_HOOKS = {
  /**
   * Hook to declare template data migrations
   */
  DECLARE_MIGRATIONS: 'anarchy-declareMigration',
  /**
   * Hook used to declare additional styles available
   */
  REGISTER_STYLES: 'anarchy-registerStyles',
  /**
   * Hook allowing to register additional roll parameters
   */
  REGISTER_ROLL_PARAMETERS: 'anarchy-registerRollParameters',
  /**
   * Hook allowing to modify some parameters (from Anarchy hacks modules).
   * Setting property ignore=true allows to remove the parameter.
   */
  MODIFY_ROLL_PARAMETER: 'anarchy-forbidRollParameter',
  /**
   * @deprecated will be removed before v1.0.0
   */
  LOAD_STYLES: 'anarchy-loadStyles',
  /**
   * Hook allowing to provide alternate skill sets for Anarchy hack modules
   */
  PROVIDE_SKILL_SET: 'anarchy-provideSkillSet',

  /**
   * Hook allowing to provide alternate way to apply damages for Anarchy hack modules
   */
  PROVIDE_DAMAGE_MODE: 'anarchy-provideDamageMode',

  /**
   * Hook called to provide additional Handlebars partial templates
   * TODO:
   *  - refactor hook to provide a registration method instead of the list of partials?
   *  - simply replace by loading the template where needed (in onReady hook)?
   * @deprecated will be removed/refactored before v1.0.0
   */
  GET_HANDLEPAR_PARTIALS: 'anarchy-getHandlebarPartials',
  /**
   * Hook called to register Handlebars helpers
   * TODO:
   * - refactor hook to provide a registration method instead of the list of helpers?
   * - simply replace by registering the helpers where needed (in onReady hook)?
   * @deprecated will be removed/refactored before v1.0.0
   */
  GET_HANDLEPAR_HELPERS: 'anarchy-getHandlebarHelpers',
}

export class HooksManager {
  constructor() {
    this.hooks = [];
  }

  static instance() {
    return game.system.anarchy.hooks;
  }

  static register(name) {
    HooksManager.instance()._register(name);
  }

  _register(name) {
    console.log(LOG_HEAD + 'HooksManager.register', name);
    if (!name.startsWith(SYSTEM_NAME + '-')) {
      throw "For safety Anarchy Hooks names must be prefixed by anarchy'-'"
    }
    this.hooks.push(name);
  }

}