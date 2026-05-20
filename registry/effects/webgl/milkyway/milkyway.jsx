'use client'

import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Stars } from 'lucide-react'
import EdgeBlurEffect from './edge-blur-effect'
import CircularText from './circular-text'

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const CFG = {
  texSize: 400,
  maxRadius: 3.5,
  holeRadius: 1.2,
  holeEdgeBand: 1.5,
  arms: 1,
  spiralTightness: 10.75,
  armWidth: 0.38,
  diskHeight: 0.5,
  coreRadius: 0.22,
  coreHeight: 0.28,
  seed: 91,
  colorParticleRatio: 0.01,
  baseSize: 8,
  sparkleSize: 12.0,
  twinkleSpeed: 4.5,
  colorLevels: { core: 1.15, mid: 1.0, outer: 0.9, sparkle: 1.1 },
  colors: {
    core: [0.96, 0.96, 1.0],
    mid: [1.0, 0.9, 0.68],
    outer: [0.88, 0.36, 0.07],
    sparkleA: [0.4, 0.78, 1.0],
    sparkleB: [0.25, 0.95, 0.88],
    sparkleC: [1.0, 0.85, 0.25],
    sparkleD: [1.0, 0.22, 0.06],
    sparkleE: [0.65, 0.3, 1.0],
  },
}

const SMOKE_CFG = {
  texSize: 50,
  maxRadius: 3.5,
  holeRadius: 1.2,
  holeEdgeBand: 1.5,
  arms: 2,
  spiralTightness: 10.75,
  armWidth: 0.9,
  diskHeight: 0.18,
  orbSpeedBase: 0.2,
  noiseScale: 0.0,
  noiseStrength: 0.01,
  noiseSpeed: 0.0,
  tangentFlow: 0.3,
  armRestore: 1.7,
  radialRestore: 0.8,
  particleSize: 92.0,
  opacity: 0.05,
  colorLevels: { core: 1.25, cyan: 1.05, magenta: 1.1, violet: 0.95, outer: 0.75 },
  colors: {
    core: [0.98, 0.97, 1.0],
    cyan: [0.32, 0.84, 1.0],
    magenta: [0.96, 0.42, 1.0],
    violet: [0.52, 0.38, 0.95],
    outer: [0.18, 0.24, 0.58],
  },
  seed: 7777,
}

// ─────────────────────────────────────────────────────────────
// SHADERS
// ─────────────────────────────────────────────────────────────
const SIM_FRAG = /* glsl */`
precision highp float;
uniform sampler2D uPosition;
uniform sampler2D uData;
uniform float     uDelta;
uniform float     uTime;
varying vec2 vUv;
void main(){
  vec4 pos  = texture2D(uPosition, vUv);
  vec4 data = texture2D(uData,     vUv);
  vec3  p          = pos.xyz;
  float phase      = pos.w;
  float radiusFrac = data.x;
  float seed       = data.y;
  float orbSpeed   = data.z;
  float r = length(p.xy) + 0.0001;
  float vTan = orbSpeed * (r / (r + 0.28));
  float omega = vTan / r;
  float dAngle = omega * uDelta * .2;
  float cosA = cos(dAngle);
  float sinA = sin(dAngle);
  float nx = p.x * cosA - p.y * sinA;
  float ny = p.x * sinA + p.y * cosA;
  p.x = nx;
  p.y = ny;
  p.z += sin(uTime * 0.2 + seed * 6.28318) * 0.0001;
  phase = mod(phase + uDelta * (0.018 + seed * 0.008), 1.0);
  gl_FragColor = vec4(p, phase);
}
`

const PARTICLE_VERT = /* glsl */`
precision highp float;
uniform sampler2D uPosition;
uniform float     uPixelRatio;
attribute vec2  aRef;
attribute float aRadiusFrac;
attribute float aSeed;
attribute float aColor;
varying float vRadiusFrac;
varying float vPhase;
varying float vSeed;
varying float vColor;
void main(){
  vec4 posData = texture2D(uPosition, aRef);
  vec3 pos     = posData.xyz;
  vPhase       = posData.w;
  vRadiusFrac  = aRadiusFrac;
  vSeed        = aSeed;
  vColor       = aColor;
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  float depth = -mvPos.z;
  float isSpecial = step(${(1.0 - CFG.colorParticleRatio).toFixed(3)}, aColor);
  float sizeFactor = pow(1.0 - aRadiusFrac, 1.3);
  float normalSz   = mix(0.5, ${CFG.baseSize.toFixed(1)}, sizeFactor) * (0.7 + aSeed * 0.5);
  float specialSz = mix(
    ${CFG.sparkleSize.toFixed(1)} * 0.6,
    ${CFG.sparkleSize.toFixed(1)},
    aSeed
  );
  float sz = mix(normalSz, specialSz, isSpecial);
  sz *= (420.0 / max(depth, 0.1)) * uPixelRatio;
  float maxSize = mix(
    (${CFG.baseSize.toFixed(1)} * (2.0 + aSeed * 1.0)),
    (${CFG.sparkleSize.toFixed(1)} * (2.0 + aSeed * 1.0)),
    isSpecial
  );
  gl_PointSize = clamp(sz, 0.4, maxSize);
  gl_Position  = projectionMatrix * mvPos;
}
`

const PARTICLE_FRAG = /* glsl */`
precision highp float;
varying float vRadiusFrac;
varying float vPhase;
varying float vSeed;
varying float vColor;
void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float r  = length(uv) * 2.0;
  if(r > 1.0) discard;
  float cp   = exp(-r * r * 14.0);
  float halo = exp(-r * r *  3.0) * 0.30;
  float disc = clamp(cp + halo, 0.0, 1.0);
  float dispersion = pow(1.0 - vRadiusFrac, 1.05);
  float coreBulge  = smoothstep(0.22, 0.0, vRadiusFrac) * 0.55;
  float intensity  = clamp(dispersion + coreBulge, 0.0, 1.0);
  float tRate   = 2.5 + vSeed * ${CFG.twinkleSpeed.toFixed(1)};
  float twinkle = 0.78 + 0.22 * sin(vPhase * 6.28318 * tRate + vSeed * 17.3);
  intensity    *= twinkle;
  float isSpecial = step(${(1.0 - CFG.colorParticleRatio).toFixed(3)}, vColor);
  vec3 nCore  = vec3(${CFG.colors.core[0].toFixed(2)}, ${CFG.colors.core[1].toFixed(2)}, ${CFG.colors.core[2].toFixed(2)}) * ${CFG.colorLevels.core.toFixed(2)};
  vec3 nMid   = vec3(${CFG.colors.mid[0].toFixed(2)}, ${CFG.colors.mid[1].toFixed(2)}, ${CFG.colors.mid[2].toFixed(2)}) * ${CFG.colorLevels.mid.toFixed(2)};
  vec3 nOuter = vec3(${CFG.colors.outer[0].toFixed(2)}, ${CFG.colors.outer[1].toFixed(2)}, ${CFG.colors.outer[2].toFixed(2)}) * ${CFG.colorLevels.outer.toFixed(2)};
  vec3 normalCol = mix(nCore,  nMid,    smoothstep(0.00, 0.42, vRadiusFrac));
       normalCol = mix(normalCol, nOuter, smoothstep(0.42, 1.00, vRadiusFrac));
  float ss = fract((vColor - ${(1.0 - CFG.colorParticleRatio).toFixed(3)}) / ${CFG.colorParticleRatio.toFixed(3)} * 5.0) * 5.0;
  vec3 s0 = vec3(${CFG.colors.sparkleA[0].toFixed(2)}, ${CFG.colors.sparkleA[1].toFixed(2)}, ${CFG.colors.sparkleA[2].toFixed(2)}) * ${CFG.colorLevels.sparkle.toFixed(2)};
  vec3 s1 = vec3(${CFG.colors.sparkleB[0].toFixed(2)}, ${CFG.colors.sparkleB[1].toFixed(2)}, ${CFG.colors.sparkleB[2].toFixed(2)}) * ${CFG.colorLevels.sparkle.toFixed(2)};
  vec3 s2 = vec3(${CFG.colors.sparkleC[0].toFixed(2)}, ${CFG.colors.sparkleC[1].toFixed(2)}, ${CFG.colors.sparkleC[2].toFixed(2)}) * ${CFG.colorLevels.sparkle.toFixed(2)};
  vec3 s3 = vec3(${CFG.colors.sparkleD[0].toFixed(2)}, ${CFG.colors.sparkleD[1].toFixed(2)}, ${CFG.colors.sparkleD[2].toFixed(2)}) * ${CFG.colorLevels.sparkle.toFixed(2)};
  vec3 s4 = vec3(${CFG.colors.sparkleE[0].toFixed(2)}, ${CFG.colors.sparkleE[1].toFixed(2)}, ${CFG.colors.sparkleE[2].toFixed(2)}) * ${CFG.colorLevels.sparkle.toFixed(2)};
  vec3 specialCol;
  if(ss < 1.0)      specialCol = mix(s0, s1, ss);
  else if(ss < 2.0) specialCol = mix(s1, s2, ss - 1.0);
  else if(ss < 3.0) specialCol = mix(s2, s3, ss - 2.0);
  else if(ss < 4.0) specialCol = mix(s3, s4, ss - 3.0);
  else              specialCol = mix(s4, s0, ss - 4.0);
  intensity = mix(intensity, clamp(intensity * 2.5, 0.0, 1.0), isSpecial);
  vec3  col   = mix(normalCol, specialCol, isSpecial);
  float alpha = disc * intensity * 0.90;
  gl_FragColor = vec4(col * alpha, alpha);
}
`

const SMOKE_SIM_FRAG = /* glsl */`
precision highp float;
uniform sampler2D uPosition;
uniform sampler2D uData;
uniform float     uDelta;
uniform float     uTime;
varying vec2 vUv;
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec3 curlNoise(vec3 p){
  float e = 0.05;
  float n1,n2;
  vec3 curl;
  n1 = snoise(p + vec3(0.0, e, 0.0)); n2 = snoise(p - vec3(0.0, e, 0.0));
  float a = (n1 - n2) / (2.0 * e);
  n1 = snoise(p + vec3(0.0, 0.0, e)); n2 = snoise(p - vec3(0.0, 0.0, e));
  float b = (n1 - n2) / (2.0 * e);
  curl.x = a - b;
  n1 = snoise(p + vec3(0.0, 0.0, e)); n2 = snoise(p - vec3(0.0, 0.0, e));
  a = (n1 - n2) / (2.0 * e);
  n1 = snoise(p + vec3(e, 0.0, 0.0)); n2 = snoise(p - vec3(e, 0.0, 0.0));
  b = (n1 - n2) / (2.0 * e);
  curl.y = a - b;
  n1 = snoise(p + vec3(e, 0.0, 0.0)); n2 = snoise(p - vec3(e, 0.0, 0.0));
  a = (n1 - n2) / (2.0 * e);
  n1 = snoise(p + vec3(0.0, e, 0.0)); n2 = snoise(p - vec3(0.0, e, 0.0));
  b = (n1 - n2) / (2.0 * e);
  curl.z = a - b;
  return curl;
}
void main(){
  vec4 pos  = texture2D(uPosition, vUv);
  vec4 data = texture2D(uData,     vUv);
  vec3  p          = pos.xyz;
  float phase      = pos.w;
  float radiusFrac = data.x;
  float seed       = data.y;
  float orbSpeed   = data.z;
  float armIdxNorm = data.w;
  float r = length(p.xy) + 0.0001;
  float vTan   = orbSpeed * (r / (r + 0.35));
  float omega  = vTan / r;
  float dAngle = omega * uDelta;
  float cosA   = cos(dAngle); float sinA = sin(dAngle);
  float nx = p.x * cosA - p.y * sinA;
  float ny = p.x * sinA + p.y * cosA;
  p.x = nx; p.y = ny;
  float armBase = armIdxNorm * 6.28318;
  float targetTheta = armBase + r * ${SMOKE_CFG.spiralTightness.toFixed(2)};
  vec2 tangent = normalize(vec2(
    cos(targetTheta) - ${SMOKE_CFG.spiralTightness.toFixed(2)} * r * sin(targetTheta),
    sin(targetTheta) + ${SMOKE_CFG.spiralTightness.toFixed(2)} * r * cos(targetTheta)
  ));
  p.xy += tangent * ${SMOKE_CFG.tangentFlow.toFixed(2)} * (0.85 + radiusFrac * 0.45) * uDelta;
  float currentTheta = atan(p.y, p.x);
  float angleDelta = atan(sin(targetTheta - currentTheta), cos(targetTheta - currentTheta));
  vec2 radialDir = normalize(p.xy);
  vec2 armNormal = vec2(-tangent.y, tangent.x);
  p.xy += armNormal * angleDelta * r * ${SMOKE_CFG.armRestore.toFixed(2)} * uDelta;
  p.xy += radialDir * ((radiusFrac * ${SMOKE_CFG.maxRadius.toFixed(2)}) - r) * ${SMOKE_CFG.radialRestore.toFixed(2)} * uDelta;
  vec3 noiseCoord = p * ${SMOKE_CFG.noiseScale.toFixed(2)} + vec3(uTime * ${SMOKE_CFG.noiseSpeed.toFixed(2)});
  vec3 curl = curlNoise(noiseCoord);
  p.xy += curl.xy * ${SMOKE_CFG.noiseStrength.toFixed(3)} * uDelta;
  p.z  += curl.z  * ${SMOKE_CFG.noiseStrength.toFixed(3)} * 0.08 * uDelta;
  p.z *= 0.975;
  p.z += sin(uTime * 0.12 + seed * 6.28318) * 0.00012;
  phase = mod(phase + uDelta * (0.012 + seed * 0.006), 1.0);
  gl_FragColor = vec4(p, phase);
}
`

const SMOKE_VERT = /* glsl */`
precision highp float;
uniform sampler2D uPosition;
uniform float     uPixelRatio;
uniform float     uTime;
attribute vec2  aRef;
attribute float aRadiusFrac;
attribute float aSeed;
varying float vRadiusFrac;
varying float vPhase;
varying float vSeed;
void main(){
  vec4 posData = texture2D(uPosition, aRef);
  vec3 pos     = posData.xyz;
  vPhase       = posData.w;
  vRadiusFrac  = aRadiusFrac;
  vSeed        = aSeed;
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  float depth = -mvPos.z;
  float sizeFactor = mix(0.6, 1.0, 1.0 - aRadiusFrac);
  float sz = ${SMOKE_CFG.particleSize.toFixed(1)} * sizeFactor * (0.7 + aSeed * 0.6);
  sz *= (420.0 / max(depth, 0.1)) * uPixelRatio;
  gl_PointSize = clamp(sz, 2.0, ${SMOKE_CFG.particleSize.toFixed(1)} * 3.0);
  gl_Position  = projectionMatrix * mvPos;
}
`

const SMOKE_FRAG = /* glsl */`
precision highp float;
varying float vRadiusFrac;
varying float vPhase;
varying float vSeed;
void main(){
  vec2  uv = gl_PointCoord - 0.5;
  uv.x *= 2.1; uv.y *= 0.72;
  float r  = length(uv) * 2.0;
  if(r > 1.0) discard;
  float core = exp(-dot(uv, uv) * 3.4);
  float halo = exp(-dot(uv, uv) * 0.75) * 0.9;
  float shape = clamp(core + halo, 0.0, 1.0);
  float streak = 0.72 + 0.28 * smoothstep(0.42, 0.0, abs(uv.y));
  float radialFade = pow(1.0 - vRadiusFrac, 0.72);
  float coreBright = smoothstep(0.32, 0.0, vRadiusFrac) * 0.22;
  float intensity  = clamp(radialFade + coreBright, 0.0, 1.0);
  float flow = 0.88 + 0.12 * sin(vPhase * 6.28318 * 1.0 + vSeed * 8.0);
  intensity *= flow * streak;
  vec3 cCore    = vec3(${SMOKE_CFG.colors.core[0].toFixed(2)}, ${SMOKE_CFG.colors.core[1].toFixed(2)}, ${SMOKE_CFG.colors.core[2].toFixed(2)}) * ${SMOKE_CFG.colorLevels.core.toFixed(2)};
  vec3 cCyan    = vec3(${SMOKE_CFG.colors.cyan[0].toFixed(2)}, ${SMOKE_CFG.colors.cyan[1].toFixed(2)}, ${SMOKE_CFG.colors.cyan[2].toFixed(2)}) * ${SMOKE_CFG.colorLevels.cyan.toFixed(2)};
  vec3 cMagenta = vec3(${SMOKE_CFG.colors.magenta[0].toFixed(2)}, ${SMOKE_CFG.colors.magenta[1].toFixed(2)}, ${SMOKE_CFG.colors.magenta[2].toFixed(2)}) * ${SMOKE_CFG.colorLevels.magenta.toFixed(2)};
  vec3 cViolet  = vec3(${SMOKE_CFG.colors.violet[0].toFixed(2)}, ${SMOKE_CFG.colors.violet[1].toFixed(2)}, ${SMOKE_CFG.colors.violet[2].toFixed(2)}) * ${SMOKE_CFG.colorLevels.violet.toFixed(2)};
  vec3 cOuter   = vec3(${SMOKE_CFG.colors.outer[0].toFixed(2)}, ${SMOKE_CFG.colors.outer[1].toFixed(2)}, ${SMOKE_CFG.colors.outer[2].toFixed(2)}) * ${SMOKE_CFG.colorLevels.outer.toFixed(2)};
  float colorNoise = fract(vSeed * 13.371 + vRadiusFrac * 2.71);
  vec3 col = mix(cCore, cCyan, smoothstep(0.00, 0.28, vRadiusFrac));
       col = mix(col, cMagenta, smoothstep(0.18, 0.52, vRadiusFrac + (colorNoise - 0.5) * 0.18));
       col = mix(col, cViolet,  smoothstep(0.42, 0.78, vRadiusFrac + (colorNoise - 0.5) * 0.22));
       col = mix(col, cOuter,   smoothstep(0.72, 1.00, vRadiusFrac));
  float cyanMix    = smoothstep(0.15, 0.85, sin(vSeed * 19.0 + vRadiusFrac * 11.0) * 0.5 + 0.5);
  float magentaMix = smoothstep(0.2,  0.9,  cos(vSeed * 23.0 - vRadiusFrac *  8.0) * 0.5 + 0.5);
  col = mix(col, cCyan,    cyanMix    * 0.18);
  col = mix(col, cMagenta, magentaMix * 0.22);
  float alpha = shape * intensity * ${SMOKE_CFG.opacity.toFixed(3)};
  gl_FragColor = vec4(col * alpha, alpha);
}
`

// ─────────────────────────────────────────────────────────────
// Inline GPUCompute
// ─────────────────────────────────────────────────────────────
class GPUCompute {
  constructor(w, h, renderer) {
    this.w = w; this.h = h; this.gl = renderer; this.vars = {}
    if (!GPUCompute.sharedGeo) GPUCompute.sharedGeo = new THREE.PlaneGeometry(2, 2)
    if (!GPUCompute.sharedCam) GPUCompute.sharedCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    if (!GPUCompute.sharedScene) GPUCompute.sharedScene = new THREE.Scene()
    this._geo = GPUCompute.sharedGeo
    this._cam = GPUCompute.sharedCam
    this._scene = GPUCompute.sharedScene
  }
  _rt() {
    return new THREE.WebGLRenderTarget(this.w, this.h, {
      wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat, type: THREE.FloatType,
      depthBuffer: false, stencilBuffer: false,
    })
  }
  addVar(name, fragShader, initTex) {
    const simMat = new THREE.ShaderMaterial({
      uniforms: { uPosition: { value: initTex }, uData: { value: null }, uDelta: { value: 0 }, uTime: { value: 0 } },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
      fragmentShader: fragShader,
    })
    const rtA = this._rt(), rtB = this._rt()
    const blit = new THREE.Mesh(this._geo, new THREE.MeshBasicMaterial({ map: initTex }))
    this._scene.add(blit)
    this.gl.setRenderTarget(rtA); this.gl.render(this._scene, this._cam)
    this._scene.remove(blit); blit.material.dispose()
    this.gl.setRenderTarget(null)
    this.vars[name] = { simMat, mesh: new THREE.Mesh(this._geo, simMat), rtA, rtB }
    return this.vars[name]
  }
  compute(name, time, delta, dataTex) {
    const v = this.vars[name]
    v.simMat.uniforms.uTime.value = time
    v.simMat.uniforms.uDelta.value = delta
    v.simMat.uniforms.uData.value = dataTex
    const tmp = v.rtA; v.rtA = v.rtB; v.rtB = tmp
    v.simMat.uniforms.uPosition.value = v.rtB.texture
    this._scene.add(v.mesh)
    this.gl.setRenderTarget(v.rtA); this.gl.render(this._scene, this._cam)
    this._scene.remove(v.mesh)
    this.gl.setRenderTarget(null)
    return v.rtA.texture
  }
  dispose() {
    Object.values(this.vars).forEach(v => { v.rtA.dispose(); v.rtB.dispose(); v.simMat.dispose() })
  }
}

// ─────────────────────────────────────────────────────────────
// Seeded RNG (mulberry32)
// ─────────────────────────────────────────────────────────────
function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// ─────────────────────────────────────────────────────────────
// Build DataTextures
// ─────────────────────────────────────────────────────────────
function buildTextures(cfg) {
  const { texSize: S, maxRadius, holeRadius, holeEdgeBand, arms, spiralTightness,
    armWidth, diskHeight, coreRadius, coreHeight, seed } = cfg
  const total = S * S
  const posArr = new Float32Array(total * 4)
  const dataArr = new Float32Array(total * 4)
  const rand = mulberry32(seed)
  for (let i = 0; i < total; i++) {
    const r0 = rand()
    let r, radiusFrac, inBulge = false
    if (r0 < 0.18) {
      r = Math.abs(rand() + rand() + rand() - 1.5) * coreRadius * 1.1; inBulge = true
    } else {
      r = -Math.log(1.0 - rand() * 0.9999) * (maxRadius * 0.35)
      r = Math.min(r, maxRadius)
    }
    let inHoleEdge = false
    if (r < holeRadius) { r = holeRadius + rand() * holeEdgeBand; inBulge = false; inHoleEdge = true }
    radiusFrac = Math.min(r / maxRadius, 1.0)
    const armIdx = Math.floor(rand() * arms)
    const armBase = (armIdx / arms) * Math.PI * 2
    let g = rand() + rand() + rand(); g = (g / 3 - 0.5) * 2.0
    const scatter = armWidth * r * (inBulge ? 3.0 : 1.0)
    const theta = inHoleEdge
      ? (rand() * Math.PI * 2 + g * (armWidth * holeRadius * 3.0))
      : (armBase + r * spiralTightness + g * scatter)
    let gz = rand() + rand() + rand(); gz = (gz / 3 - 0.5) * 2.0
    const zScale = inBulge ? coreHeight : diskHeight * (0.5 + radiusFrac * 0.5)
    posArr[i*4]=r*Math.cos(theta); posArr[i*4+1]=r*Math.sin(theta); posArr[i*4+2]=gz*zScale; posArr[i*4+3]=rand()
    const orbSpeed = inBulge ? 0.55 + rand() * 0.15 : 0.30 + radiusFrac * 0.22 + rand() * 0.08
    dataArr[i*4]=radiusFrac; dataArr[i*4+1]=rand(); dataArr[i*4+2]=orbSpeed; dataArr[i*4+3]=armIdx/arms
  }
  const mkTex = (arr) => { const t = new THREE.DataTexture(arr, S, S, THREE.RGBAFormat, THREE.FloatType); t.needsUpdate = true; t.minFilter = t.magFilter = THREE.NearestFilter; return t }
  return { posTex: mkTex(posArr), dataTex: mkTex(dataArr) }
}

function buildGeo(cfg) {
  const { texSize: S, maxRadius, holeRadius, coreRadius, seed } = cfg
  const count = S * S
  const refs = new Float32Array(count * 2), rfrac = new Float32Array(count)
  const seeds = new Float32Array(count), colors = new Float32Array(count)
  const rand = mulberry32(seed + 99)
  for (let i = 0; i < count; i++) {
    refs[i*2]=((i%S)+0.5)/S; refs[i*2+1]=(Math.floor(i/S)+0.5)/S
    const r0 = rand(); let r
    if (r0 < 0.18) { r = Math.abs(rand()+rand()+rand()-1.5)*coreRadius*1.1 }
    else { r = -Math.log(1.0-rand()*0.9999)*(maxRadius*0.35); r = Math.min(r, maxRadius) }
    if (r < holeRadius) r = holeRadius + rand() * 0.06
    rfrac[i] = Math.min(r / maxRadius, 1.0); seeds[i] = rand(); colors[i] = rand()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aRef', new THREE.BufferAttribute(refs, 2))
  geo.setAttribute('aRadiusFrac', new THREE.BufferAttribute(rfrac, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 1))
  return geo
}

function buildSmokeTextures(cfg) {
  const S = cfg.texSize, total = S * S
  const posArr = new Float32Array(total * 4), dataArr = new Float32Array(total * 4)
  const rand = mulberry32(cfg.seed)
  for (let i = 0; i < total; i++) {
    let r = -Math.log(1.0-rand()*0.9999)*(cfg.maxRadius*0.34); r = Math.min(r, cfg.maxRadius)
    let inHoleEdge = false
    if (r < cfg.holeRadius) { r = cfg.holeRadius + rand() * cfg.holeEdgeBand; inHoleEdge = true }
    const radiusFrac = Math.min(r / cfg.maxRadius, 1.0)
    const armIdx = Math.floor(rand() * cfg.arms)
    const armBase = (armIdx / cfg.arms) * Math.PI * 2
    let g = rand()+rand()+rand(); g = (g/3-0.5)*2.0
    const scatter = cfg.armWidth * r
    const theta = inHoleEdge ? (rand()*Math.PI*2+g*(cfg.armWidth*cfg.holeRadius*2.0)) : (armBase+r*cfg.spiralTightness+g*scatter)
    let gz = rand()+rand()+rand(); gz = (gz/3-0.5)*2.0
    const z = gz * cfg.diskHeight * (0.6 + radiusFrac * 0.4)
    posArr[i*4]=r*Math.cos(theta); posArr[i*4+1]=r*Math.sin(theta); posArr[i*4+2]=z; posArr[i*4+3]=rand()
    const orbSpeed = cfg.orbSpeedBase + radiusFrac * 0.08 + rand() * 0.04
    dataArr[i*4]=radiusFrac; dataArr[i*4+1]=rand(); dataArr[i*4+2]=orbSpeed; dataArr[i*4+3]=armIdx/cfg.arms
  }
  const mkTex = (arr) => { const t = new THREE.DataTexture(arr, S, S, THREE.RGBAFormat, THREE.FloatType); t.needsUpdate = true; t.minFilter = t.magFilter = THREE.NearestFilter; return t }
  return { posTex: mkTex(posArr), dataTex: mkTex(dataArr) }
}

function buildSmokeGeo(cfg) {
  const S = cfg.texSize, count = S * S
  const refs = new Float32Array(count * 2), rfrac = new Float32Array(count), seeds = new Float32Array(count)
  const rand = mulberry32(cfg.seed + 200)
  for (let i = 0; i < count; i++) {
    refs[i*2]=((i%S)+0.5)/S; refs[i*2+1]=(Math.floor(i/S)+0.5)/S
    let r = -Math.log(1.0-rand()*0.9999)*(cfg.maxRadius*0.34); r = Math.min(r, cfg.maxRadius)
    if (r < cfg.holeRadius) r = cfg.holeRadius + rand() * cfg.holeEdgeBand
    rfrac[i] = Math.min(r / cfg.maxRadius, 1.0); seeds[i] = rand()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aRef', new THREE.BufferAttribute(refs, 2))
  geo.setAttribute('aRadiusFrac', new THREE.BufferAttribute(rfrac, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  return geo
}

// ─────────────────────────────────────────────────────────────
// R3F scene components
// ─────────────────────────────────────────────────────────────
const SmokeFlow = React.memo(function SmokeFlow() {
  const { gl } = useThree()
  const gpuRef = useRef(null), dataRef = useRef(null)
  const { geo, posTex, dataTex } = useMemo(() => {
    const { posTex, dataTex } = buildSmokeTextures(SMOKE_CFG)
    return { geo: buildSmokeGeo(SMOKE_CFG), posTex, dataTex }
  }, [])
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uPosition: { value: null }, uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) }, uTime: { value: 0 } },
    vertexShader: SMOKE_VERT, fragmentShader: SMOKE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  useEffect(() => {
    const gpu = new GPUCompute(SMOKE_CFG.texSize, SMOKE_CFG.texSize, gl)
    gpu.addVar('smokePos', SMOKE_SIM_FRAG, posTex)
    gpuRef.current = gpu; dataRef.current = dataTex
    return () => { gpu.dispose(); posTex.dispose(); dataTex.dispose(); geo.dispose(); mat.dispose() }
  }, [gl]) // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((state, rawDelta) => {
    const gpu = gpuRef.current; if (!gpu) return
    const dt = Math.min(rawDelta, 0.05)
    const tex = gpu.compute('smokePos', state.clock.elapsedTime, dt, dataRef.current)
    mat.uniforms.uPosition.value = tex; mat.uniforms.uTime.value = state.clock.elapsedTime
  })
  return <group scale={1.65} position={[-1.45, 0.5, 0]} rotation={[degToRad(40), degToRad(0), degToRad(-5)]}><points geometry={geo} material={mat} /></group>
})

const MilkyWayGPGPU = React.memo(function MilkyWayGPGPU() {
  const { gl } = useThree()
  const gpuRef = useRef(null), matRef = useRef(null), dataRef = useRef(null)
  const { geo, posTex, dataTex } = useMemo(() => {
    const { posTex, dataTex } = buildTextures(CFG)
    return { geo: buildGeo(CFG), posTex, dataTex }
  }, [])
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uPosition: { value: null }, uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) } },
    vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  useEffect(() => {
    const gpu = new GPUCompute(CFG.texSize, CFG.texSize, gl)
    gpu.addVar('pos', SIM_FRAG, posTex)
    gpuRef.current = gpu; dataRef.current = dataTex; matRef.current = mat
    return () => { gpu.dispose(); posTex.dispose(); dataTex.dispose(); geo.dispose(); mat.dispose() }
  }, [gl]) // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((state, rawDelta) => {
    const gpu = gpuRef.current; if (!gpu) return
    const tex = gpu.compute('pos', state.clock.elapsedTime, Math.min(rawDelta, 0.05), dataRef.current)
    mat.uniforms.uPosition.value = tex
  })
  return <group scale={1.65} position={[-1.45, 0.5, 0]} rotation={[degToRad(40), degToRad(0), degToRad(-5)]}><points geometry={geo} material={mat} /></group>
})

const BackgroundStars = React.memo(function BackgroundStars() {
  const mesh = useMemo(() => {
    const count = 4000, pos = new Float32Array(count * 3), rand = mulberry32(12345)
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2, phi = Math.acos(2 * rand() - 1), r = 40 + rand() * 20
      pos[i*3]=r*Math.sin(phi)*Math.cos(theta); pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta); pos[i*3+2]=r*Math.cos(phi)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false })
    return new THREE.Points(geo, mat)
  }, [])
  return <primitive object={mesh} />
})

function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    if (camera?.isPerspectiveCamera) { camera.aspect = size.width / size.height; camera.updateProjectionMatrix() }
  }, [camera, size.width, size.height])
  return null
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
export function MilkyWay({
  title = 'Particles Galaxy',
  subtitle = 'Milkyway',
  navItems = ['Spiral Arms', 'Stellar Map', 'Nebulae', 'Star Clusters'],
  circularText = 'EXPLORE THE GALAXY ',
}) {
  const [dpr, setDpr] = useState(1)
  const onResize = useCallback(() => {
    if (typeof window === 'undefined') return
    setDpr(Math.max(1, Math.min(2, window.devicePixelRatio || 1)))
  }, [])
  useEffect(() => {
    onResize(); window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <section style={{ width: '100%', height: '100vh', background: '#000' }}>
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [-1, -1.8, 4], fov: 45, near: 0.01, far: 200 }}
      >
        <ResponsiveCamera />
        <BackgroundStars />
        <Center rotation={[degToRad(-10), 0, 0]} position={[-1.2, 0.5, 0]}>
          <group position={[-2, 2.2, 0]} rotation={[degToRad(110), degToRad(-10), 0]}>
            <MilkyWayGPGPU />
            <SmokeFlow />
          </group>
        </Center>
        <EffectComposer>
          <EdgeBlurEffect blurStrength={1.2} blurStart={0.2} />
          <EdgeBlurEffect blurType="classic" blurStrength={0.3} blurStart={0.1} />
          <Vignette opacity={0.5} offset={0.8} darkness={0.7} />
        </EffectComposer>
      </Canvas>

      <div className="h-screen w-full absolute left-0 top-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="h-full w-full relative">
          {/* Navbar */}
          <div className="w-full absolute top-0 left-0 pt-[2vw] px-[2vw] flex items-center justify-between h-fit pointer-events-auto">
            <p className="text-4xl font-medium">Galaxy</p>
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <button key={item} className="bg-white/20 hover:bg-white hover:text-black transition-all duration-500 cursor-pointer backdrop-blur-sm rounded-full text-sm px-[2vw] py-[.5vw]">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-[4vw] left-[4vw] max-w-[70vw]">
            <p className="flex items-center bg-white/20 backdrop-blur-sm rounded-full text-xs px-[1vw] py-[.5vw] w-fit gap-2">
              <Stars size={12} />Data Driven And Creative
            </p>
            <h1 className="text-[7vw] mt-[1vw] leading-[1.1] text-white drop-shadow-[0_0_32px_rgba(100,96,255,0.17)]">
              {title}
            </h1>
            <h1 className="text-[7vw] -mt-[1vw] drop-shadow-[0_0_32px_rgba(100,96,255,0.17)]">
              {subtitle}
            </h1>
          </div>

          {/* Circular text */}
          <div className="h-fit cursor-pointer w-fit absolute bottom-[2vw] right-[4vw] p-[1.5vw] pointer-events-auto">
            <CircularText text={circularText} spinDuration={20} onHover="speedUp" />
          </div>
        </div>
      </div>
    </section>
  )
}
