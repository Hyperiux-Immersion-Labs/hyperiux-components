"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export default function Heading2({ children, text, className, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.h2
      className={[
        "font-display text-2xl md:text-3xl font-semibold tracking-tighter text-foreground mt-10 pt-6 border-t border-border/30 first:mt-0 first:pt-0 first:border-t-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={reduceMotion ? undefined : { duration: 0.4, ease: "easeOut", delay: 0.05 }}
      {...props}
    >
      {children ?? text}
    </motion.h2>
  );
}
