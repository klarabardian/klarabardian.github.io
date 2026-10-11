// Deklaracja typów dla NavBar — opisuje, jakie właściwości (props) przyjmuje.
import * as React from "react";

/**
 * Górny pasek nawigacji portfolio: logo, linki do podstron i przełącznik EN|PL.
 * Nieruchomy na górze; treść chowa się pod nim przy scrollowaniu.
 *
 * @startingPoint section="Portfolio" subtitle="Pasek nawigacji (logo + menu + EN/PL)" viewport="1280x120"
 */
export interface NavBarProps {
  /** Aktywna zakładka (podświetlona na fioletowo). */
  active?: "bio" | "artworks" | "videos" | "games";
  /** Język interfejsu. */
  lang?: "en" | "pl";
  /** Opcjonalne nadpisanie etykiet menu. */
  labels?: Record<string, Record<string, string>>;
}

export function NavBar(props: NavBarProps): JSX.Element;
