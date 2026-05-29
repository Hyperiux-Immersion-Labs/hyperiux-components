import React from 'react'
import CursorMove from '@/components/CursorMove/cursorMov'

const page = () => {
  return (
    <>
        <CursorMove
          text="Hello!"
          backgroundClassName="bg-zinc-950"
          paddingClassName="p-24"
          showCrosshair
          crosshairVariant="solid"
          crosshairClassName="bg-white/10"
          crosshairDashedDashLength={14}
          crosshairDashedGap={14}
          crosshairDashedColor="rgba(255,255,255,0.2)"
          showCursorDot
          cursorDotClassName="w-3 h-3 bg-orange-500 rounded-sm"
          textClassName="text-9xl text-orange-500 select-none leading-none"
          showCoordinates
          coordinatesTextClassName="text-xs text-white/40 tabular-nums"
          fontVariationMapping={{
            y: { name: "wght", min: 100, max: 900 },
          }}
          skewXRange={{ min: 0, max: -20 }}
          variableTextTransition="font-variation-settings 0.05s linear, transform 0.05s linear"
          variableTextTransformOrigin="bottom"
        />
    </>
  )
}

export default page
