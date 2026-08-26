/* save — landing page. */

import { applyGrain } from "./grain.js";
import { initLanguage } from "./i18n.js";

/* Background grain. To tune it, edit the GRAIN defaults in grain.js.
   Overall strength stays in style.css as --grain-opacity. */
applyGrain();

/* DE / EN switch. All copy lives in i18n.js. */
initLanguage();

/* The trailer needs no JS. It is a self-hosted <video> with native controls,
   so play, pause, scrubbing and volume are the browser's job. The sound
   toggle and the fade-in that used to hide YouTube's boot-up chrome went
   with the embed. */
