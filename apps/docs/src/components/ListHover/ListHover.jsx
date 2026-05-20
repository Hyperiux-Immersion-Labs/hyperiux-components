"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ListHover({ items }) {
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
      if (el) {
        gsap.set(el, {
          clipPath: "inset(50%)",
          visibility: "hidden",
        });
      }
    });

    if (highlightRef.current) {
      gsap.set(highlightRef.current, {
        opacity: 0,
        y: 0,
        height: 0,
      });
    }
  }, []);

  const nextGen = (index) => {
    tweenGen.current[index] = (tweenGen.current[index] || 0) + 1;
    return tweenGen.current[index];
  };

  const setRowTextColor = (index, color) => {
    const rowEl = rowRefs.current[index];
    if (!rowEl) return;

    gsap.to(rowEl.querySelectorAll("td"), {
      color,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
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

  const handleEnter = (rowEl, index) => {
    const el = imageRefs.current[index];
    if (!el) return;

    pendingLeave.current[index] = false;
    rowRefs.current[index] = rowEl;

    zIndexRef.current += 1;
    const gen = nextGen(index);

    gsap.killTweensOf(el);

    gsap.set(el, {
      zIndex: zIndexRef.current,
      visibility: "visible",
      clipPath: "inset(50%)",
      opacity: 1,
    });

    gsap.to(el, {
      clipPath: "inset(0%)",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (tweenGen.current[index] !== gen) return;
        if (pendingLeave.current[index]) {
          pendingLeave.current[index] = false;
          animateOut(index);
        }
      },
    });

    if (activeIndexRef.current !== null && activeIndexRef.current !== index) {
      setRowTextColor(activeIndexRef.current, "#ffffff");
    }

    activeIndexRef.current = index;
    setRowTextColor(index, "#000000");
    moveHighlightToRow(rowEl);
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

  const handleLeave = (_, index) => {
    const el = imageRefs.current[index];
    if (!el) return;

    if (gsap.isTweening(el)) {
      pendingLeave.current[index] = true;
    } else {
      animateOut(index);
    }
  };

  const handleTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, "#ffffff");
      activeIndexRef.current = null;
    }

    if (highlightRef.current) {
      gsap.to(highlightRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(imageContainerRef.current, {
      x: x * 20,
      y: y * 20,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="relative w-full min-h-[50vh] overflow-hidden bg-neutral-900 text-white font-mono"
      onMouseMove={handleMouseMove}
    >
      {/*
 Image container sits above the table rows (z-10 on images).
 mix-blend-mode: difference makes the white row highlight
"cut through" the image — white areas invert the image colours,
 black areas leave it untouched — giving exactly the effect shown
 in the screenshot.
 */}
      <div
        ref={highlightRef}
        className="absolute left-0 right-0 top-0 z-10 pointer-events-none bg-white"
      />
      <div
        ref={imageContainerRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ mixBlendMode: "difference" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => (imageRefs.current[i] = el)}
            className="absolute invisible top-1/2 left-[30vw] -translate-y-1/2 w-78 h-90 max-md:h-60 max-md:w-[60vw] max-md:left-[40vw]"
            style={{ willChange: "clip-path, opacity", zIndex: 10 }}
          >
            <Image src={item.img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Table — sits below the blended image layer */}
      <div
        ref={tableRef}
        className="relative w-full"
        onMouseLeave={handleTableLeave}
      >
        <table className="relative z-30 w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-1/7 bgred-500 max-md:hidden" />
            <col className="w-1/7 bggreen-500 max-md:hidden" />
            <col className="w-1/3 max-md:hidden" />
            <col className="w-1/9 max-md:hidden bgamber-400" />
            <col className="w-130! max-md:w-hidden" />
            <col />
          </colgroup>

          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                onMouseEnter={(e) => handleEnter(e.currentTarget, i)}
                onMouseLeave={(e) => handleLeave(e.currentTarget, i)}
                className="cursor-pointer"
              >
                <td className="py-3 px-6 text-xs tracking-widest uppercase whitespace-nowrap">
                  {item.client}
                </td>
                <td className="py-3 px-6 text-xs tracking-widest uppercase whitespace-nowrap">
                  {item.platform}
                </td>
                {/* Image column (empty) */}
                <td className="py-3" />
                <td className="py-3 px-3 text-xs text-white/40 whitespace-nowrap">
                  ({String.fromCharCode(97 + i)}.)
                </td>
                <td className="py-3 px-4 text-xs text-left whitespace-nowrap">
                  {item.services}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={6} className="p-0" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
