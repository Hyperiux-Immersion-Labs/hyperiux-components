import ScreenPaintCanvas from"@/components/ScreenPaintCanvas.jsx";
import Image from"next/image";

export default function Page() {
 return (
 <>
 <ScreenPaintCanvas />
 <div className="h-full bg-black w-screen flex flex-col gap-24 p-24">
 {['image01.webp','image02.webp','image03.webp'].map((src, index) => (
 <Image key={index} width={1920} height={1080} src={`/assets/img/${src}`} alt={`Image ${index + 1}`} />
 ))}
 </div>
 </>
 )
}