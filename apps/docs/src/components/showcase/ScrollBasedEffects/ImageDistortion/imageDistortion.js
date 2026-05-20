export const ImageDistortionVertex = `
 varying vec2 vUv;

 void main() {  vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`

export const ImageDistortionFragment = `
 uniform sampler2D u_texture0;
 uniform sampler2D u_texture1;
 uniform sampler2D u_displacement;
 uniform float u_progress;
 uniform float u_strength;
 uniform float u_rgbShift;
 uniform float u_scale;
 uniform vec2 u_resolution;
 uniform vec2 u_textureResolution0;
 uniform vec2 u_textureResolution1;

 varying vec2 vUv;

 vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
 float scale = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
 vec2 newSize = texRes * scale;
 return uv * (planeRes / newSize) + (newSize - planeRes) / 2.0 / newSize;
 }

 void main() {
 float disp = texture2D(u_displacement, vUv).r;
 disp = mix(disp, disp * (sin(vUv.y * 10.0 + u_progress * 6.28) * 0.5 + 0.5), 0.3);

 vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
 vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

 float scaleEffect = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
 vec2 center = vec2(0.5);

 vec2 distortedUV0 = (uv0 - center) / scaleEffect + center + u_progress * disp * u_strength * vec2(1.0, 0.5);
 vec2 distortedUV1 = (uv1 - center) * scaleEffect + center - (1.0 - u_progress) * disp * u_strength * vec2(1.0, 0.5);

 float rgbOffset = u_progress * (1.0 - u_progress) * u_rgbShift;

 vec4 tex0 = vec4(
 texture2D(u_texture0, distortedUV0 + vec2(rgbOffset, 0.0)).r,
 texture2D(u_texture0, distortedUV0).g,
 texture2D(u_texture0, distortedUV0 - vec2(rgbOffset, 0.0)).b,
 texture2D(u_texture0, distortedUV0).a
 );

 vec4 tex1 = vec4(
 texture2D(u_texture1, distortedUV1 + vec2(rgbOffset, 0.0)).r,
 texture2D(u_texture1, distortedUV1).g,
 texture2D(u_texture1, distortedUV1 - vec2(rgbOffset, 0.0)).b,
 texture2D(u_texture1, distortedUV1).a
 );

 gl_FragColor = mix(tex0, tex1, smoothstep(0.0, 1.0, u_progress));
 }
`