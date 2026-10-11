/* @ds-bundle: {"format":3,"namespace":"ZuzannaKlaraBardianPortfolio_a403c2","components":[{"name":"ArtworkTile","sourcePath":"components/core/ArtworkTile.jsx"},{"name":"Footer","sourcePath":"components/core/Footer.jsx"},{"name":"NavBar","sourcePath":"components/core/NavBar.jsx"}],"sourceHashes":{"components/core/ArtworkTile.jsx":"1d51e5a0b771","components/core/Footer.jsx":"cb294a952898","components/core/NavBar.jsx":"3053ded1798d","data.js":"aadbc84e7f40","home.js":"4a8723efb251","site.js":"6f8b23612803"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ZuzannaKlaraBardianPortfolio_a403c2 = window.ZuzannaKlaraBardianPortfolio_a403c2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/ArtworkTile.jsx
try { (() => {
// ArtworkTile — pojedynczy kafelek pracy w siatce (jak Pinterest):
// zdjęcie + podpis "tytuł | rodzaj | rok". Obsługuje też placeholder ("Wkrótce").

function ArtworkTile({
  id,
  // adres podstrony (artwork.html?id=...)
  image,
  // ścieżka do zdjęcia
  title,
  // tytuł pracy
  kind = "",
  // rodzaj pracy
  year = "",
  // rok
  placeholder = false,
  // true = kafelek-zapowiedź bez zdjęcia
  soonTitle = "Coming soon",
  soonSub = "work in progress"
}) {
  // wariant "wkrótce" — kremowy blok bez zdjęcia
  if (placeholder) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tile tile--soon"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tile__imgwrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "soon-title t-menu-choose"
    }, soonTitle), /*#__PURE__*/React.createElement("span", {
      className: "soon-sub"
    }, soonSub)));
  }
  // zwykły kafelek z linkiem do podstrony
  return /*#__PURE__*/React.createElement("a", {
    className: "tile",
    href: `artwork.html?id=${id}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile__imgwrap"
  }, /*#__PURE__*/React.createElement("img", {
    className: "tile__img",
    src: image,
    alt: title,
    loading: "lazy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tile__caption"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tile__title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "tile__meta"
  }, ` | ${kind} | ${year}`)));
}
Object.assign(__ds_scope, { ArtworkTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ArtworkTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Footer.jsx
try { (() => {
// Footer — stopka z copyrightem i klikalnymi ikonami social media.

// ikony jako komponenty (dziedziczą kolor przez stroke="currentColor")
const Icons = {
  mail: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.6 6.8 12 12.3l8.4-5.5"
  })),
  instagram: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.2",
    cy: "6.8",
    r: "1",
    fill: "currentColor",
    stroke: "none"
  })),
  youtube: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "5",
    width: "20",
    height: "14",
    rx: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 9.2v5.6l4.8-2.8z",
    fill: "currentColor",
    stroke: "none"
  })),
  linkedin: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "7.2",
    y1: "10.5",
    x2: "7.2",
    y2: "16.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.2",
    cy: "7.3",
    r: "0.6",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 16.5v-3.4a2 2 0 0 1 4 0v3.4M11 16.5v-6.5"
  }))
};
function Footer({
  copyright = "Copyright © 2026 Zuzanna Klara Bardian. All rights reserved.",
  email = "",
  instagram = "#",
  youtube = "#",
  linkedin = "#"
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__copy"
  }, copyright), /*#__PURE__*/React.createElement("div", {
    className: "footer__social"
  }, email ? /*#__PURE__*/React.createElement("a", {
    className: "footer__mail",
    href: `mailto:${email}`,
    "aria-label": "E-mail"
  }, Icons.mail, /*#__PURE__*/React.createElement("span", null, email)) : null, /*#__PURE__*/React.createElement("a", {
    className: "icon-only",
    href: instagram,
    target: "_blank",
    rel: "noopener",
    "aria-label": "Instagram"
  }, Icons.instagram), /*#__PURE__*/React.createElement("a", {
    className: "icon-only",
    href: youtube,
    target: "_blank",
    rel: "noopener",
    "aria-label": "YouTube"
  }, Icons.youtube), /*#__PURE__*/React.createElement("a", {
    className: "icon-only",
    href: linkedin,
    target: "_blank",
    rel: "noopener",
    "aria-label": "LinkedIn"
  }, Icons.linkedin))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Footer.jsx", error: String((e && e.message) || e) }); }

// components/core/NavBar.jsx
try { (() => {
// NavBar — górny pasek nawigacji portfolio (logo + linki + przełącznik EN|PL).
// Używa klas i zmiennych CSS z design systemu (styles.css).

function NavBar({
  active = "artworks",
  // która zakładka jest aktywna
  lang = "en",
  // "en" albo "pl"
  labels // opcjonalne nadpisanie etykiet
}) {
  // domyślne etykiety dla obu języków
  const L = labels || {
    en: {
      bio: "bio",
      artworks: "art works",
      videos: "video",
      games: "game design"
    },
    pl: {
      bio: "bio",
      artworks: "prace",
      videos: "filmy",
      games: "game design"
    }
  };
  const t = L[lang];
  const items = [["artworks", "artworks.html"], ["videos", "videos.html"], ["games", "game-design.html"], ["bio", "bio.html"]];
  return /*#__PURE__*/React.createElement("header", {
    className: "navbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "navbar__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "navbar__logo",
    href: "index.html"
  }, "Zuzanna Klara Bardian"), /*#__PURE__*/React.createElement("nav", {
    className: "navbar__links"
  }, items.map(([key, href]) => /*#__PURE__*/React.createElement("a", {
    key: key,
    className: "nav-link" + (active === key ? " is-active" : ""),
    href: href
  }, t[key])), /*#__PURE__*/React.createElement("span", {
    className: "lang-switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lang-opt" + (lang === "en" ? " is-active" : "")
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "|"), /*#__PURE__*/React.createElement("span", {
    className: "lang-opt" + (lang === "pl" ? " is-active" : "")
  }, "PL")))));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavBar.jsx", error: String((e && e.message) || e) }); }

// data.js
try { (() => {
/* ===================================================================
   data.js  ·  TREŚĆ STRONY — TO JEST PLIK, KTÓRY EDYTUJESZ NAJCZĘŚCIEJ
   -------------------------------------------------------------------
   Tutaj trzymamy CAŁĄ treść strony w jednym miejscu:
     • linki do social mediów i e-mail
     • teksty interfejsu po angielsku (EN) i polsku (PL)
     • listę prac (ARTWORKS), filmów (VIDEOS), game design (GAMES)
     • treść strony BIO

   ŻEBY DODAĆ NOWĄ PRACĘ: skopiuj jeden blok { ... } z listy ARTWORKS,
   wklej go i podmień wartości (tytuł, zdjęcie, rok, opis).
   Zdjęcia wrzucaj do folderu  assets/works/  i podaj nazwę pliku.

   Uwaga: każda praca ma "id" (np. "fish-dream") — to adres podstrony.
   Musi być unikalny i bez spacji (małe litery, myślniki).
   =================================================================== */

/* -------------------------------------------------------------------
   1) USTAWIENIA OGÓLNE — linki, kontakt
   ------------------------------------------------------------------- */
const SITE = {
  /* LOGO (lewy górny róg paska i środek strony startowej).
     Możesz użyć TEKSTU albo własnego logo WEKTOROWEGO (plik .svg).
      • Wariant tekstowy (domyślny):
         logo: "Zuzanna Klara Bardian",
      • Wariant z plikiem wektorowym — wgraj plik do folderu  assets/
       (np. assets/logo.svg) i wpisz:
         logo: { image: "assets/logo.svg", width: 220 },
       gdzie "width" to szerokość logo w pikselach (opcjonalna).
     Reszta strony zadziała tak samo — nic więcej nie trzeba zmieniać. */
  logo: "Zuzanna Klara Bardian",
  // Tekst alternatywny logo (dla czytników ekranu / gdy obrazek się nie wczyta)
  logoAlt: "Zuzanna Klara Bardian",
  // Linki do Twoich social mediów (kliknięcie ikon w stopce)
  instagram: "https://www.instagram.com/klarabardian/",
  youtube: "https://www.youtube.com/@zkbardian",
  linkedin: "https://www.linkedin.com/in/zuzannaklarabardian/",
  // Twój e-mail (pokazany w bio). Zmień na własny.
  email: "kontakt@zuzannabardian.com",
  // Tekst stopki (ten sam w obu językach)
  copyright: "Copyright © 2026 Zuzanna Klara Bardian. All rights reserved."
};

/* -------------------------------------------------------------------
   2) TEKSTY INTERFEJSU — wersja angielska (EN) i polska (PL)
   Klucze (np. nav_bio) są używane w kodzie; zmieniaj tylko tekst po prawej.
   ------------------------------------------------------------------- */
const I18N = {
  en: {
    nav_bio: "bio",
    nav_artworks: "art works",
    nav_videos: "video",
    nav_games: "game design",
    hero_hint: "move your cursor to reveal",
    back: "← other projects",
    bio_exhibitions: "Group exhibitions",
    bio_festivals: "Film festivals",
    bio_awards: "Awards",
    bio_education: "Education",
    contact: "Contact",
    soon_title: "Coming soon",
    soon_sub: "work in progress",
    photo_by: "photo by",
    // podpis fotografa po najechaniu na zdjęcie
    coauthors: "co-creators" // współtwórczynie / współtwórcy
  },
  pl: {
    nav_bio: "bio",
    nav_artworks: "prace",
    nav_videos: "filmy",
    nav_games: "game design",
    hero_hint: "porusz kursorem, aby odsłonić",
    back: "← inne projekty",
    bio_exhibitions: "Wystawy zbiorowe",
    bio_festivals: "Festiwale filmowe",
    bio_awards: "Nagrody",
    bio_education: "Edukacja",
    contact: "Kontakt",
    soon_title: "Wkrótce",
    soon_sub: "w przygotowaniu",
    photo_by: "fot.",
    // podpis fotografa po najechaniu na zdjęcie
    coauthors: "współtwórczynie" // współtwórczynie / współtwórcy
  }
};

/* -------------------------------------------------------------------
   2b) PASEK NAWIGACJI — kolejność i nazwy odnośników
   -------------------------------------------------------------------
   Ta lista decyduje, JAKIE odnośniki i W JAKIEJ KOLEJNOŚCI pojawiają się
   w menu (na pasku u góry i na stronie startowej).

   • Żeby ZMIENIĆ KOLEJNOŚĆ — przestaw bloki { ... } w tej liście.
   • Żeby ZMIENIĆ NAZWĘ odnośnika — znajdź jego "key" (np. nav_bio)
     w sekcji I18N powyżej i popraw tekst dla EN i PL.
   • "href" to plik strony, na który prowadzi odnośnik.
   ------------------------------------------------------------------- */
const NAV = [{
  key: "nav_artworks",
  href: "artworks.html"
},
// prace / art works
{
  key: "nav_videos",
  href: "videos.html"
},
// filmy / video
{
  key: "nav_games",
  href: "game-design.html"
},
// game design
{
  key: "nav_bio",
  href: "bio.html"
} // bio (na końcu)
];

/* -------------------------------------------------------------------
   3) PRACE (ARTWORKS) — kafelki na stronie "art works / prace"
   Pola każdej pracy:
     id        – unikalny adres podstrony (małe litery, myślniki)
     image     – zdjęcie OKŁADKI (kafelek na liście + duże zdjęcie "hero").
                 Plik z folderu assets/works/. Może być:
                   • sam tekst:  image: "assets/works/bukiet.jpg"
                   • z fotografem:  image: { src: "assets/works/bukiet.jpg", photo: "Jul Lignarska" }
     title     – tytuł pracy. Może być:
                   • zwykłym tekstem:  title: "Bouquet"
                   • dwujęzyczny {en, pl}:  title: { en: "Bouquet", pl: "Bukiet" }
     kind      – rodzaj pracy {en, pl}  (pokazany po " | " obok roku)
     year      – rok
     desc      – opis na podstronie {en, pl}
     gallery   – lista mniejszych zdjęć na podstronie (może być pusta []).
                 Każde zdjęcie — jak "image" — może być tekstem ALBO
                 obiektem { src, photo }, jeśli ma podpis fotografa.
     coauthors – (OPCJONALNE) lista współtwórczyń/współtwórców, np.
                   coauthors: ["Magdalena Kłodnicka", "Zofia Widuch"]
     youtube   – ID filmu z YouTube albo "" jeśli brak
                 (ID to część adresu po "v=" lub po "youtu.be/")
     layout    – (OPCJONALNE) kolejność i wybór elementów na podstronie.
                 Patrz opis przy DEFAULT_WORK_LAYOUT poniżej.

   PODPIS FOTOGRAFA: jeśli zdjęcie ma pole "photo", to po najechaniu
   na nie kursorem pojawia się napis "fot. Imię Nazwisko" (PL) /
   "photo by Name Surname" (EN). Prefiks zmienisz w I18N (klucz photo_by).
   ------------------------------------------------------------------- */
const ARTWORKS = [{
  // brak zdjęcia — kafelek pokaże sam tytuł (dodaj "image", gdy będzie gotowe)
  id: "co-sie-dzieje-w-lazience",
  title: {
    en: "what happens in the bathroom",
    pl: "co się dzieje w łazience"
  },
  kind: {
    en: "audiovisual event",
    pl: "wydarzenie audiowizualne"
  },
  year: "2025",
  desc: {
    en: "",
    pl: ""
  },
  gallery: [],
  youtube: ""
}, {
  id: "heliosfera",
  image: {
    src: "assets/works/heliosfera.jpg",
    photo: "Marcin Rupociński"
  },
  title: {
    en: "Heliosphere",
    pl: "Heliosfera"
  },
  kind: {
    en: "multi-channel projection",
    pl: "projekcja wielokanałowa"
  },
  year: "2025",
  desc: {
    en: "",
    pl: ""
  },
  gallery: [{
    src: "assets/works/heliosfera-2.jpg",
    photo: "Marcin Rupociński"
  }, {
    src: "assets/works/heliosfera-3.jpg",
    photo: "Marcin Rupociński"
  }, {
    src: "assets/works/heliosfera-4.jpg",
    photo: "Marcin Rupociński"
  }],
  youtube: ""
}, {
  id: "odwaznik",
  image: "assets/works/odwaznik.jpg",
  title: {
    en: "The Weight",
    pl: "Odważnik"
  },
  kind: {
    en: "interactive object",
    pl: "obiekt interaktywny"
  },
  year: "2025",
  desc: {
    en: "",
    pl: ""
  },
  gallery: ["assets/works/odwaznik-2.jpg"],
  youtube: ""
}, {
  id: "co-trudno-ci-powiedziec",
  image: "assets/works/co-trudno.jpg",
  title: {
    en: "what is hard for you to say",
    pl: "co trudno ci powiedzieć"
  },
  kind: {
    en: "stickers + survey",
    pl: "wlepy + ankieta"
  },
  year: "2024",
  desc: {
    en: "Using stickers pasted up around different cities, I collected over 150 anonymous answers to the question: What is hard for you to say to another person? I recorded the gathered answers as quiet audio and placed it inside a soft object.",
    pl: "Za pomocą wlep rozklejonych po różnych miastach zebrałam ponad 150 anonimowych odpowiedzi na pytanie: Co trudno Ci powiedzieć drugiej osobie? Zebrane odpowiedzi nagrałam w formie cichego audio i umieściłam w miękkim obiekcie."
  },
  gallery: ["assets/works/co-trudno-2.jpg", "assets/works/co-trudno-3.jpg", "assets/works/co-trudno-4.jpg", "assets/works/co-trudno-5.jpg"],
  youtube: ""
}, {
  id: "czuja",
  image: {
    src: "assets/works/czuja.jpg",
    photo: "Jul Lignarska"
  },
  title: "czuja",
  kind: {
    en: "set of objects",
    pl: "zestaw obiektów"
  },
  year: "2021",
  desc: {
    en: "A set of objects for exploring your own body. It helps shift attention from how we look to what we feel.",
    pl: "Zestaw obiektów do eksplorowania swojego ciała. Pomaga przekierować uwagę z tego, jak wyglądamy, na to, co czujemy."
  },
  gallery: [{
    src: "assets/works/czuja-2.jpg",
    photo: "Jul Lignarska"
  }, {
    src: "assets/works/czuja-3.jpg",
    photo: "Jul Lignarska"
  }, {
    src: "assets/works/czuja-4.jpg",
    photo: "Jul Lignarska"
  }],
  youtube: ""
}, {
  id: "wysluchaj",
  image: {
    src: "assets/works/wysluchaj.jpg",
    photo: "Jul Lignarska"
  },
  title: {
    en: "listen",
    pl: "wysłuchaj"
  },
  kind: {
    en: "set of objects",
    pl: "zestaw obiektów"
  },
  year: "2021",
  desc: {
    en: "A set for listening to another person.",
    pl: "Zestaw do słuchania drugiej osoby."
  },
  gallery: [{
    src: "assets/works/wysluchaj-2.jpg",
    photo: "Jul Lignarska"
  }, {
    src: "assets/works/wysluchaj-3.jpg",
    photo: "Jul Lignarska"
  }],
  youtube: ""
}, {
  id: "rosne-i-sie-krztusze",
  image: {
    src: "assets/works/rosne.jpg",
    photo: "Irka Wypych"
  },
  title: {
    en: "I'm growing and choking",
    pl: "rosnę i się krztuszę"
  },
  kind: {
    en: "audiovisual",
    pl: "audiowizual"
  },
  year: "2024",
  desc: {
    en: "An audiovisual work about growth that hurts — expanding and being constrained at the same time.",
    pl: "Praca audiowizualna o wzroście, który boli — o rozrastaniu się i duszeniu jednocześnie."
  },
  gallery: [{
    src: "assets/works/rosne-2.jpg",
    photo: "Irka Wypych"
  }, {
    src: "assets/works/rosne-3.jpg",
    photo: "Irka Wypych"
  }, {
    src: "assets/works/rosne-4.jpg",
    photo: "Marcin Rupociński"
  }],
  youtube: ""
}, {
  id: "snilo-mi-sie-ryba",
  image: "assets/works/ryba.jpg",
  title: {
    en: "I had a dream that I am a fish and you are touching me",
    pl: "śniło mi się że jestem rybą i mnie dotykasz"
  },
  kind: {
    en: "audiovisual",
    pl: "audiowizual"
  },
  year: "2024",
  desc: {
    en: "An audiovisual piece about closeness, water and the body — a dream where touch and breathing blur into one another.",
    pl: "Praca audiowizualna o bliskości, wodzie i ciele — sen, w którym dotyk i oddech zlewają się w jedno."
  },
  gallery: ["assets/works/ryba-2.jpg", "assets/works/ryba-3.jpg", "assets/works/ryba-4.jpg", "assets/works/ryba-5.jpg"],
  youtube: ""
}, {
  id: "ostatnio-malo-mowie",
  image: "assets/works/plyne.jpg",
  title: {
    en: "I don't say much and I float a lot",
    pl: "ostatnio mało mówię i trochę płynę"
  },
  kind: {
    en: "photographs",
    pl: "fotografie"
  },
  year: "2025",
  desc: {
    en: "A series of photographs about silence, weightlessness and letting go.",
    pl: "Cykl fotografii o ciszy, nieważkości i odpuszczaniu."
  },
  gallery: ["assets/works/plyne-2.jpg", "assets/works/plyne-3.jpg"],
  youtube: ""
}, {
  id: "powiedzialam-nie-jestem-pewna",
  image: {
    src: "assets/works/niepewna.jpg",
    photo: "Zuzanna Klara Bardian"
  },
  title: {
    en: "I said I'm not sure",
    pl: "powiedziałam, że nie jestem pewna"
  },
  kind: {
    en: "photographs",
    pl: "fotografie"
  },
  year: "2023",
  desc: {
    en: "",
    pl: ""
  },
  gallery: [{
    src: "assets/works/niepewna-2.jpg",
    photo: "Zuzanna Klara Bardian"
  }, "assets/works/niepewna-3.jpg", "assets/works/niepewna-4.jpg"],
  youtube: ""
}, {
  id: "bukiet",
  image: {
    src: "assets/works/bukiet.jpg",
    photo: "Jul Lignarska"
  },
  title: {
    en: "Bouquet",
    pl: "Bukiet"
  },
  kind: {
    en: "dry non-alcoholic drink design",
    pl: "projekt wytrawnego napoju bezalkoholowego"
  },
  year: "2024",
  desc: {
    en: "A dry non-alcoholic drink design — a small ritual of taste built from fruit, herbs and warmth.",
    pl: "Projekt wytrawnego napoju bezalkoholowego — mały rytuał smaku zbudowany z owoców, ziół i ciepła."
  },
  gallery: [{
    src: "assets/works/bukiet-2.jpg",
    photo: "Jul Lignarska"
  }, {
    src: "assets/works/bukiet-3.jpg",
    photo: "Jul Lignarska"
  }, {
    src: "assets/works/bukiet-4.jpg",
    photo: "Jul Lignarska"
  }],
  youtube: ""
}];

/* -------------------------------------------------------------------
   4) FILMY (VIDEOS) — kadry z filmów, kafelkowo (jak art works)
   Te same pola co wyżej. Tu zwykle wypełniasz pole "youtube".
   ------------------------------------------------------------------- */
const VIDEOS = [{
  id: "dzien-dobry",
  image: "assets/works/dzien-dobry.jpg",
  title: {
    en: "Good Morning",
    pl: "Dzień dobry"
  },
  kind: {
    en: "short film",
    pl: "film krótkometrażowy"
  },
  year: "2023",
  desc: {
    en: "A film about the fear of one's own neighbours.",
    pl: "Film o strachu przed własnymi sąsiadami."
  },
  gallery: ["assets/works/dzien-dobry-1.jpg", "assets/works/dzien-dobry-2.jpg", "assets/works/dzien-dobry-3.jpg", "assets/works/dzien-dobry-plakat.jpg"],
  youtube: "" // ← wklej tu ID filmu z YouTube, np. "dQw4w9WgXcQ"
}, {
  id: "wlosy",
  image: "assets/works/wlosy.jpg",
  title: {
    en: "Hair",
    pl: "Włosy"
  },
  kind: {
    en: "",
    pl: ""
  },
  year: "",
  desc: {
    en: "Three high-school graduates shave their heads in the middle of a bald field.",
    pl: "Trzy maturzystki golą głowy na środku łysego pola."
  },
  coauthors: ["Magdalena Kłodnicka", "Zofia Widuch"],
  gallery: ["assets/works/wlosy-plakat.jpg"],
  youtube: ""
}, {
  id: "chimera",
  image: "assets/works/chimera.jpg",
  title: "Chimera",
  kind: {
    en: "audiovisual concert",
    pl: "koncert audiowizualny"
  },
  year: "2024",
  desc: {
    en: "An audiovisual concert performed at Teatr Dialogu in Wrocław.",
    pl: "Koncert audiowizualny zaprezentowany w Teatrze Dialogu we Wrocławiu."
  },
  gallery: [],
  youtube: ""
}];

/* -------------------------------------------------------------------
   5) GAME DESIGN — kafelkowo (jak art works).
   ------------------------------------------------------------------- */
const GAMES = [{
  id: "julthecooladventure",
  image: "assets/works/julthecool.jpg",
  title: "JulTheCoolAdventure",
  kind: "Point&Click",
  year: "2022",
  desc: {
    en: "",
    pl: ""
  },
  gallery: [],
  youtube: ""
}, {
  id: "gleboko-koncept",
  image: "assets/works/gleboko.jpg",
  title: {
    en: "deep – concept",
    pl: "głęboko – koncept"
  },
  kind: {
    en: "character sketches",
    pl: "szkice postaci"
  },
  year: "2020",
  desc: {
    en: "",
    pl: ""
  },
  gallery: ["assets/works/gleboko-2.jpg", "assets/works/gleboko-3.jpg"],
  youtube: ""
}];

/* -------------------------------------------------------------------
   5b) UKŁAD PODSTRON PRAC — kolejność elementów
   -------------------------------------------------------------------
   Tu ustawiasz DOMYŚLNĄ kolejność elementów na każdej podstronie pracy.
   Możesz też nadpisać ją dla POJEDYNCZEJ pracy, dodając pole "layout"
   w jej bloku (w listach ARTWORKS / VIDEOS / GAMES powyżej).

   Dostępne elementy (wpisuj dokładnie te nazwy):
     "hero"      – duże zdjęcie (okładka — pole "image")
     "title"     – tytuł pracy
     "meta"      – wiersz: rodzaj | rok
     "coauthors" – współtwórczynie/współtwórcy (jeśli podano "coauthors")
     "desc"      – opis
     "gallery"   – mniejsze zdjęcia
     "video"     – film z YouTube (jeśli podano "youtube")

   Przykłady (wpisz jako pole pracy, np. layout: [...]):
     ["title", "desc", "hero", "gallery"]   → tytuł i opis NA GÓRZE
     ["hero"]                                → tylko duże zdjęcie
     ["gallery"]                             → tylko galeria (wszystkie zdjęcia)
     ["hero", "title", "desc"]               → zdjęcie, potem tytuł i opis

   Uwaga: odnośnik "inne projekty" jest ZAWSZE na samej górze.
   Galeria pokazuje wszystkie zdjęcia z pola "gallery".
   ------------------------------------------------------------------- */
const DEFAULT_WORK_LAYOUT = ["hero", "title", "meta", "coauthors", "desc", "gallery", "video"];

/* -------------------------------------------------------------------
   6) BIO — zdjęcie, tekst o Tobie, listy osiągnięć
   Listy są wspólne dla obu języków (to nazwy własne wystaw i festiwali).
   Nagłówki sekcji tłumaczą się automatycznie (patrz I18N wyżej).
   ------------------------------------------------------------------- */
const BIO = {
  photo: "assets/bio.jpg",
  text: {
    en: "Born in Wrocław in 2000, she graduated in Design from the Eugeniusz Geppert Academy of Fine Arts and is currently a Media Art student at the same university. She lives and works in Wrocław.\n\nHer creative practice explores relationships and the effort we make to learn what should be natural and intuitive for us.",
    pl: "Urodzona we Wrocławiu w 2000 roku. Ukończyła Wzornictwo na Akademii Sztuk Pięknych im. Eugeniusza Gepperta, obecnie studiuje Sztukę Mediów na tej samej uczelni. Mieszka i pracuje we Wrocławiu.\n\nW swojej praktyce twórczej bada relacje i wysiłek, jaki wkładamy w naukę tego, co powinno być dla nas naturalne i intuicyjne."
  },
  exhibitions: ["Open Call Dot(y)kliwość | Sopot, 2024", "koncert audiowizualny Chimera | Teatr Dialogu, Wrocław, 2024", "Burton, Burton, Burton! | Kino Nowe Horyzonty, Wrocław, 2024", "Plakat Zaangażowany | Bulvary, Wrocław, 2024", "Open Eyes Art Festival | Kraków, 2022", "koncert audiowizualny Dis-reality | WWFF, Wrocław, 2023", "Wystawa konkursu Matematyka i Sztuka | Instytut Matematyczny UWr, Wrocław, 2023", "Mesh Creative Challenge #4 Distorted Perception | online, 2023", "4. International Triennale Media Art | Radom, 2021"],
  festivals: ["the Women International Film Festival (WIFF), Islamabad, Pakistan, 2024", "Funfest International Video Festival, Madera, Portugalia, 2024", "The International Short Film Festival „Nuit Trop Courte”, Grenoble, Francja, 2024", "Yeast International Student Film Festival, Limassol, Cypr, 2024", "World Indie Film Awards, online, Włochy, 2024", "Student Cuts Film Festival, Ljutomer, Słowenia, 2024", "Youality, Chantilly, Francja, 2024", "Reel Rythm Music & Film Festival, Killeen, USA, 2024", "streetside cinema/, Winston-Salem, USA, 2023–2024", "3. Himachal Short Film Festival, Manali, Indie, 2023", "Chania Film Festival, Chania, Grecja, 2023", "The AIU Film Festival, Jahra, Kuwejt, 2023", "Student World Impact Film Festival, online, USA, 2023"],
  awards: ["Stypendium Ministra Kultury i Dziedzictwa Narodowego | 2024", "Stypendium Rektora Akademii Sztuk Pięknych we Wrocławiu | 2024, 2021", "The Best Short Film + Jury Award + Public Choice Award | 5th Nawada International Film Festival, 2024", "Best Director | San Luis Festival, 2024", "GRAND PRIX | Madeira FUNFEST, 2024", "GRAND PRIX | 21. Festiwal Opolskie Lamy, 2024", "GRAND PRIX | HYDE PARK FREEDOM Film Festiwal (16. Kameralne Lato), 2024", "GRAND PRIX | XX Ustecki Festiwal Filmów Amatorskich UFF(o)A, 2024", "GRAND PRIX | konkurs „Plac Filmowy” w Lublinie, 2024", "Nagroda Jury Młodych | festiwal OKFA w Koninie, 2024", "II miejsce | 6. Festiwal Maklaka i jego przyjaciół, Konstancin-Jeziorna, 2023"],
  education: ["2023–2025 — Master of Media Art, Academy of Fine Arts in Wrocław, Poland", "2021–2022 — Sound and Image + Industrial Design, Politécnico de Leiria, Portugal (Erasmus+)", "2019–2022 — Bachelor of Industrial Design, Academy of Fine Arts in Wrocław, Poland"]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "data.js", error: String((e && e.message) || e) }); }

// home.js
try { (() => {
/* ===================================================================
   home.js  ·  STRONA STARTOWA (HOME)
   -------------------------------------------------------------------
   Prosty układ: zdjęcie w tle, a na nim wyśrodkowane menu
   w kolorze kremowym (#ffffe3). Bez efektów i bez animacji wyjścia —
   taki sam wygląd na komputerze i na telefonie.

   Treść menu (logo, odnośniki, język) bierze się z plików:
     • data.js  – logo (SITE.logo), kolejność/nazwy odnośników (NAV),
                  teksty po EN/PL (I18N)
     • site.js  – pomocnicy: logoHTML(), getLang(), setLang()
   =================================================================== */

(function () {
  const lang = getLang();

  // Zbuduj wyśrodkowane menu na środku ekranu.
  const nav = document.getElementById("home-nav");

  // odnośniki z listy NAV (kolejność i nazwy ustawiasz w data.js)
  const linksHTML = NAV.map(({
    key,
    href
  }) => `<a class="home-link" href="${href}" data-text="${I18N[lang][key]}">${I18N[lang][key]}</a>`).join("");

  // przełącznik języka EN | PL (aktywny wariant podświetlony)
  const enA = lang === "en" ? " is-active" : "";
  const plA = lang === "pl" ? " is-active" : "";
  nav.innerHTML = logoHTML("home-logo") + `<div class="home-links">${linksHTML}</div>` + `<div class="lang-switch home-lang">` + `<span class="lang-opt${enA}" data-text="EN" data-lang="en">EN</span>` + `<span class="sep">|</span>` + `<span class="lang-opt${plA}" data-text="PL" data-lang="pl">PL</span>` + `</div>`;

  // klik w EN / PL przełącza język
  nav.querySelectorAll(".lang-opt").forEach(el => {
    el.addEventListener("click", () => setLang(el.dataset.lang));
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "home.js", error: String((e && e.message) || e) }); }

// site.js
try { (() => {
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
  const inner = SITE.logo && SITE.logo.image ? `<img class="logo-img" src="${SITE.logo.image}" alt="${SITE.logoAlt || ""}"` + (SITE.logo.width ? ` style="width:${SITE.logo.width}px"` : "") + `>` : SITE.logo;
  return `<a class="${className}" href="index.html">${inner}</a>`;
}

/* Pomocnik: ujednolica zdjęcie do postaci { src, photo }.
   Zdjęcie w data.js może być tekstem "plik.jpg" ALBO { src, photo }. */
function imgEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      src: entry.src || "",
      photo: entry.photo || ""
    };
  }
  return {
    src: entry || "",
    photo: ""
  };
}

/* Pomocnik: buduje <figure> ze zdjęciem i — jeśli jest fotograf —
   podpisem widocznym po najechaniu kursorem ("fot. / photo by"). */
function photoFigure(entry, alt, figClass, lazy) {
  const o = imgEntry(entry);
  if (!o.src) return "";
  const credit = o.photo ? `<figcaption class="photo-credit">${t("photo_by")} ${o.photo}</figcaption>` : "";
  return `<figure class="photo ${figClass || ""}${o.photo ? " has-credit" : ""}">` + `<img src="${o.src}" alt="${alt}"${lazy ? ' loading="lazy"' : ""}>` + credit + `</figure>`;
}

/* -------------------------------------------------------------------
   IKONY SOCIAL MEDIA (wpisane tutaj, żeby ładnie zmieniały kolor)
   ------------------------------------------------------------------- */
const SOCIAL_SVG = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.6 6.8 12 12.3l8.4-5.5"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7.2" y1="10.5" x2="7.2" y2="16.5"/><circle cx="7.2" cy="7.3" r="0.6" fill="currentColor" stroke="none"/><path d="M11 16.5v-3.4a2 2 0 0 1 4 0v3.4M11 16.5v-6.5"/></svg>'
};

/* -------------------------------------------------------------------
   PASEK NAWIGACJI — budujemy HTML i wstawiamy w <header id="navbar">
   activeKey = która zakładka jest aktualnie otwarta (podświetlona)
   ------------------------------------------------------------------- */
function buildNavbar(activeKey) {
  const lang = getLang();
  // budujemy HTML linków z listy NAV (kolejność i nazwy ustawiasz w data.js)
  // klasa is-active podświetla bieżącą zakładkę
  const linksHTML = NAV.map(({
    key,
    href
  }) => {
    const active = key === activeKey ? " is-active" : "";
    const label = I18N[lang][key];
    // data-text = ten sam napis dla "ducha" rezerwującego szerokość (brak przeskoku)
    return `<a class="nav-link${active}" href="${href}" data-text="${label}">${label}</a>`;
  }).join("");

  // przełącznik języka EN | PL (aktywny wariant podświetlony)
  const enActive = lang === "en" ? " is-active" : "";
  const plActive = lang === "pl" ? " is-active" : "";
  const langHTML = `<span class="lang-switch">` + `<span class="lang-opt${enActive}" data-text="EN" onclick="setLang('en')">EN</span>` + `<span class="sep">|</span>` + `<span class="lang-opt${plActive}" data-text="PL" onclick="setLang('pl')">PL</span>` + `</span>`;
  const header = document.getElementById("navbar");
  header.className = "navbar";
  header.innerHTML = `<div class="navbar__inner">` + logoHTML("navbar__logo") + `<nav class="navbar__links">${linksHTML}${langHTML}</nav>` + `</div>`;
}

/* -------------------------------------------------------------------
   STOPKA — copyright + klikalne ikony social media
   Wstawiamy w <footer id="footer">. Nie pokazujemy jej na HOME.
   ------------------------------------------------------------------- */
function buildFooter() {
  const f = document.getElementById("footer");
  if (!f) return;
  f.className = "footer";
  f.innerHTML = `<div class="footer__inner">` + `<div class="footer__copy">${SITE.copyright}</div>` + `<div class="footer__social">` + `<a class="footer__mail" href="mailto:${SITE.email}" aria-label="E-mail">${SOCIAL_SVG.mail}<span>${SITE.email}</span></a>` + `<a class="icon-only" href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${SOCIAL_SVG.instagram}</a>` + `<a class="icon-only" href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${SOCIAL_SVG.youtube}</a>` + `<a class="icon-only" href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${SOCIAL_SVG.linkedin}</a>` + `</div></div>`;
}

/* -------------------------------------------------------------------
   KAFELKI — jeden kafelek (zdjęcie + podpis) lub placeholder
   ------------------------------------------------------------------- */
function tileHTML(item) {
  // kafelek-zapowiedź bez zdjęcia (placeholder "wkrótce")
  if (item.placeholder) {
    return `<div class="tile tile--soon">` + `<div class="tile__imgwrap">` + `<span class="soon-title t-menu-choose">${t("soon_title")}</span>` + `<span class="soon-sub">${t("soon_sub")}</span>` + `</div></div>`;
  }
  const title = tr(item.title); // tytuł (tekst albo {en, pl})
  const kind = tr(item.kind); // rodzaj (tekst albo {en, pl})
  const cover = imgEntry(item.image);
  const metaInline = kind || item.year ? `<span class="tile__meta"> | ${kind}${kind && item.year ? " | " : ""}${item.year || ""}</span>` : "";
  const caption = `<div class="tile__caption">` + `<span class="tile__title">${title}</span>` + metaInline + `</div>`;

  // praca bez zdjęcia okładki — kremowy kafelek z tytułem + pod spodem rodzaj | rok
  if (!cover.src) {
    const metaOnly = kind || item.year ? `<div class="tile__caption"><span class="tile__meta">${[kind, item.year].filter(Boolean).join(" | ")}</span></div>` : "";
    return `<a class="tile" href="artwork.html?id=${item.id}">` + `<div class="tile__imgwrap tile__imgwrap--empty">` + `<span class="tile__emptytitle">${title}</span>` + `</div>${metaOnly}</a>`;
  }

  // zwykły kafelek ze zdjęciem (z opcjonalnym podpisem fotografa na hover)
  const credit = cover.photo ? `<span class="photo-credit">${t("photo_by")} ${cover.photo}</span>` : "";
  return `<a class="tile" href="artwork.html?id=${item.id}">` + `<div class="tile__imgwrap${cover.photo ? " has-credit" : ""}">` + `<img class="tile__img" src="${cover.src}" alt="${title}" loading="lazy">` + credit + `</div>` + caption + `</a>`;
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
  const listHTML = arr => `<ul class="t-list">` + arr.map(x => `<li>${x}</li>`).join("") + `</ul>`;
  el.innerHTML =
  // górna część: zdjęcie + tekst (tekst wyśrodkowany do wysokości zdjęcia)
  `<div class="bio-top">` + `<img class="bio-photo" src="${BIO.photo}" alt="Zuzanna Klara Bardian">` + `<p class="t-text-large bio-text">${BIO.text[lang]}</p>` + `</div>` +
  // trzy kolumny osiągnięć
  `<div class="bio-columns">` + `<div class="bio-col"><h2 class="t-headline">${t("bio_exhibitions")}</h2>${listHTML(BIO.exhibitions)}</div>` + `<div class="bio-col"><h2 class="t-headline">${t("bio_festivals")}</h2>${listHTML(BIO.festivals)}</div>` + `<div class="bio-col"><h2 class="t-headline">${t("bio_awards")}</h2>${listHTML(BIO.awards)}</div>` + `</div>` +
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
  const work = all.find(w => w.id === id);
  const root = document.getElementById("work-root");
  if (!work || work.placeholder) {
    root.innerHTML = `<a class="back-link t-text" href="artworks.html">${t("back")}</a><p class="t-text-large">—</p>`;
    return;
  }
  const title = tr(work.title);
  const kind = tr(work.kind);
  const desc = tr(work.desc);

  // jaki układ? własny dla tej pracy (work.layout) albo domyślny (z data.js)
  const order = Array.isArray(work.layout) && work.layout.length ? work.layout : DEFAULT_WORK_LAYOUT;

  // wiersz rodzaj | rok (pomija puste części)
  const metaText = [kind, work.year].filter(Boolean).join(" | ");

  // przygotuj każdy element jako gotowy kawałek HTML (albo pusty napis)
  const blocks = {
    // duże zdjęcie = okładka ("image"), z podpisem fotografa po najechaniu
    hero: photoFigure(work.image, title, "work__hero", false),
    title: `<h1 class="t-headline work__title">${title}</h1>`,
    meta: metaText ? `<div class="work__meta t-text">${metaText}</div>` : "",
    coauthors: work.coauthors && work.coauthors.length ? `<div class="work__coauthors t-text">${t("coauthors")}: ${work.coauthors.join(", ")}</div>` : "",
    desc: desc ? `<p class="t-text-large work__desc">${desc}</p>` : "",
    gallery: work.gallery && work.gallery.length ? `<div class="work__gallery">` + work.gallery.map(g => photoFigure(g, title, "", true)).join("") + `</div>` : "",
    video: work.youtube ? `<div class="work__video"><iframe src="https://www.youtube.com/embed/${work.youtube}" allowfullscreen loading="lazy"></iframe></div>` : ""
  };

  // odnośnik powrotu kieruje do sekcji, do której należy praca
  let backHref = "artworks.html";
  if (VIDEOS.indexOf(work) !== -1) backHref = "videos.html";else if (GAMES.indexOf(work) !== -1) backHref = "game-design.html";

  // odnośnik "inne projekty" zawsze na górze; reszta wg kolejności z "order"
  root.innerHTML = `<div class="work">` + `<a class="back-link t-text" href="${backHref}">${t("back")}</a>` + order.map(key => blocks[key] || "").join("") + `</div>`;
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "site.js", error: String((e && e.message) || e) }); }

__ds_ns.ArtworkTile = __ds_scope.ArtworkTile;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
