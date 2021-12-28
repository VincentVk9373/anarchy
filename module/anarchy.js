import { HandlebarsManager } from "./handlebars-manager.js";
import { HooksManager } from "./hooks-manager.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


HooksManager.initialize();
HandlebarsManager.register();

