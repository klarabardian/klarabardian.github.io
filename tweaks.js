/* TYMCZASOWY panel ustawień wyglądu. Usuwamy go (plik + <script> w HTML)
   po wybraniu docelowych wartości. Ustawienia zapamiętują się w przeglądarce. */
(function () {
  var KEY = "zkb-tweaks";
  var desktop = "@media (min-width: 721px)";

  // [klucz, etykieta, typ, domyślnie, min, max, krok, jednostka, css(v)]
  var GROUPS = [
    ["Kolory", [
      ["accent", "wyróżnienie (hover, aktywne menu)", "color", "#80433c", 0, 0, 0, "", function (v) { return ":root{--accent:" + v + "}"; }],
      ["ink", "tekst", "color", "#000000", 0, 0, 0, "", function (v) { return ":root{--ink:" + v + "}"; }],
      ["bgPage", "tło podstron", "color", "#fafafa", 0, 0, 0, "", function (v) { return ":root{--bg-page:" + v + "}"; }],
      ["bgHome", "tło kafelków bez zdjęcia", "color", "#000000", 0, 0, 0, "", function (v) { return ":root{--bg-home:" + v + "}"; }],
      ["homeMenu", "menu na stronie startowej", "color", "#ffffe3", 0, 0, 0, "", function (v) { return ".home-logo,.home-link,.home-lang .lang-opt,.home-lang .sep{color:" + v + "}.home-link:hover,.home-lang .lang-opt:hover,.home-lang .lang-opt.is-active{color:var(--accent)}"; }],
      ["homeDim", "przyciemnienie zdjęcia na starcie", "range", 17, 0, 90, 1, "%", function (v) { return ".home::before{background:rgba(0,0,0," + v / 100 + ")}"; }]
    ]],
    ["Tekst", [
      ["body", "tekst podstawowy i menu", "range", 15, 12, 22, 0.5, "px", function (v) { return ":root{--size-body:" + v + "px}"; }],
      ["large", "tekst duży (bio, opisy)", "range", 20, 14, 32, 0.5, "px", function (v) { return ":root{--size-large:" + v + "px}"; }],
      ["headline", "nagłówki sekcji", "range", 36, 14, 48, 1, "px", function (v) { return ":root{--size-headline:" + v + "px}"; }],
      ["navLogo", "logo w pasku", "range", 44, 14, 48, 1, "px", function (v) { return desktop + "{.navbar__logo{font-size:" + v + "px}}"; }],
      ["weight", "grubość tekstu", "range", 450, 300, 700, 10, "", function (v) { return ":root{--weight-medium:" + v + "}.nav-link,.lang-opt,.home-link{font-variation-settings:'wght' " + v + "}.nav-link:hover,.nav-link.is-active,.lang-opt.is-active{font-variation-settings:'wght' 900}"; }],
      ["leading", "interlinia", "range", 1.45, 1.1, 2, 0.05, "", function (v) { return ":root{--leading-body:" + v + "}"; }],
      ["tracking", "odstęp między literami", "range", 0, -5, 5, 0.25, "%", function (v) { return ".t-text,.t-text-large,.t-menu,.tile__caption,.nav-link,.t-list{letter-spacing:" + v / 100 + "em}"; }]
    ]],
    ["Układ", [
      ["columns", "kolumny kafelków", "range", 3, 2, 5, 1, "", function (v) { return desktop + "{.masonry{column-count:" + v + "}}"; }],
      ["gap", "odstęp między kolumnami", "range", 49, 0, 64, 1, "px", function (v) { return ":root{--grid-gap:" + v + "px}"; }],
      ["tileGap", "odstęp pod kafelkiem", "range", 30, 0, 96, 2, "px", function (v) { return ".tile{margin-bottom:" + v + "px}"; }],
      ["captionGap", "odstęp zdjęcie → podpis", "range", 8, 0, 32, 1, "px", function (v) { return ".tile__caption{margin-top:" + v + "px}"; }],
      ["filtersSpace", "odstęp filtry → kafelki", "range", 32, 0, 120, 2, "px", function (v) { return ":root{--filters-space:" + v + "px}"; }],
      ["filtersGap", "odstęp między filtrami", "range", 28, 8, 64, 1, "px", function (v) { return ":root{--filters-gap:" + v + "px}"; }],
      ["margin", "margines strony po bokach", "range", 64, 16, 200, 2, "px", function (v) { return desktop + "{:root{--page-margin:" + v + "px}}"; }],
      ["maxWidth", "maks. szerokość treści", "range", 1400, 900, 1920, 10, "px", function (v) { return ":root{--content-max:" + v + "px}"; }],
      ["navHeight", "wysokość paska menu", "range", 108, 56, 180, 2, "px", function (v) { return desktop + "{:root{--nav-height:" + v + "px}}"; }],
      ["spaceMd", "odstępy małe (np. tytuł pracy)", "range", 26, 8, 80, 2, "px", function (v) { return ":root{--space-md:" + v + "px}"; }],
      ["spaceLg", "odstępy średnie (między blokami)", "range", 64, 16, 160, 4, "px", function (v) { return ":root{--space-lg:" + v + "px}"; }],
      ["spaceXl", "odstępy duże (między sekcjami)", "range", 120, 32, 240, 4, "px", function (v) { return ":root{--space-xl:" + v + "px}"; }]
    ]],
    // złota proporcja: wielkości liczone z rozmiaru tekstu podstawowego (φ = 1,618). Musi być po grupach Tekst i Układ.
    ["Złota proporcja", [
      ["phi", "skala ze złotej proporcji (1 = włączona)", "range", 1, 0, 1, 1, "", function (v) {
        if (!+v) return "";
        var p = "1.618";
        return ":root{" +
          "--size-large:calc(var(--size-body) * 1.272);" +            // φ^0,5
          "--size-headline:calc(var(--size-body) * " + p + ");" +     // φ
          "--space-md:calc(var(--size-body) * " + p + ");" +
          "--space-lg:calc(var(--size-body) * 4.236);" +              // φ^3
          "--space-xl:calc(var(--size-body) * 6.854);" +              // φ^4
          "--grid-gap:calc(var(--size-body) * 2.618);" +              // φ^2
          "}" + desktop + "{.navbar__logo{font-size:calc(var(--size-body) * 2.618)}}" +
          ".tile{margin-bottom:calc(var(--size-body) * 1.618)}" +
          ".tile__caption{margin-top:calc(var(--size-body) * .5)}";
      }]
    ]],
    ["Zdjęcia", [
      ["radius", "zaokrąglenie rogów", "range", 9, 0, 32, 1, "px", function (v) { return ":root{--radius-img:" + v + "px}"; }],
      ["tileFluid", "kafelki: moc efektu po najechaniu (0 = brak)", "range", 0.14, 0, 1, 0.01, "", fluidVar("--tile-fluid-strength")],
      ["tileForce", "kafelki: siła pchnięcia kursorem", "range", 0.8, 0, 4, 0.05, "", fluidVar("--tile-fluid-force")],
      ["tileRadius", "kafelki: wielkość śladu kursora", "range", 2.5, 1, 25, 0.5, "%", fluidVar("--tile-fluid-radius")],
      ["tileFade", "kafelki: jak szybko ciecz się uspokaja", "range", 1.6, 0.1, 8, 0.1, "", fluidVar("--tile-fluid-fade")],
      ["tilePersist", "kafelki: jak szybko wraca do normy (mniej = wolniej)", "range", 0.5, 0.1, 8, 0.1, "", fluidVar("--tile-fluid-persist")]
    ]],
    // efekt płynu na stronie startowej — zmienne z tokens/fluid.css, czyta je fluid.js
    ["Efekt płynu (strona startowa)", [
      ["fStrength", "moc zniekształcenia zdjęcia", "range", 0.15, 0, 3, 0.05, "", fluidVar("--fluid-strength")],
      ["fForce", "siła pchnięcia kursorem", "range", 0.7, 0, 4, 0.05, "", fluidVar("--fluid-force")],
      ["fRadius", "wielkość śladu kursora", "range", 2.5, 1, 25, 0.5, "%", fluidVar("--fluid-radius")],
      ["fFade", "jak szybko ciecz się uspokaja", "range", 0, 0, 8, 0.1, "", fluidVar("--fluid-fade")],
      ["fPersist", "jak szybko zdjęcie wraca do normy", "range", 1, 0, 8, 0.1, "", fluidVar("--fluid-persist")],
      ["fSwirl", "wiry", "range", 20, 0, 60, 1, "", fluidVar("--fluid-swirl")],
      ["fChroma", "rozszczepienie kolorów", "range", 0.2, 0, 2, 0.05, "", fluidVar("--fluid-chroma")],
      ["fMenu", "falowanie napisów menu", "range", 0.35, 0, 1.5, 0.05, "", fluidVar("--fluid-menu")],
      ["fAutoMobile", "ruch sam z siebie (telefon)", "range", 0.1, 0, 3, 0.1, "", fluidVar("--fluid-auto-mobile")],
      ["fAutoDesktop", "ruch sam z siebie (komputer)", "range", 0.5, 0, 3, 0.1, "", fluidVar("--fluid-auto-desktop")],
      ["fRes", "dokładność symulacji", "range", 128, 32, 512, 32, "", fluidVar("--fluid-res")]
    ]],
    // logo w pasku na podstronach — zmienne z tokens/fluid.css, czyta je logo-wave.js
    ["Logo w pasku (podstrony)", [
      ["lfOn", "włączone (1) / wyłączone (0)", "range", 1, 0, 1, 1, "", fluidVar("--logo-fluid-on")],
      ["lfMobile", "także na telefonie (1) / nie (0)", "range", 0, 0, 1, 1, "", fluidVar("--logo-fluid-mobile")],
      ["lfStrength", "moc rozlewania", "range", 2.1, 0, 3, 0.05, "", fluidVar("--logo-fluid-strength")],
      ["lfForce", "siła pchnięcia kursorem", "range", 0.45, 0, 4, 0.05, "", fluidVar("--logo-fluid-force")],
      ["lfRadius", "wielkość śladu kursora", "range", 15, 5, 80, 1, "%", fluidVar("--logo-fluid-radius")],
      ["lfFade", "jak szybko ciecz się uspokaja", "range", 1.5, 0, 8, 0.1, "", fluidVar("--logo-fluid-fade")],
      ["lfPersist", "jak szybko napis wraca (0 = zostaje rozlany)", "range", 1.2, 0, 8, 0.1, "", fluidVar("--logo-fluid-persist")],
      ["lfSwirl", "wiry", "range", 29, 0, 60, 1, "", fluidVar("--logo-fluid-swirl")],
      ["lfChroma", "rozszczepienie kolorów", "range", 0.3, 0, 2, 0.05, "", fluidVar("--logo-fluid-chroma")],
      ["lfRes", "dokładność symulacji", "range", 80, 16, 128, 8, "", fluidVar("--logo-fluid-res")]
    ]]
  ];
  function fluidVar(name) { return function (v) { return ":root{" + name + ":" + v + "}"; }; }

  var ALL = [];
  GROUPS.forEach(function (g) { ALL = ALL.concat(g[1]); });

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  // wartości „domyślne” zapisane przyciskiem „zapisz jako domyślne” (nadpisują wartości z kodu)
  function loadDefs() { try { return JSON.parse(localStorage.getItem(KEY + "-defaults")) || {}; } catch (e) { return {}; } }
  function saveDefs(d) { try { localStorage.setItem(KEY + "-defaults", JSON.stringify(d)); } catch (e) {} }
  var DEFS = loadDefs();
  function def(t) { return DEFS[t[0]] !== undefined ? DEFS[t[0]] : t[3]; }

  var state = load();
  var styleEl = document.createElement("style");
  styleEl.id = "tweaks-style";

  function apply() {
    var css = "";
    // zawsze wpisujemy wartość (zapisaną albo domyślną z panelu), żeby domyślne z panelu
    // nadpisywały wartości z tokens/*.css, a „przywróć wszystko” faktycznie coś zmieniało
    ALL.forEach(function (t) {
      var v = state[t[0]] !== undefined ? state[t[0]] : def(t);
      css += t[8](v) + "\n";
    });
    styleEl.textContent = css;
    document.head.appendChild(styleEl); // zawsze na końcu, żeby wygrywał
  }
  apply();

  var PANEL_CSS = [
    "#tw-toggle{position:fixed;right:16px;bottom:16px;z-index:9999;font:600 13px/1 system-ui,sans-serif;background:#111;color:#fff;border:0;border-radius:999px;padding:10px 14px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25)}",
    "#tw-panel{position:fixed;right:16px;bottom:60px;z-index:9999;width:320px;max-width:calc(100vw - 32px);max-height:calc(100vh - 90px);overflow:auto;background:#fff;color:#111;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.25);font:13px/1.3 system-ui,sans-serif;padding:12px 14px}",
    "#tw-panel[hidden]{display:none}",
    "#tw-panel h4{margin:14px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#888}",
    "#tw-panel h4:first-of-type{margin-top:4px}",
    ".tw-row{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;margin-bottom:8px}",
    ".tw-row label{font-size:12px}",
    ".tw-row .tw-val{font-variant-numeric:tabular-nums;color:#666;font-size:12px;cursor:pointer}",
    ".tw-row .tw-val.changed{color:#a8442f;font-weight:700}",
    ".tw-row input[type=range]{grid-column:1/-1;width:100%;margin:0}",
    ".tw-row input[type=color]{width:36px;height:22px;border:1px solid #ddd;border-radius:4px;padding:0;background:none;cursor:pointer}",
    ".tw-actions{display:flex;gap:6px;margin-top:12px;position:sticky;bottom:-12px;background:#fff;padding:8px 0 4px}",
    ".tw-actions button{flex:1;font:600 12px system-ui,sans-serif;padding:8px;border-radius:6px;border:1px solid #ccc;background:#f6f6f6;cursor:pointer}",
    ".tw-actions button.primary{background:#111;color:#fff;border-color:#111}",
    ".tw-hint{color:#888;font-size:11px;margin:4px 0 0}"
  ].join("\n");

  function fmt(t, v) { return t[2] === "color" ? v : v + t[7]; }

  function build() {
    var css = document.createElement("style");
    css.textContent = PANEL_CSS;
    document.head.appendChild(css);

    var btn = document.createElement("button");
    btn.id = "tw-toggle";
    btn.textContent = "ustawienia";
    var panel = document.createElement("div");
    panel.id = "tw-panel";
    panel.hidden = localStorage.getItem(KEY + "-open") !== "1";

    btn.onclick = function () {
      panel.hidden = !panel.hidden;
      try { localStorage.setItem(KEY + "-open", panel.hidden ? "0" : "1"); } catch (e) {}
    };

    var inputs = {};
    GROUPS.forEach(function (g) {
      var h = document.createElement("h4");
      h.textContent = g[0];
      panel.appendChild(h);
      g[1].forEach(function (t) {
        var row = document.createElement("div");
        row.className = "tw-row";
        var lab = document.createElement("label");
        lab.textContent = t[1];
        var val = document.createElement("span");
        val.className = "tw-val";
        val.title = "kliknij, żeby przywrócić domyślne";
        var inp = document.createElement("input");
        inp.type = t[2];
        if (t[2] === "range") { inp.min = t[4]; inp.max = t[5]; inp.step = t[6]; }
        var cur = state[t[0]] !== undefined ? state[t[0]] : def(t);
        inp.value = cur;
        function show(v) {
          val.textContent = fmt(t, v);
          val.classList.toggle("changed", v !== def(t));
        }
        show(cur);
        inp.oninput = function () {
          var v = t[2] === "range" ? parseFloat(inp.value) : inp.value;
          state[t[0]] = v;
          show(v); apply(); save(state);
        };
        val.onclick = function () {
          delete state[t[0]];
          inp.value = def(t);
          show(def(t)); apply(); save(state);
        };
        row.appendChild(lab);
        if (t[2] === "color") { row.appendChild(inp); row.appendChild(val); val.style.gridColumn = "1/-1"; }
        else { row.appendChild(val); row.appendChild(inp); }
        panel.appendChild(row);
        inputs[t[0]] = val.onclick;
      });
    });

    var actions = document.createElement("div");
    actions.className = "tw-actions";
    var copy = document.createElement("button");
    copy.className = "primary";
    copy.textContent = "kopiuj ustawienia";
    copy.onclick = function () {
      var lines = [];
      ALL.forEach(function (t) {
        var v = state[t[0]];
        if (v !== undefined && v !== def(t)) lines.push(t[1] + ": " + fmt(t, v) + "  (było " + fmt(t, def(t)) + ")");
      });
      var text = lines.length ? "Ustawienia wyglądu:\n" + lines.join("\n") : "Bez zmian — wszystko domyślne.";
      navigator.clipboard.writeText(text).then(function () {
        copy.textContent = "skopiowane";
        setTimeout(function () { copy.textContent = "kopiuj ustawienia"; }, 1500);
      }, function () { window.prompt("Skopiuj:", text); });
    };
    var saveBtn = document.createElement("button");
    saveBtn.textContent = "zapisz jako domyślne";
    saveBtn.onclick = function () {
      if (!confirm("Zapisać obecne ustawienia jako nowe wartości domyślne?")) return;
      var snap = {};
      ALL.forEach(function (t) { snap[t[0]] = state[t[0]] !== undefined ? state[t[0]] : def(t); });
      DEFS = snap;
      state = {};
      saveDefs(DEFS);
      save(state);
      location.reload(); // odświeżenie, żeby suwaki i kolory pokazały nowe domyślne
    };
    var reset = document.createElement("button");
    reset.textContent = "przywróć wszystko";
    reset.onclick = function () {
      if (!confirm("Przywrócić wszystkie ustawienia domyślne?")) return;
      ALL.forEach(function (t) { inputs[t[0]](); });
    };
    actions.appendChild(copy);
    actions.appendChild(saveBtn);
    actions.appendChild(reset);
    panel.appendChild(actions);

    var hint = document.createElement("p");
    hint.className = "tw-hint";
    hint.textContent = "Ustawienia działają na wszystkich podstronach. Kliknięcie wartości przywraca domyślną. „Kopiuj ustawienia” → wklej mi w czacie.";
    panel.appendChild(hint);

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
