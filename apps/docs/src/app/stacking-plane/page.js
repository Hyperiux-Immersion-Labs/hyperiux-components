import React from'react'
import StackingPlane from'@/components/StackingPlane/StackingPlane'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const STACKING_PLANE_IMAGES = [
"/assets/nature/nature01.png",
"/assets/nature/nature02.png",
"/assets/nature/nature03.png",
"/assets/nature/nature04.png",
"/assets/nature/nature05.png",
"/assets/nature/nature06.png",
"/assets/nature/nature07.png",
"/assets/nature/nature08.png",
"/assets/nature/nature09.png",
"/assets/nature/nature10.png",
];

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <StackingPlane images={STACKING_PLANE_IMAGES} bgColor='black' />
 </>
 )
}

export default page