import React from 'react'
import Image from 'next/image'

const Btn = () => {

  
  return (
    
        <div className='relative group h-[2vw] w-[2vw] mobile:h-[5vw] mobile:w-[5vw] overflow-hidden '>
  {/* Top arrow - visible by default, moves down on hover */}
  <div className='absolute inset-0 mobile:top-[-10%] transition-transform duration-300 ease-in-out translaye-y-[-5vw]  group-hover:translate-y-[2vw] h-[2vw] w-[2vw] mobile:h-[6vw] mobile:w-[6vw]'>
    <Image
      src='/assets/curveplane/arrow-down.svg' 
      width={400} 
      height={400} 
      alt='Arrow up' 
      className='w-full h-full object-cover'
    />
  </div>

  {/* Bottom arrow - hidden by default, moves in on hover */}
  <div className='absolute inset-0 translate-y-[2vw] transition-transform duration-300 ease-in-out group-hover:translate-y-0 h-[2vw] w-[2vw] mobile:w-[6vw] mobile:h-[6vw]'>
    <Image
      src='/assets/curveplane/arrow-down.svg' 
      width={400} 
      height={400} 
      alt='Arrow down' 
      className='w-full h-full'
    />
  </div>
</div>

     
  )
}

export default Btn