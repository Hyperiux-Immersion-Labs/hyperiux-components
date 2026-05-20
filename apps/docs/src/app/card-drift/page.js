import React from'react'
import DraggableTestimonial from'@/components/Testimonial/DraggableTestimonial'

const page = () => {
 return (
 <>
 <DraggableTestimonial
 data={testimonials}
 bgColor="bg-black"
 bgTextColor="text-white/10"
 cardBg="bg-indigo-600"
 cardTextColor="text-white"
 barBg="bg-neutral-800"
 />
 </>
 )
}

export default page

const testimonials = [
 {
 year:"2024",
 tag:"PRODUCT HUNT",
 text:"Hyperiux drops interface experiences that feel faster than thought.",
 },
 {
 year:"2024",
 tag:"DESIGN WEEK",
 text:"Hyperiux blends motion, interaction, and storytelling into next-gen UI systems.",
 },
 {
 year:"2025",
 tag:"TECHCRUNCH",
 text:"Hyperiux is redefining how users feel digital products, not just use them.",
 },
 {
 year:"2025",
 tag:"AWWWARDS",
 text:"Hyperiux pushes the boundaries of immersive web experiences.",
 },
 {
 year:"2025",
 tag:"CREATIVE BLOQ",
 text:"From micro-interactions to full-scale motion systems, Hyperiux builds interfaces that hit different.",
 },
];
