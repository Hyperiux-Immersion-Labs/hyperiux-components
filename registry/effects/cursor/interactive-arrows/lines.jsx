import React, { useEffect, useRef } from 'react';

const Lines = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const animationFrameRef = useRef(null);

  const lineLength = 30; 

  class Point {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    draw(ctx, mouseX, mouseY) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / distance;
      const unitY = dy / distance;
      const lineEndX = this.x + unitX * lineLength;
      const lineEndY = this.y + unitY * lineLength;

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const initializePoints = (canvas) => {
    const points = [];
    const spacing = 60;
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);

    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        points.push(new Point(x * spacing, y * spacing));
      }
    }
    return points;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pointsRef.current = initializePoints(canvas);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const main = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointsRef.current.forEach(point => point.draw(ctx, mouseRef.current.x, mouseRef.current.y));
    animationFrameRef.current = requestAnimationFrame(main);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pointsRef.current = initializePoints(canvas);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    main();
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full " style={{ cursor: 'pointer' }} />;
};

export default Lines;
