/* ===================================================================
   home.js  ·  STRONA STARTOWA (HOME)
   -------------------------------------------------------------------
   Prosty układ: zdjęcie w tle, a na nim wyśrodkowane menu
   w kolorze kremowym (#ffffe3). Efekt płynu na zdjęciu robi osobny
   plik fluid.js (ten plik buduje tylko menu).

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
    // na stronie startowej logo w kolorze liter (kremowe) i większe o złotą proporcję (× φ)
    logoHTML("home-logo", "assets/logos/medium1-light.svg", Math.round(SITE.logo.width * 1.618)) +
    // menu (odnośniki + języki) leży pod logo, które stoi dokładnie na środku ekranu
    `<div class="home-below">` +
    `<div class="home-links">${linksHTML}</div>` +
    `<div class="lang-switch home-lang">` +
    `<span class="lang-opt${enA}" data-text="EN" data-lang="en">EN</span>` +
    `<span class="lang-opt${plA}" data-text="PL" data-lang="pl">PL</span>` +
    `</div>` +
    `</div>`;

  // klik w EN / PL przełącza język
  nav.querySelectorAll(".lang-opt").forEach((el) => {
    el.addEventListener("click", () => setLang(el.dataset.lang));
  });

  // klik w odnośnik: strona płynnie zanika (CSS .is-leaving), potem przejście dalej
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  nav.querySelectorAll(".home-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => { location.href = a.href; }, 350);
    });
  });
  // powrót przyciskiem „wstecz” (strona z pamięci podręcznej) — pokaż ją z powrotem
  window.addEventListener("pageshow", () => document.body.classList.remove("is-leaving"));
})();
