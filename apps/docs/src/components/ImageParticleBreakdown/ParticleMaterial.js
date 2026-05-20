"use client";

import * as THREE from"three";
import { extend } from"@react-three/fiber";
import { shaderMaterial } from"@react-three/drei";
import { CONFIG } from"./config";

const ParticleMaterial = shaderMaterial(
 {
 uTime: 0,
 uProgress: 0,
 uFadeProgress: 0,
 uCenterScatterProgress: 0,
 uPixelRatio: 1,

 uNearSizeStrength: CONFIG.nearSizeStrength,
 uMaxPointSize: CONFIG.maxPointSize,

 uFlowX: CONFIG.flowX,
 uFlowY: CONFIG.flowY,
 uFlowZ: CONFIG.flowZ,
 uSwirlStrength: CONFIG.swirlStrength,

 uCenterPushBack: CONFIG.centerPushBack,
 uCenterEndScatter: CONFIG.centerEndScatter,
 uColorShiftStrength: CONFIG.colorShiftStrength,
 uCenterColorBoost: CONFIG.centerColorBoost,

 uFadeJitterStart: CONFIG.fadeJitterStart,
 uFadeJitterEnd: CONFIG.fadeJitterEnd,

 uPointer: new THREE.Vector2(0, 0),
 uPointerStrength: new THREE.Vector2(
 CONFIG.pointerParticleStrengthX,
 CONFIG.pointerParticleStrengthY
 ),

 uColor1: new THREE.Vector3(...new THREE.Color(CONFIG.transitionColors[0]).toArray()),
 uColor2: new THREE.Vector3(...new THREE.Color(CONFIG.transitionColors[1]).toArray()),
 uColor3: new THREE.Vector3(...new THREE.Color(CONFIG.transitionColors[2]).toArray()),
 },
 `
 attribute float aSize;
 attribute float aEdge;
 attribute float aParallax;
 attribute float aCenter;
 attribute float aFadeOffset;
 attribute vec3 aColor;
 attribute vec3 aRandom;
 attribute vec3 aBasePosition;
 attribute vec3 aTargetPosition;

 uniform float uTime;
 uniform float uProgress;
 uniform float uFadeProgress;
 uniform float uCenterScatterProgress;
 uniform float uPixelRatio;

 uniform float uNearSizeStrength;
 uniform float uMaxPointSize;

 uniform float uFlowX;
 uniform float uFlowY;
 uniform float uFlowZ;
 uniform float uSwirlStrength;

 uniform float uCenterPushBack;
 uniform float uCenterEndScatter;
 uniform float uColorShiftStrength;
 uniform float uCenterColorBoost;

 uniform float uFadeJitterStart;
 uniform float uFadeJitterEnd;

 uniform vec2 uPointer;
 uniform vec2 uPointerStrength;

 uniform vec3 uColor1;
 uniform vec3 uColor2;
 uniform vec3 uColor3;

 varying vec3 vColor;
 varying float vAlpha;

 void main() {
 float t = uProgress;
 float fadeT = uFadeProgress;
 float fadeTSmooth = fadeT * fadeT;
 float centerScatterT = uCenterScatterProgress * uCenterScatterProgress;

 vec3 pos = mix(aBasePosition, aTargetPosition, t);

 /*
 IMPORTANT FIX:
 Center particles are now pushed back THROUGHOUT the scroll.
 Earlier, they had a mostly constant offset.
 Now the pushback ramps with scroll from 0 -> full value.
 */
 float centerPushT = smoothstep(0.0, 1.0, t);

 // center particles go farther away from the camera as scroll increases
 pos.z -= aCenter * uCenterPushBack * centerPushT;

 // extra center scatter after configured centerScatterStart
 pos.x += aRandom.x * aCenter * uCenterEndScatter * centerScatterT;
 pos.y += aRandom.y * aCenter * uCenterEndScatter * centerScatterT;

 float motionStrength = t * (1.0 - fadeTSmooth * 0.9);

 float phaseX = aRandom.x * 17.0;
 float phaseY = aRandom.y * 17.0;
 float phaseZ = aRandom.z * 17.0;

 float curveA = sin(uTime * 1.05 + pos.y * 1.42 + phaseX);
 float curveB = cos(uTime * 0.68 + pos.x * 1.08 + phaseY);
 float sX = curveA * curveB;

 float sY =
 sin(uTime * 0.96 + pos.x * 1.12 + phaseY) *
 cos(uTime * 0.62 + pos.y * 0.96 + phaseZ);

 float sZ =
 sin(uTime * 0.78 + pos.x * 0.62 + phaseZ) *
 cos(uTime * 0.52 + pos.y * 0.62 + phaseX);

 float spiral = sin(uTime * 0.75 + length(pos.xy) * 1.32 + phaseX);

 pos.x += (sX * uFlowX + spiral * uSwirlStrength + aRandom.x * 0.028) * motionStrength;
 pos.y += (sY * uFlowY + spiral * (uSwirlStrength * 0.72) + aRandom.y * 0.028) * motionStrength;
 pos.z += (sZ * uFlowZ + aRandom.z * 0.025) * motionStrength;

 float pointerInfluence = aParallax * t * (1.0 - fadeTSmooth * 0.72);
 pos.x += uPointer.x * uPointerStrength.x * pointerInfluence;
 pos.y -= uPointer.y * uPointerStrength.y * pointerInfluence;

 vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

 // random particle size + depth-based enlargement
 float perspectiveSize = 1.0 / max(0.9, -mvPosition.z);
 float nearFactor = clamp(
 (uNearSizeStrength * 2.8) / max(0.28, -mvPosition.z),
 1.0,
 9.0
 );

 gl_PointSize = aSize * uPixelRatio;
 gl_PointSize *= perspectiveSize;
 gl_PointSize *= nearFactor;
 gl_PointSize = clamp(gl_PointSize, 1.25, uMaxPointSize);

 gl_Position = projectionMatrix * mvPosition;

 // customizable 3-color transition
 float tintNoise = fract(aRandom.x * 13.17 + aRandom.y * 7.31 + aRandom.z * 5.21);

 float phase1 = clamp(fadeTSmooth * 1.65, 0.0, 1.0);
 float phase2 = clamp((fadeTSmooth - 0.18) * 1.75, 0.0, 1.0);
 float phase3 = clamp((fadeTSmooth - 0.42) * 2.1, 0.0, 1.0);

 float colorChoiceA = smoothstep(0.0, 0.55, tintNoise);
 float colorChoiceB = smoothstep(0.2, 0.85, tintNoise);
 float colorChoiceC = smoothstep(0.45, 1.0, tintNoise);

 vec3 shifted = mix(aColor, uColor1, phase1 * mix(0.55, 1.0, colorChoiceA));
 shifted = mix(shifted, uColor2, phase2 * mix(0.45, 1.0, colorChoiceB));
 shifted = mix(shifted, uColor3, phase3 * mix(0.25, 1.0, colorChoiceC));

 float centerColorMix = clamp(fadeTSmooth * aCenter * uCenterColorBoost, 0.0, 1.0);
 vColor = mix(shifted, mix(uColor2, uColor3, tintNoise), centerColorMix * 0.65);

 float fadeStartJitter = aFadeOffset * uFadeJitterStart;
 float fadeEndJitter = aFadeOffset * uFadeJitterEnd;
 float fadeAlpha = 1.0 - smoothstep(
 fadeStartJitter,
 1.0 - 0.05 + fadeEndJitter,
 fadeT
 );

 vAlpha = fadeAlpha;
 }
 `,
 `
 varying vec3 vColor;
 varying float vAlpha;

 void main() {
 vec2 uv = gl_PointCoord - 0.5;
 float dist = length(uv);

 float alpha = 1.0 - smoothstep(0.45, 0.49, dist);

 if (alpha < 0.02) discard;

 gl_FragColor = vec4(vColor, alpha * vAlpha);
 }
 `
);

extend({ ParticleMaterial });

export { ParticleMaterial };