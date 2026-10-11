/* TYMCZASOWY panel ustawień wyglądu. Usuwamy go (plik + <script> w HTML)
   po wybraniu docelowych wartości. Ustawienia zapamiętują się w przeglądarce. */
(function () {
  var KEY = "zkb-tweaks";
  var desktop = "@media (min-width: 721px)";

  // [klucz, etykieta, typ, domyślnie, min, max, krok, jednostka, css(v)]
  var GROUPS = [
    ["Kolory", [
      ["accent", "wyróżnienie (hover, aktywne menu)", "color", "#7f5a83", 0, 0, 0, "", function (v) { return ":root{--accent:" + v + "}"; }],
      ["ink", "tekst", "color", "#000000", 0, 0, 0, "", function (v) { return ":root{--ink:" + v + "}"; }],
      ["bgPage", "tło podstron", "color", "#fdfdfd", 0, 0, 0, "", function (v) { return ":root{--bg-page:" + v + "}"; }],
      ["bgHome", "tło kafelków bez zdjęcia", "color", "#ffffe3", 0, 0, 0, "", function (v) { return ":root{--bg-home:" + v + "}"; }],
      ["homeMenu", "menu na stronie startowej", "color", "#ffffe3", 0, 0, 0, "", function (v) { return ".home-logo,.home-link,.home-lang .lang-opt,.home-lang .sep{color:" + v + "}.home-link:hover,.home-lang .lang-opt:hover,.home-lang .lang-opt.is-active{color:var(--accent)}"; }],
      ["homeDim", "przyciemnienie zdjęcia na starcie", "range", 38, 0, 90, 1, "%", function (v) { return ".home::before{background:rgba(0,0,0," + v / 100 + ")}"; }]
    ]],
    ["Tekst", [
      ["body", "tekst podstawowy i menu", "range", 16, 12, 22, 0.5, "px", function (v) { return ":root{--size-body:" + v + "px}"; }],
      ["large", "tekst duży (bio, opisy)", "range", 20, 14, 32, 0.5, "px", function (v) { return ":root{--size-large:" + v + "px}"; }],
      ["headline", "nagłówki sekcji", "range", 24, 14, 48, 1, "px", function (v) { return ":root{--size-headline:" + v + "px}"; }],
      ["navLogo", "logo w pasku", "range", 24, 14, 48, 1, "px", function (v) { return desktop + "{.navbar__logo{font-size:" + v + "px}}"; }],
      ["weight", "grubość tekstu", "range", 500, 300, 700, 10, "", function (v) { return ":root{--weight-medium:" + v + "}.nav-link,.lang-opt,.home-link{font-variation-settings:'wght' " + v + "}.nav-link:hover,.nav-link.is-active,.lang-opt.is-active{font-variation-settings:'wght' 900}"; }],
      ["leading", "interlinia", "range", 1.45, 1.1, 2, 0.05, "", function (v) { return ":root{--leading-body:" + v + "}"; }],
      ["tracking", "odstęp między literami", "range", -0.5, -5, 5, 0.25, "%", function (v) { return ".t-text,.t-text-large,.t-menu,.tile__caption,.nav-link,.t-list{letter-spacing:" + v / 100 + "em}"; }]
    ]],
    ["Układ", [
      ["columns", "kolumny kafelków", "range", 3, 2, 5, 1, "", function (v) { return desktop + "{.masonry{column-count:" + v + "}}"; }],
      ["gap", "odstęp między kolumnami", "range", 15, 0, 64, 1, "px", function (v) { return ":root{--grid-gap:" + v + "px}"; }],
      ["tileGap", "odstęp pod kafelkiem", "range", 32, 0, 96, 2, "px", function (v) { return ".tile{margin-bottom:" + v + "px}"; }],
      ["captionGap", "odstęp zdjęcie → podpis", "range", 10, 0, 32, 1, "px", function (v) { return ".tile__caption{margin-top:" + v + "px}"; }],
      ["margin", "margines strony po bokach", "range", 64, 16, 200, 2, "px", function (v) { return desktop + "{:root{--page-margin:" + v + "px}}"; }],
      ["maxWidth", "maks. szerokość treści", "range", 1280, 900, 1920, 10, "px", function (v) { return ":root{--content-max:" + v + "px}"; }],
      ["navHeight", "wysokość paska menu", "range", 108, 56, 180, 2, "px", function (v) { return desktop + "{:root{--nav-height:" + v + "px}}"; }],
      ["spaceMd", "odstępy małe (np. tytuł pracy)", "range", 32, 8, 80, 2, "px", function (v) { return ":root{--space-md:" + v + "px}"; }],
      ["spaceLg", "odstępy średnie (między blokami)", "range", 64, 16, 160, 4, "px", function (v) { return ":root{--space-lg:" + v + "px}"; }],
      ["spaceXl", "odstępy duże (między sekcjami)", "range", 120, 32, 240, 4, "px", function (v) { return ":root{--space-xl:" + v + "px}"; }]
    ]],
    ["Zdjęcia", [
      ["radius", "zaokrąglenie rogów", "range", 2, 0, 32, 1, "px", function (v) { return ":root{--radius-img:" + v + "px}"; }],
      ["zoom", "powiększenie kafelka po najechaniu", "range", 4, 0, 15, 1, "%", function (v) { return ".tile:hover .tile__img{transform:scale(" + (1 + v / 100) + ")}"; }]
    ]]
  ];

  var ALL = [];
  GROUPS.forEach(function (g) { ALL = ALL.concat(g[1]); });

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var state = load();
  var styleEl = document.createElement("style");
  styleEl.id = "tweaks-style";

  function apply() {
    var css = "";
    ALL.forEach(function (t) {
      if (state[t[0]] !== undefined && state[t[0]] !== t[3]) css += t[8](state[t[0]]) + "\n";
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
    ".tw-row .tw-val.changed{color:#7f5a83;font-weight:700}",
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
        var cur = state[t[0]] !== undefined ? state[t[0]] : t[3];
        inp.value = cur;
        function show(v) {
          val.textContent = fmt(t, v);
          val.classList.toggle("changed", v !== t[3]);
        }
        show(cur);
        inp.oninput = function () {
          var v = t[2] === "range" ? parseFloat(inp.value) : inp.value;
          state[t[0]] = v;
          show(v); apply(); save(state);
        };
        val.onclick = function () {
          delete state[t[0]];
          inp.value = t[3];
          show(t[3]); apply(); save(state);
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
        if (v !== undefined && v !== t[3]) lines.push(t[1] + ": " + fmt(t, v) + "  (było " + fmt(t, t[3]) + ")");
      });
      var text = lines.length ? "Ustawienia wyglądu:\n" + lines.join("\n") : "Bez zmian — wszystko domyślne.";
      navigator.clipboard.writeText(text).then(function () {
        copy.textContent = "skopiowane";
        setTimeout(function () { copy.textContent = "kopiuj ustawienia"; }, 1500);
      }, function () { window.prompt("Skopiuj:", text); });
    };
    var reset = document.createElement("button");
    reset.textContent = "przywróć wszystko";
    reset.onclick = function () {
      if (!confirm("Przywrócić wszystkie ustawienia domyślne?")) return;
      ALL.forEach(function (t) { inputs[t[0]](); });
    };
    actions.appendChild(copy);
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
