"use client";

import Link from "next/link";

const LINK_GROUPS = [
  {
    heading: "Documentation",
    links: [
      { label: "API Reference", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Examples", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Changelog", href: "#" },
      { label: "Community", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Menu3() {
  return (
    <div className="grid grid-cols-3 gap-10 max-md:grid-cols-2">
      {LINK_GROUPS.map((group) => (
        <div key={group.heading} className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-500 max-md:text-xl max-sm:text-sm">
            {group.heading}
          </h4>

          <div className="flex flex-col gap-3">
            {group.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-medium transition-opacity duration-200 hover:opacity-60 max-md:text-lg max-sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
