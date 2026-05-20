import React from'react'
import CircularSlider from'@/components/CardsStack/CircularSlider'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <>
 <ReactLenis root>
 
 <CircularSlider
 heading="Interfaces that react."
 para="Built for motion, crafted for experience."
 data={data}
/>
 </ReactLenis>
 </>
 )
}

export default page

const data = [
 {
 heading:"Arrow Fill Button",
 text:"Primary button with an expanding fill and animated arrow",
 link:"/buttons/arrow-fill-button",
 bgColor:"#655A7C",
 textColor:"#2A2433",
 },
 {
 heading:"Custom Cursor",
 text:"Interactive cursor that transforms every hover",
 link:"/components/custom-cursor",
 bgColor:"#AB92BF",
 textColor:"#3D2E50",
 },
 {
 heading:"Text Scramble",
 text:"Dynamic text reveal with glitch-style transitions",
 link:"/components/text-scramble",
 bgColor:"#AFC1D6",
 textColor:"#2C3E52",
 },
 {
 heading:"Hover Reveal Card",
 text:"Cards that come alive on hover interaction",
 link:"/components/hover-reveal-card",
 bgColor:"#CEF9F2",
 textColor:"#1A5C53",
 },
 {
 heading:"Scroll Animations",
 text:"Smooth GSAP-powered scroll-based animations",
 link:"/components/scroll-animations",
 bgColor:"#D6CA98",
 textColor:"#4A3F1A",
 },
 {
 heading:"Circular Slider",
 text:"Rotating card slider with immersive motion",
 link:"/components/circular-slider",
 bgColor:"#655A7C",
 textColor:"#2A2433",
 },
];
