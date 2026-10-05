// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  instagram: (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 max-[1025px]:h-8 max-[1025px]:w-8 max-md:h-6 max-md:w-6">
      <path d="M5.87988 0.0556641H15.1201C16.6642 0.0574604 18.1445 0.671867 19.2363 1.76367C20.3281 2.85548 20.9425 4.33584 20.9443 5.87988V15.1201C20.9425 16.6642 20.3281 18.1445 19.2363 19.2363C18.1445 20.3281 16.6642 20.9425 15.1201 20.9443H5.87988C4.33584 20.9425 2.85548 20.3281 1.76367 19.2363C0.671867 18.1445 0.0574604 16.6642 0.0556641 15.1201V5.87988C0.0574603 4.33584 0.671867 2.85548 1.76367 1.76367C2.85548 0.671867 4.33584 0.0574603 5.87988 0.0556641ZM12.4502 5.79199C11.519 5.40629 10.4944 5.30533 9.50586 5.50195C8.51734 5.69858 7.60917 6.1838 6.89648 6.89648C6.1838 7.60917 5.69858 8.51734 5.50195 9.50586C5.30533 10.4944 5.40629 11.519 5.79199 12.4502C6.1777 13.3813 6.83093 14.1774 7.66895 14.7373C8.50694 15.2972 9.49217 15.5957 10.5 15.5957C11.8511 15.5942 13.1462 15.0569 14.1016 14.1016C15.0569 13.1462 15.5942 11.8511 15.5957 10.5C15.5957 9.49217 15.2972 8.50694 14.7373 7.66895C14.1774 6.83093 13.3813 6.1777 12.4502 5.79199ZM10.5 7.19629C11.376 7.19731 12.2156 7.54564 12.835 8.16504C13.4544 8.78444 13.8027 9.62403 13.8037 10.5C13.8037 11.1535 13.6101 11.7926 13.2471 12.3359C12.8841 12.8791 12.3682 13.3027 11.7646 13.5527C11.1609 13.8028 10.4964 13.8677 9.85547 13.7402C9.21456 13.6127 8.62614 13.298 8.16406 12.8359C7.70199 12.3739 7.38725 11.7854 7.25977 11.1445C7.13228 10.5036 7.19719 9.83908 7.44727 9.23535C7.6973 8.63179 8.1209 8.11594 8.66406 7.75293C9.1395 7.43525 9.68836 7.24712 10.2559 7.20508L10.5 7.19629ZM15.7031 3.74902C15.4479 3.79981 15.2133 3.92535 15.0293 4.10938C14.8453 4.29341 14.7197 4.52794 14.6689 4.7832C14.6182 5.03848 14.6445 5.30348 14.7441 5.54395C14.8437 5.78413 15.0124 5.98926 15.2285 6.13379C15.4449 6.27838 15.6997 6.35644 15.96 6.35645C16.309 6.35645 16.6438 6.21747 16.8906 5.9707C17.1374 5.72392 17.2764 5.38905 17.2764 5.04004C17.2764 4.77977 17.1993 4.525 17.0547 4.30859C16.9101 4.09225 16.7042 3.92384 16.4639 3.82422C16.2234 3.72462 15.9584 3.69825 15.7031 3.74902Z" fill="white" stroke="white" strokeWidth="0.111973"/>
    </svg>
  ),
  facebook: (
    <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 max-[1025px]:h-8 max-[1025px]:w-8 max-md:h-6 max-md:w-6">
      <path d="M6.38184 0.385742C7.19227 0.274662 7.98805 0.34229 8.85449 0.37793C9.03979 0.385348 9.22788 0.406595 9.4248 0.431641V2.80859C8.97946 2.81236 8.52504 2.81344 8.07422 2.82324L7.51758 2.8418C7.15961 2.85609 6.84471 2.96157 6.59375 3.16797C6.34339 3.37392 6.18263 3.65902 6.09375 3.9873L6.0918 3.99414C6.05287 4.15011 6.02498 4.32615 6.02441 4.49707C6.01276 5.25508 6.0127 6.0129 6.0127 6.76758C6.0127 6.81651 6.02031 6.86155 6.02539 6.88867C6.0298 6.91218 6.0385 6.95323 6.04199 6.9707L6.09375 7.23242H9.27637C9.16172 8.14171 9.04553 9.02094 8.93066 9.92773H6.02441V18.5254H3.20312V9.91602H0.325195V7.20898H3.20312V6.66309C3.20312 5.94768 3.19164 5.24969 3.20312 4.55664C3.21466 4.10654 3.23786 3.67817 3.32422 3.26758L3.3252 3.2627C3.63481 1.67136 4.77561 0.611071 6.38184 0.385742Z" fill="white" stroke="white" strokeWidth="0.65"/>
    </svg>
  ),
  twitter: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 max-[1025px]:h-8 max-[1025px]:w-8 max-md:h-6 max-md:w-6">
      <path d="M4.64453 0.332031C5.30734 1.29663 5.96769 2.25864 6.62793 3.2207L8.62793 6.13379L8.63574 6.14453C8.64636 6.15869 8.65659 6.17418 8.67773 6.20508C8.6964 6.23236 8.72134 6.26761 8.75098 6.30469L9.00098 6.61719L9.26172 6.31445C9.53339 5.99932 9.80616 5.68366 10.0674 5.37891L10.0664 5.37793C11.5007 3.71546 12.9369 2.05244 14.3613 0.37793L14.3652 0.373047C14.3867 0.346831 14.3985 0.34209 14.4014 0.34082C14.4058 0.338875 14.422 0.332131 14.4658 0.332031C14.6279 0.336411 14.7919 0.335583 14.958 0.334961C13.0974 2.50306 11.2419 4.65276 9.39941 6.80566L9.24414 6.9873L9.36719 7.19238C9.40583 7.25678 9.44481 7.30852 9.47559 7.34961V7.35059C11.5103 10.314 13.5467 13.2887 15.5918 16.2539H11.5674C10.1439 14.2046 8.73002 12.1441 7.31641 10.083C7.29438 10.0506 7.27083 10.0222 7.25781 10.0068C7.24095 9.98691 7.23091 9.97519 7.22168 9.96289L6.99219 9.65723L6.72168 9.92773C6.66017 9.98925 6.61092 10.0497 6.57422 10.0977C5.4223 11.4343 4.26966 12.7719 3.12793 14.1094C2.80736 14.4843 2.48353 14.8625 2.16016 15.2402C1.86982 15.5794 1.57946 15.9186 1.29102 16.2559C1.10207 16.2593 0.914651 16.2616 0.728516 16.2627L1.41504 15.4551C2.25748 14.4768 3.10014 13.4955 3.94238 12.5146C4.78466 11.5338 5.62667 10.5531 6.46875 9.5752L6.47656 9.56641L6.4834 9.55762C6.51689 9.51297 6.5361 9.48735 6.56055 9.46289L6.75586 9.26758L6.59961 9.04004C4.60695 6.14349 2.62417 3.24745 0.623047 0.332031H4.64453ZM1.66895 1.26074C1.68565 1.28582 1.69884 1.30659 1.71094 1.32715C1.72076 1.34385 1.7383 1.375 1.75586 1.40137L1.76074 1.4082C5.07549 6.14667 8.37933 10.8851 11.6943 15.6348V15.6338C11.7435 15.7088 11.8112 15.7817 11.9082 15.832C12.008 15.8837 12.1093 15.8965 12.1953 15.8965H14.0869C14.1314 15.8964 14.1754 15.8914 14.1914 15.8896C14.2124 15.8873 14.2247 15.8858 14.2383 15.8857H14.8838L14.5088 15.3604C14.4852 15.3273 14.4662 15.2989 14.4473 15.2705L14.3848 15.1807C11.9629 11.7054 9.53084 8.22952 7.10938 4.76562H7.1084C6.67392 4.14649 6.23943 3.52457 5.80469 2.90234C5.36995 2.28013 4.935 1.65698 4.5 1.03711L4.49414 1.0293L4.4873 1.02051C4.45603 0.981434 4.41014 0.931071 4.35645 0.886719C4.32957 0.864523 4.294 0.837687 4.25098 0.81543C4.21224 0.795422 4.14624 0.76758 4.06348 0.765625H4.06445C3.36281 0.743701 2.67262 0.744141 1.94531 0.744141H1.3252L1.66895 1.26074Z" fill="white" stroke="white" strokeWidth="0.664388"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 max-[1025px]:h-8 max-[1025px]:w-8 max-md:h-6 max-md:w-6">
      <path d="M12.523 5.83716C13.2256 5.77425 13.9204 5.82636 14.5894 6.03149V6.03247C15.6435 6.37056 16.2928 7.09389 16.5748 8.14771V8.14868C16.7248 8.7272 16.773 9.31063 16.8785 9.95532L16.8795 9.96118C16.8975 10.0606 16.9079 10.1631 16.9185 10.2893V16.8831H14.022C14.0223 15.4836 14.0282 14.0864 14.022 12.6858L14.0113 11.2571C14.011 10.886 13.971 10.5122 13.9078 10.1506L13.8375 9.79224C13.761 9.43645 13.613 9.1113 13.3736 8.85083C13.1317 8.58774 12.8116 8.40827 12.4224 8.32251L12.4185 8.32153L12.19 8.28345C12.037 8.26427 11.8831 8.25731 11.73 8.26001L11.5015 8.27075C10.9986 8.30831 10.5548 8.464 10.2047 8.7561C9.85316 9.0494 9.6227 9.45819 9.50934 9.95532V9.95728C9.39316 10.4801 9.33481 11.0356 9.33453 11.5676C9.31371 13.3584 9.3217 15.1407 9.32281 16.926C8.37363 16.9188 7.41182 16.9163 6.44977 16.9163V6.10474H9.19098V8.24146L9.79938 7.52075C10.0645 7.20739 10.2456 6.95483 10.483 6.72778C10.9801 6.25729 11.5695 5.98333 12.2339 5.87427L12.523 5.83716Z" fill="white" stroke="white" strokeWidth="0.690916"/>
      <path d="M3.5175 6.104V16.9155H0.632736V6.104H3.5175Z" fill="white" stroke="white" strokeWidth="0.690916"/>
      <path d="M2.10547 0.345703C3.06224 0.373859 3.81413 1.15251 3.7959 2.08594C3.77729 3.07221 2.97987 3.83413 2.02539 3.80664H2.02246C1.10984 3.78839 0.327236 2.97556 0.345703 2.0332C0.364056 1.0972 1.16655 0.328815 2.10547 0.345703Z" fill="white" stroke="white" strokeWidth="0.690916"/>
    </svg>
  ),
};

const DEFAULT_LINK_Y_OFFSET = 30;
const DEFAULT_LINK_DURATION = 0.8;
const DEFAULT_LINK_STAGGER = 0.07;
const DEFAULT_IMAGE_START_SCALE = 0.8;
const DEFAULT_IMAGE_DURATION = 0.9;
const DEFAULT_IMAGE_STAGGER = 0.02;
const DEFAULT_SOCIAL_Y_OFFSET = 14;
const DEFAULT_SOCIAL_DURATION = 0.5;
const DEFAULT_SOCIAL_STAGGER = 0.06;

const IMAGE_INITIAL_SCALE = 0.7;
const HEADER_Y_OFFSET = -12;
const LOCATION_Y_OFFSET = 10;
const DELAY_OFFSET = 0.2;
const TAGLINE_DELAY_OFFSET = 0.08;
const IMAGE_DELAY_OFFSET = 0.1;
const SOCIAL_DELAY_OFFSET = 0.2;
const LOCATION_DELAY_OFFSET = 0.25;

const ANIM_CHAR_LIFT = "1.3em";
const ANIM_CHAR_STEP = 0.01;
const ANIM_GLIDE = "cubic-bezier(0.625, 0.05, 0, 1)";

interface LinkAnimProps {
  label: string;
  href: string;
  className?: string;
  restColor?: string;
  activeColor?: string;
  underline?: boolean;
  tabIndex?: number;
  onClick?: () => void;
}


function LinkAnim({
  label,
  href,
  className = "",
  restColor,
  activeColor,
  underline = true,
  tabIndex,
  onClick,
}: LinkAnimProps) {
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const isTouchRef = useRef(false);
  const hasEnteredRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;

    const syncReduced = () => setIsReduced(query.matches);

    syncReduced();
    query.addEventListener("change", syncReduced);

    return () => query.removeEventListener("change", syncReduced);
  }, []);

  // Retracts the underline back toward the side it came from, so the rule
  // never looks like it is sliding out from under the cursor.
  useEffect(() => {
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      return;
    }

    const rule = ruleRef.current;
    if (!rule || isActive || isReduced) return;

    rule.style.transformOrigin = "right center";

    const onSettled = () => {
      rule.style.transformOrigin = "left center";
      rule.removeEventListener("transitionend", onSettled);
    };

    rule.addEventListener("transitionend", onSettled);
    return () => rule.removeEventListener("transitionend", onSettled);
  }, [isActive, isReduced]);

  const chars = [...label];

  return (
    <Link
      prefetch={false}
      href={href}
      tabIndex={tabIndex}
      onClick={onClick}
      onMouseEnter={() => {
        if (isTouchRef.current) return;
        setIsActive(true);
      }}
      onMouseLeave={() => {
        if (isTouchRef.current) return;
        setIsActive(false);
      }}
      onTouchStart={() => {
        isTouchRef.current = true;
      }}
      style={{ color: isActive ? activeColor : restColor }}
      className={`inline-flex items-center no-underline transition-colors duration-500 motion-reduce:transition-none ${className}`.trim()}
    >
      <span className="relative inline-block w-fit">
        <span
          aria-label={label}
          className="relative inline-block overflow-hidden leading-[1.2]"
        >
          {chars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              aria-hidden="true"
              className="relative inline-block will-change-transform motion-reduce:transition-none"
              style={{
                // The shadow copy sits one lift below, so raising the span
                // swaps it in without a second set of DOM nodes.
                textShadow: `0px ${ANIM_CHAR_LIFT} currentColor`,
                transform: isActive && !isReduced
                  ? `translateY(-${ANIM_CHAR_LIFT}) rotate(0.001deg)`
                  : "translateY(0em) rotate(0.001deg)",
                transition: isReduced ? "none" : `transform 0.6s ${ANIM_GLIDE}`,
                transitionDelay: isReduced ? "0s" : `${index * ANIM_CHAR_STEP}s`,
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </span>

        {underline && (
          <span
            ref={ruleRef}
            aria-hidden="true"
            className="absolute bottom-[15%] left-0 h-[1.5px] w-full bg-current"
            style={{
              transform: `scaleX(${isActive && !isReduced ? 1 : 0})`,
              transformOrigin: "left center",
              transition: isReduced ? "none" : `transform 0.5s ${ANIM_GLIDE}`,
            }}
          />
        )}
      </span>
    </Link>
  );
}

export interface CustomNavbarLink {
  label: string;
  href: string;
}

export interface CustomNavbarSocial {
  type: string;
  href: string;
}

export interface CustomNavbarProps {
  links?: CustomNavbarLink[];
  images?: string[];
  agencyName?: string;
  socials?: CustomNavbarSocial[];
  location?: string;
  tagline?: string;
  isOpen?: boolean;
  overlayBg?: string;
  delay?: number;
  linkOffsetY?: number;
  linkDuration?: number;
  linkStagger?: number;
  linkColor?: string;
  linkHoverColor?: string;
  imageStartScale?: number;
  imageDuration?: number;
  imageStagger?: number;
  socialOffsetY?: number;
  socialDuration?: number;
  socialStagger?: number;
}

function CustomNavbar({
  links = [],
  images = ["https://picsum.photos/seed/h05/1600/1200", "https://picsum.photos/seed/h07/1600/1200"],
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
  linkOffsetY = DEFAULT_LINK_Y_OFFSET,
  linkDuration = DEFAULT_LINK_DURATION,
  linkStagger = DEFAULT_LINK_STAGGER,
  linkColor,
  linkHoverColor,
  imageStartScale = DEFAULT_IMAGE_START_SCALE,
  imageDuration = DEFAULT_IMAGE_DURATION,
  imageStagger = DEFAULT_IMAGE_STAGGER,
  socialOffsetY = DEFAULT_SOCIAL_Y_OFFSET,
  socialDuration = DEFAULT_SOCIAL_DURATION,
  socialStagger = DEFAULT_SOCIAL_STAGGER,
}: CustomNavbarProps) {
  // State & refs
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const socialsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const agencyRef = useRef<HTMLElement | null>(null);
  const taglineRef = useRef<HTMLElement | null>(null);
  const locationRef = useRef<HTMLElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

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

  const resetAnimatedElements = useCallback(() => {
    gsap.set(linksRef.current, { y: linkOffsetY, opacity: 0 });
    gsap.set(imagesRef.current, { scale: IMAGE_INITIAL_SCALE, opacity: 0 });
    gsap.set(socialsRef.current, { y: socialOffsetY, opacity: 0 });
    gsap.set(agencyRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(taglineRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(locationRef.current, { y: LOCATION_Y_OFFSET, opacity: 0 });
  }, [linkOffsetY, socialOffsetY]);

  const setLinkRef = (index: number) => (element: HTMLDivElement | null) => {
    linksRef.current[index] = element;
  };

  const setImageRef = (index: number) => (element: HTMLDivElement | null) => {
    imagesRef.current[index] = element;
  };

  const setSocialRef = (index: number) => (element: HTMLAnchorElement | null) => {
    socialsRef.current[index] = element;
  };

  // Effects
  useEffect(() => {
    killAllTweens();

    if (!isOpen) {
      return;
    }

    resetAnimatedElements();

    if (reduceMotion()) {
      gsap.set(agencyRef.current, { y: 0, opacity: 1 });
      gsap.set(taglineRef.current, { y: 0, opacity: 1 });
      gsap.set(linksRef.current, { y: 0, opacity: 1 });
      gsap.set(imagesRef.current, { scale: 1, opacity: 1 });
      gsap.set(socialsRef.current, { y: 0, opacity: 1 });
      gsap.set(locationRef.current, { y: 0, opacity: 1 });
      return;
    }

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
      { y: linkOffsetY, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: linkDuration,
        ease: "power2.out",
        stagger: linkStagger,
        delay: animationDelay,
      },
    );

    gsap.fromTo(
      imagesRef.current,
      { scale: imageStartScale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: imageDuration,
        ease: "power3.out",
        stagger: imageStagger,
        delay: animationDelay + IMAGE_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      socialsRef.current,
      { y: socialOffsetY, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: socialDuration,
        ease: "power2.out",
        stagger: socialStagger,
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
  }, [
    delay,
    isOpen,
    linkOffsetY,
    linkDuration,
    linkStagger,
    imageStartScale,
    imageDuration,
    imageStagger,
    socialOffsetY,
    socialDuration,
    socialStagger,
    resetAnimatedElements,
  ]);

  return (
    <div
      style={{ backgroundColor: overlayBg }}
      className="w-full h-screen flex flex-col justify-between px-28 max-md:px-6 py-10 pt-28 max-[1025px]:pt-36 max-md:pt-30 max-[1025px]:px-6 max-[1025px]:py-10 text-white"
    >

      <div className="flex items-center justify-between gap-10 max-[1025px]:flex-col max-[1025px]:items-start max-[1025px]:gap-18 max-md:gap-10">
        <div className="flex flex-col gap-0">
          {links.map((link, index) => (
            <div
              key={link.label}
              ref={setLinkRef(index)}
              className="text-[6vw] max-sm:text-[11vw] max-md:text-[7vw] z-60"
              style={{ opacity: 0, transform: `translateY(${linkOffsetY}px)` }}
            >

              <LinkAnim
                label={link.label}
                href={link.href}
                restColor={linkColor}
                activeColor={linkHoverColor}
              />
            </div>
          ))}
        </div>

        <div className="flex h-full flex-col items-end justify-center gap-40 py-5 max-[1025px]:items-start max-[1025px]:gap-28 max-md:w-full max-md:gap-25 max-md:py-0">
          <div className="flex items-end gap-8 max-[1025px]:gap-10 max-md:w-full max-md:gap-3 max-md:flex-col max-[1025px]:items-start">
            {images.slice(0, 4).map((src, index) => (
              <div
                key={index}
                ref={setImageRef(index)}
                style={{ opacity: 0, transform: `scale(${IMAGE_INITIAL_SCALE})` }}
                className="relative h-[18vw] w-[25vw] overflow-hidden rounded-xl max-[1025px]:h-[25vh] max-[1025px]:w-[35vw] max-md:h-[30vw] max-md:w-[60vw] max-md:rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`img-${index}`}
                  className="object-cover transition duration-500 hover:scale-105 motion-reduce:scale-100 motion-reduce:hover:scale-100 motion-reduce:transition-none absolute inset-0 w-full h-full"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="flex gap-10 items-end justify-end max-[1025px]:justify-start max-[1025px]:pb-10 max-md:pt-5">
        {socials.map((social, index) => (
          <Link
            key={index}
            href={social.href}
            ref={setSocialRef(index)}
            style={{ opacity: 0, transform: `translateY(${socialOffsetY}px)` }}
          >
            {SOCIAL_ICONS[social.type]}
          </Link>
        ))}
      </div>
    </div>
  );
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const isVisible = (element?: HTMLElement | null): boolean => {
  if (!element || element.hidden) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.visibility === "hidden" || style.visibility === "collapse") {
    return false;
  }

  return element.getClientRects().length > 0;
};

const getFocusableElements = (container?: HTMLElement | null): HTMLElement[] => {
  if (!container) {
    return [];
  }

  return (
    Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[]
  ).filter(isVisible);
};

interface UseFocusTrapParams {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

/**
 * Keeps keyboard focus inside `containerRef` while `active` is true.
 *
 * - Captures the element focused before opening and restores focus to it on
 *   close (so the trigger button gets focus back).
 * - Moves focus into the menu on open (to `initialFocusRef` when provided,
 *   otherwise the first focusable element).
 * - Wraps Tab / Shift+Tab around the menu's focusable elements.
 * - Calls `onEscape` when the Escape key is pressed.
 */
export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: UseFocusTrapParams) {
  const onEscapeRef = useRef(onEscape);
  useLayoutEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusInitial = () => {
      const target =
        initialFocusRef?.current ??
        getFocusableElements(container)[0] ??
        container;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target === container && !container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }

      target.focus();
    };

    // Defer focus so it lands after the menu has mounted / started animating in.
    const focusFrame = requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(container);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !container.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (activeElement === last || !container.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
}

const CLIPS = {
  bottom: {
    closedInitial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  },
  top: {
    closedInitial: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  },
  left: {
    closedInitial: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  },
  right: {
    closedInitial: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  },
};

const REDUCED_MOTION_FADE_DURATION = 0.2;

export interface FullscreenNavLink {
  label: string;
  href: string;
}

export interface FullscreenNavProps {
  links?: FullscreenNavLink[];
  brand?: string;
  brandHref?: string;
  clipOrigin?: keyof typeof CLIPS;
  overlayBg?: string;
  linkColor?: string;
  linkHoverColor?: string;
  linkSizeClass?: string;
  headerClassName?: string;
  openDuration?: number;
  closeDuration?: number;
  ease?: string;
  headerOpenColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
  children?: (isOpen: boolean) => ReactNode;
}

function FullscreenNav({
  links,
  brand = "Hyperiux",
  brandHref = "/",
  clipOrigin = "bottom",
  overlayBg = "#000000",
  linkColor = "#ffffff",
  linkHoverColor = "#a3a3a3",
  linkSizeClass = "text-5xl",
  headerClassName = "",
  openDuration = 1.2,
  closeDuration = 1.2,
  ease = "power4.inOut",
  headerOpenColor = "#ffffff",
  onOpen,
  onClose,
  children,
}: FullscreenNavProps) {
  // State & refs
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLElement | null>(null);
  const linksWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  // Derived values
  const { closedInitial, open: openClipPath, closedFinal } =
    CLIPS[clipOrigin] ?? CLIPS.bottom;
  const isReducedMotion = reduceMotion();

  const onOpenMenu = () => {
    setIsOpen(true);
    timelineRef.current?.kill();

    gsap.set(overlayRef.current, { clipPath: closedInitial });
    gsap.set(linksWrapperRef.current, { opacity: 1, scale: 1 });

    if (isReducedMotion) {
      gsap.set(overlayRef.current, {
        clipPath: openClipPath,
        autoAlpha: 0,
      });

      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power2.out",
        onStart: () => {
          isAnimatingRef.current = true;
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          onOpen?.();
        },
      });
      return;
    }

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        onOpen?.();
      },
    });

    timelineRef.current = timeline;

    timeline.to(overlayRef.current, {
      clipPath: openClipPath,
      duration: openDuration,
      delay: 0.2,
      ease,
    });
  };

  const onCloseMenu = () => {
    setIsOpen(false);
    timelineRef.current?.kill();

    if (isReducedMotion) {
      gsap.set(linksWrapperRef.current, {
        scale: 1,
        opacity: 1,
      });

      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power2.out",
        onStart: () => {
          isAnimatingRef.current = true;
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          gsap.set(overlayRef.current, {
            clipPath: closedFinal,
          });
          onClose?.();
        },
      });

      gsap.set(overlayRef.current, {
        clipPath: closedFinal,
      });
      return;
    }

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsOpen(false);
        onClose?.();
      },
    });

    timelineRef.current = timeline;

    timeline
      .to(linksWrapperRef.current, {
        scale: 0.9,
        opacity: 0.5,
        duration: 0.7,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          clipPath: closedFinal,
          duration: closeDuration,
          ease,
        },
        "<",
      );
  };

  const onToggleMenu = () => {
    if (isAnimatingRef.current) {
      return;
    }

    if (isOpen) {
      onCloseMenu();
      return;
    }

    onOpenMenu();
  };

  // Effects
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useFocusTrap({
    active: isOpen,
    containerRef: rootRef,
    initialFocusRef: toggleButtonRef,
    onEscape: onCloseMenu,
  });

  // Return
  return (
    <div ref={rootRef}>
      <header
        className={`fixed top-6 max-md:top-6 left-0 right-0 z-70 flex h-20 items-center justify-between px-8 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          <Link prefetch={false} href="/" className="flex items-center gap-3 cursor-pointer">
          <svg width="30" height="30" viewBox="0 0 58 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={` ${isReducedMotion ? "transition-none" : "transition-all duration-300 delay-700"} ${isOpen ? "brightness-100" : "brightness-0"}`}>
            <path d="M0 0H9.02977V28.5943H0V0Z" fill="#ffffff"/>
            <path d="M57.1895 64.7134H48.1597V36.1192H57.1895V64.7134Z" fill="#ffffff"/>
            <path d="M0.0195312 36.1192V64.7135H9.0493V42.139L21.5405 37.4737V28.7449L0.0195312 36.1192Z" fill="#ffffff"/>
            <path d="M48.1777 22.5746V0.00012207H57.3579V28.5944L34.332 37.8697V28.5944L48.1777 22.5746Z" fill="#ffffff"/>
            <path d="M21.9912 29.0459L28.4868 26.8346C28.8573 26.7085 29.2624 26.7316 29.6161 26.8992L34.7834 29.3469M21.9912 29.0459L28.1616 32.2063M21.9912 29.0459V37.1727L28.1616 40.0321M34.7834 29.3469L28.1616 32.2063M34.7834 29.3469C34.7834 32.3443 34.7834 34.1753 34.7834 37.1727L28.1616 40.0321M28.1616 32.2063V40.0321" stroke="#ffffff" strokeWidth="0.902977"/>
          </svg>

          <div className="flex  items-center gap-2">
            <svg width="156" height="45" viewBox="0 0 351 43" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isReducedMotion ? "transition-none" : "transition-all duration-300 delay-700"} ${isOpen ? "brightness-100" : "brightness-0"}`}>
              <path d="M315.441 6.10352e-05H306.862L320.055 15.9603L324.019 21.0695L306.862 42.139H315.591L332.597 21.0695L328.555 15.9603L315.441 6.10352e-05Z" fill="white"/>
              <path d="M350.055 6.10352e-05H341.326L332.598 10.6853L336.962 15.9527L350.055 6.10352e-05Z" fill="white"/>
              <path d="M349.905 42.139L341.176 42.139L332.598 31.7548L336.962 26.3369L349.905 42.139Z" fill="white"/>
              <path d="M264.874 6.10352e-05H258.252V34.0122L269.088 42.139H289.555L300.391 34.0122V6.10352e-05H293.769V29.9349C293.769 30.4164 293.539 30.8688 293.149 31.152L287.543 35.2293C287.286 35.4164 286.976 35.5172 286.658 35.5172H271.985C271.667 35.5172 271.357 35.4164 271.1 35.2293L265.494 31.152C265.104 30.8688 264.874 30.4164 264.874 29.9349V6.10352e-05Z" fill="white"/>
              <rect x="244.406" y="6.10352e-05" width="6.62183" height="42.1389" fill="white"/>
              <path d="M195.043 0.000183105H228.002V6.62202H201.665V42.2896H195.043V0.000183105Z" fill="white"/>
              <path d="M233.269 24.0796L237.182 18.1404V6.62202V0.000183105H195.043V6.62202H230.56V15.8023L225.594 24.0796H233.269Z" fill="white"/>
              <path d="M221.078 17.7586H201.664V24.3804H217.466L229.205 42.139H237.163L221.078 17.7586Z" fill="white"/>
              <path d="M182.401 24.3804V17.7585H162.235L153.205 27.9923H162.084L165.245 24.3804H182.401Z" fill="white"/>
              <path d="M158.322 0H188.421V6.62183H161.031L152.904 15.9526V35.5171H188.421V42.1389H146.282V12.0397L158.322 0Z" fill="white"/>
              <rect x="97.5234" y="17.7585" width="6.62183" height="24.3804" fill="white"/>
              <path d="M139.662 0H97.5234V6.62183H133.041V17.7586H111.15L104.534 24.3804H133.643L139.662 18.0595V0Z" fill="white"/>
              <path d="M55.3826 10.8357L55.3826 0H48.7607L48.7607 14.8991L66.5754 24.2299L66.5193 42.1389H73.1411V24.2299L90.8997 14.7486V0H84.2779V10.8357L69.8302 18.4786L55.3826 10.8357Z" fill="white"/>
              <rect width="6.62183" height="42.1389" fill="white"/>
              <rect x="35.5166" width="6.62183" height="42.1389" fill="white"/>
              <rect x="6.62305" y="17.7585" width="28.8953" height="6.62183" fill="white"/>
            </svg>
          </div>
          </Link>
        </div>

        <button
          ref={toggleButtonRef}
          onClick={onToggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 max-[1025px]:size-14 max-md:size-10"
        >
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-0.5 w-full max-md:w-[70%] ${isReducedMotion ? "transition-none" : "transition-all duration-700 ease-in-out delay-300"} ${isOpen
              ? "translate-y-1.75 rotate-45"
              : isReducedMotion
                ? "translate-y-0 rotate-0 bg-black"
                : "bg-black"
              }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-0.5 w-full max-md:w-[70%] ${isReducedMotion ? "transition-none" : "transition-all duration-500 delay-300"} ${isOpen
              ? "scale-x-0 opacity-0"
              : isReducedMotion
                ? "scale-x-100 opacity-100 bg-black"
                : "bg-black"
              }`}
          />
          <span
            style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
            className={`block h-0.5 w-full max-md:w-[70%] ${isReducedMotion ? "transition-none" : "transition-all duration-700 ease-in-out delay-300"} ${isOpen
              ? "-translate-y-2.25 -rotate-45"
              : isReducedMotion
                ? "translate-y-0 rotate-0 bg-black"
                : "bg-black"
              }`}
          />
        </button>
      </header>

      <nav
        ref={overlayRef}
        style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
        className={`fixed inset-0 z-60 flex flex-col items-center justify-center gap-2 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!isOpen}
        role="navigation"
      >
        <div
          ref={linksWrapperRef}
          className="flex h-screen w-screen flex-col items-center justify-center motion-reduce:opacity-100"
        >
          {children
            ? children(isOpen)
            : (links as FullscreenNavLink[]).map(({ label, href }) => (
              <LinkAnim
                key={label}
                label={label}
                href={href}
                onClick={isOpen ? onCloseMenu : undefined}
                tabIndex={isOpen ? 0 : -1}
                restColor={linkColor}
                activeColor={linkHoverColor}
                className={`${linkSizeClass} font-normal tracking-tight`}
              />
            ))}
        </div>
      </nav>
    </div>
  );
}

const NAV_CONFIG: Partial<FullscreenNavProps> = {
  brand: "Hyperiux",
  brandHref: "/",
  clipOrigin: "bottom",
  overlayBg: "#ff5f00",
  headerOpenColor: "#ffffff",
  linkColor: "#ffffff",
  linkHoverColor: "#a3a3a3",
  openDuration: 1.2,
  closeDuration: 1.2,
};

const NAV_CONTENT: Partial<CustomNavbarProps> = {
  agencyName: "",
  tagline: "Crafting digital experiences.",
  location: "Noida, India",
  links: [
    { label: "Home", href: "#" },
    { label: "Work", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  images: ["https://picsum.photos/seed/h05/1600/1200", "https://picsum.photos/seed/h07/1600/1200"],
  socials: [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedin", href: "#" },
  ],
};

export interface ImmersiveFullscreenNavProps {
  navConfig?: Partial<FullscreenNavProps>;
  navContent?: Partial<CustomNavbarProps>;
  overlayBg?: string;
  headerOpenColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  ease?: string;
  clipOrigin?: "top" | "bottom" | "left" | "right";
  openDuration?: number;
  closeDuration?: number;
  linkDuration?: number;
  linkStagger?: number;
  linkOffsetY?: number;
  imageDuration?: number;
  imageStagger?: number;
  imageStartScale?: number;
  socialDuration?: number;
  socialStagger?: number;
  socialOffsetY?: number;
}

export default function ImmersiveFullscreenNav({
  navConfig,
  navContent,
  ...props
}: ImmersiveFullscreenNavProps) {
  const {
    overlayBg,
    headerOpenColor,
    linkColor,
    linkHoverColor,
    ease,
    clipOrigin,
    openDuration,
    closeDuration,
    linkDuration,
    linkStagger,
    linkOffsetY,
    imageDuration,
    imageStagger,
    imageStartScale,
    socialDuration,
    socialStagger,
    socialOffsetY,
  } = props;
  const config = {
    ...NAV_CONFIG,
    ...navConfig,
    ...(overlayBg !== undefined ? { overlayBg } : {}),
    ...(headerOpenColor !== undefined ? { headerOpenColor } : {}),
    ...(linkColor !== undefined ? { linkColor } : {}),
    ...(linkHoverColor !== undefined ? { linkHoverColor } : {}),
    ...(ease !== undefined ? { ease } : {}),
    ...(clipOrigin !== undefined ? { clipOrigin } : {}),
    ...(openDuration !== undefined ? { openDuration } : {}),
    ...(closeDuration !== undefined ? { closeDuration } : {}),
  };
  const content = {
    ...NAV_CONTENT,
    ...navContent,
    ...(linkDuration !== undefined ? { linkDuration } : {}),
    ...(linkStagger !== undefined ? { linkStagger } : {}),
    ...(linkOffsetY !== undefined ? { linkOffsetY } : {}),
    ...(imageDuration !== undefined ? { imageDuration } : {}),
    ...(imageStagger !== undefined ? { imageStagger } : {}),
    ...(imageStartScale !== undefined ? { imageStartScale } : {}),
    ...(socialDuration !== undefined ? { socialDuration } : {}),
    ...(socialStagger !== undefined ? { socialStagger } : {}),
    ...(socialOffsetY !== undefined ? { socialOffsetY } : {}),
  };

  return (
    <>
      <FullscreenNav {...config}>
        {(isOpen) => (
          <CustomNavbar
            {...content}
            isOpen={isOpen}
            overlayBg={config.overlayBg}
            linkColor={config.linkColor}
            linkHoverColor={config.linkHoverColor}
            delay={config.openDuration}
          />
        )}
      </FullscreenNav>

    </>
  );
}
