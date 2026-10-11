// Footer — stopka z copyrightem i klikalnymi ikonami social media.
import React from "react";

// ikony jako komponenty (dziedziczą kolor przez stroke="currentColor")
const Icons = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.6 6.8 12 12.3l8.4-5.5" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" /><line x1="7.2" y1="10.5" x2="7.2" y2="16.5" />
      <circle cx="7.2" cy="7.3" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 16.5v-3.4a2 2 0 0 1 4 0v3.4M11 16.5v-6.5" />
    </svg>
  ),
};

export function Footer({
  copyright = "Copyright © 2026 Zuzanna Klara Bardian. All rights reserved.",
  email = "",
  instagram = "#",
  youtube = "#",
  linkedin = "#",
}) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__copy">{copyright}</div>
        <div className="footer__social">
          {email ? <a className="footer__mail" href={`mailto:${email}`} aria-label="E-mail">{Icons.mail}<span>{email}</span></a> : null}
          <a className="icon-only" href={instagram} target="_blank" rel="noopener" aria-label="Instagram">{Icons.instagram}</a>
          <a className="icon-only" href={youtube} target="_blank" rel="noopener" aria-label="YouTube">{Icons.youtube}</a>
          <a className="icon-only" href={linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">{Icons.linkedin}</a>
        </div>
      </div>
    </footer>
  );
}
