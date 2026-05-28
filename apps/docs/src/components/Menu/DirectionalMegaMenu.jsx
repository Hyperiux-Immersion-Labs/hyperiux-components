"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ChevronBird from "../ChevronBird/ChevronBird";

const DEFAULT_ANIMATION = {
  contentFadeDelay: 0.06,
  contentFadeDuration: 0.18,
  distance: 56,
  duration: 0.26,
  ease: "power2.out",
  fade: true,
  heightDuration: 0.22,
  heightEase: "power2.out",
};

const DEFAULT_TRANSITION_DIRECTION = 1;
const NO_INDEX = null;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const hasDropdownContent = (item) => Boolean(item?.customContent);

const getPaneHeight = (element) => {
  if (!element) {
    return 0;
  }

  return element.offsetHeight || element.scrollHeight || 0;
};

export default function DirectionalMegaMenu({
  items = [],
  className = "",
  navClassName = "",
  navItemClassName = "",
  activeClassName = "text-white",
  inactiveClassName = "text-neutral-500",
  panelClassName = "",
  contentWrapperClassName = "",
  initialIndex = NO_INDEX,
  closeDelay = 180,
  animation = {},
  panelGap = 20,
  menuTop = "top-[105%]",
}) {
  // Animation config
  const config = useMemo(
    () => ({
      contentFadeDelay: animation.contentFadeDelay ?? DEFAULT_ANIMATION.contentFadeDelay,
      contentFadeDuration:
        animation.contentFadeDuration ??
        DEFAULT_ANIMATION.contentFadeDuration,
      distance: animation.distance ?? DEFAULT_ANIMATION.distance,
      duration: animation.duration ?? DEFAULT_ANIMATION.duration,
      ease: animation.ease ?? DEFAULT_ANIMATION.ease,
      fade: animation.fade ?? DEFAULT_ANIMATION.fade,
      heightDuration:
        animation.heightDuration ?? DEFAULT_ANIMATION.heightDuration,
      heightEase: animation.heightEase ?? DEFAULT_ANIMATION.heightEase,
    }),
    [animation]
  );

  // State and refs
  const [isOpen, setIsOpen] = useState(initialIndex !== NO_INDEX);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [nextIndex, setNextIndex] = useState(NO_INDEX);
  const [highlightedIndex, setHighlightedIndex] = useState(initialIndex);

  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const currentPaneRef = useRef(null);
  const nextPaneRef = useRef(null);
  const menuPanelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const queuedIndexRef = useRef(NO_INDEX);
  const hasOpenedOnceRef = useRef(initialIndex !== NO_INDEX);
  const visualIndexRef = useRef(initialIndex);
  const transitionDirectionRef = useRef(DEFAULT_TRANSITION_DIRECTION);

  const clearCloseTimer = () => {
    if (!closeTimerRef.current) {
      return;
    }

    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const resetMenuState = () => {
    setIsOpen(false);
    setCurrentIndex(NO_INDEX);
    setNextIndex(NO_INDEX);
    setHighlightedIndex(NO_INDEX);
    isAnimatingRef.current = false;
    queuedIndexRef.current = NO_INDEX;
    hasOpenedOnceRef.current = false;
    visualIndexRef.current = NO_INDEX;
    transitionDirectionRef.current = DEFAULT_TRANSITION_DIRECTION;
  };

  const killPanelTweens = () => {
    gsap.killTweensOf([
      menuPanelRef.current,
      panelRef.current,
      viewportRef.current,
      currentPaneRef.current,
      nextPaneRef.current,
    ]);
  };

  const closeMenu = () => {
    clearCloseTimer();

    if (!menuPanelRef.current) {
      resetMenuState();
      return;
    }

    killPanelTweens();

    gsap.to(menuPanelRef.current, {
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

  const openMenuAt = (index) => {
    const item = items[index];

    if (!item || !hasDropdownContent(item)) {
      return;
    }

    setIsOpen(true);
    setCurrentIndex(index);
    setNextIndex(NO_INDEX);
    setHighlightedIndex(index);

    queuedIndexRef.current = NO_INDEX;
    isAnimatingRef.current = false;
    hasOpenedOnceRef.current = false;
    visualIndexRef.current = index;
    transitionDirectionRef.current = DEFAULT_TRANSITION_DIRECTION;
  };

  const requestSwitch = (index) => {
    const item = items[index];

    if (!item) {
      return;
    }

    clearCloseTimer();
    setHighlightedIndex(index);

    if (!hasDropdownContent(item)) {
      setHighlightedIndex(NO_INDEX);

      if (isOpen) {
        closeMenu();
      }

      return;
    }

    if (!isOpen || currentIndex === NO_INDEX) {
      openMenuAt(index);
      return;
    }

    if (index === currentIndex && nextIndex === NO_INDEX) {
      visualIndexRef.current = index;
      return;
    }

    if (index === nextIndex) {
      visualIndexRef.current = index;
      return;
    }

    const baseIndex =
      queuedIndexRef.current !== NO_INDEX
        ? queuedIndexRef.current
        : nextIndex !== NO_INDEX
          ? nextIndex
          : visualIndexRef.current !== NO_INDEX
            ? visualIndexRef.current
            : currentIndex;

    const direction = index > baseIndex ? 1 : -1;

    if (isAnimatingRef.current) {
      queuedIndexRef.current = index;
      visualIndexRef.current = index;
      transitionDirectionRef.current = direction;
      return;
    }

    visualIndexRef.current = index;
    transitionDirectionRef.current = direction;
    setNextIndex(index);
  };

  const onWrapperMouseLeave = () => {
    scheduleClose();
  };

  const onItemEnter = (index) => {
    const item = items[index];

    if (!hasDropdownContent(item)) {
      clearCloseTimer();
      setHighlightedIndex(NO_INDEX);

      if (isOpen) {
        closeMenu();
      }

      return;
    }

    requestSwitch(index);
  };

  // Initial panel open
  useIsomorphicLayoutEffect(() => {
    if (!isOpen || currentIndex === NO_INDEX || !panelRef.current || !viewportRef.current) {
      return;
    }

    if (!currentPaneRef.current) {
      return;
    }

    gsap.killTweensOf([menuPanelRef.current, panelRef.current, viewportRef.current]);

    const contentHeight = getPaneHeight(currentPaneRef.current);

    if (!hasOpenedOnceRef.current) {
      gsap.set(menuPanelRef.current, {
        height: 0,
        opacity: 1,
      });

      gsap.set(viewportRef.current, {
        height: contentHeight,
        opacity: 0,
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          hasOpenedOnceRef.current = true;
          gsap.set(viewportRef.current, { height: contentHeight, opacity: 1 });
        },
      });

      timeline
        .to(
          menuPanelRef.current,
          {
            height: "auto",
            duration: config.heightDuration,
            ease: config.heightEase,
          },
          0
        )
        .to(
          viewportRef.current,
          {
            opacity: 1,
            duration: config.contentFadeDuration,
            ease: "power2.out",
          },
          config.contentFadeDelay
        );

      return;
    }

    gsap.set(viewportRef.current, {
      height: contentHeight,
    });
  }, [
    config.contentFadeDelay,
    config.contentFadeDuration,
    config.heightDuration,
    config.heightEase,
    currentIndex,
    isOpen,
  ]);

  // Sync static panel height
  useIsomorphicLayoutEffect(() => {
    if (currentIndex === NO_INDEX || nextIndex !== NO_INDEX) {
      return;
    }

    if (!currentPaneRef.current || !viewportRef.current) {
      return;
    }

    const height = getPaneHeight(currentPaneRef.current);
    gsap.set(viewportRef.current, { height });
  }, [currentIndex, nextIndex]);

  // Animate panel switch
  useIsomorphicLayoutEffect(() => {
    if (nextIndex === NO_INDEX) {
      return;
    }

    if (!currentPaneRef.current || !nextPaneRef.current || !viewportRef.current) {
      return;
    }

    const currentElement = currentPaneRef.current;
    const nextElement = nextPaneRef.current;
    const currentHeight = getPaneHeight(currentElement);
    const nextHeight = getPaneHeight(nextElement);
    const targetIndex = nextIndex;
    const direction = transitionDirectionRef.current;
    const distance = config.distance;

    isAnimatingRef.current = true;

    gsap.killTweensOf([currentElement, nextElement, viewportRef.current]);

    gsap.set(currentElement, {
      position: "absolute",
      inset: 0,
      x: 0,
      opacity: 1,
      zIndex: 1,
      pointerEvents: "none",
    });

    gsap.set(nextElement, {
      position: "absolute",
      inset: 0,
      x: direction > 0 ? distance : -distance,
      opacity: config.fade ? 0 : 1,
      zIndex: 2,
      pointerEvents: "none",
    });

    gsap.set(viewportRef.current, {
      height: currentHeight,
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(targetIndex);
        setNextIndex(NO_INDEX);
        isAnimatingRef.current = false;
        visualIndexRef.current = targetIndex;

        const queuedIndex = queuedIndexRef.current;
        queuedIndexRef.current = NO_INDEX;

        if (
          queuedIndex !== NO_INDEX &&
          queuedIndex !== targetIndex &&
          items[queuedIndex] &&
          hasDropdownContent(items[queuedIndex])
        ) {
          requestSwitch(queuedIndex);
        }
      },
    });

    timeline
      .to(
        viewportRef.current,
        {
          height: nextHeight,
          duration: config.heightDuration,
          ease: config.heightEase,
        },
        0
      )
      .to(
        currentElement,
        {
          x: direction > 0 ? -distance : distance,
          opacity: config.fade ? 0 : 1,
          duration: config.duration,
          ease: config.ease,
        },
        0
      )
      .to(
        nextElement,
        {
          x: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
        },
        0
      );
  }, [config.distance, config.duration, config.ease, config.fade, config.heightDuration, config.heightEase, items, nextIndex]);

  // Cleanup
  useEffect(() => {
    const panel = panelRef.current;
    const viewport = viewportRef.current;
    const currentPane = currentPaneRef.current;
    const nextPane = nextPaneRef.current;

    return () => {
      clearCloseTimer();
      gsap.killTweensOf(panel);
      gsap.killTweensOf(viewport);
      gsap.killTweensOf([currentPane, nextPane]);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full py-8.5  ${className}`}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={onWrapperMouseLeave}
    >
      <div className={`flex items-center justify-center gap-8 ${navClassName}`}>
        {items.map((item, index) => {
          const isActive = highlightedIndex === index;

          return (
            <button
              key={item.label || index}
              type="button"
              onMouseEnter={() => onItemEnter(index)}
              className={`relative flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-300 hover:text-white max-md:text-lg max-sm:text-sm ${navItemClassName} ${
                isActive ? activeClassName : inactiveClassName
              }`}
            >
              {item.label}
              {hasDropdownContent(item) && <ChevronBird isActive={isActive} />}
            </button>
          );
        })}
      </div>

      {isOpen && currentIndex !== NO_INDEX && hasDropdownContent(items[currentIndex]) && (
        <div style={{ paddingTop: `${panelGap}px` }}>
          <div
            ref={menuPanelRef}
            className={`menu-container w-full overflow-hidden ${menuTop}`}
          >
            <div
              ref={panelRef}
              className={`w-full overflow-hidden rounded-[0.5vw] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transform-gpu ${panelClassName} ${contentWrapperClassName}`}
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

                {nextIndex !== NO_INDEX && hasDropdownContent(items[nextIndex]) && (
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
