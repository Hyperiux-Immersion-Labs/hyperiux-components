import React from "react";
import Image from "next/image";

export default function DocsImage({
  src,
  alt = "",
  className,
  sizes,
  priority,
  rounded = "rounded-md",
  ...props
}) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden border border-border/30 bg-black/20 fadeup",
        rounded,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative aspect-video w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover opacity-80"
          sizes={sizes}
          priority={priority}
          {...props}
        />
      </div>
    </div>
  );
}

