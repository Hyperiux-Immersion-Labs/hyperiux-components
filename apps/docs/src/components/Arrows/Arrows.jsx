import React, { useEffect, useRef } from 'react';

const Arrows = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const arrowsRef = useRef([]);
  const animationFrameRef = useRef(null);

  class Point {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
  }

  class Arrow {
    constructor(position) {
      this.pos = position;
      this.dx = 0;
      this.dy = 0;
      this.angle = 0;
      this.isHovered = false;
      this.originalPos = { ...position };
      this.targetPos = { ...position };
    }

    update(mouseX, mouseY) {
      this.dx = mouseX - this.pos.x;
      this.dy = mouseY - this.pos.y;

      const targetAngle = Math.atan2(this.dy, this.dx) * 0.95;

      // Lerp angle via shortest arc to avoid wrap-around jumps
      let delta = targetAngle - this.angle;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      this.angle += delta * 0.15;

      // Check if mouse is near this arrow
      const distance = Math.sqrt(
        Math.pow(mouseX - this.pos.x, 2) +
        Math.pow(mouseY - this.pos.y, 2)
      );

      const wasHovered = this.isHovered;
      this.isHovered = distance < 30;

      // Handle spacing animation
      if (this.isHovered !== wasHovered) {
        if (this.isHovered) {
          // Push surrounding arrows away
          arrowsRef.current.forEach(otherArrow => {
            if (otherArrow !== this) {
              const dx = otherArrow.pos.x - this.pos.x;
              const dy = otherArrow.pos.y - this.pos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 70) {
                const pushForce = (70 - dist) / 70;
                otherArrow.targetPos = {
                  x: otherArrow.originalPos.x + (dx / dist) * 20 * pushForce,
                  y: otherArrow.originalPos.y + (dy / dist) * 20 * pushForce
                };
              }
            }
          });
        } else {
          // Reset surrounding arrows
          arrowsRef.current.forEach(arrow => {
            arrow.targetPos = { ...arrow.originalPos };
          });
        }
      }

      // Smooth position transition
      this.pos.x += (this.targetPos.x - this.pos.x) * 0.1;
      this.pos.y += (this.targetPos.y - this.pos.y) * 0.1;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.beginPath();

      ctx.moveTo(20, 0);
      ctx.lineTo(-20, 0);
      ctx.moveTo(20, 0);
      ctx.lineTo(5, -15);
      ctx.moveTo(20, 0);
      ctx.lineTo(5, 15);
      ctx.lineWidth = this.isHovered ? 3 : 2;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.restore();
    }
  }

  const initializeArrows = (canvas) => {
    const arrows = [];
    const spacing = 50;
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);
    const xPadding = (canvas.width - (cols * spacing)) / 2;
    const yPadding = (canvas.height - (rows * spacing)) / 2;
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        arrows.push(new Arrow(new Point(x * spacing + xPadding, y * spacing + yPadding)));
      }
    }
    return arrows;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      arrowsRef.current = initializeArrows(canvas);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const main = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const arrows = arrowsRef.current;
    const mouse = mouseRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrows.forEach(arrow => {
      arrow.update(mouse.x, mouse.y);
      arrow.draw(ctx);
    });
    animationFrameRef.current = requestAnimationFrame(main);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    arrowsRef.current = initializeArrows(canvas);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    main();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    // <div className="w-full h-full bg-white">
      <canvas ref={canvasRef} className="w-full h-full" />
    // </div>
  );
};

export default Arrows;