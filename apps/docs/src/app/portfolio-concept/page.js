import PortfolioConcept from"@/components/Concept/PortfolioConcept";
import React from"react";
import { ReactLenis } from"lenis/react";

const page = () => {
 return (
 <ReactLenis root>
 <section className="w-screen h-fit">
 <PortfolioConcept />
 </section>
 </ReactLenis>
 );
};

export default page;
