import React from'react'
import SpotlightText from'@/components/SpotlightText/SpotlightText'

const page = () => {
 return (
 <>
 <div className="h-screen flex items-center mx-auto justify-center bg-black">

 <SpotlightText
 text={`Hyperiux UI is where design meets precision — a thoughtfully crafted component library built for developers who care about performance, aesthetics, and experience. Every interaction is intentional, every animation feels alive, and every component is designed to elevate modern interfaces beyond the ordinary.`}
 size="text-3xl"
 className="max-w-4xl mx-auto max-sm:w-[80%]"
/>

 </div>
 </>
 )
}

export default page

