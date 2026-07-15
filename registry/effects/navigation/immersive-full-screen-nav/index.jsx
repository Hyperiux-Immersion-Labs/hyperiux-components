"use client"
import Link from "next/link";
import CustomNavbar from "./CustomNavbar";
import FullscreenNav from "./FullscreenNav";


const NAV_CONFIG = {
  brand: "Hyperiux",
  brandHref: "/",
  clipOrigin: "bottom",
  overlayBg: "#ff5f00",
  headerOpenColor: "#ffffff",
  openDuration: 1.2,
  closeDuration: 1.2,
};

const NAV_CONTENT = {
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

export default function ImmersiveFullscreenNav({
  navConfig = NAV_CONFIG,
  navContent = NAV_CONTENT,
}) {
  return (
    <>
      <FullscreenNav {...navConfig}>
        {(isOpen) => (
          <CustomNavbar
            {...navContent}
            isOpen={isOpen}
            overlayBg={navConfig.overlayBg}
            delay={navConfig.openDuration}
          />
        )}
      </FullscreenNav>

      <main className="flex h-screen items-center justify-center bg-white max-sm:px-[7vw] text-center">
        <div className="max-w-5xl mx-auto text-center text-black">



          {/* Heading */}
          <h1 className="text-[7vw] max-sm:text-[9vw]">
            Immersive Full Screen Navigation
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-[1.4vw] max-sm:text-[4.5vw] max-md:text-[3vw]">
            Click on the hamburger to open the navigation
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-sm:text-[4.5vw] max-md:text-[3vw]">
            <button className=" rounded-full max-sm:min-w-[45vw] bg-black text-white font-medium ">
              <Link href={"/effects/navigation/immersive-full-screen-nav"} className="px-7 py-3 block w-full">
              Read Article
              </Link>
            </button>

            <button className=" rounded-full max-sm:min-w-[45vw] border border-black ">
             <Link href={"/effects"} className="px-7 py-3 block w-full">
              Explore Platform
             </Link>
            </button>
          </div>

          
        </div>
      </main>
    </>
  );
}