'use client'
import React from"react";
import FullscreenNav from"@/components/Navbar/FullscreenNav";
import CustomNavbar from"@/components/Navbar/CustomNavbar";

const page = () => {
 return (
 <>
 <FullscreenNav {...NAV_CONFIG}>
 {(isOpen) => (
 <CustomNavbar
 {...NAV_CONTENT}
 isOpen={isOpen}
 overlayBg={NAV_CONFIG.overlayBg}  delay={NAV_CONFIG.openDuration}
 />
 )}
 </FullscreenNav>

 <main className="h-screen bg-white flex items-center justify-center">
 <p className="text-5xl text-neutral-700">Hello !</p>
 </main>
 </>
 );
};

export default page;



const NAV_CONFIG = {
 brand:"Hyperiux",
 brandHref:"/",
 clipOrigin:"bottom",
 overlayBg:"#1a1a2e",
 headerOpenColor:"#ff6600",
 openDuration: 1.2,
 closeDuration: 1.2,
};

const NAV_CONTENT = {
 agencyName:"",
 tagline:"Crafting digital experiences.",
 location:"Noida, India",
 links: [
 { label:"Home", href:"/" },
 { label:"Work", href:"/work" },
 { label:"About", href:"/about" },
 { label:"Contact", href:"/contact" },
 ],
 images: [
"/assets/img/image01.webp",
"/assets/img/image02.webp",
 ],
 socials: [
 { type:"ig", href:"#" },
 { type:"fb", href:"#" },
 { type:"x", href:"#" },
 { type:"li", href:"#" },
 { type:"dr", href:"#" },
 ],
};