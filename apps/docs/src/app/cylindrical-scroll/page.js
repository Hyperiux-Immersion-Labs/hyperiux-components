// import CylindricalScrollCards from"@/components/CylindricalScrollCards/CylindricalScrollCards";

import CylindricalScrollCards from"@/components/CylindricalScroll/CylindricalScroll";
import { ReactLenis } from"lenis/react";

const cards = [
 { id: 1, image:"/img/1.png", title:"Card 1" },
 { id: 2, image:"/img/2.png", title:"Card 2" },
 { id: 3, image:"/img/3.png", title:"Card 3" },
 { id: 4, image:"/img/4.png", title:"Card 4" },
 { id: 5, image:"/img/5.png", title:"Card 5" },
 { id: 6, image:"/img/6.png", title:"Card 6" },
];

export default function Page() {
 return (
 <ReactLenis root options={{infinite: true,}}>
 <main>
 <CylindricalScrollCards
 items={cards}
 cardWidth={210}
 cardHeight={290}
 verticalSpacing={105}
 snakeAmplitude={340}
 snakeTightness={1}
 depthAmplitude={200}
 scrollDistance={360}
 perspective={1900}
 scaleMin={0.72}
 yRotateStrength={1.0}
 zRotateStrength={0.0}
 maxYRotation={0}
 maxZRotation={0}
 />
 </main>
 </ReactLenis>
 );
}
