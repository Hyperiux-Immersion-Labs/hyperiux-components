// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client"

import CustomNavbar, { type CustomNavbarProps } from "./CustomNavbar";
import FullscreenNav, { type FullscreenNavProps } from "./FullscreenNav";


const NAV_CONFIG: Partial<FullscreenNavProps> = {
  brand: "Hyperiux",
  brandHref: "/",
  clipOrigin: "bottom",
  overlayBg: "#ff5f00",
  headerOpenColor: "#ffffff",
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
  images: ["https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg", "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-07.jpg"],
  socials: [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedIn", href: "#" },
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
  navConfig = NAV_CONFIG,
  navContent = NAV_CONTENT,
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
            delay={config.openDuration}
          />
        )}
      </FullscreenNav>

      <main className="flex h-screen items-center justify-center bg-white max-md:px-[7vw] text-center">
        <div className="max-w-5xl mx-auto text-center text-black">



          {/* Heading */}
          <h1 className="text-[7vw] max-md:text-[9vw]">
            Immersive Full Screen Navigation
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-[1.4vw] max-md:text-[4.5vw] max-[1025px]:text-[3vw]">
            Click on the hamburger to open the navigation
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-md:text-[4.5vw] max-[1025px]:text-[3vw]">
            <button className=" rounded-full max-md:min-w-[45vw] bg-black text-white font-medium ">
              <a href={"/effects/navigation/immersive-full-screen-nav"} className="px-7 py-3 block w-full">
              Read Article
              </a>
            </button>

            <button className=" rounded-full max-md:min-w-[45vw] border border-black ">
             <a href={"/effects"} className="px-7 py-3 block w-full">
              Explore Platform
             </a>
            </button>
          </div>


        </div>
      </main>
    </>
  );
}
