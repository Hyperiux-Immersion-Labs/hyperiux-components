"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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

export function FullScreenNavigation({
  links = [],
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
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksWrapperRef = useRef(null);
  const tlRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const { closedInitial, open, closedFinal } = CLIPS[clipOrigin] ?? CLIPS.bottom;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openMenu = () => {
    setIsOpen(true);
    tlRef.current?.kill();
    gsap.set(overlayRef.current, { clipPath: closedInitial });
    gsap.set(linksWrapperRef.current, { opacity: 1, scale: 1 });
    tlRef.current = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
    tlRef.current.to(overlayRef.current, {
      clipPath: open,
      duration: openDuration,
      delay: 0.2,
      ease: "power4.inOut",
    });
  };

  const closeMenu = () => {
    tlRef.current?.kill();
    tlRef.current = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsOpen(false);
      },
    });
    tlRef.current
      .to(linksWrapperRef.current, { scale: 0.9, opacity: 0.5, duration: 0.7, ease: "power2.in" })
      .to(
        overlayRef.current,
        {
          clipPath: closedFinal,
          duration: closeDuration,
          ease: "power4.inOut",
        },
        "<"
      );
  };

  const toggleMenu = () => {
    if (isAnimatingRef.current) return;
    if (isOpen) closeMenu();
    else openMenu();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[70] flex h-16 items-center justify-between px-8 ${headerClassName}`}>
        <a
          href={brandHref}
          style={{ color: isOpen ? headerOpenColor : undefined }}
          className={`text-lg tracking-tight transition-colors duration-500 ${isOpen ? "delay-500" : "text-black delay-500"}`}
        >
          {brand}
        </a>

        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5"
        >
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
              className={`block h-px w-6 transition-all duration-700 ease-in-out ${
                bar === 0 ? (isOpen ? "translate-y-[5px] rotate-45" : "bg-black") : ""
              } ${bar === 1 ? (isOpen ? "opacity-0 scale-x-0" : "bg-black duration-500") : ""} ${
                bar === 2 ? (isOpen ? "-translate-y-[9px] -rotate-45" : "bg-black") : ""
              }`}
            />
          ))}
        </button>
      </header>

      <nav
        ref={overlayRef}
        style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-2 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div ref={linksWrapperRef} className="flex h-screen w-screen flex-col items-center justify-center">
          {children
            ? children(isOpen, closeMenu)
            : links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={closeMenu}
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = linkHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor;
                  }}
                  className={`${linkSizeClass} font-normal tracking-tight transition-colors`}
                >
                  {label}
                </a>
              ))}
        </div>
      </nav>
    </>
  );
}

export default FullScreenNavigation;
