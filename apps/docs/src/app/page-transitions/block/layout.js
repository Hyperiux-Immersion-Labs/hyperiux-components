import React from'react'
import BlockHeader from'@/components/showcase/transitions/HorizontalBlock/BlockHeader'
import BlockTransition from'@/components/showcase/transitions/HorizontalBlock/BlockTransition'

export default function layout({ children }) {
 return (
 <BlockTransition>
 <BlockHeader />
 {children}
 </BlockTransition>
 )
}
