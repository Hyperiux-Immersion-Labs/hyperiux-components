# FluidDistortion (cursor fluid / postprocessing distortion)

This folder implements a **GPU fluid simulation driven by your pointer (cursor)** and uses its output as a **postprocessing effect** to distort the rendered scene (including 3D elements).

You can think of it as two big parts:

1. **Simulation (FBO ping‑pong + shaders)**: creates a velocity field + “density/dye” texture that looks like fluid ink.
2. **Composite postprocess effect**: samples that simulation texture each frame to **distort the final screen image** (your whole WebGL canvas output).

The implementation is very similar to the common “Stable Fluids” real‑time technique:
- write velocity splats (forces) into a velocity texture
- compute curl (vorticity) → apply vorticity confinement
- compute divergence
- solve pressure (Jacobi iterations) to make the flow incompressible
- subtract pressure gradient from velocity
- advect velocity and dye (density)

---

## Quick usage

`FluidDistortion` exports `Fluid`.

```jsx
import { Fluid } from "@/components/ScrollRigComponents/FluidDistortion";
import { EffectComposer } from "@react-three/postprocessing";

export default function Scene() {
  return (
    <EffectComposer>
      <Fluid distortion={0.4} intensity={2} rainbow={false} />
    </EffectComposer>
  );
}
```

### What you’ll see
- Moving your pointer injects forces (“splats”) into the simulation.
- The simulation writes a dye texture (`density`) representing the fluid.
- The postprocess effect uses that dye/velocity info to **shift UVs** (screen coordinates) and create distortion + color mixing.

---

## How it interacts with 3D elements

This effect **does not push meshes in 3D space**.

Instead it runs *after* your 3D scene is rendered, as a **screen-space postprocess**:

- Your 3D scene renders normally to an internal buffer (`inputBuffer` in postprocessing).
- The fluid “density” texture is sampled at the same `uv`.
- The shader computes `distortedUv = uv - fluid.rg * distortion * 0.001`.
- The final color is sampled from the rendered scene using `distortedUv`.

That’s why **all 3D elements look like they are “under water / glass”** when the cursor moves.

If you want “true 3D interaction” (fluid pushing objects), you’d need to:
- sample the fluid texture **inside your mesh material** and use it to modify vertices/normals, or
- feed fluid forces into a physics system, or
- use depth-aware postprocessing (requires depth texture) to vary distortion by depth.

This folder currently implements the **screen-space** version.

---

## Folder structure

```
FluidDistortion/
├─ Fluid.jsx                       # Orchestrates simulation passes + mounts postprocess effect
├─ FluidEffectComponent.jsx        # React wrapper that owns the postprocess Effect instance
├─ effects/
│  └─ FluidEffect.jsx              # postprocessing.Effect: composite/distortion shader
├─ hooks/
│  ├─ useFBOs.jsx                  # allocates all render targets (single + double/pingpong)
│  ├─ useDoubleFBO.jsx             # helper for ping-pong FBOs
│  ├─ useMaterials.jsx             # creates ShaderMaterials for each simulation pass
│  └─ usePointer.jsx               # collects pointer splats (mouse pos + velocity)
├─ shaders/                        # GLSL versions of the same shaders (reference/alt source)
│  ├─ base.vert
│  ├─ splat.frag
│  ├─ curl.frag
│  ├─ vorticity.frag
│  ├─ divergence.frag
│  ├─ clear.frag
│  ├─ pressure.frag
│  ├─ gradientSubstract.frag
│  ├─ advection.frag
│  └─ composite.frag
├─ constants.js                    # DEFAULT_CONFIG + REFRESH_RATE
├─ utils.js                        # hexToRgb + normalizeScreenHz
└─ index.js                        # exports
```

---

## Imports map (every import used)

### `index.js`
- `Fluid` from `./Fluid`
- `DEFAULT_CONFIG` from `./constants`

### `constants.js`
- `BlendFunction` from `postprocessing`

### `utils.js`
- `Color`, `Vector3` from `three`
- `REFRESH_RATE` from `./constants`

### `Fluid.jsx`
- `createPortal`, `useFrame`, `useThree` from `@react-three/fiber`
- `useCallback`, `useMemo`, `useRef`, `useState` from `react`
- `Camera`, `Color`, `Mesh`, `Scene`, `Texture`, `Vector2`, `Vector3` from `three`
- `ShaderPass` from `three/examples/jsm/Addons.js`
- `FluidEffectComponent` from `./FluidEffectComponent`
- `useFBOs` from `./hooks/useFBOs`
- `useMaterials` from `./hooks/useMaterials`
- `DEFAULT_CONFIG` from `./constants`
- `usePointer` from `./hooks/usePointer`
- `normalizeScreenHz` from `./utils`

> Note: `ShaderPass` is imported in `Fluid.jsx` but **not used** in the current code. The real postprocessing is done via `postprocessing.Effect` in `effects/FluidEffect.jsx`.

### `FluidEffectComponent.jsx`
- `React`, `useMemo`, `useRef`, `useEffect` from `react`
- `FluidEffect` from `./effects/FluidEffect`

### `effects/FluidEffect.jsx`
- `Effect`, `EffectAttribute` from `postprocessing`
- `Uniform` from `three`
- `hexToRgb` from `../utils`

### `hooks/useFBOs.jsx`
- `* as THREE` from `three`
- `useFBO` from `@react-three/drei`
- `useEffect`, `useMemo` from `react`
- `useDoubleFBO` from `./useDoubleFBO`
- `DEFAULT_CONFIG` from `../constants`

### `hooks/useDoubleFBO.jsx`
- `* as THREE` from `three` (imported but not used directly)
- `useFBO` from `@react-three/drei`
- `useRef` from `react`

### `hooks/usePointer.jsx`
- `useThree` from `@react-three/fiber`
- `useCallback`, `useEffect`, `useRef` from `react`
- `Vector2` from `three`

### `hooks/useMaterials.jsx`
- `ShaderMaterial`, `Texture`, `Vector2`, `Vector3` from `three`
- `useEffect`, `useMemo` from `react`
- `useThree` from `@react-three/fiber`
- `DEFAULT_CONFIG`, `REFRESH_RATE` from `../constants`

---

## The render pipeline (step-by-step)

Everything happens inside `useFrame` in `Fluid.jsx`.

### 0) Setup: buffer scene + fullscreen quad

`Fluid.jsx` creates:
- a `bufferScene` (offscreen scene)
- a `bufferCamera` (basic camera)
- a fullscreen plane mesh inside the buffer scene

Then it uses `createPortal` so that mesh exists *only* in the buffer scene:
- The mesh is reused for all simulation passes.
- Changing `meshRef.current.material` swaps which shader runs for the pass.

### 1) Render targets (FBOs)

Created by `useFBOs.jsx`:
- **Double FBOs (ping-pong)**:
  - `velocity`: stores the 2D flow velocity (RG format)
  - `density`: stores dye/color (RGBA format)
  - `pressure`: scalar pressure field (Red format)
- **Single FBOs**:
  - `divergence`: scalar divergence (Red)
  - `curl`: scalar curl/vorticity (Red)

**Why double FBO?**
Many simulation steps are: “read from previous texture, write next texture.”
You can’t safely read and write the same render target in one pass.

So we keep:
- `read` (previous state)
- `write` (next state)
- `swap()` to flip them after rendering.

### 2) Materials (simulation passes)

`useMaterials.jsx` creates a `ShaderMaterial` per pass:
- `splat`
- `curl`
- `vorticity`
- `divergence`
- `clear`
- `pressure`
- `gradientSubstract`
- `advection`

All pass shaders are embedded as GLSL strings (and also exist in `/shaders` as separate `.frag` / `.vert` reference files).

The common vertex shader (`baseVertex`) supports two “modes” via `#define`:
- `USE_V_UV` → provides `vUv`
- `USE_OFFSETS` → computes neighbor UVs (`vL vR vT vB`) using a `texelSize` uniform

### 3) Pointer → splats (input force)

`usePointer.jsx` listens to global `pointermove` and builds a `splatStack`:
- `mouseX`, `mouseY` (normalized)
- `velocityX`, `velocityY` (delta movement multiplied by `force`)

In `Fluid.jsx` per frame:
- It pops splats and runs the `splat` shader:
  - once into `velocity` (inject a force)
  - once into `density` (inject dye)

Shader: `splat.frag`
- creates a Gaussian blob around pointer
- adds it into the target texture

### 4) Curl pass

Shader: `curl.frag`
- measures local rotation of the velocity field (vorticity scalar)
- writes to `curl` FBO

### 5) Vorticity confinement

Shader: `vorticity.frag`
- uses curl gradients to push energy back into the flow
- helps preserve swirling motion (prevents the fluid from becoming “dead” quickly)
- writes back into `velocity` (double FBO)

Config: `curl` (strength)

### 6) Divergence

Shader: `divergence.frag`
- computes divergence of the velocity field
- boundary checks invert velocities at edges (basic boundary condition)
- writes to `divergence` FBO

### 7) Clear pressure (dissipate)

Shader: `clear.frag`
- multiplies pressure texture by a factor
- uses `normalizeScreenHz(pressure, delta)` to make dissipation stable across different frame rates

This is one of the “techniques used” to keep behavior consistent on 60hz vs 144hz monitors.

### 8) Pressure solve (Jacobi iterations)

Shader: `pressure.frag`
- runs \(N\) times (`swirl` iterations) to solve for pressure that cancels divergence

This is the “projection step” in incompressible fluid solvers.

### 9) Gradient subtract

Shader: `gradientSubstract.frag`
- subtracts pressure gradient from velocity
- makes velocity field approximately divergence-free

### 10) Advection (move fields through velocity)

Shader: `advection.frag`
- backtraces each pixel along the velocity field to sample the previous state
- applies dissipation factor each pass

It runs twice:
- advect velocity (source = velocity)
- advect density (source = density)

---

## Postprocessing effect (how the distortion is drawn)

The simulation produces `FBOs.density.read.texture`.

That texture is passed into:

- `FluidEffectComponent.jsx` (a React wrapper that owns the effect instance)
- `effects/FluidEffect.jsx` (a `postprocessing.Effect`)

### `FluidEffect` shader (`composite.frag`)

Key line:

```glsl
vec2 distortedUv = uv - fluidColor.rg * uDistort * 0.001;
vec4 texture = texture2D(inputBuffer, distortedUv);
```

Meaning:
- sample fluid at `uv`
- take `fluidColor.rg` as a 2D offset vector
- shift the screen UVs and resample the rendered scene

Then it blends:
- the distorted scene sample
- a fluid color (either constant `uColor` or rainbow mode)
- optional background color when alpha is low

---

## Techniques used (the “why”)

- **FBO ping‑pong (double buffers)**: required for iterative GPU simulation steps.
- **Stable Fluids projection**:
  - divergence → pressure solve → gradient subtract
  - creates incompressible flow (water-like behavior).
- **Vorticity confinement**: adds small-scale swirling energy back into the simulation.
- **Semi‑Lagrangian advection**: stable advection that doesn’t explode easily.
- **Frame-rate normalization** (`normalizeScreenHz`) : keeps dissipation consistent across different delta times / refresh rates.
- **Shared fullscreen quad with material swapping**:
  - very fast and simple: “change material, render quad into FBO.”
- **Postprocessing screen-space distortion**:
  - affects all 3D elements uniformly because it distorts the final image.

---

## Tuning guide (what each prop does)

These props are defined in `Fluid.jsx` and default from `DEFAULT_CONFIG`.

- **`force`**: multiplies pointer delta into splat velocity.
  - higher = more aggressive fluid movement.
- **`radius`**: splat size (Gaussian radius).
  - higher = thicker strokes.
- **`curl`**: vorticity confinement strength.
  - higher = more swirly/turbulent.
- **`swirl`**: number of pressure iterations.
  - higher = more stable incompressibility, but more expensive.
- **`pressure`**: pressure dissipation (via `clear` pass).
- **`velocityDissipation` / `densityDissipation`**: how quickly motion/dye fades.
  - lower = fades faster.
- **`distortion`**: how much the fluid texture shifts UVs in the composite shader.
- **`intensity`**: how strongly the fluid color blends into the final output.
- **`rainbow`**: use the fluid texture’s RGB directly as color.
- **`fluidColor`**: tint when `rainbow=false`.
- **`backgroundColor` / `showBackground`**: fill behind transparent pixels.
- **`blend`**: extra blend amount (see `composite.frag`).
- **`blendFunction`**: postprocessing blend function (`BlendFunction.SET` by default).

---

## Common modifications / extensions

### 1) Make distortion depth-aware (stronger on background)
You need a depth texture from your renderer/composer and sample it in the composite shader.
Then scale `uDistort` by depth.

### 2) Make fluid affect a specific mesh (not whole screen)
Instead of postprocessing, pass `FBOs.density.read.texture` as a uniform to the mesh’s material and:
- distort its UVs, or
- displace vertices, or
- perturb normals.

### 3) Use the standalone `/shaders/*.frag` files
Right now `useMaterials.jsx` inlines the shader strings.
You can replace those strings by importing the files (depending on your bundler GLSL handling) to keep code cleaner.

---

## “Different cursors” (how to achieve different cursor styles)

In this system, the “cursor” is not a DOM icon — it’s the **pointer input → splat injection**.
So “different cursor effects” means: change **what you inject**, **how often you inject**, and **how the postprocess reads it**.

### A) Change the brush shape (splat shader)

Current `splat.frag` is a Gaussian blob:
- it computes distance from `uPointer`
- adds `exp(-dot(p,p)/radius) * uColor`

To make different cursor shapes, replace the Gaussian with a different falloff.

#### 1) Hard circle (sticker-like)

Replace:
- `exp(-dot(p, p) / uRadius)`

With:
- `1.0 - smoothstep(uRadius * 0.9, uRadius, length(p))`

Result:
- crisp circular brush
- less “ink” feel, more “stamp”

#### 2) Elongated brush (directional / comet)

Add a direction uniform (`uDir`) and stretch `p` along it:
- compute direction from pointer velocity
- create an anisotropic distance metric

Result:
- motion-direction streaks
- much more “cursor trail” feeling

#### 3) Textured brush (noise / shape mask)

Add `uniform sampler2D uBrushMask;`
- sample it in splat shader
- multiply splat intensity by mask

Result:
- organic, noisy splats
- custom shapes (star, logo, droplets)

### B) Change the “cursor physics” (input preprocessing)

The `usePointer.jsx` hook is where the “feel” starts:
- it listens to `pointermove`
- computes delta from last pointer
- pushes splats into `splatStack`

Ways to change feel:

#### 1) Smoothing / inertia cursor

Instead of writing raw `deltaX/deltaY`, apply smoothing:
- low-pass filter velocity
- clamp max velocity spikes

This makes the fluid stable and “heavy”.

#### 2) Add constant splats even when idle (ambient motion)

If you want the cursor effect to keep living when you stop moving:
- inject small random splats at the last pointer position
- or slowly rotate a directional force around the pointer

This produces a “breathing” distortion field.

#### 3) Multi-touch / multiple cursors

Use `pointerdown` + `pointermove` with `pointerId`:
- keep a map `id → lastPosition`
- push splats for each pointerId

Result:
- two-finger fluid painting on touch devices

### C) Change what “color” means (density vs velocity)

Right now `colorRef` uses pointer velocity in X/Y and a constant Z:
```js
colorRef.current.set(velocityX, velocityY, 10.0);
```

You can instead:
- make `density` store an actual ink color palette
- make `velocity` store only motion
- or store “type” (like different cursor modes) in a channel

Then modify `composite.frag` to interpret channels differently.

### D) Combine multiple cursor effects

You can run multiple postprocessing effects at once:
- fluid distortion + chromatic aberration
- fluid distortion + bloom
- fluid distortion + film grain

Rule of thumb:
- **distortion first**, then color grading/bloom

---

## Implement the same fluid on “other things”

The fluid simulation output is a texture (`tFluid` / `density`) that you can use anywhere.

### 1) Apply to a specific 3D mesh material (UV distortion)

Instead of postprocessing, sample the fluid inside a mesh shader:
- pass `FBOs.density.read.texture` to your material uniform `uFluid`
- shift the mesh UVs based on fluid’s RG

Conceptually (GLSL):

```glsl
vec3 f = texture2D(uFluid, vUv).rgb;
vec2 uv2 = vUv - f.rg * 0.02;
vec4 base = texture2D(map, uv2);
```

This makes only that mesh look “watery”.

### 2) Use it for vertex displacement (true 3D deformation)

Sample `uFluid` in the **vertex shader** and move vertices:

```glsl
float h = texture2D(uFluid, uv).r;
vec3 displaced = position + normal * (h * amplitude);
```

Now geometry really bends (not just screen distortion).

### 3) Use it as a mask for revealing/erasing

Because `density` is basically a paint texture:
- use `length(fluid)` as a mask
- reveal text/images where the cursor has moved

### 4) Use it with DOM (hybrid)

If you want a DOM element to react:
- render the fluid sim to a canvas / texture
- read a few samples on CPU (small downsample)
- drive CSS vars (e.g., blur amount, transform)

This is a different pipeline (GPU → CPU readback) and can be expensive,
so usually you keep it WebGL-only.

---

## SSP = “Screen-Space Postprocessing” pattern (how to reuse for other cursor effects)

This folder is an example of a general recipe:

1. **Generate a screen-space field texture** (a “cursor field”)
2. **Use that texture in a postprocess shader** to modify the final image

The “field texture” does not have to be fluid.
It can be:
- motion vectors
- signed distance field (SDF)
- ripple height map
- metaballs / blobs
- noise that follows cursor

### Step 1: Build a “cursor field” texture

In this project, the field texture is `density` (and `velocity`) stored in FBOs.

Minimal alternatives:

#### A) Very simple ripple field (no pressure solve)
- allocate one double FBO
- on pointer move: splat a ripple value
- each frame: blur + fade

Pros: super easy, fast  
Cons: not as fluid-like

#### B) Motion field only
- store pointer velocity splats
- advect + dissipate

Pros: great for distortion trails  
Cons: no incompressible “water” behavior

### Step 2: Write a postprocess that reads the field

The fluid postprocess does:
- UV shift = `field.rg`
- color blend based on `length(field)`

Other SSP cursor effects you can implement with the same structure:

#### 1) Heat-haze / refraction
- distort UVs (like now)
- add subtle noise, animated with time

#### 2) Chromatic aberration around cursor
- compute offset direction from field
- sample R/G/B at different shifted UVs

#### 3) Smear / motion blur along field direction
- take multiple samples along `field.rg` direction
- average them (like a directional blur)

#### 4) Pixelation / mosaic following cursor
- quantize UVs more strongly where `length(field)` is high

#### 5) “Magnifier lens” cursor
- compute a radial mask around cursor position
- locally scale UVs toward cursor

### Step 3: Plug it into any scene

Once you have a postprocessing effect component, you can mount it:
- globally (in your layout’s composer)
- per-page
- or only inside a specific R3F `<Canvas>`

Key rule:
- SSP effects work on the **final render**, so they automatically “interact” with every 3D element on screen.

---

## Complete tutorial: build your own cursor effect using this folder

This is a recommended learning path to build a brand-new cursor effect.

### Phase 1 — Make a tiny “field texture” system (no fluids yet)

Goal: understand FBO ping‑pong + splat + dissipation.

1. Create one double FBO `field` at \(128×128\).
2. Write a `splat` shader that adds a blob.
3. Write a `fade` shader that multiplies by 0.98.
4. Each frame:
   - apply all queued splats
   - run fade
5. Visualize it by drawing the texture to a fullscreen plane.

Once this works, you already have a cursor trail texture.

### Phase 2 — Turn it into postprocessing

1. Create a `postprocessing.Effect` (like `effects/FluidEffect.jsx`)
2. Pass your field texture as `tField`
3. In the effect fragment:
   - sample `tField`
   - distort / colorize `inputBuffer`

Now you have a reusable SSP cursor effect.

### Phase 3 — Upgrade the field into real fluid

1. Add velocity + pressure + divergence
2. Add projection step (pressure solve + gradient subtract)
3. Add curl + vorticity confinement
4. Add dye advection

At this point you’ll basically recreate what `Fluid.jsx` already does.

### Phase 4 — Make it “production”

- Add parameter controls (`force`, `radius`, `dissipation`, etc.)
- Normalize dissipation by frame rate (`normalizeScreenHz`)
- Add mobile/multitouch pointer handling
- Add optional depth-aware scaling (if you need better 3D layering)

---

## Where to start reading (recommended order)

1. `Fluid.jsx` (orchestration, the whole pipeline)
2. `hooks/useFBOs.jsx` + `hooks/useDoubleFBO.jsx` (render targets)
3. `hooks/useMaterials.jsx` (all simulation GLSL)
4. `effects/FluidEffect.jsx` (final distortion/composite)
5. `hooks/usePointer.jsx` (input)

