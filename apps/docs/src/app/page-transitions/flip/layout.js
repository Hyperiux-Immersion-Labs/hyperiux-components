import FlipHeader from'@/components/showcase/transitions/Flip/FlipHeader'
import FlipTransition from'@/components/showcase/transitions/Flip/FlipTransition'
import React from'react'

export default function layout({ children }) {
 return (
 <FlipTransition config={{ strokeColor:'#DE4013', strokeWidth: 2, duration: .3 }}>
 <FlipHeader />
 {children}
 </FlipTransition>
 )
}