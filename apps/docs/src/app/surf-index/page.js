import LenisSmoothScroll from"@/components/SmoothScroll/LenisScroll";
import InfiniteScrollSlider from"@/components/Surf/SurfIndex";

export default function Page() {
 const images = [
 {
 number:'01',
 src:'/assets/nature/nature01.png',
 title:'INSPIRE (JAN)',
 desc:'Exploring nature and calm beginnings',
 },
 {
 number:'02',
 src:'/assets/nature/nature02.png',
 title:'INSPIRE (FEB)',
 desc:'Moments of stillness and beauty',
 },
 {
 number:'03',
 src:'/assets/nature/nature03.png',
 title:'INSPIRE (MAR)',
 desc:'Textures, light and motion',
 },
 {
 number:'04',
 src:'/assets/nature/nature04.png',
 title:'INSPIRE (APR)',
 desc:'Flowing forms and soft tones',
 },
 {
 number:'05',
 src:'/assets/nature/nature05.png',
 title:'INSPIRE (MAY)',
 desc:'Warmth, depth and perspective',
 },
 {
 number:'06',
 src:'/assets/nature/nature06.png',
 title:'INSPIRE (JUNE)',
 desc:'Energy, waves and movement',
 },
 {
 number:'07',
 src:'/assets/img/distortion.jpg',
 title:'DISTORT',
 desc:'Abstract visuals and distortion',
 },
 {
 number:'08',
 src:'/assets/img/image01.webp',
 title:'FRAME 01',
 desc:'Captured cinematic frame',
 },
 {
 number:'09',
 src:'/assets/img/image02.webp',
 title:'FRAME 02',
 desc:'Light and contrast study',
 },
 {
 number:'10',
 src:'/assets/img/image03.webp',
 title:'FRAME 03',
 desc:'Minimal composition',
 },
 ];
 return (
 <>
 <LenisSmoothScroll />
 <div className=" bg-white flex flex-col justify-center gap-20">
 <InfiniteScrollSlider images={images} />
 </div>
 </>
 );
}