import HorizontalScroll from"@/components/HorizontalScrollSection/HorizontalScroll";
import React from"react";
import { ReactLenis } from"lenis/react";
const page = () => {
 return (
 <ReactLenis root>
 <div>
 <HorizontalScroll />
 </div>
 </ReactLenis>
 );
};

export default page;
