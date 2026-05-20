"use client";

import { useState, useCallback, useRef, useEffect } from"react";
import Link from"next/link";
import { PropsPanel } from"@/components/ui/PropsPanel";

// Import all effects
import BlurText from"@/components/effects/BlurText";
import { TextReveal } from"@/components/effects/text-reveal";

// Effects that need special handling
const SCROLL_EFFECTS = ["text-reveal"];

// Demo components for each effect
function BlurTextDemo({ props, replayKey }) {
 return (
 <BlurText
 key={replayKey}
 blur={props.blur}
 duration={props.duration}
 delay={props.delay}
 className="text-6xl md:text-8xl font-bold text-white text-center"
 >
 Beautiful Blur Effect
 </BlurText>
 );
}

function TextRevealDemo({ props, replayKey, scrollerRef }) {
 return (
 <TextReveal
 key={replayKey}
 duration={props.duration}
 stagger={props.stagger}
 y={props.y}
 className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl"
 trigger="top 80%"
 once={false}
 scroller={scrollerRef?.current}
 >
 Scroll to reveal this amazing text animation effect
 </TextReveal>
 );
}

const demoComponents = {
"blur-text": BlurTextDemo,
"text-reveal": TextRevealDemo,
};

export function FullscreenPreview({ slug, effect, config }) {
 const [propValues, setPropValues] = useState(config?.defaults || {});
 const [replayKey, setReplayKey] = useState(0);
 const [showProps, setShowProps] = useState(true);
 const scrollerRef = useRef(null);

 const handlePropChange = useCallback((name, value) => {
 setPropValues((prev) => ({ ...prev, [name]: value }));
 setReplayKey((k) => k + 1);
 }, []);

 const handleReplay = useCallback(() => {
 setReplayKey((k) => k + 1);
 }, []);

 const DemoComponent = demoComponents[slug];
 const isScrollEffect = SCROLL_EFFECTS.includes(slug);
 const isFullscreen = false;

 return (
 <div className="fixed inset-0 bg-dark-surface flex">
 {/* Main preview area */}
 <div className="flex-1 relative">
 {/* Header */}
 <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-dark-surface/90 to-transparent backdrop-blur-sm">
 <Link
 href={`/effects/${slug}`}
 className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-primary-hover text-white text-sm transition-colors backdrop-blur-sm font-sans font-medium"
 style={{ borderRadius:'56px' }}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
 </svg>
 Back to Details
 </Link>

 <div className="flex items-center gap-3">
 {/* Replay button */}
 <button
 onClick={handleReplay}
 className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-primary-hover text-white text-sm transition-colors backdrop-blur-sm font-sans font-medium"
 style={{ borderRadius:'56px' }}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
 </svg>
 Replay
 </button>

 {/* Toggle props panel */}
 {config?.props?.length > 0 && (
 <button
 onClick={() => setShowProps(!showProps)}
 className={`flex items-center gap-2 px-5 py-2.5 text-sm transition-colors backdrop-blur-sm font-sans font-medium ${
 showProps
 ?"bg-white text-dark-surface"
 :"bg-white/10 hover:bg-primary-hover text-white"
 }`}
 style={{ borderRadius:'56px' }}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
 </svg>
 Props
 </button>
 )}
 </div>
 </div>

 {/* Effect title */}
 <div className="absolute bottom-8 left-8 z-20">
 <h1 className="font-display text-3xl font-normal text-white mb-2" style={{ lineHeight:'1.1' }}>{effect.title}</h1>
 <p className="text-white/70 text-base font-sans" style={{ lineHeight:'1.5' }}>{effect.description}</p>
 </div>

 {/* Preview content */}
 {isScrollEffect ? (
 <div
 ref={scrollerRef}
 className="absolute inset-0 overflow-y-auto"
 >
 <div className="min-h-[150vh] flex flex-col">
 <div className="flex-1 flex items-end justify-center pb-32">
 <span className="text-white/30 text-lg">↓ Scroll down ↓</span>
 </div>
 <div className="flex items-center justify-center py-32 px-8">
 {DemoComponent && (
 <DemoComponent
 props={propValues}
 replayKey={replayKey}
 scrollerRef={scrollerRef}
 />
 )}
 </div>
 <div className="flex-1 flex items-start justify-center pt-32">
 <span className="text-white/30 text-lg">↑ Scroll up to replay ↑</span>
 </div>
 </div>
 </div>
 ) : (
 <div className={`absolute inset-0 flex items-center justify-center ${isFullscreen ?"" :"p-8"}`}>
 {DemoComponent && (
 <DemoComponent props={propValues} replayKey={replayKey} />
 )}
 </div>
 )}
 </div>

 {/* Props panel */}
 {showProps && config?.props?.length > 0 && (
 <div className="w-80 bg-dark-card border-l border-border/60/20 p-8 overflow-y-auto">
 <h3 className="font-display text-2xl font-normal text-white mb-8" style={{ lineHeight:'1.1' }}>Properties</h3>
 <div className="space-y-6">
 {config.props.map((prop) => (
 <PropControlDark
 key={prop.name}
 prop={prop}
 value={propValues[prop.name]}
 onChange={(value) => handlePropChange(prop.name, value)}
 />
 ))}
 </div>
 </div>
 )}
 </div>
 );
}

function PropControlDark({ prop, value, onChange }) {
 const { name, type, min, max, step, options, description } = prop;

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <label className="text-sm font-semibold text-white font-sans">{name}</label>
 {type ==="range" && (
 <span className="text-xs text-white/60 font-mono px-2 py-1 bg-dark-surface rounded" style={{ borderRadius:'8px' }}>{value}</span>
 )}
 </div>

 {type ==="range" && (
 <input
 type="range"
 min={min}
 max={max}
 step={step || 1}
 value={value}
 onChange={(e) => onChange(parseFloat(e.target.value))}
 className="w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-primary"
 />
 )}

 {type ==="number" && (
 <input
 type="number"
 min={min}
 max={max}
 step={step || 1}
 value={value}
 onChange={(e) => onChange(parseFloat(e.target.value))}
 className="w-full px-4 py-2.5 bg-dark-surface border border-border/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
 />
 )}

 {type ==="color" && (
 <div className="flex items-center gap-3">
 <input
 type="color"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-12 h-12 rounded-xl border border-border/60 cursor-pointer bg-transparent"
 />
 <input
 type="text"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="flex-1 px-4 py-2.5 bg-dark-surface border border-border/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
 />
 </div>
 )}

 {description && (
 <p className="text-xs text-white/60 font-sans" style={{ lineHeight:'1.5' }}>{description}</p>
 )}
 </div>
 );
}
