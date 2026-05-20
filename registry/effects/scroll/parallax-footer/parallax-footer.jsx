"use client"
import React, { useEffect, useRef, useState } from "react";

export function ParallaxFooter({
  children,
  id = "footer",
  outerClassName = "",
  footerClassName = "",
}) {
  const footerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;

    const updateHeight = () => {
      const rect = footerRef.current.getBoundingClientRect();
      setHeight(rect.height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(footerRef.current);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      id={id}
      className={`w-screen z-1 ${outerClassName}`}
      style={{
        height: height || "auto",
        clipPath: "rect(0px, 100%, 100%, 0px)",
      }}
    >
      <footer
        ref={footerRef}
        className={`w-screen fixed bottom-0 left-0 ${footerClassName}`}
      >
        {children}
      </footer>
    </div>
  );
}
