import React from'react'
import UseImageAsTexture from"@/components/ScrollRigComponents/Utils/UseImageAsTexture";
import UseWebGLText from"@/components/ScrollRigComponents/Utils/UseWebGLText";

export default function Hero({fontUrl}) {
 return (
 <div className="relative min-h-screen w-full bg-transparent overflow-hidden px-[5vw] py-[5vw]">
 {/* NON-TRACKED ELEMENTS */}
 <div className="absolute top-[5vw] left-[5vw] w-fit z-9999! flex flex-col gap-2 pointer-events-auto">
 <UseWebGLText
 as="p"
 font={fontUrl}
 className="text-[10vw] leading-none font-normal"
 >
 IAM
 </UseWebGLText>
 <UseWebGLText
 as="p"
 font={fontUrl}
 className="text-[10vw] leading-none font-normal"
 >
 GAURAV
 </UseWebGLText>
 <div className="mt-8 flex flex-col gap-3 max-w-md">
 <UseWebGLText
 as="span"
 font={fontUrl}
 className="text-[1.5vw] leading-[1.2] tracking-wide"
 >
 I MAKE DESIGNS AND DEVELOP WEBSITES FOR PEOPLE AND HELP THEM TO
 GROW THEIR BUSINESS.
 </UseWebGLText>

 <button className="w-max mt-2 relative z-999! cursor-pointer pointer-events-auto text-xs px-4 py-2 bg-white text-black hover:bg-blue-700 hover:text-white duration-300 transition-all tracking-wider">
 BOOK A CALL
 </button>
 </div>
 </div>

 <UseImageAsTexture
 src="https://www.daspritam.in/dog.png"
 alt="dog"
 trackedWrapperClassName="absolute invisible top-[5vw] w-[4vw] h-auto right-[5vw] z-10"
 trackedImgClassName="object-contain h-full w-full opacity-0! pointer-events-none"
 />

 {/* ✅ Bottom text */}
 <div className="absolute right-[5vw] bottom-8 flex flex-col items-end z-10">
 <UseWebGLText
 as="span"
 font={fontUrl}
 className=" text-[10vw] leading-none"
 >
 CREATIVE
 </UseWebGLText>
 <UseWebGLText
 as="span"
 font={fontUrl}
 className=" text-[10vw] leading-none"
 >
 DEV
 </UseWebGLText>
 </div>
 </div>
 )
}
