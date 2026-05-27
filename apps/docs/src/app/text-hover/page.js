import React from'react'
import TextHover from'@/components/TextHover/TextHover'

const data = [
  {
    label: "UI Components",
    description:
      "Beautifully crafted components built for modern Next.js and React applications.",
  },
  {
    label: "Text Animations",
    description:
      "Creative headline effects, reveal animations, and smooth typography interactions.",
  },
  {
    label: "Background Effects",
    description:
      "Futuristic grids, gradients, particles, and immersive animated backgrounds.",
  },
  {
    label: "Scroll Animations",
    description:
      "Smooth scroll-triggered interactions and cinematic motion experiences.",
  },
  {
    label: "Buttons & Hover FX",
    description:
      "Premium buttons, magnetic interactions, and modern hover micro-interactions.",
  },
  {
    label: "Page Transitions",
    description:
      "Fluid route transitions and immersive navigation animations for modern apps.",
  },
  {
    label: "3D Experiences",
    description:
      "Interactive WebGL, Three.js, and motion-driven visual experiences.",
  },
  {
    label: "Creative Layouts",
    description:
      "Modern sections, bento grids, hero layouts, and showcase-ready designs.",
  },
  {
    label: "Developer Experience",
    description:
      "Reusable, customizable, and production-ready UI built for fast development.",
  },
];

const page = () => {
 return (
 <>

 <div className='h-screen w-full bg-white'>
 <TextHover
 data={data}
 bgColor="#0a0a0a"
 textColor="#ffffff"
 />
 
 </div>
 </>
 )
}

export default page


