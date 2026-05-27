"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useAnimate, useInView } from "motion/react";
import { getEffectHref, getEffectPreviewHref } from "@/lib/categories";

gsap.registerPlugin(DrawSVGPlugin);

export function EffectCard({ effect, priority = false }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [borderSize, setBorderSize] = useState({ width: 0, height: 0 });

  const videoRef = useRef(null);
  const borderRectRef = useRef(null);
  const [scope, animate] = useAnimate();

  const isInView = useInView(scope, {
    once: true,
    margin: "0px",
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      if (!scope.current) return;
      animate(scope.current, { opacity: 1 }, { duration: 0.55 });
    }
  }, [animate, isInView, scope]);

  useEffect(() => {
    const element = scope.current;
    if (!element) return;

    const measure = () => {
      const { offsetWidth: w, offsetHeight: h } = element;
      setBorderSize({
        width: Math.max(w - 2, 0),
        height: Math.max(h - 2, 0),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(element);
    return () => ro.disconnect();
  }, [scope]);

  useEffect(() => {
    if (!borderRectRef.current) return;

    gsap.killTweensOf(borderRectRef.current);

    gsap.to(borderRectRef.current, {
      drawSVG: isHovered ? "0% 100%" : "0% 0%",
      opacity: isHovered ? 1 : 0,
      duration: isHovered ? 1.5 : 0.45,
      ease: isHovered ? "power2.out" : "power2.inOut",
      overwrite: "auto",
    });
  }, [isHovered]);

  const videoPreviewUrl = effect.videoUrl
    ? `${process.env.NEXT_PUBLIC_DEV_URL}/${effect.videoUrl}`
    : null;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    const next = wishlist.includes(effect.name);
    const raf = requestAnimationFrame(() => setIsWishlisted(next));
    return () => cancelAnimationFrame(raf);
  }, [effect.name]);

  useEffect(() => {
    if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setVideoReady(false);
    }
  }, [isHovered]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(
      localStorage.getItem("hyperiux-wishlist") || "[]"
    );
    const newWishlist = isWishlisted
      ? wishlist.filter((name) => name !== effect.name)
      : [...wishlist, effect.name];
    localStorage.setItem("hyperiux-wishlist", JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

  const shouldLoadVideo = videoPreviewUrl && !videoError && isHovered;
  const showVideo = shouldLoadVideo && videoReady;
  const effectHref = getEffectHref(effect);
  const previewHref = effect.previewUrl || getEffectPreviewHref(effect);

  return (
    <div
      ref={scope}
      style={{
        opacity: isInView ? 1 : 0,
        transition: "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity",
        position: "relative",
      }}
      className={`group bg-[#0000033] p-5 pb-[0.01vw] border rounded-[1.5vw] w-full max-sm:rounded-[5vw] hover:shadow-2xl backdrop-blur-[6px] duration-500 ease-in-out ${
        isHovered ? "border-transparent" : "border-border/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Border draw SVG */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-0.5 -left-0.5 w-full h-full z-10 overflow-visible"
        style={{ borderRadius: "inherit" }}
      >
        <rect
          ref={borderRectRef}
          x="1"
          y="1"
          width={borderSize.width}
          height={borderSize.height}
          rx={22}
          fill="none"
          stroke="#ff5f00"
          strokeWidth="1"
          style={{
            fill: "none",
            opacity: 0,
          }}
        />
      </svg>

      {/* Clickable Preview Area */}
      <Link href={effectHref} className="block">
        <div className="aspect-video bg-black/20 rounded-[1vw] max-sm:rounded-[4vw] overflow-hidden relative">
          <Image
            src={effect.coverImage || "/assets/img/image01.webp"}
            alt={effect.title || effect.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className={`object-cover transition-all duration-500 ${
              showVideo ? "opacity-0" : "opacity-100"
            }`}
          />
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              src={videoPreviewUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoError(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                showVideo ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(previewHref, "_blank");
          }}
          className="p-2.5 bg-black/20 border border-border/50 duration-300 ease-in-out backdrop-blur-sm text-foreground rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
          aria-label="Preview"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {/* <button
          onClick={toggleWishlist}
          className={`p-2.5 backdrop-blur-sm rounded-full duration-300 ease-in-out transition-colors cursor-pointer ${
            isWishlisted
              ? "bg-primary text-white"
              : "bg-black/20 border border-border/50 text-foreground hover:bg-primary hover:text-white"
          }`}
          aria-label="Add to wishlist"
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button> */}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between py-4 max-sm:py-6">
        <Link href={effectHref} className="block">
          <h3 className="font-sans font-semibold max-sm:text-xl text-base text-foreground group-hover:text-primary transition-colors">
            {effect.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          {(effect.categories?.length ? effect.categories : [effect.category]).map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-0.5 max-sm:py-1 max-sm:px-3 max-sm:text-lg border border-border/80 backdrop-blur-sm text-sm font-medium font-sans text-white/60 capitalize rounded-lg"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
