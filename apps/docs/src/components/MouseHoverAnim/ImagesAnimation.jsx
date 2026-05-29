"use client";

import React, { useEffect, useRef } from "react";
import { gsap, Expo } from "gsap";

import "./base.css";
import { useMouse } from "../hooks/useMouse";

const BASE_IMAGE_COUNT = 20;
const MOBILE_POINTER_QUERY = "(pointer: coarse)";
const OFFSCREEN_POSITION = -9999;
const IDLE_DISTANCE_THRESHOLD = 2;
const TRIGGER_DISTANCE_THRESHOLD = 100;
const INITIAL_Z_INDEX = 1;

export default function ImagesAnimation({
  enableRotation = true,
  idleSpawn = true,
  idleDelay = 300,
  cursorOffsetX = -12,
  cursorOffsetY = -12,
  popOutDuration = 1,
  fadeOutDuration = 0.7,
  imageMultiplier = 3,
  idlePopOutMultiplier = 1.8,
  idleFadeMultiplier = 1.5,
}) {
  // State and refs
  const imagesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const idleTimerRef = useRef(null);
  const isMobileRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia(MOBILE_POINTER_QUERY).matches
  );
  const lastTriggerPositionRef = useRef({ x: 0, y: 0 });
  const lastIdleSpawnPositionRef = useRef({
    x: OFFSCREEN_POSITION,
    y: OFFSCREEN_POSITION,
  });
  const zIndexRef = useRef(INITIAL_Z_INDEX);
  const imageIndexRef = useRef(0);

  const { mouse, smoothMouse } = useMouse({
    smooth: true,
    lerpFactor: 0.1,
  });

  // Derived values
  const totalImages = BASE_IMAGE_COUNT * imageMultiplier;

  const getMouseDistance = () => {
    const currentMouse = mouse.current;
    const lastTriggerPosition = lastTriggerPositionRef.current;

    return Math.hypot(
      currentMouse.x - lastTriggerPosition.x,
      currentMouse.y - lastTriggerPosition.y
    );
  };

  const getIdleDistance = () => {
    const currentMouse = mouse.current;
    const lastIdleSpawnPosition = lastIdleSpawnPositionRef.current;

    return Math.hypot(
      currentMouse.x - lastIdleSpawnPosition.x,
      currentMouse.y - lastIdleSpawnPosition.y
    );
  };

  const getCenteredPosition = (width, height, useSmoothMouse = false) => {
    const mouseSource = useSmoothMouse ? smoothMouse.current : mouse.current;

    return {
      x: mouseSource.x - width / 2 + cursorOffsetX,
      y: mouseSource.y - height / 2 + cursorOffsetY,
    };
  };

  const showNextImage = ({
    lockToCursor = false,
    isIdle = false,
    overridePosition = null,
  } = {}) => {
    const image = imagesRef.current[imageIndexRef.current];

    if (!image) {
      return;
    }

    const width = image.offsetWidth;
    const height = image.offsetHeight;

    gsap.killTweensOf(image);

    const startRotation = enableRotation ? gsap.utils.random(-35, 35) : 0;
    const exitRotation = enableRotation ? gsap.utils.random(-15, 15) : 0;

    let startPosition;
    let endPosition;

    if (overridePosition) {
      startPosition = {
        x: overridePosition.x - width / 2 + cursorOffsetX,
        y: overridePosition.y - height / 2 + cursorOffsetY,
      };
      endPosition = startPosition;
    } else {
      startPosition = lockToCursor
        ? getCenteredPosition(width, height)
        : getCenteredPosition(width, height, true);
      endPosition = getCenteredPosition(width, height);
    }

    const finalPopOutDuration = isIdle
      ? popOutDuration * idlePopOutMultiplier
      : popOutDuration;
    const finalFadeOutDuration = isIdle
      ? fadeOutDuration * idleFadeMultiplier
      : fadeOutDuration;

    gsap
      .timeline()
      .set(image, {
        opacity: 1,
        scale: 0.2,
        rotateZ: startRotation,
        zIndex: zIndexRef.current,
        x: startPosition.x,
        y: startPosition.y,
      })
      .to(image, {
        ease: isIdle ? "power1.out" : Expo.easeOut,
        rotateZ: 0,
        opacity: 1,
        scale: 1,
        duration: finalPopOutDuration,
        x: endPosition.x,
        y: endPosition.y,
      })
      .to(image, {
        ease: "power4.inOut",
        opacity: 0,
        rotateZ: exitRotation,
        duration: finalFadeOutDuration,
        delay: -finalFadeOutDuration,
        scale: 0,
      });

    zIndexRef.current += 1;
    imageIndexRef.current =
      (imageIndexRef.current + 1) % imagesRef.current.length;
  };

  const scheduleIdleSpawn = () => {
    if (!idleSpawn) {
      return;
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      if (getIdleDistance() < IDLE_DISTANCE_THRESHOLD) {
        showNextImage({
          lockToCursor: true,
          isIdle: true,
        });
      }

      lastIdleSpawnPositionRef.current = { ...mouse.current };
      scheduleIdleSpawn();
    }, idleDelay);
  };

  const runAnimationLoop = () => {
    if (isMobileRef.current) {
      animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
      return;
    }

    if (getMouseDistance() > TRIGGER_DISTANCE_THRESHOLD) {
      showNextImage();

      lastTriggerPositionRef.current = { ...mouse.current };
      lastIdleSpawnPositionRef.current = { ...mouse.current };

      if (idleSpawn) {
        scheduleIdleSpawn();
      }
    }

    const allImagesInactive = imagesRef.current.every(
      (image) => image && !gsap.isTweening(image) && image.style.opacity === "0"
    );

    if (allImagesInactive) {
      zIndexRef.current = INITIAL_Z_INDEX;
    }

    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
  };

  const onTap = (event) => {
    if (!isMobileRef.current) {
      return;
    }

    const touch = event.changedTouches?.[0] || event;
    const tapPosition = {
      x: touch.clientX,
      y: touch.clientY,
    };

    showNextImage({
      overridePosition: tapPosition,
    });
  };

  // Effects
  useEffect(() => {
    isMobileRef.current =
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_POINTER_QUERY).matches;

    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);

    if (idleSpawn && !isMobileRef.current) {
      scheduleIdleSpawn();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [idleDelay, idleSpawn]);

  // Return
  return (
    <div
      className="content"
      onClick={onTap}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: totalImages }).map((_, index) => {
        const baseImageIndex = (index % BASE_IMAGE_COUNT) + 1;

        return (
          <img
            key={index}
            className="content__img"
            src={`/img/${baseImageIndex}.png`}
            alt={`Trail ${baseImageIndex}`}
            ref={(element) => {
              if (element) {
                imagesRef.current[index] = element;
              }
            }}
          />
        );
      })}
    </div>
  );
}
