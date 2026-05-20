import { useRef } from"react";
import { UseCanvas, ScrollScene } from"@14islands/r3f-scroll-rig";
import { WebGLText } from"@14islands/r3f-scroll-rig/powerups";

export default function UseWebGLText({ children, font, as: Tag ="span", className ="", positionConfig = { fontOffsetX: 0, fontOffsetY: 0, letterSpacing: 0 } }) {
 const el = useRef();
  return (
 <>
 <Tag
 ref={el}
 className={` opacity-0! ${className}`}
 >
 {children}
 </Tag>
 <UseCanvas>
 <ScrollScene track={el}>
 {(props) => (
 <WebGLText
 el={el}
 font={font}
 letterSpacing={positionConfig.letterSpacing}
 fontOffsetX={positionConfig.fontOffsetX}  fontOffsetY={positionConfig.fontOffsetY}
 glyphGeometryDetail={16}
 {...props}
 >
 <meshBasicMaterial toneMapping={false} color="#ffffff" />
 {children}
 </WebGLText>
 )}
 </ScrollScene>
 </UseCanvas>
 </>
 );
 }