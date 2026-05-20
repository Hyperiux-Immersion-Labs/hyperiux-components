"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function InteractiveListPreview({ items = [] }) {
  const imageRefs = useRef([]);
  const imageContainerRef = useRef(null);
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
  const zIndexRef = useRef(10);
  const pendingLeave = useRef({});
  const rowRefs = useRef({});
  const tweenGen = useRef({});
  const activeIndexRef = useRef(null);

  useEffect(() => {
    imageRefs.current.forEach((el) => {
      if (el) gsap.set(el, { clipPath: "inset(50%)", visibility: "hidden" });
    });
    if (highlightRef.current) gsap.set(highlightRef.current, { opacity: 0, y: 0, height: 0 });
  }, []);

  const nextGen = (index) => {
    tweenGen.current[index] = (tweenGen.current[index] || 0) + 1;
    return tweenGen.current[index];
  };

  const setRowTextColor = (index, color) => {
    const rowEl = rowRefs.current[index];
    if (!rowEl) return;
    gsap.to(rowEl.querySelectorAll("td"), { color, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };

  const moveHighlightToRow = (rowEl) => {
    const tableEl = tableRef.current;
    const highlightEl = highlightRef.current;
    if (!tableEl || !highlightEl || !rowEl) return;
    const tableBounds = tableEl.getBoundingClientRect();
    const rowBounds = rowEl.getBoundingClientRect();
    gsap.to(highlightEl, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const animateOut = (index) => {
    const el = imageRefs.current[index];
    if (!el) return;
    const gen = nextGen(index);
    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: "inset(50%)",
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        if (tweenGen.current[index] !== gen) return;
        gsap.set(el, { visibility: "hidden" });
      },
    });
  };

  const handleEnter = (rowEl, index) => {
    const el = imageRefs.current[index];
    if (!el) return;
    pendingLeave.current[index] = false;
    rowRefs.current[index] = rowEl;
    zIndexRef.current += 1;
    const gen = nextGen(index);
    gsap.killTweensOf(el);
    gsap.set(el, { zIndex: zIndexRef.current, visibility: "visible", clipPath: "inset(50%)", opacity: 1 });
    gsap.to(el, {
      clipPath: "inset(0%)",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (tweenGen.current[index] !== gen) return;
        if (pendingLeave.current[index]) { pendingLeave.current[index] = false; animateOut(index); }
      },
    });
    if (activeIndexRef.current !== null && activeIndexRef.current !== index) {
      setRowTextColor(activeIndexRef.current, "#ffffff");
    }
    activeIndexRef.current = index;
    setRowTextColor(index, "#000000");
    moveHighlightToRow(rowEl);
  };

  const handleLeave = (_, index) => {
    const el = imageRefs.current[index];
    if (!el) return;
    if (gsap.isTweening(el)) pendingLeave.current[index] = true;
    else animateOut(index);
  };

  const handleTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, "#ffffff");
      activeIndexRef.current = null;
    }
    if (highlightRef.current) {
      gsap.to(highlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    }
  };

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(imageContainerRef.current, { x: x * 20, y: y * 20, duration: 0.4, ease: "power2.out" });
  };

  return (
    <div
      style={{ position: "relative", width: "100%", minHeight: "50vh", overflow: "hidden", background: "#171717", color: "#ffffff", fontFamily: "monospace" }}
      onMouseMove={handleMouseMove}
    >
      {/* Sliding highlight bar */}
      <div ref={highlightRef} style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 10, pointerEvents: "none", background: "#ffffff" }} />

      {/* Image layer — mix-blend-mode difference inverts on white highlight */}
      <div ref={imageContainerRef} style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", mixBlendMode: "difference" }}>
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => (imageRefs.current[i] = el)}
            style={{
              position: "absolute", visibility: "hidden",
              top: "50%", left: "30vw", transform: "translateY(-50%)",
              width: "19.5rem", height: "22.5rem",
              willChange: "clip-path, opacity", zIndex: 10,
            }}
          >
            <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div ref={tableRef} style={{ position: "relative", width: "100%" }} onMouseLeave={handleTableLeave}>
        <table style={{ position: "relative", zIndex: 30, width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "33%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "80px" }} />
            <col />
          </colgroup>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleEnter(e.currentTarget, i)}
                onMouseLeave={(e) => handleLeave(e.currentTarget, i)}
              >
                <td style={{ padding: "0.75rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item.client}</td>
                <td style={{ padding: "0.75rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item.platform}</td>
                <td style={{ padding: "0.75rem" }} />
                <td style={{ padding: "0.75rem 0.75rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>({String.fromCharCode(97 + i)}.)</td>
                <td style={{ padding: "0.75rem 1.5rem", fontSize: "0.75rem", textAlign: "right", whiteSpace: "nowrap" }}>{item.services}</td>
              </tr>
            ))}
            <tr><td colSpan={6} style={{ padding: 0 }} /></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
