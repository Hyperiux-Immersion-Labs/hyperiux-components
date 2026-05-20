"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = /* glsl */`
uniform vec2  uVelocity;
uniform vec2  uViewport;
uniform float uCurvature;

varying vec2  vUv;

float circularArc(float d) {
  float maxAngle = 1.15;
  float theta = clamp(d, 0.0, 1.0) * maxAngle;
  return (1.0 - cos(theta)) / (1.0 - cos(maxAngle));
}

void main() {
  vUv = uv;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  float nx = worldPos.x / uViewport.x;
  float ny = worldPos.y / uViewport.y;

  float cx = clamp(nx, -1.0, 1.0);
  float cy = clamp(ny, -1.0, 1.0);

  float distY = abs(cy);
  float distX = abs(cx);

  float curveY = circularArc(distY);
  float curveX = circularArc(distX);

  float edgeLift = curveY * uCurvature + curveX * (uCurvature * 0.1);
  float finalZOffset = edgeLift;

  float focalLength = max(uViewport.y * 2.2, 900.0);
  float perspective = focalLength / (focalLength - finalZOffset);

  vec3 finalPos = worldPos.xyz;
  finalPos.xy *= perspective;
  finalPos.z  += finalZOffset;

  gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = /* glsl */`
  uniform sampler2D uTexture;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  uniform float uAlpha;
  uniform float uZoom;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
    float planeRatio = planeSize.x / planeSize.y;
    float imageRatio = imageSize.x / imageSize.y;
    vec2 scale = vec2(1.0);
    if (planeRatio > imageRatio) {
      scale.y = imageRatio / planeRatio;
    } else {
      scale.x = planeRatio / imageRatio;
    }
    uv = (uv - 0.5) * scale + 0.5;
    return (uv - 0.5) / uZoom + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    vec4 tex = texture2D(uTexture, uv);
    gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
  }
`;

const _clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const _lerp  = (a, b, t)   => a + (b - a) * t;

export function HoverSlider({ items = [] }) {
  const mountRef = useRef(null);
  const glRef    = useRef(null);
  const stateRef = useRef({ activeIndex: 0, hovering: false });

  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    if (!items.length) return;
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.offsetWidth;
    let H = mount.offsetHeight;

    const CARD_ASPECT = 1.7;
    const GAP         = 14;
    const VISIBLE     = 7;
    const HALF        = 3;

    const getCardH = () => Math.round(H * 0.46);
    const getCardW = () => Math.round(getCardH() * CARD_ASPECT);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0",
      width: "100%", height: "100%",
      zIndex: "15", pointerEvents: "none",
    });
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const updateCamera = () => {
      camera.left   = -W / 2;  camera.right  =  W / 2;
      camera.top    =  H / 2;  camera.bottom = -H / 2;
      camera.near   = -2000;   camera.far    =  2000;
      camera.updateProjectionMatrix();
    };
    camera.position.z = 1000;
    updateCamera();
    renderer.setSize(W, H, false);

    const loader   = new THREE.TextureLoader();
    const texCache = {};
    const getTexture = (src) => {
      if (texCache[src]) return texCache[src];
      const tex = loader.load(src, (t) => {
        t.colorSpace  = THREE.SRGBColorSpace;
        t.minFilter   = THREE.LinearFilter;
        t.magFilter   = THREE.LinearFilter;
        t.userData.iw = t.image?.width  || 1;
        t.userData.ih = t.image?.height || 1;
      });
      tex.userData.iw = 1;
      tex.userData.ih = 1;
      texCache[src] = tex;
      return tex;
    };
    items.forEach(item => getTexture(item.img));

    const syncImageSize = (mesh) => {
      const t = mesh.material.uniforms.uTexture.value;
      if (!t?.image) return;
      mesh.material.uniforms.uImageSize.value.set(
        t.image.width  || t.userData.iw || 1,
        t.image.height || t.userData.ih || 1,
      );
    };

    const geo = new THREE.PlaneGeometry(1, 1, 80, 80);
    let CW = getCardW(), CH = getCardH();

    const makeMat = (tex) => new THREE.ShaderMaterial({
      uniforms: {
        uTexture:   { value: tex },
        uPlaneSize: { value: new THREE.Vector2(CW, CH) },
        uImageSize: { value: new THREE.Vector2(tex.userData.iw, tex.userData.ih) },
        uVelocity:  { value: new THREE.Vector2(0, 0) },
        uAlpha:     { value: 0 },
        uZoom:      { value: 1.06 },
        uViewport:  { value: new THREE.Vector2(W / 2, H / 2) },
        uCurvature: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });

    const firstTex = getTexture(items[0].img);
    const meshes = Array.from({ length: VISIBLE }, (_, i) => {
      const mesh = new THREE.Mesh(geo, makeMat(firstTex));
      mesh.renderOrder = i;
      scene.add(mesh);
      return mesh;
    });

    const curveAnim  = { value: 0, zoom: 1.06 };
    const anim       = { alpha: 0 };
    const ACTIVE_CURVE = 400;
    const SOFT_CURVE   = 80;

    const getCurveForTravel = (targetIdx) => {
      const travel = Math.abs(targetIdx - floatIdx);
      const p = _clamp((travel - 0.35) / 3.5, 0, 1);
      const eased = p * p * (3 - 2 * p);
      return _lerp(SOFT_CURVE, ACTIVE_CURVE, eased);
    };

    const releaseCurve = (targetIdx = stateRef.current.activeIndex) => {
      const peakCurve = getCurveForTravel(targetIdx);
      gsap.killTweensOf(curveAnim);
      curveAnim.zoom = 1.06;
      gsap.timeline()
        .to(curveAnim, { value: peakCurve, zoom: 1.06, duration: 0.12, ease: "power2.out" })
        .to(curveAnim, { value: 0, zoom: 1.06, duration: 1.25, ease: "power2.inOut" });
    };

    const show = (targetIdx) => {
      gsap.killTweensOf(anim);
      gsap.to(anim, { alpha: 1, duration: 0.45, ease: "power3.out" });
      releaseCurve(targetIdx);
    };

    const hide = () => {
      gsap.killTweensOf(anim);
      gsap.killTweensOf(curveAnim);
      gsap.to(anim,      { alpha: 0,   duration: 0.35, ease: "power2.out" });
      gsap.to(curveAnim, { value: 0, zoom: 1.06, duration: 0.55, ease: "power2.inOut" });
    };

    const onRowChange = (targetIdx) => { releaseCurve(targetIdx); };

    const onResize = () => {
      W = mount.offsetWidth;
      H = mount.offsetHeight;
      renderer.setSize(W, H, false);
      updateCamera();
      CW = getCardW();
      CH = getCardH();
      meshes.forEach(m => {
        m.material.uniforms.uPlaneSize.value.set(CW, CH);
        m.material.uniforms.uViewport.value.set(W / 2, H / 2);
      });
    };
    window.addEventListener("resize", onResize);

    let floatIdx  = 0;
    let prevFloat = 0;
    const vel     = new THREE.Vector2(0, 0);
    let raf       = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const targetIdx = stateRef.current.activeIndex;
      const diff = targetIdx - floatIdx;
      const dist = Math.abs(diff);
      const t = _clamp(0.18 - dist * 0.06, 0.05, 0.18);
      floatIdx += diff * t;

      const delta = floatIdx - prevFloat;
      vel.y = _lerp(vel.y, delta * 60, 0.16);
      vel.x = _lerp(vel.x, 0, 0.14);
      prevFloat = floatIdx;

      const centreInt = Math.round(floatIdx);
      const drift     = floatIdx - centreInt;

      for (let i = 0; i < VISIBLE; i++) {
        const offset  = i - HALF;
        const itemIdx = ((centreInt + offset) % items.length + items.length) % items.length;
        const posY    = (-offset + drift) * (CH + GAP);
        const d       = Math.abs(offset - drift);
        const scaleH  = Math.max(0.76, 1.0 - d * 0.06);
        const sw      = CW;
        const sh      = CH * scaleH;
        const opacity = Math.max(0, 0.88 - d * 0.22) * anim.alpha;

        const wantTex = getTexture(items[itemIdx].img);
        if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
          meshes[i].material.uniforms.uTexture.value = wantTex;
        }
        syncImageSize(meshes[i]);

        meshes[i].position.set(0, posY, i);
        meshes[i].scale.set(sw, sh, 1);
        meshes[i].rotation.z = 0;
        meshes[i].material.uniforms.uVelocity.value.set(vel.x, vel.y * 0.28);
        meshes[i].material.uniforms.uAlpha.value     = opacity;
        meshes[i].material.uniforms.uZoom.value      = curveAnim.zoom - _clamp(1.0 - d, 0, 1) * 0.04;
        meshes[i].material.uniforms.uPlaneSize.value.set(sw, sh);
        meshes[i].material.uniforms.uCurvature.value = curveAnim.value;
        meshes[i].material.uniforms.uViewport.value.set(W / 2, H / 2);
      }

      renderer.render(scene, camera);
    };

    tick();

    glRef.current = { setActive: (i) => { stateRef.current.activeIndex = i; }, show, hide, onRowChange };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(anim);
      gsap.killTweensOf(curveAnim);
      geo.dispose();
      meshes.forEach(m => m.material.dispose());
      Object.values(texCache).forEach(t => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      glRef.current = null;
    };
  }, [items]);

  const onEnter = useCallback((index) => {
    const wasHovering = stateRef.current.hovering;
    stateRef.current.hovering    = true;
    stateRef.current.activeIndex = index;
    setHighlightedIndex(index);
    glRef.current?.setActive(index);
    if (!wasHovering) {
      glRef.current?.show(index);
    } else {
      glRef.current?.onRowChange(index);
    }
  }, []);

  const onLeave = useCallback(() => {
    stateRef.current.hovering = false;
    setHighlightedIndex(null);
    glRef.current?.hide();
  }, []);

  return (
    <section
      ref={mountRef}
      onPointerLeave={onLeave}
      className="relative isolate min-h-screen overflow-hidden bg-[#f0ede6] px-8 py-9 text-[#1e1c18] md:px-10"
      style={{ cursor: "crosshair" }}
    >
      <header
        className="relative z-20 flex items-start justify-between text-[11px]"
        style={{ color: "rgba(30,28,24,0.6)" }}
      >
        <div>1470px × 797px</div>
        <nav className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-3">
          <span>Featured Works,</span>
          <span>Archive</span>
          <span>About</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-[#e63000]" />
          <span>Available June 2026</span>
        </div>
      </header>

      <div className="relative z-20 mt-16 max-w-205 md:mt-[9vh]">
        <div
          className="grid gap-5 pb-4 text-[10px] uppercase tracking-widest"
          style={{
            gridTemplateColumns: "72px minmax(140px,1fr) minmax(180px,1.1fr) 64px",
            color: "rgba(30,28,24,0.6)",
            borderBottom: "1px solid rgba(30,28,24,0.06)",
          }}
        >
          <div>ID</div>
          <div>Title</div>
          <div>Focus</div>
          <div>Year</div>
        </div>

        {items.map((item, index) => {
          const active = highlightedIndex === index;
          return (
            <div
              key={item.id}
              onPointerEnter={() => onEnter(index)}
              style={{
                display: "grid",
                gridTemplateColumns: "72px minmax(140px,1fr) minmax(180px,1.1fr) 64px",
                gap: "20px",
                padding: "7px 0",
                borderBottom: "1px solid rgba(30,28,24,0.06)",
                cursor: "crosshair",
                transition: "color 0.15s",
                color: active ? "#e63000" : "rgba(30,28,24,0.6)",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.03em" }}>{item.id}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: 11 }}>{item.focus}</div>
              <div style={{ fontSize: 11 }}>{item.year}</div>
            </div>
          );
        })}
      </div>

      <p
        className="pointer-events-none absolute right-[10vw] top-[22vh] z-20 max-w-[320px] text-center text-[12px] leading-relaxed"
        style={{ color: "rgba(30,28,24,0.6)" }}
      >
        A curated collection of work — from collaborations and experiments to
        personal projects, capturing finished pieces and ideas in motion.
      </p>
    </section>
  );
}
