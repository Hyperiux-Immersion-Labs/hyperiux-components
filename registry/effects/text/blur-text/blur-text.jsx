"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

export function BlurText({
  children,
  delay = 0,
  duration = 0.5,
  blur = 10,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const words = typeof children === "string" ? children.split(" ") : [children];

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: `blur(${blur}px)` }}
          animate={
            hasAnimated
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: `blur(${blur}px)` }
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
