"use client";

import React from "react";
import Para from "@/components/DocsContent/Para";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function DocsListItem({ children, text, className, paraClassName, ...props }) {
  return (
    <li className={cx("marker:text-muted", className)} {...props}>
      {children ?? <Para className={cx("m-0", paraClassName)}>{text}</Para>}
    </li>
  );
}

export default function DocsList({
  items,
  className,
  itemClassName,
  paraClassName,
  children,
  ...props
}) {
  return (
    <ul className={cx("list-disc pl-6 space-y-5", className)} {...props}>
      {items
        ? items.map((item, idx) => (
            <DocsListItem
              key={idx}
              className={itemClassName}
              paraClassName={paraClassName}
            >
              {typeof item === "string" ? (
                <Para className={cx("m-0", paraClassName)}>{item}</Para>
              ) : (
                item
              )}
            </DocsListItem>
          ))
        : children}
    </ul>
  );
}
