---
name: zuzanna-klara-bardian-design
description: Use this skill to generate well-branded interfaces and assets for Zuzanna Klara Bardian's art portfolio, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and reusable components for prototyping the artist's minimal bilingual (EN/PL) portfolio.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

This is a minimal, bilingual (EN/PL), lightweight art-portfolio design system. Key facts:
- **Colors:** background `#FDFDFD`, HOME background `#FFFFE3`, text `#000000`, single accent violet `#7F5A83`.
- **Font:** Figtree (variable) — Medium / Bold / Black. Logo in uppercase, −3% tracking.
- **Layout:** 12-column grid, 15px gutter; works as Pinterest-style masonry for art tiles.
- **Signature:** HOME page with a pixel-dispersal hero that reveals a centered menu.
- **Tone:** quiet, artistic, no emoji, captions formatted `title | kind | year`.

Where things live:
- `styles.css` (+ `tokens/`) — load this one file to get all colors, type, spacing, fonts.
- `data.js` — all site content (links, EN/PL strings, works, bio). Edit here to change content.
- `site.js` / `home.js` — vanilla-JS logic (nav, footer, grids, hero effect).
- `components/core/` — React `NavBar`, `ArtworkTile`, `Footer` for React projects.
- `assets/` — fonts, artwork images, portrait, hero background, social icons.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create
static HTML files for the user to view, linking `styles.css` for the real tokens. If working on
production code, copy assets and follow the rules in `readme.md` to design on-brand.

If the user invokes this skill without other guidance, ask what they want to build, ask a few
questions, and act as an expert designer who outputs HTML artifacts or production code as needed.
