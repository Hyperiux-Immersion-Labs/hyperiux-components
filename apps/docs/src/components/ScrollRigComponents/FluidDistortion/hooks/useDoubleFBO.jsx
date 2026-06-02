import * as THREE from'three';
import { useFBO } from'@react-three/drei';
import { useMemo } from'react';

export const useDoubleFBO = (width, height, options) => {
 const read = useFBO(width, height, options);
 const write = useFBO(width, height, options);

 const fbo = useMemo(() => {
 const state = {
 read,
 write,
 };

 return {
 get read() {
 return state.read;
 },
 get write() {
 return state.write;
 },
 swap: () => {
 const temp = state.read;
 state.read = state.write;
 state.write = temp;
 },
 dispose: () => {
 state.read.dispose();
 state.write.dispose();
 },
 };
 }, [read, write]);

 return fbo;
};
