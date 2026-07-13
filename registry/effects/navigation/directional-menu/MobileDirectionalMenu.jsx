"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const hasDropdownContent = (item) => Boolean(item?.customContent);

export function MobileDirectionalMenu({ items = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const onToggleMenu = () => {
    setIsMenuOpen((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        setActiveIndex(null);
      }

      return nextValue;
    });
  };

  const onToggleSection = (index) => {
    setActiveIndex((currentValue) => (currentValue === index ? null : index));
  };

  return (
    <div className="relative hidden max-xl:block px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center  gap-3 cursor-pointer">
          <svg width="35" height="35" viewBox="0 0 58 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H9.02977V28.5943H0V0Z" fill="#ffffff"/>
            <path d="M57.1895 64.7134H48.1597V36.1192H57.1895V64.7134Z" fill="#ffffff"/>
            <path d="M0.0195312 36.1192V64.7135H9.0493V42.139L21.5405 37.4737V28.7449L0.0195312 36.1192Z" fill="#ffffff"/>
            <path d="M48.1777 22.5746V0.00012207H57.3579V28.5944L34.332 37.8697V28.5944L48.1777 22.5746Z" fill="#ffffff"/>
            <path d="M21.9912 29.0459L28.4868 26.8346C28.8573 26.7085 29.2624 26.7316 29.6161 26.8992L34.7834 29.3469M21.9912 29.0459L28.1616 32.2063M21.9912 29.0459V37.1727L28.1616 40.0321M34.7834 29.3469L28.1616 32.2063M34.7834 29.3469C34.7834 32.3443 34.7834 34.1753 34.7834 37.1727L28.1616 40.0321M28.1616 32.2063V40.0321" stroke="#ffffff" strokeWidth="0.902977"/>
          </svg>
          <svg width="166" height="55" viewBox="0 0 351 43" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </Link>

        <button
          type="button"
          onClick={onToggleMenu}
          className="flex h-11 w-11 items-center justify-center rounded-full  text-white transition-colors duration-200 hover:bg-white/10"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="max-md:h-5 max-md:w-5 h-10 w-10" /> : <Menu className=" max-md:h-7 max-md:w-7 h-10 w-10" />}
        </button>
      </div>

      <div
        className={`absolute left-6 right-6 top-18 z-50 overflow-hidden rounded-lg bg-white text-black transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-[80vh] overflow-y-scroll p-8 opacity-100 max-md:max-h-[90vh] max-md:p-3"
            : "max-h-0 p-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
          <div className="flex flex-col max-md:gap-2 gap-5">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;
              const isDropdown = hasDropdownContent(item);

              if (!isDropdown) {
                return (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-4 max-md:text-sm max-xl:text-lg font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-all duration-300 ease-in-out hover:bg-neutral-100 max-xl:rounded-none max-xl:border-x-0 max-xl:border-t-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <section
                  key={item.label}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/60 transition-all duration-300 ease-in-out max-xl:rounded-none max-xl:border-x-0 max-xl:border-t-0"
                >
                  <button
                    type="button"
                    onClick={() => onToggleSection(index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-all duration-300 ease-in-out"
                    aria-expanded={isOpen}
                  >
                    <span className="max-md:text-sm max-xl:text-lg font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {item.label}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[60rem]  px-4 py-4 opacity-100"
                        : "max-h-0 border-t-0 px-4 py-0 opacity-0"
                    }`}
                  >
                      <div className="max-xl:[&_.grid]:grid-cols-2 max-md:[&_.grid]:grid-cols-1 ">
                        {item.customContent}
                      </div>
                    </div>
                </section>
              );
            })}
          </div>
      </div>
    </div>
  );
}
