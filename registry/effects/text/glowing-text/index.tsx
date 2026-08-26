// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useMemo, type CSSProperties } from "react";

type GlowingTextProps = {
  eyebrow?: string;
  text?: string;
  textColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  glowIntensity?: number;
  characterStagger?: number;
  revealDuration?: number;
  lineGap?: number;
  className?: string;
};

type CharStyle = CSSProperties & {
  "--char-delay": string;
  "--char-duration": string;
};

type Token = { text: string; isSpace: boolean; start: number };

const DEFAULT_EYEBROW = "VAULT TRANSMISSION";
const DEFAULT_TEXT =
  "Connection established with Hyperiux Vault,\nDecrypting premium component signatures,\nMotion presets verified and ready to ship,\nWelcome in. Build something that glows.";
const SETTLED_WEIGHT = 300;

function withAlpha(color: string, alpha: number) {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const red = Number.parseInt(color.slice(1, 3), 16);
    const green = Number.parseInt(color.slice(3, 5), 16);
    const blue = Number.parseInt(color.slice(5, 7), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return color;
}

function tokenizeWithOffsets(value: string): Token[] {
  const matches = value.match(/\s+|\S+/g) ?? [];
  let offset = 0;

  return matches.map((text) => {
    const start = offset;
    offset += Array.from(text).length;
    return { text, isSpace: /^\s/.test(text), start };
  });
}

export default function GlowingText({
  eyebrow = DEFAULT_EYEBROW,
  text = DEFAULT_TEXT,
  textColor = "#d8d8d8",
  glowColor = "#ffffff",
  backgroundColor = "#0b0d0e",
  fontSize = 2.2,
  letterSpacing = 0.08,
  lineHeight = 1.55,
  glowIntensity = 0.7,
  characterStagger = 0.045,
  revealDuration = 0.5,
  lineGap = 0.15,
  className = "",
}: GlowingTextProps) {
  const glowSoft = withAlpha(glowColor, Math.min(0.48, glowIntensity * 0.48));
  const glowHard = withAlpha(glowColor, Math.min(0.9, glowIntensity * 0.9));
  const dimEnd = withAlpha(textColor, 0.4);
  const stagger = Math.max(characterStagger, 0.01);
  const duration = Math.max(revealDuration, 0.1);

  const eyebrowTokens = useMemo(() => tokenizeWithOffsets(eyebrow), [eyebrow]);
  const lineTokens = useMemo(() => text.split("\n").map(tokenizeWithOffsets), [text]);

  const lineCharDelays = useMemo(() => {
    let elapsed = 0;

    return lineTokens.map((tokens) => {
      const charCount = tokens.reduce((total, token) => total + Array.from(token.text).length, 0);
      const delays = Array.from({ length: charCount }, (_, index) => elapsed + index * stagger);
      const lineDuration = charCount > 0 ? (charCount - 1) * stagger + duration : 0;
      elapsed += lineDuration + Math.max(lineGap, 0);
      return delays;
    });
  }, [lineTokens, stagger, duration, lineGap]);

  const renderTokens = (tokens: Token[], keyPrefix: string, delayFor: (charIndex: number) => number) =>
    tokens.map((token, tokenIndex) => {
      if (token.isSpace) {
        return <span key={`${keyPrefix}-space-${tokenIndex}`}>{token.text}</span>;
      }

      return (
        <span key={`${keyPrefix}-word-${tokenIndex}`} className="glowing-text-word">
          {Array.from(token.text).map((character, charIndex) => (
            <span
              key={`${keyPrefix}-char-${tokenIndex}-${charIndex}`}
              aria-hidden="true"
              className="glowing-text-char"
              style={
                {
                  "--char-delay": `${delayFor(token.start + charIndex)}s`,
                  "--char-duration": `${duration}s`,
                } as CharStyle
              }
            >
              {character}
            </span>
          ))}
        </span>
      );
    });

  return (
    <section
      className={`glowing-text-root relative flex min-h-screen w-full items-center overflow-hidden px-6 py-24 ${className}`}
      style={
        {
          "--glow-text": textColor,
          "--glow-text-dim-end": dimEnd,
          "--glow-soft": glowSoft,
          "--glow-hard": glowHard,
          "--glow-settled-weight": SETTLED_WEIGHT,
          backgroundColor,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.03)_28%,transparent_46%),linear-gradient(165deg,rgba(255,255,255,0.05)_0%,transparent_30%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_5px)] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[92vw]">
        <div
          className="glowing-text-eyebrow mb-8 font-mono uppercase"
          aria-label={eyebrow}
          style={{
            fontSize: `clamp(0.9rem, ${fontSize * 0.52}vw, 2.1rem)`,
            letterSpacing: `${letterSpacing + 0.28}em`,
          }}
        >
          {renderTokens(eyebrowTokens, "eyebrow", (charIndex) => charIndex * stagger)}
        </div>

        <div className="mb-9 h-px w-24 bg-[var(--glow-text)] opacity-60 shadow-[0_0_18px_var(--glow-soft)]" />

        <div
          className="glowing-text-copy font-mono"
          style={{
            fontSize: `clamp(1.25rem, ${fontSize}vw, 4.75rem)`,
            letterSpacing: `${letterSpacing}em`,
            lineHeight,
          }}
        >
          {lineTokens.map((tokens, lineIndex) => (
            <div key={`line-${lineIndex}`} className="glowing-text-line">
              {renderTokens(tokens, `line-${lineIndex}`, (charIndex) => lineCharDelays[lineIndex][charIndex])}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .glowing-text-root {
          color: var(--glow-text);
        }

        .glowing-text-word {
          display: inline-block;
          white-space: nowrap;
        }

        .glowing-text-char {
          display: inline-block;
          color: var(--glow-text);
          opacity: 0;
          font-weight: var(--glow-settled-weight);
          text-shadow: none;
          animation: glowing-char-reveal var(--char-duration) ease-out var(--char-delay) forwards;
        }

        @keyframes glowing-char-reveal {
          0% {
            color: var(--glow-text);
            opacity: 0;
            font-weight: var(--glow-settled-weight);
            text-shadow: none;
          }

          55% {
            color: var(--glow-text);
            opacity: 1;
            font-weight: var(--glow-settled-weight);
            text-shadow:
              0 0 7px var(--glow-hard),
              0 0 18px var(--glow-hard),
              0 0 34px var(--glow-hard);
          }

          80% {
            font-weight: var(--glow-settled-weight);
          }

          100% {
            color: var(--glow-text-dim-end);
            opacity: 0.72;
            font-weight: var(--glow-settled-weight);
            text-shadow: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glowing-text-char {
            color: var(--glow-text-dim-end);
            font-weight: var(--glow-settled-weight);
            text-shadow: none;
            animation: glowing-char-fade-in 0.4s ease-out forwards;
          }
        }

        @keyframes glowing-char-fade-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 0.72;
          }
        }
      `}</style>
    </section>
  );
}
