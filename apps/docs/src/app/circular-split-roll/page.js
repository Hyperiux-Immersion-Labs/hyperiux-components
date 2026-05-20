"use client";

import CircularScrollShowcase from"@/components/CircularSplitRoll/CircularSplitRoll";
import React from"react";
import { ReactLenis } from"lenis/react";

const showcaseItems = [
 { title:"Vuelta", image:"/img/1.png", alt:"Vuelta lamp" },
 { title:"JH42", image:"/img/2.png", alt:"JH42 lamp" },
 { title:"Hay", image:"/img/3.png", alt:"Hay product" },
 { title:"Teresa", image:"/img/4.png", alt:"Teresa lamp" },
 { title:"Tahiti", image:"/img/5.png", alt:"Tahiti lamp" },
 { title:"Akari 1A", image:"/img/6.png", alt:"Akari 1A lamp" },
 { title:"Nessino", image:"/img/7.png", alt:"Nessino lamp" },
 { title:"Panthella", image:"/img/8.png", alt:"Panthella lamp" },
 { title:"Bellhop", image:"/img/9.png", alt:"Bellhop lamp" },
 { title:"Flowerpot", image:"/img/10.png", alt:"Flowerpot lamp" },
];

export default function Page() {
 return (
 <ReactLenis root options={{infinite: true,}} >
 <main>
 <CircularScrollShowcase
 items={showcaseItems}
 sectionHeight={140}
 leftRadiusX={500}
 leftRadiusY={500}
 rightRadiusX={500}
 rightRadiusY={500}
 imageCardWidth={205}
 imageCardHeight={205}
 />
 </main>
 </ReactLenis>
 );
}
