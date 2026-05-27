import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
     <footer className="relative overflow-hidden rounded-3xl border border-border/60 bg-[#555555]/33 backdrop-blur-md max-sm:px-6 pt-10 pb-5 px-12">
          <div className="relative z-10 flex flex-col items-center text-center max-sm:gap-2">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-black">
                <Image src="/hyperiux.svg" alt="Hyperiux" width={30} height={30} />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Hyperiux UI</h2>
            </div>

            <p className="max-w-[20vw] max-sm:max-w-[80vw] text-lg leading-[1.4]">
              Crafting futuristic UI experiences for modern teams.
            </p>

            <div className="mt-6 flex items-center gap-5">
              {socialIcons.map((item, i) => (
                <Link
                  key={i}
                  href={item.link}
                  className="flex h-12 w-12 p-3.5! items-center justify-center rounded-full border border-primary transition hover:scale-105"
                >
                  <Image src={item.icon} alt={item.name} width={26} height={26} className="h-full w-full object-contain" />
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-300 md:gap-8">
              {["Overview", "Components", "Templates", "Pricing", "Documentation", "Blog", "Contact"].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Link href="#" className="cursor-pointer text-base max-sm:text-lg transition hover:text-primary">
                    {item}
                  </Link>
                  {i !== 6 && <span className="text-primary max-sm:text-xl">•</span>}
                </div>
              ))}
            </div>

            <div className="mt-5 max-sm:pb-2 flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-zinc-500 md:flex-row max-sm:text-base max-sm:gap-4">
              <p>© 2026 Hyperiux UI. All rights reserved.</p>
              <div className="flex items-center max-sm:text-sm gap-5">
                <span className="cursor-pointer transition hover:text-white">Terms of Use</span>
                <span>|</span>
                <span className="cursor-pointer transition hover:text-white">Privacy Policy</span>
                <span>|</span>
                <span className="cursor-pointer transition hover:text-white">Cookies</span>
              </div>
            </div>
          </div>
        </footer>
  )
}

export default Footer

const socialIcons = [
  { name: "facebook", icon: "/assets/social-icons/facebook.svg", link: "#" },
  { name: "instagram", icon: "/assets/social-icons/linkedIn.svg", link: "#" },
  { name: "twitter", icon: "/assets/social-icons/twitter.svg", link: "#" },
  { name: "mail", icon: "/assets/social-icons/instagram.svg", link: "#" },
];
