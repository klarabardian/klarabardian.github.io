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
  // adres ?lang=pl albo ?lang=en ma pierwszeństwo i od razu się zapamiętuje
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "pl" || fromUrl === "en") {
    try { localStorage.setItem("zkb-lang", fromUrl); } catch (e) {}
    return fromUrl;
  }
  try { return localStorage.getItem("zkb-lang") || "en"; } catch (e) { return "en"; }
}
function setLang(lang) {
  try { localStorage.setItem("zkb-lang", lang); } catch (e) {}
  // usuń ?lang z adresu, żeby nie nadpisywał nowego wyboru po przeładowaniu
  const url = new URL(location.href);
  url.searchParams.delete("lang");
  history.replaceState(null, "", url);
  // zapamiętaj, które komentarze (kropki) są rozwinięte, żeby po zmianie języka zostały rozwinięte
  try {
    const open = [...document.querySelectorAll(".bio-quote:not([hidden])")].map((q) => q.id);
    sessionStorage.setItem("zkb-open-quotes", JSON.stringify(open));
  } catch (e) {}
  location.reload(); // przeładuj stronę, żeby teksty zmieniły się na nowy język
}
// kropka + komentarz (bio i podstrony prac): klik rozwija / chowa; po zmianie języka rozwinięty zostaje rozwinięty
function wireQuoteToggle(more, quote) {
  const set = (open) => {
    quote.hidden = !open;
    more.setAttribute("aria-expanded", String(open));
  };
  more.addEventListener("click", () => set(quote.hidden));
  try {
    const saved = JSON.parse(sessionStorage.getItem("zkb-open-quotes") || "[]");
    if (saved.includes(quote.id)) set(true);
    sessionStorage.removeItem("zkb-open-quotes");
  } catch (e) {}
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
function logoHTML(className, image = SITE.logo.image, width = SITE.logo.width) {
  const inner =
    SITE.logo && image
      ? `<img class="logo-img" src="${image}" alt="${SITE.logoAlt || ""}"` +
        (width ? ` style="width:${width}px"` : "") +
        `>`
      : SITE.logo;
  return `<a class="${className}" href="index.html">${inner}</a>`;
}

/* Pomocnik: ujednolica zdjęcie do postaci { src, photo }.
   Zdjęcie w data.js może być tekstem "plik.jpg" ALBO { src, photo }. */
/* proporcje odtwarzacza z pola "youtubeRatio" (np. "1:1", "9:16"); puste = zwykłe 16:9 */
function videoRatioAttr(ratio) {
  const m = /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/.exec(ratio || "");
  if (!m) return "";
  return ` work__video--ratio" style="--video-ratio: ${Number(m[1]) / Number(m[2])}`;
}

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
function tileHTML(item, showTitle = false) {
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
  // w podpisie kafelka tylko rodzaj | rok — materiał i wymiary są na podstronie pracy
  const meta = [kind, item.year].filter(Boolean).join(" | ");
  const cover = imgEntry(item.image);
  const metaInline = meta ? `<span class="tile__meta"> | ${meta}</span>` : "";
  const caption =
    `<div class="tile__caption">` +
    `<span class="tile__title">${title}</span>` +
    metaInline +
    `</div>`;

  // praca bez zdjęcia okładki — kremowy kafelek z tytułem + pod spodem rodzaj | rok
  // (na stronie filmów pod spodem jest też tytuł, jak przy kafelkach ze zdjęciem)
  if (!cover.src) {
    const metaOnly = meta
      ? `<div class="tile__caption"><span class="tile__meta">${meta}</span></div>`
      : "";
    return (
      `<a class="tile" href="artwork.html?id=${item.id}">` +
      `<div class="tile__imgwrap tile__imgwrap--empty">` +
      `<span class="tile__emptytitle">${title}</span>` +
      `</div>${showTitle ? caption : metaOnly}</a>`
    );
  }

  // zwykły kafelek ze zdjęciem (z opcjonalnym podpisem fotografa na hover)
  const credit = cover.photo
    ? `<span class="photo-credit">${t("photo_by")} ${cover.photo}</span>`
    : "";
  return (
    `<a class="tile" href="artwork.html?id=${item.id}">` +
    `<div class="tile__imgwrap${cover.photo ? " has-credit" : ""}">` +
    `<img class="tile__img" src="${cover.src.replace("assets/works/", "assets/works/tiles/")}" alt="${title}" loading="lazy">` +
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
   filters   – (OPCJONALNE) lista kategorii (WORK_FILTERS z data.js);
               gdy jest, nad kafelkami pojawiają się przyciski filtrów,
               a praca pasuje do filtra, jeśli ma jego klucz w polu "tags".
   ------------------------------------------------------------------- */
function initListPage(activeKey, list, showTitles = false, filters = null) {
  buildNavbar(activeKey);
  buildFooter();
  const grid = document.getElementById("grid");
  grid.className = "masonry";
  // od najnowszych do najstarszych (przy "2020–2021" liczy się ostatni rok; bez roku na końcu)
  const yearOf = (it) => Math.max(0, ...((it.year || "").match(/\d{4}/g) || []).map(Number));
  const sorted = [...list].sort((a, b) => yearOf(b) - yearOf(a));
  // każdy kafelek budujemy RAZ; filtr tylko wybiera, które z nich wstawić do kolumn
  const tiles = sorted.map((item) => ({ html: tileHTML(item, showTitles), tags: item.tags || [] }));

  // aktywny filtr: z adresu (?f=photo), a gdy go nie ma — ostatnio wybrany
  // w tej karcie przeglądarki (żeby po powrocie z podstrony pracy filtr został)
  let active = "";
  if (filters) {
    const fromUrl = new URLSearchParams(location.search).get("f") || "";
    let remembered = "";
    try { remembered = sessionStorage.getItem("zkb-filter") || ""; } catch (e) {}
    const wanted = fromUrl || remembered;
    if (filters.some((f) => f.key === wanted)) active = wanted;
  }
  const visible = () => (active ? tiles.filter((t) => t.tags.indexOf(active) !== -1) : tiles);

  // kafelki idą po kolei od lewej do prawej: 1 2 3 / 4 5 6 / ...
  // (kolumna c dostaje kafelki o numerach c, c+n, c+2n ...)
  let cols = 0;
  const draw = (force) => {
    const n = masonryColumns();
    if (n === cols && !force) return;
    cols = n;
    const shown = visible();
    grid.innerHTML = Array.from({ length: n }, (_, c) =>
      `<div class="masonry__col">` + shown.filter((_, i) => i % n === c).map((t) => t.html).join("") + `</div>`
    ).join("");
  };
  draw();
  window.addEventListener("resize", () => draw(false));

  if (filters) buildFilters(filters, active, (key) => { active = key; draw(true); });
}

/* Przyciski filtrów nad kafelkami (strona prac).
   Pierwszy to "wszystkie / all"; reszta z listy WORK_FILTERS.
   onChange(key) — wywoływane po kliknięciu; "" oznacza wszystkie. */
function buildFilters(filters, active, onChange) {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const all = [{ key: "", label: t("filter_all") }].concat(
    filters.map((f) => ({ key: f.key, label: tr(f.label) }))
  );
  // ta sama sztuczka co w menu: ukryty "duch" w grubości Black rezerwuje szerokość,
  // więc pogrubienie aktywnego przycisku nie przesuwa sąsiadów
  bar.innerHTML =
    `<div class="filters__row">` +
    all
      .map((f) =>
        `<button type="button" class="filter-btn${f.key === active ? " is-active" : ""}" data-key="${f.key}" data-text="${f.label}">${f.label}</button>`
      )
      .join("") +
    `</div>`;

  // pasek jest stale przyklejony pod menu, więc treść strony zaczyna się pod nim;
  // odstęp liczymy z jego wysokości (na wąskim ekranie napisy mogą się złamać)
  const page = bar.closest(".page");
  const fitPage = () => {
    if (page) page.style.paddingTop = `calc(var(--nav-height) + ${bar.offsetHeight}px + var(--space-sm))`;
  };
  window.addEventListener("resize", fitPage);
  fitPage();

  // prawy koniec rzędu filtrów = prawy koniec napisu "bio" w menu (liczymy z pozycji linku)
  const bioLink = document.querySelector('.navbar a.nav-link[href="bio.html"]');
  const alignToBio = () => {
    if (!bioLink) return;
    bar.style.paddingRight = `${document.documentElement.clientWidth - bioLink.getBoundingClientRect().right}px`;
  };
  window.addEventListener("resize", alignToBio);
  if (document.fonts) document.fonts.ready.then(alignToBio);
  alignToBio();

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    const key = btn.dataset.key;
    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    // zapamiętaj w adresie (?f=...) i w tej karcie przeglądarki
    const url = new URL(location.href);
    if (key) url.searchParams.set("f", key); else url.searchParams.delete("f");
    history.replaceState(null, "", url);
    try { sessionStorage.setItem("zkb-filter", key); } catch (e) {}
    onChange(key);
  });
}

// ile kolumn ma kafelkowa siatka — zgodnie z media queries w site.css
function masonryColumns() {
  if (window.matchMedia("(max-width: 420px)").matches) return 1;
  if (window.matchMedia("(max-width: 720px)").matches) return 2;
  return 3;
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
  // (pozycja to zwykły tekst — wspólny dla obu języków — albo { en, pl })
  const listHTML = (arr) =>
    `<ul class="t-list">` + arr.map((x) => `<li>${typeof x === "string" ? x : x[lang]}</li>`).join("") + `</ul>`;

  el.innerHTML =
    // górna część: zdjęcie + tekst (tekst wyśrodkowany do wysokości zdjęcia)
    `<div class="bio-top">` +
    // zdjęcie z podpisem fotografa (jak przy pracach: widoczny po najechaniu);
    // klasa fluid-photo włącza efekt płynu (photo-fluid.js)
    `<figure class="photo bio-photo-fig${BIO.photoBy ? " has-credit" : ""}">` +
    `<img class="bio-photo fluid-photo" src="${BIO.photo}" alt="Zuzanna Klara Bardian">` +
    (BIO.photoBy ? `<figcaption class="photo-credit">${t("photo_by")} ${BIO.photoBy}</figcaption>` : "") +
    `</figure>` +
    `<p class="t-text-large bio-text">${BIO.text[lang]}</p>` +
    `</div>` +
    // wyróżniony cytat na całą szerokość pod zdjęciem i tekstem
    // ogromny cudzysłów: klik pokazuje / chowa cytat pod nim
    `<div class="bio-more-row">` +
    `<button type="button" class="bio-more" aria-expanded="false" aria-controls="bio-quote" aria-label="${lang === "pl" ? "pokaż więcej" : "show more"}"><span aria-hidden="true"></span></button>` +
    `<div class="t-text-large bio-quote" id="bio-quote" hidden>${BIO.quote[lang].split("\n\n").map((p) => `<p>${p}</p>`).join("")}</div>` +
    `</div>` +
    // trzy kolumny osiągnięć
    `<div class="bio-columns">` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_exhibitions")}</h2>${listHTML(BIO.exhibitions)}</div>` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_festivals")}</h2>${listHTML(BIO.festivals)}</div>` +
    `<div class="bio-col"><h2 class="t-headline">${t("bio_awards")}</h2>${listHTML(BIO.awards)}</div>` +
    `</div>` +
    // edukacja na pełną szerokość
    `<div class="bio-education"><h2 class="t-headline">${t("bio_education")}</h2>${listHTML(BIO.education)}</div>`;

  const more = el.querySelector(".bio-more");
  const quote = el.querySelector(".bio-quote");
  wireQuoteToggle(more, quote);
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
  const comment = tr(work.comment);
  const credits = tr(work.credits); // ciąg dalszy opisu (obsada, ekipa) pod komentarzem

  // jaki układ? własny dla tej pracy (work.layout) albo domyślny (z data.js)
  const order =
    Array.isArray(work.layout) && work.layout.length
      ? work.layout
      : DEFAULT_WORK_LAYOUT;

  // wiersz rodzaj | materiał | rok (pomija puste części)
  // na podstronach filmów rodzaj to „film krótkometrażowy” + czas trwania
  const isFilm = VIDEOS.indexOf(work) !== -1;
  const metaText = [isFilm ? t("short_film") : "", kind, tr(work.material), work.year].filter(Boolean).join(" | ");

  // przygotuj każdy element jako gotowy kawałek HTML (albo pusty napis)
  const blocks = {
    // duże zdjęcie = okładka ("image"), z podpisem fotografa po najechaniu
    // w pracach z sekcji filmy okładka jest tylko na liście (videos.html), nie na podstronie
    hero: work.row || work.pairs || work.heroInGallery || VIDEOS.indexOf(work) !== -1 ? "" : photoFigure(work.image, title, "work__hero" + (work.heroFull ? " work__hero--full" : ""), false),
    title: `<h1 class="t-headline work__title">${title}</h1>`,
    meta: metaText ? `<div class="work__meta t-text">${metaText}</div>` : "",
    coauthors:
      work.coauthors && work.coauthors.length
        ? `<div class="work__coauthors t-text">${t("coauthors")}: ${work.coauthors.join(", ")}</div>`
        : "",
    // opcjonalne zdjęcie na całą szerokość strony (pole "banner"; trzeba dopisać "banner" w layout)
    banner: work.banner ? photoFigure(work.banner, title, "work__banner", false) : "",
    // opcjonalny komentarz odsłaniany kropką (jak w bio); pole "comment" w data.js, akapity rozdzielone pustą linią
    desc: (desc ? `<p class="t-text-large work__desc">${desc}</p>` : "") + (comment
      ? `<div class="bio-more-row work__comment">` +
        `<button type="button" class="bio-more" aria-expanded="false" aria-controls="work-comment" aria-label="${getLang() === "pl" ? "pokaż więcej" : "show more"}"><span aria-hidden="true"></span></button>` +
        `<div class="t-text-large bio-quote" id="work-comment" hidden>${comment.split("\n\n").map((p) => `<p>${p}</p>`).join("")}</div>` +
        `</div>`
      : "") + (credits ? `<p class="t-text-large work__desc">${credits}</p>` : ""),
    gallery: (work.gallery && work.gallery.length)
      ? `<div class="work__gallery${work.row || work.galleryRow ? " work__gallery--row" : ""}${work.pairs ? " work__gallery--pairs" : ""}${work.pairsRatio ? " work__gallery--ratio" : ""}"${work.pairsRatio ? ` style="--pair-ratio: ${work.pairsRatio}"` : ""}>` +
        (work.row || work.pairs || work.heroInGallery ? [work.image, ...work.gallery] : work.gallery)
          .map((g) => photoFigure(g, title, "", true))
          .join("") +
        `</div>`
      : "",
    video: work.youtube
      // YouTube dopiero po kliknięciu (tryb bez cookies); do tego czasu tylko okładka pracy
      ? `<div class="work__video work__video--yt${work.videoFull ? " work__video--full" : ""}${videoRatioAttr(work.youtubeRatio)}" data-yt="${work.youtube}">` +
        `<button type="button" class="work__video-play" aria-label="${title}">` +
        `<img src="${imgEntry(work.still || work.image).src || `https://i.ytimg.com/vi/${work.youtube}/hqdefault.jpg`}" alt="">` +
        `<span class="work__video-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>` +
        `</button></div>`
      : work.video && work.video.src
        // własny plik filmu (np. nagranie z telefonu); dopasowuje się do proporcji filmu
        ? `<div class="work__video work__video--file"><video src="${work.video.src}"${work.video.poster ? ` poster="${work.video.poster}"` : ""} controls playsinline preload="metadata"></video></div>`
        : "",
  };

  // odnośnik powrotu kieruje do sekcji, do której należy praca
  let backHref = "artworks.html";
  if (VIDEOS.indexOf(work) !== -1) backHref = "videos.html";
  else if (GAMES.indexOf(work) !== -1) backHref = "games.html";

  // odnośnik "inne projekty" zawsze na górze; reszta wg kolejności z "order"
  root.innerHTML =
    `<div class="work">` +
    `<div class="back-bar"><a class="back-link t-text" href="${backHref}">${t("back")}</a></div>` +
    order.map((key) => blocks[key] || "").join("") +
    `</div>`;

  const more = root.querySelector(".work__comment .bio-more");
  if (more) {
    const quote = root.querySelector(".work__comment .bio-quote");
    wireQuoteToggle(more, quote);
  }

  const yt = root.querySelector(".work__video--yt");
  if (yt) {
    yt.querySelector("button").addEventListener("click", () => {
      yt.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0" title="${title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    });
  }

  if (GAMES.indexOf(work) !== -1) addWipBanner();
  initLightbox(root);
}

/* pasek WORK IN PROGRESS na środku ekranu (strona gier i podstrony gier); styl w site.css */
function addWipBanner() {
  if (document.querySelector(".wip-banner")) return;
  const b = document.createElement("div");
  b.className = "wip-banner";
  b.setAttribute("aria-label", "work in progress");
  b.innerHTML = '<p class="wip-banner__text wave-text">Work in progress</p>';
  document.body.appendChild(b);
}

/* Powiększenie zdjęcia na cały ekran po kliknięciu.
   Zamknięcie: klik w tło albo Esc. Przewijanie: strzałki na ekranie albo ← → na klawiaturze. */
function initLightbox(root) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML =
    `<img class="lightbox__img" alt="">` +
    `<div class="lightbox__credit"></div>` +
    `<button class="lightbox__nav lightbox__nav--prev" aria-label="←">&#8592;</button>` +
    `<button class="lightbox__nav lightbox__nav--next" aria-label="→">&#8594;</button>`;
  document.body.appendChild(box);
  const big = box.querySelector(".lightbox__img");
  const credit = box.querySelector(".lightbox__credit");

  let imgs = [];
  let index = 0;
  const isOpen = () => box.classList.contains("is-open");

  const show = (i) => {
    index = (i + imgs.length) % imgs.length;
    big.src = imgs[index].currentSrc || imgs[index].src;
    big.alt = imgs[index].alt;
    // podpis fotografa (jeśli jest) z <figcaption> tego zdjęcia
    const cap = imgs[index].closest("figure").querySelector(".photo-credit");
    credit.textContent = cap ? cap.textContent : "";
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  };

  root.addEventListener("click", (e) => {
    const img = e.target.closest("figure.photo img");
    if (!img) return;
    imgs = Array.from(root.querySelectorAll("figure.photo img"));
    box.classList.toggle("is-single", imgs.length < 2);
    show(imgs.indexOf(img));
    box.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  });
  box.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__nav--prev")) show(index - 1);
    else if (e.target.closest(".lightbox__nav--next")) show(index + 1);
    else close();
  });
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft" && imgs.length > 1) show(index - 1);
    else if (e.key === "ArrowRight" && imgs.length > 1) show(index + 1);
  });
}

/* -------------------------------------------------------------------
   TWARDE SPACJE PO SIEROTACH (tylko PL)
   Pojedyncze litery w, i, a, o, u, z nie zostają na końcu wiersza:
   po nich spacja zamienia się na niełamliwą. Działa na całej stronie,
   także na tekstach doklejanych później (kafelki, podstrona pracy).
   ------------------------------------------------------------------- */
(function () {
  if (getLang() !== "pl") return;
  const ORPHAN = /(^|[\s(„"“—–-])([wiaouzWIAOUZ]) (?=\S)/g;
  const SKIP = "SCRIPT,STYLE,TEXTAREA,IFRAME,#tw-panel";
  function fix(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const p = n.parentElement;
      if (!p || p.closest(SKIP)) return;
      const s = n.nodeValue.replace(ORPHAN, "$1$2 ").replace(ORPHAN, "$1$2 ");
      if (s !== n.nodeValue) n.nodeValue = s;
    });
  }
  function start() {
    fix(document.body);
    new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) fix(n);
        else if (n.nodeType === 3 && n.parentElement) fix(n.parentElement);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
