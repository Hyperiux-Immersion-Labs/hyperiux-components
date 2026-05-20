import React, { useEffect, useRef } from 'react';

const ArrowsPlay = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const arrowsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const divRef = useRef(null); // For the center div with text

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
    }

    update(mouseX, mouseY) {
      this.dx = mouseX - this.pos.x;
      this.dy = mouseY - this.pos.y;
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
      ctx.lineTo(10, -20);
      ctx.moveTo(30, 0);
      ctx.lineTo(10, 20);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'white'; 
      ctx.stroke();
      ctx.restore();
    }
  }

  const initializeArrows = (canvas) => {
    const arrows = [];
    const spacing = 120;
    
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);
    
    const xPadding = (canvas.width - (cols * spacing)) / 2;
    const yPadding = (canvas.height - (rows * spacing)) / 2;
  
    // Get div position relative to canvas
    const divRect = divRef.current.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    const divLeft = divRect.left - canvasRect.left;
    const divRight = divRect.right - canvasRect.left;
    const divTop = divRect.top - canvasRect.top;
    const divBottom = divRect.bottom - canvasRect.top;
  
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const arrowPos = new Point(
          x * spacing + xPadding,
          y * spacing + yPadding
        );
  
        
        if (
          arrowPos.x >= divLeft && 
          arrowPos.x <= divRight && 
          arrowPos.y >= divTop && 
          arrowPos.y <= divBottom
        ) {
          continue; 
        }
  
        arrows.push(new Arrow(arrowPos));
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
  }, []);

  return (
    <div className="relative w-full h-full ">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'pointer' }}
      />
      <div 
        ref={divRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 z-10 group"
        style={{
          cursor:"pointer",
          height:"25vw",
          width:"35vw",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          backgroundColor: "transparent", 
        }}
      >
        <h1 className='text-[18vw] text-white font-medium  transition-all ease duration-500'>Play</h1>
      </div>
    </div>
  );
};

export default ArrowsPlay;
