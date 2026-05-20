import { shaderMaterial } from'@react-three/drei'
import { extend } from'@react-three/fiber'

// Vertex Shader
const vertexShader = `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`

// Fragment Shader
const fragmentShader = `
 varying vec2 vUv;
 uniform sampler2D uPrev;
 uniform sampler2D uNext;
 uniform float uProgress;

 void main() {
 vec2 uv = vUv;
  // Map progress from [-0.05, 1.05] so the transition clears the corners completely
 float p = uProgress * 1.1 - 0.05;

 // Defines the slanted direction (shallow diagonal sweeping bottom-right to top-left)
 // This creates a boundary line with a slight upward tilt (y = 0.5x + C).
 float raw_diagonal = uv.y - 0.5 * uv.x;
  // Normalize to [0.0, 1.0]
 // min is at (x=1, y=0) -> -0.5. max is at (x=0, y=1) -> 1.0. range is 1.5.
 float diagonal = (raw_diagonal + 0.5) / 1.5;

 // Sharp, transparent wipe
 float wipe = smoothstep(p - 0.005, p + 0.005, diagonal);

 // Initial mix
 vec4 colorPrev = texture2D(uPrev, uv);
 vec4 colorNext = texture2D(uNext, uv);

 gl_FragColor = mix(colorNext, colorPrev, wipe);
 }
`

// Create shader material
export const TransitionShaderMaterial = shaderMaterial(
 {
 uPrev: null,
 uNext: null,
 uProgress: 0,
 uStrength: 0.35,
 uTime: 0,
 },
 vertexShader,
 fragmentShader
)

// Extend Three.js with the custom shader material
extend({ TransitionShaderMaterial })