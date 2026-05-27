
import StorytellingAnim from'@/components/TextAnim/StorytellingAnim'
import React from'react'

const page = () => {
 return (
 <>
 <StorytellingAnim
 texts={[
"Stop rebuilding the same UI patterns and start creating experiences that actually stand out",
"Craft interfaces that feel fast, intuitive, and undeniably premium across every screen",
"Move from idea to polished product without fighting your components every step of the way",
"Your design system should accelerate you, not slow you down"
 ]}
 images={[
  ["/assets/img/image01.webp","/assets/img/image02.webp","/assets/img/image03.webp"],
 ["/assets/parallax-img/p-img-1.jpg","/assets/parallax-img/p-img-2.jpg","/assets/parallax-img/p-img-3.jpg","/assets/parallax-img/p-img-4.jpg"],
 ["/assets/menu/beach.jpg"],
 ["/assets/menu/spider-man.jpg"],
 ]}
 textSize="text-[2.5vw]"
 mobileTextSize="text-[5vw]"
/>

 </>
 )
}

export default page