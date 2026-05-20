'use client'

import { useEffect, useRef } from"react";

/* ── constants ── */
const FC = 80, FR = 60, FN = FC * FR;
const CC = 100, CR = 80;
const EDGE_LO = 90, EDGE_HI = 125;
const EDGES = [".",",","=","+","-"];
const BRIGHTS = ["H","Y","P","E","R","I","U","X"];
const ALL_CHARS = [...EDGES, ...BRIGHTS]; // 13 chars total: 5 edges + 8 brights
const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const TL = 320, TS = 10, TM = 72;
const TRAIL_CFG = { dr: 5, drl: 3, sc: 3, vi: 0.04, fb: 0.08, fss: 18, ffm: 0.15, fir: 0.8, firl: 1.0 };

/* ── shaders ── */
const VS = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0, 1); }`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uVideo, uFluid, uAtlas;
uniform vec2 uRes;
uniform int uPhase, uTrailN;
uniform vec4 uTP[${TM}];
uniform float uTL[${TM}];
out vec4 O;

const float CC = ${CC}.0, FC = ${FC}.0, FR = ${FR}.0;
const float EL = ${EDGE_LO}.0, EH = ${EDGE_HI}.0;
const int BAYER[16] = int[16](${BAYER.map(v => Math.round(v / 16 * 255)).join(",")});
const int CHAR_N = ${ALL_CHARS.length};
const int EDGE_N = ${EDGES.length};
const int BRIGHT_N = ${BRIGHTS.length};

void main(){
 float cw = uRes.x / CC;
 float rows = ceil(uRes.y / cw) + 1.0;
 float gx = floor(gl_FragCoord.x / cw);
 float gy = floor((uRes.y - gl_FragCoord.y) / cw);
 if(gx >= CC || gy >= rows) discard;

 vec2 cp = vec2(fract(gl_FragCoord.x / cw), fract((uRes.y - gl_FragCoord.y) / cw));
 vec2 bp = vec2((gx + 0.5) * cw, (gy + 0.5) * cw);

 // fluid velocity
 ivec2 fc = ivec2(gx / CC * FC, gy / rows * FR);
 fc = clamp(fc, ivec2(0), ivec2(int(FC)-1, int(FR)-1));
 vec2 flow = texelFetch(uFluid, fc, 0).rg;

 // trail dispersion
 vec2 disp = vec2(0.0);
 for(int i = 0; i < uTrailN; i++){
 float life = uTL[i];
 if(life <= 0.0) continue;
 vec2 d = bp - uTP[i].xy;
 float dist = length(d);
 float r = 5.0 + life * 3.0;
 if(dist == 0.0 || dist > r) continue;
 float f = pow(1.0 - dist / r, 2.0);
 disp += (d / dist) * f * life * 3.0 + uTP[i].zw * f * 0.04;
 }

 // sample video
 vec2 sp = bp + disp + flow * 6.0;
 vec2 uv = sp / uRes;

// zoom factor (>1 = zoom in)
float zoom = 1.9;

// center-based zoom
uv = (uv - 0.5) / zoom + 0.5;

uv = clamp(uv, 0.0, 1.0);
 vec3 vc = texture(uVideo, uv).rgb;
 float lum = dot(vc, vec3(0.299, 0.587, 0.114));
 float bg = lum * 255.0;

 // hover mix
 float hm = min(1.0, length(flow) * 1.1);
 float gray = bg * (1.0 - hm) + (255.0 - bg) * hm;

 // bayer dither
 float thr = float(BAYER[(int(gy) & 3) * 4 + (int(gx) & 3)]);
 bool invDark = hm > 0.05 && bg > thr && gray <= thr;
 bool lit = gray > thr;
 if(!lit && !invDark) discard;

 // pick char
 // For edge range: cycle through edge chars using (gx + phase) mod EDGE_N
 // For bright range: cycle through HYPERIUX letters using gx mod BRIGHT_N
 float pg = invDark ? bg : gray;
 int ci;
 if(pg >= EL && pg <= EH){
 // edge chars — keep a gentle phase animation
 ci = (int(gx) + uPhase) % EDGE_N;
 } else if(pg > EH){
 // bright chars — spell HYPERIUX continuously by column position
 ci = EDGE_N + (int(gx) % BRIGHT_N);
 } else {
 discard;
 }

 // atlas lookup — zoom glyph to reduce inter-character spacing
 float charZoom = 0.9;
 vec2 zcp = (cp - 0.5) * charZoom + 0.5;
 if(zcp.x < 0.0 || zcp.x > 1.0 || zcp.y < 0.0 || zcp.y > 1.0) discard;
 float au = (float(ci) + zcp.x) / float(CHAR_N);
 float ca = texture(uAtlas, vec2(au, zcp.y)).a;
 if(ca < 0.05) discard;

 // Use original video color to tint characters
 vec3 col = invDark ? vec3(0.078) : vc * 1.4;
 float a = invDark ? (0.55 + hm * 0.45) * ca : ca;
 O = vec4(col * a, a);
}`;

/* ── helpers ─── */
function mkShader(gl, type, src) {
 const s = gl.createShader(type);
 gl.shaderSource(s, src); gl.compileShader(s);
 if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
  const error = gl.getShaderInfoLog(s);
  gl.deleteShader(s);
  throw new Error(error || "BinaryEffectV2 shader failed to compile");
 }
 return s;
}
function mkProg(gl) {
 const p = gl.createProgram();
 gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, VS));
 gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, FS));
 gl.linkProgram(p);
 if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
  const error = gl.getProgramInfoLog(p);
  gl.deleteProgram(p);
  throw new Error(error || "BinaryEffectV2 program failed to link");
 }
 return p;
}
function mkTex(gl, unit) {
 const t = gl.createTexture();
 gl.activeTexture(gl.TEXTURE0 + unit);
 gl.bindTexture(gl.TEXTURE_2D, t);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
 return t;
}

/* ── fluid sim (CPU — 80×60 is trivial) ── */
function createFluid() {
 const vx = new Float32Array(FN), vy = new Float32Array(FN);
 const vx0 = new Float32Array(FN), vy0 = new Float32Array(FN);
 const p = new Float32Array(FN), div = new Float32Array(FN);

 const fi = (x, y) => Math.max(0, Math.min(FR - 1, y)) * FC + Math.max(0, Math.min(FC - 1, x));

 const bnd = (b, a) => {
 for (let x = 1; x < FC - 1; x++) {
 a[fi(x, 0)] = b === 2 ? -a[fi(x, 1)] : a[fi(x, 1)];
 a[fi(x, FR - 1)] = b === 2 ? -a[fi(x, FR - 2)] : a[fi(x, FR - 2)];
 }
 for (let y = 1; y < FR - 1; y++) {
 a[fi(0, y)] = b === 1 ? -a[fi(1, y)] : a[fi(1, y)];
 a[fi(FC - 1, y)] = b === 1 ? -a[fi(FC - 2, y)] : a[fi(FC - 2, y)];
 }
 };

 const diffuse = (b, d, s, diff, dt) => {
 const a = dt * diff * FN;
 for (let k = 0; k < 4; k++) {
 for (let y = 1; y < FR - 1; y++)
 for (let x = 1; x < FC - 1; x++)
 d[fi(x, y)] = (s[fi(x, y)] + a * (d[fi(x - 1, y)] + d[fi(x + 1, y)] + d[fi(x, y - 1)] + d[fi(x, y + 1)])) / (1 + 4 * a);
 bnd(b, d);
 }
 };

 const advect = (b, d, d0, ux, uy, dt) => {
 const dtx = dt * FC * 1.4, dty = dt * FR * 1.4;
 for (let y = 1; y < FR - 1; y++)
 for (let x = 1; x < FC - 1; x++) {
 let px = Math.max(0.5, Math.min(FC - 1.5, x - dtx * ux[fi(x, y)]));
 let py = Math.max(0.5, Math.min(FR - 1.5, y - dty * uy[fi(x, y)]));
 const x0 = Math.floor(px), y0 = Math.floor(py);
 const s1 = px - x0, s0 = 1 - s1, t1 = py - y0, t0 = 1 - t1;
 d[fi(x, y)] = s0 * (t0 * d0[fi(x0, y0)] + t1 * d0[fi(x0, y0 + 1)]) + s1 * (t0 * d0[fi(x0 + 1, y0)] + t1 * d0[fi(x0 + 1, y0 + 1)]);
 }
 bnd(b, d);
 };

 const project = (ux, uy) => {
 const hx = 1 / FC, hy = 1 / FR;
 for (let y = 1; y < FR - 1; y++)
 for (let x = 1; x < FC - 1; x++) {
 div[fi(x, y)] = -0.5 * (hx * (ux[fi(x + 1, y)] - ux[fi(x - 1, y)]) + hy * (uy[fi(x, y + 1)] - uy[fi(x, y - 1)]));
 p[fi(x, y)] = 0;
 }
 bnd(0, div); bnd(0, p);
 for (let k = 0; k < 4; k++) {
 for (let y = 1; y < FR - 1; y++)
 for (let x = 1; x < FC - 1; x++)
 p[fi(x, y)] = (div[fi(x, y)] + p[fi(x - 1, y)] + p[fi(x + 1, y)] + p[fi(x, y - 1)] + p[fi(x, y + 1)]) / 4;
 bnd(0, p);
 }
 for (let y = 1; y < FR - 1; y++)
 for (let x = 1; x < FC - 1; x++) {
 ux[fi(x, y)] -= 0.5 * (p[fi(x + 1, y)] - p[fi(x - 1, y)]) / hx;
 uy[fi(x, y)] -= 0.5 * (p[fi(x, y + 1)] - p[fi(x, y - 1)]) / hy;
 }
 bnd(1, ux); bnd(2, uy);
 };

 return {
 vx, vy, fi,
 step() {
 diffuse(1, vx0, vx, 0.00002, 0.016);
 diffuse(2, vy0, vy, 0.00002, 0.016);
 project(vx0, vy0);
 advect(1, vx, vx0, vx0, vy0, 0.016);
 advect(2, vy, vy0, vx0, vy0, 0.016);
 project(vx, vy);
 for (let i = 0; i < FN; i++) { vx[i] *= 0.94; vy[i] *= 0.94; }
 },
 };
}

/* ── component ── */
export default function BinaryEffectV2() {
 const ref = useRef(null);

 useEffect(() => {
 const canvas = ref.current;
 if (!canvas) return;
 const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
 if (!gl) return;

 // video
 const video = document.createElement("video");
 // video.src ="/assets/videos/eye-loop.mp4";
 video.src ="/assets/videos/enigma-video.mp4";
 video.loop = true; video.muted = true; video.autoplay = true; video.playsInline = true;
 video.play().catch(() => {});

 // program + uniforms
 let prog;
 try {
  prog = mkProg(gl);
 } catch (error) {
  console.error(error);
  return () => {
   video.pause();
   video.removeAttribute("src");
   video.load();
  };
 }
 gl.useProgram(prog);
 const loc = (n) => gl.getUniformLocation(prog, n);

 // fullscreen quad
 const buf = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, buf);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
 const aPos = gl.getAttribLocation(prog,"a_pos");
 gl.enableVertexAttribArray(aPos);
 gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

 // textures: 0=video, 1=fluid, 2=atlas
 const videoTex = mkTex(gl, 0);
 const fluidTex = mkTex(gl, 1);
 // use LINEAR for video sampling
 gl.activeTexture(gl.TEXTURE0);
 gl.bindTexture(gl.TEXTURE_2D, videoTex);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

 // font atlas
 const CELL = 64;
 const atlasCanvas = document.createElement("canvas");
 atlasCanvas.width = CELL * ALL_CHARS.length;
 atlasCanvas.height = CELL;
 const actx = atlasCanvas.getContext("2d");
 actx.font = `${CELL * 0.92}px monospace`;
 actx.textAlign ="center";
 actx.textBaseline ="middle";
 actx.fillStyle ="#fff";
 ALL_CHARS.forEach((c, i) => actx.fillText(c, CELL * (i + 0.5), CELL * 0.5));

 const atlasTex = mkTex(gl, 2);
 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

 // set texture units
 gl.uniform1i(loc("uVideo"), 0);
 gl.uniform1i(loc("uFluid"), 1);
 gl.uniform1i(loc("uAtlas"), 2);

 // fluid sim
 const fluid = createFluid();
 const fluidData = new Float32Array(FN * 2);

 // mouse + trail
 const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
 const trail = [];
 const now = () => performance.now();

 const onMove = (e) => {
 const px = mouse.x, py = mouse.y;
 mouse.vx = e.clientX - px; mouse.vy = e.clientY - py;
 mouse.x = e.clientX; mouse.y = e.clientY;
 if (px < 0 || py < 0) { trail.unshift({ x: mouse.x, y: mouse.y, vx: 0, vy: 0, b: now() }); return; }
 const d = Math.hypot(mouse.vx, mouse.vy);
 if (d < 0.5) return;
 const steps = Math.max(1, Math.ceil(d / TS)), b = now();
 for (let s = 1; s <= steps; s++) {
 const t = s / steps;
 trail.unshift({ x: px + mouse.vx * t, y: py + mouse.vy * t, vx: mouse.vx / steps, vy: mouse.vy / steps, b });
 if (trail.length > TM) trail.length = TM;
 }
 };
 window.addEventListener("mousemove", onMove);

 // resize
 let W, H;
 const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; gl.viewport(0, 0, W, H); };
 resize();
 window.addEventListener("resize", resize);

 // blending
 gl.enable(gl.BLEND);
 gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied alpha

 // uniforms for trail
 const uTP = loc("uTP"), uTLoc = loc("uTL");
 const uRes = loc("uRes"), uPhase = loc("uPhase"), uTrailN = loc("uTrailN");

 let phase = 0, frame = 0, rafId = 0;
 const tpBuf = new Float32Array(TM * 4);
 const tlBuf = new Float32Array(TM);

 const render = () => {
 if (video.readyState >= 2) {
 const ts = now();

 // inject trail into fluid
 const { fb, fss, ffm, fir, firl } = TRAIL_CFG;
 for (let i = trail.length - 1; i >= 0; i--) {
 const pt = trail[i], age = ts - pt.b;
 if (age >= TL) { trail.splice(i, 1); continue; }
 const life = 1 - age / TL;
 const radius = fir + life * firl, gr = Math.ceil(radius);
 const speed = Math.hypot(pt.vx, pt.vy);
 const force = (fb + Math.min(speed, fss) / fss) * life;
 const cx = (pt.x / W) * FC | 0, cy = (pt.y / H) * FR | 0;
 for (let dy = -gr; dy <= gr; dy++)
 for (let dx = -gr; dx <= gr; dx++) {
 const dist = Math.hypot(dx, dy);
 if (dist > radius) continue;
 const f = (1 - dist / radius) ** 2;
 fluid.vx[fluid.fi(cx + dx, cy + dy)] += pt.vx * f * force * ffm;
 fluid.vy[fluid.fi(cx + dx, cy + dy)] += pt.vy * f * force * ffm;
 }
 }

 fluid.step();
 if (frame++ % 8 === 0) phase = (phase + 1) % 255;

 // upload video texture
 gl.activeTexture(gl.TEXTURE0);
 gl.bindTexture(gl.TEXTURE_2D, videoTex);
 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

 // upload fluid texture
 for (let i = 0; i < FN; i++) { fluidData[i * 2] = fluid.vx[i]; fluidData[i * 2 + 1] = fluid.vy[i]; }
 gl.activeTexture(gl.TEXTURE1);
 gl.bindTexture(gl.TEXTURE_2D, fluidTex);
 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, FC, FR, 0, gl.RG, gl.FLOAT, fluidData);

 // upload trail uniforms
 tpBuf.fill(0); tlBuf.fill(0);
 for (let i = 0; i < trail.length; i++) {
 const pt = trail[i];
 tpBuf[i * 4] = pt.x; tpBuf[i * 4 + 1] = pt.y;
 tpBuf[i * 4 + 2] = pt.vx; tpBuf[i * 4 + 3] = pt.vy;
 tlBuf[i] = 1 - (ts - pt.b) / TL;
 }
 gl.uniform4fv(uTP, tpBuf);
 gl.uniform1fv(uTLoc, tlBuf);
 gl.uniform1i(uTrailN, trail.length);
 gl.uniform2f(uRes, W, H);
 gl.uniform1i(uPhase, phase);

 gl.clearColor(0, 0, 0, 1);
 gl.clear(gl.COLOR_BUFFER_BIT);
 gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
 }
 rafId = requestAnimationFrame(render);
 };

 render();

 return () => {
 window.removeEventListener("resize", resize);
 window.removeEventListener("mousemove", onMove);
 cancelAnimationFrame(rafId);
 video.pause();
 video.removeAttribute("src");
 video.load();
 gl.deleteProgram(prog);
 };
 }, []);

 return (
 <canvas
 ref={ref}
 className="absolute inset-0 block h-full w-full bg-black"
 />
 );
}
