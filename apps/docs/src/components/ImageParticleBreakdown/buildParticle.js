// components/ImageParticleBreakdown/buildParticleData.js

import * as THREE from"three";
import {
 CONFIG,
 lerp,
 shuffleArray,
 loadImage,
 computeEdgeStrength,
} from"./config";

export async function buildParticleData(src, options = {}) {
 const {
 sampleStep = CONFIG.desktopSampleStep,
 worldWidth = CONFIG.desktopWorldWidth,
 alphaThreshold = CONFIG.alphaThreshold,
 minParticleSize = CONFIG.minParticleSize,
 maxParticleSize = CONFIG.maxParticleSize,
 randomSizeStrength = CONFIG.randomSizeStrength,
 randomSizeMinMultiplier = CONFIG.randomSizeMinMultiplier,
 randomSizeMaxMultiplier = CONFIG.randomSizeMaxMultiplier,
 brightnessBoost = 1.04,
 } = options;

 const img = await loadImage(src);

 const canvas = document.createElement("canvas");
 const ctx = canvas.getContext("2d", { willReadFrequently: true });

 canvas.width = img.width;
 canvas.height = img.height;
 ctx.drawImage(img, 0, 0);

 const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

 const aspect = width / height;
 const worldHeight = worldWidth / aspect;

 const particles = [];

 for (let y = 0; y < height; y += sampleStep) {
 for (let x = 0; x < width; x += sampleStep) {
 const i = (y * width + x) * 4;

 const r = data[i] / 255;
 const g = data[i + 1] / 255;
 const b = data[i + 2] / 255;
 const a = data[i + 3];

 if (a < alphaThreshold) continue;

 const brightness = (r + g + b) / 3;
 const alphaN = a / 255;

 const px = (x / width - 0.5) * worldWidth;
 const py = -(y / height - 0.5) * worldHeight;
 const pz = 0;

 const normX = x / width;
 const normY = y / height;
 const edgeStrength = computeEdgeStrength(data, width, height, x, y);

 const randX = Math.random() - 0.5;
 const randY = Math.random() - 0.5;
 const randZ = Math.random() - 0.5;

 const dx = normX - 0.5;
 const dy = normY - 0.5;
 const distFromCenter = Math.sqrt(dx * dx + dy * dy) / 0.70710678;
 const radialCenter = 1.0 - THREE.MathUtils.clamp(distFromCenter, 0, 1);
 const centerStrength = THREE.MathUtils.clamp(
 Math.pow(radialCenter, 1.9) * (1.0 - edgeStrength * 0.55),
 0,
 1
 );

 // IMPORTANT:
 // no center culling here anymore
 // density reduction will now only happen later, when fade/color transition starts,
 // through the visibleCount logic in ImageParticles.jsx

 const scatterX = randX * lerp(CONFIG.scatterXMin, CONFIG.scatterXMax, edgeStrength);
 const scatterY = randY * lerp(CONFIG.scatterYMin, CONFIG.scatterYMax, edgeStrength);

 const forwardZ =
 CONFIG.forwardZBase +
 edgeStrength * CONFIG.forwardZEdgeBoost +
 Math.abs(randZ) * 0.45;

 const scaleX = lerp(CONFIG.targetScaleXMin, CONFIG.targetScaleXMax, edgeStrength);
 const scaleY = lerp(CONFIG.targetScaleYMin, CONFIG.targetScaleYMax, edgeStrength);

 const targetPosition = [
 px * scaleX + scatterX,
 py * scaleY + scatterY,
 forwardZ,
 ];

 const depthNorm = THREE.MathUtils.clamp(
 (forwardZ - CONFIG.forwardZBase) / Math.max(0.001, CONFIG.forwardZEdgeBoost + 0.45),
 0,
 1
 );

 const parallax = THREE.MathUtils.clamp(
 0.08 + edgeStrength * 0.52 + depthNorm * 0.75,
 0.08,
 1.45
 );

 const baseSize = lerp(
 minParticleSize,
 maxParticleSize,
 brightness * 0.72 + alphaN * 0.28
 );

 const randomSizeMultiplier = lerp(
 randomSizeMinMultiplier,
 randomSizeMaxMultiplier,
 Math.random()
 );

 const finalParticleSize = lerp(
 baseSize,
 baseSize * randomSizeMultiplier,
 randomSizeStrength
 );

 particles.push({
 basePosition: [px, py, pz],
 targetPosition,
 color: [
 Math.min(1, r * brightnessBoost),
 Math.min(1, g * brightnessBoost),
 Math.min(1, b * brightnessBoost),
 ],
 size: finalParticleSize,
 random: [randX, randY, randZ],
 edge: edgeStrength,
 parallax,
 center: centerStrength,
 fadeOffset: Math.random(),
 });
 }
 }

 shuffleArray(particles);

 const count = particles.length;

 const positions = new Float32Array(count * 3);
 const targetPositions = new Float32Array(count * 3);
 const colors = new Float32Array(count * 3);
 const sizes = new Float32Array(count);
 const randoms = new Float32Array(count * 3);
 const edges = new Float32Array(count);
 const parallaxes = new Float32Array(count);
 const centers = new Float32Array(count);
 const fadeOffsets = new Float32Array(count);

 for (let i = 0; i < count; i += 1) {
 const p = particles[i];
 const i3 = i * 3;

 positions[i3 + 0] = p.basePosition[0];
 positions[i3 + 1] = p.basePosition[1];
 positions[i3 + 2] = p.basePosition[2];

 targetPositions[i3 + 0] = p.targetPosition[0];
 targetPositions[i3 + 1] = p.targetPosition[1];
 targetPositions[i3 + 2] = p.targetPosition[2];

 colors[i3 + 0] = p.color[0];
 colors[i3 + 1] = p.color[1];
 colors[i3 + 2] = p.color[2];

 sizes[i] = p.size;

 randoms[i3 + 0] = p.random[0];
 randoms[i3 + 1] = p.random[1];
 randoms[i3 + 2] = p.random[2];

 edges[i] = p.edge;
 parallaxes[i] = p.parallax;
 centers[i] = p.center;
 fadeOffsets[i] = p.fadeOffset;
 }

 return {
 positions,
 targetPositions,
 colors,
 sizes,
 randoms,
 edges,
 parallaxes,
 centers,
 fadeOffsets,
 count,
 };
}