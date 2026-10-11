import * as React from "react";

/**
 * Stopka strony: tekst copyright po lewej, klikalne ikony social media
 * (Instagram, YouTube, LinkedIn) po prawej. Pojawia się na każdej stronie
 * oprócz strony startowej (HOME).
 */
export interface FooterProps {
  /** Tekst praw autorskich. */
  copyright?: string;
  /** Adres e-mail (pierwsza ikona w stopce). Pusty = ukryta. */
  email?: string;
  /** Adres profilu Instagram. */
  instagram?: string;
  /** Adres kanału YouTube. */
  youtube?: string;
  /** Adres profilu LinkedIn. */
  linkedin?: string;
}

export function Footer(props: FooterProps): JSX.Element;
