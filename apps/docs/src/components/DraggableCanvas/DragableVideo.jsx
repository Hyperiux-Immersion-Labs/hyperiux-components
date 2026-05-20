"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import MaskedContainer from "./MaskedContainer";
import DragCursor from "./DragCursor";

gsap.registerPlugin(Draggable, InertiaPlugin);


export default function DraggableVideo() {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isHoveringDraggable, setIsHoveringDraggable] = useState(false);
  const [containerPositions, setContainerPositions] = useState({
    large: { x: 0, y: 0 },
    medium: { x: 0, y: 0 },
    small: { x: 0, y: 0 },
    extra1: { x: 0, y: 0 },
    extra2: { x: 0, y: 0 },
    extra3: { x: 0, y: 0 }
  });

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Set canvas size
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Video event handlers
    const handleVideoCanPlay = () => {
      setIsVideoReady(true);
    };

    const handleVideoError = () => {
      console.error("Video failed to load");
      setIsVideoReady(false);
    };

    // Add video event listeners
    video.addEventListener("canplay", handleVideoCanPlay);
    video.addEventListener("error", handleVideoError);

    // Force video to load
    video.load();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      video.removeEventListener("canplay", handleVideoCanPlay);
      video.removeEventListener("error", handleVideoError);
    };
  }, []);

  
  const handlePositionUpdate = useCallback((size, position) => {
    setContainerPositions(prev => ({
      ...prev,
      [size]: position
    }));
  }, []);

  const handleHoverChange = useCallback((isHovering) => {
    setIsHoveringDraggable(isHovering);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden  bg-black">
        <DragCursor isHoveringDraggable={isHoveringDraggable}/>
        <div className="absolute w-full h-full inset-0  z-10"></div>
      {/* Hidden video element - single source for all masks */}
      <video
        ref={videoRef}
        src="/assets/draggable/draggable-video.mp4"
        className="opacity-0 absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />
    

      {isVideoReady && (
        <MaskedContainer
          size="large"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[60vw] h-[35vw] absolute top-[10vh] left-[10vw]"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}

      {isVideoReady && (
        <MaskedContainer
          size="medium"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[17vw] h-[9vw] absolute top-[5%] left-[5vw]"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}

    

      {isVideoReady && (
        <MaskedContainer
          size="extra1"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[35vw] h-[19vw] absolute top-[5vh] right-[5vw]"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}

      {isVideoReady && (
        <MaskedContainer
          size="extra2"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[38vw] h-[22vw] absolute top-[50vh] left-[5vw]"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}

      {isVideoReady && (
        <MaskedContainer
          size="extra3"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[25vw] h-[14vw] absolute bottom-[20%] right-[10vw]"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}
        {isVideoReady && (
        <MaskedContainer
          size="small"
          initialPosition={{ x: 0, y: 0 }}
          className="w-[22vw] h-[12vw] absolute bottom-[15vh] left-1/2 -translate-x-1/2"
          video={videoRef.current}
          canvasSize={canvasSize}
          onPositionUpdate={handlePositionUpdate}
          onHoverChange={handleHoverChange}
        />
      )}
    </div>
  );
}
