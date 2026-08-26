// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import React, { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { CircularSplitRollComp } from "./CircularSplitRollComp";

const TABLET_BREAKPOINT = 1024;
const ROLL_CONFIG = {
  sectionHeight: 100,
  leftRadiusX: 500,
  leftRadiusY: 500,
  rightRadiusX: 500,
  rightRadiusY: 500,
  imageCardWidth: 205,
  imageCardHeight: 205,
  scrub: 1.2,
  textCenterScale: 1,
  textSideScale: 0.68,
  textSideOpacity: 0.18,
  imageCenterScale: 1,
  imageSideScale: 0.58,
  imageSideOpacity: 0.14,
};

const showcaseItems = [
  {
    title: "Vuelta",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
    alt: "Vuelta lamp",
  },
  {
    title: "JH42",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
    alt: "JH42 lamp",
  },
  {
    title: "Hay",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
    alt: "Hay product",
  },
  {
    title: "Teresa",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-08.jpg",
    alt: "Teresa lamp",
  },
  {
    title: "Tahiti",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-14.jpg",
    alt: "Tahiti lamp",
  },
  {
    title: "Akari 1A",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg",
    alt: "Akari 1A lamp",
  },
  {
    title: "Nessino",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg",
    alt: "Nessino lamp",
  },
  {
    title: "Panthella",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-08.jpg",
    alt: "Panthella lamp",
  },
  {
    title: "Bellhop",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg",
    alt: "Bellhop lamp",
  },
  {
    title: "Flowerpot",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-06.jpg",
    alt: "Flowerpot lamp",
  },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth > TABLET_BREAKPOINT);
      setHasMounted(true);
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return hasMounted && isDesktop;
}

interface CircularSplitRollProps {
  radius?: number;
  cardSize?: number;
  textSideScale?: number;
  textSideOpacity?: number;
}

export default function CircularSplitRoll({
  radius = 500,
  cardSize = 205,
  textSideScale = 0.68,
  textSideOpacity = 0.18,
}: CircularSplitRollProps) {
  const isDesktop = useIsDesktop();

  return (
    <ReactLenis
      root
      options={{
        infinite: isDesktop,
      }}
    >
      <main>
        <CircularSplitRollComp
          items={showcaseItems}
          sectionHeight={ROLL_CONFIG.sectionHeight}
          leftRadiusX={radius}
          leftRadiusY={radius}
          rightRadiusX={radius}
          rightRadiusY={radius}
          imageCardWidth={cardSize}
          imageCardHeight={cardSize}
          scrub={ROLL_CONFIG.scrub}
          textCenterScale={ROLL_CONFIG.textCenterScale}
          textSideScale={textSideScale}
          textSideOpacity={textSideOpacity}
          imageCenterScale={ROLL_CONFIG.imageCenterScale}
          imageSideScale={ROLL_CONFIG.imageSideScale}
          imageSideOpacity={ROLL_CONFIG.imageSideOpacity}
        />
      </main>

    </ReactLenis>
  );
}
