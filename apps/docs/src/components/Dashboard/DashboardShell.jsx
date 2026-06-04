"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const tabs = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Saved Effects",
    href: "/dashboard/saved",
  },
  {
    label: "Activity",
    href: "/dashboard/activity",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[1600px] mx-auto px-[3vw] pt-20 pb-16">

        <div className="mb-12">
          <div className="flex flex-col justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white/70 transition hover:bg-[#ff5f00] hover:border-[#ff5f00] hover:text-white cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <h1 className="text-7xl font-display">
              Dashboard
            </h1>
          </div>

          <p className="text-white pl-1">
            Manage your Hyperiux Vault account.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-12 max-lg:flex-col max-lg:items-start">
          <div className="flex gap-3 overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const active =
                pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    px-6 py-3 rounded-full
                    transition-all duration-300
                    border shrink-0
                    ${active
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-white hover:bg-white hover:text-black"}
                  `}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/effects"
            className="shrink-0 px-6 py-3 rounded-full bg-white text-black transition duration-300 hover:bg-[#ff5f00] hover:text-white"
          >
            Browse Effects
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
