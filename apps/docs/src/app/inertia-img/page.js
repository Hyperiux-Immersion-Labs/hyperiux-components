import React from"react";
import InertiaImage from"@/components/InertiaImg/InertiaImg";

const images = [
"/assets/without-bg/strawberry.png",
"/assets/nature/nature02.png",
"/assets/without-bg/kunai.png",
"/assets/nature/nature04.png",
"/assets/nature/nature05.png",
"/assets/without-bg/fire.png",
"/assets/nature/nature07.png",
"/assets/without-bg/strawberry.png",
"/assets/without-bg/kunai.png",
"/assets/nature/nature13.png",
"/assets/without-bg/strawberry.png",
"/assets/without-bg/fire.png",
];

const page = () => {
 return (
 <main className="min-h-screen w-full bg-black px-6 py-12 text-white md:px-10">
 <div className="mx-auto flex w-full flex-col gap-14">
 <div className="max-w-2xl mx-auto text-center">
 <p className="text-xl uppercase tracking-[0.35em] text-white/55">
 Inertia Image
 </p>
  </div>

 <InertiaImage images={images} />
 </div>
 </main>
 );
};

export default page;
