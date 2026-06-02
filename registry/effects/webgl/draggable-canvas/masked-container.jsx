"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function MaskedContainer({
  size,
  initialPosition,
  className,
  video,
  canvasSize,
  onPositionUpdate,
  onHoverChange,
}) {
  const maskRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [position, setPosition] = useState(initialPosition);

  // Canvas drawing function for individual mask
  const drawMaskedVideo = useCallback(() => {
    const canvas = canvasRef.current;
    const maskElement = maskRef.current;

    if (!canvas || !video || !maskElement) return;

    const ctx = canvas.getContext("2d");
    const rect = maskElement.getBoundingClientRect();

    // Set canvas size to match mask
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas with black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate video position relative to the mask position
    const maskX = rect.left;
    const maskY = rect.top;

    // Draw the portion of the video that should be visible through this mask
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.clip();

    // Draw video with offset to show the correct portion
    ctx.drawImage(video, -maskX, -maskY, canvasSize.width, canvasSize.height);
    ctx.restore();
  }, [video, canvasSize]);

  // Animation loop for individual mask
  const animate = useCallback(() => {
    drawMaskedVideo();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawMaskedVideo]);

  // Start animation when video is available
  useEffect(() => {
    if (video) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [video, animate]);

  // GSAP Draggable functionality
  useEffect(() => {
    if (maskRef.current) {
      const draggable = Draggable.create(maskRef.current, {
        type: "x,y",
        inertia: true,
        bounds: "body",
        edgeResistance: 0.3,
        throwProps: {
          resistance: 500,
          minDuration: 2,
          maxDuration: 3
        },
        onDrag: function () {
          setPosition({ x: this.x, y: this.y });
          onPositionUpdate(size, { x: this.x, y: this.y });
        },
        onThrowUpdate: function () {
          setPosition({ x: this.x, y: this.y });
          onPositionUpdate(size, { x: this.x, y: this.y });
        }
      })[0];

      return () => {
        if (draggable) {
          draggable.kill();
        }
      };
    }
  }, [size, onPositionUpdate ]);

  return (
    <div
      ref={maskRef}
      className={`${className} cursor-grab active:cursor-grabbing z-10 overflow-hidden border border-zinc-500`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className=" absolute flex gap-2 text-white/70 h-fit w-fit text-[.6vw] px-[.5vw] pt-[.3vw] py-[.1vw]">
        <p>X:{position.x.toFixed(2)}</p>
        <p>Y:{position.y.toFixed(2)}</p>
      </div>
      {/* Canvas for rendering masked video */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
