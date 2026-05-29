import RotationSlider from"@/components/Slider/RotationSlider/RotationSlider";
import LenisSmoothScroll from"@/components/SmoothScroll/LenisScroll";

export default function Page() {
  const images = [
 { src:"/assets/img/image10.jpg", text:"Initialize Motion Layer" },
 { src:"/assets/img/image02.webp", text:"Inject Depth Matrix" },
 { src:"/assets/img/image03.webp", text:"Sync Scroll Engine" },
 { src:"/assets/img/image04.png", text:"Calibrate Perspective" },
 { src:"/assets/img/image05.png", text:"Activate 3D Pipeline" },
 { src:"/assets/img/image06.png", text:"Bind Interaction Core" },
 { src:"/assets/img/image09.jpg", text:"Compute Visual Flow" },
 { src:"/assets/img/image08.jpg", text:"Render Adaptive Frames" },
 { src:"/assets/img/image01.webp", text:"Stabilize Motion Curve" },
 { src:"/assets/img/image07.png", text:"Optimize Transition Graph" },
 { src:"/assets/nature/nature10.png", text:"Deploy Experience Layer" },
 { src:"/assets/nature/nature13.png", text:"Finalize Hyperiux State" },
 ];

 return (
 <>
 <LenisSmoothScroll />
 <RotationSlider images={images} />
 </>
 );
}