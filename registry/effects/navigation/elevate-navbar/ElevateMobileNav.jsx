"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";

const DEFAULT_MENU_ITEMS = [
  {
    name: "Effects",
    dropdown: [
      { title: "All Effects", img: "/img/dino2.png", href: "/effects" },
    { title: "Components", img: "/img/dino2.png", href: "/effects/components" },
      { title: "WebGL", img: "/img/dino2.png", href: "/effects/webgl-effects" },
    ],
  },
  {
    name: "Tech",
    dropdown: [
      { title: "React Effects", img: "/img/dino2.png", href: "/tech/react" },
      { title: "GSAP Effects", img: "/img/dino2.png", href: "/tech/gsap" },
      { title: "Three.js Effects", img: "/img/dino2.png", href: "/tech/threejs" },
    ],
  },
  {
    name: "Extras",
    href: "#",
  },
  {
    name: "Docs",
    dropdown: [
      { title: "Introduction", img: "/img/dino2.png", href: "/docs" },
      { title: "Installation", img: "/img/dino2.png", href: "/docs/installation" },
      { title: "CLI", img: "/img/dino2.png", href: "/docs/cli" },
    ],
  },
];

const DEFAULT_CTA = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};

const BACKDROP_DURATION = 0.2;
const PANEL_OFFSET_Y = -20;
const PANEL_OPEN_DURATION = 0.3;
const PANEL_CLOSE_DURATION = 0.2;
const ACCORDION_DURATION = 0.25;

export function ElevateNavbarMobile({
  menuItems = DEFAULT_MENU_ITEMS,
  cta = DEFAULT_CTA,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const panelElement = panelRef.current;
    const backdropElement = backdropRef.current;

    if (!panelElement || !backdropElement) return;

    if (isMenuOpen) {
      gsap.set(panelElement, {
        pointerEvents: "auto",
      });

      gsap.to(backdropElement, {
        autoAlpha: 1,
        duration: BACKDROP_DURATION,
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
          duration: PANEL_OPEN_DURATION,
          ease: "power3.out",
        }
      );

      return;
    }

    gsap.to(panelElement, {
      autoAlpha: 0,
      y: PANEL_OFFSET_Y,
      duration: PANEL_CLOSE_DURATION,
      onComplete: () => {
        gsap.set(panelElement, {
          pointerEvents: "none",
        });
      },
    });

    gsap.to(backdropElement, {
      autoAlpha: 0,
      duration: BACKDROP_DURATION,
    });
  }, [isMenuOpen]);

  useEffect(() => {
    sectionsRef.current.forEach((sectionElement, index) => {
      if (!sectionElement) return;

      const isSectionOpen = activeDropdownIndex === index;

      gsap.to(sectionElement, {
        height: isSectionOpen ? sectionElement.scrollHeight : 0,
        autoAlpha: isSectionOpen ? 1 : 0,
        duration: ACCORDION_DURATION,
        ease: "power2.out",
      });
    });
  }, [activeDropdownIndex]);

  return (
    <div className="fixed h-fit left-1/2 top-[40%] -translate-x-1/2 z-999">
      <div
        ref={backdropRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 "
      />

      <div className="flex items-center justify-between gap-[2vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/90 px-[3vw] py-[2vw] backdrop-blur-xl">
        <span className="px-[2vw] text-[3vw] uppercase tracking-wide text-white/80">
          Hyperiux
        </span>

        <button
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="flex h-[8vw] w-[8vw] items-center justify-center rounded-[2vw] text-white transition hover:bg-white/10"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-[4.5vw] w-[4.5vw]" />
          ) : (
            <Menu className="h-[4.5vw] w-[4.5vw]" />
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
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-[3vw] uppercase text-white/85 transition hover:bg-white/10"
                >
                  {item.name}
                </Link>
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
                  className="flex w-full items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-[3vw] uppercase text-white/85 transition hover:bg-white/10"
                >
                  {item.name}

                  <ChevronDown
                    className={`h-[3.5vw] w-[3.5vw] transition-transform ${
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
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-[3vw] rounded-[2vw] bg-white/5 p-[2vw] text-[2.8vw] uppercase text-white/80 transition hover:bg-white/10"
                      >
                        <div className="relative h-[10vw] w-[10vw] overflow-hidden rounded-[2vw] bg-white/25">
                          <Image
                            src={dropdownItem.img}
                            alt={dropdownItem.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />

                          <div
                            className="absolute inset-0"
                            style={{
                              background: "rgba(255, 0, 0, 1)",
                              mixBlendMode: "multiply",
                              pointerEvents: "none",
                            }}
                          />
                        </div>

                        <span className="flex-1">{dropdownItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-[3vw]">
            <Link
              href={cta.href}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full rounded-[3vw] bg-white py-[3vw] text-center text-[3vw] font-semibold text-black"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
