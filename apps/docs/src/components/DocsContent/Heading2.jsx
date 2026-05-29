"use client";

import React from "react";
import { fadeUp} from "../Animations/gsapAnimations";

export default function Heading2({ children, text, className, ...props }) {
  fadeUp();
  return (
    <h2
      className={[
        "relative font-display text-2xl md:text-3xl font-semibold tracking-tighter text-foreground mt-10 pt-6 first:mt-0 first:pt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className="docs-heading2-line absolute left-0 right-0 top-0 h-px bg-border/30 lineDraw block"
      />
      
        <span className="relative inline-block fadeup">{children ?? text}</span>
      
    </h2>
  );
}
