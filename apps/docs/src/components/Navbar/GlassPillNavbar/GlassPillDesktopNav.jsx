"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ElevateNavbarDesktop() {
  const navWrapRef = useRef(null);
  const navLinksRef = useRef([]);
  const ctaRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownItemsRef = useRef([]);
  const dropdownTextData = useRef([]);
  const linkData = useRef([]);
  const activeDropdownIndexRef = useRef(null);
  const isPointerInsideDropdownRef = useRef(false);
  const hideCallRef = useRef(null);
  const switchTweenRef = useRef(null);
  const itemTweenRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [renderedDropdownIndex, setRenderedDropdownIndex] = useState(null);

  const menuItems = [
    {
      name: "Solutions",
      href: "#",
      isDropdown: false,
      dropdown: null,
    },
    {
      name: "Tech",
      href: "#",
      isDropdown: true,
      dropdown: [
        { title: "AI Tools", img: "/img/dino2.png", href: "#" },
        { title: "Web Stack", img: "/img/dino2.png", href: "#" },
      ],
    },
    {
      name: "Industries",
      href: "#",
      isDropdown: false,
      dropdown: null,
    },
    {
      name: "The Company",
      href: "#",
      isDropdown: true,
      dropdown: [
        { title: "Manifesto", img: "/img/dino2.png", href: "#" },
        { title: "Co-founder", img: "/img/dino2.png", href: "#" },
        { title: "Career", img: "/img/dino2.png", href: "#" },
      ],
    },
  ];

  const killHideCall = () => {
    if (hideCallRef.current) {
      hideCallRef.current.kill();
      hideCallRef.current = null;
    }
  };

  const killSwitchTween = () => {
    if (switchTweenRef.current) {
      switchTweenRef.current.kill();
      switchTweenRef.current = null;
    }
  };

  const killItemTween = () => {
    if (itemTweenRef.current) {
      itemTweenRef.current.kill();
      itemTweenRef.current = null;
    }
  };

  const getCurrentDropdownItems = () => {
    return dropdownItemsRef.current.filter(Boolean);
  };

  const initDropdownItemText = useCallback(() => {
    dropdownTextData.current = dropdownItemsRef.current.map((el) => {
      if (!el) return null;
      return {
        el,
        defaultText: el.querySelector("[data-default]"),
        hoverText: el.querySelector("[data-hover]"),
      };
    });

    dropdownTextData.current.forEach((item) => {
      if (!item) return;
      gsap.set(item.defaultText, { yPercent: 0 });
      gsap.set(item.hoverText, { yPercent: 100 });
    });
  }, []);

  const animateDropdownItemsIn = useCallback(() => {
    const items = getCurrentDropdownItems();
    if (!items.length) return;

    killItemTween();
    gsap.killTweensOf(items);

    gsap.set(items, {
      opacity: 0,
      y: -14,
      pointerEvents: "none",
    });

    itemTweenRef.current = gsap.timeline({
      overwrite: true,
      onStart: () => {
        gsap.set(items, { pointerEvents: "auto" });
      },
    });

    itemTweenRef.current
      .to(
        items,
        {
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "elastic.out(0.9, 0.6)",
        },
        0
      )
      .to(
        items,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0
      );
  }, []);

  const animateDropdownItemsOut = useCallback((onComplete) => {
    const items = getCurrentDropdownItems();

    if (!items.length) {
      onComplete?.();
      return;
    }

    killItemTween();
    gsap.killTweensOf(items);

    itemTweenRef.current = gsap.timeline({
      overwrite: true,
      onStart: () => {
        gsap.set(items, { pointerEvents: "none" });
      },
      onComplete: () => {
        onComplete?.();
      },
    });

    itemTweenRef.current
      .to(
        items,
        {
          y: -14,
          duration: 0.34,
          stagger: 0.04,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        items,
        {
          opacity: 0,
          duration: 0.28,
          stagger: 0.04,
          ease: "power2.inOut",
        },
        0
      );
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

  const setNavVisualState = useCallback((index) => {
    navLinksRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.to(el, {
        color:
          index !== null && i !== index
            ? "rgba(255,255,255,0.5)"
            : "rgba(255,255,255,1)",
        duration: 0.3,
        overwrite: true,
      });
    });
  }, []);

  const forceCloseDropdown = useCallback(() => {
    killHideCall();
    killSwitchTween();

    activeDropdownIndexRef.current = null;
    isPointerInsideDropdownRef.current = false;
    setActiveIndex(null);
    setNavVisualState(null);

    animateDropdownItemsOut(() => {
      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [animateDropdownItemsOut, hideWrapper, setNavVisualState]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      linkData.current = navLinksRef.current.map((navLinkEl) => {
        if (!navLinkEl) return null;
        return {
          el: navLinkEl,
          defaultText: navLinkEl.querySelector("[data-default]"),
          hoverText: navLinkEl.querySelector("[data-hover]"),
        };
      });

      linkData.current.forEach((navItem) => {
        if (!navItem) return;
        gsap.set(navItem.defaultText, { yPercent: 0 });
        gsap.set(navItem.hoverText, { yPercent: 100 });
      });

      if (ctaRef.current) {
        const d = ctaRef.current.querySelector("[data-default]");
        const h = ctaRef.current.querySelector("[data-hover]");
        gsap.set(d, { yPercent: 0 });
        gsap.set(h, { yPercent: 100 });
      }

      hideWrapper();
    });

    return () => ctx.revert();
  }, [hideWrapper]);

  useEffect(() => {
    dropdownItemsRef.current = [];
  }, [renderedDropdownIndex]);

  useLayoutEffect(() => {
    if (renderedDropdownIndex === null) return;
    initDropdownItemText();
    animateDropdownItemsIn();
  }, [renderedDropdownIndex, initDropdownItemText, animateDropdownItemsIn]);

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
        const items = getCurrentDropdownItems();

        if (items.length) {
          killItemTween();
          gsap.killTweensOf(items);

          itemTweenRef.current = gsap.timeline({
            overwrite: true,
            onStart: () => {
              gsap.set(items, { pointerEvents: "auto" });
            },
          });

          itemTweenRef.current
            .to(
              items,
              {
                y: 0,
                duration: 0.45,
                stagger: 0.04,
                ease: "elastic.out(0.9, 0.6)",
              },
              0
            )
            .to(
              items,
              {
                opacity: 1,
                duration: 0.35,
                stagger: 0.04,
                ease: "power2.inOut",
              },
              0
            );
        }

        return;
      }

      switchTweenRef.current = gsap.delayedCall(0, () => {
        animateDropdownItemsOut(() => {
          if (activeDropdownIndexRef.current === null) return;
          setRenderedDropdownIndex(activeDropdownIndexRef.current);
        });
      });
    },
    [menuItems, renderedDropdownIndex, animateDropdownItemsOut, showWrapper]
  );

  const closeDropdown = useCallback(() => {
    killHideCall();
    killSwitchTween();

    activeDropdownIndexRef.current = null;

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
  }, [animateDropdownItemsOut, hideWrapper]);

  const scheduleCloseDropdown = useCallback(() => {
    killHideCall();

    hideCallRef.current = gsap.delayedCall(0.08, () => {
      if (isPointerInsideDropdownRef.current) return;
      if (
        activeDropdownIndexRef.current !== null &&
        menuItems[activeDropdownIndexRef.current]?.isDropdown
      ) {
        return;
      }
      closeDropdown();
    });
  }, [closeDropdown, menuItems]);

  const handleHeaderMouseEnter = () => {
    killHideCall();
  };

  const handleHeaderMouseLeave = () => {
    forceCloseDropdown();
  };

  const handleEnter = useCallback(
    (index) => {
      const item = linkData.current[index];
      if (!item) return;

      killHideCall();
      setActiveIndex(index);

      gsap
        .timeline({
          defaults: { duration: 0.35, ease: "power2.out", overwrite: true },
        })
        .to(item.defaultText, { yPercent: -100 }, 0)
        .to(item.hoverText, { yPercent: 0 }, 0);

      setNavVisualState(index);

      if (menuItems[index]?.isDropdown) {
        activeDropdownIndexRef.current = index;
        openDropdownForIndex(index);
      } else {
        activeDropdownIndexRef.current = null;
        closeDropdown();
      }
    },
    [menuItems, openDropdownForIndex, closeDropdown, setNavVisualState]
  );

  const handleLeave = useCallback(
    (index) => {
      const item = linkData.current[index];
      if (!item) return;

      gsap
        .timeline({
          defaults: { duration: 0.35, ease: "power2.out", overwrite: true },
        })
        .to(item.defaultText, { yPercent: 0 }, 0)
        .to(item.hoverText, { yPercent: 100 }, 0);

      if (menuItems[index]?.isDropdown) {
        killHideCall();

        hideCallRef.current = gsap.delayedCall(0.06, () => {
          if (isPointerInsideDropdownRef.current) return;
          if (activeDropdownIndexRef.current !== index) return;
          closeDropdown();
        });
      } else {
        setActiveIndex(null);
        setNavVisualState(null);
      }
    },
    [menuItems, closeDropdown, setNavVisualState]
  );

  const handleCta = (enter = true) => {
    const cta = ctaRef.current;
    if (!cta) return;

    const d = cta.querySelector("[data-default]");
    const h = cta.querySelector("[data-hover]");

    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "power2.out", overwrite: true },
      })
      .to(cta, { backgroundColor: enter ? "#000" : "#fff" }, 0)
      .to(d, { yPercent: enter ? -100 : 0 }, 0)
      .to(h, { yPercent: enter ? 0 : 100 }, 0);
  };

  const handleDropdownMouseEnter = () => {
    isPointerInsideDropdownRef.current = true;
    killHideCall();
    showWrapper();
  };

  const handleDropdownMouseLeave = () => {
    isPointerInsideDropdownRef.current = false;
    scheduleCloseDropdown();
  };

  const handleDropdownEnter = (index) => {
    const item = dropdownTextData.current[index];
    if (!item) return;

    gsap
      .timeline({
        defaults: { duration: 0.35, ease: "power2.out", overwrite: true },
      })
      .to(item.defaultText, { yPercent: -100 }, 0)
      .to(item.hoverText, { yPercent: 0 }, 0);
  };

  const handleDropdownLeave = (index) => {
    const item = dropdownTextData.current[index];
    if (!item) return;

    gsap
      .timeline({
        defaults: { duration: 0.35, ease: "power2.out", overwrite: true },
      })
      .to(item.defaultText, { yPercent: 0 }, 0)
      .to(item.hoverText, { yPercent: 100 }, 0);
  };

  useEffect(() => {
    return () => {
      killHideCall();
      killSwitchTween();
      killItemTween();
    };
  }, []);

  return (
    <div
      ref={navWrapRef}
      onMouseEnter={handleHeaderMouseEnter}
      onMouseLeave={handleHeaderMouseLeave}
      className="rounded-md absolute max-md:hidden top-[1vw] right-[2vw] bg-[#363737]"
    >
      <div className="w-full h-full relative p-[.3vw] flex items-center gap-[1.5vw] pl-[1vw]">
        <div className="flex gap-[1.5vw] h-full items-center">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              ref={(el) => (navLinksRef.current[i] = el)}
              href={item.href}
              className="relative overflow-hidden py-[.5vw] uppercase flex items-center"
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <div className="overflow-hidden relative">
                <span data-default className="flex items-center">
                  {item.name}
                  {item.isDropdown && (
                    <ChevronDown className="ml-1 w-[1vw] h-[1vw]" />
                  )}
                </span>

                <span
                  data-hover
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex items-center">
                    {item.name}
                    {item.isDropdown && (
                      <ChevronUp className="ml-1 w-[1vw] h-[1vw]" />
                    )}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          ref={ctaRef}
          href="#"
          className="bg-white relative overflow-hidden text-black py-[.5vw] px-[.5vw] rounded-sm"
          onMouseEnter={() => handleCta(true)}
          onMouseLeave={() => handleCta(false)}
        >
          <span data-default className="block">BUILT W/ ICOMAT</span>
          <span
            data-hover
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            BUILT W/ ICOMAT
          </span>
        </Link>

        <div
          ref={dropdownRef}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          className="absolute w-full h-fit top-[calc(100%-.5vw)] pt-[1.3vw] left-0"
        >
          <div className="w-full h-full space-y-[.4vw]">
            {(menuItems[renderedDropdownIndex]?.dropdown || []).map(
              (item, idx) => (
                <div
                  key={`${renderedDropdownIndex}-${idx}`}
                  ref={(el) => (dropdownItemsRef.current[idx] = el)}
                  className="link-btns"
                >
                  <Link
                    href={item.href}
                    onMouseEnter={() => handleDropdownEnter(idx)}
                    onMouseLeave={() => handleDropdownLeave(idx)}
                    className="flex items-center hover:bg-white transition-all duration-400 bg-[#363737] hover:text-black! hover:scale-[1.02] text-white rounded-md p-[.4vw] justify-between"
                  >
                    <div className="flex items-center gap-[1.5vw]">
                      <div className="size-[5vw] rounded-md overflow-hidden">
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
                              background: "rgba(255, 0, 0, 0.9)", // ried hue, adjust opacity as needed
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
                        <span
                          data-hover
                          className="absolute inset-0 flex items-center"
                        >
                          {item.title}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-[1vw] h-[1vw] mr-[2vw]" />
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}