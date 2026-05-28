'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Image from 'next/image';

gsap.registerPlugin(SplitText);

const SCROLL_PER_PX = 1.0;
const LERP_FACTOR = 0.08;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const SLIDER_BOTTOM_OFFSET = 0;

const lerp = (a, b, n) => a + (b - a) * n;

export default function ZoomSlider({ images = [] }) {
  // State & refs
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const textRefs = useRef([]);

  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);

  // Derived values
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const isTablet =
    viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

  const cardWidthMin = isMobile ? 75 : 190;
  const cardWidthMax = isMobile ? 260 : isTablet ? 500 : 680;
  const cardHeightMax = isMobile
    ? Math.round(viewportHeight * 0.6)
    : Math.round(viewportHeight * 0.82);
  const cardHeightMin = isMobile ? 80 : 50;
  const cardStep = cardWidthMax;

  const stateRef = useRef({
    current: 0,
    target: 0,
    raf: null,
    isDragging: false,
    lastX: 0,
  });

  // Effects
  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const positionCards = useCallback(
    (offset) => {
      if (!stripRef.current) return;

      const cards = Array.from(stripRef.current.children);
      const count = images.length;
      if (!count) return;

      const loopWidth = count * cardStep;
      const viewportWidthValue = window.innerWidth;
      const viewportHeightValue = window.innerHeight;
      const bottom = viewportHeightValue - SLIDER_BOTTOM_OFFSET;
      const easingDistance = 2 * viewportWidthValue;

      const mapVtoX = (value) => {
        if (value <= 0) return 0;
        if (value >= easingDistance) return value - easingDistance / 2;
        return (value * value) / (2 * easingDistance);
      };

      const normalizedOffset =
        ((offset % loopWidth) + loopWidth) % loopWidth;
      const startIndex = Math.floor(normalizedOffset / cardStep);
      const fractionalOffset = (normalizedOffset % cardStep) / cardStep;

      for (let index = 0; index < count; index += 1) {
        const cardIndex = (startIndex + index) % count;
        const visualOffset = (index - fractionalOffset) * cardStep;
        const currentX = mapVtoX(visualOffset);
        const nextX = mapVtoX(visualOffset + cardStep);
        const visualWidth = nextX - currentX;
        const scale = visualWidth / cardWidthMax;
        const cardHeight =
          cardHeightMin + scale * (cardHeightMax - cardHeightMin);
        const y = bottom - cardHeight;

        cards[cardIndex].style.transform = `translate(${currentX}px, ${y}px)`;

        const imageWrap = imageWrapRefs.current[cardIndex];
        if (!imageWrap) continue;

        imageWrap.style.width = `${visualWidth}px`;
        imageWrap.style.height = `${cardHeight}px`;
      }
    },
    [cardHeightMax, cardHeightMin, cardStep, cardWidthMax, images.length]
  );

  useEffect(() => {
    if (!images.length) return;

    const state = stateRef.current;
    const loopWidth = images.length * cardStep;

    const tick = () => {
      state.current = lerp(state.current, state.target, LERP_FACTOR);

      if (Math.abs(state.current - state.target) < 0.01) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;
        state.current -= shift;
        state.target -= shift;
      }

      positionCards(state.current);
      state.raf = requestAnimationFrame(tick);
    };

    const onWheel = (event) => {
      state.target -= event.deltaY * SCROLL_PER_PX;
    };

    const onMouseDown = (event) => {
      state.isDragging = true;
      state.lastX = event.clientX;
    };

    const onMouseMove = (event) => {
      if (!state.isDragging) return;

      state.target += -(event.clientX - state.lastX);
      state.lastX = event.clientX;
    };

    const onMouseUp = () => {
      state.isDragging = false;
    };

    const onTouchStart = (event) => {
      state.isDragging = true;
      state.lastX = event.touches[0].clientX;
    };

    const onTouchMove = (event) => {
      if (!state.isDragging) return;

      state.target += -(event.touches[0].clientX - state.lastX);
      state.lastX = event.touches[0].clientX;
    };

    const onTouchEnd = () => {
      state.isDragging = false;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [cardStep, images, positionCards]);

  useEffect(() => {
    if (!images.length) return;

    const cleanups = [];

    cardRefs.current.forEach((card, index) => {
      const textElement = textRefs.current[index];
      const imageWrap = imageWrapRefs.current[index];
      if (!card || !textElement || !imageWrap) return;

      const numberElement = textElement.querySelector('[data-number]');
      const titleElement = textElement.querySelector('[data-title]');
      const descElement = textElement.querySelector('[data-desc]');
      if (!numberElement || !titleElement || !descElement) return;

      const split = SplitText.create(
        [numberElement, titleElement, descElement],
        {
          type: 'lines',
          mask: 'lines',
        }
      );

      gsap.set(split.lines, { yPercent: 100 });
      gsap.set(textElement, { autoAlpha: 0 });

      const imageElement = imageWrap.querySelector('img');
      if (imageElement) {
        gsap.set(imageElement, { opacity: 1 });
      }

      const onEnter = () => {
        gsap
          .timeline()
          .set(textElement, { autoAlpha: 1 })
          .to(split.lines, {
            yPercent: 0,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power3.out',
          });

        if (!imageElement) return;

        gsap.to(imageElement, {
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      const onLeave = () => {
        gsap.to(split.lines, {
          yPercent: 100,
          duration: 0.28,
          stagger: 0.03,
          ease: 'power2.in',
          onComplete: () => gsap.set(textElement, { autoAlpha: 0 }),
        });

        if (!imageElement) return;

        gsap.to(imageElement, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      imageWrap.addEventListener('mouseenter', onEnter);
      imageWrap.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        imageWrap.removeEventListener('mouseenter', onEnter);
        imageWrap.removeEventListener('mouseleave', onLeave);
        split.revert();
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [images]);

  return (
    <div
      className="relative w-screen overflow-hidden bg-black"
      style={{ height: '100svh' }}
    >
      <div ref={stripRef} className="absolute inset-0">
        {images.map((item, index) => (
          <div
            key={index}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={(element) => {
                textRefs.current[index] = element;
              }}
              className="absolute z-10 flex w-full flex-col gap-1.25"
              style={{
                bottom: 'calc(100% + 10px)',
                left: 0,
                padding: '0 0 4px',
                visibility: 'hidden',
              }}
            >
              <p
                data-number
                className="overflow-hidden text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-white/50"
              >
                {item.number}
              </p>
              <p
                data-title
                className="overflow-hidden text-[13px] font-extrabold uppercase leading-[1.15] tracking-[0.08em] text-white"
              >
                {item.title}
              </p>
              <p
                data-desc
                className="overflow-hidden text-[10px] font-normal leading-normal tracking-[0.04em] text-white/60"
              >
                {item.desc}
              </p>
            </div>

            <div
              ref={(element) => {
                imageWrapRefs.current[index] = element;
              }}
              className="relative cursor-pointer overflow-hidden"
              style={{
                width: cardWidthMin,
                height: cardHeightMax,
                willChange: 'width, height',
              }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                draggable={false}
                priority={index < 3}
                className="pointer-events-none select-none object-cover opacity-0"
                style={{
                  transform: 'none',
                  objectPosition: 'center bottom',
                  transition: 'none',
                  willChange: 'auto',
                }}
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 500px, 680px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
