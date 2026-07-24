"use client";

import React, { useEffect, useState } from "react";
import { ElevateNavbarMobile } from "./ElevateMobileNav";
import { ElevateNavbarDesktop } from "./ElevateDesktopNav";


export default function ElevateNavbar() {
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
    <>
    <div className="relative h-screen w-full bg-purple-300 font-mono text-[0.75vw]">
      <div className="absolute left-1/2 top-[30%] max-md:top-[15%] w-full -translate-x-1/2 -translate-y-1/2 text-center  text-[#363737]">
      <h1 className="text-[8vw] font-black uppercase">
        Elevate Navbar
      </h1>
      <p className="mt-4 text-[1.2vw] max-[1025px]:text-[2vw] max-[1025px]:w-[80%] max-[1025px]:mx-auto max-md:text-[3vw]">
        Hover over the navbar to see the effect. Resize the window to see the responsive design in action.
      </p>

      </div>
      

      {isMobile ? (
        <ElevateNavbarMobile menuItems={menuItems} cta={cta} />
      ) : (
        <ElevateNavbarDesktop menuItems={menuItems} cta={cta} />
      )}
    </div>
    </>
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