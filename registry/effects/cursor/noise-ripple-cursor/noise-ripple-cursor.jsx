'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX_SRC = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const FBO_FRAGMENT = `
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
  vec2 velocity = prev.xy * uDissipation;
  float density = prev.z * uDissipation;
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
`

const MAIN_FRAGMENT = `
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

float wavyFbm(vec2 uv, float t) {
  float v = 0.0;
  float a = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
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
  vec4 fluid = texture(uFluidTex, uv);
  vec2 velocity = fluid.xy;
  float fluidDensity = fluid.z;
  vec2 distortedUV = uv + velocity * uDistortStrength;
  distortedUV.y = 1.0 - distortedUV.y;
  vec4 imageColor = texture(uImage, distortedUV);
  vec2 pixelUV = uv;
  float aspect = uResolution.x / uResolution.y;
  float n = wavyFbm(pixelUV * vec2(aspect, .5) * .5, uTime * 0.05);
  float animatedDensity = uDensity + sin(uTime * 0.3) * 0.15 + sin(uTime * 0.2 + pixelUV.x * 2.0) * 0.1;
  n = n * 0.6 + (animatedDensity - 0.5) * 0.2;
  n += fluidDensity * 0.5;
  n = smoothstep(0.2, 0.8, n);
  float bayer = fract(dot(floor(gl_FragCoord.xy / uPixelSize), vec2(0.5, 0.4)));
  float mask = step(0.4, n + (bayer - 0.5));
  vec3 color = pow(uNoiseColor, vec3(2.2));
  color = pow(color, vec3(1.0 / 2.2));
  color *= 1.0 - (fluidDensity * uTrailDarkness);
  fragColor = vec4(color, mask * imageColor.a);
}
`

function createTracker() {
  const handlersByEl = new WeakMap()
  let targets = []
  let hovered = null
  let dirty = true
  let attached = false

  const getRect = (el) => {
    const rect = el.getBoundingClientRect()
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
  }

  const refresh = () => {
    const els = Array.from(document.querySelectorAll('.fx-target')).filter((el) => handlersByEl.has(el))
    targets = els.map((el) => ({ el, rect: getRect(el) }))
    hovered = targets.find((target) => target.el === hovered?.el) || null
    dirty = false
  }

  const ensure = () => {
    if (!dirty) return
    targets.forEach((target) => {
      target.rect = getRect(target.el)
    })
    dirty = false
  }

  const attach = () => {
    if (attached) return
    attached = true
    window.addEventListener('mousemove', (event) => {
      ensure()
      let next = null
      for (const target of targets) {
        if (event.clientX >= target.rect.left && event.clientX <= target.rect.right && event.clientY >= target.rect.top && event.clientY <= target.rect.bottom) {
          next = target
          break
        }
      }
      if (next !== hovered) {
        handlersByEl.get(hovered?.el)?.onLeave?.()
        hovered = next
      }
      if (hovered) {
        handlersByEl.get(hovered.el)?.onMove?.({
          localX: event.clientX - hovered.rect.left,
          localY: event.clientY - hovered.rect.top,
          rect: hovered.rect,
        })
      }
    }, { passive: true })
    const mark = () => { dirty = true }
    window.addEventListener('resize', mark, { passive: true })
    window.addEventListener('scroll', mark, { passive: true, capture: true })
  }

  return {
    register(el, handlers) {
      handlersByEl.set(el, handlers)
      refresh()
      attach()
    },
    unregister(el) {
      handlersByEl.delete(el)
      refresh()
    },
  }
}

const tracker = typeof window !== 'undefined' ? createTracker() : null

const createFBO = (renderer, width, height) =>
  new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

export function NoiseRippleShader({
  imageSrc = '/assets/img/image02.webp',
  noiseColor = '#ffffff',
  className,
  style,
  pixelSize = 3,
  patternDensity = 1,
  fluidRadius = 0.05,
  fluidStrength = 0.3,
  fluidDissipation = 0.98,
  distortStrength = 0.02,
  trailDarkness = 0.5,
}) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: -1, y: -1 })
  const isMouseStoppedRef = useRef(false)
  const stopTimeoutRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const parseColor = (hex) => {
      const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return match
        ? new THREE.Vector3(
            parseInt(match[1], 16) / 255,
            parseInt(match[2], 16) / 255,
            parseInt(match[3], 16) / 255
          )
        : new THREE.Vector3(1, 1, 1)
    }

    const textureLoader = new THREE.TextureLoader()
    const imageTexture = textureLoader.load(imageSrc)
    imageTexture.minFilter = THREE.LinearFilter
    imageTexture.magFilter = THREE.LinearFilter

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const fboScene = new THREE.Scene()
    let fboA = createFBO(renderer, 256, 256)
    let fboB = createFBO(renderer, 256, 256)

    const fboMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FBO_FRAGMENT,
      uniforms: {
        uPrevFrame: { value: null },
        uResolution: { value: new THREE.Vector2(256, 256) },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uRadius: { value: fluidRadius },
        uStrength: { value: fluidStrength },
        uDissipation: { value: fluidDissipation },
      },
      glslVersion: THREE.GLSL3,
    })
    fboScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial))

    const mainMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: MAIN_FRAGMENT,
      uniforms: {
        uImage: { value: imageTexture },
        uFluidTex: { value: fboA.texture },
        uResolution: { value: new THREE.Vector2() },
        uTime: { value: 0 },
        uPixelSize: { value: pixelSize },
        uDensity: { value: patternDensity },
        uNoiseColor: { value: parseColor(noiseColor) },
        uDistortStrength: { value: distortStrength },
        uTrailDarkness: { value: trailDarkness },
      },
      transparent: true,
      glslVersion: THREE.GLSL3,
    })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMaterial))

    const setSize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height, false)
      mainMaterial.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
      mainMaterial.uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio()
    }
    setSize()
    const resizeObserver = new ResizeObserver(setSize)
    resizeObserver.observe(container)

    container.classList.add('fx-target')
    tracker?.register(container, {
      onMove: ({ localX, localY }) => {
        mouseRef.current = {
          x: localX * (renderer.domElement.width / container.clientWidth),
          y: (container.clientHeight - localY) * (renderer.domElement.height / container.clientHeight),
        }
        isMouseStoppedRef.current = false
        clearTimeout(stopTimeoutRef.current)
        stopTimeoutRef.current = setTimeout(() => {
          isMouseStoppedRef.current = true
        }, 100)
      },
      onLeave: () => {
        mouseRef.current = { x: -1, y: -1 }
        isMouseStoppedRef.current = false
        clearTimeout(stopTimeoutRef.current)
      },
    })

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      mainMaterial.uniforms.uTime.value = clock.getElapsedTime()
      fboMaterial.uniforms.uPrevFrame.value = fboA.texture

      if (isMouseStoppedRef.current) {
        fboMaterial.uniforms.uMouse.value.set(-1, -1)
      } else {
        fboMaterial.uniforms.uMouse.value.set(
          mouseRef.current.x * (256 / renderer.domElement.width),
          mouseRef.current.y * (256 / renderer.domElement.height)
        )
      }

      renderer.setRenderTarget(fboB)
      renderer.render(fboScene, camera)
      renderer.setRenderTarget(null)
      ;[fboA, fboB] = [fboB, fboA]
      mainMaterial.uniforms.uFluidTex.value = fboA.texture
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(frameId)
      clearTimeout(stopTimeoutRef.current)
      tracker?.unregister(container)
      container.classList.remove('fx-target')
      fboA.dispose()
      fboB.dispose()
      mainMaterial.dispose()
      fboMaterial.dispose()
      imageTexture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement)
    }
  }, [distortStrength, fluidDissipation, fluidRadius, fluidStrength, imageSrc, noiseColor, patternDensity, pixelSize, trailDarkness])

  return <div ref={containerRef} className={className} style={style} aria-label="Noise ripple cursor canvas" />
}

export default function NoiseRippleCursor({
  overlayColor = 'bg-[#1825AA]/30',
  wrapperClassName = 'h-screen w-screen',
  imageSrc = 'https://images.prismic.io/oci-awards/aYePB90YXLCxVj72_adrien-olichon-_UuN_2ixJvA-unsplash.jpg?auto=format%2Ccompress&rect=784%2C783%2C4918%2C2754&w=1000&h=1400&q=80',
  shaderConfig = {
    pixelSize: 0.5,
    patternDensity: 1,
    fluidRadius: 0.08,
    fluidStrength: 0.2,
    fluidDissipation: 0.9,
    distortStrength: 0.5,
    trailDarkness: 0,
  },
}) {
  const { pixelSize, patternDensity, fluidRadius, fluidStrength, fluidDissipation, distortStrength, trailDarkness } = shaderConfig

  return (
    <div className={`${wrapperClassName} relative`}>
      <img
        src={imageSrc}
        alt="Background"
        className="brightness-100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      <div className={`absolute inset-0 h-full w-full ${overlayColor}`} />
      <NoiseRippleShader
        noiseColor="#1825AA"
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        pixelSize={pixelSize}
        patternDensity={patternDensity}
        fluidRadius={fluidRadius}
        fluidStrength={fluidStrength}
        fluidDissipation={fluidDissipation}
        distortStrength={distortStrength}
        trailDarkness={trailDarkness}
      />
    </div>
  )
}
