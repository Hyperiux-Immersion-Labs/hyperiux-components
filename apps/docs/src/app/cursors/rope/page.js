import React from'react'
import RopeCursor from'@/components/cursors/RopeCursor'
export default function page() {
 return (
 <div className='h-screen w-full bg-[#F1EADE] text-[#bda985] overflow-hidden'>
 <RopeCursor ropeColor='#bda985' ropeWidth={2} ropeOpacity={0.6} segmentLength={0} segmentCount={8} />
 <div className='flex items-center justify-center flex-col h-full pointer-events-none'>
 <p className='text-[bda985] text-lg text-center'>Rope Cursor</p>
 <p className='opacity-90 text-xs text-center'>(Move your cursor around to see the rope)</p>
 </div>
 </div>
 )
}
