"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

// ─── Constants ────────────────────────────────────────────────────────────────
const CARD_W = 380;
const CARD_H = 240;
const CARD_GAP = 200;
const AUTO_SPEED = 55;
const PARTICLE_COUNT = 1500;
const BEAM_COLOR = "#a855f7";
const PARTICLE_COLOR = "#d8b4fe";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=-%@!";

const CHAR_W  = 10;
const CHAR_H  = 16;
const PAD_X   = 0;
const PAD_Y   = 0;
const COLS    = Math.floor((CARD_W - PAD_X * 2) / CHAR_W);
const ROWS    = Math.floor((CARD_H - PAD_Y * 2) / CHAR_H);

function lcg(seed) {
  let s = seed | 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

function seedFromStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

function randomGlyph(rand) {
  return GLYPHS[Math.floor(rand() * GLYPHS.length)];
}

function makeGrid(seed) {
  const rand = lcg(seed);
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => randomGlyph(rand))
  );
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  if (h.length === 3)
    return [parseInt(h[0]+h[0],16)/255, parseInt(h[1]+h[1],16)/255, parseInt(h[2]+h[2],16)/255];
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
}

// ─── WebGL Beam ───────────────────────────────────────────────────────────────
const BEAM_VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const BEAM_FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_color;
uniform float u_card;
uniform float u_splitNorm;
uniform float u_cardTop;
uniform float u_cardBottom;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1,0));
  float c = hash(i+vec2(0,1));
  float d = hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * 0.001;

  float cx = u_splitNorm;
  float dx = uv.x - cx;

  float yFade = smoothstep(0.10, 0.46, uv.y) * smoothstep(0.10, 0.46, 1.0 - uv.y);

  float flicker = 0.88 + 0.12 * sin(t * 6.28 * 1.3 + uv.y * 2.0)
                       + 0.05 * sin(t * 6.28 * 2.7);

  vec3 col = vec3(0.0);

  float cardMix = smoothstep(0.0, 1.0, u_card);

  float idleCore  = exp(-abs(dx) * 420.0);
  float idleInner = exp(-abs(dx) * 140.0);
  float idleOuter = exp(-abs(dx) *  44.0);

  float idleShimmer = noise(vec2(uv.y * 12.0, t * 2.0)) * 0.18;

  vec3 idleCoreCol  = mix(u_color, vec3(1.0), 0.9);
  vec3 idleInnerCol = mix(u_color, vec3(1.0), 0.45);
  vec3 idleOuterCol = u_color;

  vec3 idleCol = idleOuterCol * idleOuter * 0.46
      + idleInnerCol * idleInner * 0.68
      + idleCoreCol  * idleCore  * (0.86 + idleShimmer * 0.8);

  idleCol *= yFade * flicker;

  float idleCy = 0.5;
  float idleDy = abs(uv.y - idleCy);
  float idleHFlare = exp(-idleDy * 38.0) * exp(-abs(dx) * 5.5) * 0.26;
  idleCol += u_color * idleHFlare * flicker;

  float px = dx;
  float edge = max(1.5 / u_res.y, 0.002);
  float cardMask = smoothstep(u_cardBottom, u_cardBottom + edge, uv.y)
                 * (1.0 - smoothstep(u_cardTop - edge, u_cardTop, uv.y));

  float core  = exp(-abs(px) * 380.0);
  float inner = exp(-abs(px) * 110.0);
  float outer = exp(-abs(px) *  22.0);

  float shimmer = noise(vec2(uv.y * 14.0, t * 3.0)) * 0.22;

  vec3 coreCol  = mix(u_color, vec3(1.0), 0.95);
  vec3 innerCol = mix(u_color, vec3(1.0), 0.55);

  vec3 cardCol = u_color  * outer * 0.18
      + innerCol * inner * 0.42
      + coreCol  * core  * (0.88 + shimmer * 0.42);

  cardCol *= cardMask * flicker;

  float cy   = 0.5;
  float dy   = abs(uv.y - cy);
  float hFlar = exp(-dy * 60.0) * exp(-abs(px) * 6.0) * 0.08;
  cardCol += u_color * hFlar * flicker;

  col = mix(idleCol, cardCol, cardMix);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function buildProgram(gl, vert, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  return p;
}

function useWebGLBeam(canvasRef, primaryColor) {
  const stateRef = useRef({
    hasCard: false,
    splitNorm: 0.5,
    cardTop: 0.5,
    cardBottom: 0.5,
    cardLeft: 0.5,
    cardRight: 0.5,
    cardProgress: 0,
    time: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const prog = buildProgram(gl, BEAM_VERT, BEAM_FRAG);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uCard  = gl.getUniformLocation(prog, "u_card");
    const uSplit = gl.getUniformLocation(prog, "u_splitNorm");
    const uCardTop = gl.getUniformLocation(prog, "u_cardTop");
    const uCardBottom = gl.getUniformLocation(prog, "u_cardBottom");

    const [r, g, b] = hexToRgb(primaryColor);

    let raf;
    const smoothed = {
      card: 0,
      top: stateRef.current.cardTop,
      bottom: stateRef.current.cardBottom,
      lastTs: 0,
    };

    const tick = (ts) => {
      const { hasCard, splitNorm, cardTop, cardBottom } = stateRef.current;
      const frameDelta = smoothed.lastTs ? Math.min(ts - smoothed.lastTs, 50) : 16;
      smoothed.lastTs = ts;
      const targetCard = hasCard ? 1 : 0;
      const blend = 1 - Math.exp(-frameDelta * (hasCard ? 0.012 : 0.006));

      smoothed.card += (targetCard - smoothed.card) * blend;
      smoothed.top += (cardTop - smoothed.top) * blend;
      smoothed.bottom += (cardBottom - smoothed.bottom) * blend;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes,   w, h);
      gl.uniform1f(uTime,  ts);
      gl.uniform3f(uColor, r, g, b);
      gl.uniform1f(uCard,  smoothed.card);
      gl.uniform1f(uSplit, splitNorm);
      gl.uniform1f(uCardTop, smoothed.top);
      gl.uniform1f(uCardBottom, smoothed.bottom);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, primaryColor]);

  return stateRef;
}

function makeParticles(count) {
  const rand = lcg(0x51f15eed);
  return Array.from({ length: count }, () => ({
    seed: rand() * 1000,
    y: rand(),
    speed: 0.45 + rand() * 0.85,
    travel: 18 + rand() * 52,
    size: 0.65 + rand() * 0.9,
  }));
}

function useParticleCanvas(canvasRef, beamStateRef) {
  const particles = useMemo(() => makeParticles(PARTICLE_COUNT), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf;
    const visibleState = {
      alpha: 0,
      splitNorm: 0.5,
      cardTop: 0.5,
      cardBottom: 0.5,
      cardLeft: 0.5,
      cardRight: 0.5,
      lastTs: 0,
    };
    const draw = (ts) => {
      const frameDelta = visibleState.lastTs ? Math.min(ts - visibleState.lastTs, 50) : 16;
      visibleState.lastTs = ts;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const state = beamStateRef.current;
      const targetAlpha = state.hasCard ? 1 : 0;
      const blend = 1 - Math.exp(-frameDelta * (state.hasCard ? 0.012 : 0.006));
      visibleState.alpha += (targetAlpha - visibleState.alpha) * blend;

      if (state.hasCard) {
        visibleState.splitNorm = state.splitNorm;
        visibleState.cardTop = state.cardTop;
        visibleState.cardBottom = state.cardBottom;
        visibleState.cardLeft = state.cardLeft;
        visibleState.cardRight = state.cardRight;
      }

      if (visibleState.alpha < 0.01) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const beamX = visibleState.splitNorm * width;
      const top = (1 - visibleState.cardTop) * height;
      const bottom = (1 - visibleState.cardBottom) * height;
      const left = visibleState.cardLeft * width;
      const right = visibleState.cardRight * width;
      const particleAlpha = visibleState.alpha;
      const time = ts * 0.001;

      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        const life = (time * p.speed + p.seed) % 1;
        const maxTravel = Math.max(0, right - beamX);
        const travel = Math.min(p.travel, maxTravel);
        const startX = beamX + 0.25;
        const x = startX + life * travel;
        const y = top + p.y * (bottom - top) + Math.sin(time * 6 + p.seed) * 1.4;
        const edgeFade = Math.min(1, maxTravel / 10);
        const fade =
          Math.min(1, life / 0.16) *
          Math.min(1, (1 - life) / 0.28) *
          particleAlpha *
          edgeFade;
        if (fade <= 0) continue;

        ctx.globalAlpha = fade * 0.9;
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [beamStateRef, canvasRef, particles]);
}

// ─── Card sub-components ──────────────────────────────────────────────────────
function Chip() {
  return (
    <div className="relative h-9 w-12 rounded-md bg-[#f0ead6] shadow-inner overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-[2px] bg-[#c8b97a] opacity-80" />
        ))}
      </div>
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#a08840]/60 -translate-y-1/2" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#a08840]/60 -translate-x-1/2" />
    </div>
  );
}

function Contactless() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {[10, 16, 22].map((r, i) => (
        <span key={i} className="absolute rounded-r-full border-y-2 border-r-2 border-white/80"
          style={{ width: r, height: r, opacity: 0.9 - i * 0.18 }} />
      ))}
    </div>
  );
}

function NetworkMark({ c1, c2 }) {
  return (
    <div className="flex -space-x-2.5">
      <span className="w-8 h-8 rounded-full" style={{ background: c1, opacity: 0.95 }} />
      <span className="w-8 h-8 rounded-full" style={{ background: c2, opacity: 0.85 }} />
    </div>
  );
}

function PlainFace({ card }) {
  return (
    <div
      className="absolute inset-0 rounded-lg p-6 flex flex-col justify-between text-white overflow-hidden"
      style={{
        background: card.gradient,
        boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%)]" />
      <div className="relative flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Chip />
          <Contactless />
        </div>
        <NetworkMark c1={card.networkColor1} c2={card.networkColor2} />
      </div>
      <div className="relative">
        <p className="font-mono text-xl font-bold tracking-[0.16em] text-white/95">{card.number}</p>
      </div>
      <div className="relative flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50">Card Holder</p>
          <p className="mt-0.5 font-semibold text-base text-white/95">{card.holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/50">Expires</p>
          <p className="mt-0.5 font-semibold text-base text-white/95">{card.expiry}</p>
        </div>
      </div>
    </div>
  );
}

function AsciiFace({ card, beamLit }) {
  const seed = useMemo(() => seedFromStr(card.id || card.number || card.holder), [card]);
  const [grid, setGrid] = useState(() => makeGrid(seed));
  const randRef = useRef(null);

  useEffect(() => {
    randRef.current = lcg((seed ^ 0xdeadbeef) + Date.now());
  }, [seed]);

  useEffect(() => {
    if (!beamLit) return;
    const interval = setInterval(() => {
      const rand = randRef.current;
      setGrid(prev =>
        prev.map(row =>
          row.map(ch => (rand() < 0.22 ? randomGlyph(rand) : ch))
        )
      );
    }, 55);
    return () => clearInterval(interval);
  }, [beamLit]);

  return (
    <div
      className="absolute inset-0 rounded-lg overflow-hidden"
      style={{ background: "#06060f" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 50%, ${card.glowColor}30 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute font-mono select-none"
        style={{
          top: PAD_Y, left: PAD_X, right: PAD_X, bottom: PAD_Y,
          fontSize: 11,
          lineHeight: `${CHAR_H}px`,
          letterSpacing: `${CHAR_W - 7}px`,
          color: card.glowColor,
          opacity: 0.85,
          textShadow: beamLit
            ? `0 0 6px ${card.glowColor}, 0 0 14px ${card.glowColor}99`
            : `0 0 4px ${card.glowColor}66`,
          whiteSpace: "pre",
          overflow: "hidden",
          transition: "text-shadow 0.15s",
        }}
      >
        {grid.map((row, i) => (
          <div key={i}>{row.join("")}</div>
        ))}
      </div>
    </div>
  );
}

function CardShell({ card, settersRef }) {
  const [beamLit, setBeamLit] = useState(false);
  const beamLitRef             = useRef(false);

  useEffect(() => {
    const setters = settersRef.current;
    setters[card._uid] = (px) => {
      const lit = px > 1 && px < CARD_W - 1;
      if (lit !== beamLitRef.current) {
        beamLitRef.current = lit;
        setBeamLit(lit);
      }
    };
    return () => { delete setters[card._uid]; };
  }, [card._uid, settersRef]);

  return (
    <div
      data-card-uid={card._uid}
      className="relative shrink-0 rounded-2xl"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div data-plain className="absolute inset-0"
        style={{ clipPath: `inset(0 ${CARD_W}px 0 0 round 16px)` }}>
        <PlainFace card={card} />
      </div>
      <div data-ascii className="absolute h-full w-full inset-0"
        style={{ clipPath: `inset(0 0 0 ${CARD_W}px round 16px)` }}>
        <AsciiFace card={card} beamLit={beamLit} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function FileEncryption({ cards = [] }) {
  const rootRef      = useRef(null);
  const trackRef     = useRef(null);
  const xRef         = useRef(null);
  const dragRef      = useRef({ active: false, lastX: 0, velocity: 0 });
  const beamCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const settersRef = useRef({});

  const allCards = useMemo(() => {
    if (!cards.length) return [];
    const tagged = cards.map((c, i) => ({ ...c, _uid: `${c.id ?? i}` }));
    return [
      ...tagged.map((c) => ({ ...c, _uid: `a-${c._uid}` })),
      ...tagged.map((c) => ({ ...c, _uid: `b-${c._uid}` })),
      ...tagged.map((c) => ({ ...c, _uid: `c-${c._uid}` })),
    ];
  }, [cards]);

  const singleGroupWidth = useMemo(
    () => cards.length * (CARD_W + CARD_GAP),
    [cards.length]
  );

  const beamStateRef = useWebGLBeam(beamCanvasRef, BEAM_COLOR);
  useParticleCanvas(particleCanvasRef, beamStateRef);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!cards.length) return;
    const root  = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    if (xRef.current === null) xRef.current = -singleGroupWidth;

    const onDown = (e) => {
      dragRef.current.active   = true;
      dragRef.current.lastX    = e.clientX ?? e.touches?.[0]?.clientX;
      dragRef.current.velocity = 0;
      root.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX;
      const dx = cx - dragRef.current.lastX;
      dragRef.current.lastX    = cx;
      dragRef.current.velocity = dx;
      xRef.current += dx;
    };
    const onUp = () => {
      dragRef.current.active = false;
      root.style.cursor = "grab";
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const update = (_time, delta) => {
      const dt = Math.min(delta, 50);

      if (!dragRef.current.active) {
        xRef.current += (AUTO_SPEED * dt) / 1000;
        if (Math.abs(dragRef.current.velocity) > 0.5) {
          xRef.current += dragRef.current.velocity * 0.4;
          dragRef.current.velocity *= 0.88;
        }
      }

      if (xRef.current >= 0)                    xRef.current -= singleGroupWidth;
      if (xRef.current < -2 * singleGroupWidth) xRef.current += singleGroupWidth;

      track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;

      const rootBox  = root.getBoundingClientRect();
      const beamX    = rootBox.left + rootBox.width / 2;
      const beamNorm = 0.5;

      let anyCard = false;
      let activeCardTop = 0.5;
      let activeCardBottom = 0.5;
      let activeCardLeft = 0.5;
      let activeCardRight = 0.5;
      let activeCardProgress = 0;

      track.querySelectorAll("[data-card-uid]").forEach((el) => {
        const uid     = el.dataset.cardUid;
        const box     = el.getBoundingClientRect();
        const splitPx = Math.max(0, Math.min(CARD_W, beamX - box.left));
        const lit     = splitPx > 1 && splitPx < CARD_W - 1;

        if (lit) {
          anyCard = true;
          activeCardTop = 1 - (box.top - rootBox.top) / rootBox.height;
          activeCardBottom = 1 - (box.bottom - rootBox.top) / rootBox.height;
          activeCardLeft = (box.left - rootBox.left) / rootBox.width;
          activeCardRight = (box.right - rootBox.left) / rootBox.width;
          activeCardProgress = splitPx / CARD_W;
        }

        settersRef.current[uid]?.(splitPx);

        const plain = el.querySelector("[data-plain]");
        const ascii = el.querySelector("[data-ascii]");
        if (plain) plain.style.clipPath = `inset(0 ${Math.max(CARD_W - splitPx, 0)}px 0 0 round 0)`;
        if (ascii) ascii.style.clipPath = `inset(0 0 0 ${splitPx}px round 0)`;
      });

      beamStateRef.current.hasCard   = anyCard;
      beamStateRef.current.splitNorm = beamNorm;
      if (anyCard) {
        beamStateRef.current.cardTop = Math.max(0, Math.min(1, activeCardTop));
        beamStateRef.current.cardBottom = Math.max(0, Math.min(1, activeCardBottom));
        beamStateRef.current.cardLeft = Math.max(0, Math.min(1, activeCardLeft));
        beamStateRef.current.cardRight = Math.max(0, Math.min(1, activeCardRight));
        beamStateRef.current.cardProgress = Math.max(0, Math.min(1, activeCardProgress));
      } else {
        beamStateRef.current.cardProgress = 0;
      }
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cards.length, singleGroupWidth, beamStateRef]);

  if (!cards.length) return null;

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden select-none"
      style={{ height: CARD_H + 80, cursor: "grab" }}
      aria-label="Encrypted cards marquee"
    >
      <canvas
        ref={beamCanvasRef}
        className="pointer-events-none absolute inset-0 z-40"
        style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
      />
      <canvas
        ref={particleCanvasRef}
        className="pointer-events-none absolute inset-0 z-50"
        style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-32"
        style={{ background: "linear-gradient(90deg, #07060f, transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-32"
        style={{ background: "linear-gradient(270deg, #07060f, transparent)" }} />

      <div
        ref={trackRef}
        className="absolute top-1/2 left-0 flex will-change-transform"
        style={{ gap: CARD_GAP, marginTop: -(CARD_H / 2) }}
      >
        {allCards.map((card) => (
          <CardShell key={card._uid} card={card} settersRef={settersRef} />
        ))}
      </div>

      <style>{`[data-card-uid] { transform: translateZ(0); }`}</style>
    </section>
  );
}
