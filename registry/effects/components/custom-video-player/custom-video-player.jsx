"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import "./custom-video-player.css";

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function CustomVideoPlayer({
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
}) {
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
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const clearHideTimer = () => {
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = null;
  };

  const startHideTimer = () => {
    clearHideTimer();
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current) setShowControls(false);
    }, hideControlsDelay);
  };

  const revealControls = () => {
    setShowControls(true);
    startHideTimer();
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

  const updateVideoTimeFromClientX = (clientX) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percentage = rect.width ? x / rect.width : 0;
    const nextTime = percentage * duration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleTimeUpdate = () => {
      if (!isDraggingRef.current) setCurrentTime(video.currentTime || 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      clearHideTimer();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

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
  }, [poster, resetOnClose, startMuted, videoSrc]);

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
    if (autoPlay) playVideo();
  }, [autoPlay, isActive, resetOnClose]);

  useEffect(
    () => () => {
      clearHideTimer();
      if (videoRef.current) videoRef.current.pause();
    },
    []
  );

  const handleTogglePlay = async () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) await playVideo();
    else pauseVideo();
    revealControls();
  };

  const handleProgressPointerDown = (event) => {
    isDraggingRef.current = true;
    updateVideoTimeFromClientX(event.clientX);
    revealControls();
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isDraggingRef.current) return;
      updateVideoTimeFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      revealControls();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [duration]);

  return (
    <div
      className={`video-player ${rounded ? "video-player--rounded" : ""} ${className}`}
      onMouseMove={revealControls}
      onMouseLeave={startHideTimer}
    >
      <div className="video-player__wrap">
        <video
          ref={videoRef}
          className="video-player__video"
          src={videoSrc}
          poster={poster}
          playsInline
          muted={isMuted}
        />

        {showCloseButton ? (
          <button
            type="button"
            className={`video-player__close ${showControls ? "is-visible" : "is-hidden"}`}
            onClick={() => {
              resetVideoState();
              onRequestClose?.();
            }}
            aria-label="Close video"
          >
            <X size={18} />
          </button>
        ) : null}

        <button
          type="button"
          className={`video-player__center-control ${showControls ? "is-visible" : "is-hidden"}`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className={`video-player__controls ${showControls ? "is-visible" : "is-hidden"}`}>
          <button
            type="button"
            className="video-player__icon-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            type="button"
            className="video-player__icon-btn"
            onClick={() => {
              setIsMuted((prev) => !prev);
              revealControls();
            }}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div
            ref={progressBarRef}
            className="video-player__progress"
            onClick={(event) => {
              updateVideoTimeFromClientX(event.clientX);
              revealControls();
            }}
            onPointerDown={handleProgressPointerDown}
          >
            <div className="video-player__progress-track" />
            <div className="video-player__progress-fill" style={{ width: `${progress}%` }} />
            <div className="video-player__progress-thumb" style={{ left: `${progress}%` }} />
          </div>

          <div className="video-player__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
