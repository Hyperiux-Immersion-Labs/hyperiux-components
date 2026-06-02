import React, { useEffect, useRef } from 'react';

const ArrowsOpacity = () => {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const arrowArrRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

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
      this.dist = 0;
    }

    update(mx, my) {
      this.dx = mx - this.pos.x;
      this.dy = my - this.pos.y;
      this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.angle = Math.atan2(this.dy, this.dx);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(-30, 0);
      ctx.moveTo(30, 0);
      ctx.lineTo(5, -30);
      ctx.moveTo(30, 0);
      ctx.lineTo(5, 30);
      ctx.lineWidth = 5;
      const alpha = 1 - (this.dist / 300);
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.max(0, alpha)})`;
      ctx.stroke();
      ctx.restore();
    }
  }

  const initializeArrows = (canvas) => {
    arrowArrRef.current = [];
    for (let y = 0; y < canvas.height / 20; y++) {
      for (let x = 0; x < canvas.width / 50; x++) {
        const arr = new Arrow(new Point(x * 75, y * 75));
        arrowArrRef.current.push(arr);
      }
    }
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeArrows(canvas);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
      mouseRef.current = { x: mouseX, y: mouseY };
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { x: mx, y: my } = mouseRef.current;
    for (let y = 0; y < canvas.height / 20; y++) {
      for (let x = 0; x < canvas.width / 50; x++) {
        const arrow = arrowArrRef.current[y * 10 + x];
        if (arrow) {
          arrow.update(mx, my);
          arrow.draw(ctx);
        }
      }
    }
    requestIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeArrows(canvas);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    requestIdRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  return (
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', pointerEvents: 'auto' }} />
  );
};

export default ArrowsOpacity;
