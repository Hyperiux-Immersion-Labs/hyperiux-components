"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const DEFAULT_IMAGE_Z_INDEX = 10;
const HIGHLIGHT_ANIMATION_DURATION = 0.4;
const HIGHLIGHT_FADE_DURATION = 0.3;
const IMAGE_REVEAL_DURATION = 0.6;
const IMAGE_HIDE_DURATION = 1;
const IMAGE_OFFSET_MULTIPLIER = 20;
const ROW_TEXT_ANIMATION_DURATION = 0.3;
const ACTIVE_ROW_TEXT_COLOR = "#000000";
const INACTIVE_ROW_TEXT_COLOR = "#ffffff";
const IMAGE_HIDDEN_CLIP_PATH = "inset(50%)";
const IMAGE_VISIBLE_CLIP_PATH = "inset(0%)";
const IMAGE_VISIBILITY_HIDDEN = "hidden";
const IMAGE_VISIBILITY_VISIBLE = "visible";
const ITEM_LABEL_START_CODE = 97;

const getItemLabel = (index) => `(${String.fromCharCode(ITEM_LABEL_START_CODE + index)}.)`;

export default function ListHover({ items }) {
  const imageRefs = useRef([]);
  const imageContainerRef = useRef(null);
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
  const rowRefs = useRef({});
  const pendingLeaveRef = useRef({});
  const tweenGenerationRef = useRef({});
  const activeIndexRef = useRef(null);
  const zIndexRef = useRef(DEFAULT_IMAGE_Z_INDEX);

  useEffect(() => {
    // Initial visual state
    imageRefs.current.forEach((imageElement) => {
      if (!imageElement) return;

      gsap.set(imageElement, {
        clipPath: IMAGE_HIDDEN_CLIP_PATH,
        visibility: IMAGE_VISIBILITY_HIDDEN,
      });
    });

    if (!highlightRef.current) return;

    gsap.set(highlightRef.current, {
      opacity: 0,
      y: 0,
      height: 0,
    });
  }, []);

  const getNextTweenGeneration = (index) => {
    tweenGenerationRef.current[index] = (tweenGenerationRef.current[index] || 0) + 1;
    return tweenGenerationRef.current[index];
  };

  const setImageRef = (index, element) => {
    imageRefs.current[index] = element;
  };

  const setRowTextColor = (index, color) => {
    const rowElement = rowRefs.current[index];
    if (!rowElement) return;

    gsap.to(rowElement.querySelectorAll("td"), {
      color,
      duration: ROW_TEXT_ANIMATION_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const moveHighlightToRow = (rowElement) => {
    const tableElement = tableRef.current;
    const highlightElement = highlightRef.current;
    if (!tableElement || !highlightElement || !rowElement) return;

    const tableBounds = tableElement.getBoundingClientRect();
    const rowBounds = rowElement.getBoundingClientRect();

    gsap.to(highlightElement, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      opacity: 1,
      duration: HIGHLIGHT_ANIMATION_DURATION,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const animateImageOut = (index) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    const tweenGeneration = getNextTweenGeneration(index);

    gsap.killTweensOf(imageElement);
    gsap.to(imageElement, {
      clipPath: IMAGE_HIDDEN_CLIP_PATH,
      opacity: 0,
      duration: IMAGE_HIDE_DURATION,
      ease: "power3.inOut",
      onComplete: () => {
        if (tweenGenerationRef.current[index] !== tweenGeneration) return;

        gsap.set(imageElement, { visibility: IMAGE_VISIBILITY_HIDDEN });
      },
    });
  };

  const onRowEnter = (rowElement, index) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    pendingLeaveRef.current[index] = false;
    rowRefs.current[index] = rowElement;
    zIndexRef.current += 1;

    const tweenGeneration = getNextTweenGeneration(index);

    gsap.killTweensOf(imageElement);
    gsap.set(imageElement, {
      zIndex: zIndexRef.current,
      visibility: IMAGE_VISIBILITY_VISIBLE,
      clipPath: IMAGE_HIDDEN_CLIP_PATH,
      opacity: 1,
    });

    gsap.to(imageElement, {
      clipPath: IMAGE_VISIBLE_CLIP_PATH,
      opacity: 1,
      duration: IMAGE_REVEAL_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        if (tweenGenerationRef.current[index] !== tweenGeneration) return;
        if (!pendingLeaveRef.current[index]) return;

        pendingLeaveRef.current[index] = false;
        animateImageOut(index);
      },
    });

    if (activeIndexRef.current !== null && activeIndexRef.current !== index) {
      setRowTextColor(activeIndexRef.current, INACTIVE_ROW_TEXT_COLOR);
    }

    activeIndexRef.current = index;
    setRowTextColor(index, ACTIVE_ROW_TEXT_COLOR);
    moveHighlightToRow(rowElement);
  };

  const onRowLeave = (index) => {
    const imageElement = imageRefs.current[index];
    if (!imageElement) return;

    if (gsap.isTweening(imageElement)) {
      pendingLeaveRef.current[index] = true;
      return;
    }

    animateImageOut(index);
  };

  const onTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, INACTIVE_ROW_TEXT_COLOR);
      activeIndexRef.current = null;
    }

    if (!highlightRef.current) return;

    gsap.to(highlightRef.current, {
      opacity: 0,
      duration: HIGHLIGHT_FADE_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onMouseMove = (event) => {
    if (!imageContainerRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(imageContainerRef.current, {
      x: x * IMAGE_OFFSET_MULTIPLIER,
      y: y * IMAGE_OFFSET_MULTIPLIER,
      duration: HIGHLIGHT_ANIMATION_DURATION,
      ease: "power2.out",
    });
  };

  return (
    <>
      <div
        className="relative min-h-[50vh] w-full overflow-hidden bg-neutral-900 font-mono text-white max-md:hidden"
        onMouseMove={onMouseMove}
      >
        <div
          ref={highlightRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-white"
        />

        <div
          ref={imageContainerRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ mixBlendMode: "difference" }}
        >
          {items.map((item, index) => (
            <div
              key={`${item.client}-${index}`}
              ref={(element) => setImageRef(index, element)}
              className="absolute top-1/2 left-[30vw] h-90 w-78 -translate-y-1/2 invisible"
              style={{ willChange: "clip-path, opacity", zIndex: DEFAULT_IMAGE_Z_INDEX }}
            >
              <Image src={item.img} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>

        <div
          ref={tableRef}
          className="relative w-full"
          onMouseLeave={onTableLeave}
        >
          <table className="relative z-30 w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-1/7" />
              <col className="w-1/7" />
              <col className="w-1/3" />
              <col className="w-1/9" />
              <col className="w-130!" />
              <col />
            </colgroup>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={`${item.client}-${index}`}
                  onMouseEnter={(event) => onRowEnter(event.currentTarget, index)}
                  onMouseLeave={() => onRowLeave(index)}
                  className="cursor-pointer"
                >
                  <td className="whitespace-nowrap px-6 py-3 text-xs uppercase tracking-widest">
                    {item.client}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-xs uppercase tracking-widest">
                    {item.platform}
                  </td>
                  <td className="py-3" />
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-white/40">
                    {getItemLabel(index)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-left text-xs">
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

      <div className="hidden w-full bg-neutral-900 font-mono text-white max-md:block">
        {items.map((item, index) => (
          <div
            key={`${item.client}-${index}`}
            className="flex border-b border-white/10"
          >
            <div className="flex w-1/2 flex-col justify-between gap-3 p-4">
              <div className="flex flex-col gap-1">
                <p className="font-bold uppercase tracking-widest max-sm:text-sm max-md:text-xl">
                  {item.client}
                </p>
                {item.platform && (
                  <p className="uppercase tracking-widest text-white/60 max-sm:text-xs max-md:text-lg">
                    {item.platform}
                  </p>
                )}
                <p className="leading-relaxed text-white/50 max-sm:text-xs max-md:text-base">
                  {item.services}
                </p>
              </div>
              <p className="text-white/30 max-sm:text-xs">{getItemLabel(index)}</p>
            </div>

            <div className="relative aspect-3/4 h-full w-1/2 max-md:h-[30vh]">
              <Image
                src={item.img}
                alt={item.client}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
