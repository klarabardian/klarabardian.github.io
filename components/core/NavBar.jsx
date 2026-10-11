// NavBar — górny pasek nawigacji portfolio (logo + linki + przełącznik EN|PL).
// Używa klas i zmiennych CSS z design systemu (styles.css).
import React from "react";

export function NavBar({
  active = "artworks",          // która zakładka jest aktywna
  lang = "en",                  // "en" albo "pl"
  labels,                       // opcjonalne nadpisanie etykiet
}) {
  // domyślne etykiety dla obu języków
  const L = labels || {
    en: { bio: "bio", artworks: "art works", videos: "video", games: "game design" },
    pl: { bio: "bio", artworks: "prace", videos: "filmy", games: "game design" },
  };
  const t = L[lang];
  const items = [
    ["artworks", "artworks.html"],
    ["videos", "videos.html"],
    ["games", "game-design.html"],
    ["bio", "bio.html"],
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__logo" href="index.html">Zuzanna Klara Bardian</a>
        <nav className="navbar__links">
          {items.map(([key, href]) => (
            <a
              key={key}
              className={"nav-link" + (active === key ? " is-active" : "")}
              href={href}
            >
              {t[key]}
            </a>
          ))}
          <span className="lang-switch">
            <span className={"lang-opt" + (lang === "en" ? " is-active" : "")}>EN</span>
            <span className="sep">|</span>
            <span className={"lang-opt" + (lang === "pl" ? " is-active" : "")}>PL</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
