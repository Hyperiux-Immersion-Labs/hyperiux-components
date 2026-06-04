"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GlobalSearch } from "./SearchBar";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropDown";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const categoryNames = {
  text: "Text Animations",
  backgrounds: "Backgrounds",
  buttons: "Buttons",
  scroll: "Scroll Animations",
  cursor: "Cursor Effects",
  components: "Components",
  navigation: "Navigation",
  transitions: "Page Transitions",
  loaders: "Website Loaders",
  webgl: "WebGL",
  others: "Others",
};

export function VaultHeader({
  searchQuery,
  onSearchChange,
  totalEffects,
  effectName,
  showSearch = true,
  effects = [],
}) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const { isSignedIn } = useUser();

  const [openTrigger, setOpenTrigger] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function loadWishlistCount() {
      try {
        const res = await fetch("/api/wishlist");

        if (!res.ok) return;

        const data = await res.json();

        setWishlistCount(data.length);
      } catch (err) {
        console.error(err);
      }
    }

    loadWishlistCount();
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 px-10 h-18 py-4 bg-black/10 backdrop-blur-md"
      >
        <div className="flex items-center h-full justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/hyperiux.svg"
              alt="Hyperiux"
              width={30}
              height={30}
            />

            <div className="flex items-center gap-2 text-white">
              <Image
                src="/hyperiux-wordmark.svg"
                alt="Hyperiux"
                width={156}
                height={45}
              />
            </div>
          </Link>

          {/* Right side - Search */}
          <div className="flex items-center gap-3">

            {showSearch && (
              <button
                onClick={() => setOpenTrigger((n) => n + 1)}
                className="group flex bg-[#0000033] backdrop-blur-[6px] items-center gap-2 w-80 max-sm:w-12 max-sm:h-12 max-sm:justify-center max-sm:rounded-full pl-4 max-sm:pl-3 pr-3 py-3 border border-border/60 rounded-xl  text-white  hover:border-white/80 duration-300 ease-in-out transition-all  cursor-pointer"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-current"
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

                <span className="flex-1 text-left max-sm:hidden text-[1.1vw] text-current opacity-60">
                  Search effects...
                </span>

                <kbd className="px-1 py-0.5 rounded text-xs text-current opacity-50">
                  (⌘K / Ctrl+K)
                </kbd>
              </button>
            )}
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="hidden md:flex px-5 py-2.5 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                >
                  Sign In
                </Link>

                <Link
                  href="/pricing"
                  className="px-5 py-2.5 rounded-full bg-white text-black hover:opacity-90 transition-all"
                >
                  Get Pro
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="px-5 py-2.5 rounded-full bg-white text-black hover:opacity-90 transition-all"
                >
                  Upgrade
                </Link>

                <ProfileDropdown
                  savedCount={wishlistCount}
                  plan="free"
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal — fully self-contained, Ctrl+K works natively */}
      <GlobalSearch
        effects={effects}
        externalOpen={openTrigger}
      />
    </>
  );
}
