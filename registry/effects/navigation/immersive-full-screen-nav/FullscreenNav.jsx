"use client";

import gsap from "gsap";
import Image from "@/components/effects/_hyperiux/HyperiuxImage";
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
        className={`fixed top-0 left-0 right-0 z-70 flex h-20 items-center justify-between px-8 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <svg width="30" height="30" viewBox="0 0 58 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={` transition-all duration-300 ${isOpen ? "brightness-100  delay-700" : "brightness-0  delay-700"}`}>
            <path d="M0 0H9.02977V28.5943H0V0Z" fill="#ffffff"/>
            <path d="M57.1895 64.7134H48.1597V36.1192H57.1895V64.7134Z" fill="#ffffff"/>
            <path d="M0.0195312 36.1192V64.7135H9.0493V42.139L21.5405 37.4737V28.7449L0.0195312 36.1192Z" fill="#ffffff"/>
            <path d="M48.1777 22.5746V0.00012207H57.3579V28.5944L34.332 37.8697V28.5944L48.1777 22.5746Z" fill="#ffffff"/>
            <path d="M21.9912 29.0459L28.4868 26.8346C28.8573 26.7085 29.2624 26.7316 29.6161 26.8992L34.7834 29.3469M21.9912 29.0459L28.1616 32.2063M21.9912 29.0459V37.1727L28.1616 40.0321M34.7834 29.3469L28.1616 32.2063M34.7834 29.3469C34.7834 32.3443 34.7834 34.1753 34.7834 37.1727L28.1616 40.0321M28.1616 32.2063V40.0321" stroke="#ffffff" strokeWidth="0.902977"/>
          </svg>

          <div className="flex  items-center gap-2">
            <svg width="156" height="45" viewBox="0 0 351 43" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all duration-300 ${isOpen ? "brightness-100  delay-700" : "brightness-0  delay-700"}`}>
              <path d="M315.441 6.10352e-05H306.862L320.055 15.9603L324.019 21.0695L306.862 42.139H315.591L332.597 21.0695L328.555 15.9603L315.441 6.10352e-05Z" fill="white"/>
              <path d="M350.055 6.10352e-05H341.326L332.598 10.6853L336.962 15.9527L350.055 6.10352e-05Z" fill="white"/>
              <path d="M349.905 42.139L341.176 42.139L332.598 31.7548L336.962 26.3369L349.905 42.139Z" fill="white"/>
              <path d="M264.874 6.10352e-05H258.252V34.0122L269.088 42.139H289.555L300.391 34.0122V6.10352e-05H293.769V29.9349C293.769 30.4164 293.539 30.8688 293.149 31.152L287.543 35.2293C287.286 35.4164 286.976 35.5172 286.658 35.5172H271.985C271.667 35.5172 271.357 35.4164 271.1 35.2293L265.494 31.152C265.104 30.8688 264.874 30.4164 264.874 29.9349V6.10352e-05Z" fill="white"/>
              <rect x="244.406" y="6.10352e-05" width="6.62183" height="42.1389" fill="white"/>
              <path d="M195.043 0.000183105H228.002V6.62202H201.665V42.2896H195.043V0.000183105Z" fill="white"/>
              <path d="M233.269 24.0796L237.182 18.1404V6.62202V0.000183105H195.043V6.62202H230.56V15.8023L225.594 24.0796H233.269Z" fill="white"/>
              <path d="M221.078 17.7586H201.664V24.3804H217.466L229.205 42.139H237.163L221.078 17.7586Z" fill="white"/>
              <path d="M182.401 24.3804V17.7585H162.235L153.205 27.9923H162.084L165.245 24.3804H182.401Z" fill="white"/>
              <path d="M158.322 0H188.421V6.62183H161.031L152.904 15.9526V35.5171H188.421V42.1389H146.282V12.0397L158.322 0Z" fill="white"/>
              <rect x="97.5234" y="17.7585" width="6.62183" height="24.3804" fill="white"/>
              <path d="M139.662 0H97.5234V6.62183H133.041V17.7586H111.15L104.534 24.3804H133.643L139.662 18.0595V0Z" fill="white"/>
              <path d="M55.3826 10.8357L55.3826 0H48.7607L48.7607 14.8991L66.5754 24.2299L66.5193 42.1389H73.1411V24.2299L90.8997 14.7486V0H84.2779V10.8357L69.8302 18.4786L55.3826 10.8357Z" fill="white"/>
              <rect width="6.62183" height="42.1389" fill="white"/>
              <rect x="35.5166" width="6.62183" height="42.1389" fill="white"/>
              <rect x="6.62305" y="17.7585" width="28.8953" height="6.62183" fill="white"/>
            </svg>
          </div>
          </Link>
        </div>

        <button
          onClick={onToggleMenu}
          onTouchStart={onToggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 max-xl:size-14 max-md:size-10"
        >
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-[2px] w-full transition-all duration-700 ease-in-out delay-300 ${isOpen ? "translate-y-1.75 rotate-45" : "bg-black"
              }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-[2px] w-full transition-all duration-500 delay-300 ${isOpen ? "scale-x-0 opacity-0" : "bg-black"
              }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-[2px] w-full transition-all duration-700 ease-in-out delay-300 ${isOpen ? "-translate-y-2.25 -rotate-45" : "bg-black"
              }`}
          />
        </button>
      </header>

      <nav
        ref={overlayRef}
        style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
        className={`fixed inset-0 z-60 flex flex-col items-center justify-center gap-2 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
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
