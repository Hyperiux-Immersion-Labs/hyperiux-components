"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function UpgradeCard({ effectTitle }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to start checkout");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      {/* Lock icon */}
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-2">
          Pro Effect
        </p>
        <h3 className="text-2xl font-semibold text-white mb-3 font-display">
          {effectTitle ?? "This effect"} is locked
        </h3>
        <p className="text-white/60 text-sm max-w-sm leading-relaxed">
          Subscribe to Hyperiux Pro to access this effect and 100+ others.
          Unlimited installs via CLI, full source code, forever.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : null}
          {loading ? "Redirecting…" : isSignedIn ? "Upgrade to Pro" : "Sign in to Upgrade"}
        </button>

        {!isSignedIn && (
          <button
            onClick={() => router.push("/sign-in")}
            className="flex-1 px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Sign in
          </button>
        )}
      </div>

      <p className="text-white/30 text-xs">
        Cancel anytime · Instant access after payment
      </p>
    </div>
  );
}
