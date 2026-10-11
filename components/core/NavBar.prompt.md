NavBar — nieruchomy górny pasek nawigacji portfolio (logo, linki, EN|PL).

```jsx
<NavBar active="artworks" lang="en" />
```

- `active`: "bio" | "artworks" | "videos" | "games" — podświetla zakładkę na fioletowo.
- `lang`: "en" | "pl" — etykiety menu w danym języku.
- Na żywej stronie pasek buduje `site.js` (funkcja `buildNavbar`); ten komponent to odpowiednik dla projektów w React.
