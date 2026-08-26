/* save — landing page. */

import { applyGrain } from "./grain.js";
import { initLanguage } from "./i18n.js";

/* Background grain. To tune it, edit the GRAIN defaults in grain.js.
   Overall strength stays in style.css as --grain-opacity. */
applyGrain();

/* DE / EN switch. All copy lives in i18n.js. */
initLanguage();

/* The trailer plays itself — autoplay, muted, looping, native controls. The
 * only JS it needs is fullscreen on tap for phones.
 *
 * Why a button rather than a click handler on the <video>: playsinline is
 * required for the muted autoplay loop, and it is precisely what stops iOS
 * fullscreening by itself, so the tap has to ask. The button also sits clear
 * of the control bar, so tapping play or volume does not fire it. */
(function initFullscreenTap() {
  const video = document.querySelector(".video__media");
  const expand = document.querySelector(".video__expand");
  if (!video || !expand) return;

  expand.addEventListener("click", () => {
    /* iOS Safari does not implement requestFullscreen on arbitrary elements —
     * only this older video-specific call, which opens the native player. */
    if (typeof video.webkitEnterFullscreen === "function") {
      video.webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {
        /* Refused (rare, e.g. a permissions policy). Leave the page as it is
           rather than failing loudly — the video keeps playing inline. */
      });
    }
  });
})();
