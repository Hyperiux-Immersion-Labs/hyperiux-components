import React from "react";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function DocsContent({ className, children, ...props }) {
  return (
    <div
      className={cx(
        "w-full py-10 md:py-14 space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

