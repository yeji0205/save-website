/* Language switching, EN default.
 *
 * All translatable copy lives here — nowhere else. In the HTML, an element
 * carries data-i18n="key" and its text gets replaced from the table below.
 * Use data-i18n-html="key" instead when the string contains markup (<b>, <br>).
 *
 * The German is the authors' own translation, not a machine one — it is the
 * source of truth for DE copy, so re-translate nothing here. Note it treats
 * the Mother Tree as masculine ("ihn"/"er"), agreeing with "Mutterbaum",
 * where the English uses "her".
 */

export const STRINGS = {
  en: {
    tagline:
      "Finally, we land on Earth, ancient, forgotten, yet still breathing. " +
      "Plant the Mother Tree, She is our only hope. <br>" +
      "Protect her. Nurture her. Let her heal what we have broken. " +
      "Stand between her and the dark. " +
      "Can we bring the green back? <b>Can the Earth forgive us?</b>",
    about:
      "We are a couple that is working on this game and we really need your " +
      "valuable feedback. We would love to inform you when our first playtest " +
      "is ready where you can shape the game with us.",
    follow: "support and follow our development here",
    imprint: "Imprint",
    fullscreen: "Play the trailer fullscreen",
    discord: "Join the save Discord server",
    tiktok: "save on TikTok, @save.nature.game",
    youtube: "save on YouTube, @savegamesworld",
    steam: "save on Steam",

    /* ── Features ── */
    f1Title: "Plant the Mothertree<br>and Keep it alive",
    f1Text: "Everything begins with a seed.<br> Everything ends if it dies.",

    f2Title: "Manage Resources",
    f2Text:
      "Collect. Heal the area. Plant new trees.<br> " +
      "Feed the Mothertree, and the earth beneath it.",

    f3Title: "Fight what you broke",
    f3Text:
      "The earth remembers. Its creatures will come for you, and for the Mothertree.",

    f4Title: "Build your Base",
    f4Text: "As the Mothertree grows, it shelters you.",
  },

  de: {
    tagline:
      "Endlich kehren wir zur Erde zurück, zerstört, vergessen, aber noch " +
      "nicht verloren. Den Mutterbaum pflanzen ist unsere einzige " +
      "Hoffnung.<br>" +
      "Wir müssen ihn beschützen, uns um ihn kümmern und ihn heilen lassen, " +
      "was wir zerstört haben. Wir stehen an seiner Seite und halten das " +
      "Böse fern. Können wir die Natur zurückbringen? " +
      "<b>Wird die Erde uns vergeben?</b>",
    about:
      "Wir sind ein Paar, das an “Save” arbeitet, und sind sehr dankbar für " +
      "jedes Feedback. Sobald unser erster Playtest startet, würden wir dir " +
      "gerne Bescheid geben und du kannst mit uns das Spiel immer besser " +
      "machen.",
    follow: "Folge uns!",
    imprint: "Impressum",
    fullscreen: "Trailer im Vollbild abspielen",
    discord: "Tritt dem save Discord-Server bei",
    tiktok: "save auf TikTok, @save.nature.game",
    youtube: "save auf YouTube, @savegamesworld",
    steam: "save auf Steam",

    /* ── Features ── */
    f1Title: "Pflanze den Mutterbaum<br>und halte ihn am Leben",
    f1Text: "Alles startet mit einem Samen,<br>und alles endet, wenn er stirbt.",

    f2Title: "Bring die Natur ins Gleichgewicht",
    f2Text:
      "Sammle, heile Areale und pflanze neue Bäume,<br> " +
      "die den Mutterbaum und die Erde mit Leben füllen.",

    f3Title: "Kämpfe gegen das Vergessen",
    f3Text:
      "Aber die Erde vergisst nicht. Kreaturen werden sich gegen dich wehren.",

    f4Title: "Baue deine Basis",
    f4Text: "Wenn der Mutterbaum wächst, wird er zu deiner Unterkunft.",
  },
};

const STORAGE_KEY = "save-lang";

/** Swap every translatable string on the page to `lang`. */
export function setLanguage(lang) {
  const dict = STRINGS[lang] ?? STRINGS.en;

  document.documentElement.lang = lang;

  // Plain text nodes.
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const value = dict[el.dataset.i18n];
    if (value != null) el.textContent = value;
  }

  // Strings that contain markup. Safe here: the source is this file, not
  // user input.
  for (const el of document.querySelectorAll("[data-i18n-html]")) {
    const value = dict[el.dataset.i18nHtml];
    if (value != null) el.innerHTML = value;
  }

  // Accessible names for the icon-only buttons.
  for (const el of document.querySelectorAll("[data-i18n-label]")) {
    const value = dict[el.dataset.i18nLabel];
    if (value != null) el.setAttribute("aria-label", value);
  }

  // Highlight the active choice in the DE / EN switch.
  for (const btn of document.querySelectorAll("[data-lang]")) {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  }

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode / storage blocked — the switch still works, it just
       won't be remembered on the next visit. */
  }
}

/** Wire up the DE / EN buttons and apply the remembered choice. */
export function initLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }

  for (const btn of document.querySelectorAll("[data-lang]")) {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  }

  setLanguage(saved && STRINGS[saved] ? saved : "en");
}
