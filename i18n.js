/* Language switching, EN default.
 *
 * All translatable copy lives here — nowhere else. In the HTML, an element
 * carries data-i18n="key" and its text gets replaced from the table below.
 * Use data-i18n-html="key" instead when the string contains markup (<b>, <br>).
 *
 * The German was drafted by Claude and should be reviewed by a native speaker
 * before launch, especially the tagline, which is deliberately poetic.
 */

export const STRINGS = {
  en: {
    tagline:
      "Finally, we land on Earth, ancient, forgotten, yet still breathing.<br>" +
      "Plant the Mother Tree, She is our only hope. Protect her. Nurture her.<br> " +
      "Let her heal what we have broken.<br>" +
      "Stand between her and the dark.<br>" +
      "Can we bring the green back? <b>Can the Earth forgive us?</b>",
    about:
      "We are a couple that is working on this game and we really need your " +
      "valuable feedback. We would love to inform you when our first playtest " +
      "is ready where you can shape the game with us.",
    follow: "support and follow our development here",
    imprint: "Imprint",
    playVideo: "Play the trailer",
    discord: "Join the save Discord server",
    tiktok: "save on TikTok, @save.nature.game",
  },

  de: {
    tagline:
      "Endlich landen wir auf der Erde: uralt, vergessen und doch atmet sie " +
      "noch. Pflanze den Mutterbaum, sie ist unsere einzige Hoffnung.<br>" +
      "Beschütze sie. Nähre sie. Lass sie heilen, was wir zerstört haben. " +
      "Stell dich zwischen sie und die Dunkelheit. Können wir das Grün " +
      "zurückbringen? <b>Kann die Erde uns vergeben?</b>",
    about:
      "Wir sind ein Paar, das an diesem Spiel arbeitet, und wir brauchen " +
      "wirklich dein wertvolles Feedback. Wir möchten dich gerne " +
      "benachrichtigen, sobald unser erster Playtest bereit ist — dort kannst " +
      "du das Spiel gemeinsam mit uns gestalten.",
    follow: "unterstütze und verfolge unsere Entwicklung hier",
    imprint: "Impressum",
    playVideo: "Trailer abspielen",
    discord: "Tritt dem save Discord-Server bei",
    tiktok: "save auf TikTok, @save.nature.game",
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
