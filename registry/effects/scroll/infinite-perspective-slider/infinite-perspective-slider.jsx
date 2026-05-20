"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const SCROLL_PER_PX = 1;
const LERP = 0.1;
const VELOCITY_LERP = 0.09;
const CARD_WIDTH = 320;
const CARD_GAP = 24;
const MOBILE_BREAKPOINT = 640;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_GAP = 16;
const ROTATION_SENSITIVITY = 0.025;
const ROTATION_DAMP = 0.1;
const ROTATION_LERP = 0.12;

const getItemData = (item) => (typeof item === "string" ? { src: item } : item);

export default function InfinitePerspectiveSlider({ images = [] }) {
  const stripRef = useRef(null);
  const settersRef = useRef([]);
  const cardRefs = useRef([]);
  const imageRefs = useRef([]);
  const numberRefs = useRef([]);
  const titleRefs = useRef([]);
  const descriptionRefs = useRef([]);
  const [viewportWidth, setViewportWidth] = useState(CARD_WIDTH * 4);

  const isMobileViewport = viewportWidth < MOBILE_BREAKPOINT;
  const cardWidth = isMobileViewport ? MOBILE_CARD_WIDTH : CARD_WIDTH;
  const cardGap = isMobileViewport ? MOBILE_CARD_GAP : CARD_GAP;
  const cardStep = cardWidth + cardGap;
  const cardHeight = isMobileViewport ? "calc(40vh + 72px)" : "calc(50vh + 96px)";

  const stateRef = useRef({
    current: 0,
    target: 0,
    raf: null,
    velocity: 0,
    smoothVelocity: 0,
    rotationVelocity: 0,
    currentRotation: 0,
    isDragging: false,
    lastX: 0,
  });

  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const initSetters = () => {
    if (!stripRef.current) return;
    settersRef.current = Array.from(stripRef.current.children).map((element) => ({
      x: gsap.quickSetter(element, "x", "px"),
      rotateY: gsap.quickSetter(element, "rotateY", "deg"),
    }));
  };

  const positionCards = useCallback(
    (offset, rotation) => {
      const strip = stripRef.current;
      if (!strip || !images.length) return;

      const cards = strip.children;
      const setters = settersRef.current;
      const count = images.length;
      const loopWidth = count * cardStep;
      const centerX = window.innerWidth / 2;
      const centreOffset = centerX - cardWidth / 2;

      for (let index = 0; index < cards.length; index += 1) {
        let x = index * cardStep - offset + centreOffset;
        x = ((x % loopWidth) + loopWidth) % loopWidth;
        if (x > loopWidth - cardStep) x -= loopWidth;
        setters[index].x(x);
        setters[index].rotateY(rotation);
      }
    },
    [cardStep, cardWidth, images.length]
  );

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!images.length) return undefined;

    const state = stateRef.current;
    const loopWidth = images.length * cardStep;

    initSetters();

    const tick = () => {
      state.current = lerp(state.current, state.target, LERP);
      state.velocity = state.target - state.current;
      state.smoothVelocity = lerp(state.smoothVelocity, state.velocity, VELOCITY_LERP);
      state.rotationVelocity = lerp(state.rotationVelocity, state.velocity, ROTATION_DAMP);

      const targetRotation =
        Math.sign(state.rotationVelocity) *
        Math.abs(state.rotationVelocity) *
        ROTATION_SENSITIVITY;

      state.currentRotation = lerp(state.currentRotation, targetRotation, ROTATION_LERP);
      const finalRotation = clamp(state.currentRotation, -80, 80);

      if (Math.abs(state.current - state.target) < 0.05) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;
        state.current -= shift;
        state.target -= shift;
      }

      positionCards(state.current, finalRotation);
      state.raf = requestAnimationFrame(tick);
    };

    const onWheel = (event) => {
      state.target += event.deltaY * SCROLL_PER_PX;
    };

    const onDown = (clientX) => {
      state.isDragging = true;
      state.lastX = clientX;
    };

    const onMove = (clientX) => {
      if (!state.isDragging) return;
      const delta = clientX - state.lastX;
      state.lastX = clientX;
      state.target += -delta * SCROLL_PER_PX;
    };

    const onUp = () => {
      state.isDragging = false;
    };

    const onResize = () => {
      initSetters();
      positionCards(state.current, state.currentRotation);
    };

    state.current = 0;
    state.target = 0;
    state.velocity = 0;
    state.smoothVelocity = 0;
    state.rotationVelocity = 0;
    state.currentRotation = 0;

    positionCards(0, 0);
    state.raf = requestAnimationFrame(tick);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("mousedown", (event) => onDown(event.clientX));
    window.addEventListener("mousemove", (event) => onMove(event.clientX));
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", (event) => onDown(event.touches[0].clientX), {
      passive: true,
    });
    window.addEventListener("touchmove", (event) => onMove(event.touches[0].clientX), {
      passive: true,
    });
    window.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [cardStep, images, positionCards]);

  useEffect(() => {
    if (!images.length) return undefined;

    const animations = [];

    cardRefs.current.forEach((card, index) => {
      const image = imageRefs.current[index];
      const number = numberRefs.current[index];
      const title = titleRefs.current[index];
      const description = descriptionRefs.current[index];
      if (!card || !image || !number || !title || !description) return;

      const numberSplit = SplitText.create(number, { type: "lines", mask: "lines" });
      const titleSplit = SplitText.create(title, { type: "lines", mask: "lines" });
      const descriptionSplit = SplitText.create(description, { type: "lines", mask: "lines" });
      const lines = [...numberSplit.lines, ...titleSplit.lines, ...descriptionSplit.lines];

      gsap.set([number, title, description], { autoAlpha: 0 });
      gsap.set(lines, { yPercent: 100 });

      const enter = () => {
        gsap.killTweensOf(lines);
        gsap.killTweensOf([number, title, description]);
        gsap
          .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
          .set([number, title, description], { autoAlpha: 1 })
          .to(numberSplit.lines, { yPercent: 0, duration: 0.55, stagger: 0.06 }, 0)
          .to(titleSplit.lines, { yPercent: 0, duration: 0.55, stagger: 0.06 }, 0.05)
          .to(descriptionSplit.lines, { yPercent: 0, duration: 0.55, stagger: 0.06 }, 0.12);
      };

      const leave = () => {
        gsap.killTweensOf(lines);
        gsap.killTweensOf([number, title, description]);
        gsap
          .timeline({ defaults: { ease: "power3.in", overwrite: "auto" } })
          .to(descriptionSplit.lines, { yPercent: 100, duration: 0.35, stagger: 0.04 }, 0)
          .to(titleSplit.lines, { yPercent: 100, duration: 0.35, stagger: 0.04 }, 0.04)
          .to(numberSplit.lines, { yPercent: 100, duration: 0.35, stagger: 0.04 }, 0.08)
          .set([number, title, description], { autoAlpha: 0 });
      };

      image.addEventListener("mouseenter", enter);
      image.addEventListener("mouseleave", leave);

      animations.push({ image, enter, leave, numberSplit, titleSplit, descriptionSplit });
    });

    return () => {
      animations.forEach(({ image, enter, leave, numberSplit, titleSplit, descriptionSplit }) => {
        image.removeEventListener("mouseenter", enter);
        image.removeEventListener("mouseleave", leave);
        numberSplit.revert();
        titleSplit.revert();
        descriptionSplit.revert();
      });
    };
  }, [images]);

  return (
    <div className="h-screen w-screen overflow-hidden max-sm:px-4">
      <div className="pointer-events-none relative flex h-full items-center overflow-hidden perspective-[2200px] max-sm:items-start max-sm:pt-24">
        <div ref={stripRef} className="relative w-full transform-3d" style={{ height: cardHeight }}>
          {images.map((item, index) => {
            const { src, number, title, desc, description } = getItemData(item);

            return (
              <div
                key={index}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="pointer-events-auto absolute top-0 left-0 will-change-transform"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transformOrigin: "center center",
                  transform: "translateZ(1px)",
                }}
              >
                <div
                  ref={(element) => {
                    numberRefs.current[index] = element;
                  }}
                  className="mb-2 text-2xl leading-none tracking-tight text-black max-sm:mb-1 max-sm:text-lg"
                >
                  {number}
                </div>
                <div
                  ref={(element) => {
                    imageRefs.current[index] = element;
                  }}
                  className="h-[50vh] w-full overflow-hidden bg-white max-sm:h-[40vh]"
                >
                  <img
                    src={src}
                    alt={`slide-${index}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <div
                    ref={(element) => {
                      titleRefs.current[index] = element;
                    }}
                    className="text-xl leading-none tracking-[0.04em] text-black uppercase max-sm:text-base"
                  >
                    {title}
                  </div>
                  <div
                    ref={(element) => {
                      descriptionRefs.current[index] = element;
                    }}
                    className="text-sm leading-relaxed text-black/70 max-sm:text-xs"
                  >
                    {desc || description || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
