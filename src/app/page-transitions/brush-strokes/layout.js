import BrushStrokesNavbar from '@/Components/PageTransitions/BrushStroke/BrushStrokesNavbar'
import BrushStrokesTransition from '@/Components/PageTransitions/BrushStroke/BrushStrokesTransition'
import React from 'react'

export default function layout({ children }) {
    return (
        <BrushStrokesTransition>
            <BrushStrokesNavbar />
            {children}
        </BrushStrokesTransition >
    )
}
