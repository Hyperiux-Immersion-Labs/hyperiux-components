import React, { useEffect, useRef, useState } from 'react';

const CanvasGrid = ({ m = 8, n = 3, imageWidth = 50, imageHeight = 50, gap = 20 }) => {
  const canvasRef = useRef(null);
  const imageSrc = "/assets/arrow-right.svg";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1) + Math.PI; // Add PI to flip the arrow 180 degrees
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const scaledWidth = imageWidth * 0.6;
      const scaledHeight = imageHeight * 0.8;
      
      canvas.width = m * (scaledWidth + gap) - gap;
      canvas.height = n * (scaledHeight + gap) - gap;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          const centerX = j * (scaledWidth + gap) + scaledWidth / 2;
          const centerY = i * (scaledHeight + gap) + scaledHeight / 2;
          
          // Calculate angle between arrow center and mouse
          const angle = getAngle(mousePos.x, mousePos.y, centerX, centerY);
          
          ctx.save();
          
          // Move to the arrow's center position
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          
          // Draw the arrow centered at the rotation point
          ctx.drawImage(
            img, 
            -scaledWidth / 2,  // Center horizontally
            -scaledHeight / 2, // Center vertically
            scaledWidth, 
            scaledHeight
          );
          
          ctx.restore();
        }
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos, m, n, imageWidth, imageHeight, gap]);

  return (
    <div className="w-screen h-screen">
      <canvas 
        ref={canvasRef} 
        style={{ height: "100vh", width: "100vw" }} 
      />
    </div>
  );
};

export default CanvasGrid;