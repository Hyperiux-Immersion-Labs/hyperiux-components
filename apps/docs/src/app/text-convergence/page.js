import React from'react'
import TextBreak from'@/components/TextBreak/TextBreak'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <TextBreak
 text="Build faster. Animate better. Ship smarter. Hyperiux UI gives you the tools to create high-performance interfaces that look premium and feel effortless."
 bgColor="bg-[#111111]"
 textColor="text-[#4F39F6]"
 />
 </>
 )
}

export default page