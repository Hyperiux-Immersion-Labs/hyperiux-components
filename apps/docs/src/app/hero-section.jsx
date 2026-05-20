"use client";

import Link from"next/link";
import BlurText from"@/components/effects/BlurText";

export function HeroSection({ effectCount }) {
 return (
 <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
 {/* Subtle gradient background */}
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,95,0,0.08)_0%,transparent_50%)]" />

 <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
 {/* Badge */}
 <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary-surface border border-border/50 text-sm mb-10 font-medium">
 <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
 <span className="text-foreground">{effectCount} effects available</span>
 </div>

 {/* Hero headline - Coinbase Display style: 80px, line-height 1.0 */}
 <h1 className="font-display text-[64px] md:text-[80px] font-normal mb-6 text-foreground" style={{ lineHeight:'1.0' }}>
 <BlurText delay={0.2} duration={0.8} blur={15}>
 Beautiful Effects
 </BlurText>
 <br />
 <span className="text-muted">
 <BlurText delay={0.5} duration={0.8} blur={15}>
 For Your Website
 </BlurText>
 </span>
 </h1>

 {/* Body text - 18px with proper line-height */}
 <p className="text-lg md:text-[18px] text-muted mb-12 max-w-2xl mx-auto font-sans" style={{ lineHeight:'1.56' }}>
 A collection of animated effects and UI components. Copy-paste or use
 our CLI to add stunning animations to your Next.js project.
 </p>

 {/* CTA buttons - 56px radius pills */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 href="/effects"
 className="btn-pill btn-pill-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
 >
 Browse Effects
 <svg
 className="w-4 h-4"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M17 8l4 4m0 0l-4 4m4-4H3"
 />
 </svg>
 </Link>

 <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary-surface border border-border/50 font-mono text-sm" style={{ borderRadius:'56px' }}>
 <span className="text-primary">$</span>
 <span className="text-foreground">npx hyperiux init</span>
 </div>
 </div>
 </div>

 {/* Gradient fade to next section */}
 <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white/50 to-transparent" />
 </div>
 );
}
