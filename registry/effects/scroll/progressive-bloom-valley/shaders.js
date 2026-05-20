export const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uCamFar;
uniform vec2 uMouse;
uniform float uAspect;
uniform float uHoverIntensity;

uniform float uHoverMagneticStrength;
uniform float uHoverMagneticDirection;
uniform float uHoverZPull;

attribute float aSpriteScale;
attribute vec2 aColorCoordinate;
attribute float aRandomSeed;
attribute float aGrowNoise;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;
varying float vHoverGlow;

void main() {
  vec3 pos = position;

  float phase = uTime * 0.5 + aRandomSeed * 6.2831;
  pos.x += sin(phase) * 0.04 * aGrowNoise;
  pos.y += cos(phase * 0.7) * 0.025 * aGrowNoise;
  pos.z += sin(phase * 0.3) * 0.015 * aGrowNoise;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  vec4 tempPos = projectionMatrix * mv;

  vec2 screenPos = (tempPos.xy / tempPos.w) * 0.5 + 0.5;
  vec2 rawDiff = screenPos - uMouse;

  vec2 diff = rawDiff;
  diff.x *= uAspect;

  float distToMouse = length(diff);

  float spriteRow = floor(aColorCoordinate.y * 7.0);
  float isFlower = step(2.5, spriteRow);

  vHoverGlow = pow(1.0 - smoothstep(0.0, 0.35, distToMouse), 1.5) * isFlower * uHoverIntensity;

  float baseD = -mv.z;

  mv.z += vHoverGlow * uHoverZPull;

  gl_Position = projectionMatrix * mv;

  gl_Position.x -= rawDiff.x * 2.0 * vHoverGlow * uHoverMagneticStrength * uHoverMagneticDirection * gl_Position.w;
  gl_Position.y -= rawDiff.y * 2.0 * vHoverGlow * uHoverMagneticStrength * uHoverMagneticDirection * gl_Position.w;

  float randomDepthOffset = (aRandomSeed - 0.5) * 20.0;
  float flowerGrowth = smoothstep(45.0, 22.0, baseD + randomDepthOffset);

  float scaleMultiplier = mix(1.0, flowerGrowth, isFlower);

  float nearFade = smoothstep(0.1, 3.0, baseD);
  float farFade  = 1.0 - smoothstep(uCamFar * 0.35, uCamFar, baseD);
  vAlpha = nearFade * farFade;
  if (baseD < 0.0) vAlpha = 0.0;

  gl_PointSize = clamp(aSpriteScale * scaleMultiplier * 1100.0 / max(baseD, 0.3), 0.5, 440.0);

  vColorCoord = aColorCoordinate;
  vSeed       = aRandomSeed;
}
`;

export const FRAGMENT = /* glsl */ `
uniform sampler2D uSpriteSheet;
uniform float uBrightness;
uniform float uSaturation;
uniform float uTime;
uniform vec3 uColorTint;

uniform float uDefaultFlowerBloom;
uniform float uHoverGlowMultiplier;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;
varying float vHoverGlow;

void main() {
  if (vAlpha < 0.01) discard;

  vec2 GRID = vec2(8.0, 7.0);
  vec2 cell = 1.0 / GRID;

  vec2 tile = floor(vColorCoord * GRID);
  float col = tile.x;
  float row = tile.y;

  vec2 pc = gl_PointCoord;
  pc.y = 1.0 - pc.y;

  vec2 uv;
  uv.x = cell.x * pc.x + col * cell.x;
  uv.y = cell.y * pc.y + row * cell.y;

  vec2 minUV = vec2(col, row) * cell + 0.001;
  vec2 maxUV = minUV + cell - 0.002;
  uv = clamp(uv, minUV, maxUV);

  vec4 tex = texture2D(uSpriteSheet, uv);
  if (tex.a < 0.01) discard;

  float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
  vec3 color = mix(vec3(lum), tex.rgb, uSaturation) * uBrightness;

  color *= 0.9 + 0.1 * sin(uTime * 1.5 + vSeed * 40.0);

  color *= uColorTint;

  float isFlowerFrag = step(2.5, floor(vColorCoord.y * 7.0));
  float baseBloom = mix(1.0, uDefaultFlowerBloom, isFlowerFrag);

  float bloomBoost = mix(baseBloom, uHoverGlowMultiplier, vHoverGlow);
  color *= bloomBoost;

  float a = tex.a * vAlpha;
  if (a < 0.01) discard;

  gl_FragColor = vec4(color, a);
  #include <colorspace_fragment>
}
`;
