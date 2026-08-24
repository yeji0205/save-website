/* save — landing page. */

import { applyGrain } from "./grain.js";
import { initLanguage } from "./i18n.js";

/* Background grain. To tune it, edit the GRAIN defaults in grain.js.
   Overall strength stays in style.css as --grain-opacity. */
applyGrain();

/* DE / EN switch. All copy lives in i18n.js. */
initLanguage();

/* Play button.
 *
 * Right now .video__media is a still image standing in for the trailer, so
 * there is nothing to play and the button stays hidden-but-harmless. Once
 * the <img> is swapped for a <video> in index.html, this wires the button to
 * it with no further changes. */
(function initVideo() {
  const button = document.querySelector(".video__play");
  const media = document.querySelector(".video__media");
  if (!button || !media) return;

  const isVideo = media.tagName === "VIDEO";

  if (!isVideo) {
    // Placeholder mode: keep the button visible for layout, but make clear
    // it does nothing yet rather than silently failing.
    button.disabled = true;
    button.style.cursor = "default";
    return;
  }

  button.addEventListener("click", () => {
    media.controls = true;
    media.play();
    button.hidden = true;
  });
})();
