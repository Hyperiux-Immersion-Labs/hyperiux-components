/**

 * Usage:
 * <StripSlider items={galleryContent} />
 *
 * `items` shape:
 * {
 * id: string, // unique key
 * url: string, // image path e.g.'/assets/nature/nature01.png'
 * atlasIndex?: number, // kept for particle compat (defaults to item index)
 * imageCount?: number, // number of sub-images in the strip
 * dispScale?: number, // displacement strength (default 1)
 * text?: string, // newline-separated description lines
 * }
 */

'use client'

import { useEffect, useRef } from "react";
import * as THREE from "three";
const randRange = (min, max) => max === undefined ? Math.random() * min : min + Math.random() * (max - min);
const randSigned = (mag) => (Math.random() - 0.5) * 2 * mag;
const lerp = (a, b, t) => a + (b - a) * t;
const arrayShuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
const arrayRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Ribbon ---
const ribbonVert = /* glsl */`
 uniform float uTime;
 uniform sampler2D uTex;
 varying vec2 vUV;

 void main() {
 vUV = uv;
 float angle = uv.x * 6.28318;
 float wave = sin(angle * 2.0 + uTime * 0.001) * 0.6
 + cos(angle * 3.5 + uTime * 0.0006) * 0.25;
 vec3 pos = position;
 pos.y += wave;
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
 }
`;

const ribbonFrag = /* glsl */`
 uniform sampler2D uTex;
 varying vec2 vUV;

 void main() {
 vec4 col = texture2D(uTex, vUV);
 gl_FragColor = col;
 }
`;

// --- Gallery ---
const galleryVert = /* glsl */`
 uniform int uPortrait;
 uniform sampler2D uTex;
 uniform sampler2D uNormalsTex;

 varying float vWidth;
 varying vec2 vTexCoord;
 varying vec2 vTexCoordB;
 varying float vTexBlend;

 const float dispVertScale = 4.0;
 const float dispNormScale = 0.01;
 const float dispViewScale = 30.0;
  #ifdef USE_INSTANCING
 attribute int aAtlasIndex;
 const float atlasX = 8.0;
 const float atlasY = 4.0;
 const vec2 atlasImageSize = vec2(1.0/atlasX, 1.0/atlasY);
 #else
 uniform float uTime;
 uniform float uStartTime;
 uniform float uGlobalScale;
 uniform float uImageWidth;
 uniform float uDispScale;
 uniform float uImageAspect;
 const float imageInterval = 3000.0;
 const float fadeDuration = 1000.0;
 #endif

 void main() {
 #ifdef USE_INSTANCING
 //  // Low-res instanced mesh with shared texture atlas
 // 
 vWidth = instanceMatrix[0].x;

 float atlasCol = mod(float(aAtlasIndex), atlasX);
 float atlasRow = floor(float(aAtlasIndex) / atlasX);

 vTexCoord = uPortrait > 0 ? vec2(
 (atlasCol + uv.y) * atlasImageSize.x,
 (atlasRow + ((1.0 - uv.x) * vWidth) + (0.5 - vWidth/2.0)) * atlasImageSize.y
 ) : vec2(
 (atlasCol + (uv.x * vWidth) + (0.5 - vWidth/2.0)) * atlasImageSize.x,
 (atlasRow + 1.0 - uv.y) * atlasImageSize.y
 );

 float disp = texture2D(uTex, vTexCoord).a;
 float dispScaled = (disp - 0.5) * vWidth * dispVertScale;
 vec3 posDisp = vec3(position.xy, dispScaled);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(posDisp, 1.0);

 #else
 //  // High-res mesh with multiple images per item
 // 
 // Setup

 vWidth = modelMatrix[0].x / uGlobalScale;

 vec2 visualUV = uPortrait > 0 ? vec2(uv.y, 1.0 - uv.x) : uv;
 vec2 visualUV_expanded = visualUV;
  if (uPortrait > 0) {
 visualUV_expanded.y = (visualUV.y - 0.5) * vWidth + 0.5;
 } else {
 visualUV_expanded.x = (visualUV.x - 0.5) * vWidth + 0.5;
 }

 float expandedAspect = 1.0;
 float singleImageAspect = uImageAspect * uImageWidth;

 float rs = expandedAspect / singleImageAspect;
 vec2 scale = vec2(1.0);
 vec2 offset = vec2(0.0);

 if (rs > 1.0) {
 scale.y = 1.0 / rs;
 offset.y = (1.0 - scale.y) * 0.5;
 } else {
 scale.x = rs;
 offset.x = (1.0 - scale.x) * 0.5;
 }

 vec2 localUV = visualUV_expanded * scale + offset;
 vTexCoord = vec2(localUV.x * uImageWidth, localUV.y);

 // If item has multiple images

 if (uImageWidth < 1.0) {
 float totalProgress = uTime - uStartTime;
 float imageProgress = mod(totalProgress, imageInterval);
 vTexBlend = smoothstep(imageInterval - fadeDuration, imageInterval, imageProgress);
  vTexCoord += vec2(floor(totalProgress / imageInterval) * uImageWidth, 0.0);
 vTexCoordB = vTexCoord + vec2(uImageWidth, 0.0);
 }

 // Basic displacement

 float disp = texture2D(uTex, vTexCoord).a;
 if (vTexBlend > 0.0) {
 float dispB = texture2D(uTex, vTexCoordB).a;
 disp = mix(disp, dispB, vTexBlend);
 }

 float dispScaled = (disp - 0.5) * vWidth * dispVertScale;
 vec3 posDisp = vec3(position.xy, dispScaled);

 // Texture offset

 vec4 normal = texture2D(uNormalsTex, vTexCoord);
 if (vTexBlend > 0.0) {
 vec4 normalB = texture2D(uNormalsTex, vTexCoordB);
 normal = mix(normal, normalB, vTexBlend);
 }

 if (normal.a < 0.01) {
 // Hide high-res mesh if normal texture hasn't loaded yet
 posDisp.y = 999999.9;
 } else {
 // Texture shift from normal map
 vec2 dispNormal = vWidth * (normal.rg * 2.0 - vec2(1.0)) * dispNormScale;

 // Texture shift from camera position
 vec2 view = uPortrait > 0  ? vec2(abs(viewMatrix[0].y)/5.0, abs(viewMatrix[0].z))  : vec2(abs(viewMatrix[0].z), abs(viewMatrix[0].y)*5.0);
 vec2 perspShift = dispNormal * view * dispViewScale;

 vec2 shift = (dispNormal + perspShift) * vec2(uImageWidth, 1.0) * uDispScale;
 vTexCoord += shift;
 vTexCoordB += shift;
 }

 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(posDisp, 1.0);

 #endif
 }
`;

const galleryFrag = /* glsl */`
 uniform sampler2D uTex;

 varying float vWidth;
 varying vec2 vTexCoord;
 varying vec2 vTexCoordB;
 varying float vTexBlend;

 void main() {
 vec4 tex = texture2D(uTex, vTexCoord);
 if (vTexBlend > 0.0) {
 vec4 texB = texture2D(uTex, vTexCoordB);
 tex = mix(tex, texB, vTexBlend);
 }

 float gray = tex.r * 0.299 + tex.g * 0.587 + tex.b * 0.114;
 vec3 mixed = mix(vec3(gray), tex.rgb, min(1.0, vWidth * 2.0));

 gl_FragColor = vec4(mixed, 1.0);
 }
`;


const stripVert = /* glsl */`
 uniform int uPortrait;
 uniform float uWidth; // animated strip width in [0..1]
 uniform float uImageAspect;
 uniform float uImageWidth;

 varying vec2 vTexCoord;
 varying float vWidth;

 void main() {
 vWidth = uWidth;

 vec2 visualUV = uPortrait > 0 ? vec2(uv.y, 1.0 - uv.x) : uv;
 vec2 visualUV_expanded = visualUV;
  if (uPortrait > 0) {
 visualUV_expanded.y = (visualUV.y - 0.5) * uWidth + 0.5;
 } else {
 visualUV_expanded.x = (visualUV.x - 0.5) * uWidth + 0.5;
 }

 float expandedAspect = 1.0;
 float singleImageAspect = uImageAspect * uImageWidth;

 float rs = expandedAspect / singleImageAspect;
 vec2 scale = vec2(1.0);
 vec2 offset = vec2(0.0);

 if (rs > 1.0) {
 scale.y = 1.0 / rs;
 offset.y = (1.0 - scale.y) * 0.5;
 } else {
 scale.x = rs;
 offset.x = (1.0 - scale.x) * 0.5;
 }

 vec2 localUV = visualUV_expanded * scale + offset;
 vTexCoord = vec2(localUV.x * uImageWidth, localUV.y);

 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 }
`;

const stripFrag = /* glsl */`
 uniform sampler2D uTex;

 varying vec2 vTexCoord;
 varying float vWidth;

 void main() {
 vec4 tex = texture2D(uTex, vTexCoord);
 float gray = tex.r * 0.299 + tex.g * 0.587 + tex.b * 0.114;
 vec3 mixed = mix(vec3(gray), tex.rgb, min(1.0, vWidth * 2.0));
 gl_FragColor = vec4(mixed, 1.0);
 }
`;

const normalsVert = /* glsl */`
 varying vec2 vUV;
 void main() {
 vUV = uv;
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 }
`;

const normalsFrag = /* glsl */`
 uniform sampler2D uSrcTex;
 varying vec2 vUV;
 const float dispNormalRad = 0.007;
 void main() {
 float d = texture2D(uSrcTex, vUV).a;
 float dt = texture2D(uSrcTex, vUV + vec2(0.0, dispNormalRad)).a;
 float db = texture2D(uSrcTex, vUV + vec2(0.0, -dispNormalRad)).a;
 float dl = texture2D(uSrcTex, vUV + vec2(-dispNormalRad, 0.0)).a;
 float dr = texture2D(uSrcTex, vUV + vec2( dispNormalRad, 0.0)).a;
 float dtl = texture2D(uSrcTex, vUV + vec2(-dispNormalRad*0.72, dispNormalRad*0.72)).a;
 float dtr = texture2D(uSrcTex, vUV + vec2( dispNormalRad*0.72, dispNormalRad*0.72)).a;
 float dbl = texture2D(uSrcTex, vUV + vec2(-dispNormalRad*0.72, -dispNormalRad*0.72)).a;
 float dbr = texture2D(uSrcTex, vUV + vec2( dispNormalRad*0.72, -dispNormalRad*0.72)).a;
 vec2 avg = (
 vec2(dtl-d, d-dtl) + vec2(0.0, d-dt) + vec2(d-dtr, d-dtr) +
 vec2( dl-d, 0.0) + vec2(d-dr, 0.0) +
 vec2(dbl-d, dbl-d) + vec2(0.0, db-d) + vec2(d-dbr, dbr-d)
 ) / 8.0;
 avg = avg / 2.0 + vec2(0.5);
 gl_FragColor = vec4(avg, 0.5, 1.0);
 }
`;

// Main overlay
const overlayMainVert = /* glsl */`
 varying vec2 vUV;
 void main() {
 vUV = vec2(uv.x, uv.y * 5.0 - 1.75);
 if (uv.y > 0.55) vUV.y -= 0.5;
 else if (uv.y > 0.45) vUV.y -= 0.25;
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 }
`;

const overlayMainFrag = /* glsl */`
 uniform sampler2D uTex;
 varying vec2 vUV;
 void main() {
 vec4 tex = texture2D(uTex, vUV);
 gl_FragColor = vec4(vec3(1.0), tex.a);
 }
`;

// Nav and text
const overlayNavVert = /* glsl */`
 uniform int uPortrait;
  varying vec2 vUV;
 varying vec4 vXYWH;
 varying float vHover;
 #ifdef USE_INSTANCING
 attribute vec4 aXYWH;
 attribute int aHover;
 #endif
 void main() {
 #ifdef USE_INSTANCING
 vUV = vec2(
 aXYWH[0] + uv.x * aXYWH[2],
 1.0 - aXYWH[1] - (1.0 - uv.y) * aXYWH[3]
 );
 vXYWH = aXYWH;
 vHover = float(aHover);
 // Horribly hacky way to move logo in portrait
 vec3 posMod = position;
 if (uPortrait > 0 && aXYWH[2] < 0.5) posMod += vec3(1.4, -4.8, 0.0);
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(posMod, 1.0);
 #else
 vUV = uv;
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 #endif
 }
`;

const overlayNavFrag = /* glsl */`
 uniform sampler2D uTex;
 varying vec2 vUV;
 varying vec4 vXYWH;
 varying float vHover;
 void main() {
 vec2 uv = gl_FrontFacing ? vUV : vec2(vXYWH[2] - vUV.x, vUV.y);
 vec4 tex = (vHover > 0.0)  ? vec4(vec3(1.0 - texture2D(uTex, uv).a), 1.0)
 : vec4(vec3(1.0), texture2D(uTex, uv).a);
 gl_FragColor = vec4(tex);
 }
`;

// --- Haze ---
const hazeVert = /* glsl */`
 uniform float uTime;
 uniform float uLifespan;
 attribute float aStartTime;
 varying float vAlpha;

 void main() {
 float age = uTime - aStartTime;
 float progress = clamp(age / uLifespan, 0.0, 1.0);
 vAlpha = sin(progress * 3.14159) * 0.15;

 vec3 pos = position;
 pos.z += progress * 5.0;
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(pos, 1.0);
 }
`;

const hazeFrag = /* glsl */`
 varying float vAlpha;

 void main() {
 vec2 uv = gl_PointCoord - 0.5;
 float dist = 1.0 - smoothstep(0.0, 0.5, length(uv));
 gl_FragColor = vec4(1.0, 1.0, 1.0, dist * vAlpha);
 }
`;




export default function StripSlider({ items }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;


        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(25, 1, 0.01, 1000);
        const CAMERA_Z = 90;
        camera.position.z = CAMERA_Z * 1.1;

        const uTime = { value: 0 };
        const uPortrait = { value: false };
        const uGlobalScale = { value: 10.5 };

        const dummyVec3 = new THREE.Vector3();
        const dummyMat4 = new THREE.Matrix4();


        const randomSeed = randRange(1_000_000);
        let normalsScene, normalsCamera, normalsMesh;
        function calcGalleryTexNormals(srcTex) {
            if (!normalsScene) {
                normalsScene = new THREE.Scene();
                normalsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                normalsMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(2, 2),
                    new THREE.ShaderMaterial({
                        vertexShader: normalsVert,
                        fragmentShader: normalsFrag,
                        uniforms: { uSrcTex: { type: 't' } },
                    })
                );
                normalsScene.add(normalsMesh);
            }
            const out = new THREE.WebGLRenderTarget(512, 512, { wrapS: THREE.RepeatWrapping });
            normalsMesh.material.uniforms.uSrcTex.value = srcTex;
            renderer.setRenderTarget(out);
            renderer.render(normalsScene, normalsCamera);
            renderer.setRenderTarget(null);
            return out.texture;
        }

        const textureLoader = new THREE.TextureLoader();

        function loadItemTexture(item) {
            return new Promise((resolve) => {
                textureLoader.load(
                    item.url,
                    (tex) => {
                        tex.wrapS = THREE.RepeatWrapping;
                        resolve(tex);
                    },
                    undefined,
                    () => {
                        // On error: fallback to a solid-colour 1×1 canvas texture
                        const c = document.createElement('canvas');
                        c.width = c.height = 4;
                        const ctx = c.getContext('2d');
                        ctx.fillStyle = '#444';
                        ctx.fillRect(0, 0, 4, 4);
                        const fallback = new THREE.CanvasTexture(c);
                        fallback.wrapS = THREE.RepeatWrapping;
                        resolve(fallback);
                    }
                );
            });
        }
        const GALLERY_WIDTH = 3;
        const GALLERY_ITEM_GAP = 0.02;
        let GALLERY_ITEM_W = 0.05; // recalculated below

        arrayShuffle(items);

        const galleryContent = items.map((item, i) => ({
            ...item,
            i,
            imageWidth: 1 / (item.imageCount || 1),
            dispScale: item.dispScale || 1,
            expanded: (i === 0),
            width: (i === 0) ? 1 : GALLERY_ITEM_W,
        }));

        GALLERY_ITEM_W = (GALLERY_WIDTH - 1 - GALLERY_ITEM_GAP * (galleryContent.length - 1)) /
            (galleryContent.length - 1);
        galleryContent.forEach((item, i) => { if (i > 0) item.width = GALLERY_ITEM_W; });

        const galleryContainer = new THREE.Object3D();
        scene.add(galleryContainer);
        galleryContainer.scale.set(uGlobalScale.value, uGlobalScale.value, 1);
        galleryContainer.position.x = GALLERY_WIDTH / -2 * uGlobalScale.value;

        const galleryItems = new THREE.Object3D();
        galleryContainer.add(galleryItems);


        const stripGeo = new THREE.PlaneGeometry(1, 1, 32, 32);

        const stripMeshes = galleryContent.map((item) => {
            const mat = new THREE.ShaderMaterial({
                vertexShader: stripVert,
                fragmentShader: stripFrag,
                uniforms: {
                    uTex: { type: 't', value: null },
                    uWidth: { value: item.width },
                    uPortrait: uPortrait,
                    uImageAspect: { value: 1.0 },
                    uImageWidth: { value: item.imageWidth },
                },
            });
            const mesh = new THREE.Mesh(stripGeo, mat);
            mesh.matrixAutoUpdate = false;
            galleryContainer.add(mesh);

            // Async PNG load — updates texture once ready
            loadItemTexture(item).then((tex) => {
                mat.uniforms.uTex.value = tex;
                item.highResTex = tex;
                item.normalsTex = calcGalleryTexNormals(tex);
                if (tex.image) {
                    const aspect = tex.image.width / tex.image.height;
                    mat.uniforms.uImageAspect.value = aspect;
                    item.imageAspect = aspect;
                }
            });

            return mesh;
        });


        const sharedMat = new THREE.ShaderMaterial({
            vertexShader: galleryVert,
            fragmentShader: galleryFrag,
            uniforms: {
                uTex: { type: 't', value: null },
                uNormalsTex: { type: 't', value: null },
                uPortrait: uPortrait,
            },
        });

        const sharedGeo = new THREE.PlaneGeometry(1, 1, 32, 32);
        sharedGeo.setAttribute(
            'aAtlasIndex',
            new THREE.InstancedBufferAttribute(new Int32Array(galleryContent.length), 1)
        );
        galleryContent.forEach((item, i) => {
            sharedGeo.attributes.aAtlasIndex.array[i] = item.atlasIndex != null ? item.atlasIndex : i;
        });
        sharedGeo.attributes.aAtlasIndex.needsUpdate = true;

        const galleryLowRes = new THREE.InstancedMesh(sharedGeo, sharedMat, galleryContent.length);
        galleryLowRes.visible = false; // hidden; used only for raycasting geometry
        galleryContainer.add(galleryLowRes);

        // --- high-res single mesh (original galleryVert/Frag with displacement) ---
        const highResGeo = new THREE.PlaneGeometry(1, 1, 256, 256);
        const highResMat = new THREE.ShaderMaterial({
            vertexShader: galleryVert,
            fragmentShader: galleryFrag,
            uniforms: {
                uTex: { type: 't', value: null },
                uNormalsTex: { type: 't', value: null },
                uPortrait: uPortrait,
                uGlobalScale: uGlobalScale,
                uTime: uTime,
                uImageWidth: { type: 'f', value: 1 },
                uStartTime: { type: 'f', value: 0 },
                uDispScale: { type: 'f', value: 1 },
                uImageAspect: { value: 1.0 },
            },
        });

        const galleryHighRes = new THREE.Mesh(highResGeo, highResMat);
        galleryHighRes.matrixAutoUpdate = false;
        galleryContainer.add(galleryHighRes);



        // --- overlay bracket ---
        const GALLERY_OVERLAY_Z = -0.5;
        (() => {
            const oGeo = new THREE.PlaneGeometry(1, 5, 1, 32);
            const oCanvas = document.createElement('canvas');
            const S = oCanvas.width = oCanvas.height = 1024;
            const ctx = oCanvas.getContext('2d');
            ctx.lineWidth = 4;
            const gap = 10, pad = ctx.lineWidth / 2 + 1;
            [false, true].forEach(mirror => {
                if (mirror) { ctx.translate(S, 0); ctx.scale(-1, 1); }
                ctx.moveTo(S / 2 - gap, 0); ctx.lineTo(S / 2 - gap, S / 4 - gap);
                ctx.moveTo(S / 2 - gap - gap, S / 4); ctx.lineTo(pad + gap, S / 4);
                ctx.moveTo(pad, S / 4 + gap); ctx.lineTo(pad, S - S / 4 - gap);
                ctx.moveTo(pad + gap, S - S / 4); ctx.lineTo(S / 2 - gap - gap, S - S / 4);
                ctx.moveTo(S / 2 - gap, S - S / 4 + gap); ctx.lineTo(S / 2 - gap, S);
            });
            ctx.stroke();

            const oMat = new THREE.ShaderMaterial({
                vertexShader: overlayMainVert,
                fragmentShader: overlayMainFrag,
                uniforms: { uTex: { value: new THREE.CanvasTexture(oCanvas) } },
                transparent: true,
                depthWrite: false,
            });

            const overlayMesh = new THREE.Mesh(oGeo, oMat);
            overlayMesh.position.set(0.5, 0, GALLERY_OVERLAY_Z);
            overlayMesh.scale.set(1.05, 1.05, 1);
            overlayMesh.name = 'galleryOverlay';
            galleryContainer.add(overlayMesh);
        })();

        let ribbon;
        const ribbonAxis = new THREE.Vector3(0, 1, 0);
        (() => {
            const buzzwords = [
                'STRIP SLIDER', 'THREE.JS', 'HYPERIUX', 'CREATIVE CODING', 'STRIP SLIDER', 'THREE.JS', 'HYPERIUX', 'CREATIVE CODING'
            ];

            const rc = document.createElement('canvas');
            rc.width = 4096;
            rc.height = 96;
            const ctx = rc.getContext('2d');
            const font = '70px monospace';
            ctx.font = font;
            const pad = [0, 25, 27, 25];
            const gap = 15;
            const repeatGap = 120; // explicit gap at the seam between repeats
            const boxh = 96;

            let widths = buzzwords.map(s => ctx.measureText(s).width + pad[1] + pad[3] + gap);
            const totalContent = widths.reduce((a, b) => a + b, 0);

            // Resize canvas to content + repeat gap so seam is clean
            rc.width = totalContent + repeatGap;

            ctx.font = font;
            let x = 0;
            buzzwords.forEach((word) => {
                ctx.fillStyle = 'black';
                ctx.fillRect(x, 0, widths[buzzwords.indexOf(word)] - gap, boxh);
                ctx.fillStyle = 'white';
                ctx.fillText(word, x + pad[3], boxh - pad[2]);
                x += widths[buzzwords.indexOf(word)];
            });

            const tex = new THREE.CanvasTexture(rc);
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            tex.wrapS = THREE.RepeatWrapping;

            const geo = new THREE.CylinderGeometry(
                10,
                10,
                0.9,
                206,
                1,
                true,
                0,
                Math.PI * 2 * 0.99 // creates a gap 
            );
            const mat = new THREE.ShaderMaterial({
                vertexShader: ribbonVert,
                fragmentShader: ribbonFrag,
                side: THREE.DoubleSide,
                uniforms: { uTime: uTime, uTex: { value: tex } },
            });
            ribbon = new THREE.Mesh(geo, mat);
            ribbon.rotation.x = randSigned(0.3);
            ribbon.rotation.z = 0.9;
            scene.add(ribbon);
        })();


        const HAZE_INTERVAL = 5000;
        const HAZE_LIFESPAN = 30000;
        const hazeCount = Math.ceil(HAZE_LIFESPAN / HAZE_INTERVAL);
        let hazeLast = -9999999;

        const hazeGeo = new THREE.PlaneGeometry(1, 1, 64, 64);
        hazeGeo.setAttribute(
            'aStartTime',
            new THREE.InstancedBufferAttribute(new Float32Array(hazeCount).fill(-9999999), 1)
        );
        const hazeMat = new THREE.ShaderMaterial({
            vertexShader: hazeVert,
            fragmentShader: hazeFrag,
            uniforms: {
                uTime: uTime,
                uLifespan: { value: HAZE_LIFESPAN },
            },
            transparent: true,
            depthWrite: false,
        });
        const hazeMesh = new THREE.InstancedMesh(hazeGeo, hazeMat, hazeCount);
        scene.add(hazeMesh);

        function refreshHaze(i) {
            const scale = randRange(30, 70);
            dummyMat4.makeScale(scale, scale, 1.0);
            dummyVec3.set(randSigned(15), randSigned(5), randSigned(30));
            if (dummyVec3.z > 0) {
                dummyVec3.x += 15 * Math.sign(dummyVec3.x);
                dummyVec3.y += 5 * Math.sign(dummyVec3.y);
                dummyVec3.z += 20;
            } else {
                dummyVec3.z -= 20;
            }
            dummyMat4.setPosition(dummyVec3);
            hazeMesh.setMatrixAt(i, dummyMat4);
            hazeMesh.instanceMatrix.needsUpdate = true;
            hazeGeo.attributes.aStartTime.array[i] = uTime.value;
            hazeGeo.attributes.aStartTime.needsUpdate = true;
        }

        let portrait = false;
        let activeItem = galleryContent[0];
        let tLast = 0;
        let cameraTarget = new THREE.Vector3(0, 0, CAMERA_Z);
        const CAMERA_SWAY = 0.03;
        const pointer = new THREE.Vector2(-1, 0);
        const raycaster = new THREE.Raycaster();

        function resize() {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            portrait = h > w;
            uPortrait.value = portrait;

            camera.up.set(portrait ? -1 : 0, portrait ? 0 : 1, 0);
            camera.aspect = w / h;
            const aspect = camera.aspect;
            camera.zoom = portrait ? Math.min(aspect * 2.2, 1.1) : Math.min(aspect, 2);

            renderer.setSize(w, h, false);
            camera.updateProjectionMatrix();
        }
        function navigateGallery(dir) {
            const next = activeItem.i + dir;
            if (next >= 0 && next < galleryContent.length) {
                activeItem.expanded = false;
                galleryContent[next].expanded = true;
                activeItem = galleryContent[next];
            }
        }

        let rafId;
        function animate(t) {
            rafId = requestAnimationFrame(animate);

            const frameDelta = Math.min(t - tLast, 100);
            tLast = t;
            uTime.value = t + randomSeed;

            // --- gallery accordion ---
            let inMotion = false;
            let x = 0;
            let expandedCenterX = 0.5;

            galleryContent.forEach((item, i) => {
                const targetW = item.expanded ? 1 : GALLERY_ITEM_W; // shrink expanded image slightly
                if (Math.abs(item.width - targetW) > 0.0001) inMotion = true;
                item.width = lerp(item.width, targetW, frameDelta * 0.005);

                // Build transform matrix (shared between raycaster mesh and strip mesh)
                dummyMat4.makeScale(item.width, 1, 1);
                if (i > 0) {
                    const prevExpanded = galleryContent[i - 1].expanded;
                    x += (item.expanded || prevExpanded) ? GALLERY_ITEM_GAP * 4 : GALLERY_ITEM_GAP;
                }
                dummyMat4.setPosition(x + item.width / 2, 0, 0);
                if (item.expanded) expandedCenterX = x + item.width / 2;
                x += item.width;

                // Keep invisible raycaster InstancedMesh up to date
                galleryLowRes.setMatrixAt(i, dummyMat4);

                // Drive visible strip mesh
                stripMeshes[i].matrix.copy(dummyMat4);
                stripMeshes[i].matrixWorldNeedsUpdate = true;
                stripMeshes[i].material.uniforms.uWidth.value = item.width;

                if (item.expanded) activeItem = item;
            });

            // --- high-res + particles sync ---
            if (galleryHighRes.sourceInstance !== activeItem.i) {
                inMotion = true;
                if (activeItem.highResTex && activeItem.normalsTex) {
                    galleryHighRes.sourceInstance = activeItem.i;
                    highResMat.uniforms.uStartTime.value = uTime.value;
                    highResMat.uniforms.uImageWidth.value = activeItem.imageWidth;
                    highResMat.uniforms.uTex.value = activeItem.highResTex;
                    highResMat.uniforms.uNormalsTex.value = activeItem.normalsTex;
                    highResMat.uniforms.uDispScale.value = activeItem.dispScale;
                    if (activeItem.imageAspect !== undefined) {
                        highResMat.uniforms.uImageAspect.value = activeItem.imageAspect;
                    }
                } else {
                    highResMat.uniforms.uTex.value = null;
                    highResMat.uniforms.uNormalsTex.value = null;
                }
            }

            if (inMotion) {
                galleryLowRes.instanceMatrix.needsUpdate = true;

                // Mirror active item matrix to high-res mesh
                galleryLowRes.getMatrixAt(activeItem.i, galleryHighRes.matrix);

                const overlay = galleryContainer.getObjectByName('galleryOverlay');
                if (overlay) {
                    dummyVec3.set(expandedCenterX, 0, GALLERY_OVERLAY_Z);
                    overlay.position.lerp(dummyVec3, frameDelta * 0.004);
                }
            }

            // Hide the strip mesh for the active (expanded) item — high-res takes over
            stripMeshes.forEach((mesh, i) => {
                mesh.visible = (galleryHighRes.sourceInstance !== i);
            });

            // --- haze ---
            if (t > hazeLast + HAZE_INTERVAL) {
                const startTimes = hazeGeo.attributes.aStartTime.array;
                const expired = Array.from(startTimes).findIndex(st => st + HAZE_LIFESPAN < uTime.value);
                if (expired >= 0) {
                    refreshHaze(expired);
                    hazeLast = t;
                }
            }

            // --- ribbon rotation ---
            if (ribbon) {
                ribbon.rotateOnAxis(ribbonAxis, frameDelta * 0.00015);
            }

            // --- camera ---
            camera.position.lerp(cameraTarget, frameDelta * 0.001);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();

            renderer.render(scene, camera);
        }

        function onMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const w = rect.width;
            const h = rect.height;

            if (portrait) {
                cameraTarget.set((h / 2 - cy) * -CAMERA_SWAY, (w / 2 - cx) * -CAMERA_SWAY, CAMERA_Z);
            } else {
                cameraTarget.set((w / 2 - cx) * -CAMERA_SWAY, (h / 2 - cy) * CAMERA_SWAY, CAMERA_Z);
            }

            pointer.set((cx / w) * 2 - 1, (cy / h) * -2 + 1);
            raycaster.setFromCamera(pointer, camera);

            // Temporarily make the InstancedMesh visible so raycaster can hit it
            galleryLowRes.visible = true;
            const hits = raycaster.intersectObject(galleryLowRes);
            galleryLowRes.visible = false;

            if (hits.length) {
                galleryContent.forEach((item, i) => { item.expanded = (i === hits[0].instanceId); });
            }
        }

        let touchLast = null;
        let touchTracker = 0;
        const TOUCH_SPEED = 0.015;

        function onTouchStart() { touchTracker = 0; touchLast = null; }

        function onTouchMove(e) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const pos = portrait ? e.touches[0].screenY : e.touches[0].screenX;
            const delta = touchLast !== null ? pos - touchLast : 0;
            if (Math.sign(pos) !== Math.sign(touchLast)) touchTracker = 0;
            touchLast = pos;
            touchTracker += delta;
            const threshold = (portrait ? rect.height : rect.width) * TOUCH_SPEED;
            if (Math.abs(touchTracker) > threshold) {
                navigateGallery(Math.sign(touchTracker));
                touchTracker -= Math.sign(touchTracker) * threshold;
            }
        }

        let scrollTracker = 0;
        let scrollLast = null;
        const SCROLL_SPEED = 0.01;

        function onWheel(e) {
            e.preventDefault();
            const pos = e.deltaX + e.deltaY;
            if (Math.sign(pos) !== Math.sign(scrollLast)) scrollTracker = 0;
            scrollLast = pos;
            scrollTracker += pos;
            const rect = canvas.getBoundingClientRect();
            const threshold = (portrait ? rect.height : rect.width) * SCROLL_SPEED;
            if (Math.abs(scrollTracker) > threshold) {
                navigateGallery(Math.sign(scrollTracker));
                scrollTracker -= Math.sign(scrollTracker) * threshold;
            }
        }

        function onKeyDown(e) {
            if (!e.key.startsWith('Arrow')) return;
            const dir = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1;
            navigateGallery(dir);
        }

        const resizeObs = new ResizeObserver(resize);
        resizeObs.observe(canvas);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('touchstart', onTouchStart, { passive: true });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeyDown);

        resize();
        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            resizeObs.disconnect();
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%', background: '#000' }}
        />
    );
}