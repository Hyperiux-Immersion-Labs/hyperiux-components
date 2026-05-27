import React from'react'
import CounterThree from'@/components/Counters/CounterThree'

const page = () => {
 return (
 <>
 <div className='flex flex-col items-center justify-center h-screen w-screen gap-10 bg-white'>

 <h2 className='text-[3vw] max-sm:text-[10vw] text-[#111111]'>Watch It Count</h2>

 <CounterThree
 value="246"
 duration={2}
 fontWeight='medium'
 textColor="#021A54"
 textSize="text-[8vw] max-sm:text-[15vw]"
/>
 </div>
 </>
 )
}

export default page