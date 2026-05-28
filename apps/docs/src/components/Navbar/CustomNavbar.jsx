"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CharStaggerLinkBtn from "../Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";

const LINK_Y_OFFSET = 30;
const IMAGE_INITIAL_SCALE = 0.7;
const IMAGE_ANIMATION_START_SCALE = 0.8;
const SOCIAL_Y_OFFSET = 14;
const HEADER_Y_OFFSET = -12;
const LOCATION_Y_OFFSET = 10;
const DELAY_OFFSET = 0.2;
const TAGLINE_DELAY_OFFSET = 0.08;
const IMAGE_DELAY_OFFSET = 0.1;
const SOCIAL_DELAY_OFFSET = 0.2;
const LOCATION_DELAY_OFFSET = 0.25;

export default function CustomNavbar({
  links = [],
  images = ["/assets/img/image01.webp", "/assets/img/image02.webp"],
  agencyName = "Hyperiux®",
  socials = [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedin", href: "#" },
  ],
  location = "Pune, India",
  tagline = "Design. Code. Impact.",
  isOpen = false,
  overlayBg = "#000000",
  delay = 1,
}) {
  // State & refs
  const linksRef = useRef([]);
  const imagesRef = useRef([]);
  const socialsRef = useRef([]);
  const agencyRef = useRef(null);
  const taglineRef = useRef(null);
  const locationRef = useRef(null);

  // Animation helpers
  const killAllTweens = () => {
    gsap.killTweensOf([
      ...linksRef.current,
      ...imagesRef.current,
      ...socialsRef.current,
      agencyRef.current,
      taglineRef.current,
      locationRef.current,
    ]);
  };

  const resetAnimatedElements = () => {
    gsap.set(linksRef.current, { y: LINK_Y_OFFSET, opacity: 0 });
    gsap.set(imagesRef.current, { scale: IMAGE_INITIAL_SCALE, opacity: 0 });
    gsap.set(socialsRef.current, { y: SOCIAL_Y_OFFSET, opacity: 0 });
    gsap.set(agencyRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(taglineRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(locationRef.current, { y: LOCATION_Y_OFFSET, opacity: 0 });
  };

  const setLinkRef = (index) => (element) => {
    linksRef.current[index] = element;
  };

  const setImageRef = (index) => (element) => {
    imagesRef.current[index] = element;
  };

  const setSocialRef = (index) => (element) => {
    socialsRef.current[index] = element;
  };

  // Effects
  useEffect(() => {
    killAllTweens();

    if (!isOpen) {
      return;
    }

    resetAnimatedElements();

    const animationDelay = Math.max(delay - DELAY_OFFSET, 0);

    gsap.fromTo(
      agencyRef.current,
      { y: HEADER_Y_OFFSET, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: animationDelay },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: HEADER_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: animationDelay + TAGLINE_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      linksRef.current,
      { y: LINK_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.07,
        delay: animationDelay,
      },
    );

    gsap.fromTo(
      imagesRef.current,
      { scale: IMAGE_ANIMATION_START_SCALE, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.02,
        delay: animationDelay + IMAGE_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      socialsRef.current,
      { y: SOCIAL_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        delay: animationDelay + SOCIAL_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      locationRef.current,
      { y: LOCATION_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: animationDelay + LOCATION_DELAY_OFFSET,
      },
    );
  }, [delay, isOpen]);

  // Return
  return (
    <div
      style={{ backgroundColor: overlayBg }}
      className="w-full h-screen flex flex-col justify-between px-28 py-10 max-sm:px-6 max-sm:py-6 text-white"
    >
      <div className="flex items-center justify-between">
        <h2
          ref={agencyRef}
          style={{ opacity: 0, transform: `translateY(${HEADER_Y_OFFSET}px)` }}
          className="text-xl tracking-wide font-medium"
        >
          {agencyName}
        </h2>

        <p
          ref={taglineRef}
          style={{ opacity: 0, transform: `translateY(${HEADER_Y_OFFSET}px)` }}
          className="text-sm opacity-60 max-md:hidden"
        >
          {tagline}
        </p>
      </div>

      <div className="flex items-center justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-18 max-sm:gap-30">
        <div className="flex flex-col gap-0">
          {links.map((link, index) => (
            <div
              key={link.label}
              ref={setLinkRef(index)}
              style={{ opacity: 0, transform: `translateY(${LINK_Y_OFFSET}px)` }}
            >
              <CharStaggerLinkBtn
                href={link.href}
                text={link.label}
                hoverColor="#ff6b00"
                className="text-[6vw] max-sm:text-[11vw] max-md:text-[7vw] z-60"
              />
            </div>
          ))}
        </div>

        <div className="flex h-full flex-col items-end justify-center gap-40 py-5 max-md:items-start max-md:gap-28 max-sm:w-full max-sm:gap-35 max-sm:py-0">
          <div className="flex items-end gap-8 max-md:gap-10 max-sm:w-full max-sm:gap-3">
            {images.slice(0, 4).map((src, index) => (
              <div
                key={index}
                ref={setImageRef(index)}
                style={{ opacity: 0, transform: `scale(${IMAGE_INITIAL_SCALE})` }}
                className="relative h-[18vw] w-[25vw] overflow-hidden rounded-xl max-md:h-[25vh] max-md:w-[35vw] max-sm:h-[30vw] max-sm:w-[60vw]"
              >
                <Image
                  src={src}
                  alt={`img-${index}`}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-16 max-md:gap-16 max-sm:gap-10">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                ref={setSocialRef(index)}
                style={{ opacity: 0, transform: `translateY(${SOCIAL_Y_OFFSET}px)` }}
              >
                <Image
                  src={social.src ? social.src : `/assets/social-icons/${social.type}.svg`}
                  alt={social.type}
                  width={24}
                  height={24}
                  className="max-sm:h-5 max-sm:w-5 w-7 h-7 opacity-70 transition hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end max-sm:items-end max-sm:justify-between">
        <p className="hidden text-sm opacity-60 max-sm:block">{tagline}</p>
        <p
          ref={locationRef}
          style={{ opacity: 0, transform: `translateY(${LOCATION_Y_OFFSET}px)` }}
          className="text-sm opacity-60"
        >
          {location}
        </p>
      </div>
    </div>
  );
}
