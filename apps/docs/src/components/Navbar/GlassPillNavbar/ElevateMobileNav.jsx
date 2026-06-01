"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";

const MENU_ITEMS = [
  {
    name: "Effects",
    dropdown: [
      { title: "All Effects", img: "/img/dino2.png", href: "/effects" },
      { title: "Components", img: "/img/dino2.png", href: "/effects/components" },
      { title: "WebGL", img: "/img/dino2.png", href: "/effects/webgl" },
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

const BACKDROP_DURATION = 0.2;
const PANEL_OFFSET_Y = -20;
const PANEL_OPEN_DURATION = 0.3;
const PANEL_CLOSE_DURATION = 0.2;
const ACCORDION_DURATION = 0.25;
const TABLET_TOGGLE_SIZE = "max-md:w-[6.5vw] max-md:h-[6.5vw]";
const MOBILE_TOGGLE_SIZE = "max-sm:w-[8vw] max-sm:h-[8vw]";
const TABLET_ICON_SIZE = "max-md:w-[3vw] max-md:h-[3vw]";
const MOBILE_ICON_SIZE = "max-sm:w-[4.5vw] max-sm:h-[4.5vw]";
const TABLET_CHEVRON_SIZE = "max-md:w-[2.4vw] max-md:h-[2.4vw]";
const MOBILE_CHEVRON_SIZE = "max-sm:w-[3.5vw] max-sm:h-[3.5vw]";

export default function ElevateNavbarMobile() {
  // State & refs
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const sectionsRef = useRef([]);

  // Effects
  useEffect(() => {
    const panelElement = panelRef.current;
    const backdropElement = backdropRef.current;

    if (!panelElement || !backdropElement) return;

    if (isMenuOpen) {
      gsap.set(panelElement, { pointerEvents: "auto" });

      gsap.to(backdropElement, {
        autoAlpha: 1,
        duration: BACKDROP_DURATION,
      });

      gsap.fromTo(
        panelElement,
        { autoAlpha: 0, y: PANEL_OFFSET_Y },
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
      onComplete: () => gsap.set(panelElement, { pointerEvents: "none" }),
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
    <div className="fixed top-[3vw] right-[3vw] z-999 block sm:block lg:hidden">
      <div
        ref={backdropRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-black/40 opacity-0 backdrop-blur-sm"
      />

      <div className="flex items-center justify-between gap-[2vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/90 px-[3vw] py-[2vw] backdrop-blur-xl">
        <span className="max-md:text-[2.5vw] max-sm:text-[3vw] px-[2vw] uppercase tracking-wide text-white/80">
          Hyperiux
        </span>

        <button
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className={`${MOBILE_TOGGLE_SIZE} ${TABLET_TOGGLE_SIZE} flex items-center justify-center rounded-[2vw] transition hover:bg-white/10`}
        >
          {isMenuOpen ? (
            <X className={`${MOBILE_ICON_SIZE} ${TABLET_ICON_SIZE}`} />
          ) : (
            <Menu className={`${MOBILE_ICON_SIZE} ${TABLET_ICON_SIZE}`} />
          )}
        </button>
      </div>

      <div
        ref={panelRef}
        className="mt-[2vw] w-[92vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/95 p-[2vw] backdrop-blur-xl"
        style={{ pointerEvents: "none", opacity: 0 }}
      >
        <div className="space-y-[1vw]">
          {MENU_ITEMS.map((item, index) => {
            const hasDropdown = Boolean(item.dropdown);
            const isDropdownOpen = activeDropdownIndex === index;

            if (!hasDropdown) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-white/85 uppercase transition hover:bg-white/10 max-md:text-[2.5vw] max-sm:text-[3vw]"
                >
                  {item.name}
                </Link>
              );
            }

            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setActiveDropdownIndex((currentIndex) =>
                      currentIndex === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-white/85 uppercase transition hover:bg-white/10 max-md:text-[2.5vw] max-sm:text-[3vw]"
                >
                  {item.name}
                  <ChevronDown
                    className={`${MOBILE_CHEVRON_SIZE} ${TABLET_CHEVRON_SIZE} transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  ref={(element) => {
                    sectionsRef.current[index] = element;
                  }}
                  className="overflow-hidden pl-[2vw]"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="space-y-[2vw] pt-[1vw]">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-[3vw] rounded-[2vw] bg-white/5 p-[2vw] text-white/80 uppercase transition max-md:text-[2.3vw] max-sm:text-[2.8vw]"
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
            <button className="w-full rounded-[3vw] bg-white py-[3vw] font-semibold text-black max-md:text-[2.5vw] max-sm:text-[3vw]">
              BUILT W/ HYPERIUX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
