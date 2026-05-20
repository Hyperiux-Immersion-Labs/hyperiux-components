"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const VERSIONS = [
  { label: "V1", href: "/mouse-pixelation-effects" },
  { label: "V2", href: "/mouse-pixelation-effects/v2" },
  { label: "V3", href: "/mouse-pixelation-effects/v3" },
];

export function VersionNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex gap-1 rounded-full px-1.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20">
      {VERSIONS.map((v) => {
        const isActive = pathname === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold tracking-widest transition-all duration-200 ${
              isActive
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
