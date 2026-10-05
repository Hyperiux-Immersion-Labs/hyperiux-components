// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const isVisible = (element?: HTMLElement | null): boolean => {
  if (!element || element.hidden) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.visibility === "hidden" || style.visibility === "collapse") {
    return false;
  }

  return element.getClientRects().length > 0;
};

const getFocusableElements = (container?: HTMLElement | null): HTMLElement[] => {
  if (!container) {
    return [];
  }

  return (
    Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[]
  ).filter(isVisible);
};

interface UseFocusTrapParams {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

/**
 * Keeps keyboard focus inside `containerRef` while `active` is true.
 *
 * - Captures the element focused before opening and restores focus to it on
 *   close (so the trigger button gets focus back).
 * - Moves focus into the menu on open (to `initialFocusRef` when provided,
 *   otherwise the first focusable element).
 * - Wraps Tab / Shift+Tab around the menu's focusable elements.
 * - Calls `onEscape` when the Escape key is pressed.
 */
export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: UseFocusTrapParams) {
  const onEscapeRef = useRef(onEscape);
  useLayoutEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusInitial = () => {
      const target =
        initialFocusRef?.current ??
        getFocusableElements(container)[0] ??
        container;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target === container && !container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }

      target.focus();
    };

    // Defer focus so it lands after the menu has mounted / started animating in.
    const focusFrame = requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(container);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !container.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (activeElement === last || !container.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
}

const __ElevateDesktopNav_DEFAULT_MENU_ITEMS = [
  {
    name: "Effects",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "All Effects", img: "https://picsum.photos/seed/h09/1600/1200", href: "#" },
      { title: "Components", img: "https://picsum.photos/seed/h10/1600/1200", href: "#" },
      { title: "WebGL", img: "https://picsum.photos/seed/h11/1600/1200", href: "#" },
    ],
  },
  {
    name: "Tech",
    href: "/tech",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "https://picsum.photos/seed/h01/1600/1200", href: "#" },
      { title: "GSAP Effects", img: "https://picsum.photos/seed/h02/1600/1200", href: "#" },
      { title: "Three.js Effects", img: "https://picsum.photos/seed/h03/1600/1200", href: "#" },
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
      { title: "Introduction", img: "https://picsum.photos/seed/h05/1600/1200", href: "#" },
      { title: "Installation", img: "https://picsum.photos/seed/h06/1600/1200", href: "#" },
      { title: "CLI", img: "https://picsum.photos/seed/h07/1600/1200", href: "#" },
    ],
  },
];

const DROPDOWN_ITEM_OFFSET_Y = -8;
const DROPDOWN_ITEM_STAGGER_IN = 0.025;
const FAST_SWITCH_OUT_DURATION = 0.1;
const DROPDOWN_ITEM_STAGGER_OUT = 0.015;
const NAV_TEXT_DURATION = 0.35;
const CTA_DURATION = 0.4;
const DROPDOWN_POINTER_DELAY = 0.03;

const DIMMED_TEXT_COLOR = "rgba(255,255,255,0.5)";
const ACTIVE_TEXT_COLOR = "rgba(255,255,255,1)";
const DEFAULT_CTA_BACKGROUND = "#fff";
const HOVER_CTA_BACKGROUND = "#000";

const __ElevateDesktopNav_DEFAULT_CTA = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};

export interface ElevateDropdownItem {
  title: string;
  img: string;
  href: string;
}

export interface ElevateMenuItem {
  name: string;
  href: string;
  isDropdown: boolean;
  dropdown?: ElevateDropdownItem[] | null;
}

export interface ElevateCta {
  label: string;
  href: string;
}

interface ElevateTextSwapData {
  defaultText: Element | null;
  hoverText: Element | null;
}

interface ElevateNavbarDesktopProps {
  menuItems?: ElevateMenuItem[];
  cta?: ElevateCta;
  navTextDuration?: number;
  ctaDuration?: number;
  activeColor?: string;
  inactiveColor?: string;
  ease?: string;
  dropdownItemOffsetY?: number;
  dropdownPointerDelay?: number;
  staggerItems?: boolean;
  ctaBackground?: string;
  ctaHoverBackground?: string;
}

export function ElevateNavbarDesktop({
  menuItems = __ElevateDesktopNav_DEFAULT_MENU_ITEMS,
  cta = __ElevateDesktopNav_DEFAULT_CTA,
  navTextDuration = NAV_TEXT_DURATION,
  ctaDuration = CTA_DURATION,
  activeColor = ACTIVE_TEXT_COLOR,
  inactiveColor = DIMMED_TEXT_COLOR,
  ease = "power2.out",
  dropdownItemOffsetY = DROPDOWN_ITEM_OFFSET_Y,
  dropdownPointerDelay = DROPDOWN_POINTER_DELAY,
  staggerItems = true,
  ctaBackground = DEFAULT_CTA_BACKGROUND,
  ctaHoverBackground = HOVER_CTA_BACKGROUND,
}: ElevateNavbarDesktopProps) {
  const navWrapRef = useRef<HTMLDivElement | null>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dropdownTextDataRef = useRef<(ElevateTextSwapData | null)[]>([]);
  const linkDataRef = useRef<(ElevateTextSwapData | null)[]>([]);

  const activeDropdownIndexRef = useRef<number | null>(null);
  const isPointerInsideDropdownRef = useRef(false);
  const hideCallRef = useRef<gsap.core.Tween | null>(null);
  const switchTweenRef = useRef<gsap.core.Tween | null>(null);
  const itemTweenRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  const [renderedDropdownIndex, setRenderedDropdownIndexState] = useState<number | null>(null);
  const [activeChevronIndex, setActiveChevronIndex] = useState<number | null>(null);
  const reduceMotion = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
    []
  );

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
    return dropdownItemsRef.current.filter(Boolean) as HTMLDivElement[];
  }, []);

  const setRenderedDropdownIndex = useCallback((index: number | null) => {
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

  const setNavVisualState = useCallback((activeIndex: number | null) => {
    navLinksRef.current.forEach((linkElement, index) => {
      if (!linkElement) return;

      const color =
        activeIndex !== null && index !== activeIndex
          ? inactiveColor
          : activeColor;

      if (reduceMotion()) {
        gsap.set(linkElement, { color });
        return;
      }

      gsap.to(linkElement, {
        color,
        duration: navTextDuration,
        ease,
        overwrite: true,
      });
    });
  }, [activeColor, ease, inactiveColor, navTextDuration, reduceMotion]);

  const animateTextSwap = useCallback((item: ElevateTextSwapData | null, isEntering: boolean) => {
    if (!item) return;

    if (reduceMotion()) {
      gsap.set(item.defaultText, { yPercent: 0 });
      gsap.set(item.hoverText, { yPercent: 100 });
      return;
    }

    gsap
      .timeline({
        defaults: {
          duration: navTextDuration,
          ease,
          overwrite: true,
        },
      })
      .to(item.defaultText, { yPercent: isEntering ? -100 : 0 }, 0)
      .to(item.hoverText, { yPercent: isEntering ? 0 : 100 }, 0);
  }, [ease, navTextDuration, reduceMotion]);

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

    if (reduceMotion()) {
      gsap.set(dropdownItems, {
        opacity: 1,
        y: 0,
        pointerEvents: "auto",
      });
      return;
    }

    gsap.set(dropdownItems, {
      opacity: 0,
      y: dropdownItemOffsetY,
      pointerEvents: "auto",
    });

    itemTweenRef.current = gsap.timeline({
      overwrite: true,
    });

    itemTweenRef.current.to(dropdownItems, {
      y: 0,
      opacity: 1,
      duration: navTextDuration,
      stagger: staggerItems ? DROPDOWN_ITEM_STAGGER_IN : 0,
      ease,
    });
  }, [dropdownItemOffsetY, ease, getCurrentDropdownItems, killItemTween, navTextDuration, reduceMotion, staggerItems]);

  const animateDropdownItemsOut = useCallback(
    (onComplete?: () => void, fast = false) => {
      const dropdownItems = getCurrentDropdownItems();

      if (!dropdownItems.length) {
        onComplete?.();
        return;
      }

      killItemTween();
      gsap.killTweensOf(dropdownItems);

      if (reduceMotion()) {
        gsap.set(dropdownItems, {
          y: DROPDOWN_ITEM_OFFSET_Y,
          opacity: 0,
          pointerEvents: "none",
        });
        onComplete?.();
        return;
      }

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
        y: dropdownItemOffsetY,
        opacity: 0,
        duration: fast ? FAST_SWITCH_OUT_DURATION : navTextDuration,
        stagger: staggerItems && !fast ? DROPDOWN_ITEM_STAGGER_OUT : 0,
        ease,
      });
    },
    [dropdownItemOffsetY, ease, getCurrentDropdownItems, killItemTween, navTextDuration, reduceMotion, staggerItems]
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
    (index: number) => {
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

        if (reduceMotion()) {
          gsap.set(dropdownItems, {
            y: 0,
            opacity: 1,
            pointerEvents: "auto",
          });
          return;
        }

        gsap.set(dropdownItems, {
          pointerEvents: "auto",
        });

        itemTweenRef.current = gsap.to(dropdownItems, {
          y: 0,
          opacity: 1,
          duration: navTextDuration,
          stagger: 0.02,
          ease,
          overwrite: true,
        });

        return;
      }

      switchTweenRef.current = gsap.delayedCall(0, () => {
        animateDropdownItemsOut(() => {
          if (activeDropdownIndexRef.current === null) return;

          setRenderedDropdownIndex(activeDropdownIndexRef.current);
        }, true);
      });
    },
    [
      animateDropdownItemsOut,
      ease,
      getCurrentDropdownItems,
      killHideCall,
      killItemTween,
      killSwitchTween,
      menuItems,
      navTextDuration,
      renderedDropdownIndex,
      reduceMotion,
      setRenderedDropdownIndex,
      showWrapper,
    ]
  );

  const scheduleCloseDropdown = useCallback(() => {
    killHideCall();

    if (reduceMotion()) {
      if (isPointerInsideDropdownRef.current) return;
      closeDropdown();
      return;
    }

    hideCallRef.current = gsap.delayedCall(dropdownPointerDelay, () => {
      if (isPointerInsideDropdownRef.current) return;

      closeDropdown();
    });
  }, [closeDropdown, dropdownPointerDelay, killHideCall, reduceMotion]);

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
    (index: number) => {
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
    (index: number) => {
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

  const onCtaHover = useCallback((isEntering: boolean = true) => {
    const ctaElement = ctaRef.current;

    if (!ctaElement) return;

    const defaultText = ctaElement.querySelector("[data-default]");
    const hoverText = ctaElement.querySelector("[data-hover]");

    if (reduceMotion()) {
      gsap.set(ctaElement, {
        backgroundColor: isEntering
          ? ctaHoverBackground
          : ctaBackground,
        color: isEntering ? "#fff" : "#000",
      });
      gsap.set(defaultText, { yPercent: 0 });
      gsap.set(hoverText, { yPercent: 100 });
      return;
    }

    gsap
      .timeline({
        defaults: {
          duration: ctaDuration,
          ease,
          overwrite: true,
        },
      })
      .to(
        ctaElement,
        {
          backgroundColor: isEntering ? ctaHoverBackground : ctaBackground,
        },
        0
      )
      .to(defaultText, { yPercent: isEntering ? -100 : 0 }, 0)
      .to(hoverText, { yPercent: isEntering ? 0 : 100 }, 0);
  }, [ctaBackground, ctaDuration, ctaHoverBackground, ease, reduceMotion]);

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
    (index: number) => {
      animateTextSwap(dropdownTextDataRef.current[index], true);
    },
    [animateTextSwap]
  );

  const onDropdownItemLeave = useCallback(
    (index: number) => {
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
    <>
    <div
      className={`pointer-events-none fixed inset-0 z-998 bg-black/40 transition-opacity duration-150 ease-out motion-reduce:transition-none ${
        activeChevronIndex !== null ? "opacity-100" : "opacity-0"
      }`}
    />
    <div
      ref={navWrapRef}
      onMouseEnter={onHeaderMouseEnter}
      onMouseLeave={onHeaderMouseLeave}
      className="absolute z-999 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[0.55vw] bg-[#363737] text-[0.98vw]"
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
                style={{ color: inactiveColor }}
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
                    className={`h-[1.3vw] w-[1.3vw] shrink-0 transition-transform duration-100 ease-out motion-reduce:rotate-0 motion-reduce:transition-none ${
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
          style={{ backgroundColor: ctaBackground }}
          className="relative overflow-hidden rounded-[0.26vw] px-[0.65vw] py-[0.65vw] text-[0.98vw] leading-none text-black"
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
                  className="flex items-center justify-between rounded-[0.55vw] bg-[#363737] p-[0.52vw] text-[0.98vw] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-black! motion-reduce:scale-100 motion-reduce:bg-[#363737] motion-reduce:text-white! motion-reduce:transition-none"
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
    </>
  );
}

const __ElevateMobileNav_DEFAULT_MENU_ITEMS: ElevateMenuItem[] = [
  {
    name: "Effects",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "All Effects", img: "https://picsum.photos/seed/h09/1600/1200", href: "#" },
      { title: "Components", img: "https://picsum.photos/seed/h10/1600/1200", href: "#" },
      { title: "WebGL", img: "https://picsum.photos/seed/h11/1600/1200", href: "#" },
    ],
  },
  {
    name: "Tech",
    href: "/tech",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "https://picsum.photos/seed/h01/1600/1200", href: "#" },
      { title: "GSAP Effects", img: "https://picsum.photos/seed/h02/1600/1200", href: "#" },
      { title: "Three.js Effects", img: "https://picsum.photos/seed/h03/1600/1200", href: "#" },
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
      { title: "Introduction", img: "https://picsum.photos/seed/h05/1600/1200", href: "#" },
      { title: "Installation", img: "https://picsum.photos/seed/h06/1600/1200", href: "#" },
      { title: "CLI", img: "https://picsum.photos/seed/h07/1600/1200", href: "#" },
    ],
  },
];

const __ElevateMobileNav_DEFAULT_CTA: ElevateCta = {
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
  menuItems = __ElevateMobileNav_DEFAULT_MENU_ITEMS,
  cta = __ElevateMobileNav_DEFAULT_CTA,
  duration = 0.35,
  ease = "power3.out",
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.85)",
}: ElevateNavbarMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const motionDuration = Math.max(0.05, Number(duration) || 0.35);

  useFocusTrap({
    active: isMenuOpen,
    containerRef,
    initialFocusRef: toggleButtonRef,
    onEscape: () => setIsMenuOpen(false),
  });

  useEffect(() => {
    const panelElement = panelRef.current;

    if (!panelElement) return;

    if (isMenuOpen) {
      gsap.set(panelElement, {
        pointerEvents: "auto",
      });

      if (reduceMotion()) {
        gsap.set(panelElement, {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

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
    <>
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-998 bg-black/5 transition-opacity duration-150 ease-out motion-reduce:transition-none ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    <div
      ref={containerRef}
      className="fixed h-fit left-1/2 max-[1025px]:top-[10%] max-md:top-[31%] -translate-x-1/2 z-999"
    >

      <div className="flex items-center justify-between gap-[2vw] rounded-[2vw] border border-white/10 bg-[#2f2f2f]/90 px-[3vw] max-[1025px]:py-[1vw] max-md:py-[2vw] backdrop-blur-xl">
        <span className="px-[2vw] text-[3vw] uppercase tracking-wide text-white/80">
          Hyperiux
        </span>

        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className={`flex h-[8vw] w-[8vw] items-center justify-center rounded-[1vw] transition duration-300 hover:scale-90 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
            isMenuOpen ? "text-black" : "text-white"
          }`}
          style={{ backgroundColor: isMenuOpen ? activeColor : undefined }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none relative block h-[3.5vw] w-[3.5vw] max-md:h-[4.5vw] max-md:w-[4.5vw]"
          >
            <span
              className={`absolute left-0 top-1/2 h-[0.4vw] w-full rounded-full bg-current transition-transform duration-300 ease-in-out max-md:h-[0.6vw] motion-reduce:transition-none ${
                isMenuOpen
                  ? "-translate-y-[0.2vw] rotate-45 max-md:-translate-y-[0.3vw]"
                  : "-translate-y-[1.4vw] max-md:-translate-y-[1.8vw]"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[0.4vw] w-full -translate-y-[0.2vw] rounded-full bg-current transition-all duration-300 ease-in-out max-md:h-[0.6vw] max-md:-translate-y-[0.3vw] motion-reduce:transition-none ${
                isMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[0.4vw] w-full rounded-full bg-current transition-transform duration-300 ease-in-out max-md:h-[0.6vw] motion-reduce:transition-none ${
                isMenuOpen
                  ? "-translate-y-[0.2vw] -rotate-45 max-md:-translate-y-[0.3vw]"
                  : "translate-y-[1vw] max-md:translate-y-[1.2vw]"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        ref={panelRef}
        className="mt-[2vw] w-[92vw] rounded-[2vw] border border-white/10 bg-[#2f2f2f]/95 p-[2vw] backdrop-blur-xl"
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
                  className="flex items-center justify-between rounded-[1.2vw] px-[3vw] py-[2.5vw] max-[1025px]:text-[2.5vw] max-md:text-[3vw] uppercase text-white/85 transition hover:bg-white/10 motion-reduce:bg-transparent motion-reduce:transition-none"
                  style={{ color: inactiveColor }}
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
                  className="flex w-full items-center justify-between rounded-[1.2vw] px-[3vw] py-[2.5vw] max-[1025px]:text-[2.5vw]! max-md:text-[3vw]! uppercase text-white/85 transition hover:bg-white/10 motion-reduce:bg-transparent motion-reduce:transition-none"
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
                      <Link
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-[3vw] rounded-[1vw] bg-white/5 p-[2vw] max-md:text-[2.8vw] max-[1025px]:text-[2vw]  uppercase text-white/80 transition hover:bg-white/10 motion-reduce:bg-white/5 motion-reduce:transition-none"
                        style={{ color: inactiveColor }}
                      >
                        <div className="relative h-[10vw] w-[10vw] overflow-hidden rounded-[1vw] bg-white/25">
                          <Image
                            src={dropdownItem.img}
                            alt={dropdownItem.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
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
              className="block w-full max-md:py-[3vw] rounded-[1.5vw] bg-white py-[1.5vw] text-center max-md:text-[3vw] max-[1025px]:text-[2.5vw] font-semibold text-black"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

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
      <div className="absolute left-1/2 top-[30%] max-md:top-[15%] w-full -translate-x-1/2 -translate-y-1/2 text-center text-[#363737]">
        <h1 className="text-[8vw] font-black uppercase">
          Elevate Navbar
        </h1>
        <p className="mt-4 text-[1.2vw] max-[1025px]:text-[2vw] max-[1025px]:w-[80%] max-[1025px]:mx-auto max-md:text-[3vw]">
          Hover over the navbar to see the effect. Resize the window to see the responsive design in action.
        </p>
      </div>

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
      { title: "All Effects", img: "https://picsum.photos/seed/h09/1600/1200", href: "#" },
      { title: "Components", img: "https://picsum.photos/seed/h10/1600/1200", href: "#" },
      { title: "WebGL", img: "https://picsum.photos/seed/h11/1600/1200", href: "#" },
    ],
  },
  {
    name: "Tech",
    href: "/tech",
    isDropdown: true,
    dropdown: [
      { title: "React Effects", img: "https://picsum.photos/seed/h01/1600/1200", href: "#" },
      { title: "GSAP Effects", img: "https://picsum.photos/seed/h02/1600/1200", href: "#" },
      { title: "Three.js Effects", img: "https://picsum.photos/seed/h03/1600/1200", href: "#" },
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
      { title: "Introduction", img: "https://picsum.photos/seed/h05/1600/1200", href: "#" },
      { title: "Installation", img: "https://picsum.photos/seed/h06/1600/1200", href: "#" },
      { title: "CLI", img: "https://picsum.photos/seed/h07/1600/1200", href: "#" },
    ],
  },
];

const cta = {
  label: "BUILT W/ HYPERIUX",
  href: "#",
};
