# Zuzanna Klara Bardian — Portfolio Design System

Design system i gotowa strona-portfolio artystki **Zuzanny Klary Bardian** —
twórczyni sztuki mediów (audiowizualnej, wideo, obiektów, game design) z Wrocławia.
Strona jest lekka, w czystym HTML/CSS/JS (bez frameworków i kroku budowania),
dwujęzyczna (EN/PL) i gotowa do publikacji na **GitHub Pages**.

> Cała treść strony mieści się w jednym pliku **`data.js`** — to tam dodaje się
> nowe prace, zmienia teksty bio i linki. Wygląd zmienia się w plikach w `tokens/`.

## Źródła (materiały od artystki)

- **Figma** (referencyjny szkic — nie idealny, bo robiony pierwszy raz):
  - Prototyp: `https://www.figma.com/proto/dRHdo08qZDVTEPZhvJhQTw/folio-projekt?node-id=6-1363`
  - Dev mode: `https://www.figma.com/design/dRHdo08qZDVTEPZhvJhQTw/folio-projekt?node-id=6-1363&m=dev`
  - Plik `.fig` był podmontowany; odtworzono z niego: HOME (efekt pikseli), art works (kafelki Pinterest), bio, podstronę projektu, style.
- **Zdjęcia prac i portret** — z Figmy oraz z folderu `uploads/` (zoptymalizowane do JPG ~100–250 KB).
- **Font** — Figtree (variable) z plików dostarczonych przez artystkę.

---

## CONTENT FUNDAMENTALS — jak pisana jest treść

- **Język:** strona jest w pełni dwujęzyczna **EN / PL**. Domyślnie startuje po angielsku (HOME = EN).
  Wybór języka zapamiętuje się w przeglądarce.
- **Ton:** minimalny, rzeczowy, artystyczny. Krótkie podpisy, dużo oddechu. Bez marketingowego entuzjazmu.
- **Bio:** trzecia osoba ("she lives and works in Wrocław" / „mieszka i pracuje we Wrocławiu").
- **Podpisy prac:** stały format `tytuł | rodzaj pracy | rok`, np.
  `Bouquet | elegant non-alcohol drink recepture | 2024`. Tytuł pogrubiony, reszta zwykła.
- **Małe litery** w menu (`bio`, `art works`, `video`, `game design`) — celowo, jako element stylu.
- **Wersaliki** tylko w logo i nagłówkach sekcji (HEADLINE).
- **Bez emoji.** Jedyne ikony to trzy znaki social media w stopce.
- Listy w bio (wystawy, festiwale, nagrody, edukacja) zostają w oryginalnym, mieszanym
  zapisie PL/EN — to nazwy własne, których się nie tłumaczy.

---

## VISUAL FOUNDATIONS — fundamenty wizualne

- **Kolory:** prawie monochromatycznie. Tło stron `#FDFDFD` (prawie biel), tło HOME kremowe `#FFFFE3`,
  tekst czarny `#000000`, jedyny akcent to przygaszony fiolet `#7F5A83` (aktywne / podświetlone menu, hover).
  Bez gradientów, bez kolorowych płaszczyzn — to prace mają nieść kolor.
- **Typografia:** jeden font — **Figtree** (variable). Grubości: Medium 500 (tekst, menu),
  Bold 700 (logo, nagłówki), Black 900 (aktywne menu). Skala: 56 / 24 / 20 / 16 px.
  Ujemny tracking (−3% w logo, −0.5% w tekście).
- **Układ:** siatka **12 kolumn**, gutter **15 px** (zmienna `--grid-gap`, edytowalna).
  Na mobile siatka schodzi do 2 kolumn. Marginesy strony 64 px (desktop) / 20 px (mobile).
- **Tła:** płaskie, jednolite. Wyjątek: HOME ma pełnoekranową grafikę z efektem rozpraszania pikseli.
- **Zdjęcia prac:** układ kafelkowy w stylu Pinterest (masonry, `column-count`) — stała szerokość,
  różne wysokości. Lekko zaokrąglone rogi (`2px`, prawie niewidoczne).
- **Animacje:** delikatne i powolne. Hover na kafelku = powiększenie zdjęcia o 4% (`transform: scale(1.04)`,
  ~0.6 s, miękki easing). Menu zmienia kolor płynnie (0.35 s). Bez odbić/bounce.
- **Stany hover:** tekst menu → fiolet + grubość Black; ikony social → fiolet + delikatne uniesienie (−2px).
- **HOME — efekt sygnaturowy:** warstwa grafiki na canvasie, którą kursor „ściera" rozsypanymi
  kwadracikami (piksele) odsłaniając wyśrodkowane menu pod spodem. Po wyborze zakładki grafika robi
  fade-out, a menu podjeżdża do góry (0.9 s, ease-in-out) i strona się przełącza. Na telefonie efekt
  jest wyłączony — statyczne zdjęcie + jasne menu na przyciemnieniu.
- **Cienie / obrysy:** praktycznie brak. Jedyna linia to cienki hairline nad stopką (`rgba(0,0,0,.10)`).
- **Klimat obrazów:** ciepły, zmysłowy, organiczny, lekko surrealistyczny (ciała, dłonie, woda, folia, owoce).

---

## ICONOGRAPHY — ikony

- Strona prawie nie używa ikon. Jedyny zestaw to **3 ikony social media** w stopce:
  Instagram, YouTube, LinkedIn.
- Są to **wektorowe SVG** (`assets/icons/`), monochromatyczne, rysowane `stroke="currentColor"`,
  więc dziedziczą kolor tekstu i zmieniają się na fiolet przy hover. Spójna grubość linii 1.7.
- W kodzie strony ikony są wpisane bezpośrednio (inline SVG w `site.js`), żeby reagowały na kolor.
- **Bez emoji**, bez ikon w menu — minimalizm jest celowy.

---

## INDEX — co jest w tym projekcie

**Strona (publikowalna na GitHub Pages):**
- `index.html` — HOME: zdjęcie w tle + kremowe menu (`home.js`); efekt interaktywny w przygotowaniu
- `artworks.html` · `videos.html` · `game-design.html` — kafelki Pinterest
- `bio.html` — biografia + wystawy / festiwale / nagrody / edukacja + kontakt
- `artwork.html?id=...` — podstrona pojedynczego projektu
- `data.js` — **CAŁA TREŚĆ** (linki, teksty EN/PL, lista prac, bio) ← tu edytujesz najwięcej
- `site.js` — wspólna logika (buduje nawigację, stopkę, kafelki, język)
- `home.js` — efekt strony startowej

**Style (design tokens):**
- `styles.css` — punkt wejścia (same `@import`-y)
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` · `tokens/fonts.css`
- `site.css` — wygląd komponentów (nawigacja, kafelki, bio, stopka, HOME)

**Komponenty React** (`components/core/`) — odpowiedniki dla projektów w React:
- `NavBar` · `ArtworkTile` · `Footer`

**Karty Design System tab** (`guidelines/`): kolory, typografia, font, siatka, ikony.

**Zasoby** (`assets/`): `fonts/`, `works/` (zdjęcia prac), `bio.jpg`, `hero-bg.jpg`, `icons/`.

---

## Jak opublikować na GitHub Pages

1. Wrzuć wszystkie pliki do repozytorium na GitHubie.
2. Settings → Pages → Source: „Deploy from a branch", branch `main`, folder `/ (root)`.
3. Gotowe — strona ruszy pod adresem `https://twój-login.github.io/nazwa-repo/`.

## Jak dodać nową pracę

Otwórz `data.js`, znajdź listę `ARTWORKS` (lub `VIDEOS` / `GAMES`), skopiuj jeden blok `{ ... }`,
wklej i podmień: `id`, `image` (plik z `assets/works/`), `title`, `kind`, `year`, `desc`.
Zdjęcia wrzucaj do `assets/works/`. To wszystko — kafelek i podstrona zrobią się same.
