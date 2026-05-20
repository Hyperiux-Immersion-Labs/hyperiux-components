"use client";

import Link from"next/link";
import { usePathname } from"next/navigation";

export default function BrushStrokesNavbar() {
 const pathname = usePathname();

 return (
 <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
 <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border-px border-[#82A0FF] rounded-full px-2 py-2">
 <Link
 href="/page-transitions/brush-strokes"
 className={`text-xs font-medium tracking-tight px-4 py-2 rounded-full hover:text-[#82A0FF] ${
 pathname ==="/page-transitions/brush-strokes"
 ?"text-[#82A0FF]"
 :"text-white"
 }`}
 >
 Page I
 </Link>
 <Link
 href="/page-transitions/brush-strokes/page2"
 className={`text-xs font-medium tracking-tight px-4 py-2 rounded-full hover:text-[#82A0FF] ${
 pathname ==="/page-transitions/brush-strokes/page2"
 ?"text-[#82A0FF]"
 :"text-white"
 }`}
 >
 Page II
 </Link>
 </div>
 </nav>
 );
}
