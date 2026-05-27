import { useMemo, useEffect, useRef } from"react";
import { Effect } from"postprocessing";
import { Uniform, Vector2 } from"three";

/**
 * Fix for stretched film grain:
 * - Takes screen resolution as a uniform so UV remains aspect-correct.
 */
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uAmount;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uResolution;

float hash21(vec2 p) {
 p = fract(p * vec2(123.34, 456.21));
 p += dot(p, p + 45.32);
 return fract(p.x * p.y);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
 // Aspect-correct the uv so pixel grains are square
 // Reference: use the shorter axis as base; expand the other to keep squares
 vec2 aspectUV = uv;
 float aspect = uResolution.x / uResolution.y;
 if (aspect > 1.0) {
 // Widescreen: stretch x
 aspectUV.x = (uv.x - 0.5) * aspect + 0.5;
 } else {
 // Tall: stretch y
 aspectUV.y = (uv.y - 0.5) / aspect + 0.5;
 }

 float dotPixelSize = 0.0015;
 vec2 grainUV = floor(aspectUV * uScale / dotPixelSize) * dotPixelSize / uScale;
 // Use fract(time * prime) to keep hash seed in a small range — prevents precision loss over time
 float n = hash21(grainUV + fract(uTime * 60.0));

 float g = (n - 0.5) * uAmount;
 vec3 col = inputColor.rgb + vec3(g);

 outputColor = vec4(mix(inputColor.rgb, col, uOpacity), inputColor.a);
}
`;

class FilmGrainEffectImpl extends Effect {
 constructor({ amount = 0.12, scale = 900.0, opacity = 0.25, resolution = [1280, 720] } = {}) {
 const uniforms = new Map([
 ["uTime", new Uniform(0)],
 ["uAmount", new Uniform(amount)],
 ["uScale", new Uniform(scale)],
 ["uOpacity", new Uniform(opacity)],
 ["uResolution", new Uniform(new Vector2(resolution[0], resolution[1]))],
 ]);
 super("FilmGrainEffect", fragmentShader, { uniforms });
 this._time = 0;
 }

 setResolution(width, height) {
 const uRes = this.uniforms.get("uResolution");
 if (uRes) {
 uRes.value.set(width, height);
 }
 }

 update(renderer, _inputBuffer, deltaTime) {
 this._time += deltaTime;
 // Wrap time to prevent float precision loss — keeps grain as dots, not rain streaks
 if (this._time > 1000) this._time -= 1000;
 const uTime = this.uniforms.get("uTime");
 if (uTime) uTime.value = this._time;

 // Defensive: Only access renderer.getSize if renderer exists and has getSize (in R3F it will)
 if (renderer && renderer.getSize) {
 const size = renderer.getSize(new Vector2());
 this.setResolution(size.x, size.y);
 }
 }
}

export default function CustomGrainNoise({ amount = 0.12, scale = 900, opacity = 0.7 } = {}) {
 const effect = useMemo(() => {
 // Get initial resolution (SSR safe fallback)
 let width = 1280, height = 720;
 if (typeof window !=="undefined") {
 width = window.innerWidth;
 height = window.innerHeight;
 }
 return new FilmGrainEffectImpl({ amount, scale, opacity, resolution: [width, height] });
 }, [amount, scale, opacity]);

 // If client, keep uResolution uniform in sync with window resize
 useEffect(() => {
 if (typeof window ==="undefined") return;
 const update = () => {
 effect.setResolution(window.innerWidth, window.innerHeight);
 };
 window.addEventListener("resize", update);
 update();
 return () => window.removeEventListener("resize", update);
 }, [effect]);

 return <primitive object={effect} dispose={null} />;
}
