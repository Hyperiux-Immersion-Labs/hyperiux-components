"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  useState,
  type MutableRefObject,
  type CSSProperties,
  type HTMLAttributes
} from 'react';
import { motion } from 'motion/react';
import { Roboto_Flex } from 'next/font/google';

// Loaded via next/font so the variable font is self-hosted and inlined at
// build time - a runtime <link> to Google Fonts would flash the fallback
// font on every load and reflow the layout once the webfont arrived.
const robotoFlex = Roboto_Flex({ subsets: ['latin'], display: 'swap' });

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useVaultPointerPositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableTextProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

type VariableTextProximityDemoProps = {
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  baseWeight?: number;
  hoverWeight?: number;
  baseOpticalSize?: number;
  hoverOpticalSize?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  lineHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  italic?: boolean;
  className?: string;
};

type VariableTextProximityDemoStyle = CSSProperties & {
  '--hv-variable-bg': string;
  '--hv-variable-color': string;
  '--hv-variable-font-size': string;
  '--hv-variable-line-height': number;
  '--hv-variable-min-width': string;
  '--hv-variable-max-width': string;
};

const VARIABLE_HOVER_COPY =
  'Every letter keeps its own distance from the cursor. Drift across the paragraph and the nearest glyphs gain weight first, then the surrounding words settle back into place.';

const VariableProximityLetters = forwardRef<HTMLSpanElement, VariableTextProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useVaultPointerPositionRef(containerRef);
  const smoothedPositionRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const reducedMotionRef = useRef(false);
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!fontReady) return;
    letterRefs.current.forEach(letterRef => {
      if (!letterRef) return;
      const prevSettings = letterRef.style.fontVariationSettings;

      letterRef.style.fontVariationSettings = fromFontVariationSettings;
      const fromWidth = letterRef.getBoundingClientRect().width;

      letterRef.style.fontVariationSettings = toFontVariationSettings;
      const toWidth = letterRef.getBoundingClientRect().width;

      letterRef.style.fontVariationSettings = prevSettings;
      letterRef.style.display = 'inline-block';
      letterRef.style.textAlign = 'center';
      letterRef.style.width = `${Math.max(fromWidth, toWidth)}px`;
    });
  }, [fromFontVariationSettings, toFontVariationSettings, label, fontReady]);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const target = mousePositionRef.current;
    const smoothed = smoothedPositionRef.current;

    if (reducedMotionRef.current) {
      smoothed.x = target.x;
      smoothed.y = target.y;
    } else {
      const lerpFactor = 0.18;
      smoothed.x += (target.x - smoothed.x) * lerpFactor;
      smoothed.y += (target.y - smoothed.y) * lerpFactor;
    }

    if (
      lastPositionRef.current.x !== null &&
      Math.abs(smoothed.x - lastPositionRef.current.x) < 0.01 &&
      Math.abs(smoothed.y - (lastPositionRef.current.y as number)) < 0.01
    ) {
      return;
    }
    lastPositionRef.current = { x: smoothed.x, y: smoothed.y };
    const containerRect = containerRef.current.getBoundingClientRect();

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        smoothed.x,
        smoothed.y,
        letterCenterX,
        letterCenterY
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline',
        ...style
      }}
      className={`${robotoFlex.className} ${className}`}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="hv-variable-word">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                className="hv-variable-letter"
                style={{
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex]
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="hv-variable-space">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});
export default function VariableTextProximity({
  radius = 100,
  falloff = 'linear',
  baseWeight = 300,
  hoverWeight = 800,
  baseOpticalSize = 9,
  hoverOpticalSize = 40,
  backgroundColor = '#080808',
  textColor = '#ffffff',
  fontSize = 55,
  lineHeight = 1.18,
  minWidth = 920,
  maxWidth = 1040,
  italic = false,
  className = '',
}: VariableTextProximityDemoProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fromFontVariationSettings = `'wght' ${baseWeight}, 'opsz' ${baseOpticalSize}, 'slnt' 0`;
  const toFontVariationSettings = `'wght' ${hoverWeight}, 'opsz' ${hoverOpticalSize}, 'slnt' ${italic ? -10 : 0}`;
  const demoStyle: VariableTextProximityDemoStyle = {
    '--hv-variable-bg': backgroundColor,
    '--hv-variable-color': textColor,
    '--hv-variable-font-size': `${fontSize}px`,
    '--hv-variable-line-height': lineHeight,
    '--hv-variable-min-width': `${minWidth}px`,
    '--hv-variable-max-width': `${maxWidth}px`,
  };

  return (
    <section
      className={`hv-variable-root relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 ${className}`}
      style={demoStyle}
    >
      <div ref={stageRef} className="hv-variable-stage relative z-10 mx-auto text-center">
        <VariableProximityLetters
          label={VARIABLE_HOVER_COPY}
          fromFontVariationSettings={fromFontVariationSettings}
          toFontVariationSettings={toFontVariationSettings}
          containerRef={stageRef}
          radius={radius}
          falloff={falloff}
          className="hv-variable-heading"
        />
      </div>
      <style>{`
        .hv-variable-root {
          background: var(--hv-variable-bg);
          color: var(--hv-variable-color);
        }

        .hv-variable-stage {
          width: min(var(--hv-variable-max-width), calc(100vw - 2rem));
          min-width: min(var(--hv-variable-min-width), var(--hv-variable-max-width), calc(100vw - 2rem));
          max-width: min(var(--hv-variable-max-width), calc(100vw - 2rem));
        }

        .hv-variable-heading {
          position: relative;
          z-index: 1;
          color: var(--hv-variable-color);
          font-size: var(--hv-variable-font-size);
          line-height: var(--hv-variable-line-height);
          letter-spacing: 0;
        }

        .hv-variable-word {
          display: inline-block;
          white-space: nowrap;
        }

        .hv-variable-letter,
        .hv-variable-space {
          display: inline-block;
        }

        @media (max-width: 900px) {
          .hv-variable-heading {
            font-size: min(var(--hv-variable-font-size), 38px);
          }
        }

        @media (max-width: 560px) {
          .hv-variable-heading {
            font-size: min(var(--hv-variable-font-size), 30px);
          }
        }
      `}</style>
    </section>
  );
}
