'use client';

import Image from 'next/image';
import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const SCROLL_PER_PX = 1.0;
const LERP = 0.1;
const VELOCITY_LERP = 0.09;

const CARD_WIDTH = 320;
const CARD_GAP = 24;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_GAP = 16;
const TABLET_CARD_WIDTH = 380;
const TABLET_CARD_GAP = 20;

const ROTATION_SENSITIVITY = 0.025;
const ROTATION_DAMP = 0.1;

const ROTATION_LERP = 0.12;

const getItemData = (item) => (typeof item === 'string' ? { src: item } : item);

const InfiniteScrollSlider = ({ images = [] }) => {
    const stripRef = useRef(null);
    const settersRef = useRef([]);
    const cardRefs = useRef([]);
    const imageRefs = useRef([]);
    const numberRefs = useRef([]);
    const titleRefs = useRef([]);
    const descriptionRefs = useRef([]);
    const [viewportWidth, setViewportWidth] = useState(CARD_WIDTH * 4);

    const isMobileViewport = viewportWidth < MOBILE_BREAKPOINT;
    const isTabletViewport = viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;
    const cardWidth = isMobileViewport ? MOBILE_CARD_WIDTH : isTabletViewport ? TABLET_CARD_WIDTH : CARD_WIDTH;
    const cardGap = isMobileViewport ? MOBILE_CARD_GAP : isTabletViewport ? TABLET_CARD_GAP : CARD_GAP;
    const cardStep = cardWidth + cardGap;
    const cardHeight = isMobileViewport ? 'calc(40vh + 72px)' : isTabletViewport ? 'calc(45vh + 84px)' : 'calc(50vh + 96px)';

    const stateRef = useRef({
        current: 0,
        target: 0,
        raf: null,
        velocity: 0,
        smoothVelocity: 0,

        rotationVelocity: 0,
        currentRotation: 0,
        prevDirection: 0,

        isDragging: false,
        lastX: 0,
    });

    const lerp = (a, b, n) => a + (b - a) * n;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const initSetters = () => {
        if (!stripRef.current) return;

        settersRef.current = Array.from(stripRef.current.children).map((el) => ({
            x: gsap.quickSetter(el, 'x', 'px'),
            rotateY: gsap.quickSetter(el, 'rotateY', 'deg'),
        }));
    };

    const positionCards = useCallback(
        (offset, rotation) => {
            const strip = stripRef.current;
            if (!strip || !images.length) return;

            const cards = strip.children;
            const setters = settersRef.current;

            const count = images.length;
            const loopWidth = count * cardStep;

            const viewW = window.innerWidth;
            const centerX = viewW / 2;
            const centreOffset = centerX - cardWidth / 2;

            for (let i = 0; i < cards.length; i++) {
                let x = i * cardStep - offset + centreOffset;

                x = ((x % loopWidth) + loopWidth) % loopWidth;
                if (x > loopWidth - cardStep) x -= loopWidth;

                setters[i].x(x);
                setters[i].rotateY(rotation);
            }
        },
        [cardStep, cardWidth, images]
    );

    useEffect(() => {
        const updateViewport = () => {
            setViewportWidth(window.innerWidth);
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);

        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    useEffect(() => {
        if (!images.length) return;

        const state = stateRef.current;
        const loopWidth = images.length * cardStep;

        initSetters();

        const tick = () => {
            state.current = lerp(state.current, state.target, LERP);

            state.velocity = state.target - state.current;

            state.smoothVelocity = lerp(
                state.smoothVelocity,
                state.velocity,
                VELOCITY_LERP
            );

            state.rotationVelocity = lerp(
                state.rotationVelocity,
                state.velocity,
                ROTATION_DAMP
            );

            const absVel = Math.abs(state.rotationVelocity);
            const sign = Math.sign(state.rotationVelocity);

            const targetRotation = sign * absVel * ROTATION_SENSITIVITY;

            state.currentRotation = lerp(
                state.currentRotation,
                targetRotation,
                ROTATION_LERP
            );

            const finalRotation = clamp(state.currentRotation, -80, 80);

            if (Math.abs(state.current - state.target) < 0.05) {
                const shift = Math.round(state.current / loopWidth) * loopWidth;
                state.current -= shift;
                state.target -= shift;
            }

            positionCards(state.current, finalRotation);
            state.raf = requestAnimationFrame(tick);
        };

        const onWheel = (e) => {
            const delta = e.deltaY;
            state.target += delta * SCROLL_PER_PX;
        };

        const onDown = (clientX) => {
            state.isDragging = true;
            state.lastX = clientX;
        };

        const onMove = (clientX) => {
            if (!state.isDragging) return;

            const delta = clientX - state.lastX;
            state.lastX = clientX;

            state.target += -delta * SCROLL_PER_PX;
        };

        const onUp = () => {
            state.isDragging = false;
        };

        const handleMouseDown = (e) => onDown(e.clientX);
        const handleMouseMove = (e) => onMove(e.clientX);
        const handleMouseUp = () => onUp();

        const handleTouchStart = (e) => onDown(e.touches[0].clientX);
        const handleTouchMove = (e) => onMove(e.touches[0].clientX);
        const handleTouchEnd = () => onUp();

        const onResize = () => {
            initSetters();
            positionCards(state.current, state.currentRotation);
        };

        state.current = 0;
        state.target = 0;
        state.velocity = 0;
        state.smoothVelocity = 0;
        state.rotationVelocity = 0;
        state.currentRotation = 0;
        state.prevDirection = 0;

        positionCards(0, 0);
        state.raf = requestAnimationFrame(tick);

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('resize', onResize);

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            cancelAnimationFrame(state.raf);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', onResize);

            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [cardStep, images, positionCards]);

    useEffect(() => {
        if (!images.length) return;

        const animations = [];

        cardRefs.current.forEach((card, index) => {
            const image = imageRefs.current[index];
            const number = numberRefs.current[index];
            const title = titleRefs.current[index];
            const description = descriptionRefs.current[index];

            if (!card || !image || !number || !title || !description) return;

            const numberSplit = SplitText.create(number, {
                type: 'lines',
                mask: 'lines',
            });
            const titleSplit = SplitText.create(title, {
                type: 'lines',
                mask: 'lines',
            });
            const descriptionSplit = SplitText.create(description, {
                type: 'lines',
                mask: 'lines',
            });

            const lines = [
                ...numberSplit.lines,
                ...titleSplit.lines,
                ...descriptionSplit.lines,
            ];

            gsap.set([number, title, description], { autoAlpha: 0 });
            gsap.set(lines, { yPercent: 100 });

            const enter = () => {
                gsap.killTweensOf(lines);
                gsap.killTweensOf([number, title, description]);

                gsap
                    .timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
                    .set([number, title, description], { autoAlpha: 1 })
                    .to(
                        numberSplit.lines,
                        {
                            yPercent: 0,
                            duration: 0.55,
                            stagger: 0.06,
                        },
                        0
                    )
                    .to(
                        titleSplit.lines,
                        {
                            yPercent: 0,
                            duration: 0.55,
                            stagger: 0.06,
                        },
                        0.05
                    )
                    .to(
                        descriptionSplit.lines,
                        {
                            yPercent: 0,
                            duration: 0.55,
                            stagger: 0.06,
                        },
                        0.12
                    );
            };

            const leave = () => {
                gsap.killTweensOf(lines);
                gsap.killTweensOf([number, title, description]);

                gsap
                    .timeline({ defaults: { ease: 'power3.in', overwrite: 'auto' } })
                    .to(
                        descriptionSplit.lines,
                        {
                            yPercent: 100,
                            duration: 0.35,
                            stagger: 0.04,
                        },
                        0
                    )
                    .to(
                        titleSplit.lines,
                        {
                            yPercent: 100,
                            duration: 0.35,
                            stagger: 0.04,
                        },
                        0.04
                    )
                    .to(
                        numberSplit.lines,
                        {
                            yPercent: 100,
                            duration: 0.35,
                            stagger: 0.04,
                        },
                        0.08
                    )
                    .set([number, title, description], { autoAlpha: 0 });
            };

            image.addEventListener('mouseenter', enter);
            image.addEventListener('mouseleave', leave);

            animations.push({
                image,
                enter,
                leave,
                numberSplit,
                titleSplit,
                descriptionSplit,
            });
        });

        return () => {
            animations.forEach(
                ({ image, enter, leave, numberSplit, titleSplit, descriptionSplit }) => {
                    image.removeEventListener('mouseenter', enter);
                    image.removeEventListener('mouseleave', leave);
                    numberSplit.revert();
                    titleSplit.revert();
                    descriptionSplit.revert();
                }
            );
        };
    }, [images]);

    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="relative h-full flex items-center overflow-hidden pointer-events-none perspective-[2200px] max-md:items-center max-sm:pt-24 max-md:pt-16">
                <div
                    ref={stripRef}
                    className="relative w-full transform-3d"
                    style={{ height: cardHeight }}
                >
                    {images.map((item, i) => {
                        const { src, number, title, desc, description } = getItemData(item);

                        return (
                            <div
                                key={i}
                                ref={(el) => {
                                    cardRefs.current[i] = el;
                                }}
                                className="absolute top-0 left-0 pointer-events-auto will-change-transform"
                                style={{
                                    width: cardWidth,
                                    height: cardHeight,
                                    transformOrigin: 'center center',
                                    transform: 'translateZ(1px)',
                                }}
                            >
                                <div
                                    ref={(el) => {
                                        numberRefs.current[i] = el;
                                    }}
                                    className="mb-2 text-2xl opacity-0 leading-none tracking-tight text-black max-md:text-xl max-sm:mb-1 max-sm:text-lg"
                                >
                                    {number}
                                </div>
                                <div
                                    ref={(el) => {
                                        imageRefs.current[i] = el;
                                    }}
                                    className="relative h-[50vh] w-full overflow-hidden bg-white max-md:h-[45vh] max-sm:h-[40vh]"
                                >
                                    <Image
                                        src={src}
                                        alt={`slide-${i}`}
                                        fill
                                        sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                                        unoptimized
                                        className="object-cover"
                                        draggable={false}
                                    />
                                </div>
                                <div className="mt-2 space-y-1">
                                    <div
                                        ref={(el) => {
                                            titleRefs.current[i] = el;
                                        }}
                                        className="text-xl opacity-0 uppercase leading-none tracking-[0.04em] text-black max-md:text-lg max-sm:text-base"
                                    >
                                        {title}
                                    </div>
                                    <div
                                        ref={(el) => {
                                            descriptionRefs.current[i] = el;
                                        }}
                                        className="text-sm opacity-0 leading-relaxed text-black/70 max-md:text-xs max-sm:text-xs"
                                    >
                                        {desc || description || ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InfiniteScrollSlider;