"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CLIPS = {
  bottom: {
    closedInitial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  },
  top: {
    closedInitial: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  },
  left: {
    closedInitial: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  },
  right: {
    closedInitial: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  },
};

export default function FullscreenNav({
  links,
  brand = "Hyperiux",
  brandHref = "/",
  clipOrigin = "bottom",
  overlayBg = "#000000",
  linkColor = "#ffffff",
  linkHoverColor = "#a3a3a3",
  linkSizeClass = "text-5xl",
  headerClassName = "",
  openDuration = 1.2,
  closeDuration = 1.2,
  headerOpenColor = "#ffffff",
  onOpen,
  onClose,
  children,
}) {
  // State & refs
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksWrapperRef = useRef(null);
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Derived values
  const { closedInitial, open: openClipPath, closedFinal } =
    CLIPS[clipOrigin] ?? CLIPS.bottom;

  const onOpenMenu = () => {
    setIsOpen(true);
    timelineRef.current?.kill();

    gsap.set(overlayRef.current, { clipPath: closedInitial });
    gsap.set(linksWrapperRef.current, { opacity: 1, scale: 1 });

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        onOpen?.();
      },
    });

    timelineRef.current = timeline;

    timeline.to(overlayRef.current, {
      clipPath: openClipPath,
      duration: openDuration,
      delay: 0.2,
      ease: "power4.inOut",
    });
  };

  const onCloseMenu = () => {
    setIsOpen(false);
    timelineRef.current?.kill();

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsOpen(false);
        onClose?.();
      },
    });

    timelineRef.current = timeline;

    timeline
      .to(linksWrapperRef.current, {
        scale: 0.9,
        opacity: 0.5,
        duration: 0.7,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          clipPath: closedFinal,
          duration: closeDuration,
          ease: "power4.inOut",
        },
        "<",
      );
  };

  const onToggleMenu = () => {
    if (isAnimatingRef.current) {
      return;
    }

    if (isOpen) {
      onCloseMenu();
      return;
    }

    onOpenMenu();
  };

  const onLinkMouseEnter = (event) => {
    event.currentTarget.style.color = linkHoverColor;
  };

  const onLinkMouseLeave = (event) => {
    event.currentTarget.style.color = linkColor;
  };

  // Effects
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Return
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-70 flex h-16 items-center justify-between px-8 ${headerClassName}`}
      >
        <Link
          href={brandHref}
          style={{ color: isOpen ? headerOpenColor : undefined }}
          className={`text-lg font-normal tracking-tight transition-colors duration-500 ease-in-out ${
            isOpen ? "delay-500" : "text-black delay-500"
          }`}
        >
          {brand}
        </Link>

        <button
          onClick={onToggleMenu}
          onTouchStart={onToggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5"
        >
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-px w-6 transition-all duration-700 ease-in-out delay-300 ${
              isOpen ? "translate-y-1.25 rotate-45" : "bg-black"
            }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-px w-6 transition-all duration-500 delay-300 ${
              isOpen ? "scale-x-0 opacity-0" : "bg-black"
            }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-px w-6 transition-all duration-700 ease-in-out delay-300 ${
              isOpen ? "-translate-y-2.25 -rotate-45" : "bg-black"
            }`}
          />
        </button>
      </header>

      <nav
        ref={overlayRef}
        style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
        className={`fixed inset-0 z-60 flex flex-col items-center justify-center gap-2 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        role="navigation"
      >
        <div
          ref={linksWrapperRef}
          className="flex h-screen w-screen flex-col items-center justify-center"
        >
          {children
            ? children(isOpen)
            : links.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={isOpen ? onCloseMenu : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  style={{ color: linkColor }}
                  onMouseEnter={onLinkMouseEnter}
                  onMouseLeave={onLinkMouseLeave}
                  className={`${linkSizeClass} font-normal tracking-tight transition-colors`}
                >
                  {label}
                </Link>
              ))}
        </div>
      </nav>
    </>
  );
}
