import React from'react'
import SmoothAnim from'@/components/ScrollAnimation/SmoothAnim'
import { ReactLenis } from"lenis/react";


const page = () => {
 return (

 <ReactLenis root options={{ infinite: true, }} >
 <div className='bg-white text-black/90'>
 <SmoothAnim images={images} />
 </div>
 </ReactLenis>
 )
}

export default page

const images = {
 section1Img:'/assets/img/image06.png',
 heroImg:'/assets/img/image05.png', // Section 2 flying hero image = grid's 2nd image
 overlayImg:'/assets/img/image06.png', // Overlay = grid's last image (LAST_INDEX = 24)
 gridImgs: [
'/assets/nature/nature01.png', // index 0

'/assets/img/image05.png',
'/assets/nature/nature03.png', // index 2 — matches heroImg
'/assets/nature/nature04.png', // index 3
'/assets/nature/nature05.png', // index 4
'/assets/nature/nature06.png', // index 5
'/assets/nature/nature07.png', // index 6
'/assets/nature/nature08.png', // index 7
'/assets/nature/nature09.png', // index 8
'/assets/nature/nature10.png', // index 9
'/assets/nature/nature11.png', // index 10
'/assets/nature/nature12.png', // index 11
'/assets/nature/nature13.png', // index 12
'/assets/img/image01.webp', // index 13
'/assets/img/image02.webp', // index 14
'/assets/img/image03.webp', // index 15
'/assets/img/image04.png', // index 16
'/assets/nature/nature02.png', // index 17
'/assets/nature/nature01.png', // index 18
'/assets/img/image07.png', // index 19
'/assets/nature/nature02.png', // index 20
'/assets/nature/nature10.png', // index 21
'/assets/nature/nature11.png', // index 22
'/assets/nature/nature12.png', // index 23
'/assets/img/image06.png', // index 24 — LAST_INDEX, matches overlayImg
 ],
}

