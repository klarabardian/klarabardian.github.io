/* ===================================================================
   photo-fluid.js  ·  EFEKT PŁYNU NA ZDJĘCIACH W TREŚCI STRONY
   -------------------------------------------------------------------
   Ten sam efekt co na stronie startowej (fluid.js), ale na zdjęciach
   w treści strony: ruch kursora (na telefonie dotyk) nad zdjęciem
   rozlewa je i zniekształca, a potem obraz powoli wraca do normy.

   Dwa tryby:

   1) Pojedyncze zdjęcie (klasa "fluid-photo", np. zdjęcie w bio — patrz
      site.js → initBioPage). Nad obrazkiem leży kanwa tej samej wielkości;
      obrazek pod spodem zostaje jako wersja zapasowa. Ustawienia: zmienne
      --fluid-* (te same co na stronie startowej) w tokens/fluid.css.

   2) Kafelki na listach prac (img.tile__img). JEDNA kanwa na cały ekran
      i jedna symulacja płynu dla wszystkich kafelków naraz: woda płynie
      z kafelka na kafelek, a każdy dogasa sam, w swoim tempie. Kanwa
      rysuje tylko kafelki w pobliżu kursora; w pozostałych miejscach jest
      przezroczysta, więc widać prawdziwe zdjęcia. Gdy nic się nie dzieje,
      kanwa jest ukryta i nic nie liczy. Ustawienia: --tile-fluid-*.
      Na telefonie / tablecie wyłączone.

   Ślad i siła kursora są liczone względem wysokości ekranu, żeby ruch
   wyglądał tak samo jak na stronie startowej. Nie ma tu ruchu
   "sam z siebie" (--fluid-auto-*).

   Kiedy efektu NIE ma (zostaje zwykłe zdjęcie):
     • użytkownik ma w systemie włączone "ogranicz ruch",
     • przeglądarka nie obsługuje potrzebnych funkcji WebGL,
     • zdjęcie się nie załaduje (albo strona otwarta prosto z dysku),
     • komputer jest za słaby (jak w fluid.js: najpierw obniżamy jakość,
       a gdy to nie pomaga — wyłączamy).
   =================================================================== */

(function () {
  "use strict";

  var PRESSURE_ITERATIONS = 20;
  var MAX_DPR = 2;
  var QUALITY_LEVELS = [
    { res: 1,    dpr: MAX_DPR },
    { res: 0.75, dpr: 1.5 },
    { res: 0.5,  dpr: 1 },
    { res: 0.375, dpr: 0.75 }
  ];
  var SLOW_FRAME_MS = 28, CAPPED_MAX_MS = 38, STEADY_SPREAD_MS = 4;
  var WARMUP_FRAMES = 20, MEASURE_FRAMES = 40;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var rootStyle = getComputedStyle(document.documentElement);
  function cssNum(name, fallback) {
    var v = parseFloat(rootStyle.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }
  var isTouch = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* ----------------------------------------------------------------
     Shadery — symulacja identyczna jak w fluid.js
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
  var FRAG_SPLAT = HEAD + [
    "uniform sampler2D uTarget; uniform float aspectRatio; uniform vec2 color; uniform vec2 point; uniform float radius;",
    "void main () {",
    "  vec2 p = vUv - point; p.x *= aspectRatio;",
    "  vec2 splat = exp(-dot(p, p) / radius) * color;",
    "  gl_FragColor = vec4(texture2D(uTarget, vUv).xy + splat, 0.0, 1.0);",
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
  // przesunięcie całego pola płynu (kafelki: przy przewijaniu woda jedzie razem ze stroną)
  var FRAG_SHIFT = HEAD + [
    "uniform sampler2D uSrc; uniform vec2 uShift;",
    "void main () {",
    "  vec2 c = vUv - uShift;",
    "  if (c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);",
    "  else gl_FragColor = texture2D(uSrc, c);",
    "}"
  ].join("\n");
  // pojedyncze zdjęcie przesunięte według mapy przesunięć (+ lekkie rozszczepienie kolorów)
  var FRAG_DISPLAY = HEAD + [
    "uniform sampler2D uImage, uDisp; uniform vec2 uCover; uniform float uStrength, uChroma;",
    "void main () {",
    "  vec2 d = texture2D(uDisp, vUv).xy * uStrength;",
    "  vec2 uv = (vUv - 0.5) * uCover + 0.5;",
    "  vec2 off = d * uCover;",
    "  vec2 ca = off * uChroma;",
    "  float r = texture2D(uImage, uv - off - ca).r;",
    "  float g = texture2D(uImage, uv - off).g;",
    "  float b = texture2D(uImage, uv - off + ca).b;",
    "  gl_FragColor = vec4(r, g, b, 1.0);",
    "}"
  ].join("\n");
  // kafelek: prostokąt w miejscu zdjęcia na ekranie; mapa przesunięć jest wspólna dla całego ekranu
  var VERT_TILE = [
    "precision highp float; attribute vec2 aPosition; uniform vec4 uRect; varying vec2 vScreen, vLocal;",
    "void main () {",
    "  vLocal = aPosition * 0.5 + 0.5;",
    "  vScreen = mix(uRect.xy, uRect.zw, vLocal);",
    "  gl_Position = vec4(vScreen * 2.0 - 1.0, 0.0, 1.0);",
    "}"
  ].join("\n");
  var FRAG_TILE = [
    "precision highp float; precision highp sampler2D; varying vec2 vScreen, vLocal;",
    "uniform sampler2D uImage, uDisp; uniform vec4 uRect; uniform vec2 uSizePx; uniform float uStrength, uChroma, uRadiusPx;",
    "void main () {",
    "  vec2 d = texture2D(uDisp, vScreen).xy * uStrength;",
    "  vec2 off = d / (uRect.zw - uRect.xy);",      // przesunięcie przeliczone na wielkość kafelka
    "  vec2 ca = off * uChroma;",
    "  float r = texture2D(uImage, vLocal - off - ca).r;",
    "  float g = texture2D(uImage, vLocal - off).g;",
    "  float b = texture2D(uImage, vLocal - off + ca).b;",
    // zaokrąglone rogi jak w CSS (--radius-img), z wygładzoną krawędzią
    "  vec2 p = vLocal * uSizePx; vec2 q = min(p, uSizePx - p);",
    "  float a = 1.0;",
    "  if (q.x < uRadiusPx && q.y < uRadiusPx) a = clamp(uRadiusPx - length(vec2(uRadiusPx) - q) + 0.5, 0.0, 1.0);",
    "  gl_FragColor = vec4(vec3(r, g, b) * a, a);",
    "}"
  ].join("\n");

  /* ----------------------------------------------------------------
     Wspólny silnik: kontekst WebGL + symulacja płynu na danej kanwie
     ---------------------------------------------------------------- */
  function makeFluid(canvas, alpha, extraPrograms) {
    var attrs = { alpha: alpha, premultipliedAlpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    var gl = canvas.getContext("webgl2", attrs);
    var isGL2 = !!gl;
    if (!gl) gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);
    if (!gl) return null;
    var halfType, internalRGBA;
    if (isGL2) {
      if (!gl.getExtension("EXT_color_buffer_float")) return null;
      halfType = gl.HALF_FLOAT; internalRGBA = gl.RGBA16F;
    } else {
      var ext = gl.getExtension("OES_texture_half_float");
      if (!ext || !gl.getExtension("OES_texture_half_float_linear")) return null;
      halfType = ext.HALF_FLOAT_OES; internalRGBA = gl.RGBA;
    }

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn("photo-fluid.js shader:", gl.getShaderInfoLog(sh)); return null; }
      return sh;
    }
    var vertShader = compile(gl.VERTEX_SHADER, VERT);
    if (!vertShader) return null;
    function program(fragSrc, vertSrc) {
      var vs = vertSrc ? compile(gl.VERTEX_SHADER, vertSrc) : vertShader;
      var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) return null;
      var p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs);
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn("photo-fluid.js program:", gl.getProgramInfoLog(p)); return null; }
      var uniforms = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; uniforms[name] = gl.getUniformLocation(p, name); }
      return { id: p, u: uniforms };
    }
    var progs = {
      splat: program(FRAG_SPLAT), advect: program(FRAG_ADVECT), disp: program(FRAG_DISP),
      curl: program(FRAG_CURL), vorticity: program(FRAG_VORTICITY), divergence: program(FRAG_DIVERGENCE),
      pressure: program(FRAG_PRESSURE), gradient: program(FRAG_GRADIENT)
    };
    for (var name in extraPrograms) progs[name] = program(extraPrograms[name][0], extraPrograms[name][1]);
    for (var key in progs) if (!progs[key]) return null;

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

    /* bufory symulacji */
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
        attach: function (unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); return unit; },
        free: function () { gl.deleteTexture(tex); gl.deleteFramebuffer(fbo); }
      };
    }
    function createDoubleFBO(w, h) {
      var a = createFBO(w, h), b = createFBO(w, h);
      return {
        ok: a.ok && b.ok, width: w, height: h, texelX: a.texelX, texelY: a.texelY,
        get read() { return a; }, get write() { return b; },
        swap: function () { var t = a; a = b; b = t; },
        free: function () { a.free(); b.free(); }
      };
    }
    // res = liczba komórek na krótszym boku kanwy
    function initSim(old, res) {
      if (old) freeSim(old);
      var aspect = canvas.width / Math.max(1, canvas.height);
      var w = aspect > 1 ? Math.round(res * aspect) : res;
      var h = aspect > 1 ? res : Math.round(res / aspect);
      var s = { res: res, velocity: createDoubleFBO(w, h), disp: createDoubleFBO(w, h), pressure: createDoubleFBO(w, h), curl: createFBO(w, h), divergence: createFBO(w, h) };
      if (!(s.velocity.ok && s.disp.ok && s.pressure.ok && s.curl.ok && s.divergence.ok)) { freeSim(s); return null; }
      return s;
    }
    function freeSim(s) { s.velocity.free(); s.disp.free(); s.pressure.free(); s.curl.free(); s.divergence.free(); }

    // ślad kursora: radius = promień w jednostkach wysokości kanwy
    function splat(sim, x, y, dx, dy, radius) {
      var pr = progs.splat; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, sim.velocity.texelX, sim.velocity.texelY);
      gl.uniform1i(pr.u.uTarget, sim.velocity.read.attach(0));
      gl.uniform1f(pr.u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(pr.u.point, x, y);
      gl.uniform2f(pr.u.color, dx, dy);
      gl.uniform1f(pr.u.radius, radius * radius);
      blit(sim.velocity.write); sim.velocity.swap();
    }
    // jeden krok symulacji — jak w fluid.js
    function step(sim, dt, P, pointers, force, radius) {
      var v = sim.velocity, ts = [v.texelX, v.texelY], pr;
      for (var id in pointers) {
        var p = pointers[id];
        if (p.dx !== 0 || p.dy !== 0) { splat(sim, p.x, p.y, p.dx * force, p.dy * force, radius); p.dx = 0; p.dy = 0; }
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

    // zdjęcie jako tekstura; source = <img> albo zmniejszona kopia na <canvas>
    function imageTexture(source) {
      var tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      } catch (e) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.deleteTexture(tex);
        throw e;
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    }

    return { gl: gl, progs: progs, blit: blit, initSim: initSim, step: step, imageTexture: imageTexture };
  }

  /* pomiar szybkości klatek: najpierw obniżamy jakość, a gdy to nie pomaga — wyłączamy */
  function makePerfMeter(onSlower, onGiveUp) {
    var warmup, measured, measuredMs, measuredSq;
    function reset() { warmup = WARMUP_FRAMES; measured = 0; measuredMs = 0; measuredSq = 0; }
    reset();
    return {
      reset: reset,
      check: function (frameMs, level) {
        if (frameMs > 250) { reset(); return; }
        if (warmup > 0) { warmup--; return; }
        measured++; measuredMs += frameMs; measuredSq += frameMs * frameMs;
        if (measured < MEASURE_FRAMES) return;
        var avg = measuredMs / measured;
        var spread = Math.sqrt(Math.max(0, measuredSq / measured - avg * avg));
        reset();
        if (avg <= SLOW_FRAME_MS) return;
        if (avg <= CAPPED_MAX_MS && spread <= STEADY_SPREAD_MS) return;
        if (level < QUALITY_LEVELS.length - 1) {
          console.info("photo-fluid.js: wolne klatki (" + avg.toFixed(0) + " ms), obniżam jakość do stopnia " + (level + 1));
          onSlower();
        } else {
          console.info("photo-fluid.js: sprzęt za słaby (" + avg.toFixed(0) + " ms/klatkę), wyłączam efekt.");
          onGiveUp();
        }
      }
    };
  }
  // jak długo pętla działa po ostatnim ruchu kursora (aż obraz wróci do normy)
  function idleSeconds(P) {
    var slowest = Math.min(P.fade, P.persist);
    return slowest > 0 ? Math.min(300, 4 + 10 / slowest) : Infinity;
  }

  /* ----------------------------------------------------------------
     Tryb 1: pojedyncze zdjęcie (bio) — własna kanwa nad obrazkiem
     ---------------------------------------------------------------- */
  function attach(img) {
    var qualityLevel = 0;
    function readParams() {
      return {
        strength: cssNum("--fluid-strength", 1),
        force: cssNum("--fluid-force", 1),
        radius: cssNum("--fluid-radius", 6),
        fade: cssNum("--fluid-fade", 1.5),
        persist: cssNum("--fluid-persist", 1),
        swirl: cssNum("--fluid-swirl", 20),
        chroma: cssNum("--fluid-chroma", 0.3),
        res: Math.max(32, Math.min(512, Math.round(cssNum("--fluid-res", 128) * QUALITY_LEVELS[qualityLevel].res)))
      };
    }

    // opakowanie: obrazek zostaje, nad nim kanwa tej samej wielkości
    var wrap = document.createElement("span");
    wrap.className = "fluid-photo-wrap";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    var canvas = document.createElement("canvas");
    canvas.className = "fluid-photo-canvas";
    canvas.setAttribute("aria-hidden", "true");

    var F = makeFluid(canvas, false, { display: [FRAG_DISPLAY] });
    if (!F) return;
    var gl = F.gl, progs = F.progs;
    var sim = null;

    var imageTex = null, imageW = 1, imageH = 1, dead = false;
    function loadImage() {
      if (dead || imageTex || !img.complete || !img.naturalWidth) return;
      try { imageTex = F.imageTexture(img); }
      catch (e) { console.warn("photo-fluid.js: nie można użyć zdjęcia w WebGL, efekt wyłączony.", e); giveUp(); return; }
      imageW = img.naturalWidth; imageH = img.naturalHeight;
      // kanwę dokładamy dopiero po narysowaniu pierwszej klatki (patrz frame), inaczej mignie na czarno
      resize();
      rect = canvas.getBoundingClientRect();
      wake();
    }
    function giveUp() {
      dead = true; running = false; imageTex = null;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, QUALITY_LEVELS[qualityLevel].dpr);
      var w = Math.max(1, Math.round(img.clientWidth * dpr));
      var h = Math.max(1, Math.round(img.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; sim = null; }
    }

    /* kursor / dotyk — tylko nad zdjęciem; położenie liczymy względem zdjęcia */
    var pointers = {}, lastInput = 0, rect = null;
    function pointerMove(e) {
      if (!rect) return;
      var x = (e.clientX - rect.left) / rect.width;
      var y = 1 - (e.clientY - rect.top) / rect.height;
      var p = pointers[e.pointerId];
      if (x < 0 || x > 1 || y < 0 || y > 1) { if (p) p.fresh = true; return; }
      if (!p) p = pointers[e.pointerId] = { x: x, y: y, dx: 0, dy: 0, fresh: true };
      if (p.fresh) { p.x = x; p.y = y; p.fresh = false; }
      // ta sama granica skoku co na stronie startowej, przeliczona na wielkość zdjęcia
      var lim = 0.04 * scale();
      p.dx = clamp(p.dx + x - p.x, -lim, lim);
      p.dy = clamp(p.dy + y - p.y, -lim, lim);
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

    // ile razy zdjęcie jest mniejsze od ekranu: ten sam ruch kursora w pikselach
    // ma dawać ten sam efekt co na stronie startowej (tam pole = cały ekran)
    function scale() { return rect ? window.innerHeight / Math.max(1, rect.height) : 1; }

    function render(P) {
      var pr = progs.display; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.texelSize, 1 / canvas.width, 1 / canvas.height);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.uniform1i(pr.u.uImage, 0);
      gl.uniform1i(pr.u.uDisp, sim.disp.read.attach(1));
      var canvasAspect = canvas.width / canvas.height, imageAspect = imageW / imageH;
      if (canvasAspect > imageAspect) gl.uniform2f(pr.u.uCover, 1, imageAspect / canvasAspect);
      else gl.uniform2f(pr.u.uCover, canvasAspect / imageAspect, 1);
      gl.uniform1f(pr.u.uStrength, P.strength);
      gl.uniform1f(pr.u.uChroma, P.chroma);
      F.blit(null);
    }

    /* pętla — tylko gdy coś się dzieje i zdjęcie jest na ekranie */
    var running = false, lastTime = 0, visible = true;
    var perf = makePerfMeter(function () { qualityLevel++; sim = null; }, giveUp);
    function wake() {
      if (running || dead || !imageTex || !visible) return;
      running = true; lastTime = performance.now(); perf.reset();
      requestAnimationFrame(frame);
    }
    function frame(now) {
      if (!imageTex || dead || !visible) { running = false; return; }
      var frameMs = now - lastTime;
      var dt = Math.min(frameMs / 1000, 1 / 30);
      lastTime = now;
      perf.check(frameMs, qualityLevel);
      if (dead) return;
      var P = readParams();
      try {
        resize();
        rect = canvas.getBoundingClientRect();
        if (!sim || sim.res !== P.res) { sim = F.initSim(sim, P.res); if (!sim) { giveUp(); return; } }
        var s = scale();
        F.step(sim, dt, P, pointers, 6000 * P.force / s, P.radius / 100 * s);
        render(P);
        if (canvas.parentNode !== wrap) wrap.appendChild(canvas);
      } catch (e) {
        console.warn("photo-fluid.js: błąd rysowania, efekt wyłączony.", e);
        giveUp(); return;
      }
      if (now - lastInput > idleSeconds(P) * 1000) { running = false; return; }
      requestAnimationFrame(frame);
    }
    // panel mógł zmienić dokładność symulacji, gdy pętla spała
    setInterval(function () {
      if (running || !imageTex || !visible) return;
      if (sim && sim.res !== readParams().res) wake();
    }, 1000);

    window.addEventListener("resize", function () { resize(); wake(); });
    window.addEventListener("scroll", function () { if (imageTex) rect = canvas.getBoundingClientRect(); }, { passive: true });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); giveUp(); });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) wake();
      }).observe(wrap);
    }

    if (img.complete && img.naturalWidth) loadImage();
    else { img.addEventListener("load", loadImage); img.addEventListener("error", giveUp); }
  }

  /* ----------------------------------------------------------------
     Tryb 2: kafelki — jedna kanwa na cały ekran, jedna symulacja
     ---------------------------------------------------------------- */
  function startTiles() {
    if (isTouch || !window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;

    var MAX_TEXTURES = 16;   // ile zdjęć kafelków trzymamy naraz w karcie graficznej
    var F = null, gl, progs, canvas, sim = null, dead = false, qualityLevel = 0;

    function readParams() {
      return {
        strength: cssNum("--tile-fluid-strength", 0.15),
        force: cssNum("--tile-fluid-force", 1.15),
        radius: cssNum("--tile-fluid-radius", 2.5),
        fade: cssNum("--tile-fluid-fade", 1.5),
        persist: cssNum("--tile-fluid-persist", 1),
        swirl: cssNum("--fluid-swirl", 20),
        chroma: cssNum("--fluid-chroma", 0.3),
        // pole symulacji obejmuje cały ekran, więc potrzebuje więcej komórek niż jedno zdjęcie
        res: Math.max(64, Math.min(768, Math.round(cssNum("--fluid-res", 128) * 2 * QUALITY_LEVELS[qualityLevel].res)))
      };
    }

    // kanwę i WebGL tworzymy dopiero przy pierwszym najechaniu na kafelek
    function init() {
      if (F || dead) return !!F;
      canvas = document.createElement("canvas");
      canvas.className = "tile-fluid-canvas";
      canvas.setAttribute("aria-hidden", "true");
      F = makeFluid(canvas, true, { tile: [FRAG_TILE, VERT_TILE], shift: [FRAG_SHIFT] });
      if (!F) { dead = true; return false; }
      gl = F.gl; progs = F.progs;
      document.body.appendChild(canvas);
      canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); giveUp(); });
      return true;
    }
    function giveUp() {
      dead = true; running = false;
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function viewW() { return document.documentElement.clientWidth; }
    function viewH() { return document.documentElement.clientHeight; }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, QUALITY_LEVELS[qualityLevel].dpr);
      var w = Math.max(1, Math.round(viewW() * dpr));
      var h = Math.max(1, Math.round(viewH() * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; sim = F.initSim(sim, readParams().res); }
    }

    /* zdjęcia kafelków jako tekstury — zmniejszone do wielkości na ekranie */
    var textures = new Map();  // img → { tex, used }
    var scratch = document.createElement("canvas");
    function textureFor(img, r) {
      var t = textures.get(img);
      if (t) { t.used = performance.now(); return t.tex; }
      if (!img.complete || !img.naturalWidth) return null;
      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var k = Math.min(1, (r.width * dpr) / img.naturalWidth);
      var w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
      var source = img;
      if (k < 1) {
        scratch.width = w; scratch.height = h;
        var c2d = scratch.getContext("2d");
        c2d.imageSmoothingQuality = "high";
        c2d.drawImage(img, 0, 0, w, h);
        source = scratch;
      }
      var tex;
      try { tex = F.imageTexture(source); }
      catch (e) { console.warn("photo-fluid.js: nie można użyć zdjęcia kafelka w WebGL.", e); return null; }
      textures.set(img, { tex: tex, used: performance.now() });
      // za dużo tekstur: usuń te najdawniej używane
      while (textures.size > MAX_TEXTURES) {
        var oldest = null, oldestUsed = Infinity;
        textures.forEach(function (v, key) { if (v.used < oldestUsed) { oldestUsed = v.used; oldest = key; } });
        gl.deleteTexture(textures.get(oldest).tex); textures.delete(oldest);
      }
      return tex;
    }
    // kafelek zniknął ze strony (np. zmiana języka przerysowała listę) — zwolnij jego teksturę
    function pruneTextures() {
      textures.forEach(function (v, key) { if (!key.isConnected) { gl.deleteTexture(v.tex); textures.delete(key); } });
    }

    /* które kafelki rysujemy: te, nad którymi lub obok których przeszedł kursor
       (woda może wylać się trochę poza kafelek, na sąsiedni) */
    var active = new Set();
    function markActive(clientX, clientY) {
      var margin = 3 * readParams().radius / 100 * viewH();
      var imgs = document.querySelectorAll("img.tile__img");
      for (var i = 0; i < imgs.length; i++) {
        var r = imgs[i].getBoundingClientRect();
        if (clientX > r.left - margin && clientX < r.right + margin && clientY > r.top - margin && clientY < r.bottom + margin) active.add(imgs[i]);
      }
    }

    /* kursor — ślad zostawia tylko nad zdjęciem kafelka; położenie względem ekranu */
    var pointers = {}, lastInput = 0;
    function overTile(target) {
      var wrap = target && target.closest && target.closest(".tile__imgwrap");
      return !!(wrap && wrap.querySelector("img.tile__img"));
    }
    function pointerMove(e) {
      var p = pointers[e.pointerId];
      if (!overTile(e.target)) { if (p) p.fresh = true; return; }
      if (!init()) return;
      var x = e.clientX / viewW(), y = 1 - e.clientY / viewH();
      if (!p) p = pointers[e.pointerId] = { x: x, y: y, dx: 0, dy: 0, fresh: true };
      if (p.fresh) { p.x = x; p.y = y; p.fresh = false; }
      p.dx = clamp(p.dx + x - p.x, -0.04, 0.04);  // ta sama granica skoku co na stronie startowej
      p.dy = clamp(p.dy + y - p.y, -0.04, 0.04);
      p.x = x; p.y = y;
      markActive(e.clientX, e.clientY);
      lastInput = performance.now();
      wake();
    }
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerup", function (e) { delete pointers[e.pointerId]; }, { passive: true });
    window.addEventListener("pointercancel", function (e) { delete pointers[e.pointerId]; }, { passive: true });
    document.addEventListener("mouseleave", function () { pointers = {}; });

    // przewinięcie strony: przesuń pole płynu razem z treścią
    var lastScrollX = 0, lastScrollY = 0;
    function shiftField(sx, sy) {
      var pr = progs.shift; gl.useProgram(pr.id);
      gl.uniform2f(pr.u.uShift, sx, sy);
      [sim.velocity, sim.disp].forEach(function (f) {
        gl.uniform1i(pr.u.uSrc, f.read.attach(0));
        F.blit(f.write); f.swap();
      });
    }

    function draw(P) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      var pr = progs.tile; gl.useProgram(pr.id);
      gl.uniform1i(pr.u.uImage, 0);
      gl.uniform1i(pr.u.uDisp, 1);
      gl.uniform1f(pr.u.uStrength, P.strength);
      gl.uniform1f(pr.u.uChroma, P.chroma);
      var vw = viewW(), vh = viewH(), dprX = canvas.width / vw, dprY = canvas.height / vh;
      var uploads = 0;
      active.forEach(function (img) {
        if (!img.isConnected) { active.delete(img); return; }
        var r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw || r.width < 1) return;
        // najwyżej jedno nowe zdjęcie na klatkę, żeby nie przycinało
        if (!textures.has(img)) { if (uploads > 0) return; uploads++; }
        var tex = textureFor(img, r);
        if (!tex) return;
        var radius = parseFloat(getComputedStyle(img.parentNode).borderTopLeftRadius) || 0;
        gl.uniform4f(pr.u.uRect, r.left / vw, 1 - r.bottom / vh, r.right / vw, 1 - r.top / vh);
        gl.uniform2f(pr.u.uSizePx, r.width * dprX, r.height * dprY);
        gl.uniform1f(pr.u.uRadiusPx, radius * dprX);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
        sim.disp.read.attach(1);
        F.blit(null);
      });
    }

    /* pętla — tylko gdy coś się dzieje; potem kanwa się chowa */
    var running = false, lastTime = 0;
    var perf = makePerfMeter(function () { qualityLevel++; }, giveUp);
    function wake() {
      if (running || dead || !F || document.hidden) return;
      running = true; lastTime = performance.now(); perf.reset();
      lastScrollX = window.scrollX; lastScrollY = window.scrollY;
      requestAnimationFrame(frame);
    }
    function sleep() {
      running = false;
      canvas.style.visibility = "hidden";
      active.clear();
      pruneTextures();
    }
    function frame(now) {
      if (dead) return;
      if (document.hidden) { running = false; return; }
      var frameMs = now - lastTime;
      var dt = Math.min(frameMs / 1000, 1 / 30);
      lastTime = now;
      perf.check(frameMs, qualityLevel);
      if (dead) return;
      var P = readParams();
      try {
        resize();
        if (!sim || sim.res !== P.res) { sim = F.initSim(sim, P.res); if (!sim) { giveUp(); return; } }
        var sx = window.scrollX, sy = window.scrollY;
        if (sx !== lastScrollX || sy !== lastScrollY) {
          shiftField(-(sx - lastScrollX) / viewW(), (sy - lastScrollY) / viewH());
          lastScrollX = sx; lastScrollY = sy;
        }
        F.step(sim, dt, P, pointers, 6000 * P.force, P.radius / 100);
        draw(P);
        canvas.style.visibility = "visible";  // dopiero po narysowaniu klatki — bez mignięcia
      } catch (e) {
        console.warn("photo-fluid.js: błąd rysowania, efekt wyłączony.", e);
        giveUp(); return;
      }
      if (now - lastInput > idleSeconds(P) * 1000) { sleep(); return; }
      requestAnimationFrame(frame);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden && lastInput) wake(); });
  }

  function start() {
    var imgs = document.querySelectorAll("img.fluid-photo");
    for (var i = 0; i < imgs.length; i++) attach(imgs[i]);
  }
  if (document.querySelector("img.fluid-photo")) start();
  else document.addEventListener("DOMContentLoaded", start);
  startTiles();
})();
