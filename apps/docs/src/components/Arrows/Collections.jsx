"use client";

import React, { useState } from "react";
import Arrows from "./Arrows";
import ArrowsOpacity from "./ArrowsOpacity";
import ArrowsLimit from "./ArrowsLimit";
import ArrowsPlay from "./ArrowsPlay";
import Lines from "./Lines";
import Points from "./Points";

const variations = [
  {
    id: "dynamic-arrow",
    label: "Dynamic Arrow",
    theme: "light",
    frameClassName: "border-black/15 bg-white",
    component: Arrows,
  },
  {
    id: "dynamic-opacity",
    label: "Opacity",
    theme: "light",
    frameClassName: "border-black/15 bg-white",
    component: ArrowsOpacity,
  },
  {
    id: "smooth-response",
    label: "Smooth",
    theme: "dark",
    frameClassName: "border-white/15 bg-black",
    component: ArrowsLimit,
  },
  {
    id: "particle-morph",
    label: "Particle",
    theme: "light",
    frameClassName: "border-black/15 bg-white",
    component: Points,
  },
  {
    id: "vector-lines",
    label: "Lines",
    theme: "light",
    frameClassName: "border-black/15 bg-white",
    component: Lines,
  },
  {
    id: "playful-arrows",
    label: "Play",
    theme: "dark",
    frameClassName: "border-white/15 bg-black",
    component: ArrowsPlay,
  },
];

const Collections = () => {
  const [active, setActive] = useState(variations[0].id);

  const activeVariation =
    variations.find((variation) => variation.id === active) ?? variations[0];
  const ActiveComponent = activeVariation.component;
  const isDark = activeVariation.theme === "dark";

  return (
    <div
      className={`min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto flex w-full max-w-350 justify-center">
          <div
            className={`inline-flex flex-wrap justify-center gap-2 rounded-full border p-2 backdrop-blur-sm ${
              isDark
                ? "border-white/15 bg-white/5"
                : "border-black/10 bg-black/30"
            }`}
          >
            {variations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => setActive(variation.id)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all duration-200 sm:px-5 ${
                  active === variation.id
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : isDark
                      ? "bg-transparent text-white/70 hover:text-white"
                      : "bg-transparent text-black/60 hover:text-black"
                }`}
              >
                {variation.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-6 sm:py-8">
          <div
            className={`h-[78vh] w-full max-w-350 overflow-hidden rounded-[28px] border transition-colors duration-300 ${activeVariation.frameClassName}`}
          >
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
