import BrushStrokesNavbar from'@/components/showcase/transitions/BrushStroke/BrushStrokesNavbar'
import BrushStrokesTransition from'@/components/showcase/transitions/BrushStroke/BrushStrokesTransition'
import React from'react'

export default function layout({ children }) {
 return (
 <BrushStrokesTransition>
 <BrushStrokesNavbar />
 {children}
 </BrushStrokesTransition>
 )
}
