"use client";

import { useState } from "react";
import Image from "next/image";
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
    <div className="relative hidden max-md:block px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center  gap-3 cursor-pointer">
          <Image
            src="/hyperiux.svg"
            alt="Hyperiux"
            width={35}
            height={35}
          />
          <Image
            src="/hyperiux-wordmark.svg"
            alt="Hyperiux"
            width={166}
            height={55}
          />
        </Link>

        <button
          type="button"
          onClick={onToggleMenu}
          className="flex h-11 w-11 items-center justify-center rounded-full  text-white transition-colors duration-200 hover:bg-white/10"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="max-sm:h-5 max-sm:w-5 h-10 w-10" /> : <Menu className=" max-sm:h-7 max-sm:w-7 h-10 w-10" />}
        </button>
      </div>

      <div
        className={`absolute left-6 right-6 top-18 z-50 overflow-hidden rounded-lg bg-white text-black transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-[80vh] overflow-y-scroll p-8 opacity-100 max-sm:max-h-[90vh] max-sm:p-3"
            : "max-h-0 p-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
          <div className="flex flex-col max-sm:gap-2 gap-5">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;
              const isDropdown = hasDropdownContent(item);

              if (!isDropdown) {
                return (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-4 max-sm:text-sm max-md:text-lg font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-all duration-300 ease-in-out hover:bg-neutral-100 max-md:rounded-none max-md:border-x-0 max-md:border-t-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <section
                  key={item.label}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/60 transition-all duration-300 ease-in-out max-md:rounded-none max-md:border-x-0 max-md:border-t-0"
                >
                  <button
                    type="button"
                    onClick={() => onToggleSection(index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-all duration-300 ease-in-out"
                    aria-expanded={isOpen}
                  >
                    <span className="max-sm:text-sm max-md:text-lg font-semibold uppercase tracking-[0.14em] text-neutral-500">
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
                      <div className="max-md:[&_.grid]:grid-cols-2 max-sm:[&_.grid]:grid-cols-1 ">
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
