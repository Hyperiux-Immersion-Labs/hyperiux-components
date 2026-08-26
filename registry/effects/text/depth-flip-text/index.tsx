// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Ref } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface DepthFlipTextProps {
  phrases?: string[];
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  loop?: boolean;
  holdDuration?: number;
  transitionDuration?: number;
  charStagger?: number;
  useOpacityTransition?: boolean;
  scrub?: boolean;
  scrollStart?: string;
  scrollEnd?: string;
}

const DEFAULT_PHRASES = [
  "Hyperiux Vault ships faster",
  "Premium UI for modern teams",
  "Built to launch beautifully",
];

const LINE_HEIGHT = 0.9;

const CHAR_PERSPECTIVE = 1200;

const FLIP_EASE = "power4.inOut";

const DepthFlipText = ({
  phrases = DEFAULT_PHRASES,
  className = "",
  backgroundColor = "#f6f5f2",
  textColor = "#050505",
  loop = false,
  holdDuration = 0.4,
  transitionDuration = 1.4,
  charStagger = 0.02,
  useOpacityTransition = false,
  scrub = false,
  scrollStart = "top 80%",
  scrollEnd = "bottom 20%",
}: DepthFlipTextProps) => {
  const normalizedPhrases = useMemo(
    () => phrases.map((phrase) => phrase.trim()).filter(Boolean),
    [phrases],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLParagraphElement>(null);
  const nextRef = useRef<HTMLParagraphElement>(null);

  // Splitting against a fallback font would measure the wrong face height and
  // reflow once the real font lands, so stay hidden until the font is in.
  useEffect(() => {
    let cancelled = false;
    const ready = document.fonts?.ready ?? Promise.resolve();

    ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayIndex = scrub ? 0 : activeIndex;
  const isLast = displayIndex >= normalizedPhrases.length - 1;
  const hasNext = normalizedPhrases.length > 1 && (!isLast || (!scrub && loop));
  const nextIndex = isLast ? 0 : displayIndex + 1;
  const currentPhrase = normalizedPhrases[displayIndex] ?? "";
  const nextPhrase = hasNext ? (normalizedPhrases[nextIndex] ?? "") : "";

  useGSAP(
    () => {
      const currentEl = currentRef.current;
      const nextEl = nextRef.current;
      if (!fontsReady || !currentEl || !nextEl) return;

      const currentSplit = SplitText.create(currentEl, { type: "words, chars" });
      const nextSplit = SplitText.create(nextEl, { type: "words, chars" });
      const cleanup = () => {
        currentSplit.revert();
        nextSplit.revert();
      };

      const prefersReduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // The crossfade rides on the characters, never on the paragraph — an
      // opacity below 1 on the paragraph would flatten its 3D children.
      gsap.set([currentEl, nextEl], { opacity: 1 });

      if (prefersReduced) {
        gsap.set(currentSplit.chars, {
          clearProps: "transform,transformOrigin,transformPerspective,backfaceVisibility,opacity",
        });
        gsap.set(nextSplit.chars, {
          clearProps: "transform,transformOrigin,transformPerspective,backfaceVisibility,opacity",
        });
        gsap.set(nextEl, { opacity: hasNext ? 0 : 1 });

        if (!hasNext) return cleanup;

        gsap
          .timeline({
            delay: scrub ? 0 : holdDuration,
            onComplete: scrub ? undefined : () => setActiveIndex(nextIndex),
            scrollTrigger: scrub
              ? {
                  trigger: containerRef.current,
                  start: scrollStart,
                  end: scrollEnd,
                  scrub: true,
                }
              : undefined,
          })
          .to(
            currentEl,
            {
              opacity: 0,
              duration: transitionDuration,
              ease: "power2.out",
            },
            0,
          )
          .to(
            nextEl,
            {
              opacity: 1,
              duration: transitionDuration,
              ease: "power2.out",
            },
            0,
          );

        return cleanup;
      }

      if (!hasNext || !currentSplit.chars.length) {
        gsap.set(nextSplit.chars, { opacity: 0 });
        return cleanup;
      }

      // Rotating about an axis half a line-height BEHIND the glyph is what
      // kills the shift: at rotationX 0 the transform resolves to plain
      // identity, so the outgoing face starts, and the incoming face ends,
      // exactly on their own layout box. Measured per cycle in px because
      // GSAP reads the z-origin with a bare parseFloat.
      const faceOffset = (currentSplit.chars[0] as HTMLElement).offsetHeight / 2;
      const faceProps = {
        transformOrigin: `50% 50% ${-faceOffset}px`,
        transformPerspective: CHAR_PERSPECTIVE,
        backfaceVisibility: "hidden" as const,
        force3D: true,
      };

      gsap.set(currentSplit.chars, { ...faceProps, rotationX: 0, opacity: 1 });
      gsap.set(nextSplit.chars, {
        ...faceProps,
        rotationX: -90,
        opacity: useOpacityTransition ? 0 : 1,
      });
      const advance = () => setActiveIndex(nextIndex);

      gsap
        .timeline({
          delay: scrub ? 0 : holdDuration,
          onComplete: scrub ? undefined : advance,
          scrollTrigger: scrub
            ? {
                trigger: containerRef.current,
                start: scrollStart,
                end: scrollEnd,
                scrub: true,
              }
            : undefined,
        })
        .to(
          currentSplit.chars,
          {
            rotationX: 90,
            opacity: useOpacityTransition ? 0 : 1,
            duration: transitionDuration,
            ease: FLIP_EASE,
            stagger: charStagger,
          },
          0,
        )
        .to(
          nextSplit.chars,
          {
            rotationX: 0,
            opacity: 1,
            duration: transitionDuration,
            ease: FLIP_EASE,
            stagger: charStagger,
          },
          0,
        );

      return cleanup;
    },
    {
      scope: containerRef,
      // Each cycle re-splits fresh paragraphs, so the previous cycle's splits
      // and inline styles have to be reverted rather than accumulated.
      revertOnUpdate: true,
      dependencies: [
        activeIndex,
        nextIndex,
        hasNext,
        fontsReady,
        currentPhrase,
        nextPhrase,
        scrub,
        scrollStart,
        scrollEnd,
        holdDuration,
        transitionDuration,
        charStagger,
        useOpacityTransition,
      ],
    },
  );

  return (
    <section
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 ${className}`}
      style={{ backgroundColor }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/35"
      />
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[1400px] max-md:min-h-[18vw]"
        style={{ opacity: fontsReady ? 1 : 0 }}
      >
        <Phrase
          key={`current-${activeIndex}`}
          ref={currentRef}
          text={currentPhrase}
          tone={textColor}
        />
        <Phrase
          key={`next-${nextIndex}`}
          ref={nextRef}
          text={nextPhrase}
          tone={textColor}
          secondary
        />
      </div>
    </section>
  );
};

interface PhraseProps {
  ref: Ref<HTMLParagraphElement>;
  text: string;
  tone: string;
  secondary?: boolean;
}

const Phrase = ({ ref, text, tone, secondary = false }: PhraseProps) => (
  <p
    ref={ref}
    className={`m-0 w-full whitespace-nowrap max-md:whitespace-normal text-center  text-[6vw] max-md:text-[10vw] max-[1025px]:text-[8vw] font-medium text-white! tracking-[-0.08em]  ${secondary ? "absolute inset-0 opacity-0" : "relative"}`}
    style={{ color: tone, lineHeight: LINE_HEIGHT }}
  >
    {text}
  </p>
);

export default DepthFlipText;
