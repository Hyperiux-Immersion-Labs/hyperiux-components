"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";

export default function ProfileDropdown({
  savedCount = 0,
  plan = "free",
}) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  if (!user) return null;

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || "User"}
          className="w-10 h-10 rounded-full border border-white/10"
        />

        {plan === "pro" && (
          <span className="px-2 py-1 text-xs rounded-full bg-white text-black font-medium">
            PRO
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-72 rounded-3xl border border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden z-50">
          <div className="p-5 border-b border-white/10">
            <p className="text-white font-medium">
              {user.fullName}
            </p>

            <p className="text-white/50 text-sm truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard"
              className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/saved"
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <span>Saved Effects</span>

              <span className="text-white/50">
                {savedCount}
              </span>
            </Link>

            <Link
              href="/dashboard/activity"
              className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              Activity
            </Link>

            <Link
              href="/dashboard/settings"
              className="block px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              Settings
            </Link>

            {plan === "free" && (
              <>
                <div className="my-2 border-t border-white/10" />

                <Link
                  href="/pricing"
                  className="block px-4 py-3 rounded-xl text-[#ff5f00] hover:bg-white/5 transition"
                >
                  Upgrade to Pro
                </Link>
              </>
            )}

            <div className="my-2 border-t border-white/10" />

            <button
              onClick={() => signOut(() => {
                window.location.href = "/";
              })}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition text-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}