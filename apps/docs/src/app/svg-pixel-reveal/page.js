import PixelImage from"@/components/PixelatedSvg/PixelImage";
import LenisSmoothScroll from"@/components/SmoothScroll/LenisScroll";

export default function Page() {
 return (
 <>
 <LenisSmoothScroll />
 <main className="h-full bg-neutral-950 text-white">
 <section className="flex min-h-[50vh] max-sm:h-[30vh] items-center justify-center px-6">
 <div className="max-w-xl text-center">
 <p className="text-xs uppercase tracking-[0.3em] text-white/50">
 Scroll Down
 </p>
 <h1 className="mt-4 max-sm:text-4xl font-semibold tracking-tight text-6xl">
 Pixelated to crisp on scroll
 </h1>
 </div>
 </section>

 <section className="flex min-h-[50vh] max-sm:min-h-[70vh] items-center justify-center px-6 py-20">
 <PixelImage
 src="/assets/img/image06.png"
 alt="Nature scene"
 priority
 initialPixelSize={22}
 finalPixelSize={1}
 // start="top 80%"
 // end="bottom 35%"
 className=" w-full max-sm:max-w-md h-[70vh] max-w-xl"
 />
 </section>
 </main>
 </>
 );
}
