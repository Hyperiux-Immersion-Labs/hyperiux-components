// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

const FOCUS_EASE = CustomEase.create("focusTextEase", "0.16,1,0.3,1");

interface FocusTextProps {
  text?: string;
  className?: string;
  fontSize?: number;
  characterStagger?: number;
  revealDuration?: number;
  startScale?: number;
  blurAmount?: number;
  holdDuration?: number;
  loop?: boolean;
  scrub?: boolean;
  scrollStart?: string;
  scrollEnd?: string;
  backgroundColor?: string;
  textColor?: string;
  showReplayButton?: boolean;
}

const DEFAULT_TEXT =
  "Built for seamless interactions.\nDesigned with thoughtful motion.\nMade to feel unforgettable.";
const DEFAULT_CHARACTER_STAGGER = 0.05;
const REDUCED_MOTION_DURATION = 0.3;

export default function FocusText({
  text = DEFAULT_TEXT,
  className = "",
  fontSize = 4.5,
  characterStagger = DEFAULT_CHARACTER_STAGGER,
  revealDuration = 3.2,
  startScale = 0.4,
  blurAmount = 18,
  holdDuration = 1.2,
  loop = false,
  scrub = false,
  scrollStart = "top 80%",
  scrollEnd = "bottom 20%",
  backgroundColor = "#000000",
  textColor = "#ffffff",
  showReplayButton = true,
}: FocusTextProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const lines = useMemo(
    () =>
      text.split("\n").map((line) => {
        const words = line.split(" ");

        return words.map((word) => Array.from(word));
      }),
    [text],
  );

  const totalCharacterCount = useMemo(
    () =>
      lines.reduce(
        (lineTotal, words) =>
          lineTotal + words.reduce((wordTotal, word) => wordTotal + word.length, 0),
        0,
      ),
    [lines],
  );

  const totalRevealDuration = useMemo(
    () => revealDuration + DEFAULT_CHARACTER_STAGGER * Math.max(totalCharacterCount - 1, 0),
    [revealDuration, totalCharacterCount],
  );

  const effectiveRevealDuration = useMemo(
    () =>
      Math.max(
        0.12,
        totalRevealDuration - characterStagger * Math.max(totalCharacterCount - 1, 0),
      ),
    [characterStagger, totalCharacterCount, totalRevealDuration],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const characters = Array.from(
        section.querySelectorAll<HTMLElement>("[data-focus-char]"),
      );
      if (!characters.length) return;

      // The heading renders at opacity 0 to avoid a flash of unstyled
      // characters before GSAP applies the from-state.
      gsap.set(section.querySelector("[data-focus-heading]"), { opacity: 1 });

      if (prefersReducedMotion) {
        // No scale, no blur, no per-character stagger, no loop and never
        // tied to scroll position - just a short fade to the final state.
        tweenRef.current = gsap.fromTo(
          characters,
          { opacity: 0 },
          {
            opacity: 1,
            duration: REDUCED_MOTION_DURATION,
            ease: "none",
            onStart: () => setIsPlaying(true),
            onComplete: () => setIsPlaying(false),
          },
        );

        return;
      }

      tweenRef.current = gsap.fromTo(
        characters,
        {
          opacity: 0,
          scale: startScale,
          filter: `blur(${blurAmount}px)`,
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: effectiveRevealDuration,
          stagger: characterStagger,
          ease: FOCUS_EASE,
          // Scrubbing hands playback to the scroll position, so looping and
          // the hold between cycles no longer apply.
          repeat: !scrub && loop ? -1 : 0,
          repeatDelay: holdDuration,
          onStart: () => setIsPlaying(true),
          onRepeat: () => setIsPlaying(true),
          onComplete: () => setIsPlaying(false),
          scrollTrigger: scrub
            ? {
                trigger: section,
                start: scrollStart,
                end: scrollEnd,
                scrub: true,
              }
            : undefined,
        },
      );
    }, section);

    return () => {
      ctx.revert();
      tweenRef.current = null;
    };
  }, [
    lines,
    characterStagger,
    effectiveRevealDuration,
    startScale,
    blurAmount,
    holdDuration,
    loop,
    scrub,
    scrollStart,
    scrollEnd,
  ]);

  const handleReplay = () => {
    tweenRef.current?.restart(false, false);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-screen w-full items-center overflow-hidden px-6 ${className}`}
      style={{
        backgroundColor,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h1
        data-focus-heading
        className="m-0 w-full font-sans font-black uppercase leading-none tracking-tight opacity-0"
        style={{
          fontSize: `clamp(2rem, ${fontSize}vw, 8rem)`,
          color: textColor,
        }}
      >
        {lines.map((words, lineIndex) => (
          <span key={`line-${lineIndex}`} className="block">
            {words.map((word, wordIndex) => (
              <span key={`line-${lineIndex}-word-${wordIndex}`}>
                <span className="inline-block whitespace-nowrap">
                  {word.map((character, charIndex) => (
                    <span
                      key={`${lineIndex}-${wordIndex}-${charIndex}`}
                      data-focus-char
                      className="inline-block"
                      style={{
                        willChange: "transform, filter, opacity",
                        transformOrigin: "50% 50%",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {character}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 ? (
                  <span aria-hidden="true" className="whitespace-pre">
                    {" "}
                  </span>
                ) : null}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {showReplayButton && !scrub && (
        <button
          type="button"
          onClick={handleReplay}
          className="absolute inset-x-0 bottom-8 mx-auto inline-flex w-fit items-center justify-center rounded-full border border-white/20 bg-white/8 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition hover:border-white/40 hover:bg-white/14"
        >
          Replay animation
        </button>
      )}
    </section>
  );
}
