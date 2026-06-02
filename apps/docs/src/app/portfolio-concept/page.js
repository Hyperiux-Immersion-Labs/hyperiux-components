import { PortfolioConcept } from"@/components/Concept/PortfolioConcept";
import React from"react";
import { ReactLenis } from"lenis/react";

const IMAGE_POOL = [
 "/assets/gradient/image1.png",
 "/assets/gradient/image2.png",
 "/assets/gradient/image3.png",
 "/assets/gradient/image4.png",
 "/assets/gradient/image5.png",
 "/assets/gradient/image6.png",
 "/assets/gradient/image7.png",
 "/assets/gradient/image8.png",
 "/assets/gradient/image9.png",
 "/assets/gradient/image10.png",
 "/assets/gradient/image11.png",
 "/assets/gradient/image12.png",
 "/assets/gradient/image13.png",
 "/assets/gradient/image14.png",
 "/assets/gradient/image15.png",
 "/assets/dark/image01.png",
 "/assets/dark/image02.png",
 "/assets/dark/image03.png",
 "/assets/dark/image04.png",
 "/assets/dark/image05.png",
 "/assets/dark/image06.png",
 "/assets/dark/image07.png",
 "/assets/dark/image08.png",
 "/assets/dark/image09.png",
 "/assets/dark/image10.png",
 "/assets/dark/image11.png",
 "/assets/dark/image12.png",
 "/assets/dark/image13.png",
 "/assets/dark/image14.png",
 "/assets/dark/image15.png",
 "/assets/dark/image16.png",
 "/assets/dark/image17.png",
 "/assets/dark/image18.png",
 "/assets/dark/image19.png",
 "/assets/dark/image20.png",
 "/assets/dark/image21.png",
];

const PROJECT_NAMES = [
 "Nebula Drift",
 "Velvet Orbit",
 "Prism Bloom",
 "Midnight Aurora",
 "Chromatic Tide",
 "Ion Garden",
 "Lunar Gradient",
 "Violet Haze",
 "Echo Spectrum",
 "Noir Fluence",
 "Solar Jelly",
 "Plasma Atelier",
 "Hyperwave Studio",
 "Glassline",
 "Starlit Systems",
 "Pulse & Grain",
 "Arclight",
 "Soft Collision",
];

const page = () => {
 return (
 <ReactLenis root>
 <section className="w-screen h-fit">
 <PortfolioConcept images={IMAGE_POOL} projectNames={PROJECT_NAMES} />
 </section>
 </ReactLenis>
 );
};

export default page;
