"use client";

import DirectionalMegaMenu from "@/components/Menu/DirectionalMegaMenu";
import Menu1 from "@/components/Menu/Menu1";
import Menu2 from "@/components/Menu/Menu2";
import Menu3 from "@/components/Menu/Menu3";

const menuItems = [
  {
    label: "Products",
    customContent: <Menu1 />,
  },
  {
    label: "Solutions",
    customContent: <Menu2 />,
  },
  {
    label: "Developers",
    customContent: <Menu3 />,
  },
  {
    label: "About",
  },
];

export default function DemoPage() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-160 h-160 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[22px_22px]" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-19 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-semibold text-sm">
              H
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-white font-medium text-lg tracking-tight">
                hyperiux
              </span>
              <span className="text-white/40 text-xs">
                next generation experiences
              </span>
            </div>
          </div>

          {/* Menu */}
          <DirectionalMegaMenu
            items={menuItems}
            closeDelay={80}
            contentWrapperClassName="p-8 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl"
            animation={{
              duration: 0.35,
              ease: "power2.inOut",
              distance: 100,
              closeOpacityDuration: 0.3,
              openOpacityDuration: 0.3,
              fade: true,
              heightDuration: 0.35,
              heightEase: "power2.inOut",
            }}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-25 flex items-center justify-center  px-6">
        <div className="max-w-5xl mx-auto text-center">
          
         

          {/* Heading */}
          <h1 className="text-[13vw] sm:text-[11vw] md:text-[7rem] leading-none font-semibold tracking-[-0.06em]">
            Hyperiux
          </h1>

          {/* Subtext */}
          <p className="mt-8 max-w-2xl mx-auto text-white/50 text-base md:text-lg leading-relaxed">
            Building minimal, scalable, and immersive digital products
            engineered for modern brands, developers, and next-gen user
            experiences.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-7 py-3 cursor-pointer rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all duration-300">
              Get Started
            </button>

            <button className="px-7 py-3 rounded-full border cursor-pointer border-white/10 bg-white/3 hover:bg-white/6 transition-all duration-300 text-white/80">
              Explore Platform
            </button>
          </div>

          {/* Bottom Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            
            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">20+</h3>
              <p className="text-sm text-white/40 mt-2">
                Digital products launched
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">99.9%</h3>
              <p className="text-sm text-white/40 mt-2">
                System reliability
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">24/7</h3>
              <p className="text-sm text-white/40 mt-2">
                Developer focused support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}