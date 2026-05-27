"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { getEffectPreviewHref } from "@/lib/categories";
import Footer from "@/components/Footer";

export function EffectDetailContent({
  slug,
  effect,
  config,
  code,
  relatedEffects,
  effectCounts,
  totalEffects,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const videoPreviewUrl = effect.videoUrl
  ? `${process.env.NEXT_PUBLIC_DEV_URL}/${effect.videoUrl}`
  : null;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    setIsWishlisted(wishlist.includes(slug));
  }, [slug]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    let newWishlist;

    if (isWishlisted) {
      newWishlist = wishlist.filter((name) => name !== slug);
    } else {
      newWishlist = [...wishlist, slug];
    }

    localStorage.setItem("hyperiux-wishlist", JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

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
  const previewHref = effect.previewUrl || getEffectPreviewHref(effect);

  // Extracted sidebar JSX — rendered in two places (mobile inline + desktop column)
  const sidebarContent = (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Link
          href={previewHref}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 backdrop-blur-md text-foreground bg-primary duration-300 ease-in-out hover:bg-primary/80 hover:text-white rounded-md hover:border-transparent transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Live Preview
        </Link>

        <button
          onClick={toggleWishlist}
          className={`p-2.5 backdrop-blur-sm rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
            isWishlisted
              ? "bg-primary text-white border border-transparent"
              : "bg-black/20 border border-border/60 text-foreground hover:bg-primary hover:text-white"
          }`}
          aria-label="Add to wishlist"
        >
          <svg
            className="w-4 h-4"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Resource details card */}
      <div className="bg-secondary-surface/60 backdrop-blur-md rounded-md border border-border/60 p-5 space-y-4">
        <h3 className="font-medium text-foreground">Resource details</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-6">
            <span className="text-muted">Category</span>
            <span className="text-foreground capitalize text-right">
              {(effect.categories?.length ? effect.categories : [effect.category]).join(", ")}
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
            <span className="text-foreground text-right">MIT</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/60">
          <div className="flex flex-wrap gap-2">
            {(effect.categories?.length ? effect.categories : [effect.category]).map((cat) => (
              <span key={cat} className="px-2.5 py-1  border border-border/60 rounded-full text-xs text-white/80 capitalize">
                {cat}
              </span>
            ))}
            {effect.dependencies?.map((dep) => (
              <span
                key={dep}
                className="px-2.5 py-1 capitalize  border border-border/60 rounded-full text-xs text-white/80"
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
      activeCategory={effect.categories?.[0] || effect.category}
    >
      <div className="min-h-screen bg-black text-foreground px-15 max-sm:px-6">
        {/* Sticky Header with Breadcrumb */}
        <Suspense fallback={<div className="h-12" />}>
          <VaultHeader effectName={effect.title} showSearch={false} />
        </Suspense>

        {/* Main content */}
        <div className="mx-auto px-8 pt-28 pb-8 max-sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Title + Preview + (mobile sidebar) + Documentation */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title Section */}
              <div>
                <h1 className="text-5xl max-sm:text-center text-foreground mb-4">
                  {effect.title}
                </h1>
                <p className="text-[#d2d2d2] w-[80%] max-sm:w-full max-sm:text-center">{effect.description}</p>
              </div>

              {/* Preview */}
              <div className="aspect-video w-full overflow-hidden relative bg-black/20">
                {!showVideo && (
                  <Image
                    src={effect.coverImage || "/assets/img/image01.webp"}
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
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                      showVideo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Sidebar injected here on mobile only — after preview, before docs */}
              <div className="sm:hidden">
                {sidebarContent}
              </div>

              {/* Documentation */}
              <div className="space-y-10">
                <h2 className="text-4xl font-semibold text-foreground tracking-tighter">Documentation</h2>

                <div className="space-y-3">
                  <h3 className="font-medium text-muted text-2xl tracking-tighter">Installation</h3>
                  <CodeBlock code={installCode} language="bash" />
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-muted text-2xl tracking-tighter">Usage</h3>
                  <CodeBlock code={usageCode} filename='page.js' language="jsx" />
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-muted text-2xl tracking-tighter">Component Code</h3>
                  <CodeBlock code={code} language="jsx" filename={`${slug}.jsx`} />
                </div>

                {config?.props?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-muted">Props</h3>
                    <div className="bg-secondary-surface/60 backdrop-blur-md rounded-xl border border-border/60 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-black/20 border-b border-border/60">
                          <tr>
                            <th className="text-left px-4 py-3 font-medium text-muted">Prop</th>
                            <th className="text-left px-4 py-3 font-medium text-muted">Type</th>
                            <th className="text-left px-4 py-3 font-medium text-muted">Default</th>
                            <th className="text-left px-4 py-3 font-medium text-muted">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {config.props.map((prop) => (
                            <tr key={prop.name}>
                              <td className="px-4 py-3 font-mono text-foreground">{prop.name}</td>
                              <td className="px-4 py-3 text-muted">{prop.type}</td>
                              <td className="px-4 py-3 font-mono text-muted">
                                {config.defaults?.[prop.name]?.toString() || "-"}
                              </td>
                              <td className="px-4 py-3 text-muted">{prop.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sticky sidebar — hidden on mobile, shown on desktop */}
            <div className="lg:col-span-1 self-stretch max-sm:hidden">
              <div className="sticky top-28 h-fit">
                {sidebarContent}
              </div>
            </div>
          </div>

          {/* Related Resources */}
          {relatedEffects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-4xl font-semibold text-foreground mb-6 tracking-tighter">Related Effects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEffects.map((relatedEffect) => (
                  <EffectCard key={relatedEffect.name} effect={relatedEffect} />
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </VaultLayout>
  );
}


