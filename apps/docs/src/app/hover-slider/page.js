import React from'react'
import HoverSlider from'@/components/Slider/HoverSlider'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <div>
 <LenisSmoothScroll />
 <HoverSlider items={items} />
 </div>
 )
}

export default page

const items = [
  { id:"HX_104", title:"Aurora Grid", focus:"UI Systems – Motion – GSAP", year:"2025", img:"/assets/nature/nature01.png" },
  { id:"HX_128", title:"Flow State", focus:"WebGL – Transitions – Interaction", year:"2025", img:"/assets/nature/nature02.png" },
  { id:"HX_142", title:"Neon Layers", focus:"Visual Effects – Motion – UI", year:"2025", img:"/assets/nature/nature03.png" },
  { id:"HX_157", title:"Pulse Interface", focus:"Interactive UI – Motion – Scroll", year:"2025", img:"/assets/nature/nature04.png" },
  { id:"HX_163", title:"Glass Morph Engine", focus:"Glass UI – Effects – Design", year:"2025", img:"/assets/nature/nature05.png" },
  { id:"HX_174", title:"Infinite Canvas", focus:"Creative Coding – Motion – Layout", year:"2025", img:"/assets/nature/nature06.png" },
  { id:"HX_189", title:"Velocity Cards", focus:"Cards – Hover Effects – Motion", year:"2025", img:"/assets/nature/nature07.png" },
  { id:"HX_193", title:"Quantum Scroll", focus:"Scroll Animation – WebGL – UI", year:"2025", img:"/assets/nature/nature08.png" },
  { id:"HX_205", title:"Prism Navigation", focus:"Navigation – Interaction – Motion", year:"2025", img:"/assets/nature/nature09.png" },
  { id:"HX_217", title:"Distortion Flow", focus:"Shaders – Motion – Web Effects", year:"2025", img:"/assets/nature/nature10.png" },
  { id:"HX_224", title:"Wave Motion Kit", focus:"GSAP – Scroll – Interaction", year:"2025", img:"/assets/nature/nature11.png" },
  { id:"HX_239", title:"Layered Depth", focus:"3D UI – Motion – Visuals", year:"2025", img:"/assets/nature/nature12.png" },

  { id:"HX_249", title:"Morph Grid", focus:"Layout Systems – Animation", year:"2024", img:"/assets/nature/nature01.png" },
  { id:"HX_256", title:"Ribbon Motion", focus:"Motion UI – Effects – Scroll", year:"2024", img:"/assets/nature/nature02.png" },
  { id:"HX_263", title:"Orbit Elements", focus:"Creative Motion – WebGL", year:"2024", img:"/assets/nature/nature03.png" },
  { id:"HX_275", title:"Fluid Showcase", focus:"Interactive Gallery – Motion", year:"2024", img:"/assets/nature/nature04.png" },
  { id:"HX_284", title:"Kinetic Typography", focus:"Text Motion – Typography", year:"2024", img:"/assets/nature/nature05.png" },
  { id:"HX_298", title:"Cylinder Motion", focus:"3D Motion – WebGL – UI", year:"2024", img:"/assets/nature/nature06.png" },
  { id:"HX_302", title:"Shader Portraits", focus:"Shaders – Creative Coding", year:"2024", img:"/assets/nature/nature07.png" },
  { id:"HX_314", title:"Infinite Ribbon", focus:"Loop Animation – Interaction", year:"2024", img:"/assets/nature/nature08.png" },
  { id:"HX_327", title:"Twist Dynamics", focus:"Motion Systems – Visual FX", year:"2024", img:"/assets/nature/nature09.png" },
  { id:"HX_339", title:"Spiral Interface", focus:"Immersive UI – Motion – Scroll", year:"2024", img:"/assets/nature/nature10.png" },
];