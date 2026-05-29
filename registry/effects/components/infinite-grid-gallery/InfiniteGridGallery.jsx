"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import InfiniteGrid from"./InfiniteGrid";
import styles from"./InfiniteGridGallery.module.css";

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
 <section className={styles.root}>
 <div ref={imagesRef} className={styles.images} />

 {active && expanded && display ? (
 <div
 className={`${styles.expandBackdrop} ${
 isOpening ? styles.expandOpening :""
 } ${isClosing ? styles.expandClosing :""}`}
 role="dialog"
 aria-modal="true"
 onMouseDown={() => closeExpanded()}
 >
 <div
 className={styles.expandStage}
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
 className={styles.expandMedia}
 aria-hidden="true"
 onMouseDown={(e) => e.stopPropagation()}
 >
 {slide ? (
 <>
 <img
 className={`${styles.expandImage} ${
 styles.expandImageFrom
 } ${
 slide.dir > 0
 ? styles.expandSlideLeft
 : styles.expandSlideRight
 }`}
 src={sources[slide.from].src}
 alt={sources[slide.from].caption}
 loading="eager"
 decoding="async"
 referrerPolicy="no-referrer"
 />

 <img
 className={`${styles.expandImage} ${styles.expandImageTo} ${
 slide.dir > 0
 ? styles.expandSlideLeft
 : styles.expandSlideRight
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
 className={styles.expandImage}
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
 className={`${styles.expandNav} ${styles.expandNavPrev}`}
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
 className={`${styles.expandNav} ${styles.expandNavNext}`}
 onMouseDown={(e) => e.stopPropagation()}
 onClick={() => navigateTo((expanded.index + 1) % sources.length)}
 aria-label="Next"
 disabled={isAnimating}
 >
 ›
 </button>

 <div
 className={styles.expandBottom}
 aria-label="All images"
 onMouseDown={(e) => e.stopPropagation()}
 >
 <div className={styles.expandMeta} aria-hidden="true">
 <h2 className={styles.expandCaption}>{display.caption}</h2>
 </div>
 <div
 className={`${styles.expandThumbsWrap} ${
 isThumbDragging ? styles.expandThumbsWrapDragging :""
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
 className={styles.expandThumbs}
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
 className={`${styles.expandThumb} ${
 isActive ? styles.expandThumbActive :""
 }`}
 ref={(el) => {
 expandThumbRefs.current[idx] = el;
 }}
 aria-label={`Open ${item.caption}`}
 >
 <img
 className={styles.expandThumbImg}
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
 );
}
