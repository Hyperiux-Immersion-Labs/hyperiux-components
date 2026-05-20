"use client";

import Link from"next/link";

export default function Menu3() {
 const groups = [
 {
 heading:"Documentation",
 links: [
 { label:"API Reference", href:"#" },
 { label:"Guides", href:"#" },
 { label:"Examples", href:"#" },
 ],
 },
 {
 heading:"Resources",
 links: [
 { label:"Changelog", href:"#" },
 { label:"Community", href:"#" },
 { label:"Support", href:"#" },
 ],
 },
 {
 heading:"Company",
 links: [
 { label:"About", href:"#" },
 { label:"Careers", href:"#" },
 { label:"Contact", href:"#" },
 ],
 },
 ];

 return (
 <div className="grid grid-cols-3 gap-10">
 {groups.map((group) => (
 <div key={group.heading}>
 <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-neutral-500">
 {group.heading}
 </h4>

 <div className="space-y-3">
 {group.links.map((link) => (
 <Link
 key={link.label}
 href={link.href}
 className="block text-sm font-medium  transition-opacity duration-200 hover:opacity-60"
 >
 {link.label}
 </Link>
 ))}
 </div>
 </div>
 ))}
 </div>
 );
}