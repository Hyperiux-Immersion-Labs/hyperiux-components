import {
 WebGLRenderTarget,
 ShaderMaterial,
 PlaneGeometry,
 Mesh,
 Scene,
 OrthographicCamera,
 RGBAFormat,
 FloatType,
 LinearFilter,
 ClampToEdgeWrapping
} from'three';

class FBOHelper {
 scene = null;
 camera = null;
 quad = null;
 copyMaterial = null;

 constructor() {
 this.scene = new Scene();
 this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
 const geometry = new PlaneGeometry(2, 2);
 this.quad = new Mesh(geometry);
 this.scene.add(this.quad);

 // Cache copy material
 this.copyMaterial = new ShaderMaterial({
 uniforms: { tSource: { value: null } },
 vertexShader: `
 varying vec2 v_uv;
 void main() {
 v_uv = uv;
 gl_Position = vec4(position.xy, 0.0, 1.0);
 }
 `,
 fragmentShader: `
 uniform sampler2D tSource;
 varying vec2 v_uv;
 void main() {
 gl_FragColor = texture2D(tSource, v_uv);
 }
 `
 });
 }

 createRenderTarget(width, height, options = {}) {
 return new WebGLRenderTarget(width, height, {
 format: RGBAFormat,
 type: FloatType,
 minFilter: LinearFilter,
 magFilter: LinearFilter,
 wrapS: ClampToEdgeWrapping,
 wrapT: ClampToEdgeWrapping,
 depthBuffer: false,
 stencilBuffer: false,
 ...options
 });
 }

 render(renderer, material, renderTarget) {
 const oldTarget = renderer.getRenderTarget();
 this.quad.material = material;
 renderer.setRenderTarget(renderTarget || null);
 renderer.render(this.scene, this.camera);
 renderer.setRenderTarget(oldTarget);
 }

 copy(renderer, source, destination) {
 this.copyMaterial.uniforms.tSource.value = source.texture;
 this.render(renderer, this.copyMaterial, destination);
 }

 dispose() {
 this.quad.geometry.dispose();
 this.copyMaterial?.dispose();
 }
}

export const fboHelper = new FBOHelper();
