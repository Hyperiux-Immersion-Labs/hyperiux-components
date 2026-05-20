import React from'react'
import StripSlider from'@/components/Slider/StripSlider'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const items = [
 {
 id:'item-0',
 url:'/assets/nature/nature01.png',
 text:'Nature 1',
 atlasIndex: 0,
 colors: ['#333','#aaa']
 },
 {
 id:'item-1',
 url:'/assets/nature/nature02.png',
 text:'Nature 2',
 atlasIndex: 1,
 colors: ['#333','#aaa']
 },
 {
 id:'item-2',
 url:'/assets/nature/nature03.png',
 text:'Nature 3',
 atlasIndex: 2,
 colors: ['#333','#aaa']
 },
 {
 id:'item-3',
 url:'/assets/nature/nature04.png',
 text:'Nature 4',
 atlasIndex: 3,
 colors: ['#333','#aaa']
 },
 {
 id:'item-4',
 url:'/assets/nature/nature05.png',
 text:'Nature 5',
 atlasIndex: 4,
 colors: ['#333','#aaa']
 },
 {
 id:'item-5',
 url:'/assets/nature/nature06.png',
 text:'Nature 6',
 atlasIndex: 5,
 colors: ['#333','#aaa']
 },
 {
 id:'item-6',
 url:'/assets/nature/nature07.png',
 text:'Nature 7',
 atlasIndex: 6,
 colors: ['#333','#aaa']
 },
 {
 id:'item-7',
 url:'/assets/nature/nature08.png',
 text:'Nature 8',
 atlasIndex: 7,
 colors: ['#333','#aaa']
 },
 {
 id:'item-8',
 url:'/assets/nature/nature09.png',
 text:'Nature 9',
 atlasIndex: 8,
 colors: ['#333','#aaa']
 },
 {
 id:'item-9',
 url:'/assets/nature/nature10.png',
 text:'Nature 10',
 atlasIndex: 9,
 colors: ['#333','#aaa']
 },
 {
 id:'item-10',
 url:'/assets/nature/nature11.png',
 text:'Nature 11',
 atlasIndex: 10,
 colors: ['#333','#aaa']
 },
 {
 id:'item-11',
 url:'/assets/nature/nature12.png',
 text:'Nature 12',
 atlasIndex: 11,
 colors: ['#333','#aaa']
 },
 {
 id:'item-12',
 url:'/assets/nature/nature13.png',
 text:'Nature 13',
 atlasIndex: 12,
 colors: ['#333','#aaa']
 },
 {
 id:'item-13',
 url:'/assets/nature/nature14.png',
 text:'Nature 14',
 atlasIndex: 13,
 colors: ['#333','#aaa']
 },
 { id:'item-14', url:'/assets/img/image01.webp', text:'Image 1', atlasIndex: 14, colors: ['#333','#aaa'] },
 { id:'item-15', url:'/assets/img/image02.webp', text:'Image 2', atlasIndex: 15, colors: ['#333','#aaa'] },
 { id:'item-16', url:'/assets/img/image03.webp', text:'Image 3', atlasIndex: 16, colors: ['#333','#aaa'] },
 { id:'item-17', url:'/assets/img/image04.png', text:'Image 4', atlasIndex: 17, colors: ['#333','#aaa'] },
 { id:'item-18', url:'/assets/img/image05.png', text:'Image 5', atlasIndex: 18, colors: ['#333','#aaa'] },
 { id:'item-19', url:'/assets/img/image06.png', text:'Image 6', atlasIndex: 19, colors: ['#333','#aaa'] },
 { id:'item-20', url:'/assets/img/image07.png', text:'Image 7', atlasIndex: 20, colors: ['#333','#aaa'] },
];

const page = () => {
 return (
 <div className="w-full h-screen bg-black">
 <LenisSmoothScroll />
 <StripSlider items={items} />
 </div>
 )
}

export default page