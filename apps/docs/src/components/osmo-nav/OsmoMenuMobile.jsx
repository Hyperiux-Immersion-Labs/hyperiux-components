"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { navigationData } from "./data";

function ExpandToggle({ expanded, size = 22, boxClassName = "size-8 text-white/50" }) {
    return (
        <span
            className={`relative inline-flex shrink-0 items-center justify-center ${boxClassName}`}
            aria-hidden
        >
            <Plus
                size={size}
                strokeWidth={2}
                className={`absolute transition-all duration-300 ease-[cubic-bezier(0.625,0.05,0,1)] ${
                    expanded ? "scale-50 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
                }`}
            />
            <Minus
                size={size}
                strokeWidth={2}
                className={`absolute transition-all duration-300 ease-[cubic-bezier(0.625,0.05,0,1)] ${
                    expanded ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-90"
                }`}
            />
        </span>
    );
}

export function OsmoMenuMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedMain, setExpandedMain] = useState(null);
    const [expandedSub, setExpandedSub] = useState(null);

    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const menuTimeline = useRef(null);
    const mainItemRefs = useRef([]);
    const menuEase = "cubic-bezier(0.625, 0.05, 0, 1)";

    useEffect(() => {
        const tl = gsap.timeline({ paused: true });

        gsap.set(overlayRef.current, { opacity: 0, pointerEvents: "none" });
        gsap.set(contentRef.current, {
            clipPath: "inset(100% 0% 0% 0%)",
            WebkitClipPath: "inset(100% 0% 0% 0%)",
            pointerEvents: "none",
            visibility: "hidden",
        });

        tl.to(overlayRef.current, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.6,
            ease: menuEase,
        }, 0);

        tl.to(contentRef.current, {
            visibility: "visible",
            clipPath: "inset(0% 0% 0% 0%)",
            WebkitClipPath: "inset(0% 0% 0% 0%)",
            pointerEvents: "auto",
            duration: 0.7,
            ease: menuEase,
        }, 0.1);

        tl.eventCallback("onReverseComplete", () => {
            if (contentRef.current) {
                contentRef.current.style.visibility = "hidden";
                contentRef.current.style.pointerEvents = "none";
            }
            if (overlayRef.current) {
                overlayRef.current.style.pointerEvents = "none";
            }
        });

        menuTimeline.current = tl;
    }, []);

    useEffect(() => {
        const items = mainItemRefs.current.filter(Boolean);
        if (!items.length) return;

        if (isMenuOpen) {
            gsap.fromTo(items,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: menuEase, delay: 0.3 }
            );
        }
    }, [isMenuOpen]);

    const toggleMenu = () => {
        if (!menuTimeline.current) return;
        if (!isMenuOpen) {
            menuTimeline.current.play();
            setIsMenuOpen(true);
        } else {
            menuTimeline.current.reverse();
            setIsMenuOpen(false);
            setExpandedMain(null);
            setExpandedSub(null);
        }
    };

    const closeMenu = () => {
        if (!menuTimeline.current) return;
        menuTimeline.current.reverse();
        setIsMenuOpen(false);
        setExpandedMain(null);
        setExpandedSub(null);
    };

    const toggleMain = (index) => {
        if (expandedMain === index) {
            setExpandedMain(null);
            setExpandedSub(null);
        } else {
            setExpandedMain(index);
            setExpandedSub(null);
        }
    };

    const toggleSub = (index) => {
        setExpandedSub(expandedSub === index ? null : index);
    };

    return (
        <div className="block md:hidden">
            {/* Background Overlay */}
            <div
                ref={overlayRef}
                onClick={closeMenu}
                className="fixed inset-0 z-800 bg-black/60 backdrop-blur-sm opacity-0"
            />

            {/* Bottom Menu Bar */}
            <div className="fixed z-999 bottom-4 left-4 right-4 text-white">
                {/* Content Panel with clip-path */}
                <div
                    ref={contentRef}
                    className="bg-[#111111] rounded-md p-6 mb-4 h-[75vh] flex flex-col overflow-hidden shadow-2xl relative invisible"
                >
                    <div className="flex-1 overflow-y-auto space-y-1 pb-10" style={{ scrollbarWidth: "none" }}>
                        {navigationData.map((item, mainIndex) => (
                            <div
                                key={mainIndex}
                                ref={(el) => { mainItemRefs.current[mainIndex] = el; }}
                                className="border-b border-white/10 pb-4 pt-3 opacity-0"
                            >
                                <div
                                    className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                                    onClick={() => item.sublinks ? toggleMain(mainIndex) : null}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-3xl font-medium tracking-tight text-white"
                                    >
                                        {item.name}
                                    </Link>
                                    {item.sublinks && <ExpandToggle expanded={expandedMain === mainIndex} />}
                                </div>

                                {/* Sublinks — grid 0fr→1fr for smooth height */}
                                {item.sublinks && (
                                    <div
                                        className={`grid transition-[grid-template-rows] duration-500 ${
                                            expandedMain === mainIndex ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                        }`}
                                        style={{ transitionTimingFunction: menuEase }}
                                    >
                                        <div
                                            className={`min-h-0 overflow-hidden ${
                                                expandedMain === mainIndex ? "pointer-events-auto" : "pointer-events-none"
                                            }`}
                                        >
                                            <div className="pl-4 mt-4 space-y-3">
                                                {item.sublinks.map((sub, subIndex) => (
                                                    <div key={subIndex}>
                                                        <div
                                                            className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                                                            onClick={() => sub.nestedLinks ? toggleSub(subIndex) : null}
                                                        >
                                                            <Link
                                                                href={sub.href}
                                                                className="text-xl text-white/80"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                            {sub.nestedLinks && (
                                                                <ExpandToggle
                                                                    expanded={expandedSub === subIndex}
                                                                    size={18}
                                                                    boxClassName="size-7 text-white/40"
                                                                />
                                                            )}
                                                        </div>

                                                        {sub.nestedLinks && (
                                                            <div
                                                                className={`grid transition-[grid-template-rows] duration-500 ${
                                                                    expandedSub === subIndex ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                                }`}
                                                                style={{ transitionTimingFunction: menuEase }}
                                                            >
                                                                <div
                                                                    className={`min-h-0 overflow-hidden ${
                                                                        expandedSub === subIndex ? "pointer-events-auto" : "pointer-events-none"
                                                                    }`}
                                                                >
                                                                    <div className="pl-4 mt-2 space-y-2">
                                                                        {sub.nestedLinks.map((nested, nIndex) => (
                                                                            <div key={nIndex}>
                                                                                <Link
                                                                                    href={nested.href}
                                                                                    className="text-lg text-white/60 block active:text-white transition-colors"
                                                                                >
                                                                                    {nested.name}
                                                                                </Link>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Header Bar */}
                <div className="bg-[#111111] rounded-md px-6 py-3 flex items-center justify-between shadow-2xl border border-white/5">
                    <div className="w-24 h-auto relative">
                        <Image
                            src="/hyperiux-wordmark.svg"
                            alt="logo"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain brightness-0 invert"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="flex cursor-pointer items-center justify-center rounded-sm p-2.5 text-white transition-all duration-300 bg-[#2E2A2A]"
                    >
                        <div className="relative h-3 w-4">
                            <span
                                className={`absolute left-0 block h-px w-full origin-center bg-white transition-all duration-300 ${
                                    isMenuOpen
                                        ? "top-1/2 -translate-y-1/2 rotate-45"
                                        : "top-[calc(50%-3px)]"
                                }`}
                            />
                            <span
                                className={`absolute left-0 block h-px w-full origin-center bg-white transition-all duration-300 ${
                                    isMenuOpen
                                        ? "top-1/2 -translate-y-1/2 -rotate-45"
                                        : "top-[calc(50%+3px)]"
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
