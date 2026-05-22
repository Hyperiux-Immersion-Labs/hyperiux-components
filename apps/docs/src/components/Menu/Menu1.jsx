
"use client";

import Image from"next/image";
import Link from"next/link";

export default function Menu1() {
 const links = [
 { label:"Overview", href:"#" },
 { label:"Pricing", href:"#" },
 { label:"Integrations", href:"#" },
 { label:"Documentation", href:"#" },
 ];

 return (
 <div className="flex justify-between max-sm:flex-col max-sm:gap-6">
 
 <div className="w-[65%] max-sm:w-[90%]">
 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
 Product Navigation
 </p>
 <h3 className="mb-6 text-2xl font-semibold t">
 Explore the product suite
 </h3>

 <div className="space-y-4">
 {links.map((item) => (
 <Link
 key={item.label}
 href={item.href}
 className="block rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:bg-neutral-900"
 >
 <div className="text-sm font-medium t">{item.label}</div>
 <div className="mt-1 text-sm text-neutral-500">
 Learn more about {item.label.toLowerCase()}.
 </div>
 </Link>
 ))}
 </div>
 </div>
 <div className="space-y-4 w-[30%] max-sm:w-[90%] ">
 <div className="overflow-hidden rounded-2xl border border-neutral-200 h-54 max-sm:h-40">
 <Image
 src="/assets/menu/beach.jpg"
 alt="Dashboard preview"
 width={600}
 height={400}
 className="h-full w-full object-cover"
 />
 </div>

 <div className="overflow-hidden rounded-2xl border border-neutral-200 h-54 max-sm:h-40">
 <Image
 src="/assets/menu/spider-man.jpg"
 alt="Product showcase"
 width={600}
 height={400}
 className="h-full w-full object-cover"
 />
 </div>
 </div>
 </div>
 );
}