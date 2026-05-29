"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";
import CharStaggerLinkBtn from "@/components/Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";
import {
  effectCategories,
  getEffectCategory,
  getEffectCategoryBySlug,
  getEffectCategoryHref,
} from "@/lib/categories";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import HeadAnim from "@/components/Animations/HeadAnim";
import { fadeUp } from "@/components/Animations/gsapAnimations";

export function VaultContent({ effects, effectCounts, initialCategory = "all" }) {
  fadeUp();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const categoryFilter = useMemo(() => {
    const queryCategory = searchParams.get("category");
    if (queryCategory) return queryCategory;

    const [, rootSegment, categorySlug] = pathname.split("/");
    if (rootSegment !== "effects" || !categorySlug) return "all";

    return getEffectCategoryBySlug(categorySlug)?.id || initialCategory;
  }, [initialCategory, pathname, searchParams]);

  const updateCategoryFilter = useCallback((nextCategory) => {
    const resolvedCategory = nextCategory || "all";

    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");

    const nextQuery = params.toString();
    const categoryHref = getEffectCategoryHref(resolvedCategory);
    const nextUrl = nextQuery ? `${categoryHref}?${nextQuery}` : categoryHref;

    router.push(nextUrl);
  }, [router, searchParams]);
  const quickCategories = useMemo(() => {
    const knownCategories = effectCategories
      .filter((category) => category.id !== "all" && effectCounts?.[category.id])
      .map((category) => category.id);
    const extraCategories = Object.keys(effectCounts || {}).filter(
      (id) =>
        id &&
        id !== "all" &&
        !knownCategories.includes(id) &&
        effectCounts[id],
    );

    return [...knownCategories, ...extraCategories];
  }, [effectCounts]);

  // Filter effects based on search and category
  const filteredEffects = useMemo(() => {
    return effects.filter((effect) => {
      // Category filter
      if (categoryFilter !== "all") {
        const cats = effect.categories?.length
          ? effect.categories
          : [effect.category];
        if (!cats.includes(categoryFilter)) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const cats = effect.categories?.length
          ? effect.categories
          : [effect.category];
        return (
          effect.name.toLowerCase().includes(query) ||
          effect.title.toLowerCase().includes(query) ||
          cats.some((c) => c?.toLowerCase().includes(query)) ||
          effect.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [effects, categoryFilter, searchQuery]);

  const totalEffects = useMemo(() => {
    if (categoryFilter === "all") return effects.length;

    return effects.filter((effect) => {
      const cats = effect.categories?.length
        ? effect.categories
        : [effect.category];
      return cats.includes(categoryFilter);
    }).length;
  }, [effects, categoryFilter]);
  const activeCategoryName = getEffectCategory(categoryFilter)?.name || categoryFilter;

  return (
    <VaultLayout
      effectCounts={effectCounts}
      effects={effects}
      activeCategory={categoryFilter}
    >
      <div className="min-h-screen text-foreground relative">
        <VaultHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalEffects={totalEffects}
          effects={effects}
        />

        <div className="">
          <div className=" mx-auto px-8 max-sm:px-7 pt-28 pb-12  text-center">
            {/* <p className=" mb-4 text-lg font-sans">Hello</p> */}
            <HeadAnim>
              <h1
                className="font-display max-sm:text-4xl text-7xl font-normal text-foreground mb-4"
                style={{ lineHeight: "1.0" }}
              >
                {categoryFilter === "all" ? (
                  <>
                    Welcome to <br /> the vault
                  </>
                ) : (
                  <>
                    {activeCategoryName} <br /> effects
                  </>
                )}
              </h1>
            </HeadAnim>

            <div className="flex items-center justify-center gap-4 text-lg font-sans max-sm:flex-wrap max-sm:gap-2 max-sm:text-base fadeup">
              <span>{totalEffects} effects</span>
              <span>•</span>
              <span>Free & open source</span>
              <span>•</span>
              <span>Copy & paste</span>
            </div>
          </div>
        </div>

        {/* Filter pills — desktop wraps, mobile single-line scroll */}
        <div className="pb-10 px-10 max-sm:px-0">
          <div className="relative max-sm:w-full">
            {/* Right fade hint on mobile */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 hidden max-sm:block"
              style={{
                background:
                  "linear-gradient(to left, var(--background, #000) 0%, transparent 100%)",
              }}
            />
            <div
              className={[
                "flex items-center gap-2.5 fadeup",
                // desktop: wrapping
                "flex-wrap",
                // mobile: horizontal scroll, no wrap, padded edges
                "max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-6",
                // always-visible orange scrollbar
                "[scrollbar-width:thin] [scrollbar-color:#CC4C04_transparent]",
                "[&::-webkit-scrollbar]:h-[4px]",
                "[&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:bg-[#CC4C04] [&::-webkit-scrollbar-thumb]:rounded-full",
                "max-sm:pb-3 ",
              ].join(" ")}
            >
              {quickCategories.map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateCategoryFilter(isSelected ? "all" : cat)}
                    className={`
    px-7 py-2.5 max-sm:px-6 text-md text-center relative rounded-full
    backdrop-blur-[6px] border font-sans group flex items-center cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-primary hover:bg-white 
    ${isSelected
                        ? "bg-white text-primary border-transparent pr-12"
                        : "bg-[#00000033] border-border/50 text-foreground pr-7"
                      }
  `}
                  >
                    <span className="leading-none">
                      {cat === "webgl"
                        ? "WebGL"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>

                    <span
                      className={`
      absolute right-5 top-1/2 -translate-y-1/2
      flex items-center overflow-hidden
      transition-all duration-300 ease-in-out
      ${isSelected
                          ? "opacity-100 scale-100 delay-150"
                          : "opacity-0 scale-75 delay-0"
                        }
    `}
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className=" px-10 max-sm:px-6 pb-12 fadeup">
          <div
            className={`flex flex-wrap items-center gap-3 transition-opacity duration-200 ${categoryFilter !== "all" || searchQuery
              ? "mb-8 min-h-10 opacity-100"
              : "mb-0 min-h-0 opacity-0 pointer-events-none"
              }`}
          >
            {(categoryFilter !== "all" || searchQuery) && (
              <span className="text-sm text-muted font-sans">
                Showing {filteredEffects.length} of {totalEffects} effects
              </span>
            )}
            {categoryFilter !== "all" && (
              <>
                <span
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#555555]/33 backdrop-blur-md border border-border/50 text-foreground text-sm capitalize font-medium"
                  style={{ borderRadius: "56px" }}
                >
                  <span>{categoryFilter}</span>
                  <button
                    type="button"
                    onClick={() => updateCategoryFilter("all")}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              </>
            )}
            {searchQuery && (
              <>
                <span
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#555555]/33 backdrop-blur-md border border-border/50 text-foreground text-sm font-medium"
                  style={{ borderRadius: "56px" }}
                >
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              </>
            )}
          </div>

          {filteredEffects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3
                className="font-display text-3xl font-normal text-foreground mb-3"
                style={{ lineHeight: "1.1" }}
              >
                No effects found
              </h3>
              <p className="text-muted font-sans text-base">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <EffectsGrid
                filteredEffects={filteredEffects}
              />


            </>
          )}
        </div>
        <div className="px-10 py-8">
          <Footer />
        </div>
      </div>
    </VaultLayout>
  );
}

function EffectsGrid({ filteredEffects }) {
  const [showAllMobileCards, setShowAllMobileCards] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".effect-card-shell",
        {
          autoAlpha: 0,
          y: 34,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: {
            each: 0.06,
            from: "start",
          },
          clearProps: "transform,opacity,visibility",
        },
      );
    }, grid);

    return () => ctx.revert();
  }, [filteredEffects]);

  return (
    <>
      <div
        ref={gridRef}
        className="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-5 max-sm:gap-8 gap-y-12.5"
      >
        {filteredEffects.map((effect, i) => (
          <div
            key={effect.name}
            className={`effect-card-shell ${!showAllMobileCards && i >= 10 ? "max-sm:hidden" : ""
              }`}
          >
            <EffectCard effect={effect} priority={i < 4} />
          </div>
        ))}
      </div>

      {filteredEffects.length > 10 && !showAllMobileCards && (
        <div className="hidden max-sm:flex justify-center mt-10">
          <CharStaggerLinkBtn
            href="#"
            text="View more"
            showLine
            onClick={(e) => {
              e.preventDefault();
              setShowAllMobileCards(true);
            }}
            className="text-lg font-sans text-foreground"
          />
        </div>
      )}
    </>
  );
}
