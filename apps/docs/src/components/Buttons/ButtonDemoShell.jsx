import Image from"next/image";

export function ButtonDemoShell({
 title,
 backgroundSrc,
 children,
}) {
 return (
 <section className="relative z-999 h-screen overflow-hidden px-6 py-20 text-white">
 <div className="relative z-1 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-center gap-16">
 <div className="space-y-4 text-center">
 <p className="text-xs uppercase tracking-[0.4em] text-white/60">
 Hyperiux Button Demo
 </p>
 <h1 className="text-5xl font-medium max-sm:text-4xl">{title}</h1>
 </div>

 <div className="flex min-h-64 w-full items-center justify-center rounded-4xl border border-white/10 bg-black/20 px-8 py-12 backdrop-blur-sm max-sm:px-4">
 {children}
 </div>
 </div>

 <div className="fixed inset-0 -z-10">
 <Image
 src={backgroundSrc}
 alt={title}
 className="h-full w-full object-cover"
 width={1920}
 height={1080}
 priority
 />
 <div className="absolute inset-0 bg-black/45" />
 </div>
 </section>
 );
}
