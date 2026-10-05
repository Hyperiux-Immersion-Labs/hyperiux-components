// Built using Hyperiux Vault: https://vault.hyperiux.com
// @ts-nocheck
"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type AnimationEvent, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";

// @ts-nocheck
// Pure data/CSS-string-generation utility module (no React types involved).
// Left untyped per the pragmatic-typing policy in typescript-migration-plan.md:
// hundreds of internal helper params here would need `any` anyway, so a
// per-file escape is more honest than sprinkling explicit `any` everywhere.
/**
 * BeamBorder styles - presets, color palettes, and per-instance CSS generation.
 *
 * NOTE ON TAILWIND: the wrapper's static layout (position, isolation, overflow,
 * pointer-events) is applied with Tailwind utility classes inside BorderBeam.jsx.
 * Everything in this file is *runtime-generated, per-instance* CSS - dynamic
 * conic/radial gradients, `@property` registrations, per-id keyframes, and CSS
 * custom properties driven from JS - which Tailwind cannot express, so it must
 * remain as injected CSS.
 */

/**
 * Size presets for border radius and dimensions
 */
export const dimensionPresets = {
  sm: {
    borderRadius: 32,
    borderWidth: 1,
    width: 70,
    height: 36,
  },
  md: {
    borderRadius: 16,
    borderWidth: 1,
  },
  line: {
    borderRadius: 16,
    borderWidth: 1,
  },
  'pulse-outside': {
    borderRadius: 16,
    borderWidth: 1,
  },
  'pulse-inner': {
    borderRadius: 16,
    borderWidth: 1,
  },
};

/**
 * Per-size theme presets tuned per size and theme
 */
export const themePresets = {
  sm: {
    dark: {
      strokeOpacity: 0.46,
      innerOpacity: 0.24,
      bloomOpacity: 0.38,
      innerShadow: 'rgba(255, 255, 255, 0.3)',
      saturation: 1.2,
    },
    light: {
      strokeOpacity: 0.12,
      innerOpacity: 0.3,
      bloomOpacity: 0.16,
      innerShadow: 'rgba(0, 0, 0, 0.14)',
      saturation: 1.8,
    },
  },
  md: {
    dark: {
      strokeOpacity: 0.26,
      innerOpacity: 0.42,
      bloomOpacity: 0.24,
      innerShadow: 'rgba(255, 255, 255, 0.27)',
      saturation: 1.2,
    },
    light: {
      strokeOpacity: 0.8,
      innerOpacity: 0.85,
      bloomOpacity: 0.95,
      innerShadow: 'rgba(0, 0, 0, 0.18)',
      saturation: 2.0,
      brightness: 1.6,
    },
  },
  line: {
    dark: {
      strokeOpacity: 1.14,
      innerOpacity: 0.7,
      bloomOpacity: 0.8,
      innerShadow: 'rgba(255, 255, 255, 0.1)',
      saturation: 1.2,
    },
    light: {
      strokeOpacity: 0.16,
      innerOpacity: 0.32,
      bloomOpacity: 0.3,
      innerShadow: 'rgba(0, 0, 0, 0.14)',
      saturation: 1.95,
    },
  },
  // Pulse Outside - outward-blooming breathe
  'pulse-outside': {
    dark: {
      strokeOpacity: 0.94,
      innerOpacity: 0.34,
      bloomOpacity: 0.3,
      innerShadow: 'transparent',
      saturation: 1.2,
      brightness: 1.9,
      // The outward variant frames the card with a single 1px hairline (its box-shadow at
      // 0.3). Wrapped components here already supply their own ~equivalent 1px
      // border, so the beam must NOT add a second hairline on top or the edge
      // reads brighter than intended. Kept at 0 for a single-hairline look.
      hairlineOpacity: 0,
    },
    light: {
      strokeOpacity: 1.96,
      innerOpacity: 1.04,
      bloomOpacity: 0.42,
      innerShadow: 'transparent',
      saturation: 0.6,
      brightness: 1.7,
      hairlineOpacity: 0,
    },
  },
  // Pulse Inner - contained breathe
  'pulse-inner': {
    dark: {
      strokeOpacity: 1.54,
      innerOpacity: 0.44,
      bloomOpacity: 0.66,
      innerShadow: 'transparent',
      saturation: 1.2,
      brightness: 0.75,
    },
    light: {
      strokeOpacity: 0.32,
      innerOpacity: 0.4,
      bloomOpacity: 0.8,
      innerShadow: 'transparent',
      saturation: 0.75,
      brightness: 1.3,
    },
  },
};

/**
 * @deprecated Use `themePresets` for per-size theme values.
 * Retained for backward compatibility - maps to `md` size presets.
 */
export const legacyThemeColors = {
  dark: { ...themePresets.md.dark },
  light: { ...themePresets.md.light },
};

/**
 * Color palettes for each color variant
 */
const hueSets = {
  colorful: {
    border: [
      // Top edge → elongate on X (wide ovals), sat ON the edge so they reach inward.
      // Spaced ~20% apart with overlapping widths so the top glow stays continuous.
      { color: 'rgb(40, 140, 255)', pos: '12% 1%', size: '130px 65px' },
      { color: 'rgb(255, 50, 100)', pos: '33% 0%', size: '150px 75px' },
      // Left edge → elongate on Y (tall, narrow ovals)
      { color: 'rgb(50, 200, 80)', pos: '2.1% 68.3%', size: '46px 130px' },
      { color: 'rgb(30, 185, 170)', pos: '2.1% 68.3%', size: '24px 68px' },
      // Bottom edge → elongate on X
      { color: 'rgb(100, 70, 255)', pos: '74.4% 100%', size: '280px 56px' },
      { color: 'rgb(40, 140, 255)', pos: '55% 100%', size: '150px 50px' },
      // Top-right → elongate on X
      { color: 'rgb(255, 120, 40)', pos: '93.9% 1%', size: '150px 82px' },
      // Right edge → elongate on Y
      { color: 'rgb(240, 50, 180)', pos: '100% 27.1%', size: '30px 80px' },
      { color: 'rgb(180, 40, 240)', pos: '100% 27.1%', size: '56px 92px' },
    ],
    spike: { primary: 'rgb(255, 60, 80)', secondary: 'rgba(40, 190, 180, 0.98)' },
    spikeLt: { primary: 'rgb(200, 30, 60)', secondary: 'rgb(20, 150, 140)' },
  },
  mono: {
    border: [
      { color: 'rgb(180, 180, 180)', pos: '33% -7.4%', size: '70px 40px' },
      { color: 'rgb(140, 140, 140)', pos: '12% -5%', size: '60px 35px' },
      { color: 'rgb(160, 160, 160)', pos: '2.1% 68.3%', size: '40px 70px' },
      { color: 'rgb(130, 130, 130)', pos: '2.1% 68.3%', size: '20px 35px' },
      { color: 'rgb(170, 170, 170)', pos: '74.4% 100%', size: '180px 32px' },
      { color: 'rgb(150, 150, 150)', pos: '55% 100%', size: '85px 26px' },
      { color: 'rgb(190, 190, 190)', pos: '93.9% 0%', size: '74px 32px' },
      { color: 'rgb(145, 145, 145)', pos: '100% 27.1%', size: '26px 42px' },
      { color: 'rgb(165, 165, 165)', pos: '100% 27.1%', size: '52px 48px' },
    ],
    spike: { primary: 'rgb(200, 200, 200)', secondary: 'rgb(170, 170, 170)' },
    spikeLt: { primary: 'rgb(80, 80, 80)', secondary: 'rgb(120, 120, 120)' },
  },
  ocean: {
    border: [
      { color: 'rgb(100, 80, 220)', pos: '33% -7.4%', size: '70px 40px' },
      { color: 'rgb(60, 120, 255)', pos: '12% -5%', size: '60px 35px' },
      { color: 'rgb(80, 100, 200)', pos: '2.1% 68.3%', size: '40px 70px' },
      { color: 'rgb(50, 140, 220)', pos: '2.1% 68.3%', size: '20px 35px' },
      { color: 'rgb(120, 80, 255)', pos: '74.4% 100%', size: '180px 32px' },
      { color: 'rgb(70, 130, 255)', pos: '55% 100%', size: '85px 26px' },
      { color: 'rgb(140, 100, 240)', pos: '93.9% 0%', size: '74px 32px' },
      { color: 'rgb(90, 110, 230)', pos: '100% 27.1%', size: '26px 42px' },
      { color: 'rgb(130, 70, 255)', pos: '100% 27.1%', size: '52px 48px' },
    ],
    spike: { primary: 'rgb(100, 120, 255)', secondary: 'rgba(130, 100, 220, 0.98)' },
    spikeLt: { primary: 'rgb(60, 60, 180)', secondary: 'rgb(80, 100, 200)' },
  },
  sunset: {
    border: [
      { color: 'rgb(255, 80, 50)', pos: '33% -7.4%', size: '70px 40px' },
      { color: 'rgb(255, 160, 40)', pos: '12% -5%', size: '60px 35px' },
      { color: 'rgb(255, 120, 60)', pos: '2.1% 68.3%', size: '40px 70px' },
      { color: 'rgb(255, 200, 50)', pos: '2.1% 68.3%', size: '20px 35px' },
      { color: 'rgb(255, 100, 80)', pos: '74.4% 100%', size: '180px 32px' },
      { color: 'rgb(255, 180, 60)', pos: '55% 100%', size: '85px 26px' },
      { color: 'rgb(255, 60, 60)', pos: '93.9% 0%', size: '74px 32px' },
      { color: 'rgb(255, 140, 50)', pos: '100% 27.1%', size: '26px 42px' },
      { color: 'rgb(255, 90, 70)', pos: '100% 27.1%', size: '52px 48px' },
    ],
    spike: { primary: 'rgb(255, 140, 80)', secondary: 'rgba(255, 100, 60, 0.98)' },
    spikeLt: { primary: 'rgb(200, 80, 40)', secondary: 'rgb(220, 120, 30)' },
  },
};

/**
 * Small size color palettes (compact gradients for button-sized elements)
 */
const compactSets = {
  colorful: {
    border: [
      { color: 'rgb(50, 200, 80)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgb(30, 185, 170)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgb(255, 120, 40)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgb(100, 70, 255)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgb(240, 50, 180)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgb(180, 40, 240)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgb(40, 140, 255)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgb(255, 50, 100)', pos: '100% 27%', size: '11px 12px' },
    ],
    inner: [
      { color: 'rgba(50, 200, 80, 0.5)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgba(30, 185, 170, 0.45)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgba(255, 120, 40, 0.35)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgba(100, 70, 255, 0.35)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgba(240, 50, 180, 0.3)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgba(180, 40, 240, 0.4)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgba(40, 140, 255, 0.3)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgba(255, 50, 100, 0.3)', pos: '100% 27%', size: '11px 12px' },
    ],
  },
  mono: {
    border: [
      { color: 'rgb(160, 160, 160)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgb(140, 140, 140)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgb(180, 180, 180)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgb(150, 150, 150)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgb(170, 170, 170)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgb(155, 155, 155)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgb(145, 145, 145)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgb(165, 165, 165)', pos: '100% 27%', size: '11px 12px' },
    ],
    inner: [
      { color: 'rgba(160, 160, 160, 0.25)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgba(140, 140, 140, 0.22)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgba(180, 180, 180, 0.17)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgba(150, 150, 150, 0.17)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgba(170, 170, 170, 0.15)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgba(155, 155, 155, 0.20)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgba(145, 145, 145, 0.15)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgba(165, 165, 165, 0.15)', pos: '100% 27%', size: '11px 12px' },
    ],
  },
  ocean: {
    border: [
      { color: 'rgb(60, 140, 200)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgb(50, 120, 180)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgb(100, 80, 220)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgb(80, 100, 255)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgb(120, 70, 240)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgb(90, 80, 220)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgb(70, 110, 255)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgb(110, 90, 230)', pos: '100% 27%', size: '11px 12px' },
    ],
    inner: [
      { color: 'rgba(60, 140, 200, 0.5)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgba(50, 120, 180, 0.45)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgba(100, 80, 220, 0.35)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgba(80, 100, 255, 0.35)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgba(120, 70, 240, 0.3)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgba(90, 80, 220, 0.4)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgba(70, 110, 255, 0.3)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgba(110, 90, 230, 0.3)', pos: '100% 27%', size: '11px 12px' },
    ],
  },
  sunset: {
    border: [
      { color: 'rgb(255, 180, 50)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgb(255, 150, 40)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgb(255, 80, 60)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgb(255, 100, 80)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgb(255, 60, 80)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgb(255, 120, 60)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgb(255, 200, 50)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgb(255, 90, 70)', pos: '100% 27%', size: '11px 12px' },
    ],
    inner: [
      { color: 'rgba(255, 180, 50, 0.5)', pos: '2% 68%', size: '9px 18px' },
      { color: 'rgba(255, 150, 40, 0.45)', pos: '2% 68%', size: '4px 8px' },
      { color: 'rgba(255, 80, 60, 0.35)', pos: '72% -3%', size: '59px 9px' },
      { color: 'rgba(255, 100, 80, 0.35)', pos: '74% 100%', size: '42px 7px' },
      { color: 'rgba(255, 60, 80, 0.3)', pos: '100% 27%', size: '10px 17px' },
      { color: 'rgba(255, 120, 60, 0.4)', pos: '100% 27%', size: '10px 18px' },
      { color: 'rgba(255, 200, 50, 0.3)', pos: '100% 27%', size: '5px 10px' },
      { color: 'rgba(255, 90, 70, 0.3)', pos: '100% 27%', size: '11px 12px' },
    ],
  },
};

function compactEdge(colorVariant) {
  const palette = compactSets[colorVariant];
  return palette.border
    .map(c => `radial-gradient(ellipse ${c.size} at ${c.pos}, ${c.color}, transparent)`)
    .join(',\n    ');
}

function compactCore(colorVariant) {
  const palette = compactSets[colorVariant];
  return palette.inner
    .map(c => `radial-gradient(ellipse ${c.size} at ${c.pos}, ${c.color}, transparent)`)
    .join(',\n    ');
}

function edgeLayer(colorVariant) {
  const palette = hueSets[colorVariant];
  return palette.border
    .map(c => `radial-gradient(ellipse ${c.size} at ${c.pos}, ${c.color}, transparent)`)
    .join(',\n    ');
}

function coreLayer(colorVariant) {
  const palette = hueSets[colorVariant];
  // Mono variant gets 50% lower opacity
  const baseOpacity = colorVariant === 'mono' ? 0.225 : 0.45;
  return palette.border
    .map(c => {
      const rgba = c.color.replace('rgb(', 'rgba(').replace(')', `, ${baseOpacity})`);
      const smallerSize = c.size.split(' ').map(s => {
        const val = parseInt(s);
        return `${Math.round(val * 0.9)}px`;
      }).join(' ');
      return `radial-gradient(ellipse ${smallerSize} at ${c.pos}, ${rgba}, transparent)`;
    })
    .join(',\n    ');
}

function flareColors(colorVariant, isDark) {
  const palette = hueSets[colorVariant];
  return isDark ? palette.spike : palette.spikeLt;
}

const traceSets = {
  colorful: {
    dark: [
      { color: 'rgb(255, 50, 100)', sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(40, 180, 220)', sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: 'rgb(50, 200, 80)', sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: 'rgb(180, 40, 240)', sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: 'rgb(255, 160, 30)', sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: 'rgb(100, 70, 255)', sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: 'rgb(40, 140, 255)', sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: 'rgb(240, 50, 180)', sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: 'rgb(30, 185, 170)', sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 },
    ],
    light: [
      { color: 'rgb(255, 50, 100)', sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(40, 140, 255)', sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: 'rgb(50, 200, 80)', sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: 'rgb(180, 40, 240)', sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: 'rgb(30, 185, 170)', sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: 'rgb(100, 70, 255)', sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: 'rgb(40, 140, 255)', sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: 'rgb(255, 120, 40)', sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: 'rgb(240, 50, 180)', sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 },
    ],
  },
  mono: {
    dark: [
      { color: 'rgb(200, 200, 200)', sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(170, 170, 170)', sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: 'rgb(155, 155, 155)', sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: 'rgb(185, 185, 185)', sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: 'rgb(165, 165, 165)', sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: 'rgb(180, 180, 180)', sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: 'rgb(160, 160, 160)', sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: 'rgb(175, 175, 175)', sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: 'rgb(190, 190, 190)', sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 },
    ],
    light: [
      { color: 'rgb(100, 100, 100)', sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(80, 80, 80)', sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: 'rgb(90, 90, 90)', sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: 'rgb(70, 70, 70)', sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: 'rgb(85, 85, 85)', sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: 'rgb(95, 95, 95)', sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: 'rgb(75, 75, 75)', sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: 'rgb(105, 105, 105)', sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: 'rgb(65, 65, 65)', sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 },
    ],
  },
  ocean: {
    dark: [
      { color: 'rgb(100, 80, 220)', sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(60, 120, 255)', sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: 'rgb(80, 100, 200)', sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: 'rgb(130, 70, 255)', sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: 'rgb(70, 130, 255)', sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: 'rgb(120, 80, 255)', sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: 'rgb(90, 110, 230)', sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: 'rgb(110, 90, 240)', sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: 'rgb(140, 100, 255)', sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 },
    ],
    light: [
      { color: 'rgb(80, 60, 200)', sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(50, 100, 220)', sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: 'rgb(70, 90, 190)', sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: 'rgb(110, 60, 220)', sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: 'rgb(60, 110, 230)', sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: 'rgb(100, 70, 240)', sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: 'rgb(80, 100, 210)', sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: 'rgb(90, 80, 225)', sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: 'rgb(120, 90, 245)', sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 },
    ],
  },
  sunset: {
    dark: [
      { color: 'rgb(255, 100, 60)', sizeW: 36, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(255, 180, 50)', sizeW: 30, sizeH: 32, offsetX: 39, offsetY: 0 },
      { color: 'rgb(255, 140, 70)', sizeW: 33, sizeH: 28, offsetX: -36, offsetY: 2 },
      { color: 'rgb(255, 80, 80)', sizeW: 29, sizeH: 34, offsetX: -54, offsetY: 0 },
      { color: 'rgb(255, 200, 60)', sizeW: 27, sizeH: 30, offsetX: 51, offsetY: -1 },
      { color: 'rgb(255, 120, 50)', sizeW: 36, sizeH: 24, offsetX: 21, offsetY: 1 },
      { color: 'rgb(255, 160, 80)', sizeW: 30, sizeH: 22, offsetX: -21, offsetY: 0 },
      { color: 'rgb(255, 90, 60)', sizeW: 25, sizeH: 28, offsetX: 66, offsetY: 1 },
      { color: 'rgb(255, 70, 70)', sizeW: 23, sizeH: 30, offsetX: -66, offsetY: -1 },
    ],
    light: [
      { color: 'rgb(220, 80, 40)', sizeW: 45, sizeH: 36, offsetX: 0, offsetY: 2 },
      { color: 'rgb(230, 150, 30)', sizeW: 35, sizeH: 32, offsetX: 65, offsetY: 0 },
      { color: 'rgb(210, 110, 50)', sizeW: 40, sizeH: 28, offsetX: -60, offsetY: 2 },
      { color: 'rgb(200, 60, 60)', sizeW: 35, sizeH: 34, offsetX: -90, offsetY: 0 },
      { color: 'rgb(220, 170, 40)', sizeW: 38, sizeH: 30, offsetX: 85, offsetY: -1 },
      { color: 'rgb(210, 100, 30)', sizeW: 50, sizeH: 24, offsetX: 35, offsetY: 1 },
      { color: 'rgb(230, 130, 60)', sizeW: 40, sizeH: 22, offsetX: -35, offsetY: 0 },
      { color: 'rgb(190, 70, 50)', sizeW: 35, sizeH: 28, offsetX: 110, offsetY: 1 },
      { color: 'rgb(180, 50, 50)', sizeW: 30, sizeH: 30, offsetX: -110, offsetY: -1 },
    ],
  },
};

function traceEdge(colorVariant, isDark, id) {
  const palette = traceSets[colorVariant][isDark ? 'dark' : 'light'];
  return palette
    .map(c => {
      const offsetXStr = c.offsetX === 0 ? '' : (c.offsetX > 0 ? ` + ${c.offsetX}px` : ` - ${Math.abs(c.offsetX)}px`);
      const offsetYStr = c.offsetY === 0 ? '' : (c.offsetY > 0 ? ` + ${c.offsetY}px` : ` - ${Math.abs(c.offsetY)}px`);
      return `radial-gradient(ellipse calc(${c.sizeW}px * var(--rim-w-${id})) calc(${c.sizeH}px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%${offsetXStr}) calc(100%${offsetYStr}), ${c.color}, transparent)`;
    })
    .join(',\n       ');
}

// Inner gradient data for the trace variant
const traceInnerSets = {
  colorful: [
    { color: 'rgba(255, 50, 100, 0.48)', sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: 'rgba(40, 180, 220, 0.42)', sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: 'rgba(50, 200, 80, 0.48)', sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: 'rgba(180, 40, 240, 0.42)', sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: 'rgba(255, 160, 30, 0.50)', sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: 'rgba(100, 70, 255, 0.45)', sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: 'rgba(40, 140, 255, 0.40)', sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: 'rgba(240, 50, 180, 0.45)', sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: 'rgba(30, 185, 170, 0.52)', sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 },
  ],
  mono: [
    { color: 'rgba(200, 200, 200, 0.48)', sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: 'rgba(170, 170, 170, 0.42)', sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: 'rgba(155, 155, 155, 0.48)', sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: 'rgba(185, 185, 185, 0.42)', sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: 'rgba(165, 165, 165, 0.50)', sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: 'rgba(180, 180, 180, 0.45)', sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: 'rgba(160, 160, 160, 0.40)', sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: 'rgba(175, 175, 175, 0.45)', sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: 'rgba(190, 190, 190, 0.52)', sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 },
  ],
  ocean: [
    { color: 'rgba(100, 80, 220, 0.48)', sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: 'rgba(60, 120, 255, 0.42)', sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: 'rgba(80, 100, 200, 0.48)', sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: 'rgba(130, 70, 255, 0.42)', sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: 'rgba(70, 130, 255, 0.50)', sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: 'rgba(120, 80, 255, 0.45)', sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: 'rgba(90, 110, 230, 0.40)', sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: 'rgba(110, 90, 240, 0.45)', sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: 'rgba(140, 100, 255, 0.52)', sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 },
  ],
  sunset: [
    { color: 'rgba(255, 100, 60, 0.48)', sizeW: 33, sizeH: 30, offsetX: 0, offsetY: 0 },
    { color: 'rgba(255, 180, 50, 0.42)', sizeW: 24, sizeH: 26, offsetX: 39, offsetY: -3 },
    { color: 'rgba(255, 140, 70, 0.48)', sizeW: 27, sizeH: 24, offsetX: -36, offsetY: 0 },
    { color: 'rgba(255, 80, 80, 0.42)', sizeW: 23, sizeH: 28, offsetX: -54, offsetY: -2 },
    { color: 'rgba(255, 200, 60, 0.50)', sizeW: 24, sizeH: 24, offsetX: 51, offsetY: -1 },
    { color: 'rgba(255, 120, 50, 0.45)', sizeW: 30, sizeH: 20, offsetX: 21, offsetY: 0 },
    { color: 'rgba(255, 160, 80, 0.40)', sizeW: 25, sizeH: 18, offsetX: -21, offsetY: -2 },
    { color: 'rgba(255, 90, 60, 0.45)', sizeW: 21, sizeH: 24, offsetX: 66, offsetY: 0 },
    { color: 'rgba(255, 70, 70, 0.52)', sizeW: 18, sizeH: 26, offsetX: -66, offsetY: -1 },
  ],
};

function traceCore(colorVariant, id) {
  const data = traceInnerSets[colorVariant];
  return data
    .map(c => {
      const offsetXStr = c.offsetX === 0 ? '' : (c.offsetX > 0 ? ` + ${c.offsetX}px` : ` - ${Math.abs(c.offsetX)}px`);
      const offsetYStr = c.offsetY === 0 ? '' : ` - ${Math.abs(c.offsetY)}px`;
      return `radial-gradient(ellipse calc(${c.sizeW}px * var(--rim-w-${id})) calc(${c.sizeH}px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%${offsetXStr}) calc(100%${offsetYStr}), ${c.color}, transparent)`;
    })
    .join(',\n    ');
}

const traceBloomSets = {
  colorful: {
    dark: {
      spikes: [
        { color1: 'rgb(100, 70, 255)', color2: 'rgba(100, 70, 255, 1)' },              // 36%
        { color1: 'rgba(255, 170, 40, 0.59)', color2: 'rgba(255, 170, 40, 0.29)' },    // 50%
        { color1: 'rgb(50, 200, 100)', color2: 'rgba(50, 200, 100, 1)' },              // 64%
        { color1: 'rgba(200, 50, 240, 0.91)', color2: 'rgba(200, 50, 240, 0.45)' },    // 78%
        { color1: 'rgb(40, 140, 255)', color2: 'rgba(40, 140, 255, 1)' },              // 92%
      ],
    },
    light: {
      spikes: [
        { color1: 'rgb(80, 50, 200)', color2: 'rgba(80, 50, 200, 0.8)' },      // 36%
        { color1: 'rgba(210, 130, 0, 0.7)', color2: 'rgba(210, 130, 0, 0.46)' }, // 50%
        { color1: 'rgb(30, 160, 70)', color2: 'rgba(30, 160, 70, 0.82)' },     // 64%
        { color1: 'rgb(160, 30, 190)', color2: 'rgba(160, 30, 190, 0.7)' },    // 78%
        { color1: 'rgb(30, 100, 200)', color2: 'rgba(30, 100, 200, 0.78)' },   // 92%
      ],
    },
  },
  mono: {
    dark: {
      spikes: [
        { color1: 'rgb(200, 200, 200)', color2: 'rgba(200, 200, 200, 1)' },
        { color1: 'rgba(180, 180, 180, 0.59)', color2: 'rgba(180, 180, 180, 0.29)' },
        { color1: 'rgb(190, 190, 190)', color2: 'rgba(190, 190, 190, 1)' },
        { color1: 'rgba(170, 170, 170, 0.91)', color2: 'rgba(170, 170, 170, 0.45)' },
        { color1: 'rgb(185, 185, 185)', color2: 'rgba(185, 185, 185, 1)' },
      ],
    },
    light: {
      spikes: [
        { color1: 'rgb(80, 80, 80)', color2: 'rgba(80, 80, 80, 0.8)' },
        { color1: 'rgba(100, 100, 100, 0.7)', color2: 'rgba(100, 100, 100, 0.46)' },
        { color1: 'rgb(70, 70, 70)', color2: 'rgba(70, 70, 70, 0.82)' },
        { color1: 'rgb(90, 90, 90)', color2: 'rgba(90, 90, 90, 0.7)' },
        { color1: 'rgb(85, 85, 85)', color2: 'rgba(85, 85, 85, 0.78)' },
      ],
    },
  },
  ocean: {
    dark: {
      spikes: [
        { color1: 'rgb(100, 80, 255)', color2: 'rgb(100, 80, 255)' },
        { color1: 'rgba(80, 130, 220, 0.59)', color2: 'rgba(80, 130, 220, 0.29)' },
        { color1: 'rgb(60, 100, 255)', color2: 'rgb(60, 100, 255)' },
        { color1: 'rgba(90, 120, 200, 0.91)', color2: 'rgba(90, 120, 200, 0.45)' },
        { color1: 'rgb(120, 90, 255)', color2: 'rgb(120, 90, 255)' },
      ],
    },
    light: {
      spikes: [
        { color1: 'rgb(50, 40, 180)', color2: 'rgba(50, 40, 180, 0.8)' },
        { color1: 'rgba(40, 80, 200, 0.7)', color2: 'rgba(40, 80, 200, 0.46)' },
        { color1: 'rgb(30, 50, 190)', color2: 'rgba(30, 50, 190, 0.82)' },
        { color1: 'rgb(60, 90, 180)', color2: 'rgba(60, 90, 180, 0.7)' },
        { color1: 'rgb(70, 60, 200)', color2: 'rgba(70, 60, 200, 0.78)' },
      ],
    },
  },
  sunset: {
    dark: {
      spikes: [
        { color1: 'rgb(255, 100, 80)', color2: 'rgb(255, 100, 80)' },
        { color1: 'rgba(255, 150, 80, 0.59)', color2: 'rgba(255, 150, 80, 0.29)' },
        { color1: 'rgb(255, 80, 60)', color2: 'rgb(255, 80, 60)' },
        { color1: 'rgba(255, 120, 50, 0.91)', color2: 'rgba(255, 120, 50, 0.45)' },
        { color1: 'rgb(255, 140, 70)', color2: 'rgb(255, 140, 70)' },
      ],
    },
    light: {
      spikes: [
        { color1: 'rgb(200, 60, 30)', color2: 'rgba(200, 60, 30, 0.8)' },
        { color1: 'rgba(220, 100, 20, 0.7)', color2: 'rgba(220, 100, 20, 0.46)' },
        { color1: 'rgb(180, 40, 20)', color2: 'rgba(180, 40, 20, 0.82)' },
        { color1: 'rgb(210, 80, 10)', color2: 'rgba(210, 80, 10, 0.7)' },
        { color1: 'rgb(190, 70, 30)', color2: 'rgba(190, 70, 30, 0.78)' },
      ],
    },
  },
};

function setAlpha(color, alpha) {
  const rgbaMatch = color.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[\d.]+\s*\)$/);
  if (rgbaMatch) return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha})`;
  const rgbMatch = color.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  return color;
}

function fadeColor(color, factor) {
  const rgbaMatch = color.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbaMatch) return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${(parseFloat(rgbaMatch[4]) * factor).toFixed(2)})`;
  const rgbMatch = color.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${factor.toFixed(2)})`;
  return color;
}

function traceBloom(colorVariant, isDark, id) {
  const spikeColors = flareColors(colorVariant, isDark);
  const bloomData = traceBloomSets[colorVariant][isDark ? 'dark' : 'light'];
  const isMono = colorVariant === 'mono';

  // Mono uses uniform gray so thin spikes at full opacity look like harsh bars.
  // Attenuate opacity and widen the thin gradients so they appear as soft glows.
  const att = isMono ? 0.14 : 1;
  const sc1     = isMono ? fadeColor(spikeColors.primary, 0.14) : spikeColors.primary;
  const sc1_mid = isMono ? fadeColor(spikeColors.primary, 0.09) : spikeColors.primary;
  const sc2     = isMono ? fadeColor(spikeColors.secondary, 0.12) : spikeColors.secondary;
  const sc2_mid = isMono ? setAlpha(spikeColors.secondary, 0.06) : setAlpha(spikeColors.secondary, 0.49);

  const spikes = bloomData.spikes.map(s => isMono
    ? { color1: fadeColor(s.color1, att), color2: fadeColor(s.color2, att * 0.7) }
    : s
  );

  // Mono: wide, blurred soft spikes; shortened heights
  const thinW1 = isMono ? '12px'  : '0.8px';
  const thinW2 = isMono ? '14px'  : '2px';
  const thinW3 = isMono ? '12px'  : '1.2px';
  const thinW4 = isMono ? '10px'  : '0.6px';
  const thinH1 = isMono ? '42px'  : '92px';
  const thinH2 = isMono ? '38px'  : '72px';
  const thinH3 = isMono ? '40px'  : '85px';
  const thinH4 = isMono ? '32px'  : '60px';
  const thinLW = isMono ? '12px'  : '1px';

  // Main glow: center dot + ambient - mono gets 50% lower opacity
  const glowDotC   = isMono ? 'rgba(255, 255, 255, 0.5)'  : 'rgba(255, 255, 255, 1)';
  const glowDot20  = isMono ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.9)';
  const glowDot50  = isMono ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)';
  const glowAmbC   = isMono ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
  const glowAmb25  = isMono ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)';
  const glowAmb55  = isMono ? 'rgba(255, 255, 255, 0.015)': 'rgba(255, 255, 255, 0.03)';

  if (isDark) {
    return `radial-gradient(ellipse calc(${thinW1} * var(--rim-spike-${id})) calc(${thinH1} * var(--rim-h-${id})) at 8% calc(100% - 2px), ${sc1}, ${sc1_mid} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--rim-spike2-${id})) calc(35px * var(--rim-h-${id})) at 22% calc(100% - 4px), ${sc2}, ${sc2_mid} 50%, transparent 95%),
       radial-gradient(ellipse calc(${thinW2} * (2 - var(--rim-spike-${id}))) calc(${thinH2} * var(--rim-h-${id})) at 36% calc(100% - 3px), ${spikes[0].color1}, ${spikes[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--rim-spike2-${id})) calc(28px * var(--rim-h-${id})) at 50% calc(100% - 2px), ${spikes[1].color1}, ${spikes[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${thinW3} * (2 - var(--rim-spike2-${id}))) calc(${thinH3} * var(--rim-h-${id})) at 64% calc(100% - 4px), ${spikes[2].color1}, ${spikes[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--rim-spike-${id})) calc(45px * var(--rim-h-${id})) at 78% calc(100% - 2px), ${spikes[3].color1}, ${spikes[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${thinW4} * (2 - var(--rim-spike-${id}))) calc(${thinH4} * var(--rim-h-${id})) at 92% calc(100% - 3px), ${spikes[4].color1}, ${spikes[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(21px * var(--rim-spike-${id})) calc(15px * var(--rim-spike2-${id})) at calc(var(--rim-x-${id}) * 100%) calc(100% + 1px), ${glowDotC} 0%, ${glowDot20} 20%, ${glowDot50} 50%, transparent 100%),
       radial-gradient(ellipse calc(42px * var(--rim-w-${id})) calc(40px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%, ${glowAmbC} 0%, ${glowAmb25} 25%, ${glowAmb55} 55%, transparent 80%)`;
  } else {
    const sc1_lt = isMono ? fadeColor(spikeColors.primary, 0.11) : setAlpha(spikeColors.primary, 0.85);
    const sc2_lt = isMono ? fadeColor(spikeColors.secondary, 0.09) : setAlpha(spikeColors.secondary, 0.7);
    return `radial-gradient(ellipse calc(${thinW1} * var(--rim-spike-${id})) calc(${thinH1} * var(--rim-h-${id})) at 8% calc(100% - 2px), ${sc1}, ${sc1_lt} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--rim-spike2-${id})) calc(35px * var(--rim-h-${id})) at 22% calc(100% - 4px), ${sc2}, ${sc2_lt} 50%, transparent 95%),
       radial-gradient(ellipse calc(${thinW2} * (2 - var(--rim-spike-${id}))) calc(${thinH2} * var(--rim-h-${id})) at 36% calc(100% - 3px), ${spikes[0].color1}, ${spikes[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--rim-spike2-${id})) calc(28px * var(--rim-h-${id})) at 50% calc(100% - 2px), ${spikes[1].color1}, ${spikes[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${thinW3} * (2 - var(--rim-spike2-${id}))) calc(${thinH3} * var(--rim-h-${id})) at 64% calc(100% - 4px), ${spikes[2].color1}, ${spikes[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--rim-spike-${id})) calc(45px * var(--rim-h-${id})) at 78% calc(100% - 2px), ${spikes[3].color1}, ${spikes[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${thinLW} * (2 - var(--rim-spike-${id}))) calc(${thinH4} * var(--rim-h-${id})) at 92% calc(100% - 3px), ${spikes[4].color1}, ${spikes[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(50px * var(--rim-w-${id})) calc(32px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) calc(100%), rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.18) 30%, rgba(0, 0, 0, 0.03) 60%, transparent 85%)`;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Pulse family (breathing glow, no rotation)
 * "pulse-inner" (contained) and "pulse-outside" (outward bloom).
 *
 * Both effects animate three independent size/drift regions (g1/g2/g3) and four
 * per-quadrant opacity oscillators (tl/tr/bl/br) on desynced periods, plus a
 * global height oscillator (gh) and a hue-shift filter. The gradient COLORS come
 * from the shared `hueSets` (so every color variant + strength works), while
 * the geometry below (sizes/positions/region/quadrant) is identical across colors.
 * ──────────────────────────────────────────────────────────────────────────*/

// Which size-region (g1/g2/g3) and opacity-quadrant each of the 9 palette
// gradients belongs to (matches the perimeter ::after ordering).
const BREATHE_RING_MAP = [
  { region: 1, quad: 'tl' },
  { region: 2, quad: 'tl' },
  { region: 3, quad: 'bl' },
  { region: 1, quad: 'bl' },
  { region: 2, quad: 'br' },
  { region: 3, quad: 'br' },
  { region: 1, quad: 'tr' },
  { region: 2, quad: 'tr' },
  { region: 3, quad: 'tr' },
];

// Inner-perimeter (::before) gradient sizes - slightly smaller than the ring.
const BREATHE_INNER_SIZES = [
  [65, 35], [55, 30], [35, 65], [15, 30], [173, 28], [80, 22], [69, 28], [22, 38], [47, 44],
];

// Inner bloom - 7 of the 9 colors, expanded sizes (positions come from palette).
const BREATHE_INNER_BLOOM = [
  { ci: 0, region: 1, quad: 'tl', w: 84, h: 48 },
  { ci: 1, region: 2, quad: 'tl', w: 72, h: 42 },
  { ci: 2, region: 3, quad: 'bl', w: 48, h: 84 },
  { ci: 4, region: 2, quad: 'br', w: 216, h: 38 },
  { ci: 5, region: 3, quad: 'br', w: 102, h: 31 },
  { ci: 6, region: 1, quad: 'tr', w: 89, h: 38 },
  { ci: 8, region: 3, quad: 'tr', w: 62, h: 58 },
];

// Outward core (::after hairline + ::before glow share this edge-positioned set).
const BREATHE_OUTER_CORE = [
  { ci: 0, region: 1, quad: 'tl', w: 80, h: 19, x: '27%', y: '0%' },
  { ci: 6, region: 2, quad: 'tr', w: 74, h: 11, x: '73%', y: '-1%' },
  { ci: 7, region: 3, quad: 'tr', w: 15, h: 44, x: '100%', y: '33%' },
  { ci: 8, region: 1, quad: 'br', w: 19, h: 38, x: '101%', y: '72%' },
  { ci: 4, region: 2, quad: 'br', w: 84, h: 13, x: '67%', y: '100%' },
  { ci: 1, region: 3, quad: 'bl', w: 60, h: 21, x: '24%', y: '101%' },
  { ci: 2, region: 1, quad: 'bl', w: 17, h: 40, x: '0%', y: '60%' },
  { ci: 3, region: 2, quad: 'tl', w: 13, h: 32, x: '-1%', y: '28%' },
];

// Outward bloom - wider/blurred halo (7 gradients).
const BREATHE_OUTER_BLOOM = [
  { ci: 0, region: 1, quad: 'tl', w: 110, h: 30, x: '27%', y: '3%' },
  { ci: 6, region: 2, quad: 'tr', w: 100, h: 20, x: '73%', y: '1%' },
  { ci: 7, region: 3, quad: 'tr', w: 26, h: 62, x: '100%', y: '33%' },
  { ci: 8, region: 1, quad: 'br', w: 30, h: 56, x: '101%', y: '72%' },
  { ci: 4, region: 2, quad: 'br', w: 120, h: 22, x: '67%', y: '99%' },
  { ci: 1, region: 3, quad: 'bl', w: 88, h: 32, x: '24%', y: '99%' },
  { ci: 2, region: 1, quad: 'bl', w: 28, h: 58, x: '0%', y: '60%' },
];

// Convert an `rgb()` palette color into `rgba()` whose alpha is the live quadrant
// opacity custom property, so the gradient breathes per-quadrant.
function setAlphaVar(color, quad, id) {
  const m = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  const rgb = m ? `${m[1]}, ${m[2]}, ${m[3]}` : '255, 255, 255';
  return `rgba(${rgb}, var(--qop-${quad}-${id}))`;
}

function breatheGrad(color, w, h, region, quad, x, y, id) {
  // `--pulse-scale-x/-y` (set inline by the component for pulse-outside) scale the
  // blob WIDTH/HEIGHT to the measured element size, so the glow fits any component.
  // Positions stay percentage-based, so blobs keep hugging the element's edges.
  // Defaults to 1 (e.g. pulse-inner never sets them), leaving geometry unchanged.
  // `--pulse-boost` is a consumer hook: a relative multiplier on top of the
  // measured scale, so the glow can be intensified proportionally on any element.
  return `radial-gradient(ellipse calc(${w}px * var(--qw${region}-${id}) * var(--pulse-scale-x, 1) * var(--pulse-boost, 1)) calc(${h}px * var(--qh${region}-${id}) * var(--qgh-${id}) * var(--pulse-scale-y, 1) * var(--pulse-boost, 1)) at calc(${x} + var(--qx${region}-${id})) calc(${y} + var(--qy${region}-${id})), ${setAlphaVar(color, quad, id)}, transparent)`;
}

// The 9-gradient perimeter ring (shared by the perimeter ::after and the stroke) -
// positions + sizes come straight from the palette, region/quad from BREATHE_RING_MAP.
function breatheRing(variant, id) {
  return hueSets[variant].border
    .map((c, i) => {
      const { region, quad } = BREATHE_RING_MAP[i];
      const [x, y] = c.pos.split(' ');
      const [w, h] = c.size.split(' ').map(parseFloat);
      return breatheGrad(c.color, w, h, region, quad, x, y, id);
    })
    .join(',\n    ');
}

// Inner-perimeter gradients (smaller sizes) plus the bright corner accents.
function breatheInner(variant, id, isDark) {
  const palette = hueSets[variant].border;
  const grads = palette.map((c, i) => {
    const { region, quad } = BREATHE_RING_MAP[i];
    const [x, y] = c.pos.split(' ');
    const [w, h] = BREATHE_INNER_SIZES[i];
    return breatheGrad(c.color, w, h, region, quad, x, y, id);
  });
  const cornerRGB = isDark ? '255, 255, 255' : '0, 0, 0';
  const cornerAlpha = isDark ? 0.18 : 0.08;
  const corners = [
    ['0%', '0%', 'tl'],
    ['100%', '0%', 'tr'],
    ['0%', '100%', 'bl'],
    ['100%', '100%', 'br'],
  ];
  const cornerGrads = corners.map(
    ([x, y, q]) =>
      `radial-gradient(ellipse 60px 60px at ${x} ${y}, rgba(${cornerRGB}, calc(${cornerAlpha} * var(--qop-${q}-${id}))), transparent 70%)`
  );
  return [...grads, ...cornerGrads].join(',\n    ');
}

// Emit a fixed gradient table (used by inner bloom + both outer layers).
function breatheTable(table, variant, id) {
  const palette = hueSets[variant].border;
  return table
    .map(e => {
      const c = palette[e.ci];
      const [px, py] = c.pos.split(' ');
      return breatheGrad(c.color, e.w, e.h, e.region, e.quad, e.x ?? px, e.y ?? py, id);
    })
    .join(',\n    ');
}

// Frozen variant of the bloom gradients: emits literal sizes/positions with a
// fixed per-blob alpha (the time-average of the breathing range) instead of the
// live `var(--qw…/--qop…)` custom properties. Because the bloom's background no
// longer changes per frame, its heavily-blurred bitmap is painted ONCE and cached
// by the compositor rather than re-rasterized 60–120×/sec - the single biggest
// per-frame cost in the pulse effect.
function breatheTableStatic(table, variant, frozenAlpha) {
  const palette = hueSets[variant].border;
  const a = +frozenAlpha.toFixed(3);
  return table
    .map(e => {
      const c = palette[e.ci];
      const [px, py] = c.pos.split(' ');
      const x = e.x ?? px;
      const y = e.y ?? py;
      const m = c.color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      const rgb = m ? `${m[1]}, ${m[2]}, ${m[3]}` : '255, 255, 255';
      // Scale the blob to the measured element via `--pulse-scale-x/-y` (same as
      // the live stroke/core layers). The var only changes on resize, so the
      // blurred bloom bitmap is still painted once and cached between resizes.
      // Defaults to 1 (pulse-inner never sets it), leaving inner geometry as-is.
      return `radial-gradient(ellipse calc(${e.w}px * var(--pulse-scale-x, 1) * var(--pulse-boost, 1)) calc(${e.h}px * var(--pulse-scale-y, 1) * var(--pulse-boost, 1)) at ${x} ${y}, rgba(${rgb}, ${a}), transparent)`;
    })
    .join(',\n    ');
}

/**
 * Under prefers-reduced-motion, stretch animation durations (and pulse periods)
 * by this factor instead of freezing the beam entirely.
 */
export const REDUCED_MOTION_SCALE = 3;

// Pauses every animation on an instance (wrapper + pseudo layers + bloom) when it
// carries the `data-paused` attribute. Driven by an IntersectionObserver so beams
// that are scrolled offscreen stop doing per-frame paint work entirely.
function frozenAnimRule(id) {
  return `
[data-rim="${id}"][data-paused],
[data-rim="${id}"][data-paused]::after,
[data-rim="${id}"][data-paused]::before,
[data-rim="${id}"][data-paused] [data-rim-glow] {
  animation-play-state: paused !important;
}`;
}

/** Slow continuous motion under prefers-reduced-motion (scale durations, don't freeze). */
function reducedMotionRule(id) {
  return `
@media (prefers-reduced-motion: reduce) {
  [data-rim="${id}"] {
    --rim-motion-scale: ${REDUCED_MOTION_SCALE};
  }
}`;
}

function motionDur(seconds) {
  return `calc(${seconds}s * var(--rim-motion-scale, 1))`;
}

// @property registrations for all per-instance pulse custom properties.
function breathePropertyRegs(id) {
  const numbers = ['bw1', 'bh1', 'bw2', 'bh2', 'bw3', 'bh3', 'bgh', 'bop-tl', 'bop-tr', 'bop-bl', 'bop-br'];
  const lengths = ['bx1', 'by1', 'bx2', 'by2', 'bx3', 'by3'];
  const numReg = numbers
    .map(
      n => `@property --${n}-${id} {\n  syntax: "<number>";\n  initial-value: 1;\n  inherits: true;\n}`
    )
    .join('\n\n');
  const lenReg = lengths
    .map(
      n => `@property --${n}-${id} {\n  syntax: "<length>";\n  initial-value: 0px;\n  inherits: true;\n}`
    )
    .join('\n\n');
  return `${numReg}\n\n${lenReg}\n\n@property --rim-opacity-${id} {\n  syntax: "<number>";\n  initial-value: 0;\n  inherits: true;\n}\n\n@property --rim-hue-${id} {\n  syntax: "<angle>";\n  initial-value: 0deg;\n  inherits: true;\n}`;
}

// ── Pulse breathing driver ───────────────────────────────────────────────────
// The breathing motion (size/drift/quadrant-opacity/height) and the slow hue
// drift used to run as ~15 per-instance CSS `@property` keyframe animations at
// the display refresh rate (60–120 Hz). Because each value feeds the painted
// gradients/filters, that meant repainting the breathing layers 60–120×/sec.
// The motion is very slow (1.6–6.4 s periods), so we instead drive the same CSS
// vars from a single shared requestAnimationFrame loop throttled to ~30 fps
// (see pulseDriver.js). This halves the paint frequency on 60 Hz displays and
// quarters it on 120 Hz, with no perceptible change to the breathing.

/** Theme/size/duration-tuned breathing parameters (shared by CSS + JS driver). */
function breatheParams(size, theme, duration) {
  const isDark = theme === 'dark';
  const durScale = duration / 2.3;
  if (size === 'pulse-inner') {
    return {
      sp: 0.28,
      dr: isDark ? 33 : 40,
      op: isDark ? 0.48 : 0.45,
      gh: isDark ? 0.34 : 0.22,
      bs: (isDark ? 1.9 : 2.6) * durScale,
      ss: (isDark ? 2.6 : 4.6) * durScale,
      ghs: (isDark ? 2.4 : 5.5) * durScale,
      // Full hue revolution period (seconds) - colors continuously cycle.
      huePeriod: 16,
    };
  }
  return {
    sp: isDark ? 0.28 : 0.36,
    dr: isDark ? 14 : 19,
    op: isDark ? 0.46 : 0,
    gh: isDark ? 0.16 : 0.58,
    bs: (isDark ? 2.3 : 3.7) * durScale,
    ss: (isDark ? 6.4 : 4.6) * durScale,
    ghs: (isDark ? 2.4 : 3.8) * durScale,
    // Full hue revolution period (seconds) - colors continuously cycle.
    huePeriod: 14,
  };
}

/** Build the oscillator table for an instance (matches the former keyframes). */
function breatheOscillators(id, p) {
  const { sp, dr, op, gh, bs, ss, ghs } = p;
  return [
    { prop: `--qw1-${id}`, a: 1 - sp, b: 1 + sp * 1.1, period: ss * 0.9, delay: 0, unit: '' },
    { prop: `--qh1-${id}`, a: 1 + sp * 0.9, b: 1 - sp * 0.85, period: ss * 1.26, delay: 0, unit: '' },
    { prop: `--qx1-${id}`, a: -dr, b: dr * 0.9, period: bs * 1.6, delay: 0, unit: 'px' },
    { prop: `--qy1-${id}`, a: dr * 0.55, b: -dr * 0.7, period: bs * 1.6, delay: 0, unit: 'px' },
    { prop: `--qw2-${id}`, a: 1 + sp, b: 1 - sp * 0.85, period: ss * 1.1, delay: 0, unit: '' },
    { prop: `--qh2-${id}`, a: 1 - sp * 0.8, b: 1 + sp * 1.05, period: ss * 0.81, delay: 0, unit: '' },
    { prop: `--qx2-${id}`, a: dr * 0.8, b: -dr * 0.9, period: bs * 1.88, delay: 0, unit: 'px' },
    { prop: `--qy2-${id}`, a: -dr, b: dr * 0.65, period: bs * 1.88, delay: 0, unit: 'px' },
    { prop: `--qw3-${id}`, a: 1 - sp * 0.6, b: 1 + sp * 1.15, period: ss * 0.98, delay: 0, unit: '' },
    { prop: `--qh3-${id}`, a: 1 + sp * 0.75, b: 1 - sp, period: ss * 1.4, delay: 0, unit: '' },
    { prop: `--qx3-${id}`, a: -dr * 0.6, b: dr, period: bs * 1.45, delay: 0, unit: 'px' },
    { prop: `--qy3-${id}`, a: -dr * 0.85, b: dr * 0.45, period: bs * 1.45, delay: 0, unit: 'px' },
    { prop: `--qgh-${id}`, a: 1 - gh, b: 1 + gh, period: ghs, delay: 0, unit: '' },
    { prop: `--qop-tl-${id}`, a: 1 - op, b: 1, period: bs, delay: 0, unit: '' },
    { prop: `--qop-tr-${id}`, a: 1 - op, b: 1, period: bs * 1.32, delay: bs * 0.28, unit: '' },
    { prop: `--qop-bl-${id}`, a: 1 - op, b: 1, period: bs * 0.84, delay: bs * 0.55, unit: '' },
    { prop: `--qop-br-${id}`, a: 1 - op, b: 1, period: bs * 1.58, delay: bs * 0.83, unit: '' },
  ];
}

/**
 * Returns the runtime config the JS driver needs to animate a pulse instance,
 * or null for non-pulse sizes. Kept in sync with the CSS by sharing breatheParams.
 */
export function buildPulseConfig(size, theme, duration, hueRange, staticColors, id) {
  if (size !== 'pulse-inner' && size !== 'pulse-outside') return null;
  const p = breatheParams(size, theme, duration);
  return {
    oscillators: breatheOscillators(id, p),
    // Pulse colors continuously rotate a full hue circle so the palette is never
    // pinned to fixed edges (no more "always red top-right / green left").
    hue: staticColors
      ? null
      : { prop: `--rim-hue-${id}`, range: 360, period: p.huePeriod, continuous: true },
  };
}

// Only the (short, one-shot) fade is still a CSS animation; the breathing is
// driven from JS so it can be frame-rate capped and paused offscreen.
function breatheWrapperAnim(id, fadeName, fadeDur) {
  return `  animation: ${fadeName}-${id} ${motionDur(fadeDur)} ease forwards;`;
}

/**
 * Generate complete CSS for a BeamBorder instance
 */
export function buildRimCSS(options) {
  const { size } = options;

  if (size === 'line') {
    return lineVariantCSS(options);
  }

  if (size === 'sm') {
    return smallVariantCSS(options);
  }

  if (size === 'pulse-inner') {
    return breatheInnerVariantCSS(options);
  }

  if (size === 'pulse-outside') {
    return breatheOuterVariantCSS(options);
  }

  return borderVariantCSS(options);
}

function smallVariantCSS(options) {
  const {
    id,
    borderRadius,
    borderWidth,
    duration,
    strokeOpacity,
    innerOpacity,
    bloomOpacity,
    innerShadow,
    colorVariant,
    staticColors,
    brightness,
    saturation,
    hueRange,
    theme,
  } = options;

  const innerRadius = Math.max(0, borderRadius - borderWidth);

  const monoOpacityMultiplier = colorVariant === 'mono' ? 0.5 : 1.0;
  const finalStrokeOpacity = strokeOpacity * monoOpacityMultiplier;
  const finalInnerOpacity = innerOpacity * monoOpacityMultiplier;
  const finalBloomOpacity = bloomOpacity * monoOpacityMultiplier;

  const hueShiftAnimation = staticColors
    ? ''
    : `animation: rim-hue-shift-${id} ${motionDur(12)} ease-in-out infinite;`;

  const hueShiftKeyframes = staticColors ? '' : `
@keyframes rim-hue-shift-${id} {
  0% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) + ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
}`;

  const isDark = theme === 'dark';

  const whiteGradient = isDark
    ? `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )`
    : `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`;

  const colorGradients = compactEdge(colorVariant);
  const innerGradients = compactCore(colorVariant);

  const bloomGradient = isDark
    ? `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )`
    : `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`;

  // Small variant uses wider mask to show more of the beam around the smaller element
  const smallMask = `conic-gradient(
    from var(--rim-angle-${id}),
    transparent 0%, transparent 22%,
    rgba(255, 255, 255, 0.12) 28%, rgba(255, 255, 255, 0.4) 36%,
    white 46%, white 82%,
    rgba(255, 255, 255, 0.4) 88%, rgba(255, 255, 255, 0.12) 94%,
    transparent 97%, transparent 100%
  )`;

  return `
@property --rim-angle-${id} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --rim-opacity-${id} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-rim="${id}"] {
  position: relative;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}

[data-rim="${id}"][data-active] {
  animation:
    rim-spin-${id} ${motionDur(duration)} linear infinite,
    rim-fade-in-${id} ${motionDur(0.6)} ease forwards;
}

[data-rim="${id}"][data-fading] {
  animation:
    rim-spin-${id} ${motionDur(duration)} linear infinite,
    rim-fade-out-${id} ${motionDur(0.5)} ease forwards;
}

[data-rim="${id}"][data-active]::after,
[data-rim="${id}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  padding: ${borderWidth}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${whiteGradient},${colorGradients};
  -webkit-mask:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--rim-opacity-${id}) * ${finalStrokeOpacity.toFixed(2)} * var(--rim-stroke-opacity, 1) * var(--rim-strength, 1));
  ${hueShiftAnimation}
}

[data-rim="${id}"][data-active]::before,
[data-rim="${id}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${innerGradients};
  box-shadow: inset 0 0 5px 1px ${innerShadow};
  -webkit-mask-image: ${smallMask};
  -webkit-mask-composite: source-over;
  mask-image: ${smallMask};
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--rim-opacity-${id}) * ${finalInnerOpacity.toFixed(2)} * var(--rim-inner-opacity, 1) * var(--rim-strength, 1));
  ${hueShiftAnimation}
}

[data-rim="${id}"] [data-rim-glow] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${bloomGradient};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${borderWidth}px;
  filter: blur(8px) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-rim="${id}"][data-active] [data-rim-glow],
[data-rim="${id}"][data-fading] [data-rim-glow] {
  display: block;
  opacity: calc(var(--rim-opacity-${id}) * ${finalBloomOpacity.toFixed(2)} * var(--rim-bloom-opacity, 1) * var(--rim-strength, 1));
}

@keyframes rim-spin-${id} {
  to { --rim-angle-${id}: 360deg; }
}

@keyframes rim-fade-in-${id} {
  to { --rim-opacity-${id}: 1; }
}

@keyframes rim-fade-out-${id} {
  from { --rim-opacity-${id}: 1; }
  to { --rim-opacity-${id}: 0; }
}
${hueShiftKeyframes}
${frozenAnimRule(id)}
${reducedMotionRule(id)}
`;
}

function borderVariantCSS(options) {
  const {
    id,
    borderRadius,
    borderWidth,
    duration,
    strokeOpacity,
    innerOpacity,
    bloomOpacity,
    colorVariant,
    staticColors,
    brightness,
    saturation,
    hueRange,
    theme,
  } = options;

  const innerRadius = Math.max(0, borderRadius - borderWidth);

  // Mono variant gets 50% lower opacity
  const monoOpacityMultiplier = colorVariant === 'mono' ? 0.5 : 1.0;
  const finalStrokeOpacity = strokeOpacity * monoOpacityMultiplier;
  const finalInnerOpacity = innerOpacity * monoOpacityMultiplier;
  const finalBloomOpacity = bloomOpacity * monoOpacityMultiplier;

  const hueShiftAnimation = staticColors
    ? ''
    : `animation: rim-hue-shift-${id} ${motionDur(12)} ease-in-out infinite;`;

  const hueShiftKeyframes = staticColors ? '' : `
@keyframes rim-hue-shift-${id} {
  0% { filter: blur(9px) hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  50% { filter: blur(9px) hue-rotate(calc(var(--rim-hue-base, 0deg) + ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  100% { filter: blur(9px) hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
}`;

  const isDark = theme === 'dark';

  const whiteGradient = isDark
    ? `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )`
    : `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`;

  const colorGradients = edgeLayer(colorVariant);
  const innerGradients = coreLayer(colorVariant);

  const bloomGradient = isDark
    ? `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )`
    : `conic-gradient(
        from var(--rim-angle-${id}),
        transparent 0%, transparent 50%,
        rgba(0, 0, 0, 0.02) 55%,
        rgba(0, 0, 0, 0.08) 60%,
        rgba(0, 0, 0, 0.2) 65%,
        rgba(0, 0, 0, 0.4) 68%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 71%,
        rgba(0, 0, 0, 0.4) 74%,
        rgba(0, 0, 0, 0.2) 78%,
        rgba(0, 0, 0, 0.08) 83%,
        rgba(0, 0, 0, 0.02) 88%,
        transparent 93%
      )`;

  return `
@property --rim-angle-${id} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --rim-opacity-${id} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-rim="${id}"] {
  position: relative;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}

[data-rim="${id}"][data-active] {
  animation:
    rim-spin-${id} ${motionDur(duration)} linear infinite,
    rim-fade-in-${id} ${motionDur(0.6)} ease forwards;
}

[data-rim="${id}"][data-fading] {
  animation:
    rim-spin-${id} ${motionDur(duration)} linear infinite,
    rim-fade-out-${id} ${motionDur(0.5)} ease forwards;
}

[data-rim="${id}"][data-active]::after,
[data-rim="${id}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  padding: ${borderWidth}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${whiteGradient},${colorGradients};
  -webkit-mask:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--rim-opacity-${id}) * ${finalStrokeOpacity.toFixed(2)} * var(--rim-stroke-opacity, 1) * var(--rim-strength, 1));
  ${hueShiftAnimation}
}

[data-rim="${id}"][data-active]::before,
[data-rim="${id}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  background: ${innerGradients};
  -webkit-mask-image:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 420px, transparent calc(100% - 420px), white),
    linear-gradient(to right, white, transparent 420px, transparent calc(100% - 420px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    conic-gradient(
      from var(--rim-angle-${id}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 420px, transparent calc(100% - 420px), white),
    linear-gradient(to right, white, transparent 420px, transparent calc(100% - 420px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--rim-opacity-${id}) * ${finalInnerOpacity.toFixed(2)} * var(--rim-inner-opacity, 1) * var(--rim-strength, 1));
  clip-path: inset(0 round ${borderRadius}px);
  ${hueShiftAnimation}
}

[data-rim="${id}"] [data-rim-glow] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${bloomGradient};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${borderWidth}px;
  filter: blur(20px) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-rim="${id}"][data-active] [data-rim-glow],
[data-rim="${id}"][data-fading] [data-rim-glow] {
  display: block;
  opacity: calc(var(--rim-opacity-${id}) * ${finalBloomOpacity.toFixed(2)} * var(--rim-bloom-opacity, 1) * var(--rim-strength, 1));
}

@keyframes rim-spin-${id} {
  to { --rim-angle-${id}: 360deg; }
}

@keyframes rim-fade-in-${id} {
  to { --rim-opacity-${id}: 1; }
}

@keyframes rim-fade-out-${id} {
  from { --rim-opacity-${id}: 1; }
  to { --rim-opacity-${id}: 0; }
}
${hueShiftKeyframes}
${frozenAnimRule(id)}
${reducedMotionRule(id)}
`;
}

/**
 * Pulse Inner - contained breathing glow.
 * A full colorful perimeter ring (::after), an inner perimeter glow with corner
 * accents (::before), and a soft blurred bloom, all clipped inside the element.
 */
function breatheInnerVariantCSS(options) {
  const {
    id, borderRadius, borderWidth, duration,
    strokeOpacity, innerOpacity, bloomOpacity,
    colorVariant, staticColors, brightness, saturation, theme,
  } = options;

  const isDark = theme === 'dark';

  const monoMul = colorVariant === 'mono' ? 0.5 : 1.0;
  const sStroke = (strokeOpacity * monoMul).toFixed(2);
  const sInner = (innerOpacity * monoMul).toFixed(2);
  const sBloom = (bloomOpacity * monoMul).toFixed(2);

  // Breathing parameters (theme-tuned). The motion itself is now driven from JS
  // (see buildPulseConfig / pulseDriver.js); only `op` is needed here to set
  // the frozen bloom's average alpha.
  const { op } = breatheParams('pulse-inner', theme, duration);
  const bloomBlur = 8;

  const b = brightness.toFixed(2);
  const s = saturation.toFixed(2);

  // Slow hue drift is driven into --rim-hue-<id> by the JS loop (capped fps),
  // so the breathing layers no longer repaint at the display refresh rate.
  const ringAnim = staticColors
    ? `filter: brightness(${b}) saturate(${s});`
    : `filter: hue-rotate(calc(var(--rim-hue-base, 0deg) + var(--rim-hue-${id}))) brightness(${b}) saturate(${s});`;
  // Bloom shares the SAME hue rotation as the ring so the wide glow and the tight
  // ring stay color-synced. Gradients keep frozen opacity; only hue-rotate varies.
  const bloomAnim = staticColors
    ? `filter: blur(${bloomBlur}px) brightness(${b}) saturate(${s});`
    : `filter: blur(${bloomBlur}px) hue-rotate(calc(var(--rim-hue-base, 0deg) + var(--rim-hue-${id}))) brightness(${b}) saturate(${s});`;

  const ringGradients = breatheRing(colorVariant, id);
  const innerGradients = breatheInner(colorVariant, id, isDark);
  // Frozen at the breathing time-average (midpoint of the [1-op, 1] opacity range).
  const bloomGradients = breatheTableStatic(BREATHE_INNER_BLOOM, colorVariant, 1 - op * 0.5);

  return `
${breathePropertyRegs(id)}

[data-rim="${id}"] {
  position: relative;
  border-radius: ${borderRadius}px;
  overflow: hidden;
  isolation: isolate;
}

[data-rim="${id}"][data-active] {
${breatheWrapperAnim(id, 'rim-fade-in', 0.6)}
}

[data-rim="${id}"][data-fading] {
${breatheWrapperAnim(id, 'rim-fade-out', 0.5)}
}

[data-rim="${id}"][data-active]::after,
[data-rim="${id}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  padding: ${borderWidth}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${ringGradients};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--rim-opacity-${id}) * ${sStroke} * var(--rim-stroke-opacity, 1) * var(--rim-strength, 1));
  ${ringAnim}
}

[data-rim="${id}"][data-active]::before,
[data-rim="${id}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${innerGradients};
  -webkit-mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  will-change: opacity, filter;
  opacity: calc(var(--rim-opacity-${id}) * ${sInner} * var(--rim-inner-opacity, 1) * var(--rim-strength, 1));
  ${ringAnim}
}

[data-rim="${id}"] [data-rim-glow] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${bloomGradients};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${borderWidth}px;
  pointer-events: none;
  z-index: 3;
  will-change: opacity;
  opacity: 0;
}

[data-rim="${id}"][data-active] [data-rim-glow],
[data-rim="${id}"][data-fading] [data-rim-glow] {
  display: block;
  opacity: calc(var(--rim-opacity-${id}) * ${sBloom} * var(--rim-bloom-opacity, 1) * var(--rim-strength, 1));
  ${bloomAnim}
}

@keyframes rim-fade-in-${id} { to { --rim-opacity-${id}: 1; } }
@keyframes rim-fade-out-${id} { from { --rim-opacity-${id}: 1; } to { --rim-opacity-${id}: 0; } }
${frozenAnimRule(id)}
${reducedMotionRule(id)}
`;
}

/**
 * Pulse Outside - outward-blooming breathing glow.
 * A crisp 1px colored stroke hugs the outer edge (::after), while the colorful
 * core (::before) and soft halo (bloom) radiate OUTWARD behind the element
 * (z-index:-1), so the glow spills outside and is never cropped.
 *
 * Requires the wrapped child to be opaque so the inner part is covered and only
 * the outward halo shows.
 */
function breatheOuterVariantCSS(options) {
  const {
    id, borderRadius, duration,
    strokeOpacity, innerOpacity, bloomOpacity,
    colorVariant, staticColors, brightness, saturation, theme,
    hairlineOpacity = 0,
  } = options;

  const isDark = theme === 'dark';

  const monoMul = colorVariant === 'mono' ? 0.5 : 1.0;
  const sStroke = (strokeOpacity * monoMul).toFixed(2);
  const sInner = (innerOpacity * monoMul).toFixed(2);
  const sBloom = (bloomOpacity * monoMul).toFixed(2);

  // A constant 1px hairline frames the element. It is painted on the inner 1px
  // ring of the border-box (same place a standard `inset 0 0 0 1px` component
  // border sits) so the beam hairline/stroke align with the wrapped element's
  // own hairline instead of floating 1px outside it.
  const hairRGB = isDark ? '70, 70, 70' : '0, 0, 0';
  const hairOp = hairlineOpacity.toFixed(2);
  const hairlineLine = `linear-gradient(rgba(${hairRGB}, ${hairOp}), rgba(${hairRGB}, ${hairOp}))`;

  // Breathing parameters (theme-tuned). The motion is driven from JS now
  // (buildPulseConfig / pulseDriver.js); only `op` is needed here for the
  // frozen bloom's average alpha.
  const { op } = breatheParams('pulse-outside', theme, duration);

  // Theme-dependent outward-glow constants.
  const sw = 0.95; // glow width size
  const sh = 0.9; // glow height size (same in both themes)
  const glowBlur = isDark ? 3 : 6;
  const bloomBlur = isDark ? 22.5 : 15;

  const b = brightness.toFixed(2);
  const s = saturation.toFixed(2);

  // Slow hue drift is driven into --rim-hue-<id> by the JS loop (capped fps).
  const strokeAnim = staticColors
    ? `filter: brightness(${b}) saturate(${s});`
    : `filter: hue-rotate(calc(var(--rim-hue-base, 0deg) + var(--rim-hue-${id}))) brightness(${b}) saturate(${s});`;
  // Consumer hooks (--rim-core-blur / --rim-bloom-blur / --rim-glow-brightness /
  // --rim-glow-saturate) let integrators tune the glow WITHOUT overriding the whole
  // `filter` - replacing it externally would drop the hue-rotate term and desync the
  // glow colors from the stroke ring.
  const glowBright = `brightness(var(--rim-glow-brightness, ${b})) saturate(var(--rim-glow-saturate, ${s}))`;
  const coreAnim = staticColors
    ? `filter: blur(var(--rim-core-blur, ${glowBlur}px)) ${glowBright};`
    : `filter: blur(var(--rim-core-blur, ${glowBlur}px)) hue-rotate(calc(var(--rim-hue-base, 0deg) + var(--rim-hue-${id}))) ${glowBright};`;
  // Bloom (large halo) shares the SAME hue rotation as the core/stroke so the
  // wide glow and the tight glow stay in color sync (most visible on blue/green).
  // Its gradients keep frozen opacity, so only the cheap hue-rotate varies.
  const bloomAnim = staticColors
    ? `filter: blur(var(--rim-bloom-blur, ${bloomBlur}px)) ${glowBright};`
    : `filter: blur(var(--rim-bloom-blur, ${bloomBlur}px)) hue-rotate(calc(var(--rim-hue-base, 0deg) + var(--rim-hue-${id}))) ${glowBright};`;

  const strokeGradients = breatheTable(BREATHE_OUTER_CORE, colorVariant, id);
  const coreGradients = breatheTable(BREATHE_OUTER_CORE, colorVariant, id);
  // Frozen at the breathing time-average (midpoint of the [1-op, 1] opacity range).
  const bloomGradients = breatheTableStatic(BREATHE_OUTER_BLOOM, colorVariant, 1 - op * 0.5);
  // Paint a static hairline in the SAME masked ring as the stroke glow so their
  // position and anti-aliasing always match exactly.
  const strokeBackground = hairlineOpacity > 0
    ? `${strokeGradients},
    ${hairlineLine}`
    : strokeGradients;

  return `
${breathePropertyRegs(id)}

[data-rim="${id}"] {
  position: relative;
  border-radius: ${borderRadius}px;
  overflow: visible;
  isolation: isolate;
}

[data-rim="${id}"][data-active] {
${breatheWrapperAnim(id, 'rim-fade-in', 0.6)}
}

[data-rim="${id}"][data-fading] {
${breatheWrapperAnim(id, 'rim-fade-out', 0.5)}
}
${hairlineOpacity > 0 ? `
/* Idle hairline - painted above the (opaque) child in the inner 1px edge ring so
   it overlaps a standard inset component border exactly. */
[data-rim="${id}"]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  padding: 1px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${hairlineLine};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
}
` : ''}
[data-rim="${id}"][data-active]::after,
[data-rim="${id}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  padding: 1px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${strokeBackground};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--rim-opacity-${id}) * ${sStroke} * var(--rim-stroke-opacity, 1) * var(--rim-strength, 1));
  ${strokeAnim}
}

[data-rim="${id}"][data-active]::before,
[data-rim="${id}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: -10px;
  z-index: -1;
  border-radius: ${borderRadius + 10}px;
  background: ${coreGradients};
  transform: scale(${sw}, ${sh});
  pointer-events: none;
  will-change: opacity, filter;
  opacity: calc(var(--rim-opacity-${id}) * ${sInner} * var(--rim-inner-opacity, 1) * var(--rim-strength, 1));
  ${coreAnim}
}

[data-rim="${id}"] [data-rim-glow] {
  display: none;
  position: absolute;
  inset: -30px;
  z-index: -1;
  border-radius: ${borderRadius + 30}px;
  background: ${bloomGradients};
  transform: scale(${sw}, ${sh});
  pointer-events: none;
  will-change: transform;
  opacity: 0;
}

[data-rim="${id}"][data-active] [data-rim-glow],
[data-rim="${id}"][data-fading] [data-rim-glow] {
  display: block;
  opacity: calc(var(--rim-opacity-${id}) * ${sBloom} * var(--rim-bloom-opacity, 1) * var(--rim-strength, 1));
  ${bloomAnim}
}

@keyframes rim-fade-in-${id} { to { --rim-opacity-${id}: 1; } }
@keyframes rim-fade-out-${id} { from { --rim-opacity-${id}: 1; } to { --rim-opacity-${id}: 0; } }
${frozenAnimRule(id)}
${reducedMotionRule(id)}
`;
}

function lineVariantCSS(options) {
  const {
    id,
    borderRadius,
    borderWidth,
    duration,
    strokeOpacity,
    innerOpacity,
    bloomOpacity,
    innerShadow,
    colorVariant,
    staticColors,
    brightness,
    saturation,
    hueRange,
    theme,
  } = options;

  const innerRadius = Math.max(0, borderRadius - borderWidth);
  const isDark = theme === 'dark';

  const finalStrokeOpacity = strokeOpacity;
  const finalInnerOpacity = innerOpacity;
  const finalBloomOpacity = bloomOpacity;

  const hueShiftAnimation = staticColors
    ? ''
    : `animation: rim-hue-shift-${id} ${motionDur(12)} ease-in-out infinite;`;

  const hueShiftBloomAnimation = staticColors
    ? ''
    : `animation: rim-hue-shift-bloom-${id} ${motionDur(8)} ease-in-out infinite;`;

  const hueShiftKeyframes = staticColors ? '' : `
@keyframes rim-hue-shift-${id} {
  0% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  50% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) + ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  100% { filter: hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
}

@keyframes rim-hue-shift-bloom-${id} {
  0% { filter: blur(8px) hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange + 10}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  50% { filter: blur(8px) hue-rotate(calc(var(--rim-hue-base, 0deg) + ${hueRange + 10}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
  100% { filter: blur(8px) hue-rotate(calc(var(--rim-hue-base, 0deg) - ${hueRange + 10}deg)) brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}); }
}`;

  const whiteHighlight = isDark
    ? `radial-gradient(
        ellipse calc(24px * var(--rim-w-${id})) calc(28px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) calc(100% + 2px),
        rgba(255, 255, 255, 0.38) 0%,
        rgba(255, 255, 255, 0.12) 30%,
        transparent 65%
      )`
    : `radial-gradient(
        ellipse calc(35px * var(--rim-w-${id})) calc(28px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) calc(100% + 2px),
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.25) 35%,
        transparent 70%
      )`;

  const colorGradients = traceEdge(colorVariant, isDark, id);
  const innerGradients = traceCore(colorVariant, id);

  const bloomGradients = traceBloom(colorVariant, isDark, id);
  const monoBloomBlur = colorVariant === 'mono' ? 'filter: blur(6px);' : '';

  return `
@property --rim-x-${id} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

@property --rim-w-${id} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --rim-h-${id} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --rim-spike-${id} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --rim-spike2-${id} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --rim-edge-${id} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --rim-opacity-${id} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-rim="${id}"] {
  position: relative;
  border-radius: ${borderRadius}px;
  overflow: hidden;
}

[data-rim="${id}"][data-active] {
  animation:
    rim-travel-${id} ${motionDur(duration)} linear infinite,
    rim-edge-fade-${id} ${motionDur(duration)} linear infinite,
    rim-breathe-${id} ${motionDur((duration * 1.3).toFixed(1))} ease-in-out infinite,
    rim-spike-${id} ${motionDur((duration * 1.33).toFixed(1))} ease-in-out infinite,
    rim-spike2-${id} ${motionDur((duration * 1.7).toFixed(1))} ease-in-out infinite,
    rim-fade-in-${id} ${motionDur(0.6)} ease forwards;
}

[data-rim="${id}"][data-fading] {
  animation:
    rim-travel-${id} ${motionDur(duration)} linear infinite,
    rim-edge-fade-${id} ${motionDur(duration)} linear infinite,
    rim-breathe-${id} ${motionDur((duration * 1.3).toFixed(1))} ease-in-out infinite,
    rim-spike-${id} ${motionDur((duration * 1.33).toFixed(1))} ease-in-out infinite,
    rim-spike2-${id} ${motionDur((duration * 1.7).toFixed(1))} ease-in-out infinite,
    rim-fade-out-${id} ${motionDur(0.5)} ease forwards;
}

[data-rim="${id}"][data-active]::after,
[data-rim="${id}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  padding: ${borderWidth}px;
  clip-path: inset(0 round ${borderRadius}px);
  background: ${whiteHighlight}, ${colorGradients};
  -webkit-mask:
    radial-gradient(
      ellipse calc(78px * var(--rim-w-${id})) calc(60px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    radial-gradient(
      ellipse calc(78px * var(--rim-w-${id})) calc(60px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--rim-opacity-${id}) * var(--rim-edge-${id}) * ${finalStrokeOpacity.toFixed(2)} * var(--rim-stroke-opacity, 1) * var(--rim-strength, 1));
  ${hueShiftAnimation}
}

[data-rim="${id}"][data-active]::before,
[data-rim="${id}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${borderRadius}px;
  background: ${innerGradients};
  box-shadow: inset 0 0 9px 1px ${innerShadow};
  -webkit-mask-image:
    radial-gradient(
      ellipse calc(78px * var(--rim-w-${id})) calc(60px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    radial-gradient(
      ellipse calc(78px * var(--rim-w-${id})) calc(60px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--rim-opacity-${id}) * var(--rim-edge-${id}) * ${finalInnerOpacity.toFixed(2)} * var(--rim-inner-opacity, 1) * var(--rim-strength, 1));
  clip-path: inset(0 round ${borderRadius}px);
  ${hueShiftAnimation}
}

[data-rim="${id}"] [data-rim-glow] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${innerRadius}px;
  clip-path: inset(0 round ${borderRadius}px);
  padding: 0;
  -webkit-mask: radial-gradient(
    ellipse calc(84px * var(--rim-w-${id})) calc(110px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  -webkit-mask-composite: source-over;
  mask: radial-gradient(
    ellipse calc(84px * var(--rim-w-${id})) calc(110px * var(--rim-h-${id})) at calc(var(--rim-x-${id}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  mask-composite: add;
  background: ${bloomGradients};
  ${monoBloomBlur}
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-rim="${id}"][data-active] [data-rim-glow],
[data-rim="${id}"][data-fading] [data-rim-glow] {
  display: block;
  opacity: calc(var(--rim-opacity-${id}) * var(--rim-edge-${id}) * ${finalBloomOpacity.toFixed(2)} * var(--rim-bloom-opacity, 1) * var(--rim-strength, 1));
  ${hueShiftBloomAnimation}
}

@keyframes rim-travel-${id} {
  0%   { --rim-x-${id}: 0.06;  --rim-w-${id}: 0.5; }
  10%  { --rim-x-${id}: 0.15;  --rim-w-${id}: 0.8; }
  20%  { --rim-x-${id}: 0.25;  --rim-w-${id}: 1.1; }
  30%  { --rim-x-${id}: 0.35;  --rim-w-${id}: 1.3; }
  40%  { --rim-x-${id}: 0.44;  --rim-w-${id}: 1.45; }
  50%  { --rim-x-${id}: 0.5;   --rim-w-${id}: 1.5; }
  60%  { --rim-x-${id}: 0.56;  --rim-w-${id}: 1.45; }
  70%  { --rim-x-${id}: 0.65;  --rim-w-${id}: 1.3; }
  80%  { --rim-x-${id}: 0.75;  --rim-w-${id}: 1.1; }
  90%  { --rim-x-${id}: 0.85;  --rim-w-${id}: 0.8; }
  100% { --rim-x-${id}: 0.94;  --rim-w-${id}: 0.5; }
}

@keyframes rim-edge-fade-${id} {
  0%    { --rim-edge-${id}: 0; }
  12.5% { --rim-edge-${id}: 0; }
  32.5% { --rim-edge-${id}: 1; }
  67.5% { --rim-edge-${id}: 1; }
  87.5% { --rim-edge-${id}: 0; }
  100%  { --rim-edge-${id}: 0; }
}

@keyframes rim-breathe-${id} {
  0%, 100% { --rim-h-${id}: 0.8; }
  25%      { --rim-h-${id}: 1.25; }
  55%      { --rim-h-${id}: 0.85; }
  80%      { --rim-h-${id}: 1.3; }
}

@keyframes rim-spike-${id} {
  0%   { --rim-spike-${id}: 0.8; }
  25%  { --rim-spike-${id}: 1.3; }
  50%  { --rim-spike-${id}: 0.9; }
  75%  { --rim-spike-${id}: 1.4; }
  100% { --rim-spike-${id}: 0.8; }
}

@keyframes rim-spike2-${id} {
  0%   { --rim-spike2-${id}: 1.2; }
  25%  { --rim-spike2-${id}: 0.7; }
  50%  { --rim-spike2-${id}: 1.4; }
  75%  { --rim-spike2-${id}: 0.8; }
  100% { --rim-spike2-${id}: 1.2; }
}

@keyframes rim-fade-in-${id} {
  to { --rim-opacity-${id}: 1; }
}

@keyframes rim-fade-out-${id} {
  from { --rim-opacity-${id}: 1; }
  to { --rim-opacity-${id}: 0; }
}
${hueShiftKeyframes}
${frozenAnimRule(id)}
${reducedMotionRule(id)}
`;
}

/**
 * Shared breathing driver for the Pulse effects.
 *
 * The pulse breathing (size / drift / per-quadrant opacity / height) and the
 * slow hue drift used to run as ~15 per-instance CSS `@property` keyframe
 * animations at the display refresh rate (60–120 Hz). Because each value feeds
 * the painted gradients/filters, that repainted the breathing layers 60–120×/s.
 *
 * The motion is very slow (1.6–6.4 s periods), so instead every registered
 * instance is driven from a SINGLE shared requestAnimationFrame loop throttled
 * to ~30 fps. This halves the paint frequency on 60 Hz displays and quarters it
 * on 120 Hz, with no perceptible change to the breathing.
 *
 * Each oscillator ping-pongs a CSS custom property between `a` and `b` with an
 * ease-in-out (cosine) curve over `period` seconds, offset by `delay` seconds so
 * otherwise-identical oscillators desync (matching the former CSS keyframes +
 * animation-delay).
 */

export interface PulseOscillator {
  prop: string;
  a: number;
  b: number;
  period: number;
  delay: number;
  unit: string;
}

export interface PulseDriverConfig {
  oscillators: PulseOscillator[];
  hue: { prop: string, range: number, period: number, continuous: boolean } | null;
}

interface PulseEntry {
  el: HTMLElement;
  config: PulseDriverConfig;
}

const activeSet = new Set<PulseEntry>();

let frameHandle: number | null = null;
let lastTick = 0;

// ~30 fps. Subtract a small slack so a tick that lands a hair early still runs.
const MIN_TICK_GAP = 1000 / 30 - 2;
const TAU = Math.PI * 2;

/** Cosine ease-in-out factor in [0, 1]: 0 at phase 0/1, 1 at phase 0.5. */
function easeCycle(phase: number): number {
  return (1 - Math.cos(TAU * phase)) / 2;
}

function tick(ts: number) {
  frameHandle = requestAnimationFrame(tick);
  if (ts - lastTick < MIN_TICK_GAP) return;
  lastTick = ts;

  const tSec = ts / 1000;

  activeSet.forEach(({ el, config }) => {
    for (const osc of config.oscillators) {
      // Match CSS animation-delay semantics: a positive delay starts later.
      const phase = (tSec - osc.delay) / osc.period;
      const value = osc.a + (osc.b - osc.a) * easeCycle(phase);
      el.style.setProperty(
        osc.prop,
        osc.unit === 'px' ? `${value.toFixed(2)}px` : value.toFixed(4)
      );
    }

    if (config.hue) {
      const { prop, range, period, continuous } = config.hue;
      // `continuous` rotates a full circle (0→range, looping) so every color
      // sweeps through every edge; otherwise drift between -range and +range.
      const value = continuous
        ? ((tSec / period) % 1) * range
        : -range + 2 * range * easeCycle(tSec / period);
      el.style.setProperty(prop, `${value.toFixed(2)}deg`);
    }
  });
}

function ensureLoop() {
  if (frameHandle == null) {
    lastTick = 0;
    frameHandle = requestAnimationFrame(tick);
  }
}

function haltIfEmpty() {
  if (activeSet.size === 0 && frameHandle != null) {
    cancelAnimationFrame(frameHandle);
    frameHandle = null;
  }
}

/**
 * Register an element to be driven by the shared pulse loop.
 *
 * @param config - config from buildPulseConfig() in styles.js
 * @returns cleanup function that unregisters the entry (and
 *          stops the shared loop once no entries remain).
 */
export function attachPulse(el: HTMLElement, config: PulseDriverConfig): () => void {
  const entry = { el, config };
  activeSet.add(entry);
  ensureLoop();
  return () => {
    activeSet.delete(entry);
    haltIfEmpty();
  };
}

// Runs synchronously before the browser paints on the client, but degrades to a
// no-op-safe useEffect on the server (avoids the SSR useLayoutEffect warning).
const useBrowserLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

function usePreferredScheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return theme;
}

function usePrefersReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;

    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    // matchMedia isn't available during SSR, so the real value can only be
    // read after mount - this can't be a lazy useState initializer without
    // risking a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduceMotion;
}

function pickTheme(theme: 'dark' | 'light' | 'auto', schemeName: 'dark' | 'light'): 'dark' | 'light' {
  return theme === 'auto' ? schemeName : theme;
}

/**
 * BeamBorder component - Animated border beam effect for React (JSX + Tailwind)
 *
 * Sizes:
 *   Rotate family: 'sm' | 'md' (default) | 'line'
 *   Pulse family:  'pulse-outside' | 'pulse-inner'
 * Color variants: 'colorful' (default) | 'mono' | 'ocean' | 'sunset'
 * Theme: 'dark' (default) | 'light' | 'auto'
 *
 * Static layout on the wrapper/bloom is handled with Tailwind utilities below;
 * the animated gradient system is per-instance generated CSS (see styles.js) -
 * that part cannot be expressed with Tailwind classes.
 *
 * @example
 * ```jsx
 * <BeamBorder>
 *   <Card>Content</Card>
 * </BeamBorder>
 * ```
 */
export type BeamBorderProps = {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'line' | 'pulse-outside' | 'pulse-inner';
  colorVariant?: 'colorful' | 'mono' | 'ocean' | 'sunset';
  theme?: 'dark' | 'light' | 'auto';
  staticColors?: boolean;
  duration?: number;
  active?: boolean;
  borderRadius?: number;
  brightness?: number;
  saturation?: number;
  hueRange?: number;
  strength?: number;
  beamWidth?: number;
  className?: string;
  style?: CSSProperties;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onAnimationEnd?: (e: AnimationEvent<HTMLDivElement>) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style' | 'className' | 'onAnimationEnd'>;

export const BeamBorder = forwardRef<HTMLDivElement, BeamBorderProps>(function BeamBorder(
  {
    children,
    size = 'md',
    colorVariant = 'sunset',
    theme = 'light',
    duration,
    active = true,
    borderRadius: customBorderRadius,
    brightness: brightnessProp,
    saturation,
    strength = 1,
    beamWidth,
    className,
    style,
    onActivate,
    onDeactivate,
    onAnimationEnd: consumerOnAnimationEnd,
    ...props
  },
  ref
) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '-');
  const schemeName = usePreferredScheme();
  const reduceMotion = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);

  const [isOn, setIsOn] = useState(active);
  const [isClosing, setIsClosing] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [autoRadius, setAutoRadius] = useState<number | null>(null);
  const [glowScale, setGlowScale] = useState({ x: 1, y: 1 });

  // Auto-detect child border radius when no explicit value is provided.
  // useLayoutEffect so the detected radius is applied before the browser paints
  // the first frame - otherwise the beam paints square, then snaps to the child's
  // radius a frame later (a visible corner "glitch" on reload).
  useBrowserLayoutEffect(() => {
    if (customBorderRadius != null) return;
    const el = hostRef.current;
    if (!el) return;

    const detect = () => {
      const child = el.firstElementChild;
      if (!child) return;
      const computed = getComputedStyle(child);
      const raw = parseFloat(computed.borderTopLeftRadius);
      if (!isNaN(raw) && raw > 0) {
        setAutoRadius(raw);
      }
    };

    detect();

    // Re-detect if child layout changes (e.g. CSS loaded late)
    const observer = new MutationObserver(detect);
    observer.observe(el, { childList: true, subtree: false });
    return () => observer.disconnect();
  }, [customBorderRadius, children]);

  // Sync isOn/isClosing to the active prop. Pure derived state (no browser
  // API), so it's adjusted directly during render instead of via an effect.
  if (active && !isOn && !isClosing) {
    setIsOn(true);
  } else if (!active && isOn && !isClosing) {
    setIsClosing(true);
  }

  // Pause the (paint-heavy) animations while the element is scrolled offscreen.
  // This stops per-frame painting entirely for hidden instances without changing
  // their logical active/fading state, so it never fires onActivate/onDeactivate.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      // Start animating slightly before the element scrolls into view.
      { rootMargin: '256px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset glowScale when leaving pulse-outside. Pure derived state (no
  // browser API), so it's adjusted directly during render instead of via an
  // effect.
  if (size !== 'pulse-outside' && (glowScale.x !== 1 || glowScale.y !== 1)) {
    setGlowScale({ x: 1, y: 1 });
  }

  // Pulse Outside glow geometry is authored in fixed pixels for a reference
  // element (~350x140). Measure the actual wrapped element and scale the glow
  // per-axis so the halo grows/shrinks to fit any component it's applied to.
  useEffect(() => {
    if (size !== 'pulse-outside') {
      return;
    }

    const el = hostRef.current;
    if (!el) return;

    const REF_WIDTH = 350;
    const REF_HEIGHT = 140;
    // Allow the glow to both shrink (small buttons) and grow (large cards),
    // with generous bounds to avoid degenerate geometry at the extremes.
    const MIN_SCALE = 0.35;
    const MAX_SCALE = 4;
    const clamp = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));

    const measure = () => {
      const child = el.firstElementChild;
      if (!child) return;
      const rect = child.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = +clamp(rect.width / REF_WIDTH).toFixed(3);
      const y = +clamp(rect.height / REF_HEIGHT).toFixed(3);
      setGlowScale(prev => (prev.x === x && prev.y === y ? prev : { x, y }));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;

    const child = el.firstElementChild;
    if (!child) return;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(child);
    return () => resizeObserver.disconnect();
  }, [size, children]);

  const onAnimEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      const animationName = e.animationName;

      if (animationName.includes('fade-out')) {
        setIsOn(false);
        setIsClosing(false);
        onDeactivate?.();
      } else if (animationName.includes('fade-in')) {
        onActivate?.();
      }

      consumerOnAnimationEnd?.(e);
    },
    [onActivate, onDeactivate, consumerOnAnimationEnd]
  );

  const activeTheme = pickTheme(theme, schemeName);
  // Preset shapes differ slightly per size (not every size defines
  // brightness/hairlineOpacity), so this is treated as an honest loose bag.
  const finish = themePresets[size][activeTheme] as Record<string, number | string | undefined>;
  const dims = dimensionPresets[size];

  const isBreathe = size === 'pulse-inner' || size === 'pulse-outside';

  // Radius is driven solely by the wrapped child (its Tailwind `rounded-*`),
  // detected at runtime - the beam no longer imposes its own preset radius.
  // Falls back to 0 only for the pre-detection frame.
  const radius = customBorderRadius ?? autoRadius ?? 0;
  const cycle = duration ?? (size === 'line' ? 3.1 : isBreathe ? 2.3 : 1.96);
  const finalBorderWidth = beamWidth ?? dims.borderWidth;
  const sat = saturation ?? finish.saturation;
  const bright = brightnessProp ?? finish.brightness ?? 1.3;
  const hueSpan = size === 'line' ? 13 : 30;
  const frozen = colorVariant === 'mono';

  const instanceCSS = useMemo(
    () =>
      buildRimCSS({
        id,
        borderRadius: radius,
        borderWidth: finalBorderWidth,
        duration: cycle,
        strokeOpacity: finish.strokeOpacity,
        innerOpacity: finish.innerOpacity,
        bloomOpacity: finish.bloomOpacity,
        innerShadow: finish.innerShadow,
        size,
        colorVariant,
        staticColors: frozen,
        brightness: bright,
        saturation: sat,
        hueRange: hueSpan,
        theme: activeTheme,
        hairlineOpacity: finish.hairlineOpacity,
      }),
    [
      id,
      radius,
      finalBorderWidth,
      cycle,
      finish.strokeOpacity,
      finish.innerOpacity,
      finish.bloomOpacity,
      finish.innerShadow,
      finish.hairlineOpacity,
      size,
      colorVariant,
      frozen,
      bright,
      sat,
      hueSpan,
      activeTheme,
    ]
  );

  // Runtime config for the JS breathing driver (null for non-pulse sizes).
  // Under reduced motion, stretch oscillator/hue periods instead of freezing.
  const pulseConfig = useMemo(() => {
    if (!isBreathe) return null;
    const base = buildPulseConfig(size, activeTheme, cycle, hueSpan, frozen, id);
    if (!base || !reduceMotion) return base;
    return {
      oscillators: base.oscillators.map((osc: any) => ({
        ...osc,
        period: osc.period * REDUCED_MOTION_SCALE,
        delay: osc.delay * REDUCED_MOTION_SCALE,
      })),
      hue: base.hue
        ? { ...base.hue, period: base.hue.period * REDUCED_MOTION_SCALE }
        : null,
    };
  }, [isBreathe, size, activeTheme, cycle, hueSpan, frozen, id, reduceMotion]);

  // Drive the Pulse breathing from the shared, fps-capped rAF loop while the
  // instance is on and onscreen.
  useEffect(() => {
    if (!pulseConfig) return;
    if (!(isOn || isClosing) || !onScreen) return;

    const el = hostRef.current;
    if (!el) return;

    return attachPulse(el, pulseConfig);
  }, [pulseConfig, isOn, isClosing, onScreen]);

  const assignRef = useCallback(
    (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const rootStyle = {
    ...(style ?? {}),
    '--rim-strength': Math.max(0, Math.min(1, strength)),
    ...(size === 'pulse-outside'
      ? { '--pulse-scale-x': glowScale.x, '--pulse-scale-y': glowScale.y }
      : {}),
  } as CSSProperties & Record<string, string | number>;

  // Static layout via Tailwind. The dynamic border-radius, gradients, masks, and
  // keyframes live in the generated <style> (they can't be Tailwind utilities).
  const layoutClasses =
    size === 'pulse-outside'
      ? 'relative isolate overflow-visible'
      : isBreathe
        ? 'relative isolate overflow-hidden'
        : 'relative overflow-hidden';

  const rootClassName = [layoutClasses, className].filter(Boolean).join(' ');

  return (
    <>
      <style>{instanceCSS}</style>
      <div
        {...props}
        ref={assignRef}
        data-rim={id}
        data-active={isOn && !isClosing ? '' : undefined}
        data-fading={isClosing ? '' : undefined}
        data-paused={isOn && !isClosing && !onScreen ? '' : undefined}
        className={rootClassName}
        style={rootStyle}
        onAnimationEnd={onAnimEnd}
      >
        {children}
        <div data-rim-glow className="pointer-events-none" />
      </div>
    </>
  );
});

type BorderBeamProps = Pick<BeamBorderProps, 'size' | 'colorVariant' | 'theme' | 'active' | 'strength' | 'duration' | 'beamWidth'> & {
  backgroundColor?: string
}

const cardData = {
  label: 'More offers',
  title: 'There is something else for you',
  description:
    'Animated edge light keeps the feature surface alive while the content stays calm and readable.',
  buttonLabel: 'Shop',
  buttonValue: 'All products',
  size: 'md',
  colorVariant: 'colorful',
  strength: 2,
} as const

export default function BorderBeam({
  size = cardData.size,
  colorVariant = cardData.colorVariant,
  theme = "auto",
  active = true,
  strength = cardData.strength,
  duration = 3.3,
  beamWidth = 9,
  backgroundColor = "#212121",
}: BorderBeamProps) {
  return (
    <BeamBorder
      size={size}
      colorVariant={colorVariant}
      theme={theme}
      active={active}
      strength={strength}
      duration={duration}
      beamWidth={beamWidth}
      className="h-full"
    >
      <div
        className="relative flex h-full min-h-0 overflow-hidden rounded-[10px] p-9 text-white shadow-[0_26px_60px_rgba(15,23,42,0.18)] max-sm:p-7"
        style={{ backgroundColor }}
      >
        <div className="relative z-10 flex flex-col">
          <p className="text-[0.9vw] max-md:text-[3vw] font-bold uppercase tracking-[0.12em] text-[#66D933] max-[1025px]:text-[3vw]">
            {cardData.label}
          </p>
          <h2 className="mt-4 text-[4.5vw] max-w-[60%] font-normal leading-[1.14] text-white max-sm:text-[6vw] max-[1025px]:text-[7vw]">
            {cardData.title}
          </h2>
        </div>

        <div className="absolute bottom-0 right-[-20%] h-[30vw] w-[40vw]  max-sm:right-[-44px] max-sm:scale-90 max-md:h-[50vw] max-md:w-[60vw] max-[1025px]:h-[50vw] max-[1025px]:w-[60vw] max-[1025px]:right-[-10%]">
          <Image
            src="/assets/img/earbud.png"
            alt="earbud"
            fill
            sizes="(max-width: 1024px) 280px, 250px"
            className="object-contain object-bottom"
            priority
          />
        </div>

        <button className="absolute bottom-8 left-9 z-10 flex min-w-[158px] items-center justify-between rounded-[12px] bg-white px-4 py-3 text-left text-black shadow-[0_18px_35px_rgba(0,0,0,0.16)] max-sm:left-7">
          <span>
            <span className="block text-[0.75vw] uppercase tracking-[0.04em] text-[#8E8E93] max-md:text-[2.5vw] max-[1025px]:text-[1.5vw]">
              {cardData.buttonLabel}
            </span>
            <span className="block text-[1.5vw] leading-tight text-[#1C1C1E] max-md:text-[3vw] max-[1025px]:text-[2.5vw]">
              {cardData.buttonValue}
            </span>
          </span>
          <span className="ml-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
          </span>
        </button>
      </div>
    </BeamBorder>
  )
}
