import * as React from "react";

/**
 * Kafelek pracy w siatce w stylu Pinterest: zdjęcie + podpis
 * "tytuł | rodzaj | rok". Po najechaniu zdjęcie delikatnie się powiększa.
 * Wariant placeholder = kremowy blok "Wkrótce" (dla pustych sekcji).
 *
 * @startingPoint section="Portfolio" subtitle="Kafelek pracy (zdjęcie + podpis)" viewport="380x520"
 */
export interface ArtworkTileProps {
  /** Identyfikator pracy — adres podstrony artwork.html?id=... */
  id?: string;
  /** Ścieżka do zdjęcia kafelka. */
  image?: string;
  /** Tytuł pracy (pogrubiony w podpisie). */
  title?: string;
  /** Rodzaj pracy, np. "audiovisual". */
  kind?: string;
  /** Rok powstania. */
  year?: string;
  /** True = kafelek-zapowiedź bez zdjęcia. */
  placeholder?: boolean;
  /** Tytuł na placeholderze ("Wkrótce"). */
  soonTitle?: string;
  /** Podtytuł na placeholderze. */
  soonSub?: string;
}

export function ArtworkTile(props: ArtworkTileProps): JSX.Element;
