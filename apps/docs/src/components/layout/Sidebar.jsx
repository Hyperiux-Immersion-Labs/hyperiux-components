"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const categories = [
    { id: "all", name: "All Effects" },
    { id: "text", name: "Text Animations" },
    { id: "backgrounds", name: "Backgrounds" },
    { id: "buttons", name: "Buttons" },
    { id: "scroll", name: "Scroll Animations" },
    { id: "components", name: "Components" },
    { id: "navigation", name: "Navigation" },
    { id: "cursor", name: "Cursor Effects" },
    { id: "transitions", name: "Page Transitions" },
    { id: "loaders", name: "Website Loaders" },
    { id: "webgl", name: "WebGL" },
    { id: "others", name: "Others" },
];

export function Sidebar({
    effectCounts = {},
    totalEffects = 0,
    isExpanded: controlledExpanded,
    onToggle,
    onClose,
    activeCategory,
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = activeCategory || searchParams.get("category") || "all";
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
    const isExpanded =
        typeof controlledExpanded === "boolean" ? controlledExpanded : uncontrolledExpanded;
    const toggle = () => {
        if (onToggle) return onToggle();
        setUncontrolledExpanded((v) => !v);
    };
    const close = () => {
        if (onClose) return onClose();
        setUncontrolledExpanded(false);
    };

    return (
        <aside
            className={`fixed  top-20 bottom-0 z-40 bg-transparent text-foreground transition-[width] duration-300 ease-out overflow-visible left-0 ${
                isExpanded ? "w-4/5 md:w-64" : "w-0"
            }`}
            style={{
                ["--sidebar-width"]: "16rem",
                ["--sidebar-peek"]: "0rem",
            }}
        >
            <div
                className={`relative flex h-full max-sm:h-fit max-sm:w-[80vw] max-sm:bg-black flex-col rounded-lg overflow-visible transition-transform duration-300 ease-out w-[16rem] ${
                    isExpanded ? "translate-x-0 max-sm:ml-6" : "max-sm:-translate-x-[calc(100%+0.75rem)] -translate-x-full"
                }`}
            >
                {/* Handle (always visible) */}
                <button
                    type="button"
                    aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
                    onClick={toggle}
                    className={`absolute max-sm:left-[calc(100%+1rem)] top-20 -translate-y-1/2 z-50 w-7 cursor-pointer transition-opacity duration-300 ease-out left-65 ${
                        isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <svg width="36" height="83" viewBox="0 0 36 83" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
                        <g clipPath="url(#clip0_2618_2592)">
                            <path d="M-48.6052 -10.4997C-41.1799 -4.42394 -6.77069 0.0540218 15.9343 2.40913C25.7864 3.43106 30.7125 3.94203 33.5662 7.10697C36.4198 10.2719 36.4198 15.1354 36.4198 24.8622V57.6428C36.4198 67.3716 36.4198 72.2359 33.5652 75.4011C30.7107 78.5663 25.784 79.0761 15.9306 80.0956C-6.81862 82.4495 -41.3094 86.9293 -48.6052 93.009C-59.696 102.251 -59.9001 -19.7418 -48.6052 -10.4997Z" fill="#A9A9A9" fillOpacity="0.3" />
                            <g clipPath="url(#clip1_2618_2592)">
                                <path d="M22.5454 52.9912L22.5454 28.9367" stroke="white" strokeWidth="2.67272" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.5273 52.9912L14.5273 28.9367" stroke="white" strokeWidth="2.67272" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_2618_2592">
                                <rect width="36" height="83" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_2618_2592">
                                <rect width="32" height="19" fill="white" transform="translate(9 57) rotate(-90)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <div
                    aria-hidden={!isExpanded}
                    className={`relative flex h-full w-full flex-col rounded-lg ${isExpanded ? "" : "pointer-events-none"}`}
                >
                    <div
                        className="h-fit w-full border border-border/60 p-4 rounded-lg bg-black/20 backdrop-blur-md"
                        onClick={(e) => {
                            if (!isExpanded) return;
                            if (e.target === e.currentTarget) close();
                        }}
                    >
                        <>
                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto z-99">
                                {/* The Vault section */}
                                <div className="mb-6">
                                    <Link
                                        href="/effects"
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-2 bg-[#555555]/33 transition-colors ${
                                            pathname === "/effects" && currentCategory === "all"
                                                ? " text-foreground"
                                                : "text-muted"
                                        }`}
                                        title="The Vault"
                                        onClick={close}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full bg-primary ${
                                                pathname === "/effects" && currentCategory === "all"
                                                    ? "animate-pulse opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                        <div className="flex items-center gap-3 flex-1 min-w-0 transition-opacity duration-300">
                                            <span className="font-medium">The Vault</span>
                                            <span className="ml-auto text-sm text-muted shrink-0">
                                                {totalEffects}
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Categories */}
                                <div className="space-y-1">
                                    <p className="px-3 text-sm font-medium text-muted uppercase tracking-wider my-4 transition-opacity duration-300">
                                        Categories
                                    </p>
                                    <div className="bg-[#555555]/33 backdrop-blur-md rounded-md p-4 px-2 space-y-3">
                                        {categories.slice(1).map((category) => {
                                            const count = effectCounts[category.id] || 0;
                                            const isActive = currentCategory === category.id;

                                            return (
                                                <Link
                                                    key={category.id}
                                                    href={`/effects?category=${category.id}`}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                                        isActive
                                                            ? " text-foreground"
                                                            : "text-muted hover:bg-black/30"
                                                    }`}
                                                    title={category.name}
                                                    onClick={close}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full bg-primary ${
                                                            isActive ? "animate opacity-100" : "opacity-0"
                                                        }`}
                                                    />
                                                    <div className="flex items-center flex-1 min-w-0 gap-3 transition-opacity duration-300">
                                                        <span className="text-sm truncate">{category.name}</span>
                                                        <span className="ml-auto text-xs text-muted shrink-0">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </nav>
                        </>
                    </div>
                </div>
            </div>
        </aside>
    );
}
