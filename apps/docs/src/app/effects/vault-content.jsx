"use client";

import { useState, useMemo, useEffect, useEffectEvent } from "react";
import { useSearchParams } from "next/navigation";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";
import CharStaggerLinkBtn from "@/components/Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";
import Link from "next/link";
import Image from "next/image";

export function VaultContent({ effects, effectCounts }) {
  const searchParams = useSearchParams();
  const urlCategoryFilter = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(urlCategoryFilter);

  useEffect(() => {
    setCategoryFilter(urlCategoryFilter);
  }, [urlCategoryFilter]);

  const updateCategoryFilter = useEffectEvent((nextCategory) => {
    const resolvedCategory = nextCategory || "all";
    setCategoryFilter(resolvedCategory);

    const params = new URLSearchParams(searchParams.toString());

    if (resolvedCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", resolvedCategory);
    }

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `/effects?${nextQuery}` : "/effects";

    window.history.pushState(null, "", nextUrl);
  });
  const quickCategories = useMemo(() => {
    const entries = Object.entries(effectCounts || {}).filter(
      ([k]) => k && k !== "all",
    );
    entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
    return entries.map(([id]) => id);
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

  const totalEffects = effects.length;

  return (
    <VaultLayout effectCounts={effectCounts} effects={effects}>
      <div className="min-h-screen text-foreground relative">
        <VaultHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalEffects={totalEffects}
          effects={effects}
        />

        <div className="">
          <div className=" mx-auto px-8 max-sm:px-7 pt-28 pb-12  text-center">
            <p className=" mb-4 text-lg font-sans">Hello</p>
            <h1
              className="font-display max-sm:text-4xl text-7xl font-normal text-foreground mb-4"
              style={{ lineHeight: "1.0" }}
            >
              Welcome to <br /> the vault
            </h1>

           <div className="flex items-center justify-center gap-4 text-lg font-sans max-sm:flex-wrap max-sm:gap-2 max-sm:text-base">
  <span>{totalEffects} effects</span>
  <span>•</span>
  <span>Free & open source</span>
  <span>•</span>
  <span>Copy & paste</span>
</div>
          </div>
        </div>

        <div className=" px-10 max-sm:px-6 pb-10">
          <div className="flex items-center max-sm:justify-center gap-6 flex-wrap">
            {/* <div className="w-[45%] max-sm:w-[90%] max-sm:mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white z-10">
                  <svg
                    className="w-5 h-5 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search effects..."
                  className="w-full max-w-[50vw] max-sm:max-w-[80vw] max-sm:w-[80vw] pl-14 pr-10 py-2.5 rounded-full bg-[#0000033] backdrop-blur-[6px] border border-border/50 text-foreground placeholder:text-muted focus:outline-none   transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
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
                )}
              </div>
            </div> */}
            <div className="flex items-center max-sm:justify-center gap-2.5 flex-wrap">
              {quickCategories.map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateCategoryFilter(isSelected ? "all" : cat)}
                    className={`px-7 py-2.5 max-sm:px-6 text-md rounded-full backdrop-blur-[6px] border transition-all duration-500 ease-in-out hover:text-primary hover:bg-white font-sans group flex items-center max-sm:gap-4 gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-white font-semibold text-primary border-transparent"
                        : "bg-[#0000033] border-border/50 text-foreground"
                    }`}
                  >
                    <span>
                      {cat === "webgl"
                        ? "WebGL"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                    <span
                      className="overflow-hidden group-hover:rotate-90 transition-all duration-0 group-hover:duration-300 ease-in-out flex items-center"
                      style={{
                        maxWidth: isSelected ? "24px" : "0px",
                        opacity: isSelected ? 1 : 0,
                      }}
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

        <div className=" px-10 max-sm:px-6 pb-12">
          <div
            className={`flex flex-wrap items-center gap-3 transition-opacity duration-200 ${
              categoryFilter !== "all" || searchQuery
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

              <div className="mt-20 max-sm:mt-15">
           {/* <footer className="relative overflow-hidden rounded-3xl border border-border/60 bg-[#555555]/33 px-6 pt-10 pb-5 backdrop-blur-md md:px-12">

  <div className="relative z-10">

    <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
      
      
      <div className="flex flex-col items-start text-left">
     
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-black">
            <Image
              src="/hyperiux.svg"
              alt="Hyperiux"
              width={30}
              height={30}
            />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Hyperiux UI
          </h2>
        </div>

       
        <p className="max-w-[20vw] text-lg leading-[1.4]">
          Crafting futuristic UI experiences for modern teams.
        </p>
      </div>

   
      <div className="flex items-start gap-45">

         <div className="flex flex-col items-start gap-4">
          {[
            "Overview",
            "Components",
            "Templates",
            "Pricing",
            "Documentation",
            "Blog",
            "Contact",
          ].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="text-base text-zinc-300 transition hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </div>
      
        <div className="flex flex-col items-start gap-4">
  {socialIcons.map((item, i) => (
    <Link
      key={i}
      href={item.link}
      className="text-base text-zinc-300 transition hover:text-primary"
    >
      {item.name}
    </Link>
  ))}
</div>

      
       
      </div>
    </div>

    
    <div className="mt-5 flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-zinc-500 md:flex-row">
      <p>© 2026 Hyperiux UI. All rights reserved.</p>

      <div className="flex items-center gap-5">
        <span className="cursor-pointer transition hover:text-white">
          Terms of Use
        </span>

        <span>|</span>

        <span className="cursor-pointer transition hover:text-white">
          Privacy Policy
        </span>

        <span>|</span>

        <span className="cursor-pointer transition hover:text-white">
          Cookies
        </span>
      </div>
    </div>
  </div>
</footer> */}
 <footer className="relative overflow-hidden rounded-3xl border border-border/60 bg-[#555555]/33 backdrop-blur-md max-sm:px-6 pt-10 pb-5 px-12">
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center max-sm:gap-2">
                    {/* Logo */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl  text-xl font-bold text-black">
                        <Image
                          src="/hyperiux.svg"
                          alt="Hyperiux"
                          width={30}
                          height={30}
                        />
                      </div>

                      <h2 className="text-3xl font-semibold tracking-tight text-white">
                        Hyperiux UI
                      </h2>
                    </div>

                    {/* Subtitle */}
                    <p className="max-w-[20vw] max-sm:max-w-[80vw] text-lg leading-[1.4] ">
                      Crafting futuristic UI experiences for modern teams.
                    </p>

                    {/* Socials */}
                    <div className="mt-6 flex items-center gap-5">
                      {socialIcons.map((item, i) => (
                        <Link
                          key={i}
                          href={item.link}
                          className="flex h-12 w-12 p-3.5! items-center justify-center rounded-full border border-primary  transition hover:scale-105"
                        >
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={26}
                            height={26}
                            className="h-full w-full object-contain"
                          />
                        </Link>
                      ))}
                    </div>

                    {/* Nav */}
                   <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-300 md:gap-8">
  {[
    "Overview",
    "Components",
    "Templates",
    "Pricing",
    "Documentation",
    "Blog",
    "Contact",
  ].map((item, i) => (
    <div key={i} className="flex items-center gap-4">
      <Link
        href="#"
        className="cursor-pointer text-base max-sm:text-lg transition hover:text-primary"
      >
        {item}
      </Link>

      {i !== 6 && <span className="text-primary max-sm:text-xl">•</span>}
    </div>
  ))}
</div>

                    {/* Bottom */}
                    <div className="mt-5 max-sm:pb-2 flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-zinc-500 md:flex-row max-sm:text-base max-sm:gap-4">
                      <p>© 2026 Hyperiux UI. All rights reserved.</p>

                      <div className="flex items-center max-sm:text-sm gap-5">
                        <span className="cursor-pointer transition hover:text-white">
                          Terms of Use
                        </span>

                        <span>|</span>

                        <span className="cursor-pointer transition hover:text-white">
                          Privacy Policy
                        </span>

                        <span>|</span>

                        <span className="cursor-pointer transition hover:text-white">
                          Cookies
                        </span>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}

function EffectsGrid({ filteredEffects }) {
  const [showAllMobileCards, setShowAllMobileCards] = useState(false);

  return (
    <>
      <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-5 max-sm:gap-8 gap-y-12.5">
        {filteredEffects.map((effect, i) => (
          <div
            key={effect.name}
            className={!showAllMobileCards && i >= 10 ? "max-sm:hidden" : ""}
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

const socialIcons = [
  {
    name: "facebook",
    icon: "/assets/social-icons/facebook.svg",
    link: "#",
  },
  {
    name: "instagram",
    icon: "/assets/social-icons/linkedIn.svg",
    link: "#",
  },
  {
    name: "twitter",
    icon: "/assets/social-icons/twitter.svg",
    link: "#",
  },
  {
    name: "mail",
    icon: "/assets/social-icons/instagram.svg",
    link: "#",
  },
];
