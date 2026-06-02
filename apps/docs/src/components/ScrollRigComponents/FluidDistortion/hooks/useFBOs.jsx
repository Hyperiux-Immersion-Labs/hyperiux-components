import * as THREE from'three';
import { useFBO } from'@react-three/drei';
import { useEffect, useMemo } from'react';
import { useDoubleFBO } from'./useDoubleFBO';
import { DEFAULT_CONFIG } from'../constants';

export const useFBOs = () => {
 const density = useDoubleFBO(DEFAULT_CONFIG.dyeRes, DEFAULT_CONFIG.dyeRes, {
 type: THREE.HalfFloatType,
 format: THREE.RGBAFormat,
 minFilter: THREE.LinearFilter,
 depthBuffer: false,
 generateMipmaps: false,
 });

 const velocity = useDoubleFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
 type: THREE.HalfFloatType,
 format: THREE.RGFormat,
 minFilter: THREE.LinearFilter,
 depthBuffer: false,
 generateMipmaps: false,
 });

 const pressure = useDoubleFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
 type: THREE.HalfFloatType,
 format: THREE.RedFormat,
 minFilter: THREE.NearestFilter,
 depthBuffer: false,
 generateMipmaps: false,
 });

 const divergence = useFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
 type: THREE.HalfFloatType,
 format: THREE.RedFormat,
 minFilter: THREE.NearestFilter,
 depthBuffer: false,
 generateMipmaps: false,
 });

 const curl = useFBO(DEFAULT_CONFIG.simRes, DEFAULT_CONFIG.simRes, {
 type: THREE.HalfFloatType,
 format: THREE.RedFormat,
 minFilter: THREE.NearestFilter,
 depthBuffer: false,
 generateMipmaps: false,
 });

 const FBOs = useMemo(() => {
 return {
 density,
 velocity,
 pressure,
 divergence,
 curl,
 };
 }, [curl, density, divergence, pressure, velocity]);

 useEffect(() => {
 return () => {
 for (const FBO of Object.values(FBOs)) {
 FBO.dispose();
 }
 };
 }, [FBOs]);

 return FBOs;
};
