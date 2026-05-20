import * as THREE from'three';
import { useFBO } from'@react-three/drei';
import { useRef } from'react';

export const useDoubleFBO = (width, height, options) => {
 const read = useFBO(width, height, options);
 const write = useFBO(width, height, options);

 const fboRef = useRef();
  if (!fboRef.current) {
 fboRef.current = {
 read,
 write,
 swap: () => {
 const temp = fboRef.current.read;
 fboRef.current.read = fboRef.current.write;
 fboRef.current.write = temp;
 },
 dispose: () => {
 read.dispose();
 write.dispose();
 },
 setGenerateMipmaps: (value) => {
 read.texture.generateMipmaps = value;
 write.texture.generateMipmaps = value;
 },
 };
 }
  const fbo = fboRef.current;

 return fbo;
};
