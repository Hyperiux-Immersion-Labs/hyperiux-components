import FlipHeader from '@/Components/PageTransitions/FlipTransition/FlipHeader'
import FlipTransition from '@/Components/PageTransitions/FlipTransition/FlipTransition'
import React from 'react'

export default function layout({ children }) {
    return (
        <FlipTransition config={{ strokeColor: '#DE4013', strokeWidth: 2, duration: .3 }}>
            <FlipHeader />
            {children}
        </FlipTransition >
    )
}
