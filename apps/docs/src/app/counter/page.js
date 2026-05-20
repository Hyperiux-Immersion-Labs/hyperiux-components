import React from'react'
import CounterOne from'@/components/Counters/CounterOne'

const page = () => {
 return (
 <>

 <div className='h-screen bg-white flex flex-col gap-10 items-center justify-center'>

 <h2 className="text-[3vw] max-sm:text-[5vw] max-sm:w-[90%] text-[#111111] text-center tablet:text-[5vw] mobile:text-[8vw]">
 Trusted by Hundreds Worldwide
</h2>

 <CounterOne
 textColor="#021A54"
 textSize="text-[8vw]"
 fontWeight="normal"
 stats={[
 { value:"936", suffix:"" },
 ]}
/>
 </div>
 </>
 )
}

export default page