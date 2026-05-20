"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const variantMap = {
  fade: { x: 0, y: 0 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  up: { x: 0, y: -40 },
  down: { x: 0, y: 40 },
};

export default function BlurText({
  children,
  delay = 0,
  duration = 0.5,
  blur = 10,
  className = "",
  variant = "fade",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { x, y } = variantMap[variant] ?? variantMap.fade;
  const words = typeof children === "string" ? children.split(" ") : [children];

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: `blur(${blur}px)`, x, y }}
          animate={
            isInView
              ? { opacity: 1, filter: "blur(0px)", x: 0, y: 0 }
              : { opacity: 0, filter: `blur(${blur}px)`, x, y }
          }
          transition={{
            duration,
            delay: delay + index * 0.1,
            ease: "easeOut",
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}