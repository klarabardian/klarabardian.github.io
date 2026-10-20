/* ===================================================================
   fluid.js  ·  EFEKT PŁYNU NA STRONIE STARTOWEJ
   -------------------------------------------------------------------
   Zdjęcie w tle zachowuje się jak ciecz: ruch kursora (na telefonie
   dotyk) rozlewa je i zniekształca, a potem obraz powoli wraca do
   normy. Na telefonie ciecz dodatkowo delikatnie faluje sama z siebie.

   Jak to działa (w skrócie):
     • karta graficzna liczy prostą symulację cieczy (pole prędkości)
       w małej rozdzielczości — patrz --fluid-res,
     • z prędkości powstaje "mapa przesunięć": o ile każdy punkt
       zdjęcia ma być przesunięty,
     • zdjęcie jest rysowane z tym przesunięciem.

   Ustawienia (moc, wielkość śladu, wiry itd.) to zmienne CSS
   w tokens/fluid.css (wybrane wartości są na końcu site.css);
   ten skrypt odczytuje je co klatkę.

   Kiedy efektu NIE ma (zostaje zwykłe zdjęcie z CSS):
     • użytkownik ma w systemie włączone "ogranicz ruch",
     • przeglądarka nie obsługuje potrzebnych funkcji WebGL,
     • zdjęcie się nie załaduje,
     • komputer jest za słaby (klatki wolniejsze niż ok. 36/s nawet
       po obniżeniu jakości — patrz QUALITY_LEVELS).
   =================================================================== */

(function () {
  "use strict";

  var IMAGE_SRC = "assets/hero-bg.jpg";
  var PRESSURE_ITERATIONS = 20;   // dokładność "nieściśliwości" cieczy
  var MAX_DPR = 2;                // ograniczenie ostrości na ekranach Retina (oszczędza GPU)

  // Ochrona słabszych komputerów: gdy klatki trwają za długo, schodzimy o stopień niżej
  // (mniejsza dokładność symulacji i ostrość obrazu); gdy to nie pomaga — efekt się wyłącza
  // i zostaje zwykłe zdjęcie. res = mnożnik --fluid-res, dpr = górna granica ostrości.
  var QUALITY_LEVELS = [
    { res: 1,    dpr: MAX_DPR },
    { res: 0.75, dpr: 1.5 },
    { res: 0.5,  dpr: 1 },
    { res: 0.375, dpr: 0.75 }
  ];
  var SLOW_FRAME_MS = 28;         // średnio wolniej niż ok. 36 klatek/s = za wolno...
  var CAPPED_MAX_MS = 38;         // ...chyba że klatki są równe, a średnia ≤ 38 ms: to stałe 30 klatek/s
  var STEADY_SPREAD_MS = 4;       //    narzucone przez system (oszczędzanie baterii), nie słabość sprzętu
  var WARMUP_FRAMES = 20;         // pierwsze klatki (kompilacja, start) nie liczą się do pomiaru
  var MEASURE_FRAMES = 40;        // z ilu klatek liczymy średnią
  var qualityLevel = 0;

  if (!document.body || !document.body.classList.contains("home")) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ----------------------------------------------------------------
     Parametry z CSS (odczytywane co klatkę, więc panel działa na żywo)
     ---------------------------------------------------------------- */
  var rootStyle = getComputedStyle(document.documentElement);
  function cssNum(name, fallback) {
    var v = parseFloat(rootStyle.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }
  var isTouch = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  function readParams() {
    return {
      strength: cssNum("--fluid-strength", 1),
      force: cssNum("--fluid-force", 1),
      radius: cssNum("--fluid-radius", 6),
      fade: cssNum("--fluid-fade", 1.5),
      persist: cssNum("--fluid-persist", 1),
      swirl: cssNum("--fluid-swirl", 20),
      chroma: cssNum("--fluid-chroma", 0.3),
      auto: cssNum(isTouch ? "--fluid-auto-mobile" : "--fluid-auto-desktop", isTouch ? 0.1 : 0),
      menu: cssNum("--fluid-menu", 0.35),
      res: Math.max(32, Math.min(512, Math.round(cssNum("--fluid-res", 128) * QUALITY_LEVELS[qualityLevel].res)))
    };
  }

  /* ----------------------------------------------------------------
     WebGL — kontekst i obsługa tekstur zmiennoprzecinkowych
     ---------------------------------------------------------------- */
  var canvas = document.createElement("canvas");
  canvas.className = "home-fluid";
  canvas.setAttribute("aria-hidden", "true");

  var attrs = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  var gl = canvas.getContext("webgl2", attrs);
  var isGL2 = !!gl;
  if (!gl) gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);
  if (!gl) return;

  var halfType, internalRGBA;
  if (isGL2) {
    if (!gl.getExtension("EXT_color_buffer_float")) return; // bez tego nie da się rysować do tekstur float
    halfType = gl.HALF_FLOAT;
    internalRGBA = gl.RGBA16F;
  } else {
    var ext = gl.getExtension("OES_texture_half_float");
    if (!ext || !gl.getExtension("OES_texture_half_float_linear")) return;
    halfType = ext.HALF_FLOAT_OES;
    internalRGBA = gl.RGBA;
  }

  /* ----------------------------------------------------------------
     Shadery (programy liczone na karcie graficznej)
     ---------------------------------------------------------------- */
  var VERT = [
    "precision highp float;",
    "attribute vec2 aPosition;",
    "varying vec2 vUv, vL, vR, vT, vB;",
    "uniform vec2 texelSize;",
    "void main () {",
    "  vUv = aPosition * 0.5 + 0.5;",
    "  vL = vUv - vec2(texelSize.x, 0.0);",
    "  vR = vUv + vec2(texelSize.x, 0.0);",
    "  vT = vUv + vec2(0.0, texelSize.y);",
    "  vB = vUv - vec2(0.0, texelSize.y);",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  var HEAD = "precision highp float; precision highp sampler2D; varying vec2 vUv, vL, vR, vT, vB;\n";

  // dodaje "pchnięcie" cieczy w punkcie (kursor)
  var FRAG_SPLAT = HEAD + [
    "uniform sampler2D uTarget; uniform float aspectRatio; uniform vec2 color; uniform vec2 point; uniform float radius;",
    "void main () {",
    "  vec2 p = vUv - point; p.x *= aspectRatio;",
    "  vec2 splat = exp(-dot(p, p) / radius) * color;",
    "  vec2 base = texture2D(uTarget, vUv).xy;",
    "  gl_FragColor = vec4(base + splat, 0.0, 1.0);",
    "}"
  ].join("\n");

  // przenosi pole prędkości zgodnie z własnym ruchem (ciecz płynie) i wygasza je
  var FRAG_ADVECT = HEAD + [
    "uniform sampler2D uVelocity; uniform vec2 texelSize; uniform float dt, dissipation;",
    "void main () {",
    "  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;",
    "  vec4 r = texture2D(uVelocity, coord);",
    "  gl_FragColor = r / (1.0 + dissipation * dt);",
    "}"
  ].join("\n");

  // mapa przesunięć zdjęcia: płynie razem z cieczą, rośnie o jej ruch i powoli wraca do zera
  var FRAG_DISP = HEAD + [
    "uniform sampler2D uVelocity, uDisp; uniform vec2 texelSize; uniform float dt, dissipation;",
    "void main () {",
    "  vec2 vel = texture2D(uVelocity, vUv).xy;",
    "  vec2 coord = vUv - dt * vel * texelSize;",
    "  vec2 d = texture2D(uDisp, coord).xy;",
    "  d /= (1.0 + dissipation * dt);",
    "  d += vel * dt * texelSize;",
    "  gl_FragColor = vec4(d, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG_CURL = HEAD + [
    "uniform sampler2D uVelocity;",
    "void main () {",
    "  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;",
    "  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;",
    "  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);",
    "}"
  ].join("\n");

  // wiry: wzmacnia naturalne zawirowania cieczy
  var FRAG_VORTICITY = HEAD + [
    "uniform sampler2D uVelocity, uCurl; uniform float curl, dt;",
    "void main () {",
    "  float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;",
    "  float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;",
    "  float C = texture2D(uCurl, vUv).x;",
    "  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));",
    "  force /= length(force) + 0.0001;",
    "  force *= curl * C; force.y *= -1.0;",
    "  vec2 vel = texture2D(uVelocity, vUv).xy + force * dt;",
    "  vel = min(max(vel, -1000.0), 1000.0);",
    "  gl_FragColor = vec4(vel, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG_DIVERGENCE = HEAD + [
    "uniform sampler2D uVelocity;",
    "void main () {",
    "  float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;",
    "  float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;",
    "  vec2 C = texture2D(uVelocity, vUv).xy;",
    "  if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; }",
    "  if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }",
    "  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG_PRESSURE = HEAD + [
    "uniform sampler2D uPressure, uDivergence;",
    "void main () {",
    "  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;",
    "  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;",
    "  float div = texture2D(uDivergence, vUv).x;",
    "  gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG_GRADIENT = HEAD + [
    "uniform sampler2D uPressure, uVelocity;",
    "void main () {",
    "  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;",
    "  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;",
    "  vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);",
    "  gl_FragColor = vec4(vel, 0.0, 1.0);",
    "}"
  ].join("\n");

  // rysuje zdjęcie przesunięte według mapy przesunięć (+ lekkie rozszczepienie kolorów),
  // przyciemnia je i nakłada napisy menu zniekształcone tą samą mapą (słabiej: uMenu)
  var FRAG_DISPLAY = HEAD + [
    "uniform sampler2D uImage, uDisp, uText; uniform vec2 uCover;",
    "uniform float uStrength, uChroma, uDim, uMenu;",
    "void main () {",
    "  vec2 d = texture2D(uDisp, vUv).xy * uStrength;",
    "  vec2 uv = (vUv - 0.5) * uCover + 0.5;",
    "  vec2 off = d * uCover;",
    "  vec2 ca = off * uChroma;",
    "  float r = texture2D(uImage, uv - off - ca).r;",
    "  float g = texture2D(uImage, uv - off).g;",
    "  float b = texture2D(uImage, uv - off + ca).b;",
    "  vec3 col = vec3(r, g, b) * (1.0 - uDim);",
    "  vec4 t = texture2D(uText, vUv - d * uMenu);",
    "  col = mix(col, t.rgb, t.a);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("fluid.js shader:", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }
  var vertShader = compile(gl.VERTEX_SHADER, VERT);
  if (!vertShader) return;

  function program(fragSrc) {
    var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!fs) return null;
    var p = gl.createProgram();
    gl.attachShader(p, vertShader);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn("fluid.js program:", gl.getProgramInfoLog(p));
      return null;
    }
    var uniforms = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var name = gl.getActiveUniform(p, i).name;
      uniforms[name] = gl.getUniformLocation(p, name);
    }
    return { id: p, u: uniforms };
  }

  var progs = {
    splat: program(FRAG_SPLAT),
    advect: program(FRAG_ADVECT),
    disp: program(FRAG_DISP),
    curl: program(FRAG_CURL),
    vorticity: program(FRAG_VORTICITY),
    divergence: program(FRAG_DIVERGENCE),
    pressure: program(FRAG_PRESSURE),
    gradient: program(FRAG_GRADIENT),
    display: program(FRAG_DISPLAY)
  };
  for (var key in progs) if (!progs[key]) return;

  // jeden prostokąt na cały ekran
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  var quadIdx = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIdx);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(target) {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  /* ----------------------------------------------------------------
     Tekstury do rysowania (bufory symulacji)
     ---------------------------------------------------------------- */
  function createFBO(w, h) {
    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalRGBA, w, h, 0, gl.RGBA, halfType, null);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      ok: ok, tex: tex, fbo: fbo, width: w, height: h,
      texelX: 1 / w, texelY: 1 / h,
      attach: function (unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); return unit; }
    };
  }
  function createDoubleFBO(w, h) {
    var a = createFBO(w, h), b = createFBO(w, h);
    return {
      ok: a.ok && b.ok, width: w, height: h, texelX: a.texelX, texelY: a.texelY,
      get read() { return a; }, get write() { return b; },
      swap: function () { var t = a; a = b; b = t; }
    };
  }

  var sim = null;      // { velocity, disp, curl, divergence, pressure, res }
  function initSim(res) {
    var aspect = canvas.width / Math.max(1, canvas.height);
    var w = aspect > 1 ? Math.round(res * aspect) : res;
    var h = aspect > 1 ? res : Math.round(res / aspect);
    var s = {
      res: res,
      velocity: createDoubleFBO(w, h),
      disp: createDoubleFBO(w, h),
      pressure: createDoubleFBO(w, h),
      curl: createFBO(w, h),
      divergence: createFBO(w, h)
    };
    if (!(s.velocity.ok && s.disp.ok && s.pressure.ok && s.curl.ok && s.divergence.ok)) return null;
    return s;
  }

  /* ----------------------------------------------------------------
     Zdjęcie
     ---------------------------------------------------------------- */
  var imageTex = null, imageW = 1, imageH = 1;
  var img = new Image();
  img.onload = function () {
    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    } catch (e) {
      // np. strona otwarta prosto z dysku (file://) — przeglądarka nie pozwala
      // użyć zdjęcia w WebGL; zostaje zwykłe zdjęcie z CSS
      console.warn("fluid.js: nie można użyć zdjęcia w WebGL, efekt wyłączony.", e);
      giveUp();
      return;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    imageW = img.naturalWidth; imageH = img.naturalHeight;
    imageTex = tex;
    wake();
  };
  img.onerror = function () { giveUp(); };
  img.src = IMAGE_SRC;

  // wyłącza efekt: usuwa kanwę, zostaje zwykłe zdjęcie z CSS
  var dead = false;
  function giveUp() {
    dead = true; running = false; imageTex = null;
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    document.body.classList.remove("fluid-on"); // tekst menu znów rysuje przeglądarka
  }

  /* ----------------------------------------------------------------
     Napisy menu: rysujemy ich kopię do tekstury, a shader zniekształca
     ją tą samą mapą co zdjęcie (napisy stoją w miejscu, tylko falują).
     Prawdziwe menu zostaje na swoim miejscu i jest klikalne — ma tylko
     przezroczysty tekst (klasa "fluid-on" na <body>, patrz site.css).
     Kopię odświeżamy, gdy coś się zmieni: najechanie (kolor), rozmiar,
     font, ustawienia z panelu.
     ---------------------------------------------------------------- */
  var textCanvas = document.createElement("canvas");
  var textCtx = textCanvas.getContext("2d");
  var textTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  var textSig = "";

  function textStyle(el) {
    var cs = getComputedStyle(el);
    var m = /"wght"\s*([\d.]+)/.exec(cs.fontVariationSettings || "");
    var weight = m ? m[1] : cs.fontWeight;
    return {
      font: cs.fontStyle + " " + weight + " " + cs.fontSize + " " + cs.fontFamily,
      color: cs.color,
      spacing: cs.letterSpacing,
      upper: cs.textTransform === "uppercase"
    };
  }
  function updateText() {
    var els = document.querySelectorAll(".home-logo, .home-link, .home-lang > span");
    var items = [], sig = canvas.width + "x" + canvas.height;
    for (var i = 0; i < els.length; i++) {
      var el = els[i], r = el.getBoundingClientRect(), st = textStyle(el);
      var imgEl = el.querySelector("img");
      var text = imgEl ? "" : el.textContent.trim();
      if (st.upper) text = text.toUpperCase();
      // poświata pod wybranym językiem (klasa is-active, patrz site.css)
      var glow = el.classList.contains("lang-opt") && el.classList.contains("is-active");
      items.push({ r: r, st: st, text: text, img: imgEl, glow: glow });
      sig += "|" + text + r.left.toFixed(1) + "," + r.top.toFixed(1) + "," + r.width.toFixed(1) + "," +
        r.height.toFixed(1) + st.font + st.color + st.spacing + (imgEl ? imgEl.complete + (imgEl.dataset.k || "") : "");
    }
    if (sig === textSig) return;
    textSig = sig;

    var cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    var dpr = canvas.width / Math.max(1, cssW);
    if (textCanvas.width !== canvas.width || textCanvas.height !== canvas.height) {
      textCanvas.width = canvas.width; textCanvas.height = canvas.height;
    }
    textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    textCtx.clearRect(0, 0, cssW, cssH);
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    items.forEach(function (it) {
      if (it.img) {
        if (it.img.complete && it.img.naturalWidth) textCtx.drawImage(it.img, it.r.left, it.r.top, it.r.width, it.r.height);
        return;
      }
      if (!it.text) return;
      textCtx.font = it.st.font;
      textCtx.fillStyle = it.st.color;
      if ("letterSpacing" in textCtx) textCtx.letterSpacing = it.st.spacing === "normal" ? "0px" : it.st.spacing;
      var cx = it.r.left + it.r.width / 2, cy = it.r.top + it.r.height / 2;
      if (it.glow) {
        // jasne kółko pod wybranym językiem (kolor jasnego tekstu, czyli --color-cream)
        textCtx.beginPath();
        textCtx.arc(cx, cy, it.r.height * 0.95, 0, Math.PI * 2);
        textCtx.fillStyle = "#ffffe3";
        textCtx.fill();
        textCtx.fillStyle = it.st.color;
      }
      textCtx.fillText(it.text, cx, cy);
    });

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  // przyciemnienie zdjęcia bierzemy z CSS (.home::before, też z panelu), ale nakładamy je
  // w shaderze pod napisami — sama warstwa CSS jest wtedy niewidoczna (opacity 0)
  function readDim() {
    var bg = getComputedStyle(document.body, "::before").backgroundColor || "";
    var m = /rgba?\(([^)]+)\)/.exec(bg);
    if (!m) return 0;
    var parts = m[1].split(/[\s,\/]+/).filter(Boolean);
    if (parts.length < 4) return 1;
    var a = /%$/.test(parts[3]) ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return isNaN(a) ? 0 : Math.max(0, Math.min(1, a));
  }

  /* ----------------------------------------------------------------
     Rozmiar kanwy
     ---------------------------------------------------------------- */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, QUALITY_LEVELS[qualityLevel].dpr);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      sim = null; // bufory symulacji budujemy od nowa pod nowe proporcje
    }
  }

  /* ----------------------------------------------------------------
     Kursor / dotyk / ruch sam z siebie
     ---------------------------------------------------------------- */
  var pointers = {};      // id → { x, y, dx, dy }  (x,y w 0..1, y w górę)
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  var lastInput = 0;
  function pointerMove(e) {
    var p = pointers[e.pointerId] || (pointers[e.pointerId] = { x: 0, y: 0, dx: 0, dy: 0, fresh: true });
    var x = e.clientX / window.innerWidth;
    var y = 1 - e.clientY / window.innerHeight;
    if (p.fresh) { p.x = x; p.y = y; p.fresh = false; }
    // ograniczamy skok w jednej klatce (np. kursor "teleportowany" po wyjściu z okna)
    p.dx = clamp(p.dx + x - p.x, -0.04, 0.04);
    p.dy = clamp(p.dy + y - p.y, -0.04, 0.04);
    p.x = x; p.y = y;
    lastInput = performance.now();
    wake();
  }
  function pointerEnd(e) { delete pointers[e.pointerId]; }
  window.addEventListener("pointermove", pointerMove, { passive: true });
  window.addEventListener("pointerdown", pointerMove, { passive: true });
  window.addEventListener("pointerup", pointerEnd, { passive: true });
  window.addEventListener("pointercancel", pointerEnd, { passive: true });
  window.addEventListener("pointerleave", pointerEnd, { passive: true });
  document.addEventListener("mouseleave", function () { pointers = {}; });

  // wędrujący "niewidzialny palec" — delikatny ruch sam z siebie
  var autoPrev = null;
  function autoPoint(t) {
    return {
      x: 0.5 + 0.34 * Math.sin(t * 0.21) + 0.08 * Math.sin(t * 0.73 + 1.3),
      y: 0.5 + 0.30 * Math.cos(t * 0.17 + 0.7) + 0.07 * Math.cos(t * 0.59)
    };
  }

  /* ----------------------------------------------------------------
     Krok symulacji
     ---------------------------------------------------------------- */
  function splat(x, y, dx, dy, P) {
    var pr = progs.splat;
    gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, sim.velocity.texelX, sim.velocity.texelY);
    gl.uniform1i(pr.u.uTarget, sim.velocity.read.attach(0));
    gl.uniform1f(pr.u.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(pr.u.point, x, y);
    gl.uniform2f(pr.u.color, dx, dy);
    var r = P.radius / 100;
    gl.uniform1f(pr.u.radius, r * r);
    blit(sim.velocity.write);
    sim.velocity.swap();
  }

  function step(dt, P, now) {
    var v = sim.velocity, ts = [v.texelX, v.texelY];
    var FORCE = 6000 * P.force;

    // pchnięcia od kursora / dotyku
    for (var id in pointers) {
      var p = pointers[id];
      if (p.dx !== 0 || p.dy !== 0) {
        splat(p.x, p.y, p.dx * FORCE, p.dy * FORCE, P);
        p.dx = 0; p.dy = 0;
      }
    }
    // delikatny ruch sam z siebie
    if (P.auto > 0) {
      var a = autoPoint(now / 1000);
      if (autoPrev) {
        // skok ograniczamy jak przy kursorze (np. po powrocie do karty minęło dużo czasu)
        var adx = clamp(a.x - autoPrev.x, -0.01, 0.01), ady = clamp(a.y - autoPrev.y, -0.01, 0.01);
        splat(a.x, a.y, adx * FORCE * 0.35 * P.auto, ady * FORCE * 0.35 * P.auto, P);
      }
      autoPrev = a;
    } else {
      autoPrev = null;
    }

    gl.disable(gl.BLEND);
    var pr;

    // wiry
    if (P.swirl > 0) {
      pr = progs.curl; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
      gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
      blit(sim.curl);

      pr = progs.vorticity; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
      gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
      gl.uniform1i(pr.u.uCurl, sim.curl.attach(1));
      gl.uniform1f(pr.u.curl, P.swirl);
      gl.uniform1f(pr.u.dt, dt);
      blit(v.write); v.swap();
    }

    // ciecz nieściśliwa: dywergencja → ciśnienie → odjęcie gradientu
    pr = progs.divergence; gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
    gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
    blit(sim.divergence);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sim.pressure.read.fbo);
    gl.viewport(0, 0, sim.pressure.width, sim.pressure.height);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    pr = progs.pressure; gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
    gl.uniform1i(pr.u.uDivergence, sim.divergence.attach(0));
    for (var i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pr.u.uPressure, sim.pressure.read.attach(1));
      blit(sim.pressure.write); sim.pressure.swap();
    }

    pr = progs.gradient; gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
    gl.uniform1i(pr.u.uPressure, sim.pressure.read.attach(0));
    gl.uniform1i(pr.u.uVelocity, v.read.attach(1));
    blit(v.write); v.swap();

    // ciecz płynie i powoli się uspokaja
    pr = progs.advect; gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
    gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
    gl.uniform1f(pr.u.dt, dt);
    gl.uniform1f(pr.u.dissipation, P.fade);
    blit(v.write); v.swap();

    // mapa przesunięć zdjęcia
    pr = progs.disp; gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
    gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
    gl.uniform1i(pr.u.uDisp, sim.disp.read.attach(1));
    gl.uniform1f(pr.u.dt, dt);
    gl.uniform1f(pr.u.dissipation, P.persist);
    blit(sim.disp.write); sim.disp.swap();
  }

  function render(P) {
    var pr = progs.display;
    gl.useProgram(pr.id);
    gl.uniform2f(pr.u.texelSize, 1 / canvas.width, 1 / canvas.height);
    gl.uniform1i(pr.u.uImage, (function () { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imageTex); return 0; })());
    gl.uniform1i(pr.u.uDisp, sim.disp.read.attach(1));
    // dopasowanie "cover": zdjęcie wypełnia ekran, przycięte po bokach lub górze/dole
    var canvasAspect = canvas.width / canvas.height, imageAspect = imageW / imageH;
    if (canvasAspect > imageAspect) gl.uniform2f(pr.u.uCover, 1, imageAspect / canvasAspect);
    else gl.uniform2f(pr.u.uCover, canvasAspect / imageAspect, 1);
    gl.uniform1f(pr.u.uStrength, P.strength);
    gl.uniform1f(pr.u.uChroma, P.chroma);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.uniform1i(pr.u.uText, 2);
    gl.uniform1f(pr.u.uDim, readDim());
    gl.uniform1f(pr.u.uMenu, P.menu);
    blit(null);
  }

  /* ----------------------------------------------------------------
     Pętla: rysujemy tylko wtedy, kiedy coś się dzieje (oszczędza baterię)
     ---------------------------------------------------------------- */
  var running = false, lastTime = 0;
  var warmup = WARMUP_FRAMES, measured = 0, measuredMs = 0, measuredSq = 0;
  function resetMeasure() { warmup = WARMUP_FRAMES; measured = 0; measuredMs = 0; measuredSq = 0; }

  // mierzy płynność; przy słabym sprzęcie obniża jakość, a na końcu wyłącza efekt
  function checkPerformance(frameMs) {
    if (frameMs > 250) { resetMeasure(); return; } // przerwa (np. inna karta), nie wolny sprzęt
    if (warmup > 0) { warmup--; return; }
    measured++; measuredMs += frameMs; measuredSq += frameMs * frameMs;
    if (measured < MEASURE_FRAMES) return;
    var avg = measuredMs / measured;
    var spread = Math.sqrt(Math.max(0, measuredSq / measured - avg * avg));
    resetMeasure();
    if (avg <= SLOW_FRAME_MS) return;
    if (avg <= CAPPED_MAX_MS && spread <= STEADY_SPREAD_MS) return; // równe 30 klatek/s z systemu
    if (qualityLevel < QUALITY_LEVELS.length - 1) {
      qualityLevel++;
      sim = null; // bufory budujemy od nowa w niższej rozdzielczości
      console.info("fluid.js: wolne klatki (" + avg.toFixed(0) + " ms), obniżam jakość do stopnia " + qualityLevel);
    } else {
      console.info("fluid.js: sprzęt za słaby (" + avg.toFixed(0) + " ms/klatkę), wyłączam efekt.");
      giveUp();
    }
  }

  function wake() {
    if (running || dead) return;
    running = true;
    lastTime = performance.now();
    resetMeasure();
    requestAnimationFrame(frame);
  }
  function frame(now) {
    if (!imageTex || dead) { running = false; return; }
    var frameMs = now - lastTime;
    var dt = Math.min(frameMs / 1000, 1 / 30);
    lastTime = now;
    checkPerformance(frameMs);
    if (dead) return;
    var P = readParams();

    try {
      resize();
      if (!sim || sim.res !== P.res) {
        sim = initSim(P.res);
        if (!sim) { giveUp(); return; }
      }
      step(dt, P, now);
      updateText();
      render(P);
      document.body.classList.add("fluid-on"); // od teraz napisy menu rysuje efekt
    } catch (e) {
      console.warn("fluid.js: błąd rysowania, efekt wyłączony.", e);
      giveUp();
      return;
    }

    // uśpij pętlę, gdy nic się nie dzieje i nie ma ruchu "sam z siebie" — ale dopiero
    // wtedy, gdy ciecz zdążyła się uspokoić, a zdjęcie wrócić do normy (zależy od suwaków)
    var slowest = Math.min(P.fade, P.persist);
    var idleAfter = slowest > 0 ? Math.min(300, 4 + 10 / slowest) : Infinity; // sekundy
    if (P.auto <= 0 && now - lastInput > idleAfter * 1000) { running = false; return; }
    requestAnimationFrame(frame);
  }

  // co jakiś czas sprawdzamy, czy panel nie włączył ruchu "sam z siebie" / nie zmienił rozdzielczości
  setInterval(function () {
    if (running || !imageTex) return;
    var P = readParams();
    if (P.auto > 0 || (sim && sim.res !== P.res)) wake();
  }, 1000);

  window.addEventListener("resize", function () { resize(); wake(); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });
  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); giveUp(); });

  // gdy font się doczyta, trzeba narysować napisy jeszcze raz
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { textSig = ""; wake(); });
  window.addEventListener("load", function () { textSig = ""; wake(); });

  document.body.insertBefore(canvas, document.body.firstChild);
  resize();
})();
