import React from'react'
import ExpandableCards from'@/components/ExpandableCards/ExpandableCards'

const page = () => {
 return (
 <>
 <div className='h-screen w-screen flex items-center flex-col gap-6 justify-center bg-white'>
 <h2 className='px-[2vw] max-sm:w-[90%] mx-auto w-[80%] text-center text-[#111111] text-[2.5vw] max-sm:text-[5vw] max-sm:pt-[8vw]'>
 Experience the Magic of Nature with Our Expandable Cards: Click to Unfold Stunning Landscapes and Captivating Stories!
 </h2>

 <ExpandableCards
 heading="Explore Nature"
 clickLabel="Tap"
 items={cardsData}
 overlayColor='#F3E4C9'
 expandedTextColor="white"
 expandedBgColor="#A98B76"
 />
 </div>
 </>
 )
}

export default page

 const cardsData = [
 {
 num:"01",
 title:"Silent Forest Escape",
 para:"Lose yourself in deep greens where every breath feels lighter and every step slows time.",
 image:"/assets/nature/nature01.png",
 },
 {
 num:"02",
 title:"Golden Horizon",
 para:"Chase sunsets that melt into the sky, painting calm across your thoughts.",
 image:"/assets/nature/nature02.png",
 },
 {
 num:"03",
 title:"Mountain Air",
 para:"Climb above the chaos and find clarity where the world feels infinite.",
 image:"/assets/nature/nature03.png",
 },
 {
 num:"04",
 title:"Ocean Rhythm",
 para:"Let the waves reset your mind, one crash at a time.",
 image:"/assets/nature/nature04.png",
 },
 {
 num:"05",
 title:"Skyline Serenity",
 para:"Where clouds drift endlessly and your thoughts finally find space to breathe.",
 image:"/assets/nature/nature05.png",
}
];