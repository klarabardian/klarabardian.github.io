// ArtworkTile — pojedynczy kafelek pracy w siatce (jak Pinterest):
// zdjęcie + podpis "tytuł | rodzaj | rok". Obsługuje też placeholder ("Wkrótce").
import React from "react";

export function ArtworkTile({
  id,                     // adres podstrony (artwork.html?id=...)
  image,                  // ścieżka do zdjęcia
  title,                  // tytuł pracy
  kind = "",              // rodzaj pracy
  year = "",              // rok
  placeholder = false,    // true = kafelek-zapowiedź bez zdjęcia
  soonTitle = "Coming soon",
  soonSub = "work in progress",
}) {
  // wariant "wkrótce" — kremowy blok bez zdjęcia
  if (placeholder) {
    return (
      <div className="tile tile--soon">
        <div className="tile__imgwrap">
          <span className="soon-title t-menu-choose">{soonTitle}</span>
          <span className="soon-sub">{soonSub}</span>
        </div>
      </div>
    );
  }
  // zwykły kafelek z linkiem do podstrony
  return (
    <a className="tile" href={`artwork.html?id=${id}`}>
      <div className="tile__imgwrap">
        <img className="tile__img" src={image} alt={title} loading="lazy" />
      </div>
      <div className="tile__caption">
        <span className="tile__title">{title}</span>
        <span className="tile__meta">{` | ${kind} | ${year}`}</span>
      </div>
    </a>
  );
}
