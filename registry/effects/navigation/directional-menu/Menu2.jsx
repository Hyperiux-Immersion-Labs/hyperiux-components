"use client";

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
    <div className="flex flex-col gap-6 max-[1025px]:gap-10">
      <div className="flex flex-col gap-2 max-[1025px]:gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 max-[1025px]:text-base max-md:text-xs">
          Solutions
        </p>
        <h3 className="text-2xl text-neutral-800 font-semibold max-[1025px]:text-4xl max-md:text-2xl">
          Built for different teams
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-6 max-[1025px]:grid-cols-2">
        {SOLUTION_BLOCKS.map((block) => (
          <a
            key={block.title}
            href={block.href}
            className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-6 transition-all duration-200 hover:bg-neutral-100 max-md:p-4 motion-reduce:bg-transparent motion-reduce:transition-none"
          >
            <h4 className="text-lg font-semibold text-neutral-800 max-[1025px]:text-3xl max-md:text-xl">{block.title}</h4>
            <p className="text-sm leading-6 text-neutral-600 max-[1025px]:text-xl max-md:text-base max-md:leading-[1.2]">
              {block.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
