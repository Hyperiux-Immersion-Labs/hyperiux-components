# Book Flip 3D Component - Complete Working Guide

## Overview
The Book Flip component is an advanced 3D interactive book visualization using React Three Fiber (R3F) and Three.js. It uses skeletal animation with bone deformation to create a realistic page-turning effect.

---

## Architecture & Data Flow

```
page.js (Server Component)
    ↓
BookFlipViewer.jsx (Client Wrapper)
    ├─ PageProvider (Context for page state)
    ├─ UI.jsx (Navigation buttons)
    └─ Experience.jsx (3D Scene)
        └─ Book.jsx (Main animation logic)
            └─ Page.jsx (Individual page rendering)
```

---

## Core Components

### 1. `page.js` - Server Component Entry Point
**Role:** Configuration layer - no client logic

```javascript
// Defines images array and configuration
const BOOK_IMAGES = ["nature01", "nature02", ...];

// Simple prop passing to BookFlipViewer
<BookFlipViewer
  images={BOOK_IMAGES}
  pathResolver={(img) => `/assets/nature/${img}.png`}
  bgColor="#000000"
  cameraDistance={{ mobile: 9, desktop: 4 }}
  floatConfig={{ ... }}
  onPageChange={(pageNumber) => {...}}
/>
```

### 2. `BookFlipViewer.jsx` - Client Wrapper
**Role:** Bridge between server config and 3D scene

**Key Features:**
- Responsive camera distance (mobile vs desktop)
- Window resize listener
- Fullscreen canvas container
- Passes all props down to Experience

**Props:**
```typescript
{
  images: string[]              // Image names for pages
  bgColor: string              // Canvas background
  cameraDistance: {
    mobile: number
    desktop: number
  }
  floatConfig: {}              // Float animation props
  showUI: boolean              // Toggle nav buttons
  onPageChange: (page) => void // Callback on page change
}
```

### 3. `Book.jsx` - Page Orchestration
**Role:** Manages page animation sequencing and image loading

**Key Concepts:**

#### Image to Page Conversion
```javascript
// Input: ["img1", "img2", "img3", "img4"]
// Output: 2-page book with front/back pairs
[
  { front: "img1", back: "img2" },
  { front: "img3", back: "img4" }
]
```

#### Page Animation Sequencing
- User clicks page 5 in UI
- `setPage(5)` is called
- `delayedPage` animates: 0→1→2→3→4→5 (sequentially)
- Each step triggers page turn animation
- Slower for jumps >2 pages (50ms), faster for singles (150ms)

#### Props
```typescript
{
  images: string[]
  pathResolver: (img: string) => string
  pageCount: number
  opened: boolean
  bookClosed: boolean
  number: number
}
```

---

## 3D Animation Deep Dive

### Skeletal Mesh Setup

#### Geometry Creation
```javascript
// Create subdivided geometry
const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,      // 1.28 units
  PAGE_HEIGHT,     // 1.71 units (4:3 aspect)
  PAGE_DEPTH,      // 0.003 units (paper thin)
  PAGE_SEGMENTS,   // 30 segments along width
  2                // 2 segments along height
);

// Translate so rotation happens from LEFT edge (spine)
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
```

#### Bone System
- **31 bones** created in a hierarchical chain
- Each bone positioned `SEGMENT_WIDTH` (0.0427) apart
- Bones are **nested** - rotation of parent cascades to children
- This creates a natural folding effect

#### Skin Weights
For each vertex, calculate influence from 2 adjacent bones:
```javascript
const skinIndex = Math.floor(x / SEGMENT_WIDTH);  // Which bone
const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;  // How much influence
```
- Left part of segment: influenced by left bone (weight: 1-skinWeight)
- Right part: influenced by right bone (weight: skinWeight)

**Result:** Smooth deformation as bones rotate

### Page.jsx - The Animation Engine

#### State Management
```javascript
group          // Root of page hierarchy
turnedAt       // Timestamp when page state changed
lastOpened     // Track open/close transitions
skinnedMeshRef // Reference to animated mesh
```

#### The Animation Loop (useFrame)

Called every frame (~60fps), updates bone rotations:

**1. Emissive Glow (Hover Effect)**
```javascript
// Smoothly interpolate emissive intensity on hover
emissiveIntensity = highlighted ? 0.22 : 0;
```

**2. Turning Time Calculation**
```javascript
// 0 to 1 over 400ms, then apply sine for smooth curve
let turningTime = Math.min(400, now - turnedAt) / 400;
turningTime = Math.sin(turningTime * Math.PI);  // Creates smooth S-curve
```

**3. Target Rotation**
```javascript
// Base rotation
let targetRotation = opened ? -Math.PI/2 : Math.PI/2;
//                           (90° open)  (90° closed)

// Add stagger based on page number (pages fan out)
if (!bookClosed) {
  targetRotation += degToRad(number * 0.8);
}
```

**4. Per-Bone Rotation Calculation**

For each of 31 bones, calculate final rotation angle:

```
rotationAngle = 
  INSIDE_CURVE_STRENGTH   × insideCurveIntensity  × targetRotation
  - OUTSIDE_CURVE_STRENGTH × outsideCurveIntensity × targetRotation
  + TURNING_CURVE_STRENGTH × turningIntensity     × targetRotation
```

**Inside Curve** (Bones 0-8):
```javascript
insideCurveIntensity = Math.sin(i * 0.2 + 0.25);
// Creates smooth "S" shape curve on inner part of page
// Bones 0-8: sin curve, max ~0.8
```

**Outside Curve** (Bones 8+):
```javascript
outsideCurveIntensity = Math.cos(i * 0.3 + 0.09);
// Opposite effect: reduces rotation at edges
// Creates realistic page edge behavior
```

**Turning Animation** (All bones):
```javascript
turningIntensity = Math.sin(i * Math.PI * (1/31)) * turningTime;
// Creates wave motion during turning
// Different bones turn at different times
```

**Fold Effect** (X-axis rotation):
```javascript
// Subtle rotation around X axis for 3D paper fold
let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
// Applied to bones 8+ with sine intensity
```

**5. Smooth Easing**
```javascript
// Use maath's dampAngle for smooth interpolation
easing.dampAngle(
  bone.rotation,
  'y',                    // Y-axis (page flip)
  rotationAngle,          // Target angle
  EASING_FACTOR,          // 0.5 = medium speed
  delta                   // Frame time
);
```

---

## Configuration Constants

### Tuning Guide

```javascript
// Animation Speed (0.1 = slow, 1 = instant)
const EASING_FACTOR = 0.5;
const EASING_FACTOR_FOLD = 0.3;

// Curve Intensities (higher = more pronounced)
const INSIDE_CURVE_STRENGTH = 0.18;    // Inner page curl
const OUTSIDE_CURVE_STRENGTH = 0.05;   // Edge reduction
const TURNING_CURVE_STRENGTH = 0.09;   // Wave during turn

// Geometry (affects realism and performance)
const PAGE_SEGMENTS = 30;  // More = smoother but slower
const PAGE_WIDTH = 1.28;   // Wider = landscape
const PAGE_HEIGHT = 1.71;  // Taller = portrait
```

---

## Usage Examples

### Basic Usage (Already Set Up)
```javascript
<BookFlipViewer
  images={["img1", "img2", "img3", "img4"]}
  pathResolver={(img) => `/images/${img}.png`}
/>
```

### Custom Styling
```javascript
<BookFlipViewer
  images={bookImages}
  bgColor="#1a1a1a"           // Dark theme
  cameraDistance={{
    mobile: 12,
    desktop: 6
  }}
  floatConfig={{
    floatIntensity: 0.5,       // Less bouncing
    rotationIntensity: 1,
    speed: 1.5
  }}
/>
```

### With Callbacks
```javascript
<BookFlipViewer
  images={images}
  onPageChange={(page) => {
    console.log(`Viewer on page ${page}`);
    // Track analytics, update UI, etc
  }}
/>
```

---

## Performance Tips

1. **Image Optimization**
   - Use compressed PNG/JPG
   - Aim for 512x682 or similar (maintain 4:3 ratio)
   - Pre-load textures for smoothness

2. **Bone Count**
   - 30 segments is a good balance
   - Increase for smoother curves (performance cost)
   - Decrease for better performance (visible faceting)

3. **Float Animation**
   - Reduce `floatIntensity` for less motion
   - Lower `speed` for calmer animation

4. **Camera Distance**
   - Desktop: 4-6 units (closer, more dramatic)
   - Mobile: 8-10 units (farther, more visible)

---

## Common Modifications

### Change Page Dimensions
```javascript
const PAGE_WIDTH = 1.0;   // Narrower
const PAGE_HEIGHT = 1.4;  // Shorter
```

### Faster Page Turns
```javascript
const EASING_FACTOR = 1.0;  // Increase from 0.5
```

### Different Page Curve
```javascript
const INSIDE_CURVE_STRENGTH = 0.25;   // More pronounced curve
const OUTSIDE_CURVE_STRENGTH = 0.02;  // Less edge effect
```

### Disable Animation During Turn
```javascript
// In Page.jsx, modify inside useFrame:
if (turningTime > 0.1) {  // Only animate after turn starts
  // ... bone rotation code
}
```

---

## Troubleshooting

**Book not visible:**
- Check `cameraDistance` values
- Verify image paths in `pathResolver`
- Ensure images exist at specified paths

**Pages flicker during turn:**
- Increase `EASING_FACTOR`
- Check for z-fighting (depth offset might be too small)

**Performance issues:**
- Reduce `PAGE_SEGMENTS` (default 30, try 20)
- Lower `float` speed and intensity
- Reduce image resolution

**Pages don't curve realistically:**
- Increase `INSIDE_CURVE_STRENGTH`
- Adjust `TURNING_CURVE_STRENGTH`
- Try different values for bone indices (8 is the cutoff)

---

## Key Takeaways

1. **Skeletal Animation** - Pages are deformed by 31 bone rotations
2. **Hierarchical Bones** - Children inherit parent rotations
3. **Skin Weights** - Vertices influenced by 2 adjacent bones
4. **Sequential Animation** - Pages turn one-by-one toward target
5. **Easing** - `dampAngle` creates smooth, physical-feeling motion
6. **Trigonometric Curves** - Sin/cos functions create natural page shapes
7. **Configurable** - All constants tunable for different effects
