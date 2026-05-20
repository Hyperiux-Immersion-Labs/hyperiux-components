import InfiniteGridTunnel from'@/components/GridTunnel/GridTunnel';
import React from'react'

const images = [
  "/assets/img/distortion.jpg",
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
  "/assets/img/image06.png",
  "/assets/img/image07.png",
  "/assets/img/image08.jpg",
  "/assets/img/image09.jpg",
  "/assets/img/image10.jpg",

    "/assets/nature/nature06.png",
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

   "/assets/img/distortion.jpg",
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
  "/assets/img/image06.png",
  "/assets/img/image07.png",
  "/assets/img/image08.jpg",
  "/assets/img/image09.jpg",
  "/assets/img/image10.jpg",

    "/assets/nature/nature06.png",
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
 <InfiniteGridTunnel images={images}/>
 </>
 )
}

export default page