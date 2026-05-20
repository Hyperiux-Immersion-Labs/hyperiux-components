"use client";

import { useState } from"react";

export function EffectPreview({ children, className ="" }) {
 return (
 <div
 className={`relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden ${className}`}
 >
 <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
 <div className="w-3 h-3 rounded-full bg-neutral-700" />
 <div className="w-3 h-3 rounded-full bg-neutral-700" />
 <div className="w-3 h-3 rounded-full bg-neutral-700" />
 </div>
 <div className="min-h-[300px] flex items-center justify-center p-8 pt-12">
 {children}
 </div>
 </div>
 );
}

export function EffectPreviewWithTabs({ children, code, effect }) {
 const [activeTab, setActiveTab] = useState("preview");

 return (
 <div className="rounded-xl border border-neutral-800 overflow-hidden">
 <div className="flex border-b border-neutral-800 bg-neutral-900">
 <button
 onClick={() => setActiveTab("preview")}
 className={`px-4 py-2 text-sm font-medium transition-colors ${
 activeTab ==="preview"
 ?"text-white border-b-2 border-white"
 :"text-neutral-500 hover:text-neutral-300"
 }`}
 >
 Preview
 </button>
 <button
 onClick={() => setActiveTab("code")}
 className={`px-4 py-2 text-sm font-medium transition-colors ${
 activeTab ==="code"
 ?"text-white border-b-2 border-white"
 :"text-neutral-500 hover:text-neutral-300"
 }`}
 >
 Code
 </button>
 </div>

 {activeTab ==="preview" && (
 <div className="min-h-[300px] flex items-center justify-center p-8 bg-neutral-950">
 {children}
 </div>
 )}

 {activeTab ==="code" && (
 <div className="bg-neutral-950">
 <pre className="p-4 overflow-x-auto text-sm">
 <code className="text-neutral-300">{code}</code>
 </pre>
 </div>
 )}
 </div>
 );
}
