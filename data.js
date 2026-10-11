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
    photo_by: "photo by",          // podpis fotografa po najechaniu na zdjęcie
    coauthors: "co-creators",       // współtwórczynie / współtwórcy
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
    photo_by: "fot.",              // podpis fotografa po najechaniu na zdjęcie
    coauthors: "współtwórczynie",    // współtwórczynie / współtwórcy
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
  { key: "nav_artworks", href: "artworks.html" },   // prace / art works
  { key: "nav_videos",   href: "videos.html" },     // filmy / video
  { key: "nav_games",    href: "game-design.html" },// game design
  { key: "nav_bio",      href: "bio.html" },         // bio (na końcu)
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
const ARTWORKS = [
  {
    // brak zdjęcia — kafelek pokaże sam tytuł (dodaj "image", gdy będzie gotowe)
    id: "co-sie-dzieje-w-lazience",
    title: { en: "what happens in the bathroom", pl: "co się dzieje w łazience" },
    kind: { en: "audiovisual event", pl: "wydarzenie audiowizualne" },
    year: "2025",
    desc: {
      en: "Did you know that the bathroom was originally not a private place but a social one? Its Polish name comes from the Proto-Slavic bathhouse: a dugout filled with hot steam, entered through a small opening. People went there not only for hygiene but also to take care of their relationships.\n\nOn 6 June 2025 we symbolically returned to those roots, meeting in Wrocław at the Ołbin community centre for an audiovisual event. Instead of steam we were surrounded by ambient music played by Adam Jański, and water was replaced by my liquid visuals played live in the Liquid Light Show technique.\n\nThe project was my Master’s diploma in Media Art at the Academy of Fine Arts in Wrocław, supervised by Irmina Rusicka.",
      pl: "Czy wiesz, że łazienka pierwotnie nie była miejscem prywatnym, ale społecznym? Jej nazwa pochodzi od prasłowiańskiej łaźni, ziemianki wypełnionej gorącą parą, do której wchodziło się przez mały otwór. Łaziło się tam nie tylko po to, żeby dbać o higienę, ale również by dbać o relacje towarzyskie.\n\n6 czerwca 2025 symbolicznie wróciliśmy do korzeni, spotykając się we Wrocławiu w Ołbińskim CAL na audiowizualnym wydarzeniu. Zamiast pary otoczył nas ambient grany przez Adama Jańskiego, a wodę zastąpiły moje płynne wizuale grane na żywo w technice Liquid Light Show.\n\nProjekt zrealizowany w ramach magisterskiego dyplomu Sztuki Mediów na ASP we Wrocławiu pod opieką Irminy Rusickiej.",
    },
    gallery: [],
    youtube: "HFcWhHZqEoo",
  },
  {
    id: "heliosfera",
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
    ],
    youtube: "VCEsnVD0b-0",
  },
  {
    id: "odwaznik",
    title: { en: "The Weight", pl: "Odważnik" },
    kind: { en: "interactive object", pl: "obiekt interaktywny" },
    year: "2024",
    image: { src: "assets/works/odwaznik.jpg", photo: "Julia Lignarska" },
    desc: {
      en: "Using stickers pasted up around different cities, I collected over 150 anonymous answers to the question: What is hard for you to say to another person? I recorded the gathered answers as quiet audio and placed it inside a large, soft object that you have to hug in order to get used to what is hard to say.\n\nRecycled fabrics, wadding, speaker | 40×40×90 cm",
      pl: "Za pomocą wlep rozklejonych po różnych miastach zebrałam ponad 150 anonimowych odpowiedzi na pytanie: Co trudno Ci powiedzieć drugiej osobie? Zebrane odpowiedzi nagrałam w formie cichego audio i umieściłam w miękkim obiekcie, który trzeba przytulić, by oswoić się z tym, co trudne do powiedzenia.\n\nTkaniny z odzysku, watolina, głośnik | 40×40×90 cm",
    },
    gallery: [{ src: "assets/works/odwaznik-2.jpg", photo: "Julia Lignarska" }],
    youtube: "HEyZBspXOKg", // fragment audio
  },
  {
    id: "co-trudno-ci-powiedziec",
    title: { en: "What is difficult for you to say to another person?", pl: "Co trudno Ci powiedzieć drugiej osobie?" },
    kind: { en: "interactive project, stickers", pl: "projekt interaktywny, wlepy" },
    year: "2024",
    image: "assets/works/co-trudno.jpg",
    desc: {
      en: "Using stickers with a QR code linked to a survey, I received many responses to this question. The answers are funny, intimate, sad and moving, and I can relate to most of them. What connects us is a problem with communication. Collecting these answers is the first part of a project that tries to tame what is difficult. The second part is The Weight.",
      pl: "Za pomocą wlep z kodem QR do ankiety otrzymałam wiele odpowiedzi na to pytanie. Odpowiedzi są zabawne, intymne, smutne, poruszające, a z większością z nich mogę się utożsamić. Łączy nas problem z komunikacją. Zebranie tych odpowiedzi to pierwsza część projektu próbującego oswoić to, co trudne. Druga część to Odważnik.",
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
    image: { src: "assets/works/czuja.jpg", photo: "Jul Lignarska" },
    title: "czuja",
    kind: { en: "set of objects", pl: "zestaw obiektów" },
    year: "2021",
    desc: {
      en: "A set of objects for exploring your own body. It helps shift attention from how we look to what we feel.",
      pl: "Zestaw obiektów do eksplorowania swojego ciała. Pomaga przekierować uwagę z tego, jak wyglądamy, na to, co czujemy.",
    },
    gallery: [
      { src: "assets/works/czuja-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/czuja-3.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/czuja-4.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "zOUP6Z1JkCQ",
  },
  {
    id: "wysluchaj",
    image: { src: "assets/works/wysluchaj.jpg", photo: "Jul Lignarska" },
    title: { en: "listen", pl: "wysłuchaj" },
    kind: { en: "set of objects", pl: "zestaw obiektów" },
    year: "2022",
    desc: {
      en: "A set for listening to another person.",
      pl: "Zestaw do słuchania drugiej osoby.",
    },
    gallery: [
      { src: "assets/works/wysluchaj-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/wysluchaj-3.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "u1KtiKnE5_U",
  },
  {
    id: "rosne-i-sie-krztusze",
    image: { src: "assets/works/rosne.jpg", photo: "Irka Wypych" },
    title: { en: "I'm growing and choking", pl: "rosnę i się krztuszę" },
    kind: { en: "audiovisual", pl: "audiowizual" },
    year: "2024",
    desc: {
      en: "An audiovisual work about growth that hurts — expanding and being constrained at the same time.",
      pl: "Praca audiowizualna o wzroście, który boli — o rozrastaniu się i duszeniu jednocześnie.",
    },
    gallery: [
      { src: "assets/works/rosne-2.jpg", photo: "Irka Wypych" },
      { src: "assets/works/rosne-3.jpg", photo: "Irka Wypych" },
      { src: "assets/works/rosne-4.jpg", photo: "Marcin Rupociński" },
    ],
    youtube: "",
  },
  {
    id: "snilo-mi-sie-ryba",
    image: "assets/works/ryba.jpg",
    title: { en: "I had a dream that I am a fish and you are touching me", pl: "śniło mi się że jestem rybą i mnie dotykasz" },
    kind: { en: "audiovisual", pl: "audiowizual" },
    year: "2024",
    desc: {
      en: "An audiovisual piece about closeness, water and the body — a dream where touch and breathing blur into one another.",
      pl: "Praca audiowizualna o bliskości, wodzie i ciele — sen, w którym dotyk i oddech zlewają się w jedno.",
    },
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
    image: "assets/works/plyne.jpg",
    title: { en: "I don't say much and I float a lot", pl: "ostatnio mało mówię i trochę płynę" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2025",
    desc: {
      en: "A series of photographs about silence, weightlessness and letting go.",
      pl: "Cykl fotografii o ciszy, nieważkości i odpuszczaniu.",
    },
    gallery: ["assets/works/plyne-2.jpg", "assets/works/plyne-3.jpg"],
    youtube: "",
  },
  {
    id: "powiedzialam-nie-jestem-pewna",
    image: { src: "assets/works/niepewna.jpg", photo: "Zuzanna Klara Bardian" },
    title: { en: "I said I'm not sure", pl: "powiedziałam, że nie jestem pewna" },
    kind: { en: "photographs", pl: "fotografie" },
    year: "2023",
    desc: { en: "", pl: "" },
    gallery: [
      { src: "assets/works/niepewna-2.jpg", photo: "Zuzanna Klara Bardian" },
      "assets/works/niepewna-3.jpg",
      "assets/works/niepewna-4.jpg",
    ],
    youtube: "",
  },
  {
    id: "bukiet",
    image: { src: "assets/works/bukiet.jpg", photo: "Jul Lignarska" },
    title: { en: "Bouquet", pl: "Bukiet" },
    kind: { en: "dry non-alcoholic drink design", pl: "projekt wytrawnego napoju bezalkoholowego" },
    year: "2024",
    desc: {
      en: "A dry non-alcoholic drink design — a small ritual of taste built from fruit, herbs and warmth.",
      pl: "Projekt wytrawnego napoju bezalkoholowego — mały rytuał smaku zbudowany z owoców, ziół i ciepła.",
    },
    gallery: [
      { src: "assets/works/bukiet-2.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/bukiet-3.jpg", photo: "Jul Lignarska" },
      { src: "assets/works/bukiet-4.jpg", photo: "Jul Lignarska" },
    ],
    youtube: "",
  },
];

/* -------------------------------------------------------------------
   4) FILMY (VIDEOS) — kadry z filmów, kafelkowo (jak art works)
   Te same pola co wyżej. Tu zwykle wypełniasz pole "youtube".
   ------------------------------------------------------------------- */
const VIDEOS = [
  {
    id: "dzien-dobry",
    image: "assets/works/dzien-dobry.jpg",
    title: { en: "Good Morning", pl: "Dzień dobry" },
    kind: { en: "short film", pl: "film krótkometrażowy" },
    year: "2023",
    desc: {
      en: "A film about the fear of one’s own neighbours. 5’13’’.\n\nScript, production, direction, editing: Zuzanna Klara Bardian. Cinematography: Augustyn Bardian. Music: Tymoteusz Lasik. Choreography: Maja Lewicka. Set and costumes: Adrianna Duda.\n\nAwards: Grand Prix, Funfest, Madeira; Grand Prix, 21st Opolskie Lamy; Grand Prix, 16th Kameralne Lato; Grand Prix, 20th UFF(o)A; Grand Prix, Plac Filmowy, Lublin; Young Jury Award, OKFA; 2nd place, 6th Maklak Festival; honourable mention, 14th KLAPS; finalist, World Indie Film Awards; quarter-finalist, SWIFF.",
      pl: "Film o strachu przed własnymi sąsiadami. 5’13’’.\n\nScenariusz, produkcja, reżyseria, montaż: Zuzanna Klara Bardian. Zdjęcia: Augustyn Bardian. Muzyka: Tymoteusz Lasik. Choreografia: Maja Lewicka. Scenografia i kostiumy: Adrianna Duda.\n\nNagrody: Grand Prix na Funfest w Portugalii; Grand Prix na 21. Opolskich Lamach; Grand Prix na 16. Kameralnym Lecie; Grand Prix na XX UFF(o)A; Grand Prix na festiwalu Plac Filmowy; Nagroda Jury Młodych na OKFA; II miejsce na 6. Festiwalu Maklaka; wyróżnienie na XIV Konkursie KLAPS; finał World Indie Film Awards; ćwierćfinał SWIFF.",
    },
    gallery: [
      "assets/works/dzien-dobry-1.jpg",
      "assets/works/dzien-dobry-2.jpg",
      "assets/works/dzien-dobry-3.jpg",
      "assets/works/dzien-dobry-plakat.jpg",
    ],
    youtube: "epO8QC-mqRA",
  },
  {
    id: "wlosy",
    image: "assets/works/wlosy.jpg",
    title: { en: "Hair", pl: "Włosy" },
    kind: { en: "short film", pl: "film krótkometrażowy" },
    year: "2019",
    desc: {
      en: "Three high-school graduates shave their heads in the middle of a bald field.",
      pl: "Trzy maturzystki golą głowy na środku łysego pola.",
    },
    coauthors: ["Magdalena Kłodnicka", "Zofia Widuch"],
    gallery: ["assets/works/wlosy-plakat.jpg"],
    youtube: "Xq-IOVUj-Xk",
  },
  {
    id: "chimera",
    image: "assets/works/chimera.jpg",
    title: "Chimera",
    kind: { en: "audiovisual concert", pl: "koncert audiowizualny" },
    year: "2024",
    desc: {
      en: "An audiovisual concert performed at Teatr Dialogu in Wrocław.",
      pl: "Koncert audiowizualny zaprezentowany w Teatrze Dialogu we Wrocławiu.",
    },
    gallery: [],
    youtube: "",
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
    gallery: ["assets/works/gleboko-2.jpg", "assets/works/gleboko-3.jpg"],
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
    pl: "Urodzona we Wrocławiu w 2000 roku. Ukończyła Wzornictwo na Akademii Sztuk Pięknych im. Eugeniusza Gepperta, obecnie studiuje Sztukę Mediów na tej samej uczelni. Mieszka i pracuje we Wrocławiu.\n\nW swojej praktyce twórczej bada relacje i wysiłek, jaki wkładamy w naukę tego, co powinno być dla nas naturalne i intuicyjne.",
  },
  exhibitions: [
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
    "3. Himachal Short Film Festival, Manali, Indie, 2023",
    "Chania Film Festival, Chania, Grecja, 2023",
    "The AIU Film Festival, Jahra, Kuwejt, 2023",
    "Student World Impact Film Festival, online, USA, 2023",
  ],
  awards: [
    "Stypendium Ministra Kultury i Dziedzictwa Narodowego | 2024",
    "Stypendium Rektora Akademii Sztuk Pięknych we Wrocławiu | 2024, 2021",
    "The Best Short Film + Jury Award + Public Choice Award | 5th Nawada International Film Festival, 2024",
    "Best Director | San Luis Festival, 2024",
    "GRAND PRIX | Madeira FUNFEST, 2024",
    "GRAND PRIX | 21. Festiwal Opolskie Lamy, 2024",
    "GRAND PRIX | HYDE PARK FREEDOM Film Festiwal (16. Kameralne Lato), 2024",
    "GRAND PRIX | XX Ustecki Festiwal Filmów Amatorskich UFF(o)A, 2024",
    "GRAND PRIX | konkurs „Plac Filmowy” w Lublinie, 2024",
    "Nagroda Jury Młodych | festiwal OKFA w Koninie, 2024",
    "II miejsce | 6. Festiwal Maklaka i jego przyjaciół, Konstancin-Jeziorna, 2023",
  ],
  education: [
    "2023–2025 — Master of Media Art, Academy of Fine Arts in Wrocław, Poland",
    "2021–2022 — Sound and Image + Industrial Design, Politécnico de Leiria, Portugal (Erasmus+)",
    "2019–2022 — Bachelor of Industrial Design, Academy of Fine Arts in Wrocław, Poland",
  ],
};
