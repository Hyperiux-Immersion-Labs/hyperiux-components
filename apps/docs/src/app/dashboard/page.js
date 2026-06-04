"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatDate(value) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
  detail,
  href,
}) {
  const content = (
    <div className="h-full border border-white/10 rounded-lg p-6 bg-white/5 backdrop-blur-lg transition duration-300 hover:border-[#ff5f00]">
      <p className="text-white/75 mb-3">
        {label}
      </p>

      <p className="text-4xl font-semibold leading-none">
        {value}
      </p>

      {detail && (
        <p className="text-white/75 mt-4">
          {detail}
        </p>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (active) setData(json);
    }

    const frame = requestAnimationFrame(() => {
      load();
    });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  const planLabel = data.plan === "pro" ? "Pro" : "Free";
  const accessLabel =
    data.plan === "pro"
      ? `${data.totalEffectsAccess}`
      : `${data.totalEffectsAccess}`;

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <StatCard
          label="Saved Effects"
          value={data.savedCount}
          detail="Effects in your wishlist"
          href="/dashboard/saved"
        />

        <StatCard
          label="Joined"
          value={formatDate(data.joinedAt)}
          detail="Account creation date"
        />

        <StatCard
          label="Plan"
          value={planLabel}
          detail={data.plan === "pro" ? "Full vault access" : "Starter access"}
          href="/pricing"
        />

        <StatCard
          label="Effects Access"
          value={accessLabel}
          detail={`${data.totalEffectsAccess} of ${data.totalEffects} effects available`}
        />
      </div>

      <div className="border border-white/10 rounded-lg p-6 bg-white/5 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              Vault access
            </h2>

            <p className="text-white/75 mt-2">
              Free accounts include 30 effects. Upgrade to unlock the full vault.
            </p>
          </div>

          {data.plan === "free" && (
            <Link
              href="/pricing"
              className="inline-flex px-5 py-3 rounded-full bg-white text-black transition duration-300 hover:bg-[#ff5f00] hover:text-white"
            >
              Upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
