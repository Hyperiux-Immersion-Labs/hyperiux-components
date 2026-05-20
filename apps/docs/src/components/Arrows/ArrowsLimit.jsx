import React, { useEffect, useRef } from 'react';

const ArrowsLimit = ({ rows = 5, columns = 10 }) => {
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
      this.ease = 0.1;  
    }
  
    update(mouseX, mouseY) {
      const targetDx = mouseX - this.pos.x;
      const targetDy = mouseY - this.pos.y;
      this.dx += (targetDx - this.dx) * this.ease*0.35;
      this.dy += (targetDy - this.dy) * this.ease*0.35;
      this.angle = Math.atan2(this.dy, this.dx);
    }
  
    draw(ctx) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
  
      ctx.moveTo(50, 0);
      ctx.lineTo(-50, 0);
      ctx.moveTo(50, 0);
      ctx.lineTo(10, -40);
      ctx.moveTo(50, 0);
      ctx.lineTo(10, 40);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.stroke();
  
      ctx.restore();
    }
  }
  
  const initializeArrows = (canvas) => {
    const arrows = [];
    const spacingX = canvas.width / (columns + 1);
    const spacingY = canvas.height / (rows + 1);
    
    for (let y = 1; y <= rows; y++) {
      for (let x = 1; x <= columns; x++) {
        arrows.push(
          new Arrow(
            new Point(
              x * spacingX,
              y * spacingY
            )
          )
        );
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
    const rect = canvas.getBoundingClientRect();  
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      mouseRef.current = {
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top,  
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
  }, [rows, columns]); 

  return (
    <div className="w-full h-full">
      <canvas 
        ref={canvasRef}
        className="w-full h-full "
      />
    </div>
  );
};

export default ArrowsLimit;