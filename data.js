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
  logo: { image: "assets/logos/logo.svg", width: 500 },
  // Tekst alternatywny logo (dla czytników ekranu / gdy obrazek się nie wczyta)
  logoAlt: "Zuzanna Klara Bardian",

  // Linki do Twoich social mediów (kliknięcie ikon w stopce)
  instagram: "https://www.instagram.com/klarabardian/",
  youtube:   "https://www.youtube.com/@zkbardian",
  linkedin:  "https://www.linkedin.com/in/zuzannaklarabardian/",

  // Twój e-mail (pokazany w bio). Zmień na własny.
  email: "z.k.bardian@gmail.com",

  // Tekst stopki (ten sam w obu językach)
  copyright: "Copyright © 2026 Zuzanna Klara Bardian. All rights reserved.",
};

/* -------------------------------------------------------------------
   2) TEKSTY INTERFEJSU — wersja angielska (EN) i polska (PL)
   Klucze (np. nav_bio) są używane w kodzie; zmieniaj tylko tekst po prawej.
   ------------------------------------------------------------------- */
const I18N = {
  en: {
    nav_bio: "bio",
    nav_artworks: "art",
    nav_videos: "video",
    nav_games: "games",
    hero_hint: "move your cursor to reveal",
    back: "← other projects",
    bio_exhibitions: "Group exhibitions",
    bio_festivals: "Film festivals",
    bio_awards: "Awards",
    bio_education: "Education",
    contact: "Contact",
    soon_title: "Coming soon",
    soon_sub: "work in progress",
    photo_by: "photo by",          // podpis fotografa po najechaniu na zdjęcie
    coauthors: "co-creators",       // współtwórczynie / współtwórcy
    filter_all: "all",              // pierwszy przycisk filtrów na stronie prac
    short_film: "short film",       // rodzaj na podstronie filmu (przed czasem trwania)
  },
  pl: {
    nav_bio: "bio",
    nav_artworks: "sztuka",
    nav_videos: "filmy",
    nav_games: "gry",
    hero_hint: "porusz kursorem, aby odsłonić",
    back: "← inne projekty",
    bio_exhibitions: "Wystawy zbiorowe",
    bio_festivals: "Festiwale filmowe",
    bio_awards: "Nagrody",
    bio_education: "Edukacja",
    contact: "Kontakt",
    soon_title: "Wkrótce",
    soon_sub: "w przygotowaniu",
    photo_by: "fot.",              // podpis fotografa po najechaniu na zdjęcie
    coauthors: "współtwórczynie",    // współtwórczynie / współtwórcy
    filter_all: "wszystkie",         // pierwszy przycisk filtrów na stronie prac
    short_film: "film krótkometrażowy", // rodzaj na podstronie filmu (przed czasem trwania)
  },
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
const NAV = [
  { key: "nav_artworks", href: "artworks" },   // prace / art works
  { key: "nav_videos",   href: "videos" },     // filmy / video
  { key: "nav_games",    href: "games" },      // games / gry
  { key: "nav_bio",      href: "bio" },         // bio (na końcu)
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
     material  – (OPCJONALNE) materiał i wymiary {en, pl}, np. "Wełna, lustra, 26×26×5 cm";
                 w podpisie stoi między rodzajem a rokiem
     year      – rok
     tags      – kategorie do FILTROWANIA na stronie prac, np. ["photo"]
                 albo kilka naraz: ["photo", "performance"]. Klucze i nazwy
                 kategorii są w liście WORK_FILTERS poniżej. Każda praca
                 powinna mieć co najmniej jedną kategorię.
     desc      – opis na podstronie {en, pl}
     gallery   – lista mniejszych zdjęć na podstronie (może być pusta []).
                 Każde zdjęcie — jak "image" — może być tekstem ALBO
                 obiektem { src, photo }, jeśli ma podpis fotografa.
     coauthors – (OPCJONALNE) lista współtwórczyń/współtwórców, np.
                   coauthors: ["Magdalena Kłodnicka", "Zofia Widuch"]
     youtube   – ID filmu z YouTube albo "" jeśli brak
     youtubeRatio – (OPCJONALNE) proporcje filmu z YouTube, jeśli nie jest
                 poziomy 16:9, np. "1:1" (kwadrat) albo "9:16" (pionowy short);
                 odtwarzacz dopasuje się bez czarnych pasów
     still     – (OPCJONALNE) stopklatka filmu, widoczna przed jego włączeniem;
                 gdy jej nie ma, używana jest okładka ("image")
     video     – (OPCJONALNE) własny plik filmu zamiast YouTube:
                 { src: "assets/works/nazwa.mp4", poster: "assets/works/okladka.jpg" }
                 ("poster" to zdjęcie widoczne przed włączeniem filmu)
                 (ID to część adresu po "v=" lub po "youtu.be/")
     layout    – (OPCJONALNE) kolejność i wybór elementów na podstronie.
                 Patrz opis przy DEFAULT_WORK_LAYOUT poniżej.

   PODPIS FOTOGRAFA: jeśli zdjęcie ma pole "photo", to po najechaniu
   na nie kursorem pojawia się napis "fot. Imię Nazwisko" (PL) /
   "photo by Name Surname" (EN). Prefiks zmienisz w I18N (klucz photo_by).
   ------------------------------------------------------------------- */

/* FILTRY na stronie prac — kolejność przycisków i ich nazwy EN/PL.
   "key" to krótki klucz wpisywany w polu "tags" przy pracy.
   Pierwszy przycisk "wszystkie / all" dokłada się sam (tekst w I18N). */
const WORK_FILTERS = [
  { key: "av",          label: { en: "audiovisual",  pl: "audiowizuale" } },
  { key: "photo",       label: { en: "photography",  pl: "fotografie" } },
  { key: "object",     label: { en: "objects",      pl: "obiekty" } },
  { key: "performance", label: { en: "performance",  pl: "performens" } },
];

const ARTWORKS = [
  {
    id: "znaki-plynne",
    tags: ["av", "performance"],
    image: { src: "assets/works/znaki-plynne-cover.jpg", photo: "Stanisław Świtała" },
    title: { en: "Liquid Signs", pl: "Znaki Płynne" },
    kind: { en: "live audiovisual performance", pl: "występ audiowizualny na żywo" },
    year: "2026",
    desc: {
      en: "An audiovisual show at the ArtBrut Gallery in Wrocław, during Jacek Kröle’s exhibition “Nic wam nie powiem!” (“I won’t tell you anything!”), combining Liquid Art and live-played synthesizers.\n\nExhibition: Jacek Kröle\n\nMusic: Adam Jański\nVisuals: Zuzanna Klara Bardian",
      pl: "Pokaz audiowizualny w Galerii ArtBrut we Wrocławiu, przy wystawie Jacka Kröle „Nic wam nie powiem!”, łączący Liquid Art i syntezatory grane na żywo.\n\nWystawa: Jacek Kröle\n\nMuzyka: Adam Jański\nWizuale: Zuzanna Klara Bardian",
    },
    gallery: [
      { src: "assets/works/znaki-plynne-2.jpg", photo: "Stanisław Świtała" },
      { src: "assets/works/znaki-plynne-4.jpg", photo: "Stanisław Świtała" },
      { src: "assets/works/znaki-plynne-5.jpg", photo: "Stanisław Świtała" },
      { src: "assets/works/znaki-plynne-6.jpg", photo: "Stanisław Świtała" },
      { src: "assets/works/znaki-plynne-7.jpg", photo: "Stanisław Świtała" },
      { src: "assets/works/znaki-plynne-10.jpg", photo: "Stanisław Świtała" },
    ],
    layout: ["title", "meta", "coauthors", "hero", "desc", "gallery", "video"], // opis pod pierwszym zdjęciem
    heroFull: true, // zdjęcie główne na całą szerokość strony
    still: "assets/works/znaki-plynne.jpg",
    youtube: "x3lQx7K8fz0",
  },
  {
    id: "co-sie-dzieje-w-lazience",
    tags: ["av", "performance"],
    image: { src: "assets/works/co-sie-dzieje-w-lazience.jpg", photo: "Marta Żurkiewicz" },
    title: { en: "what happens in the bathroom", pl: "co się dzieje w łazience" },
    kind: { en: "audiovisual event", pl: "wydarzenie audiowizualne" },
    year: "2025",
    desc: {
      en: "A relaxation event with analogue visuals in the liquid art technique, to ambient music improvised by Adam Jański.\n\nMaster's graduation project, supervised by Irmina Rusicka.",
      pl: "Wydarzenie relaksacyjne z analogowymi wizualami w technice liquid art do ambientowej muzyki improwizowanej przez Adama Jańskiego.\n\nProjekt dyplomowy magisterski pod okiem promotory Irminy Rusickiej.",
    },
    comment: {
      en: "The word “łazienka” (bathroom) comes from “łaźnia” (bathhouse), a place where people went, and even crawled through an opening dug in the ground, to look after their hygiene, chat a little and warm up together.\n\nWith this event I wanted to combine intimacy with closeness, and caring for oneself also in a social sense.",
      pl: "Słowo „łazienka” pochodzi od słowa „łaźnia”, czyli miejsca, gdzie się łaziło, a nawet właziło przez otwór wydrążony w ziemi, żeby razem z innymi ludźmi zadbać o higienę, trochę pogadać i się wygrzać.\n\nTym wydarzeniem chciałam połączyć intymność z bliskością i dbaniem o siebie również w znaczeniu społecznym.",
    },
    still: "assets/works/co-sie-dzieje-w-lazience-still.jpg", // zdjęcie na odtwarzaczu, na samej górze
    layout: ["video", "title", "meta", "desc", "gallery"],
    gallery: [
      { src: "assets/works/co-sie-dzieje-w-lazience-4.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-5.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-6.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-7.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-8.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-9.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-10.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-11.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-12.jpg", photo: "Jo Suppan" },
      { src: "assets/works/co-sie-dzieje-w-lazience-13.jpg", photo: "Jo Suppan" },
    ],
    youtube: "HFcWhHZqEoo",
  },
  {
    id: "heliosfera",
    tags: ["av"],
    image: { src: "assets/works/heliosfera.jpg", photo: "Marcin Rupociński" },
    title: { en: "Heliosphere", pl: "Heliosfera" },
    kind: { en: "multi-channel projection", pl: "projekcja wielokanałowa" },
    year: "2025",
    desc: {
      en: "A four-wall animation to music composed by Hanna Rupocińska, created for the seventh edition of the Random Check project, Time Crystals: a multimedia installation of twelve audiovisual compositions shown during the Musica Electronica Nova festival at the Krupa Art Foundation Digital Space in Wrocław, May 2025.",
      pl: "Animacja na cztery ściany do muzyki skomponowanej przez Hannę Rupocińską, stworzona dla siódmej edycji projektu Random Check „Time Crystals”: instalacji multimedialnej złożonej z dwunastu kompozycji audiowizualnych, pokazanej w trakcie festiwalu Musica Electronica Nova w Krupa Art Foundation Digital Space we Wrocławiu, maj 2025.",
    },
    gallery: [
      { src: "assets/works/heliosfera-2.jpg", photo: "Marcin Rupociński" },
      { src: "assets/works/heliosfera-3.jpg", photo: "Marcin Rupociński" },
      { src: "assets/works/heliosfera-4.jpg", photo: "Marcin Rupociński" },
      { src: "assets/works/heliosfera-5.jpg", photo: "Karol Adam Sokołowski" },
    ],
    layout: ["title", "meta", "video", "desc", "gallery"], // film tuż pod tytułem, pierwsze zdjęcie to podgląd filmu
    youtube: "VCEsnVD0b-0",
    layout: ["title", "meta", "video", "desc", "gallery"], // główne zdjęcie to podgląd filmu, na całą szerokość
  },
  {
    id: "martusia-na-walach",
    tags: ["performance"],
    image: { src: "assets/works/martusia-na-walach.jpg", photo: "Marta Żurkiewicz" },
    title: { en: "in the secret garden", pl: "in the secret garden" },
    kind: { en: "in front of the lens", pl: "przed obiektywem" },
    year: "2024",
    desc: {
      en: "A session created by Marta Żurkiewicz.",
      pl: "Sesja stworzona przez Martę Żurkiewicz.",
    },
    comment: {
      en: "There are sessions in which I feel I have a real influence on what gets created. This was a meeting in which I felt I wanted to expose my freedom in this wild garden.",
      pl: "Są takie sesje, w których wyjątkowo czuję, że mam wpływ na to, co powstanie. To było spotkanie, w którym czułam, że chcę wyeksponować swoją wolność w tym dzikim ogrodzie.",
    },
    heroInGallery: true, // pierwsze zdjęcie w galerii razem z małymi (bez osobnego dużego u góry)
    gallery: [
      { src: "assets/works/martusia-na-walach-2.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-4.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-6.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-7.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-8.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-9.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-10.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-11.jpg", photo: "Marta Żurkiewicz" },
      { src: "assets/works/martusia-na-walach-12.jpg", photo: "Marta Żurkiewicz" },
    ],
    youtube: "",
  },
  {
    id: "odwaznik",
    tags: ["object"],
    title: { en: "The Weight", pl: "Odważnik" },
    kind: { en: "interactive object", pl: "obiekt interaktywny" },
    material: { en: "recycled fabrics, wadding, speaker, 40×40×90 cm", pl: "tkaniny z odzysku, watolina, głośnik, 40×40×90 cm" },
    year: "2024",
    image: "assets/works/odwaznik.jpg",
    desc: {
      en: "Using stickers pasted up around different cities, I collected over 150 anonymous answers to the question: What is hard for you to say to another person? I recorded the gathered answers as quiet audio and placed it inside a large, soft object that you have to hug in order to get used to what is hard to say.",
      pl: "Za pomocą wlep rozklejonych po różnych miastach zebrałam ponad 150 anonimowych odpowiedzi na pytanie: Co trudno Ci powiedzieć drugiej osobie? Zebrane odpowiedzi nagrałam w formie cichego audio i umieściłam w miękkim obiekcie, który trzeba przytulić, by oswoić się z tym, co trudne do powiedzenia.",
    },
    gallery: [],
    still: "assets/works/odwaznik-2.jpg", // zdjęcie na odtwarzaczu
    youtube: "HEyZBspXOKg", // fragment audio
  },
  {
    id: "co-trudno-ci-powiedziec",
    tags: ["object"],
    title: { en: "What is difficult for you to say to another person?", pl: "Co trudno Ci powiedzieć drugiej osobie?" },
    kind: { en: "interactive project, stickers", pl: "projekt interaktywny, wlepy" },
    year: "2024",
    image: "assets/works/co-trudno.jpg",
    desc: {
      en: "Using stickers pasted up around different cities, I collected over 150 anonymous answers to this question: What is hard for you to say to another person? I used the collected answers in the work The Weight.",
      pl: "Za pomocą wlep rozklejonych po różnych miastach zebrałam ponad 150 anonimowych odpowiedzi na pytanie: Co trudno Ci powiedzieć drugiej osobie? Zebrane odpowiedzi wykorzystałam w pracy Odważnik.",
    },
    gallery: [
      "assets/works/co-trudno-2.jpg",
      "assets/works/co-trudno-3.jpg",
      "assets/works/co-trudno-4.jpg",
      "assets/works/co-trudno-5.jpg",
    ],
    youtube: "",
  },
  {
    id: "czuja",
    tags: ["object"],
    image: { src: "assets/works/czuja.jpg", photo: "Jul Lignarska" },
    title: "czuja",
    kind: { en: "set of objects", pl: "zestaw obiektów" },
    material: { en: "wool, magnifying glass, mirrors, metal, 26×26×5 cm", pl: "wełna, szkło powiększające, lustra, metal, 26×26×5 cm" },
    year: "2021",
    desc: {
      en: "A set of objects for exploring your own body.<br>Diploma project under the supervision of Wiktoria Lenart.",
      pl: "Zestaw obiektów do eksplorowania swojego ciała.<br>Projekt w ramach dyplomu pod okiem promotory Wiktorii Lenart.",
    },
    layout: ["title", "meta", "desc", "gallery", "video"], // bez zdjęcia głównego na górze
    galleryRow: true, // trzy zdjęcia obok siebie
    gallery: [
      { src: "assets/works/czuja-3.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/czuja-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/czuja-4.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "zOUP6Z1JkCQ",
  },
  {
    id: "wysluchaj",
    tags: ["object"],
    image: { src: "assets/works/wysluchaj.jpg", photo: "Jul Lignarska" },
    title: { en: "listen", pl: "wysłuchaj" },
    kind: { en: "set of objects", pl: "zestaw obiektów" },
    material: { en: "virgin wool, ceramics, 30×30×3 cm", pl: "dziewicza wełna, ceramika, 30×30×3 cm" },
    year: "2022",
    desc: {
      en: "A set for listening to another person.",
      pl: "Zestaw do słuchania drugiej osoby.",
    },
    layout: ["title", "meta", "video", "desc", "gallery"], // pierwsze zdjęcie to podgląd filmu
    gallery: [
      { src: "assets/works/wysluchaj-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/wysluchaj-3.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "u1KtiKnE5_U",
  },
  {
    id: "rosne-i-sie-krztusze",
    tags: ["av"],
    image: { src: "assets/works/rosne.jpg", photo: "Irka Wypych" },
    banner: { src: "assets/works/rosne-glowne.jpg", photo: "Irka Wypych" }, // zdjęcie główne na podstronie, na całą szerokość
    layout: ["title", "meta", "coauthors", "desc", "banner", "gallery", "video"],
    title: { en: "I'm growing and choking", pl: "rosnę i się krztuszę" },
    kind: { en: "audiovisual", pl: "audiowizual" },
    year: "2024",
    desc: {
      en: "An audiovisual concert at Teatr Dialogu in Wrocław, as part of the Narration and Interaction Workshop in Intermedia at the Academy of Fine Arts in Wrocław.",
      pl: "Koncert audiowizualny w Teatrze Dialogu we Wrocławiu w ramach Pracowni Narracji i Interakcji w Intermediach na ASP we Wrocławiu.",
    },
    gallery: [
      { src: "assets/works/rosne.jpg", photo: "Irka Wypych" },
      { src: "assets/works/rosne-2.jpg", photo: "Irka Wypych" },
      { src: "assets/works/rosne-3.jpg", photo: "Irka Wypych" },
      { src: "assets/works/rosne-4.jpg", photo: "Marcin Rupociński" },
    ],
    youtube: "",
  },
  {
    id: "snilo-mi-sie-ryba",
    tags: ["av"],
    image: { src: "assets/works/ryba.jpg", photo: "Marcin Rupociński" },
    title: { en: "I had a dream that I am a fish and you are touching me", pl: "śniło mi się że jestem rybą i mnie dotykasz" },
    kind: { en: "audiovisual", pl: "audiowizual" },
    year: "2024",
    desc: {
      en: "Visuals performed live. Made as part of the Narrative and Interaction in New Media studio, Academy of Fine Arts in Wrocław.",
      pl: "Visual grany na żywo. Praca powstała w ramach pracowni Narracja i Interakcja w Nowych Mediach na ASP we Wrocławiu.",
    },
    layout: ["title", "meta", "video", "desc", "gallery"], // pierwsze zdjęcie to podgląd filmu
    gallery: [
      "assets/works/ryba-2.jpg",
      "assets/works/ryba-3.jpg",
      "assets/works/ryba-4.jpg",
      "assets/works/ryba-5.jpg",
    ],
    youtube: "91Vmo2F2skc",
  },
  {
    id: "ostatnio-malo-mowie",
    tags: ["photo"],
    image: "assets/works/plyne.jpg",
    title: { en: "I don't say much and I float a lot", pl: "ostatnio mało mówię i trochę płynę" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2025",
    desc: { en: "", pl: "" },
    gallery: ["assets/works/plyne-2.jpg", "assets/works/plyne-3.jpg"],
    row: true, // wszystkie trzy zdjęcia obok siebie
    youtube: "",
  },
  {
    id: "powiedzialam-nie-jestem-pewna",
    tags: ["photo"],
    image: "assets/works/niepewna.jpg",
    title: { en: "I said I'm not sure", pl: "powiedziałam, że nie jestem pewna" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2023",
    desc: { en: "", pl: "" },
    pairs: true, // wszystkie 4 zdjęcia w tej samej wielkości, w parach
    pairsRatio: "3 / 2", // proporcje wszystkich 4 zdjęć (drugie jest niższe od pozostałych)
    gallery: [
      "assets/works/niepewna-2.jpg",
      "assets/works/niepewna-3.jpg",
      "assets/works/niepewna-4.jpg",
    ],
    youtube: "",
  },
  {
    id: "bukiet",
    tags: ["object"],
    image: { src: "assets/works/bukiet.jpg", photo: "Jul Lignarska" },
    title: { en: "Bouquet", pl: "Bukiet" },
    kind: { en: "dry non-alcoholic drink", pl: "wytrawny napój bezalkoholowy" },
    year: "2024",
    desc: {
      en: "Dry non-alcoholic drink design.",
      pl: "Projekt wytrawnego napoju bezalkoholowego.",
    },
    gallery: [
      { src: "assets/works/bukiet-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/bukiet-3.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/bukiet-4.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "",
  },
  {
    id: "niewygodnie",
    tags: ["performance"],
    image: "assets/works/niewygodnie.jpg",
    title: { en: "uncomfortably", pl: "niewygodnie" },
    kind: { en: "performance", pl: "performens" },
    year: "2024",
    desc: {
      en: "Stills from the series “films I have lost”.",
      pl: "Kadry z cyklu „filmy, które straciłam”.",
    },
    layout: ["title", "meta", "video", "desc", "gallery"], // pierwsze zdjęcie to podgląd filmu
    gallery: ["assets/works/niewygodnie-2.jpg", "assets/works/niewygodnie-3.jpg"],
    youtube: "bqYHZLOvkzs",
  },
  {
    id: "mow-do-oceanu",
    tags: ["performance"],
    image: "assets/works/mow-do-oceanu.jpg",
    title: { en: "talking to the ocean", pl: "mów do oceanu" },
    kind: { en: "performance", pl: "performens" },
    year: "2021",
    desc: {
      en: "A performance in relation to the ocean.",
      pl: "Performens w relacji z oceanem.",
    },
    gallery: ["assets/works/mow-do-oceanu-2.jpg"],
    youtube: "jpcLtxNFCHc",
    youtubeRatio: "1:1", // film jest kwadratowy
    // na podstronie tylko tekst i film (zdjęcie zostaje jako kafelek na liście prac)
    layout: ["title", "meta", "coauthors", "desc", "video"],
  },
  {
    id: "bendita",
    tags: ["performance"],
    image: "assets/works/bendita.jpg",
    title: "Bendita",
    kind: { en: "in front of the lens", pl: "przed obiektywem" },
    year: "2022",
    desc: {
      en: "Directed, filmed and edited by Juliana Portela.",
      pl: "Reżyseria, zdjęcia, montaż: Juliana Portela",
    },
    layout: ["title", "meta", "desc", "video"], // samo wideo, bez zdjęcia pod spodem
    gallery: [],
    youtube: "D4tIH6EiUWY",
  },
  {
    id: "to-co-boli",
    tags: ["photo", "performance"],
    image: "assets/works/to-co-boli.jpg",
    title: { en: "what hurts", pl: "to, co boli" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2021",
    row: true, // wszystkie trzy zdjęcia obok siebie, w tym samym rozmiarze
    gallery: [
      "assets/works/to-co-boli-2.jpg",
      "assets/works/to-co-boli-4.jpg",
    ],
    youtube: "",
  },
  {
    id: "dotarcie-swiadomosci",
    tags: ["photo"],
    image: "assets/works/dotarcie-swiadomosci-7.jpg", // okładka
    title: { en: "reaching", pl: "dotarcie" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2021",
    desc: { en: "", pl: "" },
    row: true, // trzy zdjęcia obok siebie, w tym samym rozmiarze
    gallery: [
      "assets/works/dotarcie-swiadomosci-6.jpg",
      "assets/works/dotarcie-swiadomosci-1.jpg",
    ],
    youtube: "",
  },
  {
    id: "fotografie-2020",
    tags: ["photo"],
    image: "assets/works/fotografie-2020.jpg",
    title: { en: "exercises", pl: "ćwiczenia" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2020",
    desc: { en: "", pl: "" },
    pairs: true, // okładka i zdjęcia z galerii w parach
    gallery: [
      "assets/works/fotografie-2020-4.jpg",
      "assets/works/fotografie-2020-9.jpg",
      "assets/works/fotografie-2020-10.jpg",
    ],
    youtube: "",
  },
  {
    id: "selfiepoint",
    tags: ["object"],
    image: "assets/works/selfiepoint.jpg",
    title: "selfiepoint",
    kind: { en: "installation", pl: "instalacja" },
    year: "2021",
    desc: { en: "", pl: "" },
    gallery: [],
    youtube: "",
  },
  {
    id: "tance",
    tags: ["painting"],
    image: "assets/works/tance.jpg",
    title: { en: "dances", pl: "tańce" },
    kind: { en: "paintings", pl: "obrazy" },
    material: { en: "acrylic", pl: "akryl" },
    year: "2021",
    pairs: true, // wszystkie 4 obrazy w tej samej wielkości, w parach (bez opisu)
    gallery: ["assets/works/tance-2.jpg", "assets/works/tance-3.jpg", "assets/works/tance-4.jpg"],
    youtube: "",
  },
  {
    id: "audioimprowizacja-przestrzenna",
    tags: ["av", "performance"],
    image: "assets/works/audioimprowizacja-przestrzenna.jpg",
    title: { en: "spatial audio improvisation", pl: "audioimprowizacja przestrzenna" },
    kind: { en: "audio improvisation", pl: "audioimprowizacja" },
    year: "2021",
    still: "assets/works/audioimprowizacja-przestrzenna-still.jpg", // zdjęcie na odtwarzaczu
    layout: ["title", "meta", "desc", "video", "hero"], // najpierw film, potem zdjęcie
    desc: {
      en: "Vocal improvisation with Tymon Jan Porębski to the sounds found in a given space.\n\nMade during a painting plein air run by assistant professor Kamil Moskowczenko.",
      pl: "Improwizacja wokalna z Tymonem Janem Porębskim do dźwięków zastanych w przestrzeni.\n\nW ramach pleneru malarskiego u adiunkta Kamila Moskowczenko.",
    },
    gallery: [],
    youtube: "G7oNBLOLNe4",
  },
];

/* -------------------------------------------------------------------
   4) FILMY (VIDEOS) — kadry z filmów, kafelkowo (jak art works)
   Te same pola co wyżej. Tu zwykle wypełniasz pole "youtube".
   ------------------------------------------------------------------- */
const VIDEOS = [
  {
    id: "dzien-dobry",
    image: "assets/works/dzien-dobry-plakat.jpg",
    still: "assets/works/dzien-dobry-1.jpg",
    title: { en: "Good Morning", pl: "Dzień dobry" },
    kind: "5’13’’",
    year: "2023",
    desc: {
      en: "<strong>A film about the fear of one’s own neighbours.</strong>",
      pl: "<strong>Film o strachu przed własnymi sąsiadami.</strong>",
    },
    credits: {
      en: "<strong>Cast:</strong> Laura Pajor, Beata Maria Rewers, Amelia Gawlińska, Madzia Gawlinska, Ahalya Ala Jezierska, Maja Lewicka, Jozef Mach, Karina Milan, Monika Molis, Patryk Sobieszek, Elwira Żakowicz<br><br><strong>Script, direction, editing:</strong> Zuzanna Klara Bardian<br><strong>Cinematography:</strong> Augustyn Bardian<br><strong>Music:</strong> Tymoteusz Lasik<br><strong>Choreography:</strong> Maja Lewicka<br><strong>Set design and costumes:</strong> Ada Duda<br><strong>Make-up:</strong> Dagmara Kocik<br><br><strong>Production:</strong> Zuzanna Klara Bardian, Hanna Seredyńska, Adrian Janisio<br><strong>Production manager:</strong> Hanna Seredyńska<br><strong>Assistant director:</strong> Oliwia Piątek<br><strong>Camera assistants:</strong> Michał Cywiński, Jan Kubica, Piotr Ostrowski<br><strong>Focus pullers:</strong> Michał Cywiński, Daniel Le Hai<br><strong>Sound on set:</strong> Zlata Veresniak, Mateusz Garbacz, Xawery Kessler<br><strong>Gaffers:</strong> Szymon Paluch, Michał Matuszewski<br><strong>Lighting technicians:</strong> Jacek Dymalski, Adam Jański, Xawery Kessler, Martyna Majcher, Maciek Sozański<br><strong>Duty crew:</strong> Karolina Budzisz, Iga Bujarkiewicz, Magdalena Dudziak, Mei Rudomino<br><strong>Catering:</strong> Oliwia Piątek, Maciek Sozański, Michał Żłobicki<br><strong>Casting:</strong> Maja Lewicka, Zuzanna Klara Bardian<br><strong>On-set help:</strong> Piotr Cieśla, Jacek Dymalski, Adam Jański, Marcin Pawlak, Maciej Samerdak, Maciek Sozański, Robert Węglarz, Mariusz Tadeusz Zimoński, Michał Żłobicki<br><strong>Sound post-production:</strong> Piotr Cieśla<br><strong>Violin:</strong> Kasia Schulz<br><br><strong>Awards:</strong> Grand Prix, Funfest, Portugal; Grand Prix, 21st Opolskie Lamy; Grand Prix, 16th Kameralne Lato; Grand Prix, 20th UFF(o)A; Grand Prix, Plac Filmowy festival; Young Jury Award, OKFA; 2nd place, 6th Maklak Festival; honourable mention, 14th KLAPS competition; finalist, World Indie Film Awards; quarter-finalist, SWIFF.",
      pl: "<strong>obsada:</strong> Laura Pajor, Beata Maria Rewers, Amelia Gawlińska, Madzia Gawlinska, Ahalya Ala Jezierska, Maja Lewicka, Jozef Mach, Karina Milan, Monika Molis, Patryk Sobieszek, Elwira Żakowicz<br><br><strong>scenariusz, reżyseria, montaż:</strong> Zuzanna Klara Bardian<br><strong>zdjęcia:</strong> Augustyn Bardian<br><strong>muzyka:</strong> Tymoteusz Lasik<br><strong>choreografia:</strong> Maja Lewicka<br><strong>scenografia i kostiumy:</strong> Ada Duda<br><strong>charakteryzacja:</strong> Dagmara Kocik<br><br><strong>produkcja:</strong> Zuzanna Klara Bardian, Hanna Seredyńska, Adrian Janisio<br><strong>kierowniczka planu:</strong> Hanna Seredyńska<br><strong>asystentka reżyserki:</strong> Oliwia Piątek<br><strong>asystenci kamery:</strong> Michał Cywiński, Jan Kubica, Piotr Ostrowski<br><strong>ostrzyciele:</strong> Michał Cywiński, Daniel Le Hai<br><strong>dźwięk na planie:</strong> Zlata Veresniak, Mateusz Garbacz, Xawery Kessler<br><strong>mistrzowie oświetlenia:</strong> Szymon Paluch, Michał Matuszewski<br><strong>oświetlacze:</strong> Jacek Dymalski, Adam Jański, Xawery Kessler, Martyna Majcher, Maciek Sozański<br><strong>dyżur:</strong> Karolina Budzisz, Iga Bujarkiewicz, Magdalena Dudziak, Mei Rudomino<br><strong>catering:</strong> Oliwia Piątek, Maciek Sozański, Michał Żłobicki<br><strong>casting:</strong> Maja Lewicka, Zuzanna Klara Bardian<br><strong>pomoc na planie:</strong> Piotr Cieśla, Jacek Dymalski, Adam Jański, Marcin Pawlak, Maciej Samerdak, Maciek Sozański, Robert Węglarz, Mariusz Tadeusz Zimoński, Michał Żłobicki<br><strong>postprodukcja dźwięku:</strong> Piotr Cieśla<br><strong>skrzypce:</strong> Kasia Schulz<br><br><strong>Nagrody:</strong> Grand Prix na Funfest w Portugalii; Grand Prix na 21. Opolskich Lamach; Grand Prix na 16. Kameralnym Lecie; Grand Prix na XX UFF(o)A; Grand Prix na festiwalu Plac Filmowy; Nagroda Jury Młodych na OKFA; II miejsce na 6. Festiwalu Maklaka; wyróżnienie na XIV Konkursie KLAPS; finał World Indie Film Awards; ćwierćfinał SWIFF.",
    },
    comment: {
      en: "Throughout my life, I have often avoided saying “good morning” to my neighbours. Now, I’m making up for it!\n\nBelow is a list of all the people who trusted me and helped bring my vision to life – thank you all so much!",
      pl: "Wiele razy w życiu udało mi się uniknąć powiedzenia „dzień dobry” moim sąsiadom. Teraz nadrabiam.\n\nPoniżej wypisane są wszystkie osoby, które mi zaufały i pomogły spełnić moją wizję, bardzo Wam wszystkim dziękuję!",
    },
    banner: "assets/works/dzien-dobry-2.jpg", // zdjęcie na całą szerokość bloku tekstowego, pod tytułem, przed opisem
    layout: ["title", "meta", "coauthors", "banner", "desc", "video"],
    youtube: "epO8QC-mqRA",
  },
  {
    id: "wlosy",
    image: "assets/works/wlosy-cover.jpg",
    title: { en: "Hair", pl: "Włosy" },
    kind: "6’33’’",
    year: "2019",
    desc: {
      en: "<strong>Shortly about change.</strong>",
      pl: "<strong>Krótko o zmianach.</strong>",
    },
    comment: {
      en: "The day before the first April we took the morning train.\n\nWe stopped in an open field and cut each other's hair.",
      pl: "Dzień przed pierwszym kwietnia wsiadłyśmy w poranny pociąg.\n\nZatrzymałyśmy się w szczerym polu i ścięłyśmy włosy.",
    },
    coauthors: ["Magdalena Kłodnicka", "Zofia Widuch"],
    layout: ["title", "meta", "coauthors", "video", "desc"], // opis i komentarz pod odtwarzaczem
    still: "assets/works/wlosy-still.jpg",
    gallery: [],
    youtube: "Xq-IOVUj-Xk",
  },
  {
    id: "niedorosla",
    image: "assets/works/niedorosla-cover.jpg",
    title: { en: "not grown up", pl: "niedorosła" },
    kind: "2’16’’",
    year: "2023",
    desc: {
      en: "<strong>A story about growing up.</strong>",
      pl: "<strong>Opowieść o dorastaniu.</strong>",
    },
    comment: {
      en: "I made this film at a time when I was working, studying, and changing my place of residence many times.",
      pl: "Ten film zrobiłam w czasie, gdy jednocześnie pracowałam, studiowałam i wielokrotnie zmieniałam miejsce zamieszkania.",
    },
    layout: ["title", "meta", "coauthors", "video", "desc"], // opis i komentarz pod odtwarzaczem
    still: "assets/works/niedorosla-still.jpg",
    gallery: [],
    youtube: "pVHQd7XN5EI",
  },
  {
    id: "u-mnie",
    image: "assets/works/u-mnie-cover.jpg",
    title: { en: "at my place", pl: "u mnie" },
    kind: "10’43’’",
    year: "2021",
    desc: {
      en: "<strong>An impression of the road to happiness.</strong>",
      pl: "<strong>Impresja o drodze do szczęścia.</strong>",
    },
    credits: {
      en: "<strong>Cast:</strong> Zuzanna Klara Bardian, Dawid Ignasiak, Madzia Kłodnicka, Julia Kossowska, Jul Lignarska, Tymon Jan Porębski, Jo Suppan, Janusz Witkowski, Michał Żłobicki<br><br><strong>Script, direction, editing:</strong> Zuzanna Klara Bardian<br><strong>Cinematography:</strong> Jul Lignarska, Zuzanna Klara Bardian<br><strong>Music:</strong> Tymon Jan Porębski, Zuzanna Klara Bardian",
      pl: "<strong>obsada:</strong> Zuzanna Klara Bardian, Dawid Ignasiak, Madzia Kłodnicka, Julia Kossowska, Jul Lignarska, Tymon Jan Porębski, Jo Suppan, Janusz Witkowski, Michał Żłobicki<br><br><strong>scenariusz, reżyseria, montaż:</strong> Zuzanna Klara Bardian<br><strong>zdjęcia:</strong> Jul Lignarska, Zuzanna Klara Bardian<br><strong>muzyka:</strong> Tymon Jan Porębski, Zuzanna Klara Bardian",
    },
    layout: ["title", "meta", "video", "desc"], // odtwarzacz nad opisem
    still: "assets/works/u-mnie-still.jpg",
    gallery: [],
    youtube: "AyBMDP0zNLU",
  },
  {
    id: "spektrum",
    image: "assets/works/spektrum-cover.jpg",
    title: { en: "Świdnica/Spektrum", pl: "Świdnica/Spektrum" },
    kind: "9’23’’",
    year: "2024",
    desc: {
      en: "<strong>A film made for the 10th anniversary of the Spektrum festival in Świdnica.</strong>",
      pl: "<strong>Film z okazji 10-lecia festiwalu Spektrum w Świdnicy.</strong>",
    },
    comment: {
      en: "What I like most about Spektrum is its focus on the local community and how deeply involved Świdnica’s residents are in the festival. When I was asked to make a film for the festival’s 10th anniversary, I centered my film around the city itself and its symbols, which give the festival such a unique atmosphere.",
      pl: "To co mi się najbardziej podoba w Spektrum to skupienie na lokalności oraz ogromne zaangażowanie mieszkańców Świdnicy w życie festiwalu. Gdy poproszono mnie o zrobienie filmu z okazji 10-lecia tego festiwalu, skupiłam się właśnie na mieście i jego symbolach, dzięki którym ten festiwal ma tak wyjątkowy klimat.",
    },
    layout: ["title", "meta", "coauthors", "video", "desc"], // opis i komentarz pod odtwarzaczem
    still: "assets/works/spektrum-1.jpg",
    gallery: [],
    youtube: "mHHk7aLQAio",
  },
];

/* -------------------------------------------------------------------
   5) GAME DESIGN — kafelkowo (jak art works).
   ------------------------------------------------------------------- */
const GAMES = [
  {
    id: "julthecooladventure",
    image: "assets/works/julthecool.jpg",
    title: "JulTheCoolAdventure",
    kind: "Point&Click",
    year: "2022",
    desc: { en: "", pl: "" },
    gallery: [],
    youtube: "",
  },
  {
    id: "gleboko-koncept",
    image: "assets/works/gleboko.jpg",
    title: { en: "deep – concept", pl: "głęboko – koncept" },
    kind: { en: "character sketches", pl: "szkice postaci" },
    year: "2020",
    desc: { en: "", pl: "" },
    gallery: [
      "assets/works/gleboko-2.jpg",
      "assets/works/gleboko-3.jpg",
      "assets/works/komentarz.jpg",
      "assets/works/komentarz-2.jpg",
      "assets/works/komentarz-3.jpg",
      "assets/works/komentarz-4.jpg",
      "assets/works/komentarz-5.jpg",
      "assets/works/komentarz-6.jpg",
      "assets/works/komentarz-7.jpg",
    ],
    youtube: "",
  },

  /* ---- gry wielkoformatowe zrobione dla Fundacji Good Culture (Good Games) ---- */
  {
    id: "ukryte-gusla",
    image: "assets/works/ukryte-gusla.jpg",
    title: { en: "Hidden Charms", pl: "Ukryte gusła" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2026",
    desc: {
      en: "A large-format game about forgotten Podlasie customs. Under the guidance of a folk healer (Szeptucha), players set off on a journey through the surrounding roadside chapels.\n\nMade as part of my work for the Good Culture Foundation and the public library in Poświętne.",
      pl: "Wielkoformatowa gra o zapomnianych podlaskich zwyczajach. Za sprawą Szeptuchy gracze ruszają w podróż po okolicznych kapliczkach.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Gminnej Biblioteki Publicznej w Poświętnem.",
    },
    comment: {
      en: "The project draws on existing chapels around Poświętne and on ethnographic museum exhibits.",
      pl: "W projekcie nawiązałam do istniejących kapliczek w okolicach Poświętnego oraz muzealnych etnograficznych eksponatów.",
    },
    gallery: ["assets/works/ukryte-gusla-2.jpg", "assets/works/ukryte-gusla-3.jpg", "assets/works/ukryte-gusla-4.jpg", "assets/works/ukryte-gusla-5.jpg"],
    youtube: "",
  },
  {
    id: "opowiesci-z-gwiezdnego-miasta",
    image: "assets/works/opowiesci-z-gwiezdnego-miasta.jpg",
    title: { en: "Tales from the Star City", pl: "Opowieści z Gwiezdnego Miasta" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "Under Starachowice lies a hidden Star that the witches covet. The players collect artefacts to stop them.\n\nMade as part of my work for the Good Culture Foundation and the public library in Starachowice.",
      pl: "Pod Starachowicami jest ukryta Gwiazda, której pragną wiedźmy. Gracze zbierają artefakty, żeby je powstrzymać.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejskiej Biblioteki Publicznej w Starachowicach.",
    },
    comment: {
      en: "The game was designed on the basis of a competition for a legend written in modern times.",
      pl: "Gra została zaprojektowana na podstawie konkursu na współcześnie napisaną legendę.",
    },
    gallery: ["assets/works/opowiesci-z-gwiezdnego-miasta-2.jpg", "assets/works/opowiesci-z-gwiezdnego-miasta-3.jpg", "assets/works/opowiesci-z-gwiezdnego-miasta-4.jpg", "assets/works/opowiesci-z-gwiezdnego-miasta-5.jpg"],
    youtube: "",
  },
  {
    id: "koraliki-nasze-tradycje",
    image: "assets/works/koraliki-nasze-tradycje.jpg",
    title: { en: "Beads. Our Traditions", pl: "Koraliki. Nasze Tradycje" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "The players take on the roles of families resettled from Bukovina to the Recovered Territories. The task is to assimilate with the local residents as much as possible.\n\nMade as part of my work for the Good Culture Foundation and the cultural centre in Jastrowie.",
      pl: "Gracze wcielają się w rodziny przesiedlonych z Bukowiny na Ziemie Odzyskane. Zadaniem jest jak największa asymilacja z lokalnymi mieszkańcami.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Ośrodka Kultury w Jastrowiu.",
    },
    comment: {
      en: "The aim of the project was to interest children and young people in the local history of the Bukovinians. Visually, the game was meant to resemble Minecraft, so I combined pixel art with traditional embroidery and other elements of tradition.",
      pl: "Założeniem projektu było zainteresowanie dzieci i młodzieży lokalną historią Bukowińczyków. Wizualnie gra miała przypominać Minecrafta, więc połączyłam pixelart z tradycyjnymi haftami i innymi elementami tradycji.",
    },
    gallery: ["assets/works/koraliki-nasze-tradycje-2.jpg", "assets/works/koraliki-nasze-tradycje-3.jpg", "assets/works/koraliki-nasze-tradycje-4.jpg", "assets/works/koraliki-nasze-tradycje-5.jpg"],
    youtube: "",
  },
  {
    id: "pogromcy-chelminskich-demonow",
    image: "assets/works/pogromcy-chelminskich-demonow.jpg",
    title: { en: "Slayers of the Chełmno Demons", pl: "Pogromcy chełmińskich demonów" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "Demons known until now only from stories have begun to haunt your villages, frighten people at night and spread disease. Your task is to defeat them together.\n\nMade as part of my work for the Good Culture Foundation and the public library in Kijewo Królewskie.",
      pl: "Demony do tej pory znane tylko z opowieści zaczęły nawiedzać wasze miejscowości, straszyć po nocach i szerzyć choroby. Waszym zadaniem jest wspólnie je pokonać.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Gminnej Biblioteki Publicznej w Kijewie Królewskim.",
    },
    comment: {
      en: "The images of the demons are based on the book by Natalia Zacharek and Anna Koprowska.",
      pl: "Wizerunki demonów są stworzone na podstawie książki Natalii Zacharek i Anny Koprowskiej.",
    },
    gallery: ["assets/works/pogromcy-chelminskich-demonow-2.jpg", "assets/works/pogromcy-chelminskich-demonow-3.jpg", "assets/works/pogromcy-chelminskich-demonow-4.jpg", "assets/works/pogromcy-chelminskich-demonow-5.jpg"],
    youtube: "",
  },
  {
    id: "utopce-z-myslowic",
    image: "assets/works/utopce-z-myslowic.jpg",
    title: { en: "The Utopce of Mysłowice and the Robbers’ Treasure", pl: "Utopce z Mysłowic i skarb rozbójników" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "The emperor of the utopce reveals the way to a legendary treasure, but before you reach it you have to prepare for a crossing through the marshes.\n\nMade as part of my work for the Good Culture Foundation and the public library in Mysłowice.",
      pl: "Cesarz utopców zdradza Wam drogę do legendarnego skarbu, ale zanim się do niego dorwiecie, musicie przygotować się na przeprawę przez bagna.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejskiej Biblioteki Publicznej w Mysłowicach.",
    },
    gallery: ["assets/works/utopce-z-myslowic-2.jpg", "assets/works/utopce-z-myslowic-3.jpg", "assets/works/utopce-z-myslowic-4.jpg", "assets/works/utopce-z-myslowic-5.jpg"],
    youtube: "",
  },
  {
    id: "w-poszukiwaniu-kwiatu-paproci",
    image: "assets/works/w-poszukiwaniu-kwiatu-paproci.jpg",
    title: { en: "In Search of the Fern Flower", pl: "W poszukiwaniu kwiatu paproci" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "During Midsummer Night the players race through the forest in search of the fern flower, before the sun rises.\n\nMade as part of my work for the Good Culture Foundation and the cultural centre in Kiernozia.",
      pl: "W czasie nocy świętojańskiej gracze ścigają się przez las w poszukiwaniu kwiatu paproci, zanim wzejdzie słońce.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejsko-Gminnego Ośrodka Kultury w Kiernozi.",
    },
    gallery: ["assets/works/w-poszukiwaniu-kwiatu-paproci-2.jpg", "assets/works/w-poszukiwaniu-kwiatu-paproci-3.jpg", "assets/works/w-poszukiwaniu-kwiatu-paproci-4.jpg", "assets/works/w-poszukiwaniu-kwiatu-paproci-5.jpg"],
    youtube: "",
  },
  {
    id: "wygraj-bezpieczenstwo",
    image: "assets/works/wygraj-bezpieczenstwo.jpg",
    title: { en: "Win Safety!", pl: "Wygraj bezpieczeństwo!" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "The players deliver birthday invitations by bike and try to make it back in time for the cake, while obeying the rules of the road.\n\nMade as part of my work for the Good Culture Foundation and the Rural Women’s Association in Wygnanka.",
      pl: "Gracze rozwożą rowerem urodzinowe zaproszenia i starają się zdążyć na tort, przestrzegając zasad ruchu drogowego.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Koła Gospodyń Wiejskich w Wygnance.",
    },
    gallery: ["assets/works/wygraj-bezpieczenstwo-2.jpg", "assets/works/wygraj-bezpieczenstwo-3.jpg", "assets/works/wygraj-bezpieczenstwo-4.jpg", "assets/works/wygraj-bezpieczenstwo-5.jpg"],
    youtube: "",
  },
  {
    id: "na-dozynki-z-reymontem",
    image: "assets/works/na-dozynki-z-reymontem.jpg",
    title: { en: "To the Harvest Festival with Reymont!", pl: "Na dożynki z Reymontem!" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "The village of Wierzchosławice is getting ready for Władysław Reymont’s visit to the harvest festival. Whoever gathers the needed artefacts first will welcome the guest.\n\nMade as part of my work for the Good Culture Foundation and the public library in Wierzchosławice.",
      pl: "Wierzchosławice szykują się na przyjazd Władysława Reymonta na dożynki. Kto szybciej zbierze potrzebne artefakty, powita gościa.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Gminnej Biblioteki Publicznej w Wierzchosławicach.",
    },
    gallery: ["assets/works/na-dozynki-z-reymontem-2.jpg", "assets/works/na-dozynki-z-reymontem-3.jpg", "assets/works/na-dozynki-z-reymontem-4.jpg", "assets/works/na-dozynki-z-reymontem-5.jpg"],
    youtube: "",
  },
  {
    id: "po-wolnosc-czerwony-bor-44",
    image: "assets/works/po-wolnosc-czerwony-bor-44.jpg",
    title: { en: "To Freedom! Czerwony Bór ’44", pl: "Po wolność! Czerwony Bór ’44" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2024",
    desc: {
      en: "The players race a German train to warn a unit hidden in the forest.\n\nMade as part of my work for the Good Culture Foundation and the public library in Łomża.",
      pl: "Gracze ścigają się z niemieckim pociągiem, aby ostrzec przed nim oddział ukryty w lesie.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejskiej Biblioteki Publicznej w Łomży.",
    },
    gallery: ["assets/works/po-wolnosc-czerwony-bor-44-2.jpg", "assets/works/po-wolnosc-czerwony-bor-44-3.jpg", "assets/works/po-wolnosc-czerwony-bor-44-4.jpg", "assets/works/po-wolnosc-czerwony-bor-44-5.jpg"],
    youtube: "",
  },
  {
    id: "helskie-drogi",
    image: "assets/works/helskie-drogi.jpg",
    title: { en: "Roads of Hel", pl: "Helskie drogi" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2024",
    desc: {
      en: "Time travel goes wrong, so the players have to gather memories of the defence of the peninsula in 1939 in order to return.\n\nMade as part of my work for the Good Culture Foundation and the public library in Hel.",
      pl: "Podróż w czasie się nie udaje, gracze muszą zebrać wspomnienia z obrony półwyspu w 1939 roku, żeby wrócić.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejskiej Biblioteki Publicznej im. Stefana Żeromskiego w Helu.",
    },
    comment: {
      en: "The illustrations are modelled on archival photographs from Hel.",
      pl: "Ilustracje wzorowane są na archiwalnych zdjęciach z Helu.",
    },
    gallery: ["assets/works/helskie-drogi-2.jpg", "assets/works/helskie-drogi-3.jpg", "assets/works/helskie-drogi-4.jpg", "assets/works/helskie-drogi-5.jpg"],
    youtube: "",
  },
  {
    id: "archiwum-czasu",
    image: "assets/works/archiwum-czasu.jpg",
    title: { en: "Time Archive. The Library Gnomes United", pl: "Archiwum Czasu. Zjednoczenie Krasnoludków Bibliotecznych" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2024",
    desc: {
      en: "One morning a huge mess appears in the library. The players have to win over the library gnomes and set things in order.\n\nMade as part of my work for the Good Culture Foundation and the city library in Grudziądz.",
      pl: "Pewnego ranka w bibliotece powstał ogromny bałagan. Zadaniem graczy jest udobruchanie krasnoludków bibliotecznych i zrobienie porządku.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Biblioteki Miejskiej im. Wiktora Kulerskiego w Grudziądzu.",
    },
    gallery: ["assets/works/archiwum-czasu-2.jpg", "assets/works/archiwum-czasu-3.jpg", "assets/works/archiwum-czasu-4.jpg", "assets/works/archiwum-czasu-5.jpg"],
    youtube: "",
  },
  {
    id: "magiczny-zdroj",
    image: "assets/works/magiczny-zdroj.jpg",
    title: { en: "Magic Spring", pl: "Magiczny Zdrój" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2024",
    desc: {
      en: "A curse is drying out the world. The players collect drops of healing water to bring the statue of Henryk Wieniawski back to life.\n\nMade as part of my work for the Good Culture Foundation and the “Zdrojoteka” library in Szczawno-Zdrój.",
      pl: "Klątwa wysusza świat. Gracze zbierają krople uzdrawiającej wody, żeby ożywić pomnik Henryka Wieniawskiego.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Miejskiej Biblioteki Publicznej Zdrojoteka w Szczawnie-Zdroju.",
    },
    gallery: ["assets/works/magiczny-zdroj-2.jpg", "assets/works/magiczny-zdroj-3.jpg", "assets/works/magiczny-zdroj-4.jpg", "assets/works/magiczny-zdroj-5.jpg"],
    youtube: "",
  },
  {
    id: "strajk-szpularek-1883",
    image: "assets/works/strajk-szpularek-1883.jpg",
    title: { en: "The Spool Winders’ Strike 1883", pl: "Strajk Szpularek 1883" },
    kind: { en: "large-format board game", pl: "gra wielkoformatowa" },
    year: "2025",
    desc: {
      en: "A strike at the linen factory in Żyrardów, 1883. The players form a strike committee and win support from other departments of the factory.\n\nMade as part of my work for the Good Culture Foundation and the Linen Museum in Żyrardów.",
      pl: "Strajk w fabryce lnu w Żyrardowie, 1883 rok. Gracze tworzą komitet strajkowy i zdobywają poparcie innych oddziałów fabryki.\n\nProjekt zrobiony w ramach pracy dla Fundacji Good Culture i Muzeum Lniarstwa im. Filipa de Girarda w Żyrardowie.",
    },
    comment: {
      en: "The board is based on the original layout of the factory town.",
      pl: "Plansza bazuje na oryginalnym rozplanowaniu fabrycznego miasteczka.",
    },
    gallery: ["assets/works/strajk-szpularek-1883-2.jpg", "assets/works/strajk-szpularek-1883-3.jpg", "assets/works/strajk-szpularek-1883-4.jpg", "assets/works/strajk-szpularek-1883-5.jpg"],
    youtube: "",
  },
];

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
     "video"     – film (z YouTube, jeśli podano "youtube", albo własny plik, jeśli podano "video")

   Przykłady (wpisz jako pole pracy, np. layout: [...]):
     ["title", "desc", "hero", "gallery"]   → tytuł i opis NA GÓRZE
     ["hero"]                                → tylko duże zdjęcie
     ["gallery"]                             → tylko galeria (wszystkie zdjęcia)
     ["hero", "title", "desc"]               → zdjęcie, potem tytuł i opis

   Uwaga: odnośnik "inne projekty" jest ZAWSZE na samej górze.
   Galeria pokazuje wszystkie zdjęcia z pola "gallery".
   ------------------------------------------------------------------- */
const DEFAULT_WORK_LAYOUT = ["title", "meta", "coauthors", "desc", "hero", "gallery", "video"];

/* -------------------------------------------------------------------
   6) BIO — zdjęcie, tekst o Tobie, listy osiągnięć
   Listy: zwykły tekst jest wspólny dla obu języków (nazwy własne wystaw
   i festiwali); pozycja { en: "...", pl: "..." } pokazuje się w swoim języku.
   Nagłówki sekcji tłumaczą się automatycznie (patrz I18N wyżej).
   ------------------------------------------------------------------- */
const BIO = {
  photo: "assets/bio.jpg",
  text: {
    en: "She was born in Wrocław in 2000. She graduated with a Bachelor's degree in Industrial Design and a Master's degree in Media Art from the Eugeniusz Geppert Academy of Fine Arts. She currently lives and works in Wrocław.\n\nHer artistic practice explores the relationships we have and the effort we put into learning what should come naturally and intuitively to us.",
    pl: "Urodzona we Wrocławiu w 2000 roku. Ukończyła Sztukę Mediów oraz Wzornictwo na Akademii Sztuk Pięknych im. Eugeniusza Gepperta. Mieszka i pracuje we Wrocławiu.\n\nW swojej praktyce twórczej bada relacje i&nbsp;wysiłek, jaki wkładamy w&nbsp;naukę tego, co powinno być dla nas naturalne i&nbsp;intuicyjne.",
  },
  // wyróżniony cytat pod zdjęciem (kursywa, kolor akcentu)
  quote: {
    en: "By education, I am an artist; by profession, a designer; and by passion, I talk to strangers.\n\nI usually prefer listening to talking, but I talk most about what I have observed. I love everyday situations, human problems, and the human body.",
    pl: "Jestem artystką z&nbsp;wykształcenia, projektantką z&nbsp;zawodu, a&nbsp;z&nbsp;pasji rozmawiam z&nbsp;nieznajomymi.\n\nZwykle wolę słuchać niż mówić, ale najwięcej opowiadam o&nbsp;tym, co zaobserwowałam. Uwielbiam codzienne sytuacje, ludzkie problemy i&nbsp;ciało.",
  },
  exhibitions: [
    {
      en: "Volumina | Escuela Nacional de Artes Cinematográficas UNAM, Mexico City, 2026",
      pl: "Volumina | Escuela Nacional de Artes Cinematográficas UNAM, Mexico City, 2026",
    },
    "Znaki Płynne | Galeria ArtBrut, Wrocław, 2026",
    {
      en: "ArtTechScience | Wrocław University of Science and Technology, Wrocław, 2025",
      pl: "ArtTechScience | Politechnika Wrocławska, Wrocław, 2025",
    },
    {
      en: "Masa Krytyczna, Museum Night | Teatr Dialogu, Wrocław, 2025",
      pl: "Masa Krytyczna, Noc Muzeów | Teatr Dialogu, Wrocław, 2025",
    },
    "Random Check 7 „Time Crystals” | Musica Electronica Nova, KAF Digital Space, Wrocław, 2025",
    "Co się dzieje w łazience | Ołbiński CAL, Wrocław, 2025",
    "Slot Art Festival: Połączenia | Lubiąż, 2025",
    "Ołbiński Spacer Filmowy | Spółdzielnia Kinowa, Wrocław, 2024",
    "Bilet do Kina „Dzień dobry” | Galeria za Rogiem, Piaseczno, 2024",
    "Open Call Dot(y)kliwość | Sopot, 2024",
    "koncert audiowizualny Chimera | Teatr Dialogu, Wrocław, 2024",
    "Burton, Burton, Burton! | Kino Nowe Horyzonty, Wrocław, 2024",
    "Plakat Zaangażowany | Bulvary, Wrocław, 2024",
    "Open Eyes Art Festival | Kraków, 2022",
    "koncert audiowizualny Dis-reality | WWFF, Wrocław, 2023",
    "Wystawa konkursu Matematyka i Sztuka | Instytut Matematyczny UWr, Wrocław, 2023",
    "Mesh Creative Challenge #4 Distorted Perception | online, 2023",
    "4. International Triennale Media Art | Radom, 2021",
  ],
  festivals: [
    "the Women International Film Festival (WIFF), Islamabad, Pakistan, 2024",
    "Funfest International Video Festival, Madera, Portugalia, 2024",
    "The International Short Film Festival „Nuit Trop Courte”, Grenoble, Francja, 2024",
    "Yeast International Student Film Festival, Limassol, Cypr, 2024",
    "World Indie Film Awards, online, Włochy, 2024",
    "Student Cuts Film Festival, Ljutomer, Słowenia, 2024",
    "Youality, Chantilly, Francja, 2024",
    "Reel Rythm Music & Film Festival, Killeen, USA, 2024",
    "streetside cinema/, Winston-Salem, USA, 2023–2024",
    "OKFA, Konin, 2020, 2021, 2024",
    "Szklarnia, Toruń, 2024",
    "BAZA, Poznań, 2024",
    "Pyszadło, Mogilno, 2024",
    "INDEPENDEAST, Suwałki, 2024",
    "3. Himachal Short Film Festival, Manali, Indie, 2023",
    "Chania Film Festival, Chania, Grecja, 2023",
    "The AIU Film Festival, Jahra, Kuwejt, 2023",
    "Student World Impact Film Festival, online, USA, 2023",
    "Opolskie Lamy, Opole, 2020, 2021, 2023",
    "KLAPS, Bydgoszcz, 2023",
    "UFF(o)A, Ustka, 2023",
    "Kameralne Lato, Radom, 2023",
    "Kocham Dziwne Kino, Pabianice, 2023",
    "Maklak i jego przyjaciele, Konstancin-Jeziorna, 2023",
    "TOSIEK, Skierniewice, 2023",
    "FRAPY, Gorzów, 2023",
    "Plac Filmowy, Lublin, 2023",
    "Euroshorts, Gdańsk, 2023",
    "Młodzi i Film, Koszalin, 2021",
    "Spektrum, Świdnica, 2020",
  ],
  awards: [
    {
      en: "Scholarship of the Minister of Culture and National Heritage | 2024",
      pl: "Stypendium Ministra Kultury i Dziedzictwa Narodowego | 2024",
    },
    {
      en: "Scholarship of the Rector of the Academy of Fine Arts in Wrocław | 2024, 2021",
      pl: "Stypendium Rektora Akademii Sztuk Pięknych we Wrocławiu | 2024, 2021",
    },
    "The Best Short Film + Jury Award + Public Choice Award | 5th Nawada International Film Festival, 2024",
    "Best Director | San Luis Festival, 2024",
    "GRAND PRIX | Madeira FUNFEST, 2024",
    {
      en: "GRAND PRIX | 21st Opolskie Lamy Festival, 2024",
      pl: "GRAND PRIX | 21. Festiwal Opolskie Lamy, 2024",
    },
    {
      en: "GRAND PRIX | HYDE PARK FREEDOM Film Festival (16th Kameralne Lato), 2024",
      pl: "GRAND PRIX | HYDE PARK FREEDOM Film Festiwal (16. Kameralne Lato), 2024",
    },
    {
      en: "GRAND PRIX | 20th UFF(o)A Amateur Film Festival, Ustka, 2024",
      pl: "GRAND PRIX | XX Ustecki Festiwal Filmów Amatorskich UFF(o)A, 2024",
    },
    {
      en: "GRAND PRIX | „Plac Filmowy” competition in Lublin, 2024",
      pl: "GRAND PRIX | konkurs „Plac Filmowy” w Lublinie, 2024",
    },
    {
      en: "Young Jury Award | OKFA festival in Konin, 2024",
      pl: "Nagroda Jury Młodych | festiwal OKFA w Koninie, 2024",
    },
    {
      en: "2nd place | 6th Maklak and His Friends Festival, Konstancin-Jeziorna, 2023",
      pl: "II miejsce | 6. Festiwal Maklaka i jego przyjaciół, Konstancin-Jeziorna, 2023",
    },
  ],
  education: [
    {
      en: "2023–2025 — Master of Media Art, Academy of Fine Arts in Wrocław, Poland",
      pl: "2023–2025 — Sztuka Mediów II stopnia, Akademia Sztuk Pięknych we Wrocławiu",
    },
    {
      en: "2021–2022 — Sound and Image + Industrial Design, Politécnico de Leiria, Portugal (Erasmus+)",
      pl: "2021–2022 — Sound and Image + Industrial Design, Politécnico de Leiria, Portugalia (Erasmus+)",
    },
    {
      en: "2019–2022 — Bachelor of Industrial Design, Academy of Fine Arts in Wrocław, Poland",
      pl: "2019–2022 — Wzornictwo I stopnia, Akademia Sztuk Pięknych we Wrocławiu, Polska",
    },
  ],
};
