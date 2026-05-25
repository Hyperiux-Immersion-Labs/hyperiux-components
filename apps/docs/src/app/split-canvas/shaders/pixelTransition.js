export const PixelTransitionVertex = `
 varying vec2 vUv;

 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

export const PixelTransitionFragment = `
 uniform sampler2D u_texture1;
 uniform sampler2D u_texture2;
 uniform float u_progress;
 uniform float u_numSlices;
 uniform vec2 u_resolution;
 uniform float u_gridSize;

 varying vec2 vUv;

 // Draw grid lines only (transparent background)
 float drawGridLines(vec2 uv, vec2 resolution, float gridSize) {
 vec2 pixelPos = uv * resolution;
 float lineWidth = 1.0;

 // Vertical and horizontal lines
 float vLine = step(mod(pixelPos.x, gridSize), lineWidth);
 float hLine = step(mod(pixelPos.y, gridSize), lineWidth);

 return max(vLine, hLine);
 }

 void main() {
 vec2 uv = vUv;

 // Grid lines (just the lines, transparent elsewhere)
 float gridLine = drawGridLines(uv, u_resolution, u_gridSize);
 vec4 gridColor = vec4(0.0, 0.0, 0.0, gridLine * 0.15); // Semi-transparent black lines

 // Number of horizontal slices (blinds)
 float slices = u_numSlices;
 float sliceIndex = floor(uv.y * slices);
 float sliceNorm = sliceIndex / slices;
 float sliceHeight = 1.0 / slices;
 float posInSlice = fract(uv.y * slices);

 // Bottom slices transition first
 float sliceDelay = sliceNorm * 0.6;
 float sliceProgress = smoothstep(sliceDelay, sliceDelay + 0.4, u_progress);

 // Blind collapse effect
 float blindScale = 1.0 - sliceProgress;
 float visibleThreshold = 1.0 - blindScale;

 // Determine which texture to show based on blind position
 vec4 texColor;

 if (posInSlice < visibleThreshold) {
 // Collapsed part - show texture2
 texColor = texture2D(u_texture2, uv);
 } else {
 // Visible part - show texture1 with slide offset
 vec2 adjustedUV = uv;
 float slideOffset = visibleThreshold * sliceHeight;
 adjustedUV.y = clamp(uv.y - slideOffset, 0.0, 1.0);
 texColor = texture2D(u_texture1, adjustedUV);
 }

 // Composite: transparent background + grid lines + image
 // Start with grid on transparent background
 vec4 result = gridColor;

 // Blend image on top (image alpha determines visibility)
 result = vec4(
 mix(result.rgb, texColor.rgb, texColor.a),
 max(result.a, texColor.a)
 );

 gl_FragColor = result;
 }
`;
