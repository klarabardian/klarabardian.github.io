/* ===================================================================
   site.js  ·  WSPÓLNA LOGIKA STRONY
   -------------------------------------------------------------------
   Ten plik:
     • buduje pasek nawigacji i stopkę (żebyś nie musiała ich
       przepisywać na każdej podstronie)
     • obsługuje przełączanie języka EN / PL
     • wypełnia kafelki (prace / filmy / game design) danymi z data.js
     • buduje podstronę pojedynczego projektu

   Każda podstrona HTML na końcu wywołuje jedną funkcję, np.:
       initListPage('artworks', ARTWORKS);
   i to wystarczy, żeby zbudować całą stronę.
   =================================================================== */

/* -------------------------------------------------------------------
   JĘZYK — odczyt / zapis. Domyślnie angielski (EN).
   Zapamiętujemy wybór w przeglądarce (localStorage), żeby po przejściu
   na inną podstronę język się nie resetował.
   ------------------------------------------------------------------- */
function getLang() {
  return localStorage.getItem("zkb-lang") || "en";
}
function setLang(lang) {
  localStorage.setItem("zkb-lang", lang);
  location.reload(); // przeładuj stronę, żeby teksty zmieniły się na nowy język
}
// skrót do tłumaczeń: t('nav_bio') zwróci napis w aktualnym języku
function t(key) {
  return I18N[getLang()][key];
}

/* Pomocnik: zwraca wartość pola w aktualnym języku.
   Pole może być zwykłym tekstem ("Bouquet") ALBO obiektem {en, pl}.
   Dzięki temu np. tytuł pracy można — ale nie trzeba — tłumaczyć. */
function tr(field) {
  if (field && typeof field === "object") {
    return field[getLang()] || field.en || "";
  }
  return field || "";
}

/* Pomocnik: buduje LOGO (tekst albo plik wektorowy) — patrz SITE.logo w data.js.
   className pozwala użyć tego samego logo na pasku i na stronie startowej. */
function logoHTML(className) {
  const inner =
    SITE.logo && SITE.logo.image
      ? `<img class="logo-img" src="${SITE.logo.image}" alt="${SITE.logoAlt || ""}"` +
        (SITE.logo.width ? ` style="width:${SITE.logo.width}px"` : "") +
        `>`
      : SITE.logo;
  return `<a class="${className}" href="index.html">${inner}</a>`;
}

/* Pomocnik: ujednolica zdjęcie do postaci { src, photo }.
   Zdjęcie w data.js może być tekstem "plik.jpg" ALBO { src, photo }. */
function imgEntry(entry) {
  if (entry && typeof entry === "object") {
    return { src: entry.src || "", photo: entry.photo || "" };
  }
  return { src: entry || "", photo: "" };
}

/* Pomocnik: buduje <figure> ze zdjęciem i — jeśli jest fotograf —
   podpisem widocznym po najechaniu kursorem ("fot. / photo by"). */
function photoFigure(entry, alt, figClass, lazy) {
  const o = imgEntry(entry);
  if (!o.src) return "";
  const credit = o.photo
    ? `<figcaption class="photo-credit">${t("photo_by")} ${o.photo}</figcaption>`
    : "";
  return (
    `<figure class="photo ${figClass || ""}${o.photo ? " has-credit" : ""}">` +
    `<img src="${o.src}" alt="${alt}"${lazy ? ' loading="lazy"' : ""}>` +
    credit +
    `</figure>`
  );
}

/* -------------------------------------------------------------------
   IKONY SOCIAL MEDIA (wpisane tutaj, żeby ładnie zmieniały kolor)
   ------------------------------------------------------------------- */
const SOCIAL_SVG = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.6 6.8 12 12.3l8.4-5.5"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7.2" y1="10.5" x2="7.2" y2="16.5"/><circle cx="7.2" cy="7.3" r="0.6" fill="currentColor" stroke="none"/><path d="M11 16.5v-3.4a2 2 0 0 1 4 0v3.4M11 16.5v-6.5"/></svg>',
};

/* -------------------------------------------------------------------
   PASEK NAWIGACJI — budujemy HTML i wstawiamy w <header id="navbar">
   activeKey = która zakładka jest aktualnie otwarta (podświetlona)
   ------------------------------------------------------------------- */
function buildNavbar(activeKey) {
  const lang = getLang();
  // budujemy HTML linków z listy NAV (kolejność i nazwy ustawiasz w data.js)
  // klasa is-active podświetla bieżącą zakładkę
  const linksHTML = NAV.map(({ key, href }) => {
    const active = key === activeKey ? " is-active" : "";
    const label = I18N[lang][key];
    // data-text = ten sam napis dla "ducha" rezerwującego szerokość (brak przeskoku)
    return `<a class="nav-link${active}" href="${href}" data-text="${label}">${label}</a>`;
  }).join("");

  // przełącznik języka EN | PL (aktywny wariant podświetlony)
  const enActive = lang === "en" ? " is-active" : "";
  const plActive = lang === "pl" ? " is-active" : "";
  const langHTML =
    `<span class="lang-switch">` +
    `<span class="lang-opt${enActive}" data-text="EN" onclick="setLang('en')">EN</span>` +
    `<span class="sep">|</span>` +
    `<span class="lang-opt${plActive}" data-text="PL" onclick="setLang('pl')">PL</span>` +
    `</span>`;

  const header = document.getElementById("navbar");
  header.className = "navbar";
  header.innerHTML =
    `<div class="navbar__inner">` +
    logoHTML("navbar__logo") +
    `<nav class="navbar__links">${linksHTML}${langHTML}</nav>` +
    `</div>`;
}

/* -------------------------------------------------------------------
   STOPKA — copyright + klikalne ikony social media
   Wstawiamy w <footer id="footer">. Nie pokazujemy jej na HOME.
   ------------------------------------------------------------------- */
function buildFooter() {
  const f = document.getElementById("footer");
  if (!f) return;
  f.className = "footer";
  f.innerHTML =
    `<div class="footer__inner">` +
    `<div class="footer__copy">${SITE.copyright}</div>` +
    `<div class="footer__social">` +
    `<a class="footer__mail" href="mailto:${SITE.email}" aria-label="E-mail">${SOCIAL_SVG.mail}<span>${SITE.email}</span></a>` +
    `<a class="icon-only" href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${SOCIAL_SVG.instagram}</a>` +
    `<a class="icon-only" href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${SOCIAL_SVG.youtube}</a>` +
    `<a class="icon-only" href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${SOCIAL_SVG.linkedin}</a>` +
    `</div></div>`;
}

/* -------------------------------------------------------------------
   KAFELKI — jeden kafelek (zdjęcie + podpis) lub placeholder
   ------------------------------------------------------------------- */
function tileHTML(item) {
  // kafelek-zapowiedź bez zdjęcia (placeholder "wkrótce")
  if (item.placeholder) {
    return (
      `<div class="tile tile--soon">` +
      `<div class="tile__imgwrap">` +
      `<span class="soon-title t-menu-choose">${t("soon_title")}</span>` +
      `<span class="soon-sub">${t("soon_sub")}</span>` +
      `</div></div>`
    );
  }
  const title = tr(item.title);   // tytuł (tekst albo {en, pl})
  const kind = tr(item.kind);     // rodzaj (tekst albo {en, pl})
  const cover = imgEntry(item.image);
  const metaInline =
    kind || item.year
      ? `<span class="tile__meta"> | ${kind}${kind && item.year ? " | " : ""}${item.year || ""}</span>`
      : "";
  const caption =
    `<div class="tile__caption">` +
    `<span class="tile__title">${title}</span>` +
    metaInline +
    `</div>`;

  // praca bez zdjęcia okładki — kremowy kafelek z tytułem + pod spodem rodzaj | rok
  if (!cover.src) {
    const metaOnly =
      kind || item.year
        ? `<div class="tile__caption"><span class="tile__meta">${[kind, item.year].filter(Boolean).join(" | ")}</span></div>`
        : "";
    return (
      `<a class="tile" href="artwork.html?id=${item.id}">` +
      `<div class="tile__imgwrap tile__imgwrap--empty">` +
      `<span class="tile__emptytitle">${title}</span>` +
      `</div>${metaOnly}</a>`
    );
  }

  // zwykły kafelek ze zdjęciem (z opcjonalnym podpisem fotografa na hover)
  const credit = cover.photo
    ? `<span class="photo-credit">${t("photo_by")} ${cover.photo}</span>`
    : "";
  return (
    `<a class="tile" href="artwork.html?id=${item.id}">` +
    `<div class="tile__imgwrap${cover.photo ? " has-credit" : ""}">` +
    `<img class="tile__img" src="${cover.src}" alt="${title}" loading="lazy">` +
    credit +
    `</div>` +
    caption +
    `</a>`
  );
}

/* -------------------------------------------------------------------
   STRONA Z KAFELKAMI (prace / filmy / game design)
   activeKey – którą zakładkę podświetlić
   list      – tablica z data.js (ARTWORKS / VIDEOS / GAMES)
   ------------------------------------------------------------------- */
function initListPage(activeKey, list) {
  buildNavbar(activeKey);
  buildFooter();
  const grid = document.getElementById("grid");
  grid.className = "masonry";
  grid.innerHTML = list.map(tileHTML).join("");
}

/* -------------------------------------------------------------------
   STRONA BIO
   ------------------------------------------------------------------- */
function initBioPage() {
  buildNavbar("nav_bio");
  buildFooter();
  const lang = getLang();
  const el = document.getElementById("bio-root");

  // pomocnik: lista wypunktowana z tablicy tekstów
  const listHTML = (arr) =>
    `<ul class="t-list">` + arr.map((x) => `<li>${x}</li>`).join("") + `</ul>`;

  el.innerHTML =
    // górna część: zdjęcie + tekst (tekst wyśrodkowany do wysokości zdjęcia)
    `<div class="bio-top">` +
    `<img class="bio-photo" src="${BIO.photo}" alt="Zuzanna Klara Bardian">` +
    `<p class="t-text-large bio-text">${BIO.text[lang]}</p>` +
    `</div>` +
    // trzy kolumny osiągnięć
    `<div class="bio-columns">` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_exhibitions")}</h2>${listHTML(BIO.exhibitions)}</div>` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_festivals")}</h2>${listHTML(BIO.festivals)}</div>` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_awards")}</h2>${listHTML(BIO.awards)}</div>` +
    `</div>` +
    // edukacja na pełną szerokość
    `<div class="bio-education"><h2 class="t-headline">${t("bio_education")}</h2>${listHTML(BIO.education)}</div>`;
}

/* -------------------------------------------------------------------
   PODSTRONA POJEDYNCZEGO PROJEKTU (artwork.html?id=...)
   Szuka pracy o danym "id" we wszystkich listach i wyświetla ją.
   ------------------------------------------------------------------- */
function initWorkPage() {
  buildNavbar(null); // żadna zakładka nie jest aktywna
  buildFooter();

  // odczytaj ?id=... z adresu strony
  const id = new URLSearchParams(location.search).get("id");
  // przeszukaj wszystkie listy prac
  const all = [].concat(ARTWORKS, VIDEOS, GAMES);
  const work = all.find((w) => w.id === id);

  const root = document.getElementById("work-root");
  if (!work || work.placeholder) {
    root.innerHTML = `<a class="back-link t-text" href="artworks.html">${t("back")}</a><p class="t-text-large">—</p>`;
    return;
  }

  const title = tr(work.title);
  const kind = tr(work.kind);
  const desc = tr(work.desc);

  // jaki układ? własny dla tej pracy (work.layout) albo domyślny (z data.js)
  const order =
    Array.isArray(work.layout) && work.layout.length
      ? work.layout
      : DEFAULT_WORK_LAYOUT;

  // wiersz rodzaj | rok (pomija puste części)
  const metaText = [kind, work.year].filter(Boolean).join(" | ");

  // przygotuj każdy element jako gotowy kawałek HTML (albo pusty napis)
  const blocks = {
    // duże zdjęcie = okładka ("image"), z podpisem fotografa po najechaniu
    hero: photoFigure(work.image, title, "work__hero", false),
    title: `<h1 class="t-headline work__title">${title}</h1>`,
    meta: metaText ? `<div class="work__meta t-text">${metaText}</div>` : "",
    coauthors:
      work.coauthors && work.coauthors.length
        ? `<div class="work__coauthors t-text">${t("coauthors")}: ${work.coauthors.join(", ")}</div>`
        : "",
    desc: desc ? `<p class="t-text-large work__desc">${desc}</p>` : "",
    gallery: (work.gallery && work.gallery.length)
      ? `<div class="work__gallery">` +
        work.gallery
          .map((g) => photoFigure(g, title, "", true))
          .join("") +
        `</div>`
      : "",
    video: work.youtube
      ? `<div class="work__video"><iframe src="https://www.youtube.com/embed/${work.youtube}" allowfullscreen loading="lazy"></iframe></div>`
      : "",
  };

  // odnośnik powrotu kieruje do sekcji, do której należy praca
  let backHref = "artworks.html";
  if (VIDEOS.indexOf(work) !== -1) backHref = "videos.html";
  else if (GAMES.indexOf(work) !== -1) backHref = "game-design.html";

  // odnośnik "inne projekty" zawsze na górze; reszta wg kolejności z "order"
  root.innerHTML =
    `<div class="work">` +
    `<a class="back-link t-text" href="${backHref}">${t("back")}</a>` +
    order.map((key) => blocks[key] || "").join("") +
    `</div>`;
}
