# Instrukcje dla Claude w tym repozytorium

Portfolio Zuzanny Klary Bardian, artystki mediów z Wrocławia. Strona to zwykłe pliki HTML/CSS/JS publikowane przez GitHub Pages z tego repozytorium. Rozmawiaj po polsku, bez żargonu; Zuzanna nie jest programistką.

## Jak pracujemy

- Plan z numerami zadań jest w `PLAN.md`. Gdy Zuzanna pisze `zrób 1-3`, przeczytaj z `PLAN.md` tylko sekcję „Ustalenia” i to jedno zadanie, zrób je, sprawdź w przeglądarce, a na końcu napisz jednym zdaniem, co zrobiłaś i że może odhaczyć zadanie w checkliście.
- Nie rób `git commit` ani `git push`. Commity i push robi tylko Zuzanna. Powiedz jej, kiedy jest co commitować.
- Nie zmieniaj wyglądu strony poza zakresem zadania. Zasady wyglądu są w `readme.md` (kolory, font Figtree, siatka, ton treści).
- Wszystkie teksty na stronie zawsze w dwóch wersjach: EN i PL. Angielskie tłumaczenia nowych tekstów daj do akceptacji.
- Nie wgrywaj do repozytorium oryginałów zdjęć; maksymalnie ok. 2000 px szerokości.

## Narzędzia na tym Macu

- Node 24 jest w `~/.local/node` (dodaj do PATH: `export PATH="$HOME/.local/node/bin:$PATH"`). Python i pdftoppm nie działają.
- Podgląd strony: `.claude/launch.json` ma konfigurację `repo` (serwer `.claude/serve.pl` w Perlu, port 8765). Użyj `preview_start` z nazwą `repo`.
- Procesy uruchamiane z podglądu nie mogą czytać dysku zewnętrznego `/Volumes/kobalt`; ten folder w katalogu domowym działa.

## Gdzie co jest

- `data.js` — cała treść strony (do przeniesienia do `content/` w zadaniu 1-1).
- `site.js` — nawigacja, stopka, kafelki, podstrona pracy. `home.js` — strona startowa.
- `styles.css` + `tokens/` + `site.css` — style. `assets/works/` — zdjęcia prac.
- Checklista z odhaczaniem: https://claude.ai/code/artifact/f834f29f-0a7b-4b58-9ded-af86756bd7e5
