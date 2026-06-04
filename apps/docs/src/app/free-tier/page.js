import Link from "next/link";

export const metadata = {
  title: "Free Tier | Hyperiux UI",
  description: "Quick links for what’s available on the free tier",
};

const FREE_TIER_LINKS = [
  { label: "Stick Content Wrapper", href: "/effects/scroll-effects/sticky-content-wrapper" },
  { label: "Horizontal Scroll", href: "/effects/scroll-effects/horizontal-feature-reveal" },
  { label: "Infinite Perspective Slider", href: "/effects/scroll-effects/infinite-perspective-slider" },
  { label: "Phantom Image Trail", href: "/effects/cursor-effects/phantom-image-trail" },
  { label: "Pixelate Image Effect", href: "/effects/cursor-effects/pixelated-image-effect" },
  { label: "Spider Particles", href: "/effects/backgrounds/spider-particles" },
  { label: "Dotted Grid", href: "/effects/backgrounds/dotted-grid" },
  { label: "Block Transition", href: "/effects/page-transitions/block-transition" },
  { label: "Pie Rotation", href: "/effects/page-transitions/pie-rotation-transition" },
  { label: "Chess Grid", href: "/effects/page-transitions/chess-grid-transition" },
  { label: "Overflow Stagger Text", href: "/effects/text-effects/overflow-stagger-text" },
  { label: "Text Convergence", href: "/effects/scroll-effects/text-convergence" },
  { label: "Text Fill Animation", href: "/effects/text-effects/text-fill-animation" },
  { label: "Rectangular Text Reveal", href: "/effects/text-effects/rectangular-text-reveal" },
  { label: "Scramble link Button", href: "/effects/buttons/scramble-link-button" },
  { label: "Link Button", href: "/effects/buttons/link-button" },
  { label: "Arrow Fill button", href: "/effects/buttons/arrow-fill-button" },
  { label: "Rotation slider", href: "/effects/scroll-effects/rotation-slider" },
  { label: "Parallax Slider", href: "/effects/scroll-effects/parallax-slider" },
  { label: "Circular Split Roll", href: "/effects/scroll-effects/circular-split-roll" },
  { label: "Zoom Slider", href: "/effects/carousels/zoom-slider" },
  { label: "Interactive List Preview", href: "/effects/others/interactive-list-preview" },
  { label: "Stack hovered cards", href: "/effects/components/hover-stack" },
  { label: "Gooey Counter", href: "/effects/others/gooey-counter" },
  { label: "Directional Menu", href: "/effects/navigation/directional-menu" },
  { label: "Elevate Navbar", href: "/effects/navigation/elevate-navbar" },
  { label: "Full Screen Navigation", href: "/effects/navigation/immersive-full-screen-navigation" },
  { label: "Numeric Tunnel", href: "/effects/website-loaders/numeric-tunnel" },
  { label: "Stack loader", href: "/effects/website-loaders/stack-loader/" },
  { label: "Interactive Blur Reveal", href: "/effects/webgl/interactive-blur-reveal" },
  { label: "Scroll Distortion", href: "/effects/scroll-effects/scroll-distortion" },
  { label: "Mouse Pixelation", href: "/effects/webgl/mouse-pixelation" },
];

export default function FreeTierPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-semibold">Free tier</h1>
        <ul className="space-y-3">
          {FREE_TIER_LINKS.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
