"use client";

import Link from "next/link";
import { DirectionalMegaMenu } from "./DirectionalMegaMenu";
import { Menu1 } from "./Menu1";
import { Menu2 } from "./Menu2";
import { Menu3 } from "./Menu3";
import Image from "next/image";
import { MobileDirectionalMenu } from "./MobileDirectionalMenu";

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
    href: "#",
  },
];

export default function DirectionalMenu() {
  return (
    <div className="relative h-screen overflow-hidden bg-black text-white max-sm:h-full max-sm:overflow-visible max-sm:pb-10">
      {/* Navbar */}
      <header className="relative z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto max-md:hidden h-19 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Image
                src="/hyperiux.svg"
                alt="Hyperiux"
                width={30}
                height={30}
              />

              <div className="flex items-center gap-2 text-white">
                <Image
                  src="/hyperiux-wordmark.svg"
                  alt="Hyperiux"
                  width={156}
                  height={45}
                />
              </div>
            </Link>
          </div>

          {/* Menu */}
          <DirectionalMegaMenu
            items={menuItems}
            closeDelay={80}
            navClassName="mx-auto w-full  max-w-7xl justify-center px-6 md:px-10 max-md:translate-x-10 max-sm:translate-x-0 "
            contentWrapperClassName="p-8 bg-white border border-white/10 rounded-3xl max-sm:h-[92vh] max-md:h-[75vh]"
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
        <MobileDirectionalMenu items={menuItems} />
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-25 flex items-center justify-center  px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-[10vw] sm:text-[11vw] md:text-[7rem] leading-none  tracking-[-0.06em]">
            Directional Menu
          </h1>

          <p className="mt-8 max-w-200 mx-auto text-white/70 max-sm:text-sm text-2xl leading-[1.2]">
            Interact with the navigation above to see smooth transitions,
            motion, and details crafted for a more immersive experience.
          </p>
          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-7 py-3 cursor-pointer rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all duration-300">
              <Link href={"/effects/navigation/directional-menu"} className="">
                Get Started
              </Link>
            </button>

            <button className="px-7 py-3 rounded-full border cursor-pointer border-white/10 bg-white/3 hover:bg-white/6 transition-all duration-300 text-white/80">
              <Link href={"/effects"}>Explore Platform</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
