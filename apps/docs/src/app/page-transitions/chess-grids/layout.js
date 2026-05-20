import ChessGridHeader from'@/components/showcase/transitions/ChessGrids/ChessGridHeader'
import ChessGridTransition from'@/components/showcase/transitions/ChessGrids/ChessGridTransition'
import React from'react'

export default function layout({ children }) {
 return (
 <ChessGridTransition >
 <ChessGridHeader />
 {children}
 </ChessGridTransition>
 )
}
