"use client"
import { ScrollScene, UseCanvas, useImageAsTexture } from"@14islands/r3f-scroll-rig";

import React, { useRef } from"react";

export function WebGLImagePlane({ trackedImageRef, sceneProps, materialProps }) {
 const textureRef = useImageAsTexture(trackedImageRef);

 return (
 <ScrollScene track={trackedImageRef} {...sceneProps}>
 {(props) => (
 <>
 <mesh {...props} scale={props.scale}>
 <planeGeometry />
 <meshBasicMaterial
 transparent
 opacity={1.0}
 map={textureRef}
 {...materialProps}
 />
 </mesh>
 </>
 )}
 </ScrollScene>
  );
}

export default function ScrollRigImage({
 src,
 alt ="",
 trackedImageRef,
 trackedWrapperClassName ="absolute invisible top-[5vw] w-[4vw] h-auto right-[5vw] z-10",
 trackedImgClassName ="object-contain h-full w-full opacity-0! pointer-events-none",
 trackedImgProps,
 useCanvasProps,
 sceneProps,
 materialProps,
}) {
 const internalRef = useRef(null);
 const ref = trackedImageRef ?? internalRef;

 return (
 <>
 <UseCanvas {...useCanvasProps}>
 <WebGLImagePlane
 trackedImageRef={ref}
 sceneProps={sceneProps}
 materialProps={materialProps}
 />
 </UseCanvas>

 <div className={trackedWrapperClassName}>
 <img
 ref={ref}
 src={src}
 alt={alt}
 className={trackedImgClassName}
 {...trackedImgProps}
 />
 </div>
 </>
 );
}