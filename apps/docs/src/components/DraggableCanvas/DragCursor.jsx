"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function DragCursor({ isHoveringDraggable = false }) {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      setPosition({ x, y });
      
      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed w-4 h-4 pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2"
      style={{ left: 0, top: 0 }}
    >
      <div className="absolute top-4 left-[120%] text-white text-[.5vw] font-head whitespace-nowrap">
        {isHoveringDraggable ? (
          <p className="font-bold">DRAG</p>
        ) : (
          <>
            <p>X:{position.x.toFixed(2)}</p>
            <p>Y:{position.y.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
}
