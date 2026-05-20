import React from'react'
import TextMarquee from'@/components/Marquee/TextMarquee'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <TextMarquee items={items} />
 </>
 )
}

export default page

const items = [
  "builds immersive interfaces",
  "creates motion-driven experiences",
  "powers futuristic web design",
  "redefines modern UI",
  "makes interactions feel alive",
  "crafts cinematic transitions",
  "turns motion into storytelling",
  "pushes creative development forward",
  "blends design with animation",
  "elevates frontend experiences",
  "creates seamless interactions",
  "makes scroll feel dynamic",
  "inspires experimental interfaces",
  "transforms static layouts",
  "ships visually stunning components",
  "brings ideas into motion",
  "builds expressive user journeys",
  "drives interactive experiences",
  "explores the future of UI",
  "creates unforgettable web moments",
  "makes the web feel futuristic",
];