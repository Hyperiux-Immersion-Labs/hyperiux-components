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

export function Menu2() {
  return (
    <div className="flex flex-col gap-6 max-md:gap-10">
      <div className="flex flex-col gap-2 max-md:gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 max-md:text-base max-sm:text-xs">
          Solutions
        </p>
        <h3 className="text-2xl text-neutral-800 font-semibold max-md:text-4xl max-sm:text-2xl">
          Built for different teams
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2">
        {SOLUTION_BLOCKS.map((block) => (
          <Link
            key={block.title}
            href={block.href}
            className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-6 transition-all duration-200 hover:bg-neutral-100 max-sm:p-4"
          >
            <h4 className="text-lg font-semibold text-neutral-800 max-md:text-3xl max-sm:text-xl">{block.title}</h4>
            <p className="text-sm leading-6 text-neutral-600 max-md:text-xl max-sm:text-base max-sm:leading-[1.2]">
              {block.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
