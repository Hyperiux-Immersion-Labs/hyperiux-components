import React from'react'
import PixelHeader from'@/components/showcase/transitions/Pixels/PixelHeader'
import PixelTransition from'@/components/showcase/transitions/Pixels/PixelTransition'
import { Pi } from'lucide-react'

export default function layout({ children }) {
 return (
 <>
 <PixelTransition >
 <PixelHeader />
 {children}
 </PixelTransition>
 </>
 )
}
