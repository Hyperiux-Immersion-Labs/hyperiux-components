import {
 Vector2,
 Vector3,
 Vector4,
 WebGLRenderTarget,
 RGBAFormat,
 UnsignedByteType,
 LinearFilter,
 ClampToEdgeWrapping,
 ShaderMaterial,
 Uniform
} from'three';
import { fboHelper } from'./fboHelper';
import { blurUtil } from'./blurUtil';

const enhancedPaintVert = `
varying vec2 v_uv;
void main() {
 v_uv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const enhancedPaintFrag = `
uniform sampler2D u_lowPaintTexture;
uniform sampler2D u_prevPaintTexture;
uniform vec2 u_paintTexelSize;
uniform vec2 u_scrollOffset;
uniform vec4 u_drawFrom;
uniform vec4 u_drawTo;
uniform float u_pushStrength;
uniform vec3 u_dissipations;
uniform vec2 u_vel;

varying vec2 v_uv;

vec2 sdSegment(in vec2 p, in vec2 a, in vec2 b) {
 vec2 pa = p - a;
 vec2 ba = b - a;
 float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
 return vec2(length(pa - ba * h), h);
}

void main() {
 vec2 res = sdSegment(gl_FragCoord.xy, u_drawFrom.xy, u_drawTo.xy);
 vec2 radiusWeight = mix(u_drawFrom.zw, u_drawTo.zw, res.y);
 float d = 1.0 - smoothstep(-0.01, radiusWeight.x, res.x);

 vec4 lowData = texture2D(u_lowPaintTexture, v_uv - u_scrollOffset);
 vec2 velInv = (0.5 - lowData.xy) * u_pushStrength;

 vec4 data = texture2D(u_prevPaintTexture, v_uv - u_scrollOffset + velInv * u_paintTexelSize);
 data.xy -= 0.5;

 vec4 delta = (u_dissipations.xxyz - 1.0) * data;
 vec2 newVel = u_vel * d;
 delta += vec4(newVel, radiusWeight.yy * d);
 delta.zw = sign(delta.zw) * max(vec2(0.004), abs(delta.zw));

 data += delta;
 data.xy += 0.5;

 gl_FragColor = clamp(data, vec4(0.0), vec4(1.0));
}`;

export class EnhancedScreenPaint {
 _lowRenderTarget = null;
 _lowBlurRenderTarget = null;
 _prevPaintRenderTarget = null;
 _currPaintRenderTarget = null;
 _material = null;
 _fromDrawData = new Vector4(0, 0, 0, 0);
 _toDrawData = new Vector4(0, 0, 0, 0);
 _lastMousePosition = new Vector2();
 _tempVelocity = new Vector2(); // Reusable vector to avoid GC
 _idleTime = 0;
 _idleThreshold = 0.1;

 enabled = true;
 drawEnabled = true;
 needsMouseDown = false;
 minRadius = 0;
 maxRadius = 100;
 radiusDistanceRange = 100;
 pushStrength = 25;
 accelerationDissipation = 0.8;
 velocityDissipation = 0.985;
 weight1Dissipation = 0.985;
 weight2Dissipation = 0.5;

 sharedUniforms = {
 u_paintTexelSize: new Uniform(new Vector2()),
 u_paintTextureSize: new Uniform(new Vector2()),
 u_prevPaintTexture: new Uniform(null),
 u_currPaintTexture: new Uniform(null),
 u_lowPaintTexture: new Uniform(null),
 };

 constructor(config = {}) {
 Object.assign(this, config);
 }

 init() {
 this._lowRenderTarget = this.createRenderTarget(1, 1);
 this._lowBlurRenderTarget = this.createRenderTarget(1, 1);
 this._prevPaintRenderTarget = this.createRenderTarget(1, 1);
 this._currPaintRenderTarget = this.createRenderTarget(1, 1);

 this.sharedUniforms.u_lowPaintTexture.value = this._lowRenderTarget.texture;
 this.sharedUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture;
 this.sharedUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;

 this._material = this.createPaintMaterial();
 }

 createRenderTarget(width, height) {
 return new WebGLRenderTarget(width, height, {
 format: RGBAFormat,
 type: UnsignedByteType,
 minFilter: LinearFilter,
 magFilter: LinearFilter,
 wrapS: ClampToEdgeWrapping,
 wrapT: ClampToEdgeWrapping,
 depthBuffer: false,
 stencilBuffer: false,
 });
 }

 createPaintMaterial() {
 return new ShaderMaterial({
 uniforms: {
 u_lowPaintTexture: { value: this._lowRenderTarget?.texture || null },
 u_prevPaintTexture: this.sharedUniforms.u_prevPaintTexture,
 u_paintTexelSize: this.sharedUniforms.u_paintTexelSize,
 u_drawFrom: { value: this._fromDrawData },
 u_drawTo: { value: this._toDrawData },
 u_pushStrength: { value: 0 },
 u_vel: { value: new Vector2() },
 u_dissipations: { value: new Vector3() },
 u_scrollOffset: { value: new Vector2() },
 },
 vertexShader: enhancedPaintVert,
 fragmentShader: enhancedPaintFrag,
 });
 }

 resize(width, height, renderer) {
 const paintWidth = width >> 2;
 const paintHeight = height >> 2;
 const lowWidth = width >> 3;
 const lowHeight = height >> 3;

 if (paintWidth !== this._currPaintRenderTarget?.width ||
 paintHeight !== this._currPaintRenderTarget?.height) {

 this._currPaintRenderTarget?.setSize(paintWidth, paintHeight);
 this._prevPaintRenderTarget?.setSize(paintWidth, paintHeight);
 this._lowRenderTarget?.setSize(lowWidth, lowHeight);
 this._lowBlurRenderTarget?.setSize(lowWidth, lowHeight);

 this.sharedUniforms.u_paintTexelSize.value.set(1 / paintWidth, 1 / paintHeight);
 this.sharedUniforms.u_paintTextureSize.value.set(paintWidth, paintHeight);

 this.clear(renderer);
 }
 }

 clear(renderer) {
 if (!this._lowRenderTarget || !this._lowBlurRenderTarget ||
 !this._currPaintRenderTarget || !this._prevPaintRenderTarget) return;

 const oldTarget = renderer.getRenderTarget();

 [this._lowRenderTarget, this._lowBlurRenderTarget, this._currPaintRenderTarget, this._prevPaintRenderTarget]
 .forEach(target => {
 renderer.setRenderTarget(target);
 renderer.setClearColor(0x808000, 0);
 renderer.clear();
 });

 renderer.setRenderTarget(oldTarget);
 if (this._material) this._material.uniforms.u_vel.value.set(0, 0);
 }

 update(renderer, deltaTime, mousePixel, prevMousePixel, isMouseDown) {
 if (!this.enabled || !this._material || !this._currPaintRenderTarget || !this._prevPaintRenderTarget) return;

 const mouseDistance = mousePixel.distanceTo(this._lastMousePosition);
 if (mouseDistance > 1.0) {
 this._idleTime = 0;
 this._lastMousePosition.copy(mousePixel);
 } else {
 this._idleTime += deltaTime;
 }

 // Swap render targets
 const tempTarget = this._prevPaintRenderTarget;
 this._prevPaintRenderTarget = this._currPaintRenderTarget;
 this._currPaintRenderTarget = tempTarget;

 this.sharedUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture;
 this.sharedUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;

 const mouseDeltaDistance = mousePixel.distanceTo(prevMousePixel);
 let radius = this.minRadius + (this.maxRadius - this.minRadius) *
 Math.min(mouseDeltaDistance / this.radiusDistanceRange, 1.0);

 if (!this.drawEnabled || (this.needsMouseDown && !isMouseDown)) radius = 0;

 const renderTargetHeight = this._currPaintRenderTarget.height;
 radius = (radius / window.innerHeight) * renderTargetHeight;

 let velocityDissipation = this.velocityDissipation;
 let weight1Dissipation = this.weight1Dissipation;
 let weight2Dissipation = this.weight2Dissipation;

 if (this._idleTime > this._idleThreshold) {
 const idleFactor = Math.min((this._idleTime - this._idleThreshold) * 2, 1.0);
 velocityDissipation = Math.min(velocityDissipation + idleFactor * 0.1, 0.99);
 weight1Dissipation = Math.min(weight1Dissipation + idleFactor * 0.15, 0.99);
 weight2Dissipation = Math.min(weight2Dissipation + idleFactor * 0.2, 0.99);
 }

 this._material.uniforms.u_pushStrength.value = this.pushStrength;
 this._material.uniforms.u_dissipations.value.set(velocityDissipation, weight1Dissipation, weight2Dissipation);

 this._fromDrawData.copy(this._toDrawData);

 const targetWidth = this._currPaintRenderTarget.width;
 const targetHeight = this._currPaintRenderTarget.height;

 this._toDrawData.set(
 (mousePixel.x / window.innerWidth) * targetWidth,
 (1.0 - mousePixel.y / window.innerHeight) * targetHeight,
 radius,
 1.0
 );

 // Reuse _tempVelocity to avoid creating new Vector2 every frame
 this._tempVelocity.set(
 this._toDrawData.x - this._fromDrawData.x,
 this._toDrawData.y - this._fromDrawData.y
 ).multiplyScalar(deltaTime * 0.8);

 this._material.uniforms.u_vel.value
 .multiplyScalar(this.accelerationDissipation)
 .add(this._tempVelocity);

 fboHelper.render(renderer, this._material, this._currPaintRenderTarget);

 if (this._lowRenderTarget) {
 fboHelper.copy(renderer, this._currPaintRenderTarget, this._lowRenderTarget);
 if (this._lowBlurRenderTarget) {
 blurUtil.blur(renderer, 4, 1, this._lowRenderTarget, this._lowBlurRenderTarget);
 this.sharedUniforms.u_lowPaintTexture.value = this._lowBlurRenderTarget.texture;
 }
 }
 }

 dispose() {
 this._lowRenderTarget?.dispose();
 this._lowBlurRenderTarget?.dispose();
 this._prevPaintRenderTarget?.dispose();
 this._currPaintRenderTarget?.dispose();
 this._material?.dispose();
 blurUtil.dispose();
 }

 get currPaintTexture() {
 return this._currPaintRenderTarget?.texture || null;
 }
}
