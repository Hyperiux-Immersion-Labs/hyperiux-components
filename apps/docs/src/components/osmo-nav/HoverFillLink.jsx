import React from "react";
import Link from "next/link";
import styles from "./HoverFillLink.module.css";

export function HoverFillLink({ href, children, className = "", isActive, ...props }) {
    const text = typeof children === "string" ? children : "";
    return (
        <Link
            href={href}
            data-content={text}
            data-active={isActive ? "true" : undefined}
            className={`${styles.link} ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
}
