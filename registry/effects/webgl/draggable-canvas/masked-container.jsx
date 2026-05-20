"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export function MaskedContainer({
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

  const drawMaskedVideo = useCallback(() => {
    const canvas = canvasRef.current;
    const maskElement = maskRef.current;
    if (!canvas || !video || !maskElement) return;

    const ctx = canvas.getContext("2d");
    const rect = maskElement.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maskX = rect.left;
    const maskY = rect.top;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.clip();
    ctx.drawImage(video, -maskX, -maskY, canvasSize.width, canvasSize.height);
    ctx.restore();
  }, [video, canvasSize]);

  const animate = useCallback(() => {
    drawMaskedVideo();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawMaskedVideo]);

  useEffect(() => {
    if (video) animate();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [video, animate]);

  useEffect(() => {
    if (!maskRef.current) return;

    const draggable = Draggable.create(maskRef.current, {
      type: "x,y",
      inertia: true,
      bounds: "body",
      edgeResistance: 0.3,
      throwProps: {
        resistance: 500,
        minDuration: 2,
        maxDuration: 3,
      },
      onDrag: function () {
        setPosition({ x: this.x, y: this.y });
        onPositionUpdate(size, { x: this.x, y: this.y });
      },
      onThrowUpdate: function () {
        setPosition({ x: this.x, y: this.y });
        onPositionUpdate(size, { x: this.x, y: this.y });
      },
    })[0];

    return () => draggable?.kill();
  }, [size, onPositionUpdate]);

  return (
    <div
      ref={maskRef}
      className={`${className} cursor-grab active:cursor-grabbing z-10 overflow-hidden border border-zinc-500`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="absolute flex gap-2 text-white/70 h-fit w-fit text-[.6vw] px-[.5vw] pt-[.3vw] py-[.1vw]">
        <p>X:{position.x.toFixed(2)}</p>
        <p>Y:{position.y.toFixed(2)}</p>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
