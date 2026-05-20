export const NOISE_RIPPLE_VERTEX_SRC = `
varying vec2 vUv;
void main() {
 vUv = uv;
 gl_Position = vec4(position, 1.0);
}
`;

export const NOISE_RIPPLE_FBO_FRAGMENT = `
precision highp float;
uniform sampler2D uPrevFrame;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uStrength;
uniform float uDissipation;

out vec4 fragColor;

void main() {
 vec2 uv = gl_FragCoord.xy / uResolution;
 vec4 prev = texture(uPrevFrame, uv);
  // Dissipate over time
 vec2 velocity = prev.xy * uDissipation;
 float density = prev.z * uDissipation;
  // Add mouse influence
 if (uMouse.x >= 0.0) {
 vec2 mouseUV = uMouse / uResolution;
 vec2 diff = uv - mouseUV;
 diff.x *= uResolution.x / uResolution.y;
 float dist = length(diff);
 float influence = exp(-dist * dist / (uRadius * uRadius)) * uStrength;
 velocity += normalize(diff + 0.001) * influence;
 density += influence;
 }
  fragColor = vec4(velocity, min(density, 1.0), 1.0);
}
`;

export const NOISE_RIPPLE_MAIN_FRAGMENT = `
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uFluidTex;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uDensity;
uniform vec3 uNoiseColor;
uniform float uDistortStrength;
uniform float uTrailDarkness;

out vec4 fragColor;

// Smooth wave-based noise function
float waveNoise(vec2 uv, float t) {
 float wave1 = sin(uv.x * 6.0 + t * 0.8) * 0.5 + 0.5;
 float wave2 = sin(uv.y * 4.0 - t * 0.6) * 0.5 + 0.5;
 float wave3 = sin((uv.x + uv.y) * 5.0 + t * 0.5) * 0.5 + 0.5;
 float wave4 = sin((uv.x - uv.y) * 3.0 - t * 0.4) * 0.5 + 0.5;
 return (wave1 + wave2 + wave3 + wave4) * 0.25;
}

// Layered wave function for organic wavy shapes
float wavyFbm(vec2 uv, float t) {
 float v = 0.0;
 float a = 0.5;
 float freq = 1.0;
  for (int i = 0; i < 4; i++) {
 // Create flowing wave patterns
 float wave = sin(uv.x * freq * 3.0 + uv.y * freq * 2.0 + t * (0.3 + float(i) * 0.1));
 wave += sin(uv.y * freq * 4.0 - uv.x * freq * 1.5 + t * (0.4 - float(i) * 0.05));
 wave += cos(uv.x * freq * 2.5 + t * 0.2) * sin(uv.y * freq * 3.5 - t * 0.3);
 wave = wave / 3.0 * 0.5 + 0.5;
  v += a * wave;
 freq *= 1.8;
 a *= 0.5;
 }
 return v;
}

void main() {
 vec2 uv = gl_FragCoord.xy / uResolution;
  // Sample fluid texture
 vec4 fluid = texture(uFluidTex, uv);
 vec2 velocity = fluid.xy;
 float fluidDensity = fluid.z;
  // Distort UV based on fluid velocity
 vec2 distortedUV = uv + velocity * uDistortStrength;
 distortedUV.y = 1.0 - distortedUV.y;
  // Sample image
 vec4 imageColor = texture(uImage, distortedUV);
 float imageLuma = dot(imageColor.rgb, vec3(0.299, 0.587, 0.114));
  // Pixelate
 vec2 pixelUV = uv;
  // Generate wavy noise pattern
 float aspect = uResolution.x / uResolution.y;
  float n = wavyFbm(pixelUV * vec2(aspect, .5) * .5, uTime * 0.05);
  // Animated density modulation with smoother waves
 float animatedDensity = uDensity + sin(uTime * 0.3) * 0.15 + sin(uTime * 0.2 + pixelUV.x * 2.0) * 0.1;
 n = n * 0.6 + (animatedDensity - 0.5) * 0.2;
  // Add fluid influence to pattern
 n += fluidDensity * 0.5;
  // Soften edges with smoothstep for less sharp cutoff
 n = smoothstep(0.2, 0.8, n);
  // Dither
 float bayer = fract(dot(floor(gl_FragCoord.xy / uPixelSize), vec2(0.5, 0.4)));
 float mask = step(0.4, n + (bayer - 0.5));
  // Apply color with gamma correction and trail darkness
 vec3 color = pow(uNoiseColor, vec3(2.2));
 color = pow(color, vec3(1.0 / 2.2));
  // Darken the trail based on fluid density
 float darkenFactor = 1.0 - (fluidDensity * uTrailDarkness);
 color *= darkenFactor;

 // Render the image, with the noise pattern overlayed via mask.
 vec3 outRgb = mix(imageColor.rgb, color, mask);
 fragColor = vec4(outRgb, imageColor.a);
}
`;
