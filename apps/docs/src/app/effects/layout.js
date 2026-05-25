
import ChessGridTransition from'@/components/showcase/transitions/ChessGrids/ChessGridTransition'
import PixelRandom from '@/components/showcase/transitions/PixelRandom/PixelRandomTransition'
import React from'react'

export default function layout({ children }) {
 return (
 <PixelRandom color='#ff5f00' >
     {/* <PixelRandom color='#ffffff' > */}
 {children}
 </PixelRandom>
 )
}
