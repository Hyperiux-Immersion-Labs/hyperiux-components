"use client";

import Link from "next/link";

const SOLUTION_BLOCKS = [
  {
    title: "Startups",
    description:
      "Launch faster with flexible infrastructure, simple onboarding, and scalable workflows.",
    href: "#",
  },
  {
    title: "Enterprise",
    description:
      "Bring governance, performance, and operational control to complex digital systems.",
    href: "#",
  },
  {
    title: "Agencies",
    description:
      "Build repeatable client delivery with modular systems, collaboration, and speed.",
    href: "#",
  },
];

export default function Menu2() {
  return (
    <div className="flex flex-col gap-6 max-md:gap-10">
      <div className="flex flex-col gap-2 max-md:gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 max-md:text-sm max-sm:text-xs">
          Solutions
        </p>
        <h3 className="text-2xl font-semibold max-md:text-4xl max-sm:text-2xl">
          Built for different teams
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2">
        {SOLUTION_BLOCKS.map((block) => (
          <Link
            key={block.title}
            href={block.href}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-900"
          >
            <h4 className="text-lg font-semibold max-md:text-2xl max-sm:text-lg">{block.title}</h4>
            <p className="text-sm leading-6 text-neutral-400 max-md:text-lg max-sm:text-sm">
              {block.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
