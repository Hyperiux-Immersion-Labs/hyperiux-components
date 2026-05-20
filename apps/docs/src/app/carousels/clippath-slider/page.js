import React from'react'
import ClippathSlider from'@/components/Slider/ClippathSlider'

const page = () => {
 return (
 <>
 <ClippathSlider slides={slides} />
 </>
 )
}

export default page

const slides = [
  {
    name: "Motion Systems",
    tags: ["Animation", "UI", "GSAP"],
    description:
      "Crafting immersive motion-driven interfaces with smooth transitions, interactive timelines, and modern animation systems.",
    image: "/assets/img/image01.webp",
  },
  {
    name: "Creative Components",
    tags: ["Components", "React", "Design"],
    description:
      "A curated collection of expressive UI components designed for futuristic web experiences and rapid development.",
    image: "/assets/img/image02.webp",
  },
  {
    name: "Visual Interactions",
    tags: ["Effects", "UX"],
    description:
      "Building visually rich interactions with hover effects, layered depth, dynamic layouts, and fluid user feedback.",
    image: "/assets/nature/nature04.png",
  },
  {
    name: "Future Interfaces",
    tags: ["UI", "Web", "Motion"],
    description:
      "Exploring next-generation interface patterns that blend cinematic motion with minimal and functional design.",
    image: "/assets/img/image03.webp",
  },
  {
    name: "Design Engine",
    tags: ["Systems", "Design", "Code"],
    description:
      "Creating scalable design systems and reusable interface architectures optimized for modern frontend workflows.",
    image: "/assets/nature/nature13.png",
  },
  {
    name: "Scroll Experiences",
    tags: ["Scroll", "Animation", "Story"],
    description:
      "Designing immersive scroll-based storytelling experiences powered by fluid motion and seamless transitions.",
    image: "/assets/nature/nature10.png",
  },
  {
    name: "Interactive Layers",
    tags: ["3D", "Effects", "Visuals"],
    description:
      "Combining lighting, gradients, and layered compositions to create premium interactive web experiences.",
    image: "/assets/img/image06.png",
  },
];