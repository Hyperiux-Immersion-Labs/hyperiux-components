
import Link from"next/link";
import { getRegistryIndex } from"@/lib/registry";
import { HeroSection } from"./hero-section";
import HomeLoader from"./home-loader";

export default function Home() {
 const registry = getRegistryIndex();
 const effectCount = registry.items.length;

 return (
 <HomeLoader>
 <div className="min-h-screen">
 {/* Hero - White background */}
 <HeroSection effectCount={effectCount} />

 {/* Features - Dark section (#0a0b0d) */}
 <section className="bg-dark-surface text-white py-24">
 <div className="max-w-5xl mx-auto px-4">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="p-8 rounded-2xl border border-border/60/20 bg-dark-card">
 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
 <svg
 className="w-6 h-6 text-primary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M13 10V3L4 14h7v7l9-11h-7z"
 />
 </svg>
 </div>
 <h3 className="text-xl font-semibold mb-3 font-sans">Copy & Paste</h3>
 <p className="text-white/70 text-base" style={{ lineHeight:'1.5' }}>
 No npm packages to install. Just copy the code directly into your
 project. You own the code.
 </p>
 </div>

 <div className="p-8 rounded-2xl border border-border/60/20 bg-dark-card">
 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
 <svg
 className="w-6 h-6 text-primary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
 />
 </svg>
 </div>
 <h3 className="text-xl font-semibold mb-3 font-sans">CLI Tool</h3>
 <p className="text-white/70 text-base" style={{ lineHeight:'1.5' }}>
 Use our CLI to add effects automatically. Handles dependencies and
 places files in the right location.
 </p>
 </div>

 <div className="p-8 rounded-2xl border border-border/60/20 bg-dark-card">
 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
 <svg
 className="w-6 h-6 text-primary"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
 />
 </svg>
 </div>
 <h3 className="text-xl font-semibold mb-3 font-sans">Customizable</h3>
 <p className="text-white/70 text-base" style={{ lineHeight:'1.5' }}>
 Every effect is fully customizable. Adjust props, tweak styles,
 make it yours.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* Quick start - White section in light, lighter dark in dark mode */}
 <section className="bg-white py-24">
 <div className="max-w-5xl mx-auto px-4">
 <h2 className="font-display text-5xl font-normal mb-12 text-center text-foreground" style={{ lineHeight:'1.1' }}>
 Quick Start
 </h2>
 <div className="max-w-2xl mx-auto space-y-8">
 <div className="flex gap-5">
 <div className="shrink-0 w-10 h-10 rounded-full bg-dark-surface text-white flex items-center justify-center font-semibold text-base">
 1
 </div>
 <div className="flex-1">
 <h3 className="font-sans font-semibold text-lg mb-3 text-foreground">Initialize Hyperiux</h3>
 <div className="p-4 rounded-2xl bg-secondary-surface border border-border/60 font-mono text-sm">
 <span className="text-primary font-semibold">$</span> <span className="text-foreground">npx hyperiux init</span>
 </div>
 </div>
 </div>

 <div className="flex gap-5">
 <div className="shrink-0 w-10 h-10 rounded-full bg-dark-surface text-white flex items-center justify-center font-semibold text-base">
 2
 </div>
 <div className="flex-1">
 <h3 className="font-sans font-semibold text-lg mb-3 text-foreground">Add an effect</h3>
 <div className="p-4 rounded-2xl bg-secondary-surface border border-border/60 font-mono text-sm">
 <span className="text-primary font-semibold">$</span> <span className="text-foreground">npx hyperiux add blur-text</span>
 </div>
 </div>
 </div>

 <div className="flex gap-5">
 <div className="shrink-0 w-10 h-10 rounded-full bg-dark-surface text-white flex items-center justify-center font-semibold text-base">
 3
 </div>
 <div className="flex-1">
 <h3 className="font-sans font-semibold text-lg mb-3 text-foreground">Use it in your component</h3>
 <div className="p-4 rounded-2xl bg-secondary-surface border border-border/60 font-mono text-sm overflow-x-auto">
 <pre className="text-foreground">{`import { BlurText } from"@/components/effects/blur-text";

<BlurText>Hello World</BlurText>`}</pre>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* CTA - Dark section */}
 <section className="bg-dark-surface text-white py-24">
 <div className="max-w-5xl mx-auto px-4 text-center">
 <h2 className="font-display text-5xl md:text-6xl font-normal mb-6" style={{ lineHeight:'1.0' }}>
 Ready to get started?
 </h2>
 <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto" style={{ lineHeight:'1.5' }}>
 Browse our collection of {effectCount} beautiful effects.
 </p>
 <Link
 href="/effects"
 className="btn-pill btn-pill-primary inline-flex items-center gap-2"
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
 </div>
 </section>

 {/* Footer - Dark section */}
 <footer className="bg-dark-surface border-t border-border/60/20 py-8">
 <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="text-sm text-white/60 font-sans">
 Built with Next.js and Tailwind CSS
 </div>
 <div className="flex items-center gap-4">
 <p className="text-white/60 text-sm" suppressHydrationWarning>
 © {new Date().getFullYear()}{""}
 <a
 href="https://hyperiux.com"
 target="_blank"
 rel="noopener noreferrer"
 className="text-primary hover:text-primary-hover transition-colors"
 >
 Hyperiux Immersion Labs
 </a>
 </p>
 </div>
 </div>
 </footer>
 </div>
 </HomeLoader>
 );
}
