import React from'react'
import SpotlightReveal from'@/components/SplotlightReveal/SpotlightReveal'

const page = () => {
 return (
 <>
 <SpotlightReveal
 beforeImage="/assets/reveal/scene2.png"
 afterImage="/assets/reveal/scene1.png"
 maskShape='ellipse'

/>
 </>
 )
}

export default page