/* ===================================================================
   logo-wave.js  ·  LOGO W PASKU ZACHOWUJE SIĘ JAK CIECZ (podstrony)
   -------------------------------------------------------------------
   Ruch kursora nad logo w górnym pasku rozlewa i zniekształca litery,
   a potem napis powoli wraca do normy (albo zostaje rozlany, gdy suwak
   "jak szybko napis wraca" = 0). To ta sama symulacja co na stronie
   startowej (fluid.js), ale na polu wielkości samego logo.

   Jak to działa (w skrócie):
     • (działa też na każdym napisie z klasą "wave-text")
     • nad prawdziwym logo (które dostaje przezroczysty tekst, ale zostaje
       klikalne) leży mała kanwa trochę większa od napisu,
     • do kanwy kopiujemy napis logo tym samym fontem i kolorem,
     • karta graficzna liczy prostą symulację cieczy w małej siatce
       (--logo-fluid-res komórek na wysokość) i rysuje napis przesunięty
       według mapy przesunięć cieczy.

   Koszt jest niewielki: pole ma kilkaset na kilkadziesiąt pikseli,
   symulacja ma kilkadziesiąt komórek wysokości, a kod pracuje tylko
   wtedy, gdy kursor jest nad logo albo ciecz jeszcze się uspokaja.
   Zdjęcia na stronie nie są dotykane.

   Ustawienia to zmienne CSS w tokens/fluid.css (sekcja "logo w pasku");
   wartości ustawione na końcu site.css.

   Kiedy efektu NIE ma (zostaje zwykłe logo):
     • strona startowa (tam logo faluje razem ze zdjęciem),
     • telefon / tablet (ekran dotykowy), gdy --logo-fluid-mobile = 0,
     • "ogranicz ruch" w systemie,
     • brak WebGL z teksturami zmiennoprzecinkowymi,
     • bardzo wolny komputer (klatki trwają za długo → efekt się wyłącza),
     • --logo-fluid-on = 0.
   =================================================================== */

(function () {
  "use strict";

  var MAX_DPR = 2;               // ograniczenie ostrości na ekranach Retina
  var PRESSURE_ITERATIONS = 16;  // dokładność "nieściśliwości" cieczy
  var SLOW_FRAME_MS = 40;        // średnio wolniej niż 25 klatek/s = wyłączamy
  var MEASURE_FRAMES = 40;

  if (!document.body || document.body.classList.contains("home")) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var rootStyle = getComputedStyle(document.documentElement);
  function cssNum(name, fallback) {
    var v = parseFloat(rootStyle.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }
  var isTouch = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  function readParams() {
    return {
      on: cssNum("--logo-fluid-on", 1) > 0 && (!isTouch || cssNum("--logo-fluid-mobile", 0) > 0),
      chroma: cssNum("--logo-fluid-chroma", 0.3),
      strength: isTouch ? cssNum("--logo-fluid-strength-touch", cssNum("--logo-fluid-strength", 0.3)) : cssNum("--logo-fluid-strength", 0.3),
      force: cssNum("--logo-fluid-force", 1),
      radius: cssNum("--logo-fluid-radius", 30),
      fade: cssNum("--logo-fluid-fade", 1.5),
      persist: cssNum("--logo-fluid-persist", 1),
      swirl: cssNum("--logo-fluid-swirl", 10),
      res: Math.max(16, Math.min(128, Math.round(cssNum("--logo-fluid-res", 48))))
    };
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* ----------------------------------------------------------------
     Start — pasek buduje site.js, więc czekamy, aż logo będzie w DOM
     ---------------------------------------------------------------- */
  function start(logo) {

    var canvas = document.createElement("canvas");
    canvas.className = "logo-wave";
    canvas.setAttribute("aria-hidden", "true");

    var attrs = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
    var gl = canvas.getContext("webgl2", attrs);
    var isGL2 = !!gl;
    if (!gl) gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);
    if (!gl) return;

    // tekstury zmiennoprzecinkowe — potrzebne tylko do symulacji cieczy (tryb kursor)
    var halfType = null, internalRGBA = gl.RGBA;
    if (isGL2) {
      if (gl.getExtension("EXT_color_buffer_float")) { halfType = gl.HALF_FLOAT; internalRGBA = gl.RGBA16F; }
    } else {
      var ext = gl.getExtension("OES_texture_half_float");
      if (ext && gl.getExtension("OES_texture_half_float_linear")) halfType = ext.HALF_FLOAT_OES;
    }
    if (!halfType) return; // bez tego nie da się liczyć cieczy — zostaje zwykłe logo

    /* ----------------------------------------------------------------
       Shadery
       ---------------------------------------------------------------- */
    var VERT = [
      "precision highp float; attribute vec2 aPosition; varying vec2 vUv, vL, vR, vT, vB; uniform vec2 texelSize;",
      "void main () {",
      "  vUv = aPosition * 0.5 + 0.5;",
      "  vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);",
      "  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);",
      "  gl_Position = vec4(aPosition, 0.0, 1.0);",
      "}"
    ].join("\n");
    var HEAD = "precision highp float; precision highp sampler2D; varying vec2 vUv, vL, vR, vT, vB;\n";

    // kopia napisu bez zmian (gdy ciecz stoi)
    var FRAG_COPY = HEAD + [
      "uniform sampler2D uText;",
      "void main () { gl_FragColor = texture2D(uText, vUv); }"
    ].join("\n");

    // symulacja cieczy (jak w fluid.js) + napis z mapą przesunięć
    var FRAG_SPLAT = HEAD + [
      "uniform sampler2D uTarget; uniform float aspectRatio; uniform vec2 color; uniform vec2 point; uniform float radius;",
      "void main () {",
      "  vec2 p = vUv - point; p.x *= aspectRatio;",
      "  vec2 splat = exp(-dot(p, p) / radius) * color;",
      "  vec2 base = texture2D(uTarget, vUv).xy;",
      "  gl_FragColor = vec4(base + splat, 0.0, 1.0);",
      "}"
    ].join("\n");
    var FRAG_ADVECT = HEAD + [
      "uniform sampler2D uVelocity; uniform vec2 texelSize; uniform float dt, dissipation;",
      "void main () {",
      "  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;",
      "  gl_FragColor = texture2D(uVelocity, coord) / (1.0 + dissipation * dt);",
      "}"
    ].join("\n");
    var FRAG_DISP = HEAD + [
      "uniform sampler2D uVelocity, uDisp; uniform vec2 texelSize; uniform float dt, dissipation;",
      "void main () {",
      "  vec2 vel = texture2D(uVelocity, vUv).xy;",
      "  vec2 d = texture2D(uDisp, vUv - dt * vel * texelSize).xy;",
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
      "  gl_FragColor = vec4(min(max(vel, -1000.0), 1000.0), 0.0, 1.0);",
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
      "  gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);",
      "}"
    ].join("\n");
    var FRAG_DISPLAY = HEAD + [
      "uniform sampler2D uText, uDisp; uniform float uStrength, uChroma;",
      "void main () {",
      "  vec2 d = texture2D(uDisp, vUv).xy * uStrength;",
      "  vec2 ca = d * uChroma;",
      "  vec4 t = texture2D(uText, vUv - d);",
      "  float r = texture2D(uText, vUv - d - ca).r;",
      "  float b = texture2D(uText, vUv - d + ca).b;",
      "  gl_FragColor = vec4(r, t.g, b, t.a);",
      "}"
    ].join("\n");

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn("logo-wave.js shader:", gl.getShaderInfoLog(sh)); return null; }
      return sh;
    }
    var vertShader = compile(gl.VERTEX_SHADER, VERT);
    if (!vertShader) return;
    function program(fragSrc) {
      var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
      if (!fs) return null;
      var p = gl.createProgram();
      gl.attachShader(p, vertShader); gl.attachShader(p, fs); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn("logo-wave.js program:", gl.getProgramInfoLog(p)); return null; }
      var uniforms = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; uniforms[name] = gl.getUniformLocation(p, name); }
      return { id: p, u: uniforms };
    }
    var progs = {
      copy: program(FRAG_COPY), splat: program(FRAG_SPLAT), advect: program(FRAG_ADVECT), disp: program(FRAG_DISP),
      curl: program(FRAG_CURL), vorticity: program(FRAG_VORTICITY), divergence: program(FRAG_DIVERGENCE),
      pressure: program(FRAG_PRESSURE), gradient: program(FRAG_GRADIENT), display: program(FRAG_DISPLAY)
    };
    for (var key in progs) if (!progs[key]) return;

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    var quadIdx = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target) {
      if (target) { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
      else { gl.viewport(0, 0, canvas.width, canvas.height); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    /* ----------------------------------------------------------------
       Bufory symulacji
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
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        ok: ok, tex: tex, fbo: fbo, width: w, height: h, texelX: 1 / w, texelY: 1 / h,
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
    var sim = null;
    function initSim(res) {
      var aspect = canvas.width / Math.max(1, canvas.height);
      var w = Math.max(8, Math.round(res * aspect)), h = res;
      var s = { res: res, velocity: createDoubleFBO(w, h), disp: createDoubleFBO(w, h), pressure: createDoubleFBO(w, h), curl: createFBO(w, h), divergence: createFBO(w, h) };
      if (!(s.velocity.ok && s.disp.ok && s.pressure.ok && s.curl.ok && s.divergence.ok)) return null;
      return s;
    }

    /* ----------------------------------------------------------------
       Kopia napisu logo (albo obrazka logo) jako tekstura
       ---------------------------------------------------------------- */
    var textCanvas = document.createElement("canvas");
    var ctx = textCanvas.getContext("2d");
    var textTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var textSig = "";
    var cssW = 1, cssH = 1, pad = 12, rect = null;

    function textStyle(el) {
      var cs = getComputedStyle(el);
      var m = /"wght"\s*([\d.]+)/.exec(cs.fontVariationSettings || "");
      return {
        font: cs.fontStyle + " " + (m ? m[1] : cs.fontWeight) + " " + cs.fontSize + " " + cs.fontFamily,
        color: cs.color, spacing: cs.letterSpacing, upper: cs.textTransform === "uppercase"
      };
    }
    // zwraca true, gdy kopia napisu została odświeżona (zmienił się rozmiar, font, kolor...)
    function updateText() {
      var r = logo.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      var st = textStyle(logo);
      var imgEl = logo.querySelector("img");
      var text = imgEl ? "" : logo.textContent.trim();
      if (st.upper) text = text.toUpperCase();
      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var sig = text + "|" + r.width.toFixed(1) + "x" + r.height.toFixed(1) + "|" + st.font + st.color + st.spacing + "|" + dpr + (imgEl ? "|img" + imgEl.complete + (imgEl.dataset.k || "") : "");
      if (sig === textSig) { rect = canvas.getBoundingClientRect(); return false; }
      textSig = sig;

      // zapas wokół napisu: rozlane litery mogą wyjść poza obrys logo
      pad = Math.max(12, Math.round(r.height * 0.5));
      canvas.style.setProperty("--logo-wave-pad", pad + "px");
      cssW = r.width + 2 * pad; cssH = r.height + 2 * pad;
      var w = Math.max(1, Math.round(cssW * dpr)), h = Math.max(1, Math.round(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        textCanvas.width = w; textCanvas.height = h;
        sim = null; // bufory symulacji od nowa pod nowe proporcje
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      if (imgEl) {
        if (imgEl.complete && imgEl.naturalWidth) ctx.drawImage(imgEl, pad, pad, r.width, r.height);
      } else if (text) {
        ctx.font = st.font; ctx.fillStyle = st.color;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if ("letterSpacing" in ctx) ctx.letterSpacing = st.spacing === "normal" ? "0px" : st.spacing;
        ctx.fillText(text, cssW / 2, cssH / 2);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      rect = canvas.getBoundingClientRect();
      return true;
    }

    /* ----------------------------------------------------------------
       Kursor / dotyk — tylko gdy jest nad polem logo
       ---------------------------------------------------------------- */
    var pointers = {}, lastInput = -1e9;
    function pointerMove(e) {
      if (!isOn || !rect) return;
      var x = (e.clientX - rect.left) / rect.width;
      var y = 1 - (e.clientY - rect.top) / rect.height;
      var p = pointers[e.pointerId];
      if (x < 0 || x > 1 || y < 0 || y > 1) { if (p) p.fresh = true; return; }
      if (!p) p = pointers[e.pointerId] = { x: x, y: y, dx: 0, dy: 0, fresh: true };
      if (p.fresh) { p.x = x; p.y = y; p.fresh = false; }
      p.dx = clamp(p.dx + x - p.x, -0.1, 0.1);
      p.dy = clamp(p.dy + y - p.y, -0.1, 0.1);
      p.x = x; p.y = y;
      lastInput = performance.now();
      wake();
    }
    function pointerEnd(e) { delete pointers[e.pointerId]; }
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerdown", pointerMove, { passive: true });
    window.addEventListener("pointerup", pointerEnd, { passive: true });
    window.addEventListener("pointercancel", pointerEnd, { passive: true });
    document.addEventListener("mouseleave", function () { pointers = {}; });

    // na dotyku przeglądarka zabiera palec do przewijania (pointercancel), więc przewijanie też miesza ciecz
    var lastScrollY = window.pageYOffset;
    window.addEventListener("scroll", function () {
      var y = window.pageYOffset, d = y - lastScrollY;
      lastScrollY = y;
      if (!isTouch || !isOn || !rect || !d) return;
      var p = pointers.scroll || (pointers.scroll = { x: 0.5, y: 0.5, dx: 0, dy: 0, fresh: false });
      p.x = 0.2 + Math.random() * 0.6; p.y = 0.5;
      p.dy = clamp(p.dy - d / Math.max(rect.height, 1) * cssNum("--logo-fluid-scroll", 0.1), -0.1, 0.1);
      p.dx = clamp(p.dx + (Math.random() - 0.5) * 0.01, -0.1, 0.1);
      lastInput = performance.now();
      wake();
    }, { passive: true });

    /* ----------------------------------------------------------------
       Symulacja cieczy — jeden krok
       ---------------------------------------------------------------- */
    function splat(x, y, dx, dy, P) {
      var pr = progs.splat; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, sim.velocity.texelX, sim.velocity.texelY);
      gl.uniform1i(pr.u.uTarget, sim.velocity.read.attach(0));
      gl.uniform1f(pr.u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(pr.u.point, x, y);
      gl.uniform2f(pr.u.color, dx, dy);
      var r = P.radius / 100;
      gl.uniform1f(pr.u.radius, r * r);
      blit(sim.velocity.write); sim.velocity.swap();
    }
    function step(dt, P) {
      var v = sim.velocity, ts = [v.texelX, v.texelY], pr;
      var FORCE = 1500 * P.force;
      for (var id in pointers) {
        var p = pointers[id];
        if (p.dx !== 0 || p.dy !== 0) { splat(p.x, p.y, p.dx * FORCE, p.dy * FORCE, P); p.dx = 0; p.dy = 0; }
      }
      gl.disable(gl.BLEND);
      if (P.swirl > 0) {
        pr = progs.curl; gl.useProgram(pr.id);
        gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
        gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
        blit(sim.curl);
        pr = progs.vorticity; gl.useProgram(pr.id);
        gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
        gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
        gl.uniform1i(pr.u.uCurl, sim.curl.attach(1));
        gl.uniform1f(pr.u.curl, P.swirl); gl.uniform1f(pr.u.dt, dt);
        blit(v.write); v.swap();
      }
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

      pr = progs.advect; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
      gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
      gl.uniform1f(pr.u.dt, dt); gl.uniform1f(pr.u.dissipation, P.fade);
      blit(v.write); v.swap();

      pr = progs.disp; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, ts[0], ts[1]);
      gl.uniform1i(pr.u.uVelocity, v.read.attach(0));
      gl.uniform1i(pr.u.uDisp, sim.disp.read.attach(1));
      gl.uniform1f(pr.u.dt, dt); gl.uniform1f(pr.u.dissipation, P.persist);
      blit(sim.disp.write); sim.disp.swap();
    }

    /* ----------------------------------------------------------------
       Rysowanie napisu
       ---------------------------------------------------------------- */
    function bindText(unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, textTex); return unit; }
    function beginDraw() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // tekstura napisu jest "premultiplied"
    }
    function renderFluid(P) {
      beginDraw();
      var pr = progs.display; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, 1 / canvas.width, 1 / canvas.height);
      gl.uniform1i(pr.u.uText, bindText(0));
      gl.uniform1i(pr.u.uDisp, sim.disp.read.attach(1));
      gl.uniform1f(pr.u.uStrength, P.strength);
      gl.uniform1f(pr.u.uChroma, P.chroma);
      blit(null);
    }
    function renderStill() {
      beginDraw();
      var pr = progs.copy; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, 1 / canvas.width, 1 / canvas.height);
      gl.uniform1i(pr.u.uText, bindText(0));
      blit(null);
    }

    /* ----------------------------------------------------------------
       Włączanie i pętla klatek (pracuje tylko wtedy, gdy coś się dzieje)
       ---------------------------------------------------------------- */
    var isOn = false, dead = false, running = false, lastTime = 0, raf = 0;
    var measured = 0, measuredMs = 0, warmup = 20;

    function setOn(on) {
      if (on === isOn) return;
      isOn = on;
      pointers = {}; sim = null;
      if (on) {
        if (!canvas.parentNode) logo.appendChild(canvas);
        textSig = "";
        if (!updateText()) { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); isOn = false; return; }
        renderStill();
        logo.classList.add("logo-wave-on");
      } else {
        logo.classList.remove("logo-wave-on");
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }
    function giveUp() {
      dead = true; running = false;
      setOn(false);
    }
    function refresh() {
      if (dead) return;
      setOn(readParams().on);
      if (isOn && updateText() && !running) renderStill();
    }

    function wake() {
      if (running || dead || !isOn) return;
      running = true; lastTime = performance.now(); warmup = 20; measured = 0; measuredMs = 0;
      raf = requestAnimationFrame(frame);
    }
    function frame(now) {
      if (dead) { running = false; return; }
      var frameMs = now - lastTime;
      var dt = Math.min(frameMs / 1000, 1 / 30);
      lastTime = now;
      var P = readParams();
      setOn(P.on);
      if (!isOn) { running = false; return; }
      updateText();

      try {
        if (!sim || sim.res !== P.res) { sim = initSim(P.res); if (!sim) { giveUp(); return; } }
        step(dt, P);
        renderFluid(P);
      } catch (e) {
        console.warn("logo-wave.js: błąd rysowania, efekt wyłączony.", e);
        giveUp(); return;
      }

      // śpimy, gdy ciecz zdążyła się uspokoić, a napis wrócić (zależy od suwaków)
      var slowest = P.persist > 0 ? Math.min(P.fade, P.persist) : P.fade;
      var idleAfter = slowest > 0 ? Math.min(120, 2 + 8 / slowest) : 120;
      if (now - lastInput > idleAfter * 1000) { running = false; return; }

      // bardzo wolny komputer → wyłączamy efekt
      if (frameMs < 250) {
        if (warmup > 0) warmup--;
        else { measured++; measuredMs += frameMs; }
        if (measured >= MEASURE_FRAMES) {
          if (measuredMs / measured > SLOW_FRAME_MS) { console.info("logo-wave.js: wolne klatki, wyłączam efekt logo."); giveUp(); return; }
          measured = 0; measuredMs = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    }

    /* ----------------------------------------------------------------
       Montaż: pokazujemy kanwę dopiero, gdy font jest gotowy
       ---------------------------------------------------------------- */
    function mount() {
      refresh();
      window.addEventListener("resize", refresh, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(refresh).observe(logo);
      // kolor po najechaniu / zmiana z panelu "ustawienia" — odśwież kopię napisu
      logo.addEventListener("pointerenter", refresh);
      logo.addEventListener("pointerleave", refresh);
      var tw = document.getElementById("tw-panel");
      if (tw) tw.addEventListener("input", function () { setTimeout(refresh, 0); });
      canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); giveUp(); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
    }
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(mount, mount);
  }

  // ten sam efekt mają: logo w pasku oraz każdy napis z klasą "wave-text" (np. pasek WORK IN PROGRESS w grach)
  function startAll() {
    var els = document.querySelectorAll(".navbar__logo, .navbar__logo-w, .wave-text");
    for (var i = 0; i < els.length; i++) start(els[i]);
  }
  if (document.querySelector(".navbar__logo, .navbar__logo-w")) startAll();
  else document.addEventListener("DOMContentLoaded", startAll);
})();
