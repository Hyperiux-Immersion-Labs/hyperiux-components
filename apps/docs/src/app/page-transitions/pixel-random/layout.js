import React from 'react'
import PixelRandomHeader from '@/components/showcase/transitions/PixelRandom/PixelRandomHeader'
import PixelRandomTransition from '@/components/showcase/transitions/PixelRandom/PixelRandomTransition'

export default function layout({ children }) {
  return (
    <PixelRandomTransition>
      <PixelRandomHeader />
      {children}
    </PixelRandomTransition>
  )
}
