import React from'react'
import InfiniteSlider from'@/components/Slider/CircularSlider'

const page = () => {
const items = [
  {
    url: "/assets/dark/image01.png",
    description: "IMAGE 01",
  },
  {
    url: "/assets/dark/image02.png",
    description: "IMAGE 02",
  },
  {
    url: "/assets/dark/image03.png",
    description: "IMAGE 03",
  },
  {
    url: "/assets/dark/image04.png",
    description: "IMAGE 04",
  },
  {
    url: "/assets/dark/image05.png",
    description: "IMAGE 05",
  },
  {
    url: "/assets/dark/image06.png",
    description: "IMAGE 06",
  },
  {
    url: "/assets/dark/image07.png",
    description: "IMAGE 07",
  },
  {
    url: "/assets/dark/image08.png",
    description: "IMAGE 08",
  },
  {
    url: "/assets/dark/image19.png",
    description: "IMAGE 09",
  },
  {
    url: "/assets/dark/image10.png",
    description: "IMAGE 10",
  },
  {
    url: "/assets/dark/image11.png",
    description: "IMAGE 11",
  },
  {
    url: "/assets/dark/image12.png",
    description: "IMAGE 12",
  },
  {
    url: "/assets/dark/image13.png",
    description: "IMAGE 13",
  },
  {
    url: "/assets/dark/image14.png",
    description: "IMAGE 14",
  },
  {
    url: "/assets/dark/image15.png",
    description: "IMAGE 15",
  },
  {
    url: "/assets/dark/image16.png",
    description: "IMAGE 16",
  },
  {
    url: "/assets/dark/image17.png",
    description: "IMAGE 17",
  },
  {
    url: "/assets/dark/image18.png",
    description: "IMAGE 18",
  },
  {
    url: "/assets/dark/image09.png",
    description: "IMAGE 19",
  },
  {
    url: "/assets/dark/image20.png",
    description: "IMAGE 20",
  },
  {
    url: "/assets/dark/image21.png",
    description: "IMAGE 21",
  },
];

 return (
 <div>
 <InfiniteSlider items={items} />
 </div>
 )
}

export default page