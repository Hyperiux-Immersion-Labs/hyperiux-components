"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export default function Para({ children, text, className, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.p
      className={["font-sans text-base md:text-lg leading-relaxed text-muted", className]
        .filter(Boolean)
        .join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.35, ease: "easeOut", delay: 0.08 }}
      {...props}
    >
      {children ?? text}
    </motion.p>
  );
}
