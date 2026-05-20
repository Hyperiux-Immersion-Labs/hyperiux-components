"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUp({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MenuIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Desktop Nav ──────────────────────────────────────────────────────────────

function GlassPillDesktopNav({ menuItems, ctaLabel }) {
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

  const killHideCall = () => {
    if (hideCallRef.current) { hideCallRef.current.kill(); hideCallRef.current = null; }
  };
  const killSwitchTween = () => {
    if (switchTweenRef.current) { switchTweenRef.current.kill(); switchTweenRef.current = null; }
  };
  const killItemTween = () => {
    if (itemTweenRef.current) { itemTweenRef.current.kill(); itemTweenRef.current = null; }
  };
  const getCurrentDropdownItems = () => dropdownItemsRef.current.filter(Boolean);

  const initDropdownItemText = useCallback(() => {
    dropdownTextData.current = dropdownItemsRef.current.map((el) => {
      if (!el) return null;
      return { el, defaultText: el.querySelector("[data-default]"), hoverText: el.querySelector("[data-hover]") };
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
    gsap.set(items, { opacity: 0, y: -14, pointerEvents: "none" });
    itemTweenRef.current = gsap.timeline({
      overwrite: true,
      onStart: () => gsap.set(items, { pointerEvents: "auto" }),
    });
    itemTweenRef.current
      .to(items, { y: 0, duration: 0.6, stagger: 0.05, ease: "elastic.out(0.9, 0.6)" }, 0)
      .to(items, { opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.inOut" }, 0);
  }, []);

  const animateDropdownItemsOut = useCallback((onComplete) => {
    const items = getCurrentDropdownItems();
    if (!items.length) { onComplete?.(); return; }
    killItemTween();
    gsap.killTweensOf(items);
    itemTweenRef.current = gsap.timeline({
      overwrite: true,
      onStart: () => gsap.set(items, { pointerEvents: "none" }),
      onComplete: () => onComplete?.(),
    });
    itemTweenRef.current
      .to(items, { y: -14, duration: 0.34, stagger: 0.04, ease: "power2.inOut" }, 0)
      .to(items, { opacity: 0, duration: 0.28, stagger: 0.04, ease: "power2.inOut" }, 0);
  }, []);

  const showWrapper = useCallback(() => {
    if (!dropdownRef.current) return;
    gsap.set(dropdownRef.current, { autoAlpha: 1, pointerEvents: "auto" });
  }, []);

  const hideWrapper = useCallback(() => {
    if (!dropdownRef.current) return;
    gsap.set(dropdownRef.current, { autoAlpha: 0, pointerEvents: "none" });
  }, []);

  const setNavVisualState = useCallback((index) => {
    navLinksRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        color: index !== null && i !== index ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,1)",
        duration: 0.3,
        overwrite: true,
      });
    });
  }, []);

  const forceCloseDropdown = useCallback(() => {
    killHideCall(); killSwitchTween();
    activeDropdownIndexRef.current = null;
    isPointerInsideDropdownRef.current = false;
    setActiveIndex(null);
    setNavVisualState(null);
    animateDropdownItemsOut(() => { setRenderedDropdownIndex(null); hideWrapper(); });
  }, [animateDropdownItemsOut, hideWrapper, setNavVisualState]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      linkData.current = navLinksRef.current.map((navLinkEl) => {
        if (!navLinkEl) return null;
        return { el: navLinkEl, defaultText: navLinkEl.querySelector("[data-default]"), hoverText: navLinkEl.querySelector("[data-hover]") };
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

  useEffect(() => { dropdownItemsRef.current = []; }, [renderedDropdownIndex]);

  useLayoutEffect(() => {
    if (renderedDropdownIndex === null) return;
    initDropdownItemText();
    animateDropdownItemsIn();
  }, [renderedDropdownIndex, initDropdownItemText, animateDropdownItemsIn]);

  const openDropdownForIndex = useCallback((index) => {
    const menuItem = menuItems[index];
    killHideCall(); killSwitchTween();
    if (!menuItem?.isDropdown) return;
    activeDropdownIndexRef.current = index;
    isPointerInsideDropdownRef.current = false;
    showWrapper();
    if (renderedDropdownIndex === null) { setRenderedDropdownIndex(index); return; }
    if (renderedDropdownIndex === index) {
      const items = getCurrentDropdownItems();
      if (items.length) {
        killItemTween(); gsap.killTweensOf(items);
        itemTweenRef.current = gsap.timeline({
          overwrite: true,
          onStart: () => gsap.set(items, { pointerEvents: "auto" }),
        });
        itemTweenRef.current
          .to(items, { y: 0, duration: 0.45, stagger: 0.04, ease: "elastic.out(0.9, 0.6)" }, 0)
          .to(items, { opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.inOut" }, 0);
      }
      return;
    }
    switchTweenRef.current = gsap.delayedCall(0, () => {
      animateDropdownItemsOut(() => {
        if (activeDropdownIndexRef.current === null) return;
        setRenderedDropdownIndex(activeDropdownIndexRef.current);
      });
    });
  }, [menuItems, renderedDropdownIndex, animateDropdownItemsOut, showWrapper]);

  const closeDropdown = useCallback(() => {
    killHideCall(); killSwitchTween();
    activeDropdownIndexRef.current = null;
    animateDropdownItemsOut(() => {
      if (activeDropdownIndexRef.current !== null || isPointerInsideDropdownRef.current) return;
      setRenderedDropdownIndex(null);
      hideWrapper();
    });
  }, [animateDropdownItemsOut, hideWrapper]);

  const scheduleCloseDropdown = useCallback(() => {
    killHideCall();
    hideCallRef.current = gsap.delayedCall(0.08, () => {
      if (isPointerInsideDropdownRef.current) return;
      if (activeDropdownIndexRef.current !== null && menuItems[activeDropdownIndexRef.current]?.isDropdown) return;
      closeDropdown();
    });
  }, [closeDropdown, menuItems]);

  const handleEnter = useCallback((index) => {
    const item = linkData.current[index];
    if (!item) return;
    killHideCall();
    setActiveIndex(index);
    gsap.timeline({ defaults: { duration: 0.35, ease: "power2.out", overwrite: true } })
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
  }, [menuItems, openDropdownForIndex, closeDropdown, setNavVisualState]);

  const handleLeave = useCallback((index) => {
    const item = linkData.current[index];
    if (!item) return;
    gsap.timeline({ defaults: { duration: 0.35, ease: "power2.out", overwrite: true } })
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
  }, [menuItems, closeDropdown, setNavVisualState]);

  const handleCta = (enter = true) => {
    const cta = ctaRef.current;
    if (!cta) return;
    const d = cta.querySelector("[data-default]");
    const h = cta.querySelector("[data-hover]");
    gsap.timeline({ defaults: { duration: 0.4, ease: "power2.out", overwrite: true } })
      .to(cta, { backgroundColor: enter ? "#000" : "#fff" }, 0)
      .to(d, { yPercent: enter ? -100 : 0 }, 0)
      .to(h, { yPercent: enter ? 0 : 100 }, 0);
  };

  useEffect(() => {
    return () => { killHideCall(); killSwitchTween(); killItemTween(); };
  }, []);

  return (
    <div
      ref={navWrapRef}
      onMouseEnter={killHideCall}
      onMouseLeave={forceCloseDropdown}
      style={{
        borderRadius: "6px",
        position: "absolute",
        display: "none",
        top: "1vw",
        right: "2vw",
        background: "#363737",
      }}
      className="max-md:hidden"
    >
      <style>{`
        @media (min-width: 768px) {
          .gpn-desktop-wrap { display: block !important; }
        }
      `}</style>
      <div style={{ width: "100%", height: "100%", position: "relative", padding: "0.3vw", display: "flex", alignItems: "center", gap: "1.5vw", paddingLeft: "1vw" }}>
        <div style={{ display: "flex", gap: "1.5vw", height: "100%", alignItems: "center" }}>
          {menuItems.map((item, i) => (
            <a
              key={i}
              ref={(el) => (navLinksRef.current[i] = el)}
              href={item.href}
              style={{ position: "relative", overflow: "hidden", padding: "0.5vw 0", textTransform: "uppercase", display: "flex", alignItems: "center", color: "#fff", textDecoration: "none", fontSize: "inherit" }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <div style={{ overflow: "hidden", position: "relative" }}>
                <span data-default style={{ display: "flex", alignItems: "center" }}>
                  {item.name}
                  {item.isDropdown && <ChevronDown className={undefined} style={{ marginLeft: "0.25vw", width: "1vw", height: "1vw" }} />}
                </span>
                <span data-hover style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {item.name}
                    {item.isDropdown && <ChevronUp className={undefined} style={{ marginLeft: "0.25vw", width: "1vw", height: "1vw" }} />}
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          ref={ctaRef}
          href="#"
          style={{ background: "#fff", position: "relative", overflow: "hidden", color: "#000", padding: "0.5vw", borderRadius: "2px", textDecoration: "none", fontSize: "inherit" }}
          onMouseEnter={() => handleCta(true)}
          onMouseLeave={() => handleCta(false)}
        >
          <span data-default style={{ display: "block", textTransform: "uppercase" }}>{ctaLabel}</span>
          <span data-hover style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textTransform: "uppercase" }}>
            {ctaLabel}
          </span>
        </a>

        <div
          ref={dropdownRef}
          onMouseEnter={() => { isPointerInsideDropdownRef.current = true; killHideCall(); showWrapper(); }}
          onMouseLeave={() => { isPointerInsideDropdownRef.current = false; scheduleCloseDropdown(); }}
          style={{ position: "absolute", width: "100%", height: "fit-content", top: "calc(100% - 0.5vw)", paddingTop: "1.3vw", left: 0 }}
        >
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: "0.4vw" }}>
            {(menuItems[renderedDropdownIndex]?.dropdown || []).map((item, idx) => (
              <div key={`${renderedDropdownIndex}-${idx}`} ref={(el) => (dropdownItemsRef.current[idx] = el)}>
                <a
                  href={item.href}
                  onMouseEnter={() => {
                    const d = dropdownTextData.current[idx];
                    if (!d) return;
                    gsap.timeline({ defaults: { duration: 0.35, ease: "power2.out", overwrite: true } })
                      .to(d.defaultText, { yPercent: -100 }, 0)
                      .to(d.hoverText, { yPercent: 0 }, 0);
                  }}
                  onMouseLeave={() => {
                    const d = dropdownTextData.current[idx];
                    if (!d) return;
                    gsap.timeline({ defaults: { duration: 0.35, ease: "power2.out", overwrite: true } })
                      .to(d.defaultText, { yPercent: 0 }, 0)
                      .to(d.hoverText, { yPercent: 100 }, 0);
                  }}
                  style={{ display: "flex", alignItems: "center", background: "#363737", color: "#fff", borderRadius: "6px", padding: "0.4vw", justifyContent: "space-between", textDecoration: "none", fontSize: "inherit", transition: "background 0.4s, transform 0.4s" }}
                  onFocus={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
                  onBlur={(e) => { e.currentTarget.style.background = "#363737"; e.currentTarget.style.color = "#fff"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                    <div style={{ width: "5vw", height: "5vw", borderRadius: "6px", overflow: "hidden" }}>
                      <img src={item.img} alt={item.title} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "relative", overflow: "hidden", textTransform: "uppercase" }}>
                      <span data-default style={{ display: "block" }}>{item.title}</span>
                      <span data-hover style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>{item.title}</span>
                    </div>
                  </div>
                  <ChevronRight style={{ width: "1vw", height: "1vw", marginRight: "2vw" }} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

function GlassPillMobileNav({ menuItems, ctaLabel }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    if (open) {
      gsap.set(panel, { pointerEvents: "auto" });
      gsap.to(backdrop, { autoAlpha: 1, duration: 0.2 });
      gsap.fromTo(panel, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" });
    } else {
      gsap.to(panel, { autoAlpha: 0, y: -20, duration: 0.2, onComplete: () => gsap.set(panel, { pointerEvents: "none" }) });
      gsap.to(backdrop, { autoAlpha: 0, duration: 0.2 });
    }
  }, [open]);

  useEffect(() => {
    sectionsRef.current.forEach((el, i) => {
      if (!el) return;
      const isOpen = active === i;
      gsap.to(el, { height: isOpen ? el.scrollHeight : 0, autoAlpha: isOpen ? 1 : 0, duration: 0.25, ease: "power2.out" });
    });
  }, [active]);

  return (
    <div style={{ position: "fixed", top: "3vw", right: "3vw", zIndex: 999, display: "block" }} className="lg:hidden">
      <div ref={backdropRef} onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", opacity: 0 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2vw", padding: "2vw 3vw", borderRadius: "4vw", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(47,47,47,0.9)", backdropFilter: "blur(12px)" }}>
        <span style={{ fontSize: "3vw", padding: "0 2vw", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>Hyperiux</span>
        <button onClick={() => setOpen((v) => !v)} style={{ width: "8vw", height: "8vw", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2vw", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
          {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </div>

      <div ref={panelRef} style={{ marginTop: "2vw", width: "92vw", borderRadius: "4vw", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(47,47,47,0.95)", backdropFilter: "blur(12px)", padding: "2vw", pointerEvents: "none", opacity: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1vw" }}>
          {menuItems.map((item, i) => {
            const hasDropdown = !!item.dropdown;
            const isOpen = active === i;

            if (!hasDropdown) {
              return (
                <a key={i} href={item.href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2.5vw 3vw", borderRadius: "2.5vw", fontSize: "3vw", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", textDecoration: "none" }}>
                  {item.name}
                </a>
              );
            }

            return (
              <div key={i}>
                <button onClick={() => setActive((prev) => (prev === i ? null : i))} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "2.5vw 3vw", borderRadius: "2.5vw", fontSize: "3vw", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer" }}>
                  {item.name}
                  <ChevronDown style={{ width: 14, height: 14, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>

                <div ref={(el) => (sectionsRef.current[i] = el)} style={{ overflow: "hidden", paddingLeft: "2vw", height: 0, opacity: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2vw", paddingTop: "1vw" }}>
                    {item.dropdown.map((d, idx) => (
                      <a key={idx} href={d.href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "3vw", borderRadius: "2vw", fontSize: "2.8vw", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", background: "rgba(255,255,255,0.05)", padding: "2vw", textDecoration: "none" }}>
                        <div style={{ width: "10vw", height: "10vw", borderRadius: "2vw", overflow: "hidden", background: "rgba(255,255,255,0.25)" }}>
                          <img src={d.img} alt={d.title} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                        </div>
                        <span style={{ flex: 1 }}>{d.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: "3vw" }}>
            <button style={{ width: "100%", padding: "3vw", borderRadius: "3vw", background: "#fff", color: "#000", fontSize: "3vw", fontWeight: 600, border: "none", cursor: "pointer" }}>
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Public Export ─────────────────────────────────────────────────────────────

const DEFAULT_MENU_ITEMS = [
  { name: "Solutions", href: "#", isDropdown: false, dropdown: null },
  {
    name: "Tech",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "AI Tools", img: "https://placehold.co/80x80", href: "#" },
      { title: "Web Stack", img: "https://placehold.co/80x80", href: "#" },
    ],
  },
  { name: "Industries", href: "#", isDropdown: false, dropdown: null },
  {
    name: "The Company",
    href: "#",
    isDropdown: true,
    dropdown: [
      { title: "Manifesto", img: "https://placehold.co/80x80", href: "#" },
      { title: "Co-founder", img: "https://placehold.co/80x80", href: "#" },
      { title: "Career", img: "https://placehold.co/80x80", href: "#" },
    ],
  },
];

export function GlassPillHeader({
  menuItems = DEFAULT_MENU_ITEMS,
  ctaLabel = "BUILT W/ ICOMAT",
}) {
  return (
    <>
      <GlassPillDesktopNav menuItems={menuItems} ctaLabel={ctaLabel} />
      <GlassPillMobileNav menuItems={menuItems} ctaLabel={ctaLabel} />
    </>
  );
}
