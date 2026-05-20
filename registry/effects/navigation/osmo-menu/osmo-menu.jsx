"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

import Image from "next/image";
import Link from "next/link";
import styles from "./HoverFillLink.module.css";

function HoverFillLink({ href, children, className = "", isActive, ...props }) {
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

const navigationData = [
    {
        name: "About", href: "#",
    },
    { name: "Work", href: "#" },
    {
        name: "Expertise",
        href: "#",
        sublinks: [
            {
                name: "Solutions", href: "#", nestedLinks: [
                    { name: "Design", href: "#" },
                    { name: "Development", href: "#" },
                    { name: "Marketing", href: "#" },
                    { name: "Strategy", href: "#" }
                ]
            },
            {
                name: "Industry", href: "#", nestedLinks: [
                    { name: "Fintech", href: "#" },
                    { name: "HealthCare", href: "#" },
                    { name: "Education", href: "#" },
                    { name: "Electronics", href: "#" }
                ]
            },
            {
                name: "Services",
                href: "#",

            }
        ]
    },
    { name: "Career", href: "#" },
    {
        name: "Resources", href: "#", sublinks: [
            { name: "Codepen", href: "#" },
            { name: "Greensock", href: "#" },
            {
                name: "Webflow",
                href: "#",
            }
        ]
    },
    { name: "Contact", href: "#" },
];

export default function OsmoMenu() {
    const backgroundOverlayRef = useRef(null);
    const menuWrapperRef = useRef(null);
    const headerRef = useRef(null);
    const menuContentRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSubIndex, setSelectedSubIndex] = useState(null);
    const [selectedNestedIndex, setSelectedNestedIndex] = useState(null);
    const [activeMainIndex, setActiveMainIndex] = useState(0);
    const [activeSubIndex, setActiveSubIndex] = useState(null);
    const [activeNestedIndex, setActiveNestedIndex] = useState(null);
    const seprationLineRef = useRef(null);
    const menuTimeline = useRef(null);
    const col2Ref = useRef(null);
    const col3Ref = useRef(null);
    const mainSquareRef = useRef(null);
    const mainItemRefs = useRef([]);

    // Quick constant for our menu's custom cubic-bezier easing
    const menuEase = "cubic-bezier(0.625, 0.05, 0, 1)";

    useEffect(() => {
        const square = mainSquareRef.current;
        const items = mainItemRefs.current.filter(Boolean);
        if (!square || !items.length) return;

        if (activeMainIndex === null) {
            gsap.to(square, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto", ease: menuEase });
            gsap.to(items, { x: 0, duration: 0.4, ease: menuEase, overwrite: "auto" });
            return;
        }

        gsap.to(square, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto", ease: menuEase });

        const targetItem = items[activeMainIndex];
        if (!targetItem) return;

        const targetY = targetItem.offsetTop + (targetItem.offsetHeight / 2) - (square.offsetHeight / 2);

        gsap.to(square, {
            y: targetY,
            rotation: activeMainIndex * 90,
            duration: 0.4,
            ease: menuEase,
            overwrite: "auto"
        });

        const totalTranslateImpact = 2;
        const translateValue = window.innerWidth * 0.015;

        items.forEach((item, index) => {
            const distance = Math.min(Math.abs(index - activeMainIndex) / totalTranslateImpact, 1);
            gsap.to(item, {
                x: translateValue * (1 - distance),
                duration: 0.4,
                ease: menuEase,
                overwrite: "auto"
            });
        });
    }, [activeMainIndex]);

    useEffect(() => {
        if (!col2Ref.current) return;
        const children = Array.from(col2Ref.current.children);
        if (children.length < 2) return;
        const square = children[0];
        const items = children.slice(1);

        if (activeSubIndex === null) {
            gsap.to(square, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto", ease: menuEase });
            gsap.to(items, { x: 0, duration: 0.4, ease: menuEase, overwrite: "auto" });
            return;
        }

        gsap.to(square, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto", ease: menuEase });

        const targetItem = items[activeSubIndex];
        if (!targetItem) return;

        const targetY = targetItem.offsetTop + (targetItem.offsetHeight / 2) - (square.offsetHeight / 2);

        gsap.to(square, {
            y: targetY,
            rotation: activeSubIndex * 90,
            duration: 0.4,
            ease: menuEase,
            overwrite: "auto"
        });

        const totalTranslateImpact = 2;
        const translateValue = window.innerWidth * 0.01;

        items.forEach((item, index) => {
            const distance = Math.min(Math.abs(index - activeSubIndex) / totalTranslateImpact, 1);
            gsap.to(item, {
                x: translateValue * (1 - distance),
                duration: 0.4,
                ease: menuEase,
                overwrite: "auto"
            });
        });
    }, [activeSubIndex, activeMainIndex]);

    useEffect(() => {
        if (!col3Ref.current) return;
        const children = Array.from(col3Ref.current.children);
        if (children.length < 2) return;
        const square = children[0];
        const items = children.slice(1);

        if (activeNestedIndex === null) {
            gsap.to(square, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto", ease: menuEase });
            gsap.to(items, { x: 0, duration: 0.4, ease: menuEase, overwrite: "auto" });
            return;
        }

        gsap.to(square, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto", ease: menuEase });

        const targetItem = items[activeNestedIndex];
        if (!targetItem) return;

        const targetY = targetItem.offsetTop + (targetItem.offsetHeight / 2) - (square.offsetHeight / 2);

        gsap.to(square, {
            y: targetY,
            rotation: activeNestedIndex * 90,
            duration: 0.4,
            ease: menuEase,
            overwrite: "auto"
        });

        const totalTranslateImpact = 2;
        const translateValue = window.innerWidth * 0.01;

        items.forEach((item, index) => {
            const distance = Math.min(Math.abs(index - activeNestedIndex) / totalTranslateImpact, 1);
            gsap.to(item, {
                x: translateValue * (1 - distance),
                duration: 0.4,
                ease: menuEase,
                overwrite: "auto"
            });
        });
    }, [activeNestedIndex, activeSubIndex]);

    useEffect(() => {
        if (activeMainIndex !== null && col2Ref.current) {
            const items = Array.from(col2Ref.current.children).slice(1);
            gsap.killTweensOf(items);
            gsap.fromTo(
                items,
                { opacity: 0, y: -14 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "elastic.out(0.9, 0.6)" }
            );
        }
    }, [activeMainIndex]);

    useEffect(() => {
        if (activeSubIndex !== null && col3Ref.current) {
            const items = Array.from(col3Ref.current.children).slice(1);
            gsap.killTweensOf(items);
            gsap.fromTo(
                items,
                { opacity: 0, y: -14 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "elastic.out(0.9, 0.6)" }
            );
        }
    }, [activeMainIndex, activeSubIndex]);

    useEffect(() => {
        // Overwrite GSAP custom ease creation to simply use the cubic-bezier directly for all transitions in this component
        // CustomEase.create("menuEase", "0.625, 0.05, 0, 1");
        const tl = gsap.timeline({ paused: true });

        gsap.set(backgroundOverlayRef.current, { opacity: 0 });
        gsap.set(menuWrapperRef.current, { width: "55vw" });
        gsap.set(menuContentRef.current, {
            clipPath: "inset(100% 0% 0% 0%)",
            WebkitClipPath: "inset(100% 0% 0% 0%)",
            pointerEvents: "none",
        });
        gsap.set(seprationLineRef.current, { opacity: 0 });

        tl.to(
            backgroundOverlayRef.current,
            {
                opacity: 1,
                duration: 1,
                ease: menuEase,
            },
            0,
        );

        tl.to(
            menuWrapperRef.current,
            {
                width: "98vw",
                duration: .7,
                ease: menuEase,
            },
            0.1,
        );

        tl.to(menuContentRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            WebkitClipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: menuEase,
        },"<+.5");

        tl.to(
            seprationLineRef.current,
            {
                opacity: 1,
                duration: 0.5,
                ease: menuEase,
            },
            "<",
        );

        tl.eventCallback("onStart", () => {
            if (menuContentRef.current) menuContentRef.current.style.pointerEvents = "auto";
        });
        tl.eventCallback("onReverseComplete", () => {
            if (menuContentRef.current) menuContentRef.current.style.pointerEvents = "none";
        });

        menuTimeline.current = tl;
    }, []);

    const toggleMenu = () => {
        if (!menuTimeline.current) return;
        if (menuTimeline.current.reversed() || !isMenuOpen) {
            menuTimeline.current.play();
            setIsMenuOpen(true);
        } else {
            menuTimeline.current.reverse();
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="h-screen w-full bg-primary relative">
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[2vw] tracking-tight">
                HYPERIUX NAVIGATION
            </p>
            <div
                onClick={() => { menuTimeline.current.reverse(); setIsMenuOpen(false); }}
                ref={backgroundOverlayRef}
                className="h-full w-full z-800 opacity-0 bg-black/50 absolute top-0 left-0 "
            />
            <div
                ref={menuWrapperRef}
                className="fixed  z-999 px-[2vw] py-[1vw] text-white bg-[#111111] bottom-[1vw] left-1/2 -translate-x-1/2 w-[55vw] h-fit rounded-md"
            >
                {/* FLOATING CONTENT PANEL */}
                <div
                    ref={menuContentRef}
                    className="absolute pb-[3vw] p-[1vw] bottom-[2vw] mb-[0.5vw] left-0 w-full h-[75vh] bg-[#111111] flex items-center justify-center gap-[1vw] rounded-md origin-bottom overflow-hidden"
                >
                    <div
                        className="bg-[#1A1A1A] flex items-start p-[2vw] rounded-md overflow-hidden h-full gap-[2vw] w-[70vw]"
                        onMouseLeave={() => {
                            setActiveMainIndex(selectedIndex);
                            setActiveSubIndex(selectedSubIndex);
                            setActiveNestedIndex(selectedNestedIndex);
                        }}
                    >
                        {/* COLUMN 1: MAIN LINKS */}
                        <div className="w-full h-full flex flex-col relative">
                            <div
                                ref={mainSquareRef}
                                className="absolute top-0 left-[-1vw] w-[0.8vw] h-[0.8vw] bg-primary scale-0 opacity-0 pointer-events-none z-10"
                            />
                            {navigationData.map((item, index) => (
                                <div
                                    key={index}
                                    ref={(el) => {
                                        mainItemRefs.current[index] = el;
                                    }}
                                >
                                    <HoverFillLink
                                        href={item.href}
                                        onClick={() => {
                                            setSelectedIndex(index);
                                            setSelectedSubIndex(null);
                                            setSelectedNestedIndex(null);
                                        }}
                                        onMouseEnter={() => {
                                            setActiveMainIndex(index);
                                            setActiveSubIndex(null);
                                        }}
                                        isActive={activeMainIndex === index}
                                        className={`text-[3.5vw] text-left transition-colors duration-300 `}
                                    >
                                        {item.name}
                                    </HoverFillLink>
                                </div>
                            ))}
                        </div>

                        {/* COLUMN 2: SUBLINKS */}
                        <div className="w-full h-full relative">
                            {activeMainIndex !== null && navigationData[activeMainIndex].sublinks && (
                                <div ref={col2Ref} className="p-[2vw] h-fit rounded-md flex flex-col relative">
                                    <div className="absolute top-0 left-[1vw] w-[0.6vw] h-[0.6vw] bg-primary scale-0 opacity-0 pointer-events-none z-10" />
                                    {navigationData[activeMainIndex].sublinks.map((subItem, subIndex) => (
                                        <div key={subIndex} className="opacity-0">
                                            <HoverFillLink
                                                href={subItem.href}
                                                onClick={() => {
                                                    setSelectedIndex(activeMainIndex);
                                                    setSelectedSubIndex(subIndex);
                                                    setSelectedNestedIndex(null);
                                                }}
                                                onMouseEnter={() => setActiveSubIndex(subIndex)}
                                                isActive={
                                                    activeSubIndex === subIndex ||
                                                    (activeSubIndex === null && activeMainIndex === selectedIndex && selectedSubIndex === subIndex)
                                                }
                                                className={`text-[2vw] text-left`}
                                            >
                                                {subItem.name}
                                            </HoverFillLink>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* COLUMN 3: NESTED LINKS */}
                        <div className="w-full h-full relative">
                            {activeMainIndex !== null &&
                                activeSubIndex !== null &&
                                navigationData[activeMainIndex].sublinks[activeSubIndex]?.nestedLinks && (
                                    <div ref={col3Ref} className="p-[2vw] w-full h-fit rounded-md flex flex-col relative">
                                        <div className="absolute top-0 left-[1vw] w-[0.6vw] h-[0.6vw] bg-primary scale-0 opacity-0 pointer-events-none z-10" />
                                        {navigationData[activeMainIndex].sublinks[activeSubIndex].nestedLinks.map((nestedItem, nestedIndex) => (
                                            <div key={nestedIndex} className="opacity-0">
                                                <HoverFillLink
                                                    href={nestedItem.href}
                                                    onClick={() => {
                                                        setSelectedIndex(activeMainIndex);
                                                        setSelectedSubIndex(activeSubIndex);
                                                        setSelectedNestedIndex(nestedIndex);
                                                    }}
                                                    onMouseEnter={() => setActiveNestedIndex(nestedIndex)}
                                                    isActive={
                                                        activeMainIndex === selectedIndex &&
                                                        activeSubIndex === selectedSubIndex &&
                                                        selectedNestedIndex === nestedIndex
                                                    }
                                                    className="text-[2vw] block"
                                                >
                                                    {nestedItem.name}
                                                </HoverFillLink>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* SHOWREEL CONTAINER */}
                    <div className="h-full flex flex-col justify-between w-[30vw]">
                        <div className="space-y-[.5vw]">
                            <div className="aspect-video h-auto w-full overflow-hidden rounded-md">
                                <video
                                    className="h-full w-full object-contain"
                                    autoPlay
                                    loop
                                    muted
                                    src="/showreel.mp4"
                                />
                            </div>
                            <p>Show Reel</p>
                        </div>
                        <div className="flex flex-col pb-[.2vw] gap-[.1vw]">
                            <HoverFillLink href="#" className="text-[1vw]">
                                LABS
                            </HoverFillLink>
                            <HoverFillLink href="#" className="text-[1vw]">
                                VAULT
                            </HoverFillLink>
                        </div>
                    </div>
                </div>

                <header
                    ref={headerRef}
                    className="flex items-center justify-between relative"
                >
                    <span
                        ref={seprationLineRef}
                        className={`w-full h-[2px] absolute top-[-.5vw] left-1/2 -translate-x-1/2  bg-[#1A1A1A] transition-all duration-300 opacity-0`}
                        style={{ display: "block" }}
                    />
                    <div className="w-[8vw] h-auto relative">
                        <Image
                            src="/hyperiux-wordmark.svg"
                            alt="logo"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain brightness-0 invert"
                        />
                    </div>

                    <p className="text-[1vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        Immersion Labs
                    </p>

                    <div
                        onClick={toggleMenu}
                        className="flex cursor-pointer duration-300 transition-all hover:bg-[#2E2A2A] p-[1vw] rounded-md items-center justify-center"
                    >
                        <div className="w-[1.5vw] h-[1vw] relative flex items-center justify-center">
                            <span className={`absolute block w-full h-px bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45" : "-translate-y-[0.3vw]"}`}></span>
                            <span className={`absolute block w-full h-px bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45" : "translate-y-[0.3vw]"}`}></span>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}
