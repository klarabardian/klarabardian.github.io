# Plan strony klarabardian.github.io

Każde zadanie ma numer. W nowej sesji Claude wpisz np. `zrób 1-3`. Sugerowany model jest przy zadaniu:
**Fable** = decyzje i najtrudniejszy kod · **Opus** = trudne, jasno określone · **Sonnet** = implementacja · **Haiku** = mechaniczne · **Ty** = po Twojej stronie.

Checklista z odhaczaniem: https://claude.ai/code/artifact/f834f29f-0a7b-4b58-9ded-af86756bd7e5

## Ustalenia

- Strona to zwykłe pliki HTML/CSS/JS, publikowane przez GitHub Pages z tego repozytorium. Bez Astro, bez składania, bez automatów.
- Panel edycji: Sveltia CMS pod adresem `/admin/`, logowanie przez GitHub. Treść i zdjęcia zapisują się w tym repozytorium. Każda zmiana w panelu to commit zrobiony w Twoim imieniu.
- Commity i push kodu robisz tylko Ty. Claude edytuje pliki, nie commituje.
- Wideo: YouTube po ID. Języki: każda praca zawsze EN i PL.
- Hero: dwa prototypy do wyboru (A: falowanie zdjęcia, B: barwna warstwa płynu), menu nieruchome lub lekko zniekształcane. Mobile: delikatny ruch sam z siebie plus dotyk.
- E-mail na stronie: z.k.bardian@gmail.com, bez telefonu. Film 10'43 to „u mnie”. Heliosfera = Random Check 7 „Time Crystals”. Showreel nie trafia na stronę. Link do gry z hasłem w adresie. Bio: wszystkie festiwale i wystawy.
- Kostiumy: jedna praca o rzeczach szytych z odzysku, bez sukienki studniówkowej i bez staników. Nota z wywiadu Autentico obok bio. Znaki Płynne: 17.03.2026, Galeria ArtBrut, fot. Stanisław Świtała.
- Wybrane z Instagrama: niewygodnie; mów do oceanu; Bendita; transformersy; ciałorelacje; dotarcie świadomości; fotografie 2020; selfiepoint; obrazy; rysunki „komentarz”; ruchoma para rąk; kostiumy do „Włosów”; suknie z recyklingu; Cafe Papagallo Rosso.

## 0 · Porządki

- **0-1** Sonnet · ZROBIONE · Nowa strona skopiowana do tego repozytorium, stare pliki szablonu usunięte.
- **0-2** Haiku · ZROBIONE · Naprawa data.js: Odważnik i „Co trudno Ci powiedzieć” rozdzielone, pusty wpis usunięty, e-mail, ID filmów.
- **0-3** Ty · Konto Cloudflare, plan Free, na dash.cloudflare.com. Potrzebne do logowania w panelu (1-4) i do ochrony przed botami (4-1).
- **0-4** Sonnet · ZROBIONE · Command Line Tools zainstalowane, git działa.
- **0-5** Sonnet · ZROBIONE · Node 24 w `~/.local/node` (potrzebny tylko do narzędzi pomocniczych, nie do strony).
- **0-6** Ty · Commit i push: `cd ~/klarabardian.github.io && git add -A && git commit -m "Nowa strona portfolio" && git push`.

## 1 · Panel edycji

- **1-1** Opus · Przenieść treść z `data.js` do plików, które panel umie edytować: `content/works/*.json` (jedna praca = jeden plik, pola EN/PL), `content/bio.json`, `content/site.json`. `site.js` wczytuje je przez `fetch` i buduje stronę dokładnie tak jak dziś. Wygląd bez zmian. Sprawdzić w przeglądarce każdą podstronę.
- **1-2** Opus · Bloki treści na podstronie pracy, renderowane w `site.js` z pola `blocks` w JSON: zdjęcie (szerokość: pełna / kontener / wąska; podpis; fotograf), galeria (układ: 2 kolumny / 3 kolumny / masonry / obok siebie), wideo YouTube, tekst (style: nagłówek / duży / zwykły / cytat / mały), dwie kolumny zdjęcie + tekst, odstęp. Style w `site.css` zgodne z `readme.md`.
- **1-3** Fable · Panel Sveltia CMS pod `/admin/index.html` + `/admin/config.yml`: kolekcje prace / filmy / game design / bio / ustawienia, pola EN i PL obok siebie, bloki z 1-2 jako lista typów, upload zdjęć do `assets/works/` z automatycznym zmniejszeniem do ok. 2000 px, jeśli Sveltia to wspiera. Schemat ma odpowiadać plikom z 1-1.
- **1-4** Sonnet · Logowanie do panelu przez GitHub: aplikacja OAuth na GitHubie (Zuzanna zakłada według instrukcji) + mały Worker na Cloudflare jako pośrednik (`sveltia-cms-auth`). Wynik: wejście na `/admin/`, klik „Zaloguj przez GitHub”, działa.
- **1-5** Sonnet · Kolejność kafelków ustawiana z panelu (pole `order` albo przeciąganie, jeśli panel to ma).
- **1-6** Sonnet · Test końcowy: dodać próbną pracę przez panel ze zdjęciem, galerią i wideo, sprawdzić, że pojawia się na stronie, potem usunąć.
- **1-7** Haiku · Instrukcja po polsku ze zrzutami ekranu w `INSTRUKCJA.md`: jak dodać pracę, jak podmienić zdjęcie hero, jak zmienić bio.

## 2 · Języki

- **2-1** Sonnet · Link do konkretnej wersji językowej: `?lang=pl` / `?lang=en` w adresie ustawia język i jest zapamiętywany. Przełącznik EN | PL bez przeładowania strony, jeśli się da bez przepisywania `site.js`.

## 3 · Hero z efektem płynu

- **3-1** Fable · Prototyp A: symulacja płynu na GPU (WebGL) zniekształca samo zdjęcie `assets/hero-bg.jpg`. Osobny plik `prototypes/hero-a.html`. Suwaki: siła, lepkość, zanik, promień.
- **3-2** Fable · Prototyp B: barwna warstwa płynu nad zdjęciem, w palecie strony (krem, fiolet, biel). Osobny plik `prototypes/hero-b.html`, te same suwaki.
- **3-3** Opus · Dwie wersje menu na prototypach: nieruchome i lekko zniekształcane przez płyn.
- **3-4** Ty · Wybór wersji hero i menu.
- **3-5** Opus · Wersja mobilna wybranego efektu: dotyk zamiast kursora, delikatny ruch sam z siebie, symulacja w niskiej rozdzielczości, wyłączenie przy „ogranicz ruch”, statyczne zdjęcie bez WebGL.
- **3-6** Sonnet · Wdrożenie wybranego efektu do `index.html` / `home.js`, przejście do podstron.
- **3-7** Sonnet · Test na prawdziwym iPhonie i Androidzie: płynnie, bez nagrzewania, start poniżej sekundy.

## 4 · Ochrona treści

Niczego, co widać w przeglądarce, nie da się w pełni ochronić. Można odciąć większość botów AI i utrudnić masowe kopiowanie.

- **4-1** Sonnet · Cloudflare „Block AI bots” i ochrona przed hotlinkowaniem. Wymaga własnej domeny podpiętej przez Cloudflare (zobacz 6-1); sam adres github.io nie da się tak chronić.
- **4-2** Haiku · `robots.txt` z listą crawlerów AI, metatag zastrzeżenia TDM, nagłówki `noai`/`noimageai` tam, gdzie GitHub Pages pozwala (meta tagi).
- **4-3** Sonnet · Zdjęcia na stronie maksymalnie ok. 2000 px, metadane z copyrightem; oryginały nigdy w repozytorium.
- **4-4** Ty · Opcjonalnie Glaze lub Nightshade na zdjęciach przed wgraniem.

## 5 · Treści

- **5-1** Haiku · Opisy: czuja i wysłuchaj z materiałami i wymiarami (czuja: wełna, szkło powiększające, lustra, metal, 26×26×5 cm; wysłuchaj: dziewicza wełna, ceramika, 30×30×3 cm, 2022), Bukiet, śniło mi się że jestem rybą (visual grany na żywo, pracownia Narracja i Interakcja w Nowych Mediach, ASP Wrocław, fot. Marcin Rupociński). Łazienka, Heliosfera, Odważnik, Co trudno, Dzień dobry, Włosy już zrobione.
- **5-2** Haiku · Nowe prace z PDF: niedorosła (film 2'16'', YouTube pVHQd7XN5EI, „Opowieść o dorastaniu”), u mnie (film 10'43'', AyBMDP0zNLU, reżyseria; zdjęcia współ. Julia Lignarska; muzyka współ. Tymon Porębski; selekcje: Młodzi i Film, OKFA, Triennale Radom, Opolskie Lamy), audioimprowizacja przestrzenna (G7oNBLOLNe4, z Tymonem Porębskim, plener u ad. Kamila Moskowczenko), fotografia „Konfrontacja z ciałem” (performans). Zdjęcia do dostarczenia.
- **5-3** Haiku · ZROBIONE · ID filmów z YouTube i link do gry (`https://rondaar.itch.io/jul-adventure?password=JulUro`).
- **5-4** Haiku · ZROBIONE dla Dzień dobry i Włosy. Zostało: kredyty przy „u mnie” (w 5-2).
- **5-5** Haiku · Bio: dopisać wszystkie wystawy i festiwale z PDF i Instagrama, których nie ma: Znaki Płynne, Galeria ArtBrut, Wrocław 2026; Random Check 7 Time Crystals, Musica Electronica Nova, KAF Digital Space, Wrocław 2025; Co się dzieje w łazience, Ołbiński CAL, Wrocław 2025; Slot Art Festival: Połączenia, Lubiąż 2025; Ołbiński Spacer Filmowy, Spółdzielnia Kinowa, Wrocław 2024; Bilet do Kina „Dzień dobry”, Galeria za Rogiem, Piaseczno 2024; festiwale: OKFA Konin 2020/2021/2024, Szklarnia Toruń 2024, BAZA Poznań 2024, Pyszadło Mogilno 2024, INDEPENDEAST Suwałki 2024, Opolskie Lamy 2020/2021/2023, KLAPS Bydgoszcz 2023, UFF(o)A 2023, Kameralne Lato Radom 2023, Kocham Dziwne Kino Pabianice 2023, Maklak Konstancin 2023, TOSIEK Skierniewice 2023, FRAPY Gorzów 2023, Plac Filmowy Lublin 2023, Euroshorts Gdańsk 2023, Młodzi i Film Koszalin 2021, Spektrum Świdnica 2020.
- **5-6** Sonnet · Tłumaczenia EN wszystkich nowych tekstów, lista do akceptacji Zuzanny.
- **5-7** Ty · ZROBIONE · Wybór kandydatów z Instagrama.
- **5-8** Haiku · Nowa praca Znaki Płynne: występ audiowizualny na żywo z Adamem Jańskim, 17.03.2026, Galeria ArtBrut, przy wystawie Jacka Kröle „Nic wam nie powiem!”; barwne płyny i syntezatory; grafika promująca: „Znaki rysunkowe” Kröle w kolaboracji z pracą wizualną Zuzanny. Zdjęcia po 5-12.
- **5-9** Sonnet · Nota z wywiadu Autentico obok tekstu bio: „W sztuce ciekawią mnie codzienne sytuacje, ludzkie problemy i ciało. Inspirują mnie wyniki badań socjologicznych i psychologicznych. Czasem lubię się po prostu pośmiać z własnych żartów. Nie mam ulubionego medium, trochę maluję, kręcę filmy, fotografuję, szyję, a ostatnio próbuję połączyć wszystko naraz.” EN do akceptacji.
- **5-10** Haiku · Nowa praca „rzeczy szyte z odzysku”: suknia z zasłony 2018, kostium Cafe Papagallo Rosso 2018, kostium czapli 2019, kostium Kohelet z obrusów 2019, suknia ze schroniskowej pościeli 2019, sukienka ze spodni i koszuli 2019, strój bakłażana 2020, kostiumy do „Włosów” 2019. Bez sukienki studniówkowej i bez staników.
- **5-11** Haiku · Wybrane prace z Instagrama jako nowe wpisy: niewygodnie (2024, wideo), mów do oceanu (2021, performance), Bendita (2022, kostium i rola, reż. Juliana Portela), transformersy (2022, foto), ciałorelacje (2021, cykl: z drogi, chłonność, ukrycie), dotarcie świadomości (2021), fotografie 2020, selfiepoint (2021, instalacja), obrazy (ryba na wodzie 50×70, światłaświata 100×70, małe), rysunki „komentarz” (2020–21), ruchoma para rąk (2019). Kostiumy do „Włosów” jako dodatkowe zdjęcia przy Włosach.
- **5-12** Ty · Zgoda Galerii ArtBrut / Stanisława Świtały na zdjęcia ze Znaków Płynnych i pliki w pełnej jakości.
- **5-13** Sonnet · Dopasować oryginały z `~/Documents/Documents/inst` (500 plików, podfoldery: instagram dizajnowy/butelka, instaczuja, ryba, wysłuchaj; kostium do bendity; inst u mnie; dla mai; nowości; tosiul) do prac z 5-10 i 5-11, zmniejszyć do ok. 2000 px, nazwać i wgrać do `assets/works/`. Wątpliwe pokazać Zuzannie.

## 6 · Publikacja

- **6-1** Ty + Sonnet · Decyzja o własnej domenie. Bez niej strona zostaje na klarabardian.github.io. Z domeną: DNS w Cloudflare, podpięcie do GitHub Pages, HTTPS.
- **6-2** Haiku · Meta opisy, obrazki do udostępniania (Open Graph), `sitemap.xml`, favicon.
- **6-3** Sonnet · Dostępność: alty, kontrast menu na hero, obsługa klawiatury.
- **6-4** Haiku · Opcjonalnie statystyki bez cookies (Cloudflare Web Analytics działa też na github.io przez jeden skrypt).

## Odrzucone

- Astro i składanie strony. Zamiast tego panel działający na zwykłych plikach.
- Blokada prawego przycisku myszy.
