"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import { useFocusTrap } from "./useFocusTrap";
import type { ElevateMenuItem, ElevateCta, ElevateDropdownItem } from "./ElevateDesktopNav";

const DEFAULT_MENU_ITEMS: ElevateMenuItem[] = [
  {
    name: "Effects",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "All Effects", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-09.jpg", href: "#" },
      { title: "Components", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-10.jpg", href: "#" },
      { title: "WebGL", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-11.jpg", href: "#" },
    ],
  },
  {
    name: "Tech",
    href: "/tech",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg", href: "#" },
      { title: "GSAP Effects", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg", href: "#" },
      { title: "Three.js Effects", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-03.jpg", href: "#" },
    ],
  },
  {
    name: "Extras",
    href: "#",
    isDropdown: false,
    dropdown: null,
  },
  {
    name: "Docs",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "Introduction", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg", href: "#" },
      { title: "Installation", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-06.jpg", href: "#" },
      { title: "CLI", img: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg", href: "#" },
    ],
  },
];

const DEFAULT_CTA: ElevateCta = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};

const BACKDROP_DURATION = 0.2;
const PANEL_OFFSET_Y = -20;
const PANEL_OPEN_DURATION = 0.3;
const PANEL_CLOSE_DURATION = 0.2;
const ACCORDION_DURATION = 0.25;

interface ElevateNavbarMobileProps {
  menuItems?: ElevateMenuItem[];
  cta?: ElevateCta;
  duration?: number;
  ease?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export function ElevateNavbarMobile({
  menuItems = DEFAULT_MENU_ITEMS,
  cta = DEFAULT_CTA,
  duration = 0.35,
  ease = "power3.out",
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.85)",
}: ElevateNavbarMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const motionDuration = Math.max(0.05, Number(duration) || 0.35);

  // Trap focus across the toggle + panel while open, restore it on close.
  useFocusTrap({
    active: isMenuOpen,
    containerRef,
    initialFocusRef: toggleButtonRef,
    onEscape: () => setIsMenuOpen(false),
  });

  useEffect(() => {
    const panelElement = panelRef.current;
    const backdropElement = backdropRef.current;

    if (!panelElement || !backdropElement) return;

    if (isMenuOpen) {
      gsap.set(panelElement, {
        pointerEvents: "auto",
      });

      if (reduceMotion()) {
        gsap.set(backdropElement, { autoAlpha: 1 });
        gsap.set(panelElement, {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      gsap.to(backdropElement, {
        autoAlpha: 1,
        duration: motionDuration * 0.6,
      });

      gsap.fromTo(
        panelElement,
        {
          autoAlpha: 0,
          y: PANEL_OFFSET_Y,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionDuration,
          ease,
        }
      );

      return;
    }

    if (reduceMotion()) {
      gsap.set(panelElement, {
        autoAlpha: 0,
        y: PANEL_OFFSET_Y,
        pointerEvents: "none",
      });
      gsap.set(backdropElement, {
        autoAlpha: 0,
      });
      return;
    }

    gsap.to(panelElement, {
      autoAlpha: 0,
      y: PANEL_OFFSET_Y,
      duration: motionDuration * 0.7,
      onComplete: () => {
        gsap.set(panelElement, {
          pointerEvents: "none",
        });
      },
    });

    gsap.to(backdropElement, {
      autoAlpha: 0,
      duration: motionDuration * 0.6,
    });
  }, [ease, isMenuOpen, motionDuration]);

  useEffect(() => {
    sectionsRef.current.forEach((sectionElement, index) => {
      if (!sectionElement) return;

      const isSectionOpen = activeDropdownIndex === index;

      if (reduceMotion()) {
        gsap.set(sectionElement, {
          height: isSectionOpen ? sectionElement.scrollHeight : 0,
          autoAlpha: isSectionOpen ? 1 : 0,
        });
        return;
      }

      gsap.to(sectionElement, {
        height: isSectionOpen ? sectionElement.scrollHeight : 0,
        autoAlpha: isSectionOpen ? 1 : 0,
        duration: motionDuration,
        ease,
      });
    });
  }, [activeDropdownIndex, ease, motionDuration]);

  return (
    <div
      ref={containerRef}
      className="fixed h-fit left-1/2 max-[1025px]:top-[10%] max-md:top-[31%] -translate-x-1/2 z-999"
    >
      <div
        ref={backdropRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 "
      />

      <div className="flex items-center justify-between gap-[2vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/90 px-[3vw] max-[1025px]:py-[1vw] max-md:py-[2vw] backdrop-blur-xl">
        <span className="px-[2vw] text-[3vw] uppercase tracking-wide text-white/80">
          Hyperiux
        </span>

        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="flex h-[8vw] w-[8vw] items-center justify-center rounded-[2vw] text-white transition hover:bg-white/10 motion-reduce:bg-transparent motion-reduce:transition-none"
          style={{ backgroundColor: isMenuOpen ? activeColor : undefined }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="max-md:h-[4.5vw] max-md:w-[4.5vw] max-[1025px]:w-[3.5vw] max-[1025px]:h-[3.5vw]" />
          ) : (
            <Menu className="max-md:h-[4.5vw] max-md:w-[4.5vw] max-[1025px]:w-[3.5vw] max-[1025px]:h-[3.5vw]" />
          )}
        </button>
      </div>

      <div
        ref={panelRef}
        className="mt-[2vw] w-[92vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/95 p-[2vw] backdrop-blur-xl"
        style={{
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <div className="space-y-[1vw]">
          {menuItems.map((item, index) => {
            const hasDropdown = Boolean(item.dropdown);
            const isDropdownOpen = activeDropdownIndex === index;

            if (!hasDropdown) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] max-[1025px]:text-[2.5vw] max-md:text-[3vw] uppercase text-white/85 transition hover:bg-white/10 motion-reduce:bg-transparent motion-reduce:transition-none"
                  style={{ color: inactiveColor }}
                >
                  {item.name}
                </a>
              );
            }

            return (
              <div key={item.name}>
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdownIndex((currentIndex) =>
                      currentIndex === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] max-[1025px]:text-[2.5vw]! max-md:text-[3vw]! uppercase text-white/85 transition hover:bg-white/10 motion-reduce:bg-transparent motion-reduce:transition-none"
                  style={{ color: inactiveColor }}
                >
                  {item.name}

                  <ChevronDown
                    className={`h-[3.5vw] w-[3.5vw] transition-transform motion-reduce:rotate-0 motion-reduce:transition-none ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  ref={(element) => {
                    sectionsRef.current[index] = element;
                  }}
                  className="overflow-hidden pl-[2vw]"
                  style={{
                    height: 0,
                    opacity: 0,
                  }}
                >
                  <div className="space-y-[2vw] pt-[1vw]">
                    {(item.dropdown as ElevateDropdownItem[]).map((dropdownItem) => (
                      <a
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-[3vw] rounded-[2vw] bg-white/5 p-[2vw] max-md:text-[2.8vw] max-[1025px]:text-[2vw]  uppercase text-white/80 transition hover:bg-white/10 motion-reduce:bg-white/5 motion-reduce:transition-none"
                        style={{ color: inactiveColor }}
                      >
                        <div className="relative h-[10vw] w-[10vw] overflow-hidden rounded-[2vw] bg-white/25">
                          <img
                            src={dropdownItem.img}
                            alt={dropdownItem.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <span className="flex-1">{dropdownItem.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-[3vw]">
            <a
              href={cta.href}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full max-md:py-[3vw] rounded-[3vw] bg-white py-[1.5vw] text-center max-md:text-[3vw] max-[1025px]:text-[2.5vw] font-semibold text-black"
            >
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
