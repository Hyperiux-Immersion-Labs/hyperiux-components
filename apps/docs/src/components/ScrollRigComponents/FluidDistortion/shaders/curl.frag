precision highp float;

// Texture coordinates for neighboring pixels
// vL = left, vR = right, vT = top, vB = bottom
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

// Velocity field texture containing 2D velocity vectors
uniform sampler2D uVelocity;

void main() {
    // Sample velocity components from neighboring pixels
    // For curl calculation, we need:
    // - Y component (vertical velocity) from left and right neighbors
    // - X component (horizontal velocity) from top and bottom neighbors
    
    float L = texture2D(uVelocity, vL).y;  // Left neighbor's Y velocity
    float R = texture2D(uVelocity, vR).y;  // Right neighbor's Y velocity
    float T = texture2D(uVelocity, vT).x;  // Top neighbor's X velocity
    float B = texture2D(uVelocity, vB).x;  // Bottom neighbor's X velocity

    // Calculate curl (vorticity) using finite difference approximation
    // Curl = ∂vy/∂x - ∂vx/∂y
    // Where ∂vy/∂x ≈ (R - L) and ∂vx/∂y ≈ (T - B)
    // So curl ≈ (R - L) - (T - B) = R - L - T + B
    float vorticity = R - L - T + B;

    // Output vorticity in red channel, with alpha = 1.0
    gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}
