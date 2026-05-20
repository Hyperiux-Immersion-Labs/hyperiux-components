"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function NavigationButtons({ onPrev, onNext, isAnimating }) {
  return (
    <nav className="flex gap-1.5">
      <button
        aria-label="Previous testimonial"
        onClick={onPrev}
        disabled={isAnimating}
        className="relative flex h-11 w-11 items-center justify-center overflow-hidden border border-black/18 bg-transparent text-base disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowLeft
          size={16}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:left-[-15]"
        />
      </button>
      <button
        aria-label="Next testimonial"
        onClick={onNext}
        disabled={isAnimating}
        className="relative flex h-11 w-11 items-center justify-center overflow-hidden border border-black/18 bg-transparent text-base disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowRight size={16} />
      </button>
    </nav>
  );
}

export default function TestimonialSwiper({ testimonials = [], bgColor = "#ffffff" }) {
  const [current, setCurrent] = useState(0);
  const [displayItem, setDisplayItem] = useState(testimonials[0] ?? null);
  const [isAnimating, setIsAnimating] = useState(false);
  const quoteRef = useRef(null);
  const quoteMarkRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const mobileNameRef = useRef(null);
  const mobileTitleRef = useRef(null);
  const desktopImageRef = useRef(null);
  const mobileImageRef = useRef(null);
  const splitRef = useRef(null);
  const prevCurrentRef = useRef(null);
  const pendingDirectionRef = useRef("next");
  const isAnimatingRef = useRef(false);

  const total = testimonials.length;
  const pad = (value) => String(value).padStart(2, "0");

  const animateIn = useCallback((direction) => {
    const yFrom = direction === "next" ? 110 : -110;

    if (splitRef.current) {
      splitRef.current.revert();
      splitRef.current = null;
    }

    gsap.set(quoteRef.current, { autoAlpha: 1 });

    splitRef.current = new SplitText(quoteRef.current, {
      type: "lines",
      linesClass: "split-line",
    });

    const lines = splitRef.current.lines;
    lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.style.display = "block";
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set(lines, { yPercent: yFrom });
    gsap.set(
      [
        desktopImageRef.current,
        mobileImageRef.current,
        nameRef.current,
        titleRef.current,
        mobileNameRef.current,
        mobileTitleRef.current,
        quoteMarkRef.current,
      ],
      { autoAlpha: 0 }
    );

    gsap
      .timeline({
        onComplete: () => {
          setIsAnimating(false);
          isAnimatingRef.current = false;
        },
      })
      .to(lines, {
        yPercent: 0,
        duration: 0.85,
        ease: "power2.out",
        stagger: {
          each: 0.15,
          from: direction === "next" ? "start" : "end",
        },
      })
      .to(
        [
          desktopImageRef.current,
          mobileImageRef.current,
          nameRef.current,
          titleRef.current,
          mobileNameRef.current,
          mobileTitleRef.current,
          quoteMarkRef.current,
        ],
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.15,
        },
        "<0.5"
      );
  }, []);

  const fadeOutCurrent = useCallback(
    () =>
      new Promise((resolve) => {
        gsap.to(
          [
            quoteRef.current,
            nameRef.current,
            titleRef.current,
            mobileNameRef.current,
            mobileTitleRef.current,
            quoteMarkRef.current,
            desktopImageRef.current,
            mobileImageRef.current,
          ],
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: resolve,
          }
        );
      }),
    []
  );

  const updateSlide = useCallback(
    async (direction) => {
      if (isAnimatingRef.current || total === 0) return;
      isAnimatingRef.current = true;
      setIsAnimating(true);
      await fadeOutCurrent();

      const nextIndex =
        direction === "next" ? (current + 1) % total : (current - 1 + total) % total;

      pendingDirectionRef.current = direction;

      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }

      setDisplayItem(testimonials[nextIndex]);
      setCurrent(nextIndex);
    },
    [current, fadeOutCurrent, testimonials, total]
  );

  useEffect(() => {
    if (quoteRef.current) animateIn("next");
  }, [animateIn]);

  useEffect(() => {
    if (prevCurrentRef.current === null) {
      prevCurrentRef.current = current;
      return;
    }
    if (prevCurrentRef.current !== current) {
      prevCurrentRef.current = current;
      animateIn(pendingDirectionRef.current);
    }
  }, [animateIn, current]);

  if (!testimonials.length || !displayItem) return null;

  return (
    <section
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-white py-5 text-black max-sm:min-h-[80vh]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between px-8 py-5 max-sm:px-5 max-sm:py-3">
        <div className="flex w-[30%] items-center justify-between max-sm:w-full">
          <div className="flex items-center gap-2 text-[0.8vw] font-semibold uppercase tracking-[0.12em] max-sm:text-[4vw]">
            <span className="text-[9px] max-sm:text-[15px]">◆</span>
            <span>Client Stories</span>
          </div>
          <span className="text-[13px] text-neutral-700 max-sm:hidden">
            {pad(current + 1)} / {pad(total)}
          </span>
        </div>

        <div className="max-sm:hidden">
          <NavigationButtons
            onPrev={() => updateSlide("prev")}
            onNext={() => updateSlide("next")}
            isAnimating={isAnimating}
          />
        </div>
      </div>

      <div className="flex flex-1 items-start gap-32 px-18 py-5 max-md:flex-col max-md:gap-8 max-md:px-6 max-md:py-10 max-sm:gap-6 max-sm:px-5 max-sm:py-4">
        <div className="shrink-0 max-sm:hidden">
          <div ref={desktopImageRef} className="relative h-50 w-40">
            <Image
              src={displayItem.image}
              alt={displayItem.name}
              fill
              className="object-cover object-top grayscale"
            />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col">
          <span
            ref={quoteMarkRef}
            className="absolute -top-1.5 text-[48px] font-bold leading-none max-md:text-[36px] max-sm:relative max-sm:top-0 max-sm:mb-2 max-sm:text-[40px]"
          >
            "
          </span>

          <div className="flex w-[95%] flex-col pl-13 max-sm:w-full max-sm:pl-0">
            <blockquote
              ref={quoteRef}
              className="mb-10 text-[4vw] leading-[1.1] max-sm:mb-6 max-sm:text-[7.5vw]"
            >
              {displayItem.quote}
            </blockquote>

            <div className="mt-6 hidden items-center gap-4 max-sm:flex max-sm:gap-6">
              <div ref={mobileImageRef} className="relative h-26 w-22 shrink-0">
                <Image
                  src={displayItem.image}
                  alt={displayItem.name}
                  fill
                  className="object-cover object-top grayscale"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p ref={mobileNameRef} className="m-0 text-xl font-normal">
                  {displayItem.name}
                </p>
                <p ref={mobileTitleRef} className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#888]">
                  {displayItem.title}
                </p>
              </div>
            </div>

            <div className="mt-10 max-sm:hidden">
              <p ref={nameRef} className="text-2xl">
                {displayItem.name}
              </p>
              <p ref={titleRef} className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
                {displayItem.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 sm:hidden">
        <NavigationButtons
          onPrev={() => updateSlide("prev")}
          onNext={() => updateSlide("next")}
          isAnimating={isAnimating}
        />
      </div>
    </section>
  );
}
