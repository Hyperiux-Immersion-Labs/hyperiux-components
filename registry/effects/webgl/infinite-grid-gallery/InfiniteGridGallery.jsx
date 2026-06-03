"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import InfiniteGrid from"./InfiniteGrid";

export default function InfiniteGridGallery() {
 const imagesRef = useRef(null);
 const gridRef = useRef(null);

 const expandThumbsRef = useRef(null);
 const expandThumbRefs = useRef([]);
 const thumbClickIndexRef = useRef(null);

 const thumbDragRef = useRef({
 active: false,
 pointerId: null,
 startX: 0,
 startScrollLeft: 0,
 moved: false,
 });

 const [expanded, setExpanded] = useState(null);
 const [isClosing, setIsClosing] = useState(false);
 const [isOpening, setIsOpening] = useState(false);
 const [displayIndex, setDisplayIndex] = useState(null);
 const [slide, setSlide] = useState(null);
 const [isThumbDragging, setIsThumbDragging] = useState(false);

 const closeTimerRef = useRef(null);
 const slideTimerRef = useRef(null);

 const slideDurationMs = 600;
 const openCloseDurationMs = 750;
 const isAnimating = isOpening || isClosing || Boolean(slide);

 const overlayLayout = useMemo(() => ({ thumbsH: 156 }), []);

 const unsplashPool = useMemo(
 () => [
 {
 src:"/assets/gradient/image1.png",
 title:"Velora Drift",
 },
 {
 src:"/assets/gradient/image12.png",
 title:"Zentha Bloom",
 },
 {
 src:"/assets/gradient/image3.png",
 title:"Auralis Fade",
 },
 {
 src:"/assets/gradient/image14.png",
 title:"Nyxara Flow",
 },
 {
 src:"/assets/gradient/image5.png",
 title:"Solune Mist",
 },
 {
 src:"/assets/gradient/image9.png",
 title:"Cryon Pulse",
 },
 {
 src:"/assets/gradient/image6.png",
 title:"Luneth Glow",
 },
 {
 src:"/assets/gradient/image7.png",
 title:"Virel Shift",
 },
 {
 src:"/assets/gradient/image10.png",
 title:"Orvyn Haze",
 },
 {
 src:"/assets/gradient/image8.png",
 title:"Draxen Veil",
 },
 {
 src:"/assets/gradient/image11.png",
 title:"Kaelis Tone",
 },
 {
 src:"/assets/gradient/image2.png",
 title:"Myra Flux",
 },
 {
 src:"/assets/gradient/image13.png",
 title:"Zypher Blend",
 },
 {
 src:"/assets/gradient/image4.png",
 title:"Elyon Sweep",
 },
 {
 src:"/assets/gradient/image15.png",
 title:"Thyra Wave",
 },
 ],
 []
);

 const sources = useMemo(
 () =>
 Array.from({ length: 120 }, (_, i) => {
 const pick = unsplashPool[i % unsplashPool.length];

 return {
 src: pick.src,
 caption: (() => {
 // Deterministic"random" name per index (stable across reloads).
 const adjectives = [
"Silent",
"Soft",
"Luminous",
"Velvet",
"Electric",
"Drifting",
"Infinite",
"Neon",
"Golden",
"Hidden",
"Crystal",
"Midnight",
"Warm",
"Icy",
"Dusty",
"Liquid",
"Misty",
"Aurora",
"Calm",
"Vivid",
 ];

 const nouns = [
"Horizon",
"Gradient",
"Bloom",
"Echo",
"Field",
"Wave",
"Ridge",
"Atlas",
"Canvas",
"Spectrum",
"Orbit",
"Shoreline",
"Valley",
"Glade",
"Tide",
"Mirage",
"Pulse",
"Drift",
"Skylight",
"Cascade",
 ];

 const a = adjectives[i % adjectives.length];
 const b = nouns[(i * 7) % nouns.length];
 return `${a} ${b}`;
 })(),
 };
 }),
 [unsplashPool]
 );

 const data = useMemo(() => {
 const cols = 3;
 const rows = 3;

 const itemW = 400;
 const itemH = 270;
 const gap = 40;
 const startX = 71;
 const startY = 58;

 return Array.from({ length: cols * rows }, (_, i) => {
 const col = i % cols;
 const row = Math.floor(i / cols);

 return {
 x: startX + col * (itemW + gap),
 y: startY + row * (itemH + gap),
 w: itemW,
 h: itemH,
 };
 });
}, []);

 useEffect(() => {
 const el = imagesRef.current;
 if (!el) return;

 const setRvw = () => {
 document.documentElement.style.setProperty(
"--rvw",
 `${document.documentElement.clientWidth / 100}px`
 );
 };

 setRvw();
 window.addEventListener("resize", setRvw);

 gridRef.current = new InfiniteGrid({
 el,
 sources,
 data,
 originalSize: { w: 1422, h: 1006 },
 onItemClick: ({ index, rect }) => {
 const vw = window.innerWidth;
 const vh = window.innerHeight;
 const thumbsH = overlayLayout.thumbsH;

 const maxH = Math.max(240, vh - thumbsH - 36);
 const targetW = Math.round(vw * 0.7);
 const targetH = Math.round(Math.min(vh * 0.7, maxH * 0.98));

 const targetLeft = Math.round((vw - targetW) / 2);
 const targetTop = Math.round((maxH - targetH) / 2);

 setIsClosing(false);
 setIsOpening(true);
 setExpanded({
 index,
 rect,
 vw,
 vh,
 target: {
 left: targetLeft,
 top: targetTop,
 width: targetW,
 height: targetH,
 },
 thumbsH,
 });
 setDisplayIndex(index);
 setSlide(null);
 },
 });

 return () => {
 window.removeEventListener("resize", setRvw);
 gridRef.current?.destroy?.();
 gridRef.current = null;
 };
 }, [data, sources, overlayLayout.thumbsH]);

 const active = expanded ? sources[expanded.index] : null;
 const display = displayIndex === null ? null : sources[displayIndex];

 const centerActiveThumb = (index, behavior ="smooth") => {
 const container = expandThumbsRef.current;
 const activeThumb = expandThumbRefs.current[index];

 if (!container || !activeThumb) return;

 const left =
 activeThumb.offsetLeft -
 container.clientWidth / 2 +
 activeThumb.clientWidth / 2;

 container.scrollTo({ left, behavior });
 };

 const navigateTo = (nextIndex) => {
 if (!expanded) return;
 if (isAnimating) return;

 if (nextIndex === expanded.index) {
 centerActiveThumb(nextIndex,"smooth");
 return;
 }

 const n = sources.length;
 const currentIndex = expanded.index;
 const forward = (nextIndex - currentIndex + n) % n;
 const backward = (currentIndex - nextIndex + n) % n;
 const dir = forward <= backward ? 1 : -1;

 window.clearTimeout(slideTimerRef.current);

 setSlide({ from: currentIndex, to: nextIndex, dir });
 setExpanded((s) => (!s ? s : { ...s, index: nextIndex }));

 slideTimerRef.current = window.setTimeout(() => {
 setDisplayIndex(nextIndex);
 setSlide(null);
 }, slideDurationMs);
 };

 const closeExpanded = () => {
 if (!expanded || isClosing) return;

 setIsClosing(true);
 setIsOpening(false);
 setSlide(null);

 window.clearTimeout(closeTimerRef.current);
 closeTimerRef.current = window.setTimeout(() => {
 setExpanded(null);
 setIsClosing(false);
 setDisplayIndex(null);
 }, openCloseDurationMs);
 };

 useEffect(() => {
 gridRef.current?.setEnabled?.(!expanded);
 }, [expanded]);

 useEffect(() => {
 if (!expanded) return;

 const id = requestAnimationFrame(() => setIsOpening(false));
 return () => cancelAnimationFrame(id);
 }, [expanded]);

 useEffect(() => {
 if (!expanded) return;

 requestAnimationFrame(() => {
 centerActiveThumb(expanded.index,"smooth");
 });
 }, [expanded?.index]);

 useEffect(() => {
 return () => {
 window.clearTimeout(slideTimerRef.current);
 window.clearTimeout(closeTimerRef.current);
 };
 }, []);

 useEffect(() => {
 if (!expanded) return;

 const onKeyDown = (e) => {
 if (e.key ==="Escape") closeExpanded();

 if (e.key ==="ArrowLeft") {
 navigateTo((expanded.index - 1 + sources.length) % sources.length);
 }

 if (e.key ==="ArrowRight") {
 navigateTo((expanded.index + 1) % sources.length);
 }
 };

 window.addEventListener("keydown", onKeyDown);
 return () => window.removeEventListener("keydown", onKeyDown);
 }, [expanded, sources.length]);

 const onThumbPointerDown = (e) => {
 const container = expandThumbsRef.current;
 if (!container) return;

 const button = e.target.closest("[data-thumb-index]");

 thumbClickIndexRef.current = button
 ? Number(button.getAttribute("data-thumb-index"))
 : null;

 thumbDragRef.current.active = true;
 thumbDragRef.current.pointerId = e.pointerId;
 thumbDragRef.current.startX = e.clientX;
 thumbDragRef.current.startScrollLeft = container.scrollLeft;
 thumbDragRef.current.moved = false;

 setIsThumbDragging(true);
 container.setPointerCapture?.(e.pointerId);
 };

 const onThumbPointerMove = (e) => {
 if (!thumbDragRef.current.active) return;
 if (thumbDragRef.current.pointerId !== e.pointerId) return;

 const container = expandThumbsRef.current;
 if (!container) return;

 const dx = e.clientX - thumbDragRef.current.startX;

 if (!thumbDragRef.current.moved && Math.abs(dx) > 3) {
 thumbDragRef.current.moved = true;
 }

 container.scrollLeft = thumbDragRef.current.startScrollLeft - dx;
 };

 const endThumbDrag = (e) => {
 if (!thumbDragRef.current.active) return;
 if (thumbDragRef.current.pointerId !== e.pointerId) return;

 const container = expandThumbsRef.current;
 container?.releasePointerCapture?.(e.pointerId);

 const clickedIndex = thumbClickIndexRef.current;
 const wasDragged = thumbDragRef.current.moved;

 thumbDragRef.current.active = false;
 thumbDragRef.current.pointerId = null;
 thumbClickIndexRef.current = null;

 setIsThumbDragging(false);

 if (!wasDragged && Number.isInteger(clickedIndex)) {
 navigateTo(clickedIndex);
 }

 window.setTimeout(() => {
 thumbDragRef.current.moved = false;
 }, 0);
 };

 const onThumbWheel = (e) => {
 const container = expandThumbsRef.current;
 if (!container) return;

 e.preventDefault();
 container.scrollLeft += e.deltaX || e.deltaY;
 };

 return (
 <>
 <section className="infinite-grid-gallery-root h-screen w-full cursor-grab overflow-hidden bg-white font-mono text-black select-none">
 <div ref={imagesRef} className="infinite-grid-gallery-images relative inline-block h-full w-full overflow-hidden whitespace-nowrap bg-white" />

 {active && expanded && display ? (
 <div
 className={`fixed inset-0 z-60 cursor-default bg-white transition-opacity duration-750 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] ${
 isOpening ? "opacity-0" :""
 } ${isClosing ? "opacity-0" :""
 } ${!isOpening && !isClosing ? "opacity-100" :""}`}
 role="dialog"
 aria-modal="true"
 onMouseDown={() => closeExpanded()}
 >
 <div
 className="fixed inset-0 flex flex-col items-center justify-start"
 style={{
"--toX": `${expanded.target.left}px`,
"--toY": `${expanded.target.top}px`,
"--toW": expanded.target.width,
"--toH": expanded.target.height,
"--dx": `${expanded.rect.left - expanded.target.left}px`,
"--dy": `${expanded.rect.top - expanded.target.top}px`,
"--sx": expanded.rect.width / expanded.target.width,
"--sy": expanded.rect.height / expanded.target.height,
"--thumbsH": `${expanded.thumbsH}px`,
 }}
 >
 <div
 className={`absolute left-(--toX) top-(--toY) h-[calc(var(--toH)*1px)] w-[calc(var(--toW)*1px)] origin-top-left overflow-hidden bg-[rgba(0,0,0,0.06)] will-change-transform ${
 !isOpening && !isClosing
 ? "translate-x-0 translate-y-0 scale-x-100 scale-y-100"
 : ""
 } ${isClosing ? "infinite-grid-gallery-closing-media" : "infinite-grid-gallery-opening-media"}`}
 aria-hidden="true"
 onMouseDown={(e) => e.stopPropagation()}
 style={{
 transform: isOpening || isClosing
 ? "translate(var(--dx), var(--dy)) scale(var(--sx), var(--sy))"
 : undefined,
 transition: "transform 750ms cubic-bezier(0.785, 0.135, 0.15, 0.86)",
 }}
 >
 {slide ? (
 <>
 <img
 className={`absolute inset-0 block h-full w-full object-cover backface-hidden ${
 slide.dir > 0
 ? "infinite-grid-gallery-slide-left-from"
 : "infinite-grid-gallery-slide-right-from"
 }`}
 src={sources[slide.from].src}
 alt={sources[slide.from].caption}
 loading="eager"
 decoding="async"
 referrerPolicy="no-referrer"
 />

 <img
 className={`absolute inset-0 block h-full w-full object-cover backface-hidden ${
 slide.dir > 0
 ? "infinite-grid-gallery-slide-left-to"
 : "infinite-grid-gallery-slide-right-to"
 }`}
 src={sources[slide.to].src}
 alt={sources[slide.to].caption}
 loading="eager"
 decoding="async"
 referrerPolicy="no-referrer"
 />
 </>
 ) : (
 <img
 className="block h-full w-full object-cover"
 src={display.src}
 alt={display.caption}
 loading="eager"
 decoding="async"
 referrerPolicy="no-referrer"
 />
 )}
 </div>

 <button
 type="button"
 className="fixed left-[max(16px,calc(var(--toX)-72px))] top-[calc(var(--toY)+(var(--toH)*1px)/2)] z-4 grid h-13.5 w-13.5 -translate-y-1/2 place-items-center rounded-full border border-black/12 bg-white/90 text-[30px] leading-none text-black shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition-opacity disabled:cursor-not-allowed disabled:opacity-35 max-sm:left-3"
 onMouseDown={(e) => e.stopPropagation()}
 onClick={() =>
 navigateTo((expanded.index - 1 + sources.length) % sources.length)
 }
 aria-label="Previous"
 disabled={isAnimating}
 >
 ‹
 </button>

 <button
 type="button"
 className="fixed right-[max(16px,calc(100vw-(var(--toX)+var(--toW)*1px)-72px))] top-[calc(var(--toY)+(var(--toH)*1px)/2)] z-4 grid h-13.5 w-13.5 -translate-y-1/2 place-items-center rounded-full border border-black/12 bg-white/90 text-[30px] leading-none text-black shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition-opacity disabled:cursor-not-allowed disabled:opacity-35 max-sm:right-3"
 onMouseDown={(e) => e.stopPropagation()}
 onClick={() => navigateTo((expanded.index + 1) % sources.length)}
 aria-label="Next"
 disabled={isAnimating}
 >
 ›
 </button>

 <div
 className="fixed inset-x-0 bottom-0 grid h-(--thumbsH) grid-cols-1 items-center gap-3 bg-white px-3.5 pb-3.5 max-sm:px-2.5 max-sm:pb-2.5"
 aria-label="All images"
 onMouseDown={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-center pt-2.5" aria-hidden="true">
 <h2 className="mt-[-5%] max-w-[min(860px,calc(100vw-40px))] overflow-hidden text-ellipsis whitespace-nowrap px-0 py-1.5 text-center text-[30px] font-medium leading-[1.1] tracking-tighter text-black/92 select-none">
 {display.caption}
 </h2>
 </div>
 <div
 className={`relative w-full overflow-hidden border-t border-black/12 pt-3 select-none ${
 isThumbDragging ? "cursor-grabbing" :"cursor-grab"
 }`}
 onPointerDown={onThumbPointerDown}
 onPointerMove={onThumbPointerMove}
 onPointerUp={endThumbDrag}
 onPointerCancel={endThumbDrag}
 onPointerLeave={endThumbDrag}
 onWheel={onThumbWheel}
 >
 <div
 ref={expandThumbsRef}
 className={`flex overflow-x-auto overflow-y-hidden px-1 scrollbar-none [-ms-overflow-style:none] overscroll-x-contain [touch-action:pan-x] ${
 isThumbDragging ? "cursor-grabbing scroll-auto" :"cursor-grab scroll-smooth"
 }`}
 style={{ gap: "10px" }}
 role="list"
 aria-label="All images"
 >
 {sources.map((item, idx) => {
 const isActive = idx === expanded.index;

 return (
 <button
 key={`${idx}-${item.src}`}
 type="button"
 role="listitem"
 data-thumb-index={idx}
 className={`box-border h-17.5 w-22.5 shrink-0 overflow-hidden border-2 bg-black/4 p-0 transition-[border-color,transform] duration-200 ease-[ease] hover:-translate-y-px hover:border-black/35 max-sm:h-12 max-sm:w-18 ${
 isActive ? "border-black" :"border-transparent"
 }`}
 ref={(el) => {
 expandThumbRefs.current[idx] = el;
 }}
 aria-label={`Open ${item.caption}`}
 >
 <img
 className={`block h-full w-full object-cover transition-[filter] duration-300 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] ${
 isActive ? "brightness-105" :"brightness-[0.8]"
 }`}
 src={item.src}
 alt={item.caption}
 loading="lazy"
 decoding="async"
 referrerPolicy="no-referrer"
 />
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : null}
 </section>

 <style jsx global>{`
 html.dragging .infinite-grid-gallery-root {
   cursor: grabbing;
 }

 .infinite-grid-gallery-images .item {
   position: absolute;
   top: 0;
   left: 0;
   will-change: transform;
   white-space: normal;
 }

 .infinite-grid-gallery-images .item-wrapper {
   position: relative;
   height: 100%;
   width: 100%;
   will-change: transform;
 }

 .infinite-grid-gallery-images .item-image {
   overflow: hidden;
   border: 1px solid rgba(0, 0, 0, 0.12);
   background: #ffffff;
   transform-origin: 50% 50%;
   transition:
     box-shadow 350ms cubic-bezier(0.785, 0.135, 0.15, 0.86),
     transform 350ms cubic-bezier(0.785, 0.135, 0.15, 0.86);
 }

 .infinite-grid-gallery-images .item:hover .item-image {
   box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12);
   transform: scale(1.015);
 }

 .infinite-grid-gallery-images .item:hover {
   z-index: 2;
 }

 .infinite-grid-gallery-images .item-image img {
   width: 100%;
   height: 100%;
   overflow: hidden;
   object-fit: cover;
   will-change: transform;
 }

 .infinite-grid-gallery-images .caption {
   position: absolute;
   right: 0;
   bottom: 0;
   left: 0;
   display: block;
   width: 100%;
   height: auto;
   padding: 10px;
   font-size: 15px;
   line-height: 1.2;
   letter-spacing: -0.04em;
   opacity: 0;
   white-space: normal;
   user-select: none;
   color: #ffffff;
   background: rgba(255, 255, 255, 0.38);
   backdrop-filter: blur(5px);
   border: 1px solid rgba(0, 0, 0, 0.08);
   transform: translateY(12px);
   transition:
     opacity 350ms cubic-bezier(0.785, 0.135, 0.15, 0.86),
     transform 350ms cubic-bezier(0.785, 0.135, 0.15, 0.86);
   pointer-events: none;
 }

 .infinite-grid-gallery-images .item:hover .caption {
   opacity: 1;
   transform: translateY(0);
 }

 .infinite-grid-gallery-opening-media {
   transform: translate(var(--dx), var(--dy)) scale(var(--sx), var(--sy));
 }

 .infinite-grid-gallery-closing-media {
   transform: translate(var(--dx), var(--dy)) scale(var(--sx), var(--sy));
   transition-duration: 750ms;
 }

 .infinite-grid-gallery-slide-left-from {
   animation: infinite-grid-gallery-slide-from-left 600ms ease-in-out forwards;
 }

 .infinite-grid-gallery-slide-left-to {
   animation: infinite-grid-gallery-slide-to-left 600ms ease-in-out forwards;
 }

 .infinite-grid-gallery-slide-right-from {
   animation: infinite-grid-gallery-slide-from-right 600ms ease-in-out forwards;
 }

 .infinite-grid-gallery-slide-right-to {
   animation: infinite-grid-gallery-slide-to-right 600ms ease-in-out forwards;
 }

 @keyframes infinite-grid-gallery-slide-from-left {
   from {
     transform: translate3d(0%, 0, 0);
   }
   to {
     transform: translate3d(-100%, 0, 0);
   }
 }

 @keyframes infinite-grid-gallery-slide-to-left {
   from {
     transform: translate3d(100%, 0, 0);
   }
   to {
     transform: translate3d(0%, 0, 0);
   }
 }

 @keyframes infinite-grid-gallery-slide-from-right {
   from {
     transform: translate3d(0%, 0, 0);
   }
   to {
     transform: translate3d(100%, 0, 0);
   }
 }

 @keyframes infinite-grid-gallery-slide-to-right {
   from {
     transform: translate3d(-100%, 0, 0);
   }
   to {
     transform: translate3d(0%, 0, 0);
   }
 }
 `}</style>
 </>
 );
}
