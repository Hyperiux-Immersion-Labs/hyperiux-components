import React from'react'
import Testimonial from'@/components/Testimonial/Testimonial'

const page = () => {
 return (
 <>
 <div className='h-screen bg-white'>

 <Testimonial testimonials={data} bgColor='#edeae2' />
 </div>
 </>
 )
}

export default page

const data = [
 {
 quote:"Design that feels completely effortless — yet performs like it’s been engineered with precision. Every interaction flows naturally, every detail feels intentional, and the entire experience just makes sense without the user ever needing to think about it.",
 name:"Aarav Mehta",
 title:"Product Lead, InnovateX",
 image:"/assets/img/distortion.jpg",
 },
 {
 quote:"Hyperiux didn’t just improve our UI — it transformed the way users interact with our product. It pushed us to rethink our entire approach to design, making every screen more intuitive, more fluid, and far more engaging than we thought possible.",
 name:"Sofia Patel",
 title:"Frontend Developer",
 image:"/assets/img/image01.webp",
 },
 {
 quote:"Everything feels intentional. Every hover, every transition, every detail — it’s crafted, not just built.",
 name:"Rohan Kapoor",
 title:"UX Designer, PixelCraft",
 image:"/assets/img/image02.webp",
 },
 {
 quote:"We didn’t just ship faster — we shipped something we’re genuinely proud of. The design quality improved, the development flow became smoother, and for the first time, everything felt aligned between vision and execution.",
 name:"Ananya Sharma",
 title:"Founder, Buildspace Studio",
 image:"/assets/img/image03.webp",
 },
 {
 quote:"It’s rare to find a UI system that’s both aesthetic and brutally practical. This one just gets it.",
 name:"Dev Malhotra",
 title:"Full Stack Engineer",
 image:"/assets/img/image01.webp",
 },
];