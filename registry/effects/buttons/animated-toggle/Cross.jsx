"use client"

const Cross = ({
 isActive = false,
 size = 24,
 className ="",
}) => {
 return (
 <div
 className={`flex items-center relative justify-center hover:rotate-180 group-hover:rotate-180 duration-300 ${className}`}
 style={{ width: size, height: size, transform: isActive ?'rotate(315deg)' :'rotate(180deg)' }}
 >
 <span
 className='absolute block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out'
 />
 <span
 className='absolute block w-full h-0.5 bg-current transition-transform rotate-90 duration-300 ease-in-out'
 />
 </div>
 );
}

export default Cross