"use client";

import {
  useRef,
  useState,
  useEffect,
  Suspense,
  forwardRef,
} from "react";
import Link from "next/link";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { getEffectPreviewHref } from "@/lib/categories";
import Footer from "@/components/Footer";
import HeadAnim from "@/components/Animations/HeadAnim";
import Copy from "@/components/Animations/Copy";
import { fadeUp } from "@/components/Animations/gsapAnimations";

export function EffectDetailContent({
  slug,
  categorySlug,
  effect,
  config,
  code,
  content,
  relatedEffects = [],
  effectCounts,
  totalEffects,
}) {
  fadeUp();
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const videoPreviewUrl = effect.videoUrl
    ? `${process.env.NEXT_PUBLIC_DEV_URL || ""}${effect.videoUrl.startsWith("/") ? "" : "/"
    }${effect.videoUrl}`
    : null;



  const componentName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const usageCode = `import { ${componentName} } from "@/components/effects/${slug}";

export default function MyComponent() {
  return (
    <${componentName}>
      Your content here
    </${componentName}>
  );
}`;

  const installCode = `npx hyperiux add ${slug}`;

  const showVideo = videoPreviewUrl && !videoError && videoReady;

  const previewHref =
    effect.previewUrl || getEffectPreviewHref(effect);

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={previewHref}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 backdrop-blur-md text-foreground bg-primary duration-300 ease-in-out hover:bg-primary/80 hover:text-white rounded-md hover:border-transparent transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>

          Live Preview
        </Link>
      </div>

      <div className="bg-secondary-surface/60 backdrop-blur-md rounded-md border border-border/60 p-5 space-y-4">
        <h3 className="font-medium text-foreground">
          Resource details
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-6">
            <span className="text-muted">Category</span>

            <span className="text-foreground capitalize text-right">
              {(effect.categories?.length
                ? effect.categories
                : [effect.category]
              ).join(", ")}
            </span>
          </div>

          <div className="flex justify-between gap-6">
            <span className="text-muted">Dependencies</span>

            <span className="text-foreground text-right">
              {effect.dependencies?.join(", ") || "None"}
            </span>
          </div>

          <div className="flex justify-between gap-6">
            <span className="text-muted">License</span>

            <span className="text-foreground text-right">
              MIT
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/60">
          <div className="flex flex-wrap gap-2">
            {(effect.categories?.length
              ? effect.categories
              : [effect.category]
            ).map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 border border-border/60 rounded-full text-xs text-white/80 capitalize"
              >
                {cat}
              </span>
            ))}

            {effect.dependencies?.map((dep) => (
              <span
                key={dep}
                className="px-2.5 py-1 capitalize border border-border/60 rounded-full text-xs text-white/80"
              >
                {dep}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <VaultLayout
      effectCounts={effectCounts}
      totalEffects={totalEffects}
      bgImageSrc=""
      activeCategory={
        effect.categories?.[0] || effect.category
      }
    >
      <div className="min-h-screen bg-black text-foreground px-15 max-sm:px-6">
        <Suspense fallback={<div className="h-12" />}>
          <VaultHeader
            effectName={effect.title}
            showSearch={false}
          />
        </Suspense>

        <div className="mx-auto px-8 pt-28 pb-8 max-sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div>
                {categorySlug && (
                  <Copy>
                  <p className="text-sm uppercase tracking-[0.18em] text-primary mb-4 max-sm:text-center">
                    {categorySlug.replaceAll("-", " ")}
                  </p>
                  </Copy>
                )}
               <HeadAnim>
                <h1 className="text-5xl max-sm:text-center text-foreground mb-4">
                  {content?.h1 || effect.title}
                </h1>
                </HeadAnim>
               <Copy delay={0.5}>
                <p className="text-[#d2d2d2] w-[80%] max-sm:w-full max-sm:text-center">
                  {content?.shortDescription ||
                    effect.description}
                </p>
                </Copy>
              </div>

              <div className="aspect-video w-full overflow-hidden relative bg-black/20 fadeup">
                {!showVideo && (
                  <Image
                    src={
                      effect.coverImage ||
                      "/assets/img/image01.webp"
                    }
                    alt={effect.title || slug}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                    className="object-contain transition-all duration-500"
                  />
                )}

                {videoPreviewUrl && !videoError && (
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setVideoReady(true)}
                    onError={() => setVideoError(true)}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${showVideo
                      ? "opacity-100"
                      : "opacity-0"
                      }`}
                  />
                )}
              </div>

              <div className="sm:hidden">
                {sidebarContent}
              </div>

              <EffectDynamicContent
                ref={contentRef}
                content={content}
                installCode={installCode}
                usageCode={usageCode}
                componentCode={code}
                config={config}
                slug={slug}
                categorySlug={categorySlug}
              />
            </div>

            <div className="lg:col-span-1 self-stretch max-sm:hidden fadeup">
              <div className="sticky top-28 h-fit">
                {sidebarContent}
                <TableOfContents
                  containerRef={contentRef}
                  watchKey={slug}
                />
              </div>
            </div>

          </div>

          {relatedEffects?.length > 0 && (
            <div className="my-16 space-y-6">
              <HeadAnim>
              <h2 className="text-4xl font-semibold text-foreground tracking-tighter">
                Related Effects
              </h2>
              </HeadAnim>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fadeup">
                {relatedEffects.map((relatedEffect) => (
                  <EffectCard
                    key={relatedEffect.name}
                    effect={relatedEffect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </VaultLayout>
  );
}
const EffectDynamicContent = forwardRef(function EffectDynamicContent(
  {
    content,
    installCode,
    usageCode,
    componentCode,
    config,
    slug,
    categorySlug,
  },
  ref
) {
  if (!content) return null;

  return (
    <div ref={ref} className="space-y-14">
      {content.heroCopy?.length > 0 && (
        <section className="space-y-5">
          <h2
            id="overview"
            className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup"
          >
            Overview
          </h2>

          <div className="space-y-5 text-[#d2d2d2] text-base leading-7">
            {content.heroCopy.map((paragraph, index) => (
              <p key={index} className="fadeup">{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {content.bestUsedFor?.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            Best Used For
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.bestUsedFor.map((item) => (
              <div
                key={item}
                className="border border-border/60 bg-secondary-surface/50 rounded-md px-4 py-3 text-[#d2d2d2] fadeup"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.tutorial?.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            Step-by-Step Tutorial
          </h2>

          <div className="space-y-8">
            {content.tutorial.map((step, index) => (
              <div key={step.title || index} className="space-y-6">
                <div className="py-5 space-y-3">
                  <div className="flex items-start gap-4 max-sm:gap-3">


                    <div className="space-y-2">
                      <h3
                        id={step.title
                          ?.toLowerCase()
                          .replaceAll(" ", "-")
                          .replace(/[^\w-]/g, "")}
                        className="text-2xl max-sm:text-xl tracking-tighter text-foreground fadeup scroll-mt-32"
                      >
                        {step.title}
                      </h3>

                      <p className="text-[#d2d2d2] leading-7 fadeup">{step.body}</p>
                    </div>
                  </div>

                  {step.code && (
                    <CodeBlock
                      code={step.code}
                      language={step.language || "bash"}
                      filename={step.filename}
                    />
                  )}
                </div>

                {step.blocks?.length > 0 && (
                  <div className="space-y-6 fadeup">
                    {step.blocks.map((block, blockIndex) => (
                      <TutorialBlock
                        key={`${step.title || index}-${block.title || blockIndex
                          }`}
                        block={block}
                        installCode={installCode}
                        usageCode={usageCode}
                        componentCode={componentCode}
                        config={config}
                        slug={slug}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.customizationOptions?.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            Customization Options
          </h2>

          <div className="bg-secondary-surface/60 backdrop-blur-md rounded-xl border border-border/60 overflow-x-auto fadeup">
            <table className="w-full text-sm max-sm:min-w-[640px] ">
              <thead className="bg-black/20 border-b border-border/60">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted">
                    Option
                  </th>

                  <th className="text-left px-4 py-3 font-medium text-muted">
                    Recommendation
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {content.customizationOptions.map((item) => (
                  <tr key={item.option}>
                    <td className="px-4 py-4 text-foreground font-medium align-top">
                      {item.option}
                    </td>

                    <td className="px-4 py-4 text-muted leading-6">
                      {item.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {content.notes && (
        <section className="space-y-5">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            Implementation Notes
          </h2>

          <div className="grid grid-cols-1 gap-8 mt-10">
            {content.notes.performance && (
              <div className="space-y-2">
                <h3 className="text-2xl max-sm:text-xl tracking-tighter text-foreground fadeup">
                  Performance Notes
                </h3>

                <p className="text-[#d2d2d2] leading-7 fadeup">
                  {content.notes.performance}
                </p>
              </div>
            )}

            {content.notes.accessibility && (
              <div className="space-y-2">
                <h3 className="text-2xl max-sm:text-xl tracking-tighter text-foreground fadeup">
                  Accessibility Notes
                </h3>

                <p className="text-[#d2d2d2] leading-7 fadeup">
                  {content.notes.accessibility}
                </p>
              </div>
            )}

            {content.notes.mobile && (
              <div className="space-y-2">
                <h3 className="text-2xl max-sm:text-xl tracking-tighter text-foreground fadeup">
                  Mobile Support Notes
                </h3>

                <p className="text-[#d2d2d2] leading-7 fadeup">
                  {content.notes.mobile}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {content.commonMistakes?.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            Common Mistakes
          </h2>

          <div className="space-y-3 fadeup">
            {content.commonMistakes.map((mistake) => (
              <div key={mistake} className="flex gap-3 rounded-md">
                <span className="text-primary mt-1">●</span>

                <p className="text-[#d2d2d2] leading-7">{mistake}</p>
              </div>
            ))}
          </div>
        </section>
      )}



      {content.faq?.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter fadeup">
            FAQ
          </h2>

          <div className="space-y-8 mt-10">
            {content.faq.map((item) => (
              <div key={item.question} className="space-y-2">
                <h3 className="text-xl tracking-tighter text-foreground fadeup">
                  {item.question}
                </h3>

                <p className="text-[#d2d2d2] leading-7 fadeup">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.finalCta && (
        <section className="border border-primary/40 bg-primary/10 rounded-xl p-6 space-y-5 fadeup">
          <div className="space-y-2">
            <h2 className="text-4xl max-sm:text-3xl font-semibold text-foreground tracking-tighter ">
              Build With This Effect
            </h2>

            <p className="text-[#d2d2d2] leading-7 ">
              {content.finalCta.body}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors cursor-pointer">
              {content.finalCta.primary || `Install ${content.h1 || "Effect"}`}
            </button>

            <Link
              href={categorySlug ? `/effects/${categorySlug}` : "/effects"}
              className="px-5 py-2.5 rounded-full border border-border/60 text-foreground hover:bg-white hover:text-black transition-colors"
            >
              {content.finalCta.secondary || "View Effects"}
            </Link>

            {content.finalCta.commercial && (
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full border border-border/60 text-foreground hover:bg-white hover:text-black transition-colors"
              >
                {content.finalCta.commercial}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
});

function TutorialBlock({
  block,
  installCode,
  usageCode,
  componentCode,
  config,
}) {
  if (!block) return null;

  if (block.type === "code") {
    let resolvedCode = block.code || "";

    if (block.source === "install") {
      resolvedCode = installCode;
    }

    if (block.source === "usage") {
      resolvedCode = usageCode;
    }

    if (block.source === "component") {
      resolvedCode = componentCode;
    }

    if (!resolvedCode) return null;

    return (
      <div className="space-y-3">
        {block.title && (
          <h3 className="font-medium text-muted text-2xl tracking-tighter">
            {block.title}
          </h3>
        )}

        <div className="max-h-[30vw] overflow-y-auto rounded-lg border border-border/60 fadeup">
          <CodeBlock
            code={resolvedCode}
            language={block.language || "jsx"}
            filename={block.filename}
          />
        </div>
      </div>
    );
  }

  if (block.type === "props") {
    if (!config?.props?.length) return null;

    return (
      <div className="space-y-3">
        <h3 className="font-medium text-muted text-2xl tracking-tighter">
          {block.title || "Props"}
        </h3>

        <div className="bg-secondary-surface/60 backdrop-blur-md rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/20 border-b border-border/60">
              <tr>
                <th className="text-left px-4 py-3">
                  Prop
                </th>

                <th className="text-left px-4 py-3">
                  Type
                </th>

                <th className="text-left px-4 py-3">
                  Default
                </th>

                <th className="text-left px-4 py-3">
                  Description
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {config.props.map((prop) => (
                <tr key={prop.name}>
                  <td className="px-4 py-3">
                    {prop.name}
                  </td>

                  <td className="px-4 py-3">
                    {prop.type}
                  </td>

                  <td className="px-4 py-3">
                    {config.defaults?.[
                      prop.name
                    ]?.toString() || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {prop.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

function TableOfContents({ containerRef, watchKey }) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState("");

  const activeLockRef = useRef({
    id: "",
    targetTop: 0,
    timeoutId: null,
  });

  const onTocClick = (e, id) => {
    e.preventDefault();

    const el = document.getElementById(id);

    if (!el) return;

    const topOffset = window.innerHeight * 0.2;

    const targetTop =
      el.getBoundingClientRect().top +
      window.scrollY -
      topOffset;

    if (activeLockRef.current.timeoutId) {
      window.clearTimeout(
        activeLockRef.current.timeoutId
      );
    }

    activeLockRef.current = {
      id,
      targetTop,
      timeoutId: null,
    };

    setActiveId(id);

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    window.history.pushState(null, "", `#${id}`);

    const releaseWhenSettled = (
      startedAt = performance.now()
    ) => {
      const isSettled =
        Math.abs(window.scrollY - targetTop) < 2;

      const timedOut =
        performance.now() - startedAt > 1800;

      if (isSettled || timedOut) {
        activeLockRef.current = {
          id: "",
          targetTop: 0,
          timeoutId: null,
        };

        return;
      }

      activeLockRef.current.timeoutId =
        window.setTimeout(
          () => releaseWhenSettled(startedAt),
          80
        );
    };

    activeLockRef.current.timeoutId =
      window.setTimeout(
        () => releaseWhenSettled(),
        120
      );
  };

  useEffect(() => {
    const root = containerRef?.current;

    if (!root) return;

   const headings = Array.from(
  root.querySelectorAll("h2")
).map((el, index) => {
  if (!el.id) {
    el.id =
      el.textContent
        ?.toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^\w-]/g, "") ||
      `section-${index}`;
  }

  return {
    id: el.id,
    text: el.textContent || "",
    level: el.tagName.toLowerCase(),
  };
});

    setItems(headings);
  }, [containerRef, watchKey]);

  useEffect(() => {
    const root = containerRef?.current;

    if (!root) return;

   const headings = Array.from(
  root.querySelectorAll("h2")
);

headings.forEach((el, index) => {
  if (!el.id) {
    el.id =
      el.textContent
        ?.toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^\w-]/g, "") ||
      `section-${index}`;
  }
});
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (activeLockRef.current.id) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top >
              b.boundingClientRect.top
              ? 1
              : -1
          )[0];

        const id = visible?.target?.id;

        if (id) {
          setActiveId(id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((h) =>
      observer.observe(h)
    );

    return () => observer.disconnect();
  }, [containerRef, items.length]);

  useEffect(() => {
    return () => {
      if (activeLockRef.current.timeoutId) {
        window.clearTimeout(
          activeLockRef.current.timeoutId
        );
      }
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/30 bg-black/20 backdrop-blur-md p-5 mt-6">
      <p className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
        On this page
      </p>

      <ul className="space-y-3 mt-8">
  {items.map((it) => (
    <li
      key={it.id}
      className="text-[0.95vw] max-sm:text-sm cursor-pointer"
    >
      <a
        href={`#${it.id}`}
        className={[
          "flex items-center gap-3 origin-left transition-all duration-300 ease-out will-change-transform",
          activeId === it.id
            ? "text-foreground scale-[1.06]"
            : "text-foreground/65 hover:text-foreground hover:scale-[1.04]",
        ].join(" ")}
        onClick={(e) => onTocClick(e, it.id)}
      >
        <span className="relative h-2 w-2 shrink-0">
          {activeId === it.id ? (
            <motion.span
              layoutId="toc-dot"
              className="absolute inset-0 rounded-full bg-primary"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 45,
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          ) : (
            <span className="absolute inset-0 rounded-full bg-white/0" />
          )}
        </span>

        <span className="transition-all duration-300">
          {it.text}
        </span>
      </a>
    </li>
  ))}
</ul>
    </div>
  );
}