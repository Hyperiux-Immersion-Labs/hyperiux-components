"use client";

import React, { useEffect, useRef } from"react";

const vertexShaderSource = `#version 300 es
in vec2 position;

void main() {
 gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

#define MAX_TRAIL_POINTS 240

uniform vec2 iResolution;
uniform float iTime;

uniform vec2 iTrail[MAX_TRAIL_POINTS];
uniform float iTrailAlpha[MAX_TRAIL_POINTS];
uniform int iTrailCount;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

out vec4 fragColor;

float stepfun(float x) {
 return (sign(x) + 1.0) / 2.0;
}

float square(vec2 pos) {
 return (stepfun(pos.x + 1.0) * stepfun(1.0 - pos.x)) *
 (stepfun(pos.y + 1.0) * stepfun(1.0 - pos.y));
}

vec2 dist(vec2 pos) {
 vec2 noiseUv = pos * 2.2;

 vec2 n = texture(iChannel1, noiseUv).xy - 0.5;

 // much smaller distortion = less wavy/glitchy
 return pos + n * 0.012;
}

vec4 blur21(sampler2D tex, vec2 uv, float radiusPx) {
 vec2 px = radiusPx / iResolution;

 vec4 c = vec4(0.0);

 c += texture(tex, uv) * 0.12;

 c += texture(tex, uv + px * vec2( 1.0, 0.0)) * 0.08;
 c += texture(tex, uv + px * vec2(-1.0, 0.0)) * 0.08;
 c += texture(tex, uv + px * vec2( 0.0, 1.0)) * 0.08;
 c += texture(tex, uv + px * vec2( 0.0, -1.0)) * 0.08;

 c += texture(tex, uv + px * vec2( 1.0, 1.0)) * 0.065;
 c += texture(tex, uv + px * vec2(-1.0, 1.0)) * 0.065;
 c += texture(tex, uv + px * vec2( 1.0, -1.0)) * 0.065;
 c += texture(tex, uv + px * vec2(-1.0, -1.0)) * 0.065;

 c += texture(tex, uv + px * vec2( 2.0, 0.0)) * 0.045;
 c += texture(tex, uv + px * vec2(-2.0, 0.0)) * 0.045;
 c += texture(tex, uv + px * vec2( 0.0, 2.0)) * 0.045;
 c += texture(tex, uv + px * vec2( 0.0, -2.0)) * 0.045;

 c += texture(tex, uv + px * vec2( 3.0, 1.0)) * 0.025;
 c += texture(tex, uv + px * vec2(-3.0, 1.0)) * 0.025;
 c += texture(tex, uv + px * vec2( 3.0, -1.0)) * 0.025;
 c += texture(tex, uv + px * vec2(-3.0, -1.0)) * 0.025;

 return c;
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
 vec2 pa = p - a;
 vec2 ba = b - a;

 float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);

 return length(pa - ba * h);
}

float fluidTrailRevealMask(vec2 uv) {
 float aspect = iResolution.x / iResolution.y;
 vec2 p = vec2(uv.x * aspect, uv.y);

 float mask = 0.0;

 for (int i = 0; i < MAX_TRAIL_POINTS - 1; i++) {
 if (i >= iTrailCount - 1) {
 break;
 }

 vec2 a = vec2(iTrail[i].x * aspect, iTrail[i].y);
 vec2 b = vec2(iTrail[i + 1].x * aspect, iTrail[i + 1].y);

 float alpha = min(iTrailAlpha[i], iTrailAlpha[i + 1]);

 float d = sdSegment(p, a, b);

 float n1 = texture(iChannel1, uv * 4.0 + float(i) * 0.018).r;
 float n2 = texture(iChannel1, uv * 10.0 + vec2(n1 * 0.4, float(i) * 0.01)).r;
 float n3 = texture(iChannel1, uv * 24.0 - float(i) * 0.006).r;

 float fluidNoise = n1 * 0.45 + n2 * 0.35 + n3 * 0.20;

 float radius = 0.095 + (fluidNoise - 0.5) * 0.055;
 float softness = 0.09;

 float localMask = 1.0 - smoothstep(radius, radius + softness, d);

 localMask *= alpha;

 mask = max(mask, localMask);
 }

 float cloudNoise = texture(iChannel1, uv * 7.0).r;
 float fineNoise = texture(iChannel1, uv * 22.0).r;

 mask *= smoothstep(0.12, 0.95, mask + cloudNoise * 0.25 + fineNoise * 0.12);

 return clamp(mask, 0.0, 1.0);
}

vec3 filmGrain(vec2 uv) {
 // Two-layer animated grain using the provided noise texture.
 // Tuned to look closer to"film" grain (coarse + fine, slightly colored).
 vec2 coarseUv = uv * (iResolution.xy / 260.0) + vec2(iTime * 0.035, -iTime * 0.028);
 vec2 fineUv = uv * (iResolution.xy / 120.0) + vec2(-iTime * 0.055, iTime * 0.041);

 vec3 coarse = texture(iChannel1, coarseUv).rgb - 0.5;
 float fine = texture(iChannel1, fineUv).r - 0.5;

 // Add a touch of chroma separation so the grain isn't purely luma.
 vec3 chroma = vec3(coarse.r, coarse.g * 0.9, coarse.b * 1.1);
 return chroma * 0.95 + fine * 0.65;
}

void main() {
 vec2 screenUv = gl_FragCoord.xy / iResolution.xy;

 // Convert WebGL bottom-left UV to browser-style top-left UV.
 screenUv.y = 1.0 - screenUv.y;

 vec2 imageUv = screenUv;

 vec4 frostedImage = blur21(iChannel0, dist(imageUv), 42.0);
 vec4 clearImage = texture(iChannel0, imageUv);

 float revealMask = fluidTrailRevealMask(screenUv);

 float grain = texture(iChannel1, screenUv * iResolution.xy / 180.0).r;

frostedImage.rgb = mix(frostedImage.rgb, vec3(0.70, 0.76, 0.78), 0.18);
frostedImage.rgb += (grain - 0.5) * 0.045;
frostedImage.rgb *= 0.96;

 vec4 mixed = mix(frostedImage, clearImage, revealMask);

 // Heavier grain in the frosted area, slightly lighter in the revealed area.
 float grainAmt = mix(0.24, 0.12, revealMask);
 mixed.rgb += filmGrain(screenUv) * grainAmt;

 // Subtle vignette to match the reference vibe.
 vec2 d = screenUv - 0.5;
 float vignette = smoothstep(0.85, 0.25, dot(d, d) * 1.35);
 mixed.rgb *= mix(0.96, 1.0, vignette);

 fragColor = vec4(clamp(mixed.rgb, 0.0, 1.0), 1.0);
}
`;

function createShader(gl, type, source) {
 const shader = gl.createShader(type);

 gl.shaderSource(shader, source);
 gl.compileShader(shader);

 if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
 throw new Error(gl.getShaderInfoLog(shader));
 }

 return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
 const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
 const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

 const program = gl.createProgram();

 gl.attachShader(program, vertexShader);
 gl.attachShader(program, fragmentShader);
 gl.linkProgram(program);

 if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
 throw new Error(gl.getProgramInfoLog(program));
 }

 return program;
}

function loadImage(src) {
 return new Promise((resolve, reject) => {
 if (src instanceof HTMLImageElement) {
 if (src.complete) {
 resolve(src);
 } else {
 src.onload = () => resolve(src);
 src.onerror = reject;
 }

 return;
 }

 const img = new Image();

 img.crossOrigin ="anonymous";
 img.onload = () => resolve(img);
 img.onerror = reject;
 img.src = src;
 });
}

function createTexture(gl, image, unit, repeat = false) {
 const texture = gl.createTexture();

 gl.activeTexture(gl.TEXTURE0 + unit);
 gl.bindTexture(gl.TEXTURE_2D, texture);

 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

 gl.texImage2D(
 gl.TEXTURE_2D,
 0,
 gl.RGBA,
 gl.RGBA,
 gl.UNSIGNED_BYTE,
 image
 );

 gl.texParameteri(
 gl.TEXTURE_2D,
 gl.TEXTURE_WRAP_S,
 repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
 );

 gl.texParameteri(
 gl.TEXTURE_2D,
 gl.TEXTURE_WRAP_T,
 repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
 );

 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

 return texture;
}

export default function FrostedGlassRevealShader({
 iChannel0,
 iChannel1,
 className,
 style,
}) {
 const canvasRef = useRef(null);

 const trailRef = useRef([]);
 const pointerRef = useRef({
 inside: false,
 // target (raw pointer)
 tx: 0.5,
 ty: 0.5,
 // smoothed pointer
 x: 0.5,
 y: 0.5,
 // for frame-to-frame smoothing
 lastT: 0,
 leaving: false,
 leaveAt: 0,
 });

 useEffect(() => {
 let disposed = false;
 let frameId;

 async function init() {
 const canvas = canvasRef.current;

 if (!canvas) return;

 const gl = canvas.getContext("webgl2");

 if (!gl) {
 console.error("WebGL2 is required for this shader.");
 return;
 }

 const program = createProgram(
 gl,
 vertexShaderSource,
 fragmentShaderSource
 );

 gl.useProgram(program);

 const positionBuffer = gl.createBuffer();

 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

 gl.bufferData(
 gl.ARRAY_BUFFER,
 new Float32Array([
 -1, -1,
 1, -1,
 -1, 1,
 -1, 1,
 1, -1,
 1, 1,
 ]),
 gl.STATIC_DRAW
 );

 const positionLocation = gl.getAttribLocation(program,"position");

 gl.enableVertexAttribArray(positionLocation);
 gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

 const resolutionLocation = gl.getUniformLocation(program,"iResolution");
 const timeLocation = gl.getUniformLocation(program,"iTime");

 const trailLocation = gl.getUniformLocation(program,"iTrail[0]");
 const trailAlphaLocation = gl.getUniformLocation(program,"iTrailAlpha[0]");
 const trailCountLocation = gl.getUniformLocation(program,"iTrailCount");

 const channel0Location = gl.getUniformLocation(program,"iChannel0");
 const channel1Location = gl.getUniformLocation(program,"iChannel1");

 const [baseImage, noiseImage] = await Promise.all([
 loadImage(iChannel0),
 loadImage(iChannel1),
 ]);

 if (disposed) return;

 createTexture(gl, baseImage, 0, false);
 createTexture(gl, noiseImage, 1, true);

 gl.uniform1i(channel0Location, 0);
 gl.uniform1i(channel1Location, 1);

 function resizeCanvas() {
 const dpr = window.devicePixelRatio || 1;

 const displayWidth = window.innerWidth;
 const displayHeight = window.innerHeight;

 const nextWidth = Math.floor(displayWidth * dpr);
 const nextHeight = Math.floor(displayHeight * dpr);

 if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
 canvas.width = nextWidth;
 canvas.height = nextHeight;

 canvas.style.width ="100vw";
 canvas.style.height ="100vh";

 gl.viewport(0, 0, canvas.width, canvas.height);
 }
 }

 function render() {
 resizeCanvas();

 const now = performance.now();
 gl.uniform1f(timeLocation, now / 1000);

 const maxTrailPoints = 240;

 // Smaller = reveal returns to frosted faster.
 // Try 450 for quick fade, 900 for slower fade.
 const trailLifetime = 650;

 // Lerp pointer for smoother reveal.
 const pointer = pointerRef.current;
 const dt = pointer.lastT ? Math.min(64, now - pointer.lastT) : 16.67;
 pointer.lastT = now;

 // Convert to an exponential lerp factor that's stable across frame rates.
 const t = 1.0 - Math.pow(0.001, dt / 1000);
 pointer.x += (pointer.tx - pointer.x) * t;
 pointer.y += (pointer.ty - pointer.y) * t;

 const leaveDuration = 180;
 const leavingAge = pointer.leaving ? now - pointer.leaveAt : 0;
 const leaving = pointer.leaving && leavingAge < leaveDuration;
 const pushStrength = pointer.inside
 ? 1
 : leaving
 ? 1 - leavingAge / leaveDuration
 : 0;

 if (pushStrength > 0) {
 const trail = trailRef.current;
 const last = trail[trail.length - 1];
 const dx = last ? pointer.x - last.x : 1;
 const dy = last ? pointer.y - last.y : 1;
 const distance = Math.sqrt(dx * dx + dy * dy);

 // Smaller = denser/smoother trail.
 const minDist = pointer.inside ? 0.0022 : 0.0013;
 if (!last || distance > minDist) {
 trail.push({
 x: pointer.x,
 y: pointer.y,
 time: now,
 strength: pushStrength,
 });
 }
 }

 let trail = trailRef.current;

 trail = trail.filter((point) => now - point.time < trailLifetime);

 if (trail.length > maxTrailPoints) {
 trail = trail.slice(trail.length - maxTrailPoints);
 }

 trailRef.current = trail;

 const trailData = new Float32Array(maxTrailPoints * 2);
 const trailAlphaData = new Float32Array(maxTrailPoints);

 trail.forEach((point, index) => {
 const age = now - point.time;
 const life = Math.max(0, 1 - age / trailLifetime);

 // Smooth fade-out instead of abrupt reset.
 const baseAlpha = life * life * (3 - 2 * life);
 const alpha = baseAlpha * (point.strength ?? 1);

 trailData[index * 2] = point.x;
 trailData[index * 2 + 1] = point.y;
 trailAlphaData[index] = alpha;
 });

 gl.clear(gl.COLOR_BUFFER_BIT);

 gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

 gl.uniform2fv(trailLocation, trailData);
 gl.uniform1fv(trailAlphaLocation, trailAlphaData);
 gl.uniform1i(trailCountLocation, trail.length);

 gl.drawArrays(gl.TRIANGLES, 0, 6);

 frameId = requestAnimationFrame(render);
 }

 render();
 }

 init();

 return () => {
 disposed = true;
 cancelAnimationFrame(frameId);
 };
 }, [iChannel0, iChannel1]);

 function updatePointerFromEvent(event) {
 const canvas = canvasRef.current;

 if (!canvas) return;

 const rect = canvas.getBoundingClientRect();

 const x = (event.clientX - rect.left) / rect.width;
 const y = (event.clientY - rect.top) / rect.height;

 const pointer = pointerRef.current;
 pointer.tx = x;
 pointer.ty = y;
 }

 return (
 <canvas
 ref={canvasRef}
 onPointerEnter={(e) => {
 pointerRef.current.inside = true;
 updatePointerFromEvent(e);
 }}
 onPointerMove={(e) => {
 updatePointerFromEvent(e);
 }}
 onPointerLeave={() => {
 pointerRef.current.inside = false;
 pointerRef.current.leaving = true;
 pointerRef.current.leaveAt = performance.now();
 }}
 className={className}
 style={{
 position:"fixed",
 inset: 0,
 width:"100vw",
 height:"100vh",
 display:"block",
 ...style,
 }}
 />
 );
}
