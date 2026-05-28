"use client";

import Image from "next/image";
import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Overview", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Integrations", href: "#" },
  { label: "Documentation", href: "#" },
];

const PREVIEW_IMAGES = [
  {
    alt: "Dashboard preview",
    heightClassName: "h-54 max-md:h-60 max-sm:h-40",
    src: "/assets/menu/beach.jpg",
  },
  {
    alt: "Product showcase",
    heightClassName: "h-54 max-md:h-60 max-sm:h-40",
    src: "/assets/menu/spider-man.jpg",
  },
];

export default function Menu1() {
  return (
    <div className="flex justify-between gap-8 max-md:flex-wrap max-sm:flex-col">
      <div className="flex w-[65%] flex-col gap-6 max-md:w-[70%] max-sm:w-full">
        <div className="flex flex-col gap-2 max-md:gap-3 max-sm:gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 max-md:text-sm max-sm:text-xs">
            Product Navigation
          </p>
          <h3 className="text-2xl font-semibold max-md:text-4xl max-sm:text-2xl">
            Explore the product suite
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {PRODUCT_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col gap-1 rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:bg-neutral-900"
            >
              <div className="text-sm font-medium max-md:text-xl max-sm:text-sm">{item.label}</div>
              <div className="text-sm text-neutral-500 max-md:text-base max-sm:text-sm">
                Learn more about {item.label.toLowerCase()}.
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex w-[30%] flex-col gap-4 max-md:grid max-md:w-full max-md:grid-cols-2 max-md:gap-4 max-sm:flex max-sm:flex-col">
        {PREVIEW_IMAGES.map((image) => (
          <div
            key={image.src}
            className={`${image.heightClassName} overflow-hidden rounded-2xl border border-neutral-200`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
