"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { getEffectHref } from "@/lib/categories";

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search effects...",
  totalCount = 0,
  className = ""
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
      />
      {totalCount > 0 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
          {totalCount} effects
        </div>
      )}
    </div>
  );
}

export function GlobalSearch({ effects = [], externalOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const lenis = useLenis();

  // Handle lenis scroll pause
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  // Open when externalOpen changes to true
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredEffects = effects.filter((effect) => {
    const q = query.toLowerCase();
    const cats = effect.categories?.length ? effect.categories : [effect.category];
    return (
      effect.name.toLowerCase().includes(q) ||
      effect.title.toLowerCase().includes(q) ||
      cats.some((c) => c?.toLowerCase().includes(q))
    );
  });

  const handleSelect = (effect) => {
    router.push(getEffectHref(effect));
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-neutral-950/90 backdrop-blur-xl rounded-xl  overflow-hidden border border-neutral-800/60 flex flex-col h-113  ring-1 ring-white/5">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-800/50 bg-black/20">
          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search effects..."
            className="flex-1 bg-transparent text-white placeholder:text-neutral-500 text-base sm:text-lg focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-medium">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto" data-lenis-prevent="true">
          {filteredEffects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 px-4">
              <svg className="w-12 h-12 mb-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No effects found for &quot;<span className="text-neutral-300">{query}</span>&quot;</p>
              <p className="text-sm mt-1 text-neutral-600">Try searching with a different term.</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredEffects.map((effect) => (
                <button
                  key={effect.name}
                  onClick={() => handleSelect(effect)}
                  className="w-full flex items-center cursor-pointer gap-4 px-3 py-3 rounded-xl hover:bg-neutral-800/50 text-left transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-neutral-900 border border-neutral-800/60 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-600 transition-colors">
                    {effect.category?.[0]?.toUpperCase() || "E"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">{effect.title}</div>
                    <div className="text-xs text-neutral-500 capitalize mt-0.5 group-hover:text-neutral-400 transition-colors">
                      {(effect.categories?.length ? effect.categories : [effect.category]).join(", ")}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 opacity-0 group-hover:opacity-100 group-hover:text-neutral-400 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
