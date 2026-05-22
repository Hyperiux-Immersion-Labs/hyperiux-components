import React from'react'
import ListHover from'@/components/ListHover/ListHover'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <div className='flex items-center flex-col gap-20 max-sm:gap-20 max-sm:py-[15%] justify-center h-screen max-sm:h-full bg-neutral-900'>

 <h2 className='font-mono max-sm:text-center max-sm:px-10  text-white text-3xl'>
 Elevating interaction through motion
 </h2>

 <ListHover items={projects} />
 </div>
 </>
 )
}

export default page;

const projects = [
  {
    client:"AURORA UI",
    platform:"NEXT.JS",
    services:"Motion Design, GSAP, Page Transitions, UI Systems",
    img:"/assets/gradient/image1.png",
  },
  {
    client:"NEON FLOW",
    platform:"REACT",
    services:"Interactive UI, Scroll Animations, Effects Library",
    img:"/assets/gradient/image2.png",
  },
  {
    client:"GLASSMORPH",
    platform:"NEXT.JS",
    services:"Glass UI, Components, Motion Architecture",
    img:"/assets/gradient/image3.png",
  },
  {
    client:"VOID SYSTEM",
    platform:"CUSTOM WEBGL",
    services:"Shaders, Creative Development, Visual Effects",
    img:"/assets/gradient/image4.png",
  },
  {
    client:"HYPER SCROLL",
    platform:"FRAMER MOTION",
    services:"Scroll Storytelling, Motion Systems, Interactions",
    img:"/assets/gradient/image5.png",
  },
  {
    client:"KINETIC LAB",
    platform:"THREE.JS",
    services:"3D Interfaces, Motion UI, WebGL Experiences",
    img:"/assets/gradient/image6.png",
  },
  {
    client:"PIXEL GRID",
    platform:"TAILWIND CSS",
     services:"Design Systems, UI Engineering, Responsive Layouts",
    img:"/assets/gradient/image7.png",
  },
  {
    client:"MOTION CORE",
    platform:"HEADLESS CMS",
    services:"Reusable Components, Motion Engine, Performance",
    img:"/assets/gradient/image8.png",
  },
  {
    client:"INTERFACE X",
    platform:"NEXT.JS",
       services:"Immersive UI, Creative Coding, Transitions, Effects",
    img:"/assets/gradient/image9.png",
  },
  {
    client:"HYPERIUX",
    platform:"UI LIBRARY",
   services:"Animations, Interactive Components, Futuristic Experiences",
    img:"/assets/gradient/image10.png",
  },
];