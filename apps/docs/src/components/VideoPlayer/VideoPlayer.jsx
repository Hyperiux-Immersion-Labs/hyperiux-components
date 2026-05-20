"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react";
import "./VideoPlayer.css";

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
  rounded = true,
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

  return (
    <div
      className={`video-player ${rounded ? "video-player--rounded" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-player__wrap">
        <video
          ref={videoRef}
          className="video-player__video"
          src={videoSrc}
          poster={poster}
          playsInline
          preload="metadata"
          muted={isMuted}
        />

        <button
          type="button"
          className={`video-player__center-control ${
            showControls ? "is-visible" : "is-hidden"
          }`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {showCloseButton && typeof onRequestClose === "function" && (
          <button
            type="button"
            className={`video-player__close ${
              showControls ? "is-visible" : "is-hidden"
            }`}
            onClick={handleClose}
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        )}

        <div
          className={`video-player__controls ${
            showControls ? "is-visible" : "is-hidden"
          }`}
        >
          <button
            type="button"
            className="video-player__icon-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="video-player__time">
            <span>{formatTime(currentTime)}</span>
          </div>

          <div
            ref={progressBarRef}
            className="video-player__progress"
            onClick={handleProgressClick}
            onPointerDown={handlePointerDown}
          >
            <div className="video-player__progress-track" />
            <div
              className="video-player__progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="video-player__progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="video-player__time">
            <span>{formatTime(duration)}</span>
          </div>

          <button
            type="button"
            className="video-player__icon-btn"
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
