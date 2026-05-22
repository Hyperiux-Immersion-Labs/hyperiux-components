import StackToSpreadIntro from'@/components/Loaders/StackToSpreadIntro'
import React from'react'

export default function page() {
 return (
 <div id='DEMO UI' className='h-screen w-screen bg-zinc-900 relative'>
 <p className='absolute text-white text-4xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>DEMO UI</p>

 <StackToSpreadIntro />
 </div>
 )
}
