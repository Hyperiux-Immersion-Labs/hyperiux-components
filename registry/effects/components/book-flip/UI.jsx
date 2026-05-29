'use client'
import { useEffect } from"react";
import { usePage } from"./PageContext";

export const UI = ({ images = [] }) => {
 const { page, setPage } = usePage();
  // Generate page count from images array
 const pageCount = Math.ceil((images.length || 0) / 2);

 useEffect(() => {
 try {
 const audio = new Audio("/assets/audio/page-flip-01a.mp3");
 audio.play().catch(() => {
 // Audio file not found or playback failed, silently continue
 });
 } catch (err) {
 // Silently handle audio errors
 }
 }, [page]);

 return (
 <>
 <main className=" pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
  <div className="w-full overflow-auto pointer-events-auto flex justify-center">
 <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
 {Array.from({ length: pageCount + 1 }).map((_, index) => (
 <button
 key={index}
 className={`border-transparent cursor-pointer transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
 index === page
 ?"bg-white/90 text-black"
 :"bg-black/30 text-white"
 }`}
 onClick={() => setPage(index)}
 >
 {index === 0 ?"Cover" : index === pageCount ?"Back Cover" : `Page ${index}`}
 </button>
 ))}
 </div>
 </div>
 </main>

 {/* <div className="fixed inset-0 bg-black flex items-start justify-center pt-20 select-none">
 </div> */}
 </>
 );
};