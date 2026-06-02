"use client";
import React, { useRef, useState, useEffect, useMemo } from"react";
import { ScrollScene, UseCanvas } from"@14islands/r3f-scroll-rig";
import * as THREE from"three";

function VideoTexturePlane({ videoRef, videoElement, sceneProps = {}, materialProps = {} }) {
 const videoTexture = useMemo(() => {
 if (!videoElement) return null;
 const t = new THREE.VideoTexture(videoElement);
 t.colorSpace = THREE.SRGBColorSpace;
 t.minFilter = THREE.LinearFilter;
 t.magFilter = THREE.LinearFilter;
 t.generateMipmaps = false;
 return t;
 }, [videoElement]);
 if (!videoElement || !videoTexture) return null;
 return (
 <ScrollScene track={videoRef} {...sceneProps}>
 {({ scale, ...rest }) => (
 <mesh scale={scale} {...rest}>
 <planeGeometry />
 <meshBasicMaterial transparent opacity={1} map={videoTexture} {...materialProps} />
 </mesh>
 )}
 </ScrollScene>
 );
}

export default function VideoWebGLTexture({
 src,
 videoRef: extRef,
 trackedWrapperClassName ="relative",
 videoClassName ="w-full h-full object-cover",
 showDomVideo = true,
 videoProps = {},
 canvasProps = {},
 sceneProps = {},
 materialProps = {},
}) {
 const internal = useRef(null);
 const videoRef = extRef ?? internal;
 const [ready, setReady] = useState(false);
 const [videoElement, setVideoElement] = useState(null);

 useEffect(() => {
 const v = videoRef.current;
 if (!v) return;
 setVideoElement(v);
 v.muted = true;
 v.playsInline = true;
 const set = () => setReady(true);
 v.addEventListener("loadeddata", set);
 v.addEventListener("canplay", set);
 return () => {
 v.removeEventListener("loadeddata", set);
 v.removeEventListener("canplay", set);
 setVideoElement(null);
 };
 }, [videoRef]);

 return (
 <>
 <UseCanvas {...canvasProps}>
 {ready && (
 <VideoTexturePlane
 videoRef={videoRef}
 videoElement={videoElement}
 sceneProps={sceneProps}
 materialProps={materialProps}
 />
 )}
 </UseCanvas>
 <div className={trackedWrapperClassName}>
 <video
 ref={videoRef}
 src={src}
 autoPlay
 loop
 muted
 playsInline
 crossOrigin="anonymous"
 className={showDomVideo ? videoClassName : `invisible pointer-events-none ${videoClassName}`}
 {...videoProps}
 />
 </div>
 </>
 );
}
