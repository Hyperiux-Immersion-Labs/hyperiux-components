import * as THREE from"three";

export const CONFIG = {
 imageSrc:"/assets/ametrasu-img.png",

 desktopSampleStep: 3,
 mobileSampleStep: 4,

 desktopWorldWidth: 5.8,
 mobileWorldWidth: 5.0,

 alphaThreshold: 3,

 minParticleSize: 26.0,
 maxParticleSize: 30.0,
 randomSizeStrength: 0.9,
 randomSizeMinMultiplier: 0.65,
 randomSizeMaxMultiplier: 1.45,

 nearSizeStrength: 2.4,
 maxPointSize: 42.0,

 flowX: 0.34,
 flowY: 0.28,
 flowZ: 0.12,
 swirlStrength: 0.12,

 fov: 52,
 cameraZ: 7.2,
 cameraEndZ: 4.6,

 pointerParticleStrengthX: 0.72,
 pointerParticleStrengthY: 0.72,
 pointerCameraStrengthX: 0.72,
 pointerCameraStrengthY: 0.7,
 pointerLookAtX: 0.0,
 pointerLookAtY: 0.0,
 pointerLerp: 0.06,

 motionStart: 0.05,
 motionEnd: 0.3,

 fadeStart: 0.2,
 fadeEnd: 0.3,

 // center particles start scattering more after this scroll progress
 centerScatterStart: 0.1,
 centerScatterEnd: 0.2,
 centerEndScatter: 10.2,

 scatterXMin: 0.08,
 scatterXMax: 1.35,
 scatterYMin: 0.06,
 scatterYMax: 1.1,

 forwardZBase: 12.6,
 forwardZEdgeBoost: 10.2,
 centerPushBack: 11.1,

 targetScaleXMin: 1.08,
 targetScaleXMax: 1.5,
 targetScaleYMin: 1.06,
 targetScaleYMax: 1.42,

 colorShiftStrength: 10.0,
 centerColorBoost: 5.55,

 fadeJitterStart: 0.05,
 fadeJitterEnd: 0.12,

 keepRatioBeforeFade: 1.0,
 keepRatioAtEnd: 0.18,
 minVisibleCount: 850,

 // default transition colors
 transitionColors: ["#00001A","#0000D1","#ffffff"],
};

export function lerp(a, b, t) {
 return a + (b - a) * t;
}

export function shuffleArray(arr) {
 for (let i = arr.length - 1; i > 0; i -= 1) {
 const j = Math.floor(Math.random() * (i + 1));
 [arr[i], arr[j]] = [arr[j], arr[i]];
 }
}

export function loadImage(src) {
 return new Promise((resolve, reject) => {
 const img = new Image();
 img.crossOrigin ="anonymous";
 img.onload = () => resolve(img);
 img.onerror = reject;
 img.src = src;
 });
}

export function getAlphaAt(data, width, height, x, y) {
 const cx = Math.max(0, Math.min(width - 1, x));
 const cy = Math.max(0, Math.min(height - 1, y));
 return data[(cy * width + cx) * 4 + 3] / 255;
}

export function computeEdgeStrength(data, width, height, x, y) {
 const a = getAlphaAt(data, width, height, x, y);
 if (a <= 0.0) return 0;

 let diff = 0;
 let count = 0;

 for (let oy = -1; oy <= 1; oy += 1) {
 for (let ox = -1; ox <= 1; ox += 1) {
 if (ox === 0 && oy === 0) continue;
 const na = getAlphaAt(data, width, height, x + ox, y + oy);
 diff += Math.abs(a - na);
 count += 1;
 }
 }

 return THREE.MathUtils.clamp((diff / Math.max(1, count)) * 2.4, 0, 1);
}

export function hexToVec3(hex) {
 const color = new THREE.Color(hex);
 return [color.r, color.g, color.b];
}