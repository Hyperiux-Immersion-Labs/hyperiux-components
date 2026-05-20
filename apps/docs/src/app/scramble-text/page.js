import React from'react'
import ScrambleText from'@/components/TextAnims/ScrambleText'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <div className='h-[110vh] overflow-hidden flex items-center justify-center bg-white'>
 <div className='w-[60%] mx-auto'>
 <ScrambleText
 text="Design that doesn’t just look good — it feels inevitable."
 textSize="text-5xl"
 textColor="text-gray-900"
 align='left'
 />
 </div>
 </div>

 </>
 )
}

export default page