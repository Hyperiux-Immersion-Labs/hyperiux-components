import React, { useRef, useEffect } from 'react';

export default function VideoUI({ isZoomed, setIsZoomed, videoRef }) {
  const progressRef = useRef(null);

  useEffect(() => {
    let rafId;

    const tick = () => {
      const video = videoRef?.current;
      const bar = progressRef.current;

      if (bar && video && video.duration > 0 && !isNaN(video.duration)) {
        const pct = (video.currentTime / video.duration) * 100;
        bar.style.width = `${pct}%`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [videoRef]);

  return (
    <>
      <p className={`absolute top-[2vw] left-1/2 -translate-x-1/2 uppercase text-white/50 transition-opacity duration-1000 text-xs ${isZoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        [ESC] to back
      </p>
      <div className={`absolute bottom-0 left-0 w-full p-8 flex justify-between items-center text-white/50 text-xs font-mono transition-opacity duration-1000 ${isZoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2">
          <span className="uppercase">HYPERIUX IMMERSION LABS</span>
        </div>
        <button
          onClick={() => setIsZoomed(false)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          GO BACK
        </button>
        <div className="absolute bottom-0 left-0 h-[5px] bg-orange-500/20 w-full">
          <div
            ref={progressRef}
            className="h-full bg-orange-500"
            style={{ width: '0%', transition: 'none' }}
          />
        </div>
      </div>
    </>
  );
}
