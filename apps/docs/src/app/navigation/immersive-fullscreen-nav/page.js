import ImmersiveFullscreenNavClient from "./ImmersiveFullscreenNavClient";

const NAV_CONFIG = {
  brand: "Hyperiux",
  brandHref: "/",
  clipOrigin: "bottom",
  overlayBg: "#1a1a2e",
  headerOpenColor: "#ff6600",
  openDuration: 1.2,
  closeDuration: 1.2,
};

const NAV_CONTENT = {
  agencyName: "",
  tagline: "Crafting digital experiences.",
  location: "Noida, India",
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  images: ["/assets/img/image01.webp", "/assets/img/image02.webp"],
  socials: [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedIn", href: "#" },
  ],
};

export default function Page() {
  return (
    <ImmersiveFullscreenNavClient
      navConfig={NAV_CONFIG}
      navContent={NAV_CONTENT}
    />
  );
}
