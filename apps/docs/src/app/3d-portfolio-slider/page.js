import React from'react'
import InfiniteSlider from'@/components/Slider/CircularSlider'

const page = () => {
const items = [
  {
    url: "/assets/dark/image01.png",
    description: "PORTFOLIO 01",
  },
  {
    url: "/assets/dark/image02.png",
    description: "PORTFOLIO 02",
  },
  {
    url: "/assets/dark/image03.png",
    description: "PORTFOLIO 03",
  },
  {
    url: "/assets/dark/image04.png",
    description: "PORTFOLIO 04",
  },
  {
    url: "/assets/dark/image05.png",
    description: "PORTFOLIO 05",
  },
  {
    url: "/assets/dark/image06.png",
    description: "PORTFOLIO 06",
  },
  {
    url: "/assets/dark/image07.png",
    description: "PORTFOLIO 07",
  },
  {
    url: "/assets/dark/image08.png",
    description: "PORTFOLIO 08",
  },
  {
    url: "/assets/dark/image19.png",
    description: "PORTFOLIO 09",
  },
  {
    url: "/assets/dark/image10.png",
    description: "PORTFOLIO 10",
  },
  {
    url: "/assets/dark/image11.png",
    description: "PORTFOLIO 11",
  },
  {
    url: "/assets/dark/image12.png",
    description: "PORTFOLIO 12",
  },
  {
    url: "/assets/dark/image13.png",
    description: "PORTFOLIO 13",
  },
  {
    url: "/assets/dark/image14.png",
    description: "PORTFOLIO 14",
  },
  {
    url: "/assets/dark/image15.png",
    description: "PORTFOLIO 15",
  },
  {
    url: "/assets/dark/image16.png",
    description: "PORTFOLIO 16",
  },
  {
    url: "/assets/dark/image17.png",
    description: "PORTFOLIO 17",
  },
  {
    url: "/assets/dark/image18.png",
    description: "PORTFOLIO 18",
  },
  {
    url: "/assets/dark/image09.png",
    description: "PORTFOLIO 19",
  },
  {
    url: "/assets/dark/image20.png",
    description: "PORTFOLIO 20",
  },
  {
    url: "/assets/dark/image21.png",
    description: "PORTFOLIO 21",
  },
];

 return (
 <div>
 <InfiniteSlider items={items} />
 </div>
 )
}

export default page