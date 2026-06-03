"use client";

import { useCallback, useState } from "react";
import StackToSpreadIntro from "@/components/Loaders/StackToSpreadIntro";

const loaderImages = [
  "/assets/img/image01.webp",
  "/assets/img/image07.png",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
  "/assets/img/image10.jpg",
  "/assets/img/distortion.jpg",
  "/img/mobile.png",
];

export default function StackLoaderDemo() {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const handleLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
  }, []);

  return (
    <div id="DEMO UI" className="relative h-screen w-screen bg-zinc-900">
      <p
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-neutral-300 transition-opacity duration-300 ${
          isLoaderComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        DEMO UI
      </p>

      <StackToSpreadIntro
        images={loaderImages}
        onComplete={handleLoaderComplete}
      />
    </div>
  );
}
