"use client";

import { Link } from"next-transition-router";
import { usePathname } from"next/navigation";

export default function PieChartHeader() {
 const pathname = usePathname();

 const links = [
 { href:"/page-transitions/pie-rotation", label:"Page 1" },
 { href:"/page-transitions/pie-rotation/page2", label:"Page 2" },
 ];

 return (
 <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
 <div className="relative flex items-center gap-1 px-1 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-black/10 shadow-lg">

 {links.map((link) => {
 const isActive = pathname === link.href;

 return (
 <Link
 key={link.href}
 href={link.href}
 className={`relative text-xs font-medium tracking-tight px-4 py-2 rounded-lg transition-all duration-300
 ${isActive
 ?"text-white"
 :"text-black/70 hover:text-black"
 }`}
 >
 {/* Active background pill */}
 {isActive && (
 <span className="absolute inset-0 rounded-lg bg-[#0F2854] transition-all duration-300" />
 )}

 {/* Text */}
 <span className="relative z-10">
 {link.label}
 </span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}