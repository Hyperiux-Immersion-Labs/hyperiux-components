"use client";

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

export function Menu3() {
  return (
    <div className="grid grid-cols-3 gap-10 max-[1025px]:grid-cols-2">
      {LINK_GROUPS.map((group) => (
        <div key={group.heading} className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-800 max-[1025px]:text-2xl max-md:text-sm">
            {group.heading}
          </h4>

          <div className="flex flex-col gap-3">
            {group.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium text-neutral-600 transition-opacity duration-200 hover:text-black max-[1025px]:text-xl max-md:text-base motion-reduce:text-neutral-600 motion-reduce:transition-none"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
