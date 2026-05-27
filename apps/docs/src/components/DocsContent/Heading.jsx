"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export default function Heading({ children, text, className, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.h1
      className={[
        "font-display text-5xl md:text-6xl leading-[1.05] tracking-tighter text-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={reduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }}
      {...props}
    >
      {children ?? text}
    </motion.h1>
  );
}
