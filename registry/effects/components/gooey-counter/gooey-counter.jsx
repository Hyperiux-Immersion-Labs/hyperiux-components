"use client";
import { useEffect, useRef } from "react";

const COLS = 22;
const ROWS = 13;
const CELL_MAX = 48;
const TRANSITION_MS = 480;
const NUMBER_DWELL_MS = 1000;
const RANDOM_DWELL_MS = 300;
const RANGE_MIN = 0;
const RANGE_MAX = 10;
const BG = "#d1d1d1";
const GRID_STROKE = "rgba(255,255,255,0.55)";
const INK = "#111";

const DIGIT_MAPS = {
  0: ["011100","110011","110011","110011","110011","110011","110011","110011","011100"],
  1: ["001100","011100","001100","001100","001100","001100","001100","001100","011110"],
  2: ["011100","110011","000011","000110","001100","011000","110000","110000","111111"],
  3: ["111100","000011","000011","000011","011100","000011","000011","000011","111100"],
  4: ["000110","001110","011010","110010","110010","111111","000010","000010","000010"],
  5: ["111111","110000","110000","110000","111100","000011","000011","000011","111100"],
  6: ["001110","011000","110000","110000","111100","110011","110011","110011","011100"],
  7: ["111111","000011","000011","000011","000110","001100","001100","011000","011000"],
  8: ["011100","110011","110011","110011","011100","110011","110011","110011","011100"],
  9: ["011100","110011","110011","110011","011111","000011","000011","000110","011000"],
};

function strokeize(rows) {
  const h = rows.length, w = rows[0].length;
  const on = (r, c) => r >= 0 && r < h && c >= 0 && c < w && rows[r][c] === "1";
  return rows.map((row, r) =>
    [...row].map((ch, c) => {
      if (ch !== "1") return "0";
      return (!on(r-1,c) || !on(r+1,c) || !on(r,c-1) || !on(r,c+1)) ? "1" : "0";
    }).join("")
  );
}

const STROKE = Object.fromEntries(
  Object.entries(DIGIT_MAPS).map(([k, v]) => [k, strokeize(v)])
);

function getNumberCells(n) {
  const digits = [...String(n)].map(Number);
  const DW = 6, GAP = 1;
  const totalW = digits.length * DW + (digits.length - 1) * GAP;
  const startCol = Math.floor((COLS - totalW) / 2);
  const rowOff = Math.max(0, Math.floor((ROWS - 9) / 2));
  const cells = [];
  digits.forEach((d, i) => {
    const baseCol = startCol + i * (DW + GAP);
    STROKE[d].forEach((row, r) =>
      [...row].forEach((ch, c) => {
        if (ch === "1") cells.push([r + rowOff, c + baseCol]);
      })
    );
  });
  return cells;
}

let MAX_BLOCKS = 0;
for (let n = RANGE_MIN; n <= RANGE_MAX; n++) {
  MAX_BLOCKS = Math.max(MAX_BLOCKS, getNumberCells(n).length);
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = t => Math.max(0, Math.min(1, t));
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomLayout(n) {
  const all = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) all.push([r, c]);
  return shuffle(all).slice(0, n);
}

function assignTargets(blocks, targets) {
  const used = new Set();
  blocks.slice(0, targets.length).forEach(b => {
    let best = -1, bestD = Infinity;
    targets.forEach(([tr, tc], i) => {
      if (used.has(i)) return;
      const d = (b.cr - tr) ** 2 + (b.cc - tc) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    used.add(best);
    b.tr = targets[best][0];
    b.tc = targets[best][1];
    b.idle = false;
  });
  blocks.slice(targets.length).forEach(b => {
    const t = targets[Math.floor(Math.random() * targets.length)];
    b.tr = t[0]; b.tc = t[1]; b.idle = true;
  });
}

function drawCapsule(ctx, x1, y1, x2, y2, r) {
  const dx = x2-x1, dy = y2-y1, d = Math.hypot(dx, dy);
  if (d < 0.001) { ctx.beginPath(); ctx.arc(x1, y1, r, 0, Math.PI*2); ctx.fill(); return; }
  const nx = -dy/d, ny = dx/d, ang = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x1+nx*r, y1+ny*r); ctx.lineTo(x2+nx*r, y2+ny*r);
  ctx.arc(x2, y2, r, ang+Math.PI/2, ang-Math.PI/2);
  ctx.lineTo(x1-nx*r, y1-ny*r);
  ctx.arc(x1, y1, r, ang-Math.PI/2, ang+Math.PI/2);
  ctx.closePath(); ctx.fill();
}

export function GooeyCounter() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let offscreen = new OffscreenCanvas(1, 1);
    let offCtx = offscreen.getContext("2d");

    const sim = {
      blocks: [], phase: "idle", nextNumber: RANGE_MIN + 1,
      timer: null, raf: null, layout: null, transition: null,
    };
    stateRef.current = sim;

    function beginTransition(dur, onDone) {
      for (const b of sim.blocks) { b.sr = b.cr; b.sc = b.cc; }
      sim.transition = { start: performance.now(), duration: dur, onDone };
    }

    function goToNumber(n, onDone) {
      const targets = getNumberCells(n);
      while (sim.blocks.length < MAX_BLOCKS) {
        const p = targets[Math.floor(Math.random() * targets.length)];
        sim.blocks.push({ cr: p[0], cc: p[1], tr: p[0], tc: p[1], sr: p[0], sc: p[1], idle: true });
      }
      assignTargets(sim.blocks, targets);
      beginTransition(TRANSITION_MS, onDone);
    }

    function goToRandom(onDone) {
      const targets = randomLayout(MAX_BLOCKS);
      sim.blocks.forEach((b, i) => { b.tr = targets[i][0]; b.tc = targets[i][1]; b.idle = false; });
      beginTransition(TRANSITION_MS, onDone);
    }

    function loop() {
      clearTimeout(sim.timer);
      sim.timer = setTimeout(() => {
        goToRandom(() => {
          sim.timer = setTimeout(() => {
            const n = sim.nextNumber;
            sim.nextNumber = n >= RANGE_MAX ? RANGE_MIN : n + 1;
            goToNumber(n, loop);
          }, RANDOM_DWELL_MS);
        });
      }, NUMBER_DWELL_MS);
    }

    function start() {
      clearTimeout(sim.timer);
      sim.blocks = []; sim.nextNumber = RANGE_MIN + 1; sim.transition = null;
      const rpos = randomLayout(MAX_BLOCKS);
      const firstTargets = getNumberCells(RANGE_MIN);
      sim.blocks = rpos.map(p => ({ cr: p[0], cc: p[1], tr: p[0], tc: p[1], sr: p[0], sc: p[1], idle: false }));
      assignTargets(sim.blocks, firstTargets);
      beginTransition(TRANSITION_MS, loop);
    }
    stateRef.current.start = start;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth, vh = window.innerHeight;

      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = vw + "px";
      canvas.style.height = vh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offscreen = new OffscreenCanvas(Math.floor(vw * dpr), Math.floor(vh * dpr));
      offCtx = offscreen.getContext("2d");
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const margin = Math.max(24, Math.min(vw, vh) * 0.05);
      const cellW = Math.floor((vw - margin * 2) / COLS);
      const cellH = Math.floor((vh - margin * 2) / ROWS);
      const cell = Math.min(CELL_MAX, Math.min(cellW, cellH));
      const gridW = COLS * cell, gridH = ROWS * cell;
      const originX = Math.round((vw - gridW) / 2);
      const originY = Math.round((vh - gridH) / 2);
      sim.layout = { vw, vh, cell, gridW, gridH, originX, originY };
    }

    function frame() {
      const L = sim.layout;
      if (!L) { sim.raf = requestAnimationFrame(frame); return; }

      if (sim.transition) {
        const { start, duration, onDone } = sim.transition;
        const t = clamp01((performance.now() - start) / Math.max(1, duration));
        const e = easeInOut(t);
        for (const b of sim.blocks) {
          b.cr = lerp(b.sr, b.tr, e);
          b.cc = lerp(b.sc, b.tc, e);
        }
        if (t >= 1) {
          for (const b of sim.blocks) { b.cr = b.tr; b.cc = b.tc; }
          sim.transition = null; onDone?.();
        }
      }

      const { vw, vh, cell, gridW, gridH, originX, originY } = L;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, vw, vh);

      offCtx.clearRect(0, 0, vw, vh);
      const snapped = sim.blocks.map(b => ({
        r: b.cr, c: b.cc, ir: Math.round(b.cr), ic: Math.round(b.cc),
      }));
      offCtx.fillStyle = INK;

      const linkDist = 1.6;
      for (let i = 0; i < snapped.length; i++) {
        const a = snapped[i];
        for (let j = i + 1; j < snapped.length; j++) {
          const b = snapped[j];
          const dx = b.c - a.c, dy = b.r - a.r, dist = Math.hypot(dx, dy);
          if (dist < 0.001 || dist > linkDist) continue;
          const rr = cell * 0.35 * (1 - dist / linkDist);
          if (rr < 1) continue;
          drawCapsule(offCtx,
            originX + (a.c + 0.5) * cell, originY + (a.r + 0.5) * cell,
            originX + (b.c + 0.5) * cell, originY + (b.r + 0.5) * cell, rr);
        }
      }
      for (const s of snapped) {
        offCtx.beginPath();
        offCtx.rect(originX + s.c * cell, originY + s.r * cell, cell, cell);
        offCtx.fill();
      }

      ctx.save();
      ctx.filter = "url(#gooey)";
      ctx.drawImage(offscreen, 0, 0, vw, vh);
      ctx.restore();

      ctx.strokeStyle = GRID_STROKE;
      ctx.lineWidth = 0.5;
      for (let x = originX; x <= originX + gridW; x += cell) {
        ctx.beginPath(); ctx.moveTo(x, originY); ctx.lineTo(x, originY + gridH); ctx.stroke();
      }
      for (let y = originY; y <= originY + gridH; y += cell) {
        ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + gridW, y); ctx.stroke();
      }

      sim.raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    start();
    sim.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(sim.raf);
      clearTimeout(sim.timer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: BG }}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <filter id="gooey" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/>
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      <button
        onClick={() => stateRef.current?.start?.()}
        style={{
          position: "absolute", top: 16, left: 16,
          padding: "8px 26px", fontSize: 12, letterSpacing: "0.05em",
          borderRadius: 6, border: "1px solid rgba(0,0,0,0.22)",
          background: "#fff", color: "#111", cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
