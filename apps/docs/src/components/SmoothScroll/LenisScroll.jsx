"use client"
import gsap from"gsap";
import { useEffect, useRef } from'react';
import { ReactLenis } from'lenis/react';
import'lenis/dist/lenis.css';

const LenisSmoothScroll = ({duration = 1.5, lerp = 0.075, smoothWheel = true, wheelMultiplier = 0.8, touchMultiplier = 1.5}) => {
 const lenisRef = useRef(null);

 useEffect(() => {
 function update(time) {
 lenisRef.current?.lenis?.raf(time * 1000)
 }

 gsap.ticker.add(update)

 return () => gsap.ticker.remove(update)
 }, []);

 return (
 <ReactLenis
 root
 options={{
 autoRaf: false,
 duration: duration,
 lerp: lerp,
 smoothWheel: smoothWheel,
 wheelMultiplier: wheelMultiplier,
 touchMultiplier: touchMultiplier,
 easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
 }}
 ref={lenisRef}
 />
 )
}

export default LenisSmoothScroll;