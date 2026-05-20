"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import gsap from"gsap";
import { Draggable } from"gsap/Draggable";
import { InertiaPlugin } from"gsap/InertiaPlugin";
import"./InfiniteCarousel.css";

gsap.registerPlugin(Draggable, InertiaPlugin);

function horizontalLoop(items, config = {}) {
 items[0].getBoundingClientRect();

 const tl = gsap.timeline({
 repeat: config.repeat,
 paused: true,
 defaults: { ease:"none" },
 onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
 });

 const length = items.length;
 const startX = items[0].offsetLeft;
 const times = [];
 const widths = [];
 const xPercents = [];
 let curIndex = 0;

 const pixelsPerSecond = (config.speed || 1) * 100;
 const snap =
 config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);

 const populateWidths = () =>
 items.forEach((el, i) => {
 widths[i] = parseFloat(gsap.getProperty(el,"width","px"));
 xPercents[i] = snap(
 (parseFloat(gsap.getProperty(el,"x","px")) / widths[i]) * 100 +
 gsap.getProperty(el,"xPercent")
 );
 });

 const getTotalWidth = () =>
 items[length - 1].offsetLeft +
 (xPercents[length - 1] / 100) * widths[length - 1] -
 startX +
 items[length - 1].offsetWidth *
 gsap.getProperty(items[length - 1],"scaleX") +
 (parseFloat(config.paddingRight) || 0);

 populateWidths();
 if (!widths[0]) return null;

 gsap.set(items, { xPercent: (i) => xPercents[i] });
 gsap.set(items, { x: 0 });

 const totalWidth = getTotalWidth();

 for (let i = 0; i < length; i++) {
 const item = items[i];
 const curX = (xPercents[i] / 100) * widths[i];
 const distanceToStart = item.offsetLeft + curX - startX;
 const distanceToLoop =
 distanceToStart + widths[i] * gsap.getProperty(item,"scaleX");

 tl.to(
 item,
 {
 xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
 duration: distanceToLoop / pixelsPerSecond,
 },
 0
 )
 .fromTo(
 item,
 {
 xPercent: snap(
 ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
 ),
 },
 {
 xPercent: xPercents[i],
 duration:
 (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
 immediateRender: false,
 },
 distanceToLoop / pixelsPerSecond
 )
 .add("label" + i, distanceToStart / pixelsPerSecond);

 times[i] = distanceToStart / pixelsPerSecond;
 }

 function toIndex(index, vars = {}) {
 if (Math.abs(index - curIndex) > length / 2) {
 index += index > curIndex ? -length : length;
 }

 const newIndex = gsap.utils.wrap(0, length, index);
 let time = times[newIndex];

 if (time > tl.time() !== index > curIndex) {
 vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
 time += tl.duration() * (index > curIndex ? 1 : -1);
 }

 curIndex = newIndex;
 vars.overwrite = true;
 return tl.tweenTo(time, vars);
 }

 tl.next = (vars) => toIndex(curIndex + 1, vars);
 tl.previous = (vars) => toIndex(curIndex - 1, vars);
 tl.current = () => curIndex;
 tl.toIndex = (index, vars) => toIndex(index, vars);
 tl.updateIndex = () => {
 curIndex = Math.round(tl.progress() * length);
 };
 tl.times = times;

 tl.progress(1, true).progress(0, true);

 if (config.reversed) {
 tl.vars.onReverseComplete();
 tl.reverse();
 }

 if (config.draggable) {
 const proxy = document.createElement("div");
 const wrap = gsap.utils.wrap(0, 1);

 let ratio;
 let startProgress;
 let draggableInst;
 let dragSnap;
 let roundFactor;

 const align = () => {
 tl.progress(
 wrap(startProgress + (draggableInst.startX - draggableInst.x) * ratio)
 );
 };

 const syncIndex = () => tl.updateIndex();

 draggableInst = Draggable.create(proxy, {
 trigger: config.wrapperEl,
 type:"x",
 onPress() {
 startProgress = tl.progress();
 tl.progress(0);
 populateWidths();
 const totalWidthCache = getTotalWidth();
 ratio = 1 / totalWidthCache;
 dragSnap = totalWidthCache / length;
 roundFactor = Math.pow(
 10,
 ((dragSnap +"").split(".")[1] ||"").length
 );
 tl.progress(startProgress);
 },
 onDrag: align,
 onThrowUpdate: align,
 inertia: true,
 snap: (value) => {
 const n =
 Math.round(parseFloat(value) / dragSnap) * dragSnap * roundFactor;
 return (n - (n % 1)) / roundFactor;
 },
 onRelease: syncIndex,
 onThrowComplete: () => {
 gsap.set(proxy, { x: 0 });
 syncIndex();
 },
 })[0];

 tl.draggable = draggableInst;
 }

 return tl;
}

export default function HorizontalCarousel({
 children,
 draggable = true,
 speed = 1,
 showNav = true,
 prevLabel ="← Prev",
 nextLabel ="Next →",

 pageStyle = {},
 controlsStyle = {},
 prevBtnStyle = {},
 nextBtnStyle = {},
 wrapperStyle = {},
 itemStyle = {},

 pageClassName ="",
 controlsClassName ="",
 prevBtnClassName ="",
 nextBtnClassName ="",
 wrapperClassName ="",
 itemClassName ="",

 mobileBreakpoint = 768,
 mobileMode ="swiper",
}) {
 const wrapperRef = useRef(null);
 const itemRefs = useRef([]);
 const loopRef = useRef(null);
 const attemptsRef = useRef(0);
 const mobileCardRefs = useRef([]);
 const isAdjustingScrollRef = useRef(false);

 const [isMobile, setIsMobile] = useState(false);

 const childArray = useMemo(() => {
 return Array.isArray(children)
 ? children.flat().filter(Boolean)
 : children
 ? [children]
 : [];
 }, [children]);

 const isWrapMode = isMobile && mobileMode ==="wrap";
 const isSwiperMode = isMobile && mobileMode ==="swiper";

 const mobileLoopItems = useMemo(() => {
 if (!isSwiperMode) return childArray;
 return [...childArray, ...childArray, ...childArray];
 }, [childArray, isSwiperMode]);

 useEffect(() => {
 const checkMode = () => {
 setIsMobile(window.innerWidth <= mobileBreakpoint);
 };

 checkMode();
 window.addEventListener("resize", checkMode);

 return () => window.removeEventListener("resize", checkMode);
 }, [mobileBreakpoint]);

 useEffect(() => {
 itemRefs.current = itemRefs.current.slice(0, childArray.length);
 mobileCardRefs.current = mobileCardRefs.current.slice(0, mobileLoopItems.length);
 }, [childArray.length, mobileLoopItems.length]);

 useEffect(() => {
 loopRef.current?.draggable?.kill();
 loopRef.current?.kill();
 loopRef.current = null;

 if (!childArray.length) return;
 if (isMobile) return;

 attemptsRef.current = 0;

 function tryInit() {
 const items = itemRefs.current.filter(Boolean);
 if (!items.length || !wrapperRef.current) return;

 const loop = horizontalLoop(items, {
 speed,
 draggable,
 wrapperEl: wrapperRef.current,
 });

 if (!loop) {
 if (attemptsRef.current < 10) {
 attemptsRef.current += 1;
 requestAnimationFrame(tryInit);
 }
 return;
 }

 loopRef.current = loop;
 }

 const raf = requestAnimationFrame(tryInit);

 return () => {
 cancelAnimationFrame(raf);
 loopRef.current?.draggable?.kill();
 loopRef.current?.kill();
 loopRef.current = null;
 attemptsRef.current = 0;
 };
 }, [childArray.length, draggable, speed, isMobile]);

 useEffect(() => {
 if (!isSwiperMode || !wrapperRef.current || !childArray.length) return;

 const wrapper = wrapperRef.current;

 const setInitialScroll = () => {
 const firstMiddleItem = mobileCardRefs.current[childArray.length];
 if (!firstMiddleItem) return;

 isAdjustingScrollRef.current = true;
 wrapper.scrollLeft = firstMiddleItem.offsetLeft;
 requestAnimationFrame(() => {
 isAdjustingScrollRef.current = false;
 });
 };

 const raf = requestAnimationFrame(setInitialScroll);
 return () => cancelAnimationFrame(raf);
 }, [isSwiperMode, childArray.length]);

 useEffect(() => {
 if (!isSwiperMode || !wrapperRef.current || !childArray.length) return;

 const wrapper = wrapperRef.current;

 const handleScroll = () => {
 if (isAdjustingScrollRef.current) return;

 const oneSetWidth =
 wrapper.scrollWidth / 3;

 const leftBoundary = oneSetWidth * 0.5;
 const rightBoundary = oneSetWidth * 1.5;

 if (wrapper.scrollLeft < leftBoundary) {
 isAdjustingScrollRef.current = true;
 wrapper.scrollLeft += oneSetWidth;
 requestAnimationFrame(() => {
 isAdjustingScrollRef.current = false;
 });
 } else if (wrapper.scrollLeft > rightBoundary) {
 isAdjustingScrollRef.current = true;
 wrapper.scrollLeft -= oneSetWidth;
 requestAnimationFrame(() => {
 isAdjustingScrollRef.current = false;
 });
 }
 };

 wrapper.addEventListener("scroll", handleScroll, { passive: true });
 return () => wrapper.removeEventListener("scroll", handleScroll);
 }, [isSwiperMode, childArray.length]);

 const getMobileStepAmount = () => {
 const wrapper = wrapperRef.current;
 const firstItem = mobileCardRefs.current[childArray.length] || mobileCardRefs.current[0];

 if (!wrapper || !firstItem) return 0;

 const styles = getComputedStyle(wrapper);
 const gap =
 parseFloat(styles.columnGap) ||
 parseFloat(styles.gap) ||
 0;

 return firstItem.offsetWidth + gap;
 };

 const scrollMobileByCard = (direction) => {
 if (!wrapperRef.current) return;

 const amount = getMobileStepAmount();
 if (!amount) return;

 wrapperRef.current.scrollBy({
 left: direction * amount,
 behavior:"smooth",
 });
 };

 const handleNext = () => {
 if (isSwiperMode) {
 scrollMobileByCard(1);
 return;
 }

 if (isWrapMode) return;

 loopRef.current?.next({ duration: 0.4, ease:"power1.inOut" });
 };

 const handlePrev = () => {
 if (isSwiperMode) {
 scrollMobileByCard(-1);
 return;
 }

 if (isWrapMode) return;

 loopRef.current?.previous({ duration: 0.4, ease:"power1.inOut" });
 };

 return (
 <div className={`hc-page ${pageClassName}`} style={pageStyle}>
 {showNav && !isWrapMode && (
 <div
 className={`hc-controls ${controlsClassName}`}
 style={controlsStyle}
 >
 <button
 className={`hc-btn ${prevBtnClassName}`}
 style={prevBtnStyle}
 onClick={handlePrev}
 type="button"
 >
 {prevLabel}
 </button>

 <button
 className={`hc-btn ${nextBtnClassName}`}
 style={nextBtnStyle}
 onClick={handleNext}
 type="button"
 >
 {nextLabel}
 </button>
 </div>
 )}

 <div
 ref={wrapperRef}
 className={`hc-wrapper ${wrapperClassName} ${
 isWrapMode ?"is-wrapped" :""
 } ${isSwiperMode ?"is-swiper" :""}`}
 style={wrapperStyle}
 >
 {(isSwiperMode ? mobileLoopItems : childArray).map((child, i) => {
 const realIndex = childArray.length ? i % childArray.length : i;

 return (
 <div
 key={`${realIndex}-${i}`}
 ref={(el) => {
 if (isSwiperMode) {
 mobileCardRefs.current[i] = el;
 } else {
 itemRefs.current[i] = el;
 }
 }}
 className={`hc-item ${itemClassName}`}
 style={itemStyle}
 aria-hidden={isSwiperMode && (i < childArray.length || i >= childArray.length * 2)}
 >
 {child}
 </div>
 );
 })}
 </div>
 </div>
 );
}