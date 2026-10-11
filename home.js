/* ===================================================================
   home.js  ·  STRONA STARTOWA (HOME)
   -------------------------------------------------------------------
   Prosty układ: zdjęcie w tle, a na nim wyśrodkowane menu
   w kolorze kremowym (#ffffe3). Bez efektów i bez animacji wyjścia —
   taki sam wygląd na komputerze i na telefonie.

   Treść menu (logo, odnośniki, język) bierze się z plików:
     • data.js  – logo (SITE.logo), kolejność/nazwy odnośników (NAV),
                  teksty po EN/PL (I18N)
     • site.js  – pomocnicy: logoHTML(), getLang(), setLang()
   =================================================================== */

(function () {
  const lang = getLang();

  // Zbuduj wyśrodkowane menu na środku ekranu.
  const nav = document.getElementById("home-nav");

  // odnośniki z listy NAV (kolejność i nazwy ustawiasz w data.js)
  const linksHTML = NAV.map(
    ({ key, href }) =>
      `<a class="home-link" href="${href}" data-text="${I18N[lang][key]}">${I18N[lang][key]}</a>`
  ).join("");

  // przełącznik języka EN | PL (aktywny wariant podświetlony)
  const enA = lang === "en" ? " is-active" : "";
  const plA = lang === "pl" ? " is-active" : "";

  nav.innerHTML =
    logoHTML("home-logo") +
    `<div class="home-links">${linksHTML}</div>` +
    `<div class="lang-switch home-lang">` +
    `<span class="lang-opt${enA}" data-text="EN" data-lang="en">EN</span>` +
    `<span class="sep">|</span>` +
    `<span class="lang-opt${plA}" data-text="PL" data-lang="pl">PL</span>` +
    `</div>`;

  // klik w EN / PL przełącza język
  nav.querySelectorAll(".lang-opt").forEach((el) => {
    el.addEventListener("click", () => setLang(el.dataset.lang));
  });
})();
