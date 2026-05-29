"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react";

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/** Valid media duration from the element (React state can lag behind metadata). */
const readVideoDuration = (video) => {
  const d = video?.duration;
  if (!Number.isFinite(d) || d <= 0) return 0;
  return d;
};

const VideoPlayer = ({
  videoSrc = "",
  poster = "",
  autoPlay = true,
  startMuted = true,
  isActive = true,
  className = "",
  rounded = false,
  onRequestClose,
  showCloseButton = true,
  resetOnClose = true,
  hideControlsDelay = 1800,
}) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const [isMuted, setIsMuted] = useState(startMuted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const progress = useMemo(() => {
    const d = Number.isFinite(duration) && duration > 0 ? duration : 0;
    if (!d) return 0;
    return Math.min(100, Math.max(0, (currentTime / d) * 100));
  }, [currentTime, duration]);

  const clearHideTimer = () => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }
  };

  const startHideTimer = () => {
    clearHideTimer();
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current) {
        setShowControls(false);
      }
    }, hideControlsDelay);
  };

  const revealControls = () => {
    setShowControls(true);
    startHideTimer();
  };

  const syncMutedState = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  };

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      await video.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  };

  const resetVideoState = () => {
    const video = videoRef.current;
    if (!video) return;

    pauseVideo();

    if (resetOnClose) {
      video.currentTime = 0;
      setCurrentTime(0);
    }

    setIsMuted(startMuted);
    video.muted = startMuted;
    setShowControls(true);
    clearHideTimer();
  };

  const handleClose = () => {
    resetVideoState();
    onRequestClose?.();
  };

  const updateVideoTimeFromClientX = (clientX) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;

    if (!video || !progressBar) return;

    const dur = readVideoDuration(video) || (Number.isFinite(duration) && duration > 0 ? duration : 0);
    if (!dur) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percentage = rect.width ? x / rect.width : 0;
    const nextTime = Math.min(Math.max(percentage * dur, 0), dur);

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncDuration = () => {
      setDuration(readVideoDuration(video));
    };

    const handleLoadedMetadata = () => {
      syncDuration();
    };

    const handleDurationChange = () => {
      syncDuration();
    };

    const handleTimeUpdate = () => {
      if (!isDraggingRef.current) {
        setCurrentTime(video.currentTime || 0);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      clearHideTimer();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    syncDuration();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    syncMutedState();
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hasInitializedRef.current) {
      pauseVideo();

      if (resetOnClose) {
        video.currentTime = 0;
        setCurrentTime(0);
      }

      setDuration(0);
      setIsMuted(startMuted);
      video.muted = startMuted;
      setShowControls(true);
    } else {
      hasInitializedRef.current = true;
    }

    revealControls();

    return () => {
      clearHideTimer();
      video.pause();
    };
  }, [videoSrc, poster, resetOnClose, startMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      pauseVideo();

      if (resetOnClose) {
        video.currentTime = 0;
        setCurrentTime(0);
      }

      clearHideTimer();
      return;
    }

    revealControls();

    if (autoPlay) {
      playVideo();
    }
  }, [isActive, autoPlay, resetOnClose]);

  useEffect(() => {
    return () => {
      clearHideTimer();
      const video = videoRef.current;
      if (video) video.pause();
    };
  }, []);

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await playVideo();
    } else {
      pauseVideo();
    }

    revealControls();
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    revealControls();
  };

  const handleProgressClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateVideoTimeFromClientX(e.clientX);
    revealControls();
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    updateVideoTimeFromClientX(e.clientX);
    revealControls();

    const handlePointerMove = (moveEvent) => {
      updateVideoTimeFromClientX(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      startHideTimer();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleMouseMove = () => {
    revealControls();
  };

  const handleMouseLeave = () => {
    clearHideTimer();
    setShowControls(false);
  };

  const visibilityClasses = showControls
    ? "opacity-100 pointer-events-auto"
    : "pointer-events-none opacity-0";

  return (
    <div
      className={`h-full w-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={revealControls}
      onTouchStart={revealControls}
    >
      <div
        className={`relative h-full w-full overflow-hidden bg-black ${
          rounded ? "md:rounded-[2vw]" : ""
        }`}
      >
        <video
          ref={videoRef}
          className="block h-full w-full bg-black object-cover"
          src={videoSrc}
          poster={poster}
          playsInline
          preload="metadata"
          muted={isMuted}
        />

        <button
          type="button"
          className={`absolute left-1/2 top-1/2 z-3 flex min-h-15 min-w-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-black/40 text-white backdrop-blur-sm transition-[opacity,transform] duration-300 ease-in-out h-[16vw] w-[16vw] min-[541px]:h-[8vw] min-[541px]:w-[8vw] xl:h-[5.5vw] xl:w-[5.5vw] 2xl:h-[4.5vw] 2xl:w-[4.5vw] ${visibilityClasses}`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {showCloseButton && typeof onRequestClose === "function" && (
          <button
            type="button"
            className={`absolute right-4 top-4 z-5 flex min-h-10.5 min-w-10.5 cursor-pointer items-center justify-center rounded-full border-none bg-black/45 text-white backdrop-blur-sm transition-[opacity,transform,background-color] duration-300 ease-in-out hover:scale-[1.04] hover:bg-black/65 h-[11vw] w-[11vw] min-[541px]:right-[2.4vw] min-[541px]:top-[2.4vw] min-[541px]:h-[5.5vw] min-[541px]:w-[5.5vw] xl:right-[1.8vw] xl:top-[1.8vw] xl:h-[3.8vw] xl:w-[3.8vw] 2xl:right-[1.5vw] 2xl:top-[1.5vw] 2xl:h-[3vw] 2xl:w-[3vw] ${visibilityClasses}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close video"
            style={{ touchAction: "manipulation" }}
          >
            <X size={20} style={{ pointerEvents: "none" }} />
          </button>
        )}

        <div
          className={`absolute bottom-[3vw] left-[3vw] right-[3vw] z-4 grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-[2vw] rounded-full bg-black/50 px-[3vw] py-[2.6vw] backdrop-blur-[10px] transition-[opacity,transform] duration-300 ease-in-out min-[541px]:bottom-[2vw] min-[541px]:left-[2vw] min-[541px]:right-[2vw] min-[541px]:gap-[1.6vw] min-[541px]:px-[1.8vw] min-[541px]:py-[1.6vw] xl:bottom-[1.5vw] xl:left-[1.5vw] xl:right-[1.5vw] xl:gap-[1.1vw] xl:px-[1.2vw] xl:py-[1vw] 2xl:bottom-[1.2vw] 2xl:left-[1.2vw] 2xl:right-[1.2vw] 2xl:gap-[0.9vw] 2xl:px-[1vw] 2xl:py-[0.9vw] ${visibilityClasses}`}
        >
          <button
            type="button"
            className="flex h-[9vw] w-[9vw] min-h-9.5 min-w-9.5 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-white min-[541px]:h-[4.5vw] min-[541px]:w-[4.5vw] xl:h-[3vw] xl:w-[3vw] 2xl:h-[2.5vw] 2xl:w-[2.5vw]"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="whitespace-nowrap text-[3vw] leading-none text-white min-[541px]:text-[1.8vw] xl:text-[1.1vw] 2xl:text-[0.95vw]">
            <span>{formatTime(currentTime)}</span>
          </div>

          <div
            ref={progressBarRef}
            className="relative flex h-[4vw] w-full cursor-pointer items-center min-h-4.5 min-[541px]:h-[2vw] xl:h-[1.4vw] 2xl:h-[1.2vw]"
            onClick={handleProgressClick}
            onPointerDown={handlePointerDown}
          >
            <div className="pointer-events-none absolute inset-x-0 h-[1vw] rounded-full bg-white/20 min-h-1 min-[541px]:h-[0.45vw] xl:h-[0.32vw] 2xl:h-[0.25vw]" />
            <div
              className="pointer-events-none absolute left-0 h-[1vw] rounded-full bg-white min-h-1 min-[541px]:h-[0.45vw] xl:h-[0.32vw] 2xl:h-[0.25vw]"
              style={{ width: `${progress}%` }}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-[3vw] w-[3vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white min-h-3.5 min-w-3.5 min-[541px]:h-[1.6vw] min-[541px]:w-[1.6vw] xl:h-[1vw] xl:w-[1vw] 2xl:h-[0.9vw] 2xl:w-[0.9vw]"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="whitespace-nowrap text-[3vw] leading-none text-white min-[541px]:text-[1.8vw] xl:text-[1.1vw] 2xl:text-[0.95vw]">
            <span>{formatTime(duration)}</span>
          </div>

          <button
            type="button"
            className="flex h-[9vw] w-[9vw] min-h-9.5 min-w-9.5 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-white min-[541px]:h-[4.5vw] min-[541px]:w-[4.5vw] xl:h-[3vw] xl:w-[3vw] 2xl:h-[2.5vw] 2xl:w-[2.5vw]"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
