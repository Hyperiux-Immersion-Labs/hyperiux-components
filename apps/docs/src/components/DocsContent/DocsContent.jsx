"use client";

import React from "react";
import { lineAnim } from "@/components/Animations/gsapAnimations";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function DocsContent({ className, children, ...props }) {
  lineAnim();
  return (
    <div
      className={cx(
        "w-full py-10 md:py-14 space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
