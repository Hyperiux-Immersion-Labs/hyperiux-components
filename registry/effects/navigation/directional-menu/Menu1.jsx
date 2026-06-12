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
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-09.jpg",
  },
  {
    alt: "Product showcase",
    heightClassName: "h-54 max-md:h-60 max-sm:h-40",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg",
  },
];

export function Menu1() {
  return (
    <div className="flex justify-between gap-8 max-md:flex-wrap max-sm:flex-col">
      <div className="flex w-[65%] flex-col gap-6 max-md:w-[70%] max-sm:w-full">
        <div className="flex flex-col gap-2 max-md:gap-3 max-sm:gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 max-md:text-base max-sm:text-xs">
            Product Navigation
          </p>
          <h3 className="text-2xl text-neutral-800 font-semibold max-md:text-4xl max-sm:text-2xl">
            Explore the product suite
          </h3>
        </div>

        <div className="flex flex-col max-sm:flex-wrap gap-4">
          {PRODUCT_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col gap-1 rounded-lg border border-neutral-200 p-4 transition-colors duration-200 hover:bg-neutral-100"
            >
              <div className="text-lg font-medium text-neutral-700 max-md:text-2xl max-sm:text-xl">{item.label}</div>
              <div className="text-sm text-neutral-600 max-md:text-lg max-sm:text-base">
                Learn more about {item.label.toLowerCase()}.
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex w-[30%] max-md:hidden flex-col justify-end gap-4  max-md:w-full max-md:grid-cols-2 max-md:gap-4  ">
        {PREVIEW_IMAGES.map((image) => (
          <div
            key={image.src}
            className={`${image.heightClassName} overflow-hidden rounded-lg `}
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
