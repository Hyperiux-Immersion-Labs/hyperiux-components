"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef } from "react";
import { gsap, Expo } from "gsap";

import { useMouse } from "../hooks/useMouse";

const MOBILE_POINTER_QUERY = "(pointer: coarse)";
const OFFSCREEN_POSITION = -9999;
const IDLE_DISTANCE_THRESHOLD = 2;
const TRIGGER_DISTANCE_THRESHOLD = 100;
const INITIAL_Z_INDEX = 1;

const images = [

  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-11.jpg", alt: "Gradient 1" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-12.jpg", alt: "Gradient 2" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-13.jpg", alt: "Gradient 3" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-14.jpg", alt: "Gradient 4" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-15.jpg", alt: "Gradient 5" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg", alt: "Gradient 6" },
  { src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg", alt: "Gradient 7" },
];


export function PhantomImage({
  images = [],
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
  const hasImages = images.length > 0;
  const totalImages = hasImages ? images.length * imageMultiplier : 0;

  useEffect(() => {
    imagesRef.current = imagesRef.current.slice(0, totalImages);
    imageIndexRef.current = totalImages
      ? imageIndexRef.current % totalImages
      : 0;

    if (!hasImages) {
      zIndexRef.current = INITIAL_Z_INDEX;
    }
  }, [hasImages, totalImages]);

  const getMouseDistance = useCallback(() => {
    const currentMouse = mouse.current;
    const lastTriggerPosition = lastTriggerPositionRef.current;

    return Math.hypot(
      currentMouse.x - lastTriggerPosition.x,
      currentMouse.y - lastTriggerPosition.y
    );
  }, [mouse]);

  const getIdleDistance = useCallback(() => {
    const currentMouse = mouse.current;
    const lastIdleSpawnPosition = lastIdleSpawnPositionRef.current;

    return Math.hypot(
      currentMouse.x - lastIdleSpawnPosition.x,
      currentMouse.y - lastIdleSpawnPosition.y
    );
  }, [mouse]);

  const getCenteredPosition = useCallback((width, height, useSmoothMouse = false) => {
    const mouseSource = useSmoothMouse ? smoothMouse.current : mouse.current;

    return {
      x: mouseSource.x - width / 2 + cursorOffsetX,
      y: mouseSource.y - height / 2 + cursorOffsetY,
    };
  }, [cursorOffsetX, cursorOffsetY, mouse, smoothMouse]);

  const showNextImage = useCallback(({
    lockToCursor = false,
    isIdle = false,
    overridePosition = null,
  } = {}) => {
    if (!totalImages) {
      return;
    }

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
    imageIndexRef.current = (imageIndexRef.current + 1) % totalImages;
  }, [
    cursorOffsetX,
    cursorOffsetY,
    enableRotation,
    fadeOutDuration,
    getCenteredPosition,
    idleFadeMultiplier,
    idlePopOutMultiplier,
    popOutDuration,
    totalImages,
  ]);

  const scheduleIdleSpawn = useCallback(function scheduleIdleSpawn() {
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
  }, [getIdleDistance, idleDelay, idleSpawn, mouse, showNextImage]);

  const runAnimationLoop = useCallback(function runAnimationLoop() {
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
  }, [getMouseDistance, idleSpawn, mouse, scheduleIdleSpawn, showNextImage]);

  const onTap = useCallback((event) => {
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
  }, [showNextImage]);

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
  }, [idleDelay, idleSpawn, runAnimationLoop, scheduleIdleSpawn]);

  // Return
  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      onClick={onTap}
    >
      {Array.from({ length: totalImages }).map((_, index) => {
        const baseImageIndex = index % images.length;
        const image = images[baseImageIndex];
        const imageSrc = typeof image === "string" ? image : image?.src;
        const imageAlt =
          typeof image === "string"
            ? `Trail ${baseImageIndex + 1}`
            : image?.alt || `Trail ${baseImageIndex + 1}`;

        return (
          <Image
            key={index}
            className="pointer-events-none absolute left-0 top-0 h-[30vh] w-[17vw] max-w-none rounded-[0.7vw] object-cover opacity-0 will-change-[transform,opacity] max-md:h-[24vh] max-md:w-[24vw] max-md:rounded-[1.2vw] max-sm:h-[22vh] max-sm:w-[38vw] max-sm:rounded-[3vw]"
            src={imageSrc}
            alt={imageAlt}
            width={360}
            height={520}
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
