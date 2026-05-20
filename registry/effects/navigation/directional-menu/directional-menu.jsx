"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ChevronBird } from "@/components/hyperiux/chevron-bird";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function DirectionalMenu({
  items = [],
  className = "",
  navClassName = "",
  navItemClassName = "",
  activeClassName = "text-white",
  inactiveClassName = "text-neutral-500",
  panelClassName = "",
  contentWrapperClassName = "",
  initialIndex = null,
  closeDelay = 180,
  animation = {},
  panelGap = 20,
  menuTop = "top-[105%]",
}) {
  const config = useMemo(() => {
    return {
      duration: animation.duration ?? 0.26,
      ease: animation.ease ?? "power2.out",
      distance: animation.distance ?? 56,
      fade: animation.fade ?? true,
      heightDuration: animation.heightDuration ?? 0.22,
      heightEase: animation.heightEase ?? "power2.out",
      openOpacityDuration: animation.openOpacityDuration ?? 0.18,
      closeOpacityDuration: animation.closeOpacityDuration ?? 0.16,
    };
  }, [animation]);

  const [isOpen, setIsOpen] = useState(initialIndex !== null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [nextIndex, setNextIndex] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(initialIndex);

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const currentPaneRef = useRef(null);
  const nextPaneRef = useRef(null);
  const menuPannelRef = useRef(null);

  const closeTimerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const queuedIndexRef = useRef(null);
  const hasOpenedOnceRef = useRef(initialIndex !== null);
  const visualIndexRef = useRef(initialIndex);
  const transitionDirectionRef = useRef(1);

  const hasDropdownContent = (item) => {
    if (!item) return false;
    return Boolean(item.customContent);
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const getPaneHeight = (el) => {
    if (!el) return 0;
    return el.offsetHeight || el.scrollHeight || 0;
  };

  const resetMenuState = () => {
    setIsOpen(false);
    setCurrentIndex(null);
    setNextIndex(null);
    setHighlightedIndex(null);
    isAnimatingRef.current = false;
    queuedIndexRef.current = null;
    hasOpenedOnceRef.current = false;
    visualIndexRef.current = null;
    transitionDirectionRef.current = 1;
  };

  const closeMenu = () => {
    clearCloseTimer();

    if (!menuPannelRef.current) {
      resetMenuState();
      return;
    }

    gsap.killTweensOf([
      menuPannelRef.current,
      panelRef.current,
      viewportRef.current,
      currentPaneRef.current,
      nextPaneRef.current,
    ]);

    gsap.to(menuPannelRef.current, {
      opacity: 0,
      height: 0,
      duration: config.heightDuration,
      ease: config.heightEase,
      onComplete: resetMenuState,
    });
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeMenu();
    }, closeDelay);
  };

  const handleWrapperMouseLeave = () => {
    scheduleClose();
  };

  const openMenuAt = (index) => {
    const item = items[index];
    if (!item || !hasDropdownContent(item)) return;

    setIsOpen(true);
    setCurrentIndex(index);
    setNextIndex(null);
    setHighlightedIndex(index);

    queuedIndexRef.current = null;
    isAnimatingRef.current = false;
    hasOpenedOnceRef.current = false;
    visualIndexRef.current = index;
    transitionDirectionRef.current = 1;
  };

  const requestSwitch = (index) => {
    const item = items[index];
    if (!item) return;

    clearCloseTimer();
    setHighlightedIndex(index);

    if (!hasDropdownContent(item)) {
      setHighlightedIndex(null);

      if (isOpen) {
        closeMenu();
      }

      return;
    }

    if (!isOpen || currentIndex === null) {
      openMenuAt(index);
      return;
    }

    if (index === currentIndex && nextIndex === null) {
      visualIndexRef.current = index;
      return;
    }

    if (index === nextIndex) {
      visualIndexRef.current = index;
      return;
    }

    const baseIndex =
      queuedIndexRef.current !== null
        ? queuedIndexRef.current
        : nextIndex !== null
          ? nextIndex
          : visualIndexRef.current !== null
            ? visualIndexRef.current
            : currentIndex;

    const dir = index > baseIndex ? 1 : -1;

    if (isAnimatingRef.current) {
      queuedIndexRef.current = index;
      visualIndexRef.current = index;
      transitionDirectionRef.current = dir;
      return;
    }

    visualIndexRef.current = index;
    transitionDirectionRef.current = dir;
    setNextIndex(index);
  };

  const handleItemEnter = (index) => {
    const item = items[index];

    if (!hasDropdownContent(item)) {
      clearCloseTimer();
      setHighlightedIndex(null);

      if (isOpen) {
        closeMenu();
      }

      return;
    }

    requestSwitch(index);
  };

  useIsomorphicLayoutEffect(() => {
    if (
      !isOpen ||
      currentIndex === null ||
      !panelRef.current ||
      !viewportRef.current
    ) {
      return;
    }

    if (!currentPaneRef.current) return;

    gsap.killTweensOf([panelRef.current, viewportRef.current]);

    const contentHeight = getPaneHeight(currentPaneRef.current);

    if (!hasOpenedOnceRef.current) {
      gsap.set(menuPannelRef.current, {
        height: 0,
        opacity: 0,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          hasOpenedOnceRef.current = true;
          gsap.set(viewportRef.current, { height: contentHeight });
        },
      });

      tl.to(
        viewportRef.current,
        {
          duration: config.heightDuration,
          ease: config.heightEase,
        },
        0,
      ).to(
        menuPannelRef.current,
        {
          height: "auto",
          opacity: 1,
          duration: config.openOpacityDuration,
          ease: "power2.out",
        },
        0,
      );

      return;
    }

    gsap.set(viewportRef.current, {
      height: contentHeight,
    });
  }, [
    isOpen,
    currentIndex,
    config.heightDuration,
    config.heightEase,
    config.openOpacityDuration,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (currentIndex === null) return;
    if (!currentPaneRef.current || !viewportRef.current) return;
    if (nextIndex !== null) return;

    const h = getPaneHeight(currentPaneRef.current);
    gsap.set(viewportRef.current, { height: h });
  }, [currentIndex, nextIndex]);

  useIsomorphicLayoutEffect(() => {
    if (nextIndex === null) return;
    if (
      !currentPaneRef.current ||
      !nextPaneRef.current ||
      !viewportRef.current
    ) {
      return;
    }

    const currentEl = currentPaneRef.current;
    const nextEl = nextPaneRef.current;
    const currentHeight = getPaneHeight(currentEl);
    const nextHeight = getPaneHeight(nextEl);

    const targetIndex = nextIndex;
    const dir = transitionDirectionRef.current;
    const distance = config.distance;

    isAnimatingRef.current = true;

    gsap.killTweensOf([currentEl, nextEl, viewportRef.current]);

    gsap.set(currentEl, {
      position: "absolute",
      inset: 0,
      x: 0,
      opacity: 1,
      zIndex: 1,
      pointerEvents: "none",
    });

    gsap.set(nextEl, {
      position: "absolute",
      inset: 0,
      x: dir > 0 ? distance : -distance,
      opacity: config.fade ? 0 : 1,
      zIndex: 2,
      pointerEvents: "none",
    });

    gsap.set(viewportRef.current, {
      height: currentHeight,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(targetIndex);
        setNextIndex(null);
        isAnimatingRef.current = false;
        visualIndexRef.current = targetIndex;

        const queued = queuedIndexRef.current;
        queuedIndexRef.current = null;

        if (
          queued !== null &&
          queued !== targetIndex &&
          items[queued] &&
          hasDropdownContent(items[queued])
        ) {
          requestSwitch(queued);
        }
      },
    });

    tl.to(
      viewportRef.current,
      {
        height: nextHeight,
        duration: config.heightDuration,
        ease: config.heightEase,
      },
      0,
    )
      .to(
        currentEl,
        {
          x: dir > 0 ? -distance : distance,
          opacity: config.fade ? 0 : 1,
          duration: config.duration,
          ease: config.ease,
        },
        0,
      )
      .to(
        nextEl,
        {
          x: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
        },
        0,
      );
  }, [nextIndex, config, items]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
      gsap.killTweensOf(panelRef.current);
      gsap.killTweensOf(viewportRef.current);
      gsap.killTweensOf([currentPaneRef.current, nextPaneRef.current]);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-fit ${className}`}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <div className={`flex justify-center gap-8 ${navClassName}`}>
        {items.map((item, index) => {
          const isActive = highlightedIndex === index;

          return (
            <button
              key={item.label || index}
              type="button"
              onMouseEnter={() => handleItemEnter(index)}
              className={`relative flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors duration-300 hover:text-white ${navItemClassName} ${
                isActive ? activeClassName : inactiveClassName
              }`}
            >
              {item.label}

              {hasDropdownContent(item) && <ChevronBird isActive={isActive} />}
            </button>
          );
        })}
      </div>

      {isOpen &&
        currentIndex !== null &&
        hasDropdownContent(items[currentIndex]) && (
          <div style={{ paddingTop: `${panelGap}px` }}>
            <div
              ref={menuPannelRef}
              className={`menu-container absolute left-0 top-full w-full overflow-hidden ${menuTop}`}
            >
              <div
                ref={panelRef}
                className={`w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg ${panelClassName} ${contentWrapperClassName}`}
              >
                <div
                  ref={viewportRef}
                  className="relative"
                  onMouseEnter={clearCloseTimer}
                >
                  <div
                    key={`current-${currentIndex}`}
                    ref={currentPaneRef}
                    className="relative w-full"
                  >
                    {items[currentIndex]?.customContent || null}
                  </div>

                  {nextIndex !== null &&
                    hasDropdownContent(items[nextIndex]) && (
                      <div
                        key={`next-${nextIndex}`}
                        ref={nextPaneRef}
                        className="absolute left-0 top-0 w-full"
                      >
                        {items[nextIndex]?.customContent || null}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
