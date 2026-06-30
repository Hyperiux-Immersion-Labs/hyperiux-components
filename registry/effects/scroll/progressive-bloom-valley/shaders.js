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
  // calculate temporary position just to find screen coordinates
 vec4 tempPos = projectionMatrix * mv;

 // Screen-space mouse tracking:  // Convert gl_Position into 0..1 screen coordinates
 vec2 screenPos = (tempPos.xy / tempPos.w) * 0.5 + 0.5;
 vec2 rawDiff = screenPos - uMouse;
  vec2 diff = rawDiff;
 // Aspect-correct the distance so the glow circle is perfectly round, not stretched
 diff.x *= uAspect;
  float distToMouse = length(diff);
  // The sprite sheet has 7 rows. Grass is row 1-2, Flowers are row 3-6.
 float spriteRow = floor(aColorCoordinate.y * 7.0);
 float isFlower = step(2.5, spriteRow); // 0.0 for grass, 1.0 for flowers

 // Reduced size (0.15 screen width) and applied a power curve for an exceptionally soft, dreamy tail
 // Multiply by isFlower so ONLY flowers get the glow/puff interaction
 // MULTIPLY by uHoverIntensity so the glow visually fades out completely when mouse is perfectly still
 vHoverGlow = pow(1.0 - smoothstep(0.0, 0.35, distToMouse), 1.5) * isFlower * uHoverIntensity;

 // Calculate the base distance for accurate non-scaled sizing
 float baseD = -mv.z;

 // physically pull hovered flowers closer to the camera!
 mv.z += vHoverGlow * uHoverZPull;

 // RECOMPUTE actual screen position with the new 3D depth pop applied
 gl_Position = projectionMatrix * mv;

 // MAGNETIC EFFECT: Pull the flower perfectly towards the exact mouse cursor pixels
 gl_Position.x -= rawDiff.x * 2.0 * vHoverGlow * uHoverMagneticStrength * uHoverMagneticDirection * gl_Position.w;
 gl_Position.y -= rawDiff.y * 2.0 * vHoverGlow * uHoverMagneticStrength * uHoverMagneticDirection * gl_Position.w;

 // Organic Camera Distance Growth (Shrink flowers to 0 in the distance)
 // We offset the perceived depth randomly.
 // By using [45.0, 22.0] as boundaries, even the absolute latest-blooming flower
 // finishes scaling to 100% long before it reaches the near plane.
 float randomDepthOffset = (aRandomSeed - 0.5) * 20.0;
 float flowerGrowth = smoothstep(45.0, 22.0, baseD + randomDepthOffset);
  // Grass is always fully grown (1.0). Flowers use the growth variable.
 float scaleMultiplier = mix(1.0, flowerGrowth, isFlower);

 float nearFade = smoothstep(0.1, 3.0, baseD);
 float farFade = 1.0 - smoothstep(uCamFar * 0.35, uCamFar, baseD);
 vAlpha = nearFade * farFade;
 if (baseD < 0.0) vAlpha = 0.0;

 // Multiply the final point size by our organic depth scaleMultiplier
 gl_PointSize = clamp(aSpriteScale * scaleMultiplier * 1100.0 / max(baseD, 0.3), 0.5, 440.0);
  vColorCoord = aColorCoordinate;
 vSeed = aRandomSeed;
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

 // The sprite sheet is an 8x7 grid (56 textures)
 vec2 GRID = vec2(8.0, 7.0);
 vec2 cell = 1.0 / GRID;

 // Determine which tile we're in from the seeded coordinate.
 vec2 tile = floor(vColorCoord * GRID);
 float col = tile.x;
 float row = tile.y;

 // Sprite UV inside the atlas
 vec2 pc = gl_PointCoord;
 // Flip point coord Y to match expected texture orientation
 pc.y = 1.0 - pc.y;

 vec2 uv;
 uv.x = cell.x * pc.x + col * cell.x;
 uv.y = cell.y * pc.y + row * cell.y;

 // Clamp to tile bounds to prevent bleeding
 vec2 minUV = vec2(col, row) * cell + 0.001;
 vec2 maxUV = minUV + cell - 0.002;
 uv = clamp(uv, minUV, maxUV);

 vec4 tex = texture2D(uSpriteSheet, uv);
 if (tex.a < 0.01) discard;

 float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
 vec3 color = mix(vec3(lum), tex.rgb, uSaturation) * uBrightness;

 color *= 0.9 + 0.1 * sin(uTime * 1.5 + vSeed * 40.0);
  // Apply our custom color tint
 color *= uColorTint;

 // MAGIC HAPPENS HERE
 // We first establish a baseline glow depending on whether it's grass or a flower!
 // If it's a flower, the baseline multiplier is uDefaultFlowerBloom (so flowers always faintly glow).
 float isFlowerFrag = step(2.5, floor(vColorCoord.y * 7.0));
 float baseBloom = mix(1.0, uDefaultFlowerBloom, isFlowerFrag);

 // Then we mix from that baseline up to the massive hover multiplier based on vHoverGlow
 float bloomBoost = mix(baseBloom, uHoverGlowMultiplier, vHoverGlow);
 color *= bloomBoost;

 float a = tex.a * vAlpha;
 if (a < 0.01) discard;

 // Tone-mapping is handled by three fiber/renderer, but outputting >1.0 triggers bloom exactly where we want it.
 gl_FragColor = vec4(color, a);
 #include <colorspace_fragment>
}
`;
