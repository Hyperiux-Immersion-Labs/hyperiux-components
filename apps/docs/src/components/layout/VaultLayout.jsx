"use client";

import { Suspense, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { Sidebar } from "./Sidebar";
import Footer from "../Footer";

const DOCS_TOP_LINKS = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/cli", label: "CLI" },
  { href: "/docs/dependencies", label: "Dependencies" },
  { href: "/docs/license", label: "License" },
];

function SidebarFallback({ totalEffects }) {
  return (
    <aside
      className="fixed left-0 top-20 bottom-0 z-40 bg-transparent text-foreground"
      style={{ width: "16rem", ["--sidebar-width"]: "16rem", ["--sidebar-peek"]: "4.25rem" }}
    >
      <div className="relative flex h-full w-(--sidebar-width) flex-col rounded-lg overflow-visible -translate-x-[(var(--sidebar-width)-var(--sidebar-peek))]">
        <button
          type="button"
          aria-label="Open sidebar"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-14 w-(--sidebar-peek)rounded-r-2xl bg-black/35 border border-border/60/60 flex items-center justify-end backdrop-blur-md"
          style={{ zIndex: 60 }}
        >
          <div className="ml-auto mr-4 flex gap-1.5">
            <span className="h-6 w-0.75 rounded-full bg-white/90" />
            <span className="h-6 w-0.75 rounded-full bg-white/90" />
          </div>
        </button>

        <div className="h-full w-full flex items-center justify-center">
          <div className="h-14 w-14" />
        </div>
      </div>
    </aside>
  );
}

export function VaultLayout({
  children,
  effectCounts = {},
  effects = [],
  totalEffects: propTotalEffects,
  bgImageSrc = "/assets/heroo-bg.png",
  activeCategory,
}) {
  const totalEffects = propTotalEffects !== undefined ? propTotalEffects : effects.length;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lenis = useLenis();
  const resolvedBgImageSrc = bgImageSrc || "/assets/heroo-bg.png";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncLenis = () => {
      if (isSidebarOpen && mediaQuery.matches) {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    };

    syncLenis();
    mediaQuery.addEventListener("change", syncLenis);

    return () => {
      mediaQuery.removeEventListener("change", syncLenis);
      lenis?.start();
    };
  }, [isSidebarOpen, lenis]);

  return (
    <div className="min-h-screen text-foreground relative">
      {bgImageSrc ? (
        <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
          <Image
            src={bgImageSrc}
            alt="vault background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      ) : null}

      <Suspense fallback={<SidebarFallback totalEffects={totalEffects} />}>
        <Sidebar
          effectCounts={effectCounts}
          totalEffects={totalEffects}
          isExpanded={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((v) => !v)}
          onClose={() => setIsSidebarOpen(false)}
          activeCategory={activeCategory}
          topLinks={DOCS_TOP_LINKS}
        />
        {isSidebarOpen && (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 cursor-default bg-black/45 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </Suspense>

      <main
        className={`relative z-10 transition-[margin-left] duration-300 ease-out ${
          isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
