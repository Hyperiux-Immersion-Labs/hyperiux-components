"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, ChevronRight } from "lucide-react";

const DEFAULT_MENU_ITEMS = [
  {
    name: "Effects",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "All Effects", img: "/img/dino2.png", href: "#" },
      { title: "Components", img: "/img/dino2.png", href: "#" },
      { title: "WebGL", img: "/img/dino2.png", href: "#" },
    ],
  },
  {
    name: "Tech",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "/img/dino2.png", href: "#" },
      { title: "GSAP Effects", img: "/img/dino2.png", href: "#" },
      { title: "Three.js Effects", img: "/img/dino2.png", href: "#" },
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
      { title: "Introduction", img: "/img/dino2.png", href: "#" },
      { title: "Installation", img: "/img/dino2.png", href: "#" },
      { title: "CLI", img: "/img/dino2.png", href: "#" },
    ],
  },
];

const DROPDOWN_ITEM_OFFSET_Y = -8;
const NAV_TEXT_DURATION = 0.35;
const CTA_DURATION = 0.4;
const DROPDOWN_POINTER_DELAY = 0.03;

const DIMMED_TEXT_COLOR = "rgba(255,255,255,0.5)";
const ACTIVE_TEXT_COLOR = "rgba(255,255,255,1)";
const DEFAULT_CTA_BACKGROUND = "#fff";
const HOVER_CTA_BACKGROUND = "#000";

const DEFAULT_CTA = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};

export function ElevateNavbarDesktop({
  menuItems = DEFAULT_MENU_ITEMS,
  cta = DEFAULT_CTA,
}) {
  const navWrapRef = useRef(null);
  const navLinksRef = useRef([]);
  const ctaRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownItemsRef = useRef([]);
  const dropdownTextDataRef = useRef([]);
  const linkDataRef = useRef([]);

  const activeDropdownIndexRef = useRef(null);
  const isPointerInsideDropdownRef = useRef(false);
  const hideCallRef = useRef(null);
  const switchTweenRef = useRef(null);
  const itemTweenRef = useRef(null);

  const [renderedDropdownIndex, setRenderedDropdownIndexState] = useState(null);
  const [activeChevronIndex, setActiveChevronIndex] = useState(null);

  const killHideCall = useCallback(() => {
    if (!hideCallRef.current) return;

    hideCallRef.current.kill();
    hideCallRef.current = null;
  }, []);

  const killSwitchTween = useCallback(() => {
    if (!switchTweenRef.current) return;

    switchTweenRef.current.kill();
    switchTweenRef.current = null;
  }, []);

  const killItemTween = useCallback(() => {
    if (!itemTweenRef.current) return;

    itemTweenRef.current.kill();
    itemTweenRef.current = null;
  }, []);

  const getCurrentDropdownItems = useCallback(() => {
    return dropdownItemsRef.current.filter(Boolean);
  }, []);

  const setRenderedDropdownIndex = useCallback((index) => {
    dropdownItemsRef.current = [];
    dropdownTextDataRef.current = [];
    setRenderedDropdownIndexState(index);
  }, []);

  const showWrapper = useCallback(() => {
    if (!dropdownRef.current) return;

    gsap.set(dropdownRef.current, {
      autoAlpha: 1,
      pointerEvents: "auto",
    });
  }, []);

  const hideWrapper = useCallback(() => {
    if (!dropdownRef.current) return;

    gsap.set(dropdownRef.current, {
      autoAlpha: 0,
      pointerEvents: "none",
    });
  }, []);

  const setNavVisualState = useCallback((activeIndex) => {
    navLinksRef.current.forEach((linkElement, index) => {
      if (!linkElement) return;

      gsap.to(linkElement, {
        color:
          activeIndex !== null && index !== activeIndex
            ? DIMMED_TEXT_COLOR
            : ACTIVE_TEXT_COLOR,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
      });
    });
  }, []);

  const animateTextSwap = useCallback((item, isEntering) => {
    if (!item) return;

    gsap
      .timeline({
        defaults: {
          duration: NAV_TEXT_DURATION,
          ease: "power2.out",
          overwrite: true,
        },
      })
      .to(item.defaultText, { yPercent: isEntering ? -100 : 0 }, 0)
      .to(item.hoverText, { yPercent: isEntering ? 0 : 100 }, 0);
  }, []);

  const initDropdownItemText = useCallback(() => {
    dropdownTextDataRef.current = dropdownItemsRef.current.map((itemElement) => {
      if (!itemElement) return null;

      return {
        defaultText: itemElement.querySelector("[data-default]"),
        hoverText: itemElement.querySelector("[data-hover]"),
      };
    });

    dropdownTextDataRef.current.forEach((item) => {
      if (!item) return;

      gsap.set(item.defaultText, { yPercent: 0 });
      gsap.set(item.hoverText, { yPercent: 100 });
    });
  }, []);

  const animateDropdownItemsIn = useCallback(() => {
    const dropdownItems = getCurrentDropdownItems();

    if (!dropdownItems.length) return;

    killItemTween();
    gsap.killTweensOf(dropdownItems);

    gsap.set(dropdownItems, {
      opacity: 0,
      y: DROPDOWN_ITEM_OFFSET_Y,
      pointerEvents: "auto",
    });

    itemTweenRef.current = gsap.timeline({
      overwrite: true,
    });

    itemTweenRef.current.to(dropdownItems, {
      y: 0,
      opacity: 1,
      duration: 0.22,
      stagger: 0.025,
      ease: "power3.out",
    });
  }, [getCurrentDropdownItems, killItemTween]);

  const animateDropdownItemsOut = useCallback(
    (onComplete) => {
      const dropdownItems = getCurrentDropdownItems();

      if (!dropdownItems.length) {
        onComplete?.();
        return;
      }

      killItemTween();
      gsap.killTweensOf(dropdownItems);

      itemTweenRef.current = gsap.timeline({
        overwrite: true,
        onStart: () => {
          gsap.set(dropdownItems, {
            pointerEvents: "none",
          });
        },
        onComplete,
      });

      itemTweenRef.current.to(dropdownItems, {
        y: DROPDOWN_ITEM_OFFSET_Y,
        opacity: 0,
        duration: 0.16,
        stagger: 0.015,
        ease: "power2.out",
      });
    },
    [getCurrentDropdownItems, killItemTween]
  );

  const closeDropdown = useCallback(() => {
    killHideCall();
    killSwitchTween();

    activeDropdownIndexRef.current = null;
    setActiveChevronIndex(null);

    animateDropdownItemsOut(() => {
      if (
        activeDropdownIndexRef.current !== null ||
        isPointerInsideDropdownRef.current
      ) {
        return;
      }

      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [
    animateDropdownItemsOut,
    hideWrapper,
    killHideCall,
    killSwitchTween,
    setRenderedDropdownIndex,
  ]);

  const openDropdownForIndex = useCallback(
    (index) => {
      const menuItem = menuItems[index];

      killHideCall();
      killSwitchTween();

      if (!menuItem?.isDropdown) return;

      activeDropdownIndexRef.current = index;
      isPointerInsideDropdownRef.current = false;

      showWrapper();

      if (renderedDropdownIndex === null) {
        setRenderedDropdownIndex(index);
        return;
      }

      if (renderedDropdownIndex === index) {
        const dropdownItems = getCurrentDropdownItems();

        if (!dropdownItems.length) return;

        killItemTween();
        gsap.killTweensOf(dropdownItems);

        gsap.set(dropdownItems, {
          pointerEvents: "auto",
        });

        itemTweenRef.current = gsap.to(dropdownItems, {
          y: 0,
          opacity: 1,
          duration: 0.18,
          stagger: 0.02,
          ease: "power3.out",
          overwrite: true,
        });

        return;
      }

      switchTweenRef.current = gsap.delayedCall(0, () => {
        animateDropdownItemsOut(() => {
          if (activeDropdownIndexRef.current === null) return;

          setRenderedDropdownIndex(activeDropdownIndexRef.current);
        });
      });
    },
    [
      animateDropdownItemsOut,
      getCurrentDropdownItems,
      killHideCall,
      killItemTween,
      killSwitchTween,
      menuItems,
      renderedDropdownIndex,
      setRenderedDropdownIndex,
      showWrapper,
    ]
  );

  const scheduleCloseDropdown = useCallback(() => {
    killHideCall();

    hideCallRef.current = gsap.delayedCall(DROPDOWN_POINTER_DELAY, () => {
      if (isPointerInsideDropdownRef.current) return;

      closeDropdown();
    });
  }, [closeDropdown, killHideCall]);

  const onHeaderMouseEnter = useCallback(() => {
    killHideCall();
  }, [killHideCall]);

  const onHeaderMouseLeave = useCallback(() => {
    killHideCall();
    killSwitchTween();

    activeDropdownIndexRef.current = null;
    isPointerInsideDropdownRef.current = false;

    setActiveChevronIndex(null);
    setNavVisualState(null);

    animateDropdownItemsOut(() => {
      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [
    animateDropdownItemsOut,
    hideWrapper,
    killHideCall,
    killSwitchTween,
    setNavVisualState,
    setRenderedDropdownIndex,
  ]);

  const onNavItemEnter = useCallback(
    (index) => {
      const item = linkDataRef.current[index];

      if (!item) return;

      killHideCall();
      animateTextSwap(item, true);
      setNavVisualState(index);

      if (menuItems[index]?.isDropdown) {
        setActiveChevronIndex(index);
        activeDropdownIndexRef.current = index;
        openDropdownForIndex(index);
        return;
      }

      setActiveChevronIndex(null);
      activeDropdownIndexRef.current = null;
      closeDropdown();
    },
    [
      animateTextSwap,
      closeDropdown,
      killHideCall,
      menuItems,
      openDropdownForIndex,
      setNavVisualState,
    ]
  );

  const onNavItemLeave = useCallback(
    (index) => {
      const item = linkDataRef.current[index];

      if (!item) return;

      animateTextSwap(item, false);

      if (menuItems[index]?.isDropdown) {
        return;
      }

      setNavVisualState(null);
    },
    [animateTextSwap, menuItems, setNavVisualState]
  );

  const onCtaHover = useCallback((isEntering = true) => {
    const ctaElement = ctaRef.current;

    if (!ctaElement) return;

    const defaultText = ctaElement.querySelector("[data-default]");
    const hoverText = ctaElement.querySelector("[data-hover]");

    gsap
      .timeline({
        defaults: {
          duration: CTA_DURATION,
          ease: "power2.out",
          overwrite: true,
        },
      })
      .to(
        ctaElement,
        {
          backgroundColor: isEntering
            ? HOVER_CTA_BACKGROUND
            : DEFAULT_CTA_BACKGROUND,
        },
        0
      )
      .to(defaultText, { yPercent: isEntering ? -100 : 0 }, 0)
      .to(hoverText, { yPercent: isEntering ? 0 : 100 }, 0);
  }, []);

  const onDropdownMouseEnter = useCallback(() => {
    isPointerInsideDropdownRef.current = true;
    killHideCall();
    showWrapper();
  }, [killHideCall, showWrapper]);

  const onDropdownMouseLeave = useCallback(() => {
    isPointerInsideDropdownRef.current = false;
    scheduleCloseDropdown();
  }, [scheduleCloseDropdown]);

  const onDropdownItemEnter = useCallback(
    (index) => {
      animateTextSwap(dropdownTextDataRef.current[index], true);
    },
    [animateTextSwap]
  );

  const onDropdownItemLeave = useCallback(
    (index) => {
      animateTextSwap(dropdownTextDataRef.current[index], false);
    },
    [animateTextSwap]
  );

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      linkDataRef.current = navLinksRef.current.map((linkElement) => {
        if (!linkElement) return null;

        return {
          defaultText: linkElement.querySelector("[data-default]"),
          hoverText: linkElement.querySelector("[data-hover]"),
        };
      });

      linkDataRef.current.forEach((item) => {
        if (!item) return;

        gsap.set(item.defaultText, { yPercent: 0 });
        gsap.set(item.hoverText, { yPercent: 100 });
      });

      if (ctaRef.current) {
        const defaultText = ctaRef.current.querySelector("[data-default]");
        const hoverText = ctaRef.current.querySelector("[data-hover]");

        gsap.set(defaultText, { yPercent: 0 });
        gsap.set(hoverText, { yPercent: 100 });
      }

      hideWrapper();
    }, navWrapRef);

    return () => context.revert();
  }, [hideWrapper]);

  useLayoutEffect(() => {
    if (renderedDropdownIndex === null) return;

    initDropdownItemText();
    animateDropdownItemsIn();
  }, [animateDropdownItemsIn, initDropdownItemText, renderedDropdownIndex]);

  useEffect(() => {
    return () => {
      killHideCall();
      killSwitchTween();
      killItemTween();
    };
  }, [killHideCall, killItemTween, killSwitchTween]);

  const dropdownItems =
    renderedDropdownIndex !== null
      ? menuItems[renderedDropdownIndex]?.dropdown || []
      : [];

  return (
    <div
      ref={navWrapRef}
      onMouseEnter={onHeaderMouseEnter}
      onMouseLeave={onHeaderMouseLeave}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[0.55vw] bg-[#363737] text-[0.98vw]"
    >
      <div className="relative flex h-full w-full items-center gap-[1.95vw] p-[0.39vw] pl-[1.3vw]">
        <div className="flex h-full items-center gap-[1.95vw]">
          {menuItems.map((item, index) => {
            const isDropdownActive = activeChevronIndex === index;

            return (
              <Link
                key={item.name}
                ref={(element) => {
                  navLinksRef.current[index] = element;
                }}
                href={item.href}
                className="relative flex items-center gap-[0.32vw] py-[0.65vw] text-[0.98vw] uppercase leading-none"
                onMouseEnter={() => onNavItemEnter(index)}
                onMouseLeave={() => onNavItemLeave(index)}
              >
                <div className="relative overflow-hidden">
                  <span data-default className="block">
                    {item.name}
                  </span>

                  <span
                    data-hover
                    className="absolute inset-0 flex items-center"
                  >
                    {item.name}
                  </span>
                </div>

                {item.isDropdown && (
                  <ChevronDown
                    className={`h-[1.3vw] w-[1.3vw] shrink-0 transition-transform duration-100 ease-out ${
                      isDropdownActive ? "-rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <Link
          ref={ctaRef}
          href={cta.href}
          className="relative overflow-hidden rounded-[0.26vw] bg-white px-[0.65vw] py-[0.65vw] text-[0.98vw] leading-none text-black"
          onMouseEnter={() => onCtaHover(true)}
          onMouseLeave={() => onCtaHover(false)}
        >
          <span data-default className="block">
            {cta.label}
          </span>

          <span
            data-hover
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            {cta.label}
          </span>
        </Link>

        <div
          ref={dropdownRef}
          onMouseEnter={onDropdownMouseEnter}
          onMouseLeave={onDropdownMouseLeave}
          className="absolute left-0 top-full h-fit w-full pt-[0.46vw]"
        >
          <div className="space-y-[0.52vw]">
            {dropdownItems.map((item, index) => (
              <div
                key={`${renderedDropdownIndex}-${item.title}`}
                ref={(element) => {
                  dropdownItemsRef.current[index] = element;
                }}
                className="link-btns"
              >
                <Link
                  href={item.href}
                  onMouseEnter={() => onDropdownItemEnter(index)}
                  onMouseLeave={() => onDropdownItemLeave(index)}
                  className="flex items-center justify-between rounded-[0.55vw] bg-[#363737] p-[0.52vw] text-[0.98vw] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-black!"
                >
                  <div className="flex items-center gap-[1.95vw]">
                    <div className="size-[6.5vw] overflow-hidden rounded-[0.55vw]">
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="relative overflow-hidden uppercase leading-none">
                      <span data-default className="block">
                        {item.title}
                      </span>

                      <span
                        data-hover
                        className="absolute inset-0 flex items-center"
                      >
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="mr-[2.6vw] h-[1.3vw] w-[1.3vw]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}