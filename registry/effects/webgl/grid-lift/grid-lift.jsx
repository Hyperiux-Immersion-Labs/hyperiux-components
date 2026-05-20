"use client";

import React, { useEffect, useRef, useState } from "react";
import { LevaPanel, useControls } from "leva";
import styles from "./levacontrols.module.css";

const lerp = (start, end, amount) => start + (end - start) * amount;

const levaTheme = {
  colors: {
    elevation1: "#0d0d0d",
    elevation2: "#141414",
    elevation3: "#1c1c1c",
    accent1: "#ff5f00",
    accent2: "#e05500",
    accent3: "#ff8030",
    highlight1: "#555555",
    highlight2: "#999999",
    highlight3: "#eeeeee",
    vivid1: "#ff5f00",
    folderWidgetColor: "#ff5f00",
    toolTipBackground: "#1c1c1c",
    toolTipText: "#cccccc",
  },
  radii: {
    xs: "3px",
    sm: "4px",
    lg: "6px",
  },
  space: {
    sm: "4px",
    md: "6px",
    rowGap: "4px",
    colGap: "6px",
  },
  fontSizes: {
    root: "11px",
  },
  fonts: {
    mono: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sizes: {
    rootWidth: "270px",
    controlWidth: "55%",
    numberInputMinWidth: "48px",
    rowHeight: "28px",
    folderTitleHeight: "24px",
    sliderHeight: "3px",
    sliderKnobSize: "13px",
    scrubberWidth: "8px",
    scrubberHeight: "14px",
  },
  borderWidths: {
    root: "0px",
    input: "1px",
    focus: "1px",
    hover: "1px",
    active: "1px",
    folder: "0px",
  },
};

export default function GridLift() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const cellsRef = useRef([]);
  const svgImageRef = useRef(null);

  const [svgName, setSvgName] = useState("hyperiux-wordmark.svg");
  const [svgVersion, setSvgVersion] = useState(0);
  const [maskSourceState, setMaskSourceState] = useState("SVG");
  const [maskText, setMaskText] = useState("DESIGN");

  // Live ref — Leva's render() callbacks close over this, not stale state
  const maskSourceRef = useRef("SVG");
  const handleSetMask = (val) => {
    maskSourceRef.current = val;
    setMaskSourceState(val);
  };

  const maskSource = maskSourceState;

  const [
    {
      fontSize,
      fontWeight,
      maskScale,
      gridSpacing,
      strokeSize,
      hoverRadius,
      hoverFalloff,
      interactionRange,
      liftHeight,
      liftRotation,
      liftSmoothness,
      baseOpacity,
      hoverOpacity,
      backgroundColor,
      gridColor,
      hoverColor,
    },
  ] = useControls(
    "CONTROLS",
    () => ({
      maskScale: { label: "Mask scale", value: 1.08, min: 0.2, max: 3, step: 0.01 },
      fontSize: {
        label: "Font size",
        value: 350,
        min: 40,
        max: 520,
        step: 1,
        render: () => maskSourceRef.current === "Text",
      },
      fontWeight: {
        label: "Font weight",
        value: 200,
        min: 100,
        max: 1000,
        step: 100,
        render: () => maskSourceRef.current === "Text",
      },
      interactionRange: { label: "Interaction range", value: 120, min: 10, max: 300, step: 1 },
      hoverRadius: { label: "Hover radius", value: 550, min: 80, max: 1200, step: 1 },
      hoverFalloff: { label: "Hover falloff", value: 1.55, min: 0.4, max: 4, step: 0.05 },
      liftRotation: { label: "Lift rotation", value: -88, min: -180, max: 180, step: 1 },
      liftHeight: { label: "Lift height", value: 58, min: 0, max: 180, step: 1 },
      liftSmoothness: { label: "Lift smoothness", value: 0.08, min: 0.01, max: 0.35, step: 0.01 },
      gridSpacing: { label: "Grid spacing", value: 13, min: 6, max: 40, step: 1 },
      strokeSize: { label: "Stroke size", value: 1.15, min: 0.4, max: 4, step: 0.1 },
      baseOpacity: { label: "Base opacity", value: 1, min: 0.05, max: 1, step: 0.01 },
      hoverOpacity: { label: "Lift opacity", value: 0.6, min: 0.1, max: 1, step: 0.01 },
      backgroundColor: { label: "Background", value: "#000000" },
      gridColor: { label: "Grid color", value: "#272727" },
      hoverColor: { label: "Hover color", value: "#ffffff" },
    }),
    [svgName],
  );

  const safeText =
    typeof maskText === "string" && maskText.trim().length > 0 ? maskText : "LSD";

  const handleSVGUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
      alert("Please upload an SVG file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      let svgText = typeof reader.result === "string" ? reader.result : "";
      // Some SVGs have no intrinsic size, which results in `naturalWidth/Height` being 0
      // and the canvas draw being invisible. Ensure a width/height based on viewBox.
      if (svgText) {
        const hasWidth = /\bwidth\s*=/.test(svgText);
        const hasHeight = /\bheight\s*=/.test(svgText);
        if (!hasWidth || !hasHeight) {
          const viewBoxMatch = svgText.match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
          let vw = 512;
          let vh = 512;
          if (viewBoxMatch) {
            const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
            if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
              vw = Math.max(1, parts[2]);
              vh = Math.max(1, parts[3]);
            }
          }
          svgText = svgText.replace(
            /<svg\b([^>]*)>/i,
            (m, attrs) =>
              `<svg${attrs}${hasWidth ? "" : ` width="${vw}"`}${hasHeight ? "" : ` height="${vh}"`}>`,
          );
        }
      }

      const blob = new Blob([svgText || reader.result], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        svgImageRef.current = image;
        setSvgName(file.name);
        setSvgVersion((v) => v + 1);
        URL.revokeObjectURL(url);
      };
      image.src = url;
    };
    reader.readAsText(file);
    // allow re-uploading the same file (fires `change` again)
    event.target.value = "";
  };

  // Default SVG mask (Hyperiux wordmark)
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      svgImageRef.current = image;
      setSvgVersion((v) => v + 1);
    };
    image.src = "/hyperiux-wordmark.svg";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    let width = 0, height = 0, dpr = 1, animationFrame;

    const createTextMask = () => {
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.save();
      maskCtx.fillStyle = "#ffffff";
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";

      const lines = safeText.split("\n").filter(Boolean);
      const safeLines = lines.length > 0 ? lines : ["LSD"];
      const maxTextWidth = width * 0.72 * maskScale;
      const maxTextHeight = height * 0.48 * maskScale;
      let fittedFontSize = fontSize || 230;

      for (let size = fittedFontSize; size > 10; size -= 2) {
        maskCtx.font = `${fontWeight || 900} ${size}px Anton, Impact, Haettenschweiler, "Arial Black", sans-serif`;
        const widestLine = Math.max(...safeLines.map((l) => maskCtx.measureText(l).width));
        const totalHeight = safeLines.length * size * 0.9;
        if (widestLine <= maxTextWidth && totalHeight <= maxTextHeight) { fittedFontSize = size; break; }
      }

      maskCtx.font = `${fontWeight || 900} ${fittedFontSize}px Anton, Impact, Haettenschweiler, "Arial Black", sans-serif`;
      const lineHeight = fittedFontSize * 0.9;
      const startY = height / 2 - ((safeLines.length - 1) * lineHeight) / 2;
      safeLines.forEach((line, i) => maskCtx.fillText(line, width / 2, startY + i * lineHeight));
      maskCtx.restore();
    };

    const createSVGMask = () => {
      maskCtx.clearRect(0, 0, width, height);
      const image = svgImageRef.current;
      if (!image) return;
      const iw = image.naturalWidth || image.width || 1;
      const ih = image.naturalHeight || image.height || 1;
      const imageRatio = iw / ih;
      const screenRatio = width / height;
      let drawWidth, drawHeight;
      if (imageRatio > screenRatio) { drawWidth = width * 0.62 * maskScale; drawHeight = drawWidth / imageRatio; }
      else { drawHeight = height * 0.5 * maskScale; drawWidth = drawHeight * imageRatio; }
      maskCtx.save();
      maskCtx.drawImage(image, width / 2 - drawWidth / 2, height / 2 - drawHeight / 2, drawWidth, drawHeight);
      maskCtx.restore();
    };

    const createMask = () => {
      maskCtx.clearRect(0, 0, width, height);
      maskSource === "Text" ? createTextMask() : createSVGMask();
    };

    const isInsideMask = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      const pixel = maskCtx.getImageData(Math.floor(x * dpr), Math.floor(y * dpr), 1, 1).data;
      return pixel[3] > 20 || pixel[0] > 20 || pixel[1] > 20 || pixel[2] > 20;
    };

    const buildCells = () => {
      const cells = [];
      for (let x = 0; x <= width; x += gridSpacing) {
        for (let y = 0; y <= height; y += gridSpacing) {
          const cx = x + gridSpacing / 2;
          const cy = y + gridSpacing / 2;
          if (!isInsideMask(cx, cy)) continue;
          cells.push({
            x, y, cx, cy, lift: 0, targetLift: 0,
            topInside: isInsideMask(cx, y),
            leftInside: isInsideMask(x, cy),
            rightInside: isInsideMask(x + gridSpacing, cy),
            bottomInside: isInsideMask(cx, y + gridSpacing),
          });
        }
      }
      cellsRef.current = cells;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      maskCanvas.width = width * dpr; maskCanvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createMask(); buildCells();
    };

    const getNearestMaskDistance = (mouseX, mouseY) => {
      let nearest = Infinity;
      for (const cell of cellsRef.current) {
        const dx = cell.cx - mouseX, dy = cell.cy - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < nearest) nearest = d;
      }
      return nearest;
    };

    const getHoverInfluence = (x, y) => {
      const mouse = mouseRef.current;
      if (!mouse.active) return 0;
      if (getNearestMaskDistance(mouse.x, mouse.y) > interactionRange) return 0;
      const dx = x - mouse.x, dy = y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > hoverRadius) return 0;
      return Math.pow(1 - distance / hoverRadius, hoverFalloff);
    };

    const updateCells = () => {
      for (const cell of cellsRef.current) {
        cell.targetLift = getHoverInfluence(cell.cx, cell.cy);
        cell.lift = lerp(cell.lift, cell.targetLift, liftSmoothness);
        if (cell.lift < 0.001) cell.lift = 0;
      }
    };

    const drawBaseGrid = () => {
      ctx.save();
      ctx.strokeStyle = gridColor; ctx.globalAlpha = baseOpacity; ctx.lineWidth = strokeSize;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSpacing) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += gridSpacing) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke(); ctx.restore();
    };

    const drawCellEdges = (cell, ox, oy, alpha, lw, color) => {
      const x1 = cell.x + ox, y1 = cell.y + oy;
      const x2 = cell.x + gridSpacing + ox, y2 = cell.y + gridSpacing + oy;
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw;
      ctx.beginPath();
      if (cell.topInside)    { ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); }
      if (cell.leftInside)   { ctx.moveTo(x1, y1); ctx.lineTo(x1, y2); }
      if (cell.rightInside)  { ctx.moveTo(x2, y1); ctx.lineTo(x2, y2); }
      if (cell.bottomInside) { ctx.moveTo(x1, y2); ctx.lineTo(x2, y2); }
      ctx.stroke();
    };

    const drawRaisedMaskGrid = () => {
      const angle = (liftRotation * Math.PI) / 180;
      const liftX = Math.cos(angle) * liftHeight;
      const liftY = Math.sin(angle) * liftHeight;
      ctx.save(); ctx.lineCap = "square"; ctx.lineJoin = "miter";

      for (const cell of cellsRef.current) {
        const influence = cell.lift;
        if (influence <= 0.001) continue;
        const ox = liftX * influence, oy = liftY * influence;
        const x1 = cell.x, y1 = cell.y, x2 = cell.x + gridSpacing, y2 = cell.y + gridSpacing;
        const alpha = hoverOpacity * influence;

        for (let i = 0; i < 30; i++) {
          const t = i / 30;
          drawCellEdges(cell, ox * t, oy * t, alpha * (0.025 + t * 0.075), strokeSize * 0.8, hoverColor);
        }

        ctx.globalAlpha = alpha * 0.34; ctx.strokeStyle = hoverColor;
        ctx.lineWidth = Math.max(0.6, strokeSize * 0.7); ctx.beginPath();
        if (cell.topInside)    { ctx.moveTo(x1,y1); ctx.lineTo(x1+ox,y1+oy); ctx.moveTo(x2,y1); ctx.lineTo(x2+ox,y1+oy); }
        if (cell.leftInside)   { ctx.moveTo(x1,y1); ctx.lineTo(x1+ox,y1+oy); ctx.moveTo(x1,y2); ctx.lineTo(x1+ox,y2+oy); }
        if (cell.rightInside)  { ctx.moveTo(x2,y1); ctx.lineTo(x2+ox,y1+oy); ctx.moveTo(x2,y2); ctx.lineTo(x2+ox,y2+oy); }
        if (cell.bottomInside) { ctx.moveTo(x1,y2); ctx.lineTo(x1+ox,y2+oy); ctx.moveTo(x2,y2); ctx.lineTo(x2+ox,y2+oy); }
        ctx.stroke();
        drawCellEdges(cell, ox, oy, alpha, strokeSize + influence * 0.8, hoverColor);
      }
      ctx.restore();
    };

    const render = () => {
      updateCells();
      ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, width, height);
      drawBaseGrid(); drawRaisedMaskGrid();
      animationFrame = requestAnimationFrame(render);
    };

    const onPointerMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onPointerLeave = () => { mouseRef.current.active = false; };

    resize(); render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    maskSource, safeText, fontSize, fontWeight, maskScale,
    gridSpacing, strokeSize, hoverRadius, hoverFalloff, interactionRange,
    liftHeight, liftRotation, liftSmoothness, baseOpacity, hoverOpacity,
    backgroundColor, gridColor, hoverColor, svgVersion,
  ]);

  return (
    <div className={styles.scene} data-mask-source={maskSourceState}>
      <div className={styles.topLeftControls}>
        <div className={styles.levaHeader}>
          <div className={styles.levaHeaderTop}>
            <div className={styles.levaBrand}>HYPERIUX</div>
            <div className={styles.levaToggle}>
              <button
                type="button"
                className={`${styles.levaToggleBtn} ${maskSourceState === "Text" ? styles.levaActive : ""}`}
                onClick={() => handleSetMask("Text")}
              >
                Text
              </button>
              <button
                type="button"
                className={`${styles.levaToggleBtn} ${maskSourceState === "SVG" ? styles.levaActive : ""}`}
                onClick={() => handleSetMask("SVG")}
              >
                SVG
              </button>
            </div>
          </div>

          <div className={styles.levaHeaderBottom}>
            {maskSourceState === "Text" && (
              <input
                className={styles.levaTextInput}
                value={maskText}
                onChange={(e) => setMaskText(e.target.value)}
                placeholder="Text…"
              />
            )}
            {maskSourceState === "SVG" && (
              <button
                type="button"
                className={styles.levaUpload}
                onClick={() => fileInputRef.current?.click()}
                title={svgName}
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ background: backgroundColor }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        onChange={handleSVGUpload}
        style={{ display: "none" }}
      />
      <div className={styles.rightControls}>
        <LevaPanel
          theme={levaTheme}
          collapsed={false}
          oneLineLabels={true}
          flat={false}
          hideCopyButton
        />
      </div>
    </div>
  );
}
