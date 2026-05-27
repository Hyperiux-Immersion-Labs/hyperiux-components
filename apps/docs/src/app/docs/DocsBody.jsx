"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function TableOfContents({ containerRef, watchKey }) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState("");
  const activeLockRef = useRef({ id: "", targetTop: 0, timeoutId: null });

  const onTocClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const topOffset = window.innerHeight * 0.2;
    const targetTop = el.getBoundingClientRect().top + window.scrollY - topOffset;

    if (activeLockRef.current.timeoutId) {
      window.clearTimeout(activeLockRef.current.timeoutId);
    }

    activeLockRef.current = { id, targetTop, timeoutId: null };
    setActiveId(id);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
    window.history.pushState(null, "", `#${id}`);

    const releaseWhenSettled = (startedAt = performance.now()) => {
      const isSettled = Math.abs(window.scrollY - targetTop) < 2;
      const timedOut = performance.now() - startedAt > 1800;

      if (isSettled || timedOut) {
        activeLockRef.current = { id: "", targetTop: 0, timeoutId: null };
        return;
      }

      activeLockRef.current.timeoutId = window.setTimeout(
        () => releaseWhenSettled(startedAt),
        80,
      );
    };

    activeLockRef.current.timeoutId = window.setTimeout(
      () => releaseWhenSettled(),
      120,
    );
  };

  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2[id], h3[id]")).map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: el.tagName.toLowerCase(),
    }));
    setItems(headings);
  }, [containerRef, watchKey]);

  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2[id], h3[id]"));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (activeLockRef.current.id) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1))[0];
        const id = visible?.target?.id;
        if (id) setActiveId(id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [containerRef, items.length]);

  useEffect(() => {
    return () => {
      if (activeLockRef.current.timeoutId) {
        window.clearTimeout(activeLockRef.current.timeoutId);
      }
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/30 bg-black/20 backdrop-blur-md p-5">
      <p className="text-sm font-medium text-muted uppercase tracking-wider mb-3">On this page</p>
      <ul className="space-y-3 mt-8">
        {items.map((it) => (
          <li key={it.id} className="text-[0.95vw] cursor-pointer ">
            <a
              href={`#${it.id}`}
              className={[
                "flex items-center gap-3 origin-left transition-all duration-300 ease-out will-change-transform",
                it.level === "h3" ? "pl-3" : "",
                activeId === it.id
                  ? "text-foreground scale-[1.06]"
                  : "text-foreground/65 hover:text-foreground hover:scale-[1.12]",
              ].join(" ")}
              onClick={(e) => onTocClick(e, it.id)}
            >
              <span className="relative h-2 w-2 shrink-0">
                {activeId === it.id ? (
                  <motion.span
                    layoutId="toc-dot"
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{
                      type: "spring",
                      stiffness: 700,
                      damping: 45,
                      opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                ) : null}
              </span>
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DocsBody({ children }) {
  const contentRef = useRef(null);
  const pathname = usePathname();

  return (
    <>
      <div className="mx-auto w-full pt-16 bg-black">
        <div className="grid grid-cols-1 gap-20 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div ref={contentRef} className="px-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          <aside className="hidden xl:block pr-6">
            <div className="sticky top-32 space-y-6">
              <TableOfContents containerRef={contentRef} watchKey={pathname} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
