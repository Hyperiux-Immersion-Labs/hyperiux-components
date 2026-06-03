"use client";

import FullscreenNav from "@/components/Navbar/FullscreenNav";
import CustomNavbar from "@/components/Navbar/CustomNavbar";

export default function ImmersiveFullscreenNavClient({
  navConfig,
  navContent,
}) {
  return (
    <>
      <FullscreenNav {...navConfig}>
        {(isOpen) => (
          <CustomNavbar
            {...navContent}
            isOpen={isOpen}
            overlayBg={navConfig.overlayBg}
            delay={navConfig.openDuration}
          />
        )}
      </FullscreenNav>

      <main className="flex h-screen items-center justify-center bg-white">
        <p className="text-5xl text-neutral-700">Hello !</p>
      </main>
    </>
  );
}
