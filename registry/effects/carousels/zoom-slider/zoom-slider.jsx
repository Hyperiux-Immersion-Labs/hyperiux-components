'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Image from 'next/image';

gsap.registerPlugin(SplitText);

const SCROLL_PER_PX = 1.0;
const LERP_FACTOR = 0.08;
const MOBILE_BREAKPOINT = 640;

const lerp = (a, b, n) => a + (b - a) * n;

export function ZoomSlider({ images = [] }) {
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const textRefs = useRef([]);

  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;

  const CARD_W_MIN = isMobile ? 75 : 190;
  const CARD_W_MAX = isMobile ? 260 : 680;

  const CARD_H_MAX = isMobile
    ? Math.round(viewportHeight * 0.60)
    : Math.round(viewportHeight * 0.82);

  const CARD_H_MIN = isMobile ? 80 : 50;
  const cardStep = CARD_W_MAX;

  const stateRef = useRef({
    current: 0,
    target: 0,
    raf: null,
    isDragging: false,
    lastX: 0,
  });

  useEffect(() => {
    const update = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const positionCards = useCallback(
    (offset) => {
      if (!stripRef.current) return;
      const cards = Array.from(stripRef.current.children);
      const count = images.length;
      if (!count) return;
      const loopWidth = count * cardStep;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const BOTTOM = vh - 16;

      const E = 2 * vw;
      const mapVtoX = (v) => {
        if (v <= 0) return 0;
        if (v >= E) return v - E / 2;
        return (v * v) / (2 * E);
      };

      const norm = ((offset % loopWidth) + loopWidth) % loopWidth;
      const startIdx = Math.floor(norm / cardStep);
      const frac = (norm % cardStep) / cardStep;

      for (let j = 0; j < count; j++) {
        const i = (startIdx + j) % count;
        const v = (j - frac) * cardStep;
        const currentX = mapVtoX(v);
        const nextX = mapVtoX(v + cardStep);
        const visualW = nextX - currentX;
        const scale = visualW / CARD_W_MAX;
        const h = CARD_H_MIN + scale * (CARD_H_MAX - CARD_H_MIN);
        const y = BOTTOM - h;

        cards[i].style.transform = `translate(${currentX}px, ${y}px)`;

        const imgWrap = imageWrapRefs.current[i];
        if (imgWrap) {
          imgWrap.style.width = `${visualW}px`;
          imgWrap.style.height = `${h}px`;
        }
      }
    },
    [cardStep, CARD_W_MAX, CARD_H_MAX, CARD_H_MIN, images.length]
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

    const onWheel = (e) => { state.target -= e.deltaY * SCROLL_PER_PX; };
    const onMouseDown = (e) => { state.isDragging = true; state.lastX = e.clientX; };
    const onMouseMove = (e) => {
      if (!state.isDragging) return;
      state.target += -(e.clientX - state.lastX);
      state.lastX = e.clientX;
    };
    const onMouseUp = () => { state.isDragging = false; };
    const onTouchStart = (e) => { state.isDragging = true; state.lastX = e.touches[0].clientX; };
    const onTouchMove = (e) => {
      if (!state.isDragging) return;
      state.target += -(e.touches[0].clientX - state.lastX);
      state.lastX = e.touches[0].clientX;
    };
    const onTouchEnd = () => { state.isDragging = false; };

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

    cardRefs.current.forEach((card, i) => {
      const textEl = textRefs.current[i];
      const imgWrap = imageWrapRefs.current[i];
      if (!card || !textEl || !imgWrap) return;

      const number = textEl.querySelector('[data-number]');
      const title = textEl.querySelector('[data-title]');
      const desc = textEl.querySelector('[data-desc]');
      if (!number || !title || !desc) return;

      const split = SplitText.create([number, title, desc], {
        type: 'lines',
        mask: 'lines',
      });

      gsap.set(split.lines, { yPercent: 100 });
      gsap.set(textEl, { autoAlpha: 0 });

      const imgEl = imgWrap.querySelector('img');

      const enter = () => {
        gsap.timeline()
          .set(textEl, { autoAlpha: 1 })
          .to(split.lines, {
            yPercent: 0,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power3.out',
          });

        if (imgEl) {
          gsap.to(imgEl, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
        }
      };

      const leave = () => {
        gsap.to(split.lines, {
          yPercent: 100,
          duration: 0.28,
          stagger: 0.03,
          ease: 'power2.in',
          onComplete: () => gsap.set(textEl, { autoAlpha: 0 }),
        });

        if (imgEl) {
          gsap.to(imgEl, { scale: 1, duration: 0.6, ease: 'power2.out' });
        }
      };

      imgWrap.addEventListener('mouseenter', enter);
      imgWrap.addEventListener('mouseleave', leave);

      cleanups.push(() => {
        imgWrap.removeEventListener('mouseenter', enter);
        imgWrap.removeEventListener('mouseleave', leave);
        split.revert();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [images]);

  return (
    <div
      className="relative w-screen overflow-hidden bg-black"
      style={{ height: '100svh' }}
    >
      <div ref={stripRef} className="absolute inset-0">
        {images.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute top-0 left-0"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={(el) => (textRefs.current[i] = el)}
              className="absolute w-full z-10"
              style={{
                bottom: 'calc(100% + 10px)',
                left: 0,
                padding: '0 0 4px',
                visibility: 'hidden',
              }}
            >
              <p
                data-number
                className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-[5px] leading-none overflow-hidden"
              >
                {item.number}
              </p>
              <p
                data-title
                className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-white mb-[5px] leading-[1.15] overflow-hidden"
              >
                {item.title}
              </p>
              <p
                data-desc
                className="text-[10px] font-normal text-white/60 tracking-[0.04em] leading-[1.5] overflow-hidden"
              >
                {item.desc}
              </p>
            </div>

            <div
              ref={(el) => (imageWrapRefs.current[i] = el)}
              className="relative overflow-hidden cursor-pointer"
              style={{
                width: CARD_W_MIN,
                height: CARD_H_MAX,
                willChange: 'width, height',
              }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                draggable={false}
                priority={i < 3}
                className="object-cover pointer-events-none select-none"
                style={{
                  transform: 'none',
                  objectPosition: 'center bottom',
                  transition: 'none',
                  willChange: 'auto',
                }}
                sizes="(max-width: 640px) 260px, 680px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
