// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import React, { useEffect, useState } from "react";
import { ElevateNavbarMobile } from "./ElevateMobileNav";
import { ElevateNavbarDesktop } from "./ElevateDesktopNav";

const NAV_CONFIG = {
  backgroundColor: "#d8b4fe",
  duration: 0.35,
  navTextDuration: 0.35,
  ctaDuration: 0.4,
  dropdownItemOffsetY: -8,
  dropdownPointerDelay: 0.03,
  staggerItems: true,
  activeColor: "#ffffff",
  inactiveColor: "rgba(255,255,255,0.5)",
  ease: "power2.out",
  ctaBackground: "#ffffff",
  ctaHoverBackground: "#000000",
};

type ElevateNavbarConfig = typeof NAV_CONFIG;

interface ElevateNavbarProps extends Partial<ElevateNavbarConfig> {
  navConfig?: Partial<ElevateNavbarConfig>;
}

export default function ElevateNavbar({ navConfig = {}, ...props }: ElevateNavbarProps) {
  const config = { ...NAV_CONFIG, ...navConfig, ...props };
  const durationValue = config.duration ?? config.navTextDuration;
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    queueMicrotask(() => {
      checkWidth();
      setHasMounted(true);
    });

    window.addEventListener("resize", checkWidth);

    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: config.backgroundColor }}
      className="relative h-screen w-full font-mono text-[0.75vw]"
    >
      {isMobile ? (
        <ElevateNavbarMobile
          menuItems={menuItems}
          cta={cta}
          duration={durationValue}
          ease={config.ease}
          activeColor={config.activeColor}
          inactiveColor={config.inactiveColor}
        />
      ) : (
        <ElevateNavbarDesktop
          menuItems={menuItems}
          cta={cta}
          navTextDuration={durationValue}
          ctaDuration={durationValue}
          dropdownItemOffsetY={config.dropdownItemOffsetY}
          dropdownPointerDelay={config.dropdownPointerDelay}
          staggerItems={config.staggerItems}
          activeColor={config.activeColor}
          inactiveColor={config.inactiveColor}
          ease={config.ease}
          ctaBackground={config.ctaBackground}
          ctaHoverBackground={config.ctaHoverBackground}
        />
      )}
    </div>
  );
}

const menuItems = [
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

const cta = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};
