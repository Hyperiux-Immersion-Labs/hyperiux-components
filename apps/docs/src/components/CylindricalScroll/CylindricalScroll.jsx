"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultItems = [
    { id: 1, title: "Card 01", image: "/img/1.png", backText: "Back 01" },
    { id: 2, title: "Card 02", image: "/img/2.png", backText: "Back 02" },
    { id: 3, title: "Card 03", image: "/img/3.png", backText: "Back 03" },
    { id: 4, title: "Card 04", image: "/img/4.png", backText: "Back 04" },
    { id: 5, title: "Card 05", image: "/img/5.png", backText: "Back 05" },
    { id: 6, title: "Card 06", image: "/img/6.png", backText: "Back 06" },
];

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export default function CylindricalScrollCards({
    items = defaultItems,
    cardWidth = 220,
    cardHeight = 300,
    verticalSpacing = 110,
    snakeAmplitude = 300,
    snakeTightness = 0.95,
    depthAmplitude = 180,
    scrollDistance = 340,
    perspective = 1800,
    scaleMin = 0.74,
    yRotateStrength = 1,
    zRotateStrength = 1,
    maxYRotation = 75,
    maxZRotation = 18,
    className = "",
}) {
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

    cardRefs.current = [];

    const repeatedItems = useMemo(() => {
        return [...items, ...items, ...items];
    }, [items]);

    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    useLayoutEffect(() => {
        if (!sectionRef.current || !cardRefs.current.length) return;

        const ctx = gsap.context(() => {
            const cards = cardRefs.current;
            const baseCount = items.length;
            const totalTravel = baseCount * verticalSpacing;

            const render = (travel) => {
                const isMobile = window.innerWidth < 640;

                const currentSnakeAmplitude = isMobile
                    ? snakeAmplitude * 0.85
                    : snakeAmplitude;

                const currentDepthAmplitude = isMobile
                    ? depthAmplitude * 0.55
                    : depthAmplitude;

                cards.forEach((card, i) => {
                    const localIndex = i - baseCount;
                    const flowY = localIndex * verticalSpacing - travel;

                    const phase = (flowY / verticalSpacing) * snakeTightness;

                    const x = Math.sin(phase) * currentSnakeAmplitude;
                    const z = Math.cos(phase) * currentDepthAmplitude;
                    const y = flowY;

                    const scale = clamp(
                        gsap.utils.mapRange(
                            -currentDepthAmplitude,
                            currentDepthAmplitude,
                            scaleMin,
                            1,
                            z
                        ),
                        scaleMin,
                        1
                    );

                    const dx_dPhase = Math.cos(phase) * currentSnakeAmplitude;
                    const dz_dPhase = -Math.sin(phase) * currentDepthAmplitude;

                    const rotationY = clamp(
                        (-dx_dPhase / Math.max(currentSnakeAmplitude, 1)) *
                            maxYRotation *
                            yRotateStrength,
                        -maxYRotation,
                        maxYRotation
                    );

                    const rotationZ = clamp(
                        (dx_dPhase / Math.max(currentSnakeAmplitude, 1)) *
                            maxZRotation *
                            zRotateStrength,
                        -maxZRotation,
                        maxZRotation
                    );

                    const rotationX = clamp(
                        (dz_dPhase / Math.max(currentDepthAmplitude, 1)) * 8,
                        -8,
                        8
                    );

                    gsap.set(card, {
                        x,
                        y,
                        z,
                        scale,
                        opacity: 1,
                        rotationY,
                        transformPerspective: perspective,
                        transformOrigin: "center center",
                        zIndex: Math.round(1000 + z),
                    });
                });
            };

            render(0);

            const st = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${scrollDistance}%`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    render(self.progress * totalTravel);
                },
            });

            return () => {
                st.kill();
            };
        }, sectionRef);

        return () => ctx.revert();
    }, [
        items,
        repeatedItems,
        verticalSpacing,
        snakeAmplitude,
        snakeTightness,
        depthAmplitude,
        scrollDistance,
        perspective,
        scaleMin,
        yRotateStrength,
        zRotateStrength,
        maxYRotation,
        maxZRotation,
    ]);

    return (
        <section
            ref={sectionRef}
            className={`relative h-screen w-full overflow-hidden bg-[#020202] before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-20 before:h-[14%] before:w-full before:bg-[linear-gradient(to_bottom,#020202_0%,rgba(2,2,2,0)_100%)] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:z-20 after:h-[14%] after:w-full after:bg-[linear-gradient(to_top,#020202_0%,rgba(2,2,2,0)_100%)] max-md:[--card-height:245px] max-md:[--card-width:180px] max-sm:[--card-height:190px] max-sm:[--card-width:140px] ${className}`}
            style={{
                "--card-width": `${cardWidth}px`,
                "--card-height": `${cardHeight}px`,
                "--scene-perspective": `${perspective}px`,
            }}
        >
            <div className="relative h-screen w-full overflow-hidden perspective-(--scene-perspective,1800px) perspective-origin-[center_center]">
                <div className="relative h-full w-full transform-3d">
                    {repeatedItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            ref={addToRefs}
                            className="absolute left-1/2 top-1/2 h-(--card-height,300px) w-(--card-width,220px) opacity-0 will-change-transform ml-[calc(var(--card-width,220px)/-2)] mt-[calc(var(--card-height,300px)/-2)] transform-3d"
                        >
                            <div className="relative h-full w-full transform-3d">
                                <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#f2eee2] shadow-[0_18px_40px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.16)] backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(0deg)_translateZ(1px)]">
                                    <img
                                        src={item.image}
                                        alt={item.title || `Card ${index + 1}`}
                                        className="block h-full w-full object-cover"
                                    />
                                </div>

                                <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.16)] backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(180deg)_translateZ(1px)]">
                                    <img
                                        src={item.image}
                                        alt={`${item.title || `Card ${index + 1}`} back`}
                                        className="block h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
