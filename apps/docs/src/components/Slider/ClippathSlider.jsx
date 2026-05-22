"use client";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

export default function ClippathSlider({ slides = [], cursorBg = "#d9f99d", cursorLineColor = "#000", }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextSlideIndex, setNextSlideIndex] = useState(0);
  const isInside = useRef(false);

  const [layerA, setLayerA] = useState({ index: 0 });
  const [layerB, setLayerB] = useState({ index: 0 });

  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const linesCanvasRef = useRef(null);
  const bgRefA = useRef(null);
  const bgRefB = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const splitRef = useRef(null);
  const rafRef = useRef(null);
  const activeLayerRef = useRef("A");
  const cursorRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  // Init on mount
  useEffect(() => {
    // Active layer A: visible, locked at 1.25 (resting state after canvas zoom)
    if (bgRefA.current) gsap.set(bgRefA.current, { scale: 1.25, opacity: 1, zIndex: 1 });
    // Standby layer B: hidden, pre-set to 1.25 ready for reuse
    if (bgRefB.current) gsap.set(bgRefB.current, { scale: 1.25, opacity: 0, zIndex: 0 });

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    drawStaticLines();
  }, []);

  // Redraw lines on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      drawStaticLines();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // AUTO PLAY
  useEffect(() => {
    if (isTransitioning || slides.length === 0) return;
    autoPlayTimerRef.current = setTimeout(() => {
      nextSlideNav();
    }, 8000);
    return () => clearTimeout(autoPlayTimerRef.current);
  }, [currentSlide, isTransitioning]);

  // TEXT IN
  useEffect(() => {
    if (!textRef.current || isTransitioning) return;

    gsap.set(textRef.current, { opacity: 1 });

    requestAnimationFrame(() => {
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      const split = new SplitText(".about-slider-text", {
        type: "lines",
        linesClass: "lines",
        mask: "lines",
      });
      splitRef.current = split;
      gsap.from(split.lines, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [currentSlide]);

  // FADE OUT TEXT
  const fadeOutText = () => {
    return new Promise((resolve) => {
      if (!textRef.current) return resolve();
      gsap.killTweensOf(textRef.current);
      gsap.to(textRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => {
          if (splitRef.current) {
            splitRef.current.revert();
            splitRef.current = null;
          }
          resolve();
        },
      });
    });
  };

  // ─── Draw static white lines ───
  const drawStaticLines = () => {
    const canvas = linesCanvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (!W || !H) return;

    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    const cx = W * 0.25;
    const cy = H / 2;
    const R = Math.sqrt(
      Math.max(cx, W - cx) ** 2 + Math.max(cy, H - cy) ** 2
    ) + 10;

    const clockAngle = (hour) => ((hour * 30 - 90) * Math.PI) / 180;
    const pos1 = clockAngle(1.5);
    const pos5 = clockAngle(4.5);
    const gap = 28;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.filter = "none";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "butt";
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(cx + gap * Math.cos(pos1), cy + gap * Math.sin(pos1));
    ctx.lineTo(cx + R * Math.cos(pos1), cy + R * Math.sin(pos1));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + gap * Math.cos(pos5), cy + gap * Math.sin(pos5));
    ctx.lineTo(cx + R * Math.cos(pos5), cy + R * Math.sin(pos5));
    ctx.stroke();
  };

  const runSweepAnimation = (nextIndex) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve();

      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      const img = new Image();
      img.src = slides[nextIndex].image;

      const animate = () => {
        const cx = W * 0.25;
        const cy = H / 2;
        const R = Math.sqrt(
          Math.max(cx, W - cx) ** 2 + Math.max(cy, H - cy) ** 2
        ) + 10;

        const clockAngle = (hour) => ((hour * 30 - 90) * Math.PI) / 180;
        const pos1 = clockAngle(1.5); // 1:30
        const pos5 = clockAngle(4.5); // 4:30
        const shortSweep = clockAngle(4.5) - clockAngle(1.5);
        const longSweep = 2 * Math.PI - shortSweep;

        const proxy = { progress: 0, imgScale: 1.5 };

        const draw = () => {
          const p = proxy.progress;
          const s = proxy.imgScale;

          ctx.clearRect(0, 0, W, H);
          ctx.save();

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, R, pos1, pos1 + shortSweep * p, false);
          ctx.closePath();

          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, R, pos5, pos5 + longSweep * p, false);
          ctx.closePath();

          ctx.clip("evenodd");

          if (img.complete) {
            const iW = img.naturalWidth || W;
            const iH = img.naturalHeight || H;
            const fitScale = Math.max(W / iW, H / iH);
            const dw = iW * fitScale * s;
            const dh = iH * fitScale * s;
            const dx = (W - dw) / 2;
            const dy = (H - dh) / 2;
            ctx.drawImage(img, dx, dy, dw, dh);
          } else {
            ctx.fillStyle = "#888";
            ctx.fillRect(0, 0, W, H);
          }

          ctx.restore();
        };

        gsap.to(proxy, {
          progress: 1,
          imgScale: 1.25,
          duration: 1.2,
          // ease:"cubic-bezier(.075, .82, .165, 1)",
          ease: "power2.inOut",
          onUpdate: draw,
          onComplete: () => {
            requestAnimationFrame(() => {
              ctx.clearRect(0, 0, W, H);
              resolve();
            });
          },
        });
      };

      if (img.complete) {
        animate();
      } else {
        img.onload = animate;
        img.onerror = animate;
      }
    });
  };

  // SLIDE CHANGE
  const changeSlide = async (newIndex) => {
    if (isTransitioning || slides.length === 0) return;

    setIsTransitioning(true);
    clearTimeout(autoPlayTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    setNextSlideIndex(newIndex);

    const outgoingIsA = activeLayerRef.current === "A";
    const outgoingRef = outgoingIsA ? bgRefA : bgRefB;
    const incomingRef = outgoingIsA ? bgRefB : bgRefA;

    // ── 1. Load new image onto incoming layer ──
    if (outgoingIsA) {
      setLayerB({ index: newIndex });
    } else {
      setLayerA({ index: newIndex });
    }

    // One frame for React to paint the new backgroundImage on the incoming layer
    await new Promise((r) => requestAnimationFrame(r));

    // ── 2. Incoming: hidden below everything. Canvas draws the next image during sweep.
    if (incomingRef.current) {
      gsap.set(incomingRef.current, { scale: 1.25, opacity: 0, zIndex: 0 });
    }
    // Outgoing: stays on top
    if (outgoingRef.current) {
      gsap.set(outgoingRef.current, { zIndex: 1 });
    }

    // ── 3. Outgoing: 1.25 → 1.0 during sweep (zoom out as it exits) ──
    if (outgoingRef.current) {
      gsap.killTweensOf(outgoingRef.current);
      gsap.to(outgoingRef.current, {
        scale: 1.0,
        duration: 1.2,
        // ease:"power1.inOut",
        ease: "power2.inOut",
      });
    }

    await fadeOutText();
    await runSweepAnimation(newIndex);

    // ── 4. Sweep done. Swap layers. ──
    activeLayerRef.current = outgoingIsA ? "B" : "A";

    // Hide outgoing, reset scale to resting for its next use
    if (outgoingRef.current) {
      gsap.killTweensOf(outgoingRef.current);
      gsap.set(outgoingRef.current, { opacity: 0, scale: 1.25, zIndex: 0 });
    }

    // ── 5. Reveal incoming at 1.25 — canvas ended here, DOM takes over locked at 1.25 ──
    if (incomingRef.current) {
      gsap.killTweensOf(incomingRef.current);
      gsap.set(incomingRef.current, { zIndex: 1, opacity: 1, scale: 1.25 });
      // No tween — stays at 1.25 until it becomes outgoing and zooms to 1.0
    }

    setCurrentSlide(newIndex);
    setIsTransitioning(false);
  };

  const nextSlideNav = () =>
    changeSlide((currentSlide + 1) % slides.length);

  const prevSlideNav = () =>
    changeSlide((currentSlide - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  useEffect(() => {
    const cursor = cursorRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;

    if (!cursor || !l1 || !l2) return;

    // center cursor
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      opacity: 0, scale: 0.6,
    });

    // lines setup (keep yours)
    gsap.set(l1, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: -1.5,
      rotation: 45,
      x: 0,
    });

    gsap.set(l2, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: 1.5,
      rotation: -45,
      x: 0,
    });

    let currentSide = "right";

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      mouse.current.x = x;
      mouse.current.y = y;

      // detect if outside viewport (fixes top edge issue)
      const isOut =
        x <= 0 ||
        y <= 0 ||
        x >= window.innerWidth ||
        y >= window.innerHeight;

      // ── OUTSIDE SCREEN ─────────────────────────────
      if (isOut) {
        if (isInside.current) {
          isInside.current = false;

          gsap.to(cursorRef.current, {
            opacity: 0,
            scale: 0.6,
            duration: 0.25,
            ease: "power3.inOut",
          });
        }
        return;
      }

      // ── FIRST ENTRY (fix top-left jump) ────────────
      if (!isInside.current) {
        pos.current.x = x;
        pos.current.y = y;

        gsap.set(cursorRef.current, {
          x: x,
          y: y,
        });

        gsap.to(cursorRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power3.out",
        });

        isInside.current = true;
      }

      // ── ARROW SIDE LOGIC ───────────────────────────
      const isLeft = x < window.innerWidth / 2;
      const nextSide = isLeft ? "left" : "right";

      if (nextSide !== currentSide) {
        currentSide = nextSide;

        if (nextSide === "left") {
          // <
          gsap.to(line1Ref.current, {
            rotation: 135,
            x: "-1vw",
            duration: 0.35,
            ease: "power3.inOut",
          });

          gsap.to(line2Ref.current, {
            rotation: -135,
            x: "-1vw",
            duration: 0.35,
            ease: "power3.inOut",
          });
        } else {
          // >
          gsap.to(line1Ref.current, {
            rotation: 45,
            x: 4,
            duration: 0.35,
            ease: "power3.inOut",
          });

          gsap.to(line2Ref.current, {
            rotation: -45,
            x: 4,
            duration: 0.35,
            ease: "power3.inOut",
          });
        }
      }
    };

    const handleLeave = () => {
      isInside.current = false;

      gsap.to(cursor, {
        opacity: 0,
        scale: 0.6, duration: 0.25,
        ease: "power3.inOut",
      });
    };

    window.addEventListener("mousemove", handleMove);
    // window.addEventListener("mouseleave", handleLeave);

    // smooth follow
    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;

      gsap.set(cursor, {
        x: pos.current.x,
        y: pos.current.y,
      });

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden">

      {/* BG Layer A */}
      <div
        ref={bgRefA}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${slides[layerA.index].image}')`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />

      {/* BG Layer B */}
      <div
        ref={bgRefB}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${slides[layerB.index].image}')`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />

      {/* Sweep canvas — z-10 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Lines canvas — z-20 */}
      <canvas
        ref={linesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 20 }}
      />

      {/* Dark overlay — z-30 */}
      <div
        className="absolute inset-0 bg-black/10 pointer-events-none"
        style={{ zIndex: 30 }}
      />

      {/* Click layer — z-40 */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 40 }}
        onClick={(e) => {
          if (isTransitioning) return;
          const isLeft = e.clientX < window.innerWidth / 2;
          isLeft ? prevSlideNav() : nextSlideNav();
        }}
      />

      {/* TEXT — z-50 */}
      <div
        ref={textRef}
        className="absolute inset-0 text-white pointer-events-none"
        style={{ zIndex: 50 }}
      >
        {/* NAME (left center) */}
        <h2 className="absolute left-[5%] max-sm:left-[1%] top-[50%] max-md:text-[3vw] w-[20vw] max-sm:w-[27vw] text-right -translate-y-1/2 text-[1.7vw] max-sm:text-[4vw] font-medium about-slider-text ">
          {slides[currentSlide].name}
        </h2>

        {/* SMALL DESCRIPTION (top right) */}
        <div className="absolute right-[3%] top-[8%] max-sm:top-[13%] max-sm:right-[8%] max-sm:text-[3.2vw] max-md:text-[3vw] max-md:w-[80%] w-[22%] text-[1.1vw] leading-[1.4] opacity-90 about-slider-text">

  <h3 className="mb-4 uppercase tracking-[0.25em] text-white/50 text-[0.8vw] max-md:text-[2.8vw]">
    Capabilities
  </h3>

  <div className="flex flex-col gap-2">
    {slides[currentSlide].tags?.map((tag, i) => (
      <div key={i} className="flex items-center gap-3">
        <span className="h-1 w-1 rounded-full bg-current shrink-0" />

        <p className="text-[1.2vw] max-md:text-[4.5vw] font-light about-slider-text leading-[1.2]">
          {tag}
        </p>
      </div>
    ))}
  </div>

</div>

        {/* TAGS (right middle stacked) */}
        <div className="absolute right-[5%] top-[55%] max-sm:top-[50%] text-center w-[30vw] max-sm:w-[50vw] -translate-y-1/2 flex flex-col items-start leading-[1.1]">
         
            <p className="text-[1.5vw] max-md:text-[4vw] font-light about-slider-text">
               {slides[currentSlide].description}
            </p>
       
        </div>

      </div>

      {/* CURSOR FOLLOWER */}
      <div
        ref={cursorRef}
        className="fixed max-sm:hidden  top-0 left-0 pointer-events-none z-100"
      >
        <div
          className="w-15 h-15 max-sm:hidden  rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: cursorBg }}
        >
          <div className="relative w-7.5 h-7.5">
            {/* line 1 */}
            <span
              ref={line1Ref}
              className="absolute left-1/2 top-1/2 w-4 h-0.5"
              style={{ backgroundColor: cursorLineColor }}
            />

            <span
              ref={line2Ref}
              className="absolute left-1/2 top-1/2 w-4 h-0.5"
              style={{ backgroundColor: cursorLineColor }}
            />

          </div>

        </div>
      </div>
    </section>
  );
}