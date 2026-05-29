"use client";

import React from "react";
import Copy from "../Animations/Copy";

export default function Para({ children, text, className, ...props }) {
  return (
    <Copy>
    <p
      className={["font-sans text-base md:text-lg leading-relaxed text-muted", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children ?? text}
    </p>
    </Copy>
  );
}
