"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL_SIZE = 50;
const MAX_TRAIL = 25;
const IDLE_TIMEOUT = 120;
const FADE_DURATION = 500;
const SPAWN_ANIMATION = 180;
const TURN_CELLS = 2;
const MOUSE_LERP = 0.18;

const ALPHABET = "HYPERIUX";

const COLORS = [
  { bg: "#1a1a2e", text: "#ffffff" },
  { bg: "#c8f752", text: "#1a1a2e" },
  { bg: "#7D4E57", text: "#ffffff" },
  { bg: "#5c3d8f", text: "#ffffff" },
  { bg: "#2d2d2d", text: "#ffffff" },
  { bg: "#c3dfe0", text: "#1a1a2e" },
];

export function CharacterTrail({ children }) {
  const [trail, setTrail] = useState([]);
  const [fading, setFading] = useState(false);

  const lastCell = useRef(null);
  const activeAxis = useRef(null);
  const charIndexRef = useRef(0);
  const colorIndexRef = useRef(0);
  const idleTimer = useRef(null);
  const clearTimer = useRef(null);
  const fadingRef = useRef(false);
  const mouseTarget = useRef(null);
  const mouseFollower = useRef(null);
  const animationFrame = useRef(null);

  const getNextTrailCell = useCallback((col, row) => {
    const char = ALPHABET[charIndexRef.current % ALPHABET.length];
    const color = COLORS[colorIndexRef.current % COLORS.length];
    charIndexRef.current++;
    colorIndexRef.current++;

    return {
      id: `${Date.now()}-${charIndexRef.current}-${col}-${row}`,
      cellKey: `${col}:${row}`,
      col,
      row,
      char,
      color,
    };
  }, []);

  const getLineCells = useCallback((from, to, axis, limit = Infinity) => {
    const cells = [];
    const delta = axis === "x" ? to.col - from.col : to.row - from.row;
    const direction = Math.sign(delta);
    const count = Math.min(Math.abs(delta), limit);

    for (let index = 1; index <= count; index++) {
      const col = axis === "x" ? from.col + direction * index : from.col;
      const row = axis === "y" ? from.row + direction * index : from.row;
      cells.push({ col, row });
    }

    return cells;
  }, []);

  const appendCells = useCallback((cells) => {
    if (!cells.length) return;

    const nextCells = cells.map(({ col, row }) => getNextTrailCell(col, row));
    const activatedKeys = new Set(nextCells.map((cell) => cell.cellKey));

    setTrail((prev) => {
      const withoutDuplicates = prev.filter((cell) => !activatedKeys.has(cell.cellKey));
      return [...withoutDuplicates, ...nextCells].slice(-MAX_TRAIL);
    });
  }, [getNextTrailCell]);

  useEffect(() => {
    fadingRef.current = fading;
  }, [fading]);

  const updateTrailPosition = useCallback((mx, my) => {
    if (fadingRef.current) {
      fadingRef.current = false;
      setFading(false);
      setTrail([]);
      charIndexRef.current = 0;
      colorIndexRef.current = 0;
      lastCell.current = null;
      activeAxis.current = null;
    }

    clearTimeout(idleTimer.current);
    clearTimeout(clearTimer.current);

    idleTimer.current = setTimeout(() => {
      setFading(true);
      fadingRef.current = true;
      clearTimer.current = setTimeout(() => {
        setTrail([]);
        setFading(false);
        fadingRef.current = false;
        charIndexRef.current = 0;
        colorIndexRef.current = 0;
        lastCell.current = null;
        activeAxis.current = null;
      }, FADE_DURATION);
    }, IDLE_TIMEOUT);

    const target = {
      col: Math.floor(mx / CELL_SIZE),
      row: Math.floor(my / CELL_SIZE),
    };

    if (!lastCell.current) {
      lastCell.current = target;
      appendCells([target]);
      return;
    }

    const current = lastCell.current;
    const colDelta = target.col - current.col;
    const rowDelta = target.row - current.row;

    if (colDelta === 0 && rowDelta === 0) return;

    const dominantAxis = Math.abs(colDelta) >= Math.abs(rowDelta) ? "x" : "y";
    const targetAxis = colDelta === 0 ? "y" : rowDelta === 0 ? "x" : dominantAxis;
    const axis = activeAxis.current ?? targetAxis;
    const cells = [];
    let cursor = current;

    const pushCells = (lineCells) => {
      if (!lineCells.length) return;
      cells.push(...lineCells);
      cursor = lineCells[lineCells.length - 1];
    };

    if (axis === "x" && colDelta !== 0) {
      pushCells(getLineCells(cursor, { col: target.col, row: cursor.row }, "x"));

      if (target.row !== cursor.row) {
        pushCells(getLineCells(cursor, { col: cursor.col, row: target.row }, "y", TURN_CELLS));
        activeAxis.current = "y";
      } else {
        activeAxis.current = "x";
      }
    } else if (axis === "y" && rowDelta !== 0) {
      pushCells(getLineCells(cursor, { col: cursor.col, row: target.row }, "y"));

      if (target.col !== cursor.col) {
        pushCells(getLineCells(cursor, { col: target.col, row: cursor.row }, "x", TURN_CELLS));
        activeAxis.current = "x";
      } else {
        activeAxis.current = "y";
      }
    } else {
      pushCells(getLineCells(cursor, target, targetAxis, TURN_CELLS));
      activeAxis.current = targetAxis;
    }

    if (!cells.length) return;

    lastCell.current = cursor;
    appendCells(cells);
  }, [appendCells, getLineCells]);

  const animateMouseFollower = useCallback(function animate() {
    if (!mouseTarget.current || !mouseFollower.current) return;

    mouseFollower.current.x += (mouseTarget.current.x - mouseFollower.current.x) * MOUSE_LERP;
    mouseFollower.current.y += (mouseTarget.current.y - mouseFollower.current.y) * MOUSE_LERP;

    updateTrailPosition(mouseFollower.current.x, mouseFollower.current.y);

    if (
      Math.abs(mouseTarget.current.x - mouseFollower.current.x) > 0.5 ||
      Math.abs(mouseTarget.current.y - mouseFollower.current.y) > 0.5
    ) {
      animationFrame.current = requestAnimationFrame(animate);
    } else {
      mouseFollower.current = { ...mouseTarget.current };
      animationFrame.current = null;
    }
  }, [updateTrailPosition]);

  const handleMouseMove = useCallback((e) => {
    mouseTarget.current = { x: e.clientX, y: e.clientY };

    if (!mouseFollower.current) {
      mouseFollower.current = { ...mouseTarget.current };
      updateTrailPosition(mouseFollower.current.x, mouseFollower.current.y);
      return;
    }

    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(animateMouseFollower);
    }
  }, [animateMouseFollower, updateTrailPosition]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(idleTimer.current);
      clearTimeout(clearTimer.current);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [handleMouseMove]);

  return (
    <div className="relative w-full min-h-screen">
      {trail.map((dot, index) => {
        const total = trail.length;
        const staggerDelay = fading
          ? index * (FADE_DURATION / Math.max(total, 1))
          : 0;
        const opacity = fading ? 0 : 1;

        return (
          <div
            key={dot.id}
            className="fixed pointer-events-none rounded-full flex items-center justify-center select-none"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: dot.col * CELL_SIZE,
              top: dot.row * CELL_SIZE,
              backgroundColor: dot.color.bg,
              color: dot.color.text,
              fontSize: 13,
              fontWeight: 800,
              zIndex: 9999,
              opacity,
              transform: "scale(1)",
              animation: fading
                ? "none"
                : `charTrailPop ${SPAWN_ANIMATION}ms cubic-bezier(0.2,0.8,0.2,1)`,
              transition: fading
                ? `opacity ${FADE_DURATION * 0.5}ms cubic-bezier(0.4,0,0.2,1) ${staggerDelay}ms`
                : "none",
              willChange: "opacity, transform",
            }}
          >
            {dot.char}
          </div>
        );
      })}

      {children}

      <style jsx global>{`
        @keyframes charTrailPop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
