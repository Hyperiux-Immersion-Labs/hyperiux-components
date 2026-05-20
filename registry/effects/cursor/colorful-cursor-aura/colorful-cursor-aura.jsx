"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ColorfulCursorAura({
  text = "One hover, and suddenly your UI has personality",
  colors = {
    color1: "#7f7de4",
    color2: "#f79694",
    color3: "#f5dd94",
  },
  enableEntryAnimation = true,
  textColor = "#000000",
  className = "",
}) {
  const container = useRef(null);
  const auraText = useRef(null);
  const maskedText = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const circleTrackers = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1025);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const el = container.current;
    const maskEl = maskedText.current;
    if (!el || !maskEl || !isDesktop) {
      gsap.killTweensOf(circleTrackers.current);
      return;
    }

    const syncMaskVars = () => {
      maskEl.style.setProperty("--x-color1", `${circleTrackers.current[0].x}px`);
      maskEl.style.setProperty("--y-color1", `${circleTrackers.current[0].y}px`);
      maskEl.style.setProperty("--x-color2", `${circleTrackers.current[1].x}px`);
      maskEl.style.setProperty("--y-color2", `${circleTrackers.current[1].y}px`);
      maskEl.style.setProperty("--x-color3", `${circleTrackers.current[2].x}px`);
      maskEl.style.setProperty("--y-color3", `${circleTrackers.current[2].y}px`);
    };

    const rect = maskEl.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    circleTrackers.current.forEach((item) => {
      item.x = cx;
      item.y = cy;
    });
    syncMaskVars();

    const onMove = (event) => {
      const maskRect = maskEl.getBoundingClientRect();
      const localX = event.clientX - maskRect.left;
      const localY = event.clientY - maskRect.top;

      gsap.to(circleTrackers.current, {
        x: localX,
        y: localY,
        duration: 0.5,
        ease: "power1.out",
        stagger: -0.1,
        overwrite: "auto",
        onUpdate: syncMaskVars,
      });
    };

    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      gsap.killTweensOf(circleTrackers.current);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!enableEntryAnimation) return;

    const ctx = gsap.context(() => {
      gsap.from(auraText.current, {
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        },
        opacity: 0,
        yPercent: 320,
        skewY: 30,
        duration: 3,
        ease: "expo.out",
      });
    }, container);

    return () => ctx.revert();
  }, [enableEntryAnimation]);

  return (
    <section
      ref={container}
      className={`relative h-screen w-full overflow-hidden bg-[#ececec] ${className}`}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div ref={auraText} className="relative w-[70%] max-lg:w-[80%]">
          <p
            className="text-center text-[6vw] font-medium leading-none max-md:text-[8vw] max-sm:text-[10vw]"
            style={{ color: textColor }}
          >
            {text}
          </p>

          {isDesktop && (
            <p
              ref={maskedText}
              aria-hidden
              className="pointer-events-none absolute inset-0 text-center text-[6vw] font-medium text-transparent [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] max-[1024px]:text-[8vw] max-[540px]:text-[10vw]"
              style={{
                "--x-color1": "50%",
                "--y-color1": "50%",
                "--x-color2": "50%",
                "--y-color2": "50%",
                "--x-color3": "50%",
                "--y-color3": "50%",
                backgroundImage: `
                  radial-gradient(circle 135px at var(--x-color3) var(--y-color3), ${colors.color3} 0 99%, transparent 100%),
                  radial-gradient(circle 220px at var(--x-color2) var(--y-color2), ${colors.color2} 0 99%, transparent 100%),
                  radial-gradient(circle 325px at var(--x-color1) var(--y-color1), ${colors.color1} 0 99%, transparent 100%)
                `,
              }}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ColorfulCursorAura;
