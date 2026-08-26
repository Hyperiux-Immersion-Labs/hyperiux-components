// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useId, useRef } from "react";

const DEFAULT_GRID_SIZE = 22;
const MIN_GRID_SIZE = 12;
const MAX_GRID_SIZE = 50;
const DEFAULT_MAX_VALUE = 100;
const MAX_COUNTER_VALUE = 100;

type Cell = [number, number];
type GooeyBlock = {
 cr: number;
 cc: number;
 tr: number;
 tc: number;
 sr: number;
 sc: number;
 idle: boolean;
};
type GooeyLayout = {
 vw: number;
 vh: number;
 cell: number;
 gridW: number;
 gridH: number;
 originX: number;
 originY: number;
};
type GooeyTransition = {
 start: number;
 duration: number;
 onDone?: () => void;
};
type GooeyState = {
 blocks: GooeyBlock[];
 phase: string;
 nextNumber: number;
 timer: ReturnType<typeof setTimeout> | null;
 raf: number | null;
 layout: GooeyLayout | null;
 transition: GooeyTransition | null;
 activeRows: number;
 activeCols: number;
 viewportWidth: number;
 maxBlocks: number;
 start?: () => void;
};

const ROWS = 13;
const ROWS_TABLET = 30;
const ROWS_MOBILE = 32;
const CELL_MAX = 48;
const TRANSITION_MS = 480;
const NUMBER_DWELL_MS = 1000;
const RANDOM_DWELL_MS = 300;
const RANGE_MIN = 0;
const GRID_STROKE = "rgba(255,255,255,0.55)";
const MOBILE_MAX_WIDTH = 768;
const TABLET_MAX_WIDTH = 1024;
const DIGIT_HEIGHT = 9;
const DIGIT_WIDTH = 6;
const DIGIT_GAP = 1;
const MOBILE_DIGIT_HEIGHT = 13;
const MOBILE_DIGIT_WIDTH = 8;
const MOBILE_DIGIT_GAP = 1;

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

/**
 * @param {string[]} rows
 * @returns {string[]}
 */
function strokeize(rows: string[]) {
 const h = rows.length, w = rows[0].length;
 /** @type {(r: number, c: number) => boolean} */
 const on = (r: number, c: number) => r >= 0 && r < h && c >= 0 && c < w && rows[r][c] === "1";
 return rows.map((row: string, r: number) =>
  [...row].map((ch: string, c: number) => {
   if (ch !== "1") return "0";
   return (!on(r-1,c) || !on(r+1,c) || !on(r,c-1) || !on(r,c+1)) ? "1" : "0";
  }).join("")
 );
}

const STROKE = Object.fromEntries(
 Object.entries(DIGIT_MAPS).map(([k, v]) => [k, strokeize(v)])
);

/**
 * @param {number} width
 * @returns {{ digitHeight: number, digitWidth: number, digitGap: number }}
 */
function getDigitMetrics(width: number) {
 if (width <= MOBILE_MAX_WIDTH) {
  return {
   digitHeight: MOBILE_DIGIT_HEIGHT,
   digitWidth: MOBILE_DIGIT_WIDTH,
   digitGap: MOBILE_DIGIT_GAP,
  };
 }

 return {
  digitHeight: DIGIT_HEIGHT,
  digitWidth: DIGIT_WIDTH,
  digitGap: DIGIT_GAP,
 };
}

/**
 * @param {number} index
 * @param {number} sourceSize
 * @param {number} targetSize
 * @returns {number[]}
 */
function getScaledCellIndexes(index: number, sourceSize: number, targetSize: number) {
 const start = Math.floor((index * targetSize) / sourceSize);
 const end = Math.floor(((index + 1) * targetSize) / sourceSize);
 const scaledIndexes: number[] = [];

 for (let scaledIndex = start; scaledIndex < Math.max(start + 1, end); scaledIndex++) {
  scaledIndexes.push(scaledIndex);
 }

 return scaledIndexes;
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
 const number = Number(value);
 if (!Number.isFinite(number)) return fallback;
 return Math.min(Math.max(number, min), max);
}

/**
 * @param {number} n
 * @param {number} rows
 * @param {number} cols
 * @param {number} width
 * @returns {[number, number][]}
 */
function getNumberCells(n: number, rows: number, cols: number, width: number) {
 const digits = [...String(n)].map(Number);
 const { digitHeight, digitWidth, digitGap } = getDigitMetrics(width);
 const totalW = digits.length * digitWidth + (digits.length - 1) * digitGap;
 const startCol = Math.floor((cols - totalW) / 2);
 const rowOff = Math.max(0, Math.floor((rows - digitHeight) / 2));
 /** @type {[number, number][]} */
 const cells: Cell[] = [];
 digits.forEach((d: number, i: number) => {
  const baseCol = startCol + i * (digitWidth + digitGap);
  STROKE[d as keyof typeof STROKE].forEach((row: string, r: number) =>
   [...row].forEach((ch: string, c: number) => {
    if (ch !== "1") return;

    const scaledRows = getScaledCellIndexes(r, DIGIT_HEIGHT, digitHeight);
    const scaledCols = getScaledCellIndexes(c, DIGIT_WIDTH, digitWidth);

    scaledRows.forEach(scaledRow => {
     scaledCols.forEach(scaledCol => {
      cells.push([scaledRow + rowOff, scaledCol + baseCol]);
     });
    });
   })
  );
 });
 return cells;
}

/**
 * @param {number} rows
 * @param {number} cols
 * @param {number} width
 * @param {number} maxValue
 * @returns {number}
 */
function computeMaxBlocks(rows: number, cols: number, width: number, maxValue: number) {
 let max = 0;
 for (let n = RANGE_MIN; n <= maxValue; n++) {
  max = Math.max(max, getNumberCells(n, rows, cols, width).length);
 }
 return max;
}

/** @type {(a: number, b: number, t: number) => number} */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** @type {(t: number) => number} */
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** @type {(t: number) => number} */
const easeInOut = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffle<T>(arr: T[]) {
 const a = [...arr];
 for (let i = a.length - 1; i > 0; i--) {
  const j = (Math.random() * (i + 1)) | 0;
  [a[i], a[j]] = [a[j], a[i]];
 }
 return a;
}

/**
 * @param {number} n
 * @param {number} rows
 * @param {number} cols
 * @returns {[number, number][]}
 */
function randomLayout(n: number, rows: number, cols: number) {
 /** @type {[number, number][]} */
 const all: Cell[] = [];
 for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++) all.push([r, c]);
 return shuffle(all).slice(0, n);
}

/**
 * @param {number} width
 * @returns {number}
 */
function getRowsForWidth(width: number) {
 if (width <= MOBILE_MAX_WIDTH) return ROWS_MOBILE;
 if (width <= TABLET_MAX_WIDTH) return ROWS_TABLET;
 return ROWS;
}

/**
 * @typedef {Object} GooeyBlock
 * @property {number} cr
 * @property {number} cc
 * @property {number} tr
 * @property {number} tc
 * @property {number} sr
 * @property {number} sc
 * @property {boolean} idle
 */

/**
 * @param {GooeyBlock[]} blocks
 * @param {[number, number][]} targets
 */
function assignTargets(blocks: GooeyBlock[], targets: Cell[]) {
 const used = new Set();
 blocks.slice(0, targets.length).forEach((b: GooeyBlock) => {
  let best = -1, bestD = Infinity;
  targets.forEach(([tr, tc]: Cell, i: number) => {
   if (used.has(i)) return;
   const d = (b.cr - tr) ** 2 + (b.cc - tc) ** 2;
   if (d < bestD) { bestD = d; best = i; }
  });
  used.add(best);
  b.tr = targets[best][0];
  b.tc = targets[best][1];
  b.idle = false;
 });
 blocks.slice(targets.length).forEach((b: GooeyBlock) => {
  const t = targets[Math.floor(Math.random() * targets.length)];
  b.tr = t[0]; b.tc = t[1]; b.idle = true;
 });
}

/**
 * @param {OffscreenCanvasRenderingContext2D} ctx
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} r
 */
function drawCapsule(
 ctx: OffscreenCanvasRenderingContext2D,
 x1: number,
 y1: number,
 x2: number,
 y2: number,
 r: number,
) {
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

interface GooeyCounterProps {
 maxValue?: number;
 gridSize?: number;
 roundedness?: number;
 duration?: number;
 blobColor?: string;
 backgroundColor?: string;
}

export default function GooeyCounter({
 maxValue = DEFAULT_MAX_VALUE,
 gridSize = DEFAULT_GRID_SIZE,
 roundedness = 0,
 duration = 1,
 blobColor = "#111111",
 backgroundColor = "#d1d1d1",
}: GooeyCounterProps) {
 const canvasRef = useRef<any>(null);
 const stateRef = useRef<GooeyState | null>(null);
 const gooeyFilterId = `gooey-${useId().replace(/:/g, "")}`;

 useEffect(() => {
  // Canvas setup
  const canvas = /** @type {HTMLCanvasElement} */ (canvasRef.current);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  let offscreen = new OffscreenCanvas(1, 1);
  let offCtx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
  const filterUrl = `url(#${gooeyFilterId})`;

  const paceScale = duration;
  const safeMaxValue = Math.round(clampNumber(maxValue, 2, MAX_COUNTER_VALUE, DEFAULT_MAX_VALUE));
  const safeGridSize = Math.round(clampNumber(gridSize, MIN_GRID_SIZE, MAX_GRID_SIZE, DEFAULT_GRID_SIZE));
  const safeRoundedness = clampNumber(roundedness, 0, 1, 0);
  const transitionDuration = TRANSITION_MS * paceScale;
  const numberDwellMs = NUMBER_DWELL_MS * paceScale;
  const randomDwellMs = RANDOM_DWELL_MS * paceScale;

  let reduceMotion =
   window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const reduceMotionMq = window.matchMedia?.(
   "(prefers-reduced-motion: reduce)"
  );
  /** @param {MediaQueryListEvent} event */
  const onReduceMotionChange = (event: MediaQueryListEvent) => {
   reduceMotion = event.matches;
  };
  reduceMotionMq?.addEventListener?.("change", onReduceMotionChange);

  // Simulation state
  const sim: GooeyState = {
   blocks: [], phase: "idle", nextNumber: RANGE_MIN + 1,
   timer: null, raf: null, layout: null, transition: null,
   activeRows: ROWS, activeCols: safeGridSize, viewportWidth: window.innerWidth, maxBlocks: computeMaxBlocks(ROWS, safeGridSize, window.innerWidth, safeMaxValue),
  };
  stateRef.current = sim;

  const transitionMs = () => (reduceMotion ? 0 : transitionDuration);

  // Animation helpers
  /**
   * @param {number} dur
   * @param {(() => void) | undefined} [onDone]
   */
  function beginTransition(dur: number, onDone?: () => void) {
   for (const b of sim.blocks) { b.sr = b.cr; b.sc = b.cc; }
   // Duration 0 under reduced motion → snap to targets (no morph lerp).
   if (dur <= 0) {
    for (const b of sim.blocks) { b.cr = b.tr; b.cc = b.tc; }
    sim.transition = null;
    onDone?.();
    return;
   }
   sim.transition = { start: performance.now(), duration: dur, onDone };
  }

  /**
   * @param {number} n
   * @param {(() => void) | undefined} [onDone]
   */
  function goToNumber(n: number, onDone?: () => void) {
   const targets = getNumberCells(n, sim.activeRows, sim.activeCols, sim.viewportWidth);
   while (sim.blocks.length < sim.maxBlocks) {
    const p = targets[Math.floor(Math.random() * targets.length)];
    sim.blocks.push({ cr: p[0], cc: p[1], tr: p[0], tc: p[1], sr: p[0], sc: p[1], idle: true });
   }
   assignTargets(sim.blocks, targets);
   beginTransition(transitionMs(), onDone);
  }

  /** @param {() => void} onDone */
  function goToRandom(onDone: () => void) {
   const targets = randomLayout(sim.maxBlocks, sim.activeRows, sim.activeCols);
   sim.blocks.forEach((b: GooeyBlock, i: number) => { b.tr = targets[i][0]; b.tc = targets[i][1]; b.idle = false; });
   beginTransition(transitionMs(), onDone);
  }

  function loop() {
   if (sim.timer !== null) clearTimeout(sim.timer);
   // Reduced-motion: skip random scatter — step number → number with snaps.
   if (reduceMotion) {
    sim.timer = setTimeout(() => {
     const n = sim.nextNumber;
     sim.nextNumber = n >= safeMaxValue ? RANGE_MIN : n + 1;
     goToNumber(n, loop);
    }, numberDwellMs);
    return;
   }
   sim.timer = setTimeout(() => {
    goToRandom(() => {
     sim.timer = setTimeout(() => {
      const n = sim.nextNumber;
     sim.nextNumber = n >= safeMaxValue ? RANGE_MIN : n + 1;
     goToNumber(n, loop);
     }, randomDwellMs);
    });
   }, numberDwellMs);
  }

  function start() {
   if (sim.timer !== null) clearTimeout(sim.timer);
   sim.blocks = []; sim.nextNumber = RANGE_MIN + 1; sim.transition = null;
   const firstTargets = getNumberCells(RANGE_MIN, sim.activeRows, sim.activeCols, sim.viewportWidth);
   if (reduceMotion) {
    // Land on 0 immediately — no opening scatter morph.
    sim.blocks = firstTargets.map(([r, c]) => ({
     cr: r, cc: c, tr: r, tc: c, sr: r, sc: c, idle: false,
    }));
    while (sim.blocks.length < sim.maxBlocks) {
     const p = firstTargets[Math.floor(Math.random() * firstTargets.length)];
     sim.blocks.push({ cr: p[0], cc: p[1], tr: p[0], tc: p[1], sr: p[0], sc: p[1], idle: true });
    }
    beginTransition(0, loop);
    return;
   }
   const rpos = randomLayout(sim.maxBlocks, sim.activeRows, sim.activeCols);
   sim.blocks = rpos.map(p => ({ cr: p[0], cc: p[1], tr: p[0], tc: p[1], sr: p[0], sc: p[1], idle: false }));
   assignTargets(sim.blocks, firstTargets);
   beginTransition(transitionDuration, loop);
  }
  stateRef.current.start = start;

  // Layout
  function resize() {
   const dpr = Math.min(window.devicePixelRatio || 1, 2);
   const vw = window.innerWidth, vh = window.innerHeight;
   const newRows = getRowsForWidth(vw);
   const widthChanged = vw !== sim.viewportWidth;
   sim.viewportWidth = vw;

   if (newRows !== sim.activeRows || widthChanged || safeGridSize !== sim.activeCols) {
    sim.activeRows = newRows;
    sim.activeCols = safeGridSize;
    sim.maxBlocks = computeMaxBlocks(newRows, safeGridSize, vw, safeMaxValue);
   }

   canvas.width = Math.floor(vw * dpr);
   canvas.height = Math.floor(vh * dpr);
   canvas.style.width = vw + "px";
   canvas.style.height = vh + "px";
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

   offscreen = new OffscreenCanvas(Math.floor(vw * dpr), Math.floor(vh * dpr));
   offCtx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
   offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

   const margin = Math.max(24, Math.min(vw, vh) * 0.05);
   const cellW = Math.floor((vw - margin * 2) / sim.activeCols);
   const cellH = Math.floor((vh - margin * 2) / sim.activeRows);
   const cell = Math.min(CELL_MAX, Math.min(cellW, cellH));
   const gridW = sim.activeCols * cell, gridH = sim.activeRows * cell;
   const originX = Math.round((vw - gridW) / 2);
   const originY = Math.round((vh - gridH) / 2);
   sim.layout = { vw, vh, cell, gridW, gridH, originX, originY };
  }

  // Render loop
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

   ctx.fillStyle = backgroundColor;
   ctx.fillRect(0, 0, vw, vh);

   offCtx.clearRect(0, 0, vw, vh);
   const snapped = sim.blocks.map((b: GooeyBlock) => ({
    r: b.cr, c: b.cc, ir: Math.round(b.cr), ic: Math.round(b.cc),
   }));
   offCtx.fillStyle = blobColor;

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
    const radius = (cell * 0.5) * safeRoundedness;
    if (radius > 0 && offCtx.roundRect) {
     offCtx.roundRect(originX + s.c * cell, originY + s.r * cell, cell, cell, radius);
    } else {
     offCtx.rect(originX + s.c * cell, originY + s.r * cell, cell, cell);
    }
    offCtx.fill();
   }

   ctx.save();
   ctx.filter = filterUrl;
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

  // Boot and cleanup
  resize();
  window.addEventListener("resize", resize, { passive: true });
  start();
  sim.raf = requestAnimationFrame(frame);

  return () => {
   if (sim.raf !== null) cancelAnimationFrame(sim.raf);
   if (sim.timer !== null) clearTimeout(sim.timer);
   window.removeEventListener("resize", resize);
   reduceMotionMq?.removeEventListener?.("change", onReduceMotionChange);
  };
 }, [gooeyFilterId, maxValue, gridSize, roundedness, duration, blobColor, backgroundColor]);

 return (
  <div style={{ position: "fixed", inset: 0, background: backgroundColor }}>
    <div className="w-full h-fit gap-[0.5vw]  text-black relative z-4 flex flex-col items-center justify-center max-[1025px]:text-center max-[1025px]:px-[7vw] max-[1025px]:gap-[3vw] pt-19 max-[1025px]:pt-20 max-md:pt-22 ">
      <h1 className="text-[4vw] max-md:text-[9vw] max-[1025px]:text-[7vw]">
        Gooey Counter
      </h1>
      <p className="text-sm max-[1025px]:text-lg max-md:text-sm max-[1025px]:w-[80%] mx-auto">
        Gooey Counter is a morphing counter which counts from 0 to {Math.round(clampNumber(maxValue, 2, MAX_COUNTER_VALUE, DEFAULT_MAX_VALUE))}
      </p>
    </div>
   <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
    <defs>
     <filter id={gooeyFilterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feColorMatrix in="blur" mode="matrix"
       values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo"/>
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
     </filter>
    </defs>
   </svg>
   <canvas ref={canvasRef} className=" h-[75%]! w-[80%]!  max-md:h-full! max-[1025px]:w-[80%]! max-[1025px]:h-[60%]! top-[53%] max-md:top-[62%] left-1/2 -translate-y-1/2 absolute -translate-x-1/2  "  />
   <button
    onClick={() => stateRef.current?.start?.()}
    className="absolute bottom-8 cursor-pointer left-1/2 -translate-x-1/2 py-[0.7vw] px-[1.5vw] text-black bg-white rounded-[0.4vw] max-[1025px]:px-[5vw] max-[1025px]:py-[1.5vw] max-[1025px]:rounded-[1.5vw] max-[1025px]:bottom-24 max-md:bottom-15 max-md:text-[4.5vw] max-[1025px]:text-[3vw]"

   >
    Reset
   </button>
  </div>
 );
}
