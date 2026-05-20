import { ShaderMaterial, WebGLRenderTarget, Vector2 } from'three';
import { fboHelper } from'./fboHelper';

const blur9VaryingVertexShader = `
uniform vec2 u_delta;
varying vec2 v_uv[9];

void main() {
 vec2 uv = position.xy * 0.5 + 0.5;
 v_uv[0] = uv;

 vec2 delta = u_delta;
 v_uv[1] = uv - delta;
 v_uv[2] = uv + delta;

 delta += u_delta;
 v_uv[3] = uv - delta;
 v_uv[4] = uv + delta;

 delta += u_delta;
 v_uv[5] = uv - delta;
 v_uv[6] = uv + delta;

 delta += u_delta;
 v_uv[7] = uv - delta;
 v_uv[8] = uv + delta;

 gl_Position = vec4(position, 1.0);
}`;

const blur9VaryingFragmentShader = `
uniform sampler2D u_texture;
varying vec2 v_uv[9];

void main() {
 vec4 color = texture2D(u_texture, v_uv[0]) * 0.1633;
 color += texture2D(u_texture, v_uv[1]) * 0.1531;
 color += texture2D(u_texture, v_uv[2]) * 0.1531;
 color += texture2D(u_texture, v_uv[3]) * 0.12245;
 color += texture2D(u_texture, v_uv[4]) * 0.12245;
 color += texture2D(u_texture, v_uv[5]) * 0.0918;
 color += texture2D(u_texture, v_uv[6]) * 0.0918;
 color += texture2D(u_texture, v_uv[7]) * 0.051;
 color += texture2D(u_texture, v_uv[8]) * 0.051;
 gl_FragColor = color;
}`;

class BlurUtil {
 material = null;
 _cachedTempTarget = null;
 _cachedWidth = 0;
 _cachedHeight = 0;

 getBlur9Material() {
 if (!this.material) {
 this.material = new ShaderMaterial({
 uniforms: {
 u_texture: { value: null },
 u_delta: { value: new Vector2(0, 0) },
 },
 vertexShader: blur9VaryingVertexShader,
 fragmentShader: blur9VaryingFragmentShader,
 });
 }
 return this.material;
 }

 // Get or create cached temp target
 getTempTarget(width, height, source) {
 if (!this._cachedTempTarget ||
 this._cachedWidth !== width ||
 this._cachedHeight !== height) {

 this._cachedTempTarget?.dispose();
 this._cachedTempTarget = new WebGLRenderTarget(width, height, {
 format: source.texture.format,
 type: source.texture.type,
 minFilter: source.texture.minFilter,
 magFilter: source.texture.magFilter,
 wrapS: source.texture.wrapS,
 wrapT: source.texture.wrapT,
 });
 this._cachedWidth = width;
 this._cachedHeight = height;
 }
 return this._cachedTempTarget;
 }

 blur(renderer, iterations, strength, inputTarget, outputTarget) {
 const mat = this.getBlur9Material();
 const targetWidth = inputTarget.width;
 const targetHeight = inputTarget.height;

 let tempTarget = null;
 if (!outputTarget || outputTarget === inputTarget) {
 tempTarget = this.getTempTarget(targetWidth, targetHeight, inputTarget);
 }

 let currentInput = inputTarget;
 let currentOutput = outputTarget || tempTarget;

 for (let i = 0; i < iterations; i++) {
 // Horizontal blur
 mat.uniforms.u_texture.value = currentInput.texture;
 mat.uniforms.u_delta.value.set(strength / targetWidth, 0);
 fboHelper.render(renderer, mat, currentOutput);

 // Vertical blur - swap targets
 const intermediate = currentOutput;
 currentOutput = currentInput;

 mat.uniforms.u_texture.value = intermediate.texture;
 mat.uniforms.u_delta.value.set(0, strength / targetHeight);
 fboHelper.render(renderer, mat, currentOutput);

 currentInput = currentOutput;
 currentOutput = intermediate;
 }

 // Copy result back if needed
 if (tempTarget && currentInput !== inputTarget) {
 fboHelper.copy(renderer, currentInput, inputTarget);
 }
 }

 dispose() {
 this.material?.dispose();
 this._cachedTempTarget?.dispose();
 this.material = null;
 this._cachedTempTarget = null;
 }
}

export const blurUtil = new BlurUtil();
