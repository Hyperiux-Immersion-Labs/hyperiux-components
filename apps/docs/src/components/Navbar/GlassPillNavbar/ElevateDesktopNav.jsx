"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

const MENU_ITEMS = [
  {
    name: "Effects",
    href: "/effects",
    isDropdown: true,
    dropdown: [
      { title: "All Effects", img: "/img/dino2.png", href: "/effects" },
      { title: "Components", img: "/img/dino2.png", href: "/effects/components" },
      { title: "WebGL", img: "/img/dino2.png", href: "/effects/webgl" },
    ],
  },
  {
    name: "Tech",
    href: "/tech",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "/img/dino2.png", href: "/tech/react" },
      { title: "GSAP Effects", img: "/img/dino2.png", href: "/tech/gsap" },
      { title: "Three.js Effects", img: "/img/dino2.png", href: "/tech/threejs" },
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
    href: "/docs",
    isDropdown: true,
    dropdown: [
      { title: "Introduction", img: "/img/dino2.png", href: "/docs" },
      { title: "Installation", img: "/img/dino2.png", href: "/docs/installation" },
      { title: "CLI", img: "/img/dino2.png", href: "/docs/cli" },
    ],
  },
];

const DROPDOWN_ITEM_OFFSET_Y = -14;
const NAV_TEXT_DURATION = 0.35;
const CTA_DURATION = 0.4;
const DROPDOWN_POINTER_DELAY = 0.08;
const NAV_POINTER_DELAY = 0.06;
const DIMMED_TEXT_COLOR = "rgba(255,255,255,0.5)";
const ACTIVE_TEXT_COLOR = "rgba(255,255,255,1)";
const DEFAULT_CTA_BACKGROUND = "#fff";
const HOVER_CTA_BACKGROUND = "#000";
const IMAGE_TINT = "rgba(255, 0, 0, 0.9)";

export default function ElevateNavbarDesktop() {
  // State & refs
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
        duration: 0.3,
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
      pointerEvents: "none",
    });

    itemTweenRef.current = gsap.timeline({
      overwrite: true,
      onStart: () => {
        gsap.set(dropdownItems, { pointerEvents: "auto" });
      },
    });

    itemTweenRef.current
      .to(
        dropdownItems,
        {
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "elastic.out(0.9, 0.6)",
        },
        0
      )
      .to(
        dropdownItems,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0
      );
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
          gsap.set(dropdownItems, { pointerEvents: "none" });
        },
        onComplete,
      });

      itemTweenRef.current
        .to(
          dropdownItems,
          {
            y: DROPDOWN_ITEM_OFFSET_Y,
            duration: 0.34,
            stagger: 0.04,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          dropdownItems,
          {
            opacity: 0,
            duration: 0.28,
            stagger: 0.04,
            ease: "power2.inOut",
          },
          0
        );
    },
    [getCurrentDropdownItems, killItemTween]
  );

  const closeDropdown = useCallback(() => {
    killHideCall();
    killSwitchTween();

    activeDropdownIndexRef.current = null;

    animateDropdownItemsOut(() => {
      if (activeDropdownIndexRef.current !== null || isPointerInsideDropdownRef.current) {
        return;
      }

      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [animateDropdownItemsOut, hideWrapper, killHideCall, killSwitchTween, setRenderedDropdownIndex]);

  const openDropdownForIndex = useCallback(
    (index) => {
      const menuItem = MENU_ITEMS[index];

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

        itemTweenRef.current = gsap.timeline({
          overwrite: true,
          onStart: () => {
            gsap.set(dropdownItems, { pointerEvents: "auto" });
          },
        });

        itemTweenRef.current
          .to(
            dropdownItems,
            {
              y: 0,
              duration: 0.45,
              stagger: 0.04,
              ease: "elastic.out(0.9, 0.6)",
            },
            0
          )
          .to(
            dropdownItems,
            {
              opacity: 1,
              duration: 0.35,
              stagger: 0.04,
              ease: "power2.inOut",
            },
            0
          );

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
      setRenderedDropdownIndex,
      showWrapper,
    ]
  );

  const scheduleCloseDropdown = useCallback(() => {
    killHideCall();

    hideCallRef.current = gsap.delayedCall(DROPDOWN_POINTER_DELAY, () => {
      if (isPointerInsideDropdownRef.current) return;
      if (activeDropdownIndexRef.current !== null && MENU_ITEMS[activeDropdownIndexRef.current]?.isDropdown) {
        return;
      }

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
    setNavVisualState(null);

    animateDropdownItemsOut(() => {
      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [animateDropdownItemsOut, hideWrapper, killHideCall, killSwitchTween, setNavVisualState, setRenderedDropdownIndex]);

  const onNavItemEnter = useCallback(
    (index) => {
      const item = linkDataRef.current[index];
      if (!item) return;

      killHideCall();
      animateTextSwap(item, true);
      setNavVisualState(index);

      if (MENU_ITEMS[index]?.isDropdown) {
        activeDropdownIndexRef.current = index;
        openDropdownForIndex(index);
        return;
      }

      activeDropdownIndexRef.current = null;
      closeDropdown();
    },
    [animateTextSwap, closeDropdown, killHideCall, openDropdownForIndex, setNavVisualState]
  );

  const onNavItemLeave = useCallback(
    (index) => {
      const item = linkDataRef.current[index];
      if (!item) return;

      animateTextSwap(item, false);

      if (MENU_ITEMS[index]?.isDropdown) {
        killHideCall();

        hideCallRef.current = gsap.delayedCall(NAV_POINTER_DELAY, () => {
          if (isPointerInsideDropdownRef.current) return;
          if (activeDropdownIndexRef.current !== index) return;
          closeDropdown();
        });

        return;
      }

      setNavVisualState(null);
    },
    [animateTextSwap, closeDropdown, killHideCall, setNavVisualState]
  );

  const onCtaHover = useCallback((isEntering = true) => {
    const ctaElement = ctaRef.current;
    if (!ctaElement) return;

    const defaultText = ctaElement.querySelector("[data-default]");
    const hoverText = ctaElement.querySelector("[data-hover]");

    gsap
      .timeline({
        defaults: { duration: CTA_DURATION, ease: "power2.out", overwrite: true },
      })
      .to(
        ctaElement,
        { backgroundColor: isEntering ? HOVER_CTA_BACKGROUND : DEFAULT_CTA_BACKGROUND },
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

  // Effects
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
    });

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

  // Derived values
  const dropdownItems = MENU_ITEMS[renderedDropdownIndex]?.dropdown || [];

  return (
    <div
      ref={navWrapRef}
      onMouseEnter={onHeaderMouseEnter}
      onMouseLeave={onHeaderMouseLeave}
      className="absolute top-[1vw] right-[2vw] rounded-md bg-[#363737] max-md:hidden"
    >
      <div className="relative flex h-full w-full items-center gap-[1.5vw] p-[0.3vw] pl-[1vw]">
        <div className="flex h-full items-center gap-[1.5vw]">
          {MENU_ITEMS.map((item, index) => (
            <Link
              key={item.name}
              ref={(element) => {
                navLinksRef.current[index] = element;
              }}
              href={item.href}
              className="relative flex items-center overflow-hidden py-[0.5vw] uppercase"
              onMouseEnter={() => onNavItemEnter(index)}
              onMouseLeave={() => onNavItemLeave(index)}
            >
              <div className="relative overflow-hidden">
                <span data-default className="flex items-center">
                  {item.name}
                  {item.isDropdown && <ChevronDown className="ml-1 h-[1vw] w-[1vw]" />}
                </span>

                <span
                  data-hover
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex items-center">
                    {item.name}
                    {item.isDropdown && <ChevronUp className="ml-1 h-[1vw] w-[1vw]" />}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          ref={ctaRef}
          href="#"
          className="relative overflow-hidden rounded-sm bg-white px-[0.5vw] py-[0.5vw] text-black"
          onMouseEnter={() => onCtaHover(true)}
          onMouseLeave={() => onCtaHover(false)}
        >
          <span data-default className="block">
            BUILT W/ HYPERIUX
          </span>
          <span
            data-hover
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            BUILT W/ HYPERIUX
          </span>
        </Link>

        <div
          ref={dropdownRef}
          onMouseEnter={onDropdownMouseEnter}
          onMouseLeave={onDropdownMouseLeave}
          className="absolute top-[calc(100%-.5vw)] left-0 h-fit w-full pt-[1.3vw]"
        >
          <div className="space-y-[0.4vw]">
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
                  className="flex items-center justify-between rounded-md bg-[#363737] p-[0.4vw] text-white transition-all duration-400 hover:scale-[1.02] hover:bg-white hover:text-black!"
                >
                  <div className="flex items-center gap-[1.5vw]">
                    <div className="size-[5vw] overflow-hidden rounded-md">
                      <div className="relative h-full w-full">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: IMAGE_TINT,
                            mixBlendMode: "multiply",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div className="relative overflow-hidden uppercase">
                      <span data-default className="block">
                        {item.title}
                      </span>
                      <span data-hover className="absolute inset-0 flex items-center">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="mr-[2vw] h-[1vw] w-[1vw]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
