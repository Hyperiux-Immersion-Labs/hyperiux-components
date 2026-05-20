import CrosshairCursor from"@/components/CrosshairCursor/CrosshairCursor";

export default function Page() {
 return (
 <main className="crosshair-page w-screen h-screen bg-[#211951] text-[#826fffaa]">
 <CrosshairCursor
 lineSize={1500}
 thickness={0.5}
 lerpFactor={0.1}
 hideNativeCursor
 color="#F0F3FF"
 centerContent="•"
 />

 <h1 className="w-full h-full flex items-center justify-center text-[5.5vw] font-medium">
 Hover around
 </h1>
 </main>
 );
}