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
    playVideo: "Play the trailer",
    discord: "Join the save Discord server",
    tiktok: "save on TikTok, @save.nature.game",
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
    steam: "save auf Steam",

    /* ── Features ──
       TODO: my translations of the new English copy — please check the
       wording. "sie" for the Mother Tree follows the tagline above, which
       already treats her as feminine even though "Mutterbaum" is masculine;
       switch both to "ihn"/"er" if you would rather it agree grammatically. */
    f1Title: "Pflanze den Mutterbaum<br>und halte sie am Leben",
    f1Text: "Alles beginnt mit einem Samen. Alles endet, wenn er stirbt.",

    f2Title: "Verwalte Ressourcen",
    f2Text:
      "Sammle. Heile das Land. Pflanze neue Bäume.<br> " +
      "Nähre den Mutterbaum und die Erde unter ihr.",

    f3Title: "Kämpfe gegen das, was du zerstört hast",
    f3Text:
      "Die Erde erinnert sich. Ihre Kreaturen werden dich holen — und den Baum.",

    f4Title: "Baue deine Basis",
    f4Text: "Während der Mutterbaum wächst, schenkt sie dir Schutz.",
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
