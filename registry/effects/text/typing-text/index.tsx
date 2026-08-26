// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type TypingVariant = "sequential" | "cascade" | "loop";
type CursorStyle = "bar" | "square" | "triangle" | "underscore" | "dot";
type TextAlign = "left" | "center" | "right";
type TypingDirection = "left-to-right" | "right-to-left";

type TypingTextProps = {
  lines?: string[];
  variant?: TypingVariant;
  textColor?: string;
  cursorColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: CSSProperties["fontWeight"];
  lineHeight?: number;
  letterSpacing?: number;
  charactersPerSecond?: number;
  animationDuration?: number;
  lineDelay?: number;
  holdDuration?: number;
  blur?: number;
  rotate?: number;
  scale?: number;
  perspective?: number;
  typingDirection?: TypingDirection;
  cursorWidth?: number;
  cursorStyle?: CursorStyle;
  textAlign?: TextAlign;
  maxWidth?: number;
  showCursor?: boolean;
  className?: string;
};

type TypingLineStyle = CSSProperties & {
  "--typing-target-width": string;
  "--typing-steps": number;
  "--typing-duration": string;
  "--typing-delay": string;
  "--typing-loop-duration": string;
  "--typing-step": string;
  "--typing-char-animation": string;
  "--typing-cursor-animation": string;
  "--typing-cursor-color": string;
  "--typing-cursor-width": string;
  "--typing-blur": string;
  "--typing-rotate": string;
  "--typing-scale": number;
};

const DEFAULT_LINES = [
  "Opening the vault handshake...",
  "Verifying encrypted component keys.",
  "Loading protected motion presets.",
  "Vault access granted. Hyperiux assets are ready.",
];

function getAlignmentClass(textAlign: TextAlign) {
  if (textAlign === "center") return "items-center text-center";
  if (textAlign === "right") return "items-end text-right";
  return "items-start text-left";
}

export default function TypingText({
  lines = DEFAULT_LINES,
  variant = "sequential",
  textColor = "#d8d8d8",
  cursorColor = "#f59e0b",
  backgroundColor = "#121212",
  fontSize = 2.4,
  fontWeight = 500,
  lineHeight = 1.55,
  letterSpacing = 0,
  charactersPerSecond = 18,
  animationDuration = 1,
  lineDelay = 0.5,
  holdDuration = 1.4,
  blur = 0,
  rotate = 0,
  scale = 1,
  perspective = 800,
  typingDirection = "left-to-right",
  cursorWidth = 3,
  cursorStyle = "bar",
  textAlign = "left",
  maxWidth = 80,
  showCursor = true,
  className = "",
}: TypingTextProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const preparedLines = useMemo(
    () => lines.map((line) => ({ text: line, chars: Math.max(Array.from(line).length, 1) })),
    [lines]
  );
  const animationKey = [
    variant,
    charactersPerSecond,
    animationDuration,
    lineDelay,
    holdDuration,
    blur,
    rotate,
    scale,
    perspective,
    typingDirection,
  ].join("-");

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    setPrefersReducedMotion(mediaQuery.matches);

    const onReduceMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.("change", onReduceMotionChange);

    return () => {
      mediaQuery.removeEventListener?.("change", onReduceMotionChange);
    };
  }, []);

  let elapsed = 0;

  return (
    <section
      className={`typing-text-root relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24 ${className}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div
        className={`relative z-10 flex w-full flex-col ${getAlignmentClass(textAlign)}`}
        style={{ maxWidth: `${maxWidth}vw`, perspective: `${perspective}px` }}
        aria-label={preparedLines.map((line) => line.text).join(" ")}
      >
        {preparedLines.map((line, index) => {
          const typingDuration = Math.max(
            0.35,
            (line.chars / Math.max(charactersPerSecond, 1)) * Math.max(animationDuration, 0.1)
          );
          const delay =
            variant === "sequential"
              ? elapsed
              : index * Math.max(lineDelay, 0);
          const loopDuration = Math.max(typingDuration * 2 + holdDuration, 2.4);

          if (variant === "sequential") {
            elapsed += typingDuration + Math.max(lineDelay, 0);
          }

          const lineStyle: TypingLineStyle = {
            "--typing-target-width": `${line.chars}ch`,
            "--typing-steps": line.chars,
            "--typing-duration": `${typingDuration}s`,
            "--typing-delay": `${delay}s`,
            "--typing-loop-duration": `${loopDuration}s`,
            "--typing-step": `${typingDuration / line.chars}s`,
            "--typing-char-animation": prefersReducedMotion
              ? "none"
              : variant === "loop"
                ? "typing-text-char-loop var(--typing-loop-duration) linear infinite forwards"
                : "typing-text-char-in 1ms linear forwards",
            "--typing-cursor-animation": prefersReducedMotion
              ? "none"
              : variant === "loop"
                ? "typing-text-cursor 820ms steps(1, end) var(--typing-delay) infinite both"
                : "typing-text-cursor-finish var(--typing-duration) linear var(--typing-delay) both",
            "--typing-cursor-color": cursorColor,
            "--typing-cursor-width": `${cursorWidth}px`,
            "--typing-blur": `${blur}px`,
            "--typing-rotate": `${rotate}deg`,
            "--typing-scale": scale,
            color: textColor,
            fontSize: `clamp(1.2rem, ${fontSize}vw, 5rem)`,
            fontWeight,
            lineHeight,
            letterSpacing: `${letterSpacing}em`,
            direction: typingDirection === "right-to-left" ? "rtl" : "ltr",
            textAlign: typingDirection === "right-to-left" ? "right" : "left",
            transformOrigin: typingDirection === "right-to-left" ? "right center" : "left center",
            width: prefersReducedMotion ? "auto" : undefined,
            maxWidth: prefersReducedMotion ? "100%" : undefined,
            animation: prefersReducedMotion
              ? "none"
              : variant === "loop"
                ? "typing-text-loop var(--typing-loop-duration) steps(var(--typing-steps), end) var(--typing-delay) infinite both"
                : "typing-text-write var(--typing-duration) steps(var(--typing-steps), end) var(--typing-delay) both",
          };

          return (
            <span
              key={`${animationKey}-${line.text}-${index}`}
              aria-hidden="true"
              data-cursor-style={showCursor ? cursorStyle : undefined}
              data-typing-direction={typingDirection}
              data-typing-variant={variant}
              className="typing-text-line mb-2 block max-w-full whitespace-nowrap font-mono will-change-[width,opacity]"
              style={lineStyle}
            >
              <span className="typing-text-content block max-w-full overflow-hidden">
                {Array.from(line.text).map((character, characterIndex) => (
                  <span
                    key={`${characterIndex}-${character}`}
                    className="typing-text-char"
                    style={{ "--char-index": characterIndex } as CSSProperties}
                  >
                    {character}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </div>

      <style>{`
        .typing-text-root {
          isolation: isolate;
        }

        .typing-text-line {
          position: relative;
          width: 0;
          opacity: 0;
          transition:
            color 240ms ease,
            background-color 240ms ease;
        }

        .typing-text-line[data-cursor-style]::after,
        .typing-text-line[data-cursor-style] .typing-text-char::before {
          position: absolute;
          inset-block-start: 50%;
          width: var(--typing-cursor-width);
          height: 1em;
          background: var(--typing-cursor-color);
          opacity: 0;
          translate: 0 -50%;
          transform-origin: center;
          transition:
            background-color 240ms ease,
            border-color 240ms ease,
            border-radius 240ms ease,
            clip-path 240ms ease,
            height 240ms ease,
            opacity 180ms ease,
            transform 240ms ease,
            width 240ms ease;
        }

        .typing-text-line[data-cursor-style]::after {
          content: "";
          inset-inline-start: calc(100% + 0.16em);
          animation: var(--typing-cursor-animation);
        }

        .typing-text-line[data-typing-direction="right-to-left"]::after {
          inset-inline: auto calc(100% + 0.16em);
        }

        .typing-text-line[data-cursor-style="square"]::after,
        .typing-text-line[data-cursor-style="square"] .typing-text-char::before {
          width: 0.58em;
          height: 0.58em;
        }

        .typing-text-line[data-cursor-style="triangle"]::after,
        .typing-text-line[data-cursor-style="triangle"] .typing-text-char::before {
          width: 0.64em;
          height: 0.64em;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }

        .typing-text-line[data-typing-direction="right-to-left"][data-cursor-style="triangle"]::after,
        .typing-text-line[data-typing-direction="right-to-left"][data-cursor-style="triangle"] .typing-text-char::before {
          transform: scaleX(-1);
        }

        .typing-text-line[data-cursor-style="dot"]::after,
        .typing-text-line[data-cursor-style="dot"] .typing-text-char::before {
          width: 0.38em;
          height: 0.38em;
          border-radius: 999px;
        }

        .typing-text-line[data-cursor-style="underscore"]::after,
        .typing-text-line[data-cursor-style="underscore"] .typing-text-char::before {
          inset-block-start: auto;
          inset-block-end: 0.16em;
          width: 0.72em;
          height: var(--typing-cursor-width);
          translate: 0 0;
        }

        @keyframes typing-text-write {
          0% {
            width: 0;
            opacity: 0;
            filter: blur(var(--typing-blur));
            transform: rotateX(var(--typing-rotate)) scale(var(--typing-scale));
          }

          1% {
            opacity: 1;
          }

          99.9% {
            opacity: 1;
          }

          100% {
            width: min(var(--typing-target-width), 100%);
            opacity: 1;
            filter: blur(0);
            transform: rotateX(0deg) scale(1);
          }
        }

        @keyframes typing-text-loop {
          0% {
            width: 0;
            opacity: 0;
            filter: blur(var(--typing-blur));
            transform: rotateX(var(--typing-rotate)) scale(var(--typing-scale));
          }

          6% {
            opacity: 1;
          }

          46%,
          72% {
            width: min(var(--typing-target-width), 100%);
            opacity: 1;
            filter: blur(0);
            transform: rotateX(0deg) scale(1);
          }

          100% {
            width: 0;
            opacity: 0;
            filter: blur(var(--typing-blur));
            transform: rotateX(var(--typing-rotate)) scale(var(--typing-scale));
          }
        }

        @keyframes typing-text-cursor {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }

        @keyframes typing-text-cursor-finish {
          0%,
          99.8% {
            opacity: 1;
          }

          99.9%,
          100% {
            opacity: 0;
          }
        }

        @keyframes typing-text-fade-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .typing-text-line {
            width: auto !important;
            max-width: 100%;
            opacity: 0;
            animation: typing-text-fade-in 0.4s ease-out forwards !important;
          }

          .typing-text-line::after {
            opacity: 0 !important;
          }
        }

        @keyframes typing-text-char-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes typing-text-caret {
          0%,
          99.9% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes typing-text-char-loop {
          0%,
          62% {
            opacity: 1;
          }

          62.01%,
          100% {
            opacity: 0;
          }
        }

        @keyframes typing-text-settle {
          0% {
            opacity: 1;
            filter: blur(var(--typing-blur));
            transform: rotateX(var(--typing-rotate)) scale(var(--typing-scale));
          }

          100% {
            opacity: 1;
            filter: blur(0);
            transform: rotateX(0deg) scale(1);
          }
        }

        @media (max-width: 640px) {
          .typing-text-line {
            width: auto !important;
            max-width: 100%;
            white-space: normal !important;
            overflow-wrap: break-word;
            opacity: 1;
            animation: typing-text-settle var(--typing-duration) linear var(--typing-delay) both !important;
          }

          .typing-text-content {
            display: inline !important;
            overflow: visible !important;
          }

          .typing-text-char {
            position: relative;
            opacity: 0;
            animation: var(--typing-char-animation);
            animation-delay: calc(var(--typing-delay) + var(--char-index) * var(--typing-step));
          }

          .typing-text-line[data-cursor-style] .typing-text-char::before {
            content: "";
            inset-inline-start: auto;
            inset-inline-end: calc(100% + 0.16em);
            animation: typing-text-caret var(--typing-step) linear forwards;
            animation-delay: calc(var(--typing-delay) + (var(--char-index) - 1) * var(--typing-step));
          }

          .typing-text-line[data-cursor-style] .typing-text-char:first-child::before {
            animation-duration: var(--typing-delay);
            animation-delay: 0s;
          }

          .typing-text-line:not([data-typing-variant="loop"])[data-cursor-style]::after {
            content: none;
          }

          .typing-text-line[data-typing-variant="loop"][data-cursor-style]::after {
            position: static;
            display: inline-block;
            translate: none;
            margin-inline-start: 0.16em;
            vertical-align: -0.1em;
            animation-delay: calc(var(--typing-delay) + var(--typing-duration));
            animation-fill-mode: forwards;
          }
        }

        @media (max-width: 640px) and (prefers-reduced-motion: reduce) {
          .typing-text-line {
            opacity: 1 !important;
            animation: none !important;
          }

          .typing-text-char {
            opacity: 1;
            animation: none;
          }

          .typing-text-char::before {
            content: none;
          }
        }
      `}</style>
    </section>
  );
}
