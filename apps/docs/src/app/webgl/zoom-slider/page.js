import ZoomSlider from '@/components/Slider/ZoomSlider';
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll';
import React from 'react'

const page = () => {
 return (
 <>
 <LenisSmoothScroll />
 <ZoomSlider images={sliderData} />
 </>
 )
}

export default page

export const sliderData = [
 {
 number:'01',
 src:'/assets/abstract/image01.png',
 title:'AURA',
 desc:'Soft light and atmospheric tones',
 },
 {
 number:'02',
 src:'/assets/abstract/image07.png',
 title:'DRIFT',
 desc:'Floating through silence',
 },
 {
 number:'03',
 src:'/assets/abstract/image03.png',
 title:'FORM',
 desc:'Shapes carved by light',
 },
 {
 number:'04',
 src:'/assets/abstract/image09.png',
 title:'FLOW',
 desc:'Smooth transitions in motion',
 },
 {
 number:'05',
 src:'/assets/abstract/image05.png',
 title:'DEPTH',
 desc:'Layers and visual weight',
 },
 {
 number:'06',
 src:'/assets/abstract/image06.png',
 title:'ENERGY',
 desc:'Movement captured in time',
 },
 {
 number:'07',
 src:'/assets/abstract/image02.png',
 title:'GLITCH',
 desc:'Breaking visual boundaries',
 },
 {
 number:'08',
 src:'/assets/abstract/image08.png',
 title:'FRAME-X',
 desc:'Cinematic still frame',
 },
 {
 number:'09',
 src:'/assets/abstract/image04.png',
 title:'LIGHTPLAY',
 desc:'Contrast and highlights',
 },
 {
 number:'10',
 src:'/assets/abstract/image05.png',
 title:'MINIMAL',
 desc:'Less but stronger',
 },
];