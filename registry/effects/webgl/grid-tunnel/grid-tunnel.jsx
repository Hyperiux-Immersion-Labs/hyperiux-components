"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Preload } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";

const TUNNEL_DEPTH = 90;
const TUNNEL_WIDTH = 18;
const TUNNEL_HEIGHT = 11;

const GRID_X = 8;
const GRID_Y = 5;
const GRID_Z = 36;

const VISIBLE_CHUNKS = 9;
const IMAGE_COUNT_PER_CHUNK = 50;

const CAMERA_START_Z = 18;
const TUNNEL_START_Z = 17;

const SCROLL_SPEED = 0.012;
const CAMERA_SMOOTHING = 0.08;
const SCROLL_DAMPING = 7; // higher = stops sooner
const CAMERA_FOLLOW = 10; // higher = follows target more tightly
const MAX_SCROLL_VELOCITY = 2.0;

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function Line({ points }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setFromPoints(points.map((p) => new THREE.Vector3(...p)));
    return g;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#e5e5e5"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </line>
  );
}

function GridChunkContent() {
  const lines = useMemo(() => {
    const items = [];

    const halfW = TUNNEL_WIDTH / 2;
    const halfH = TUNNEL_HEIGHT / 2;

    const cellW = TUNNEL_WIDTH / GRID_X;
    const cellH = TUNNEL_HEIGHT / GRID_Y;
    const cellD = TUNNEL_DEPTH / GRID_Z;

    for (let zi = 0; zi <= GRID_Z; zi++) {
      const z = -zi * cellD;

      items.push(
        { points: [[-halfW, halfH, z], [halfW, halfH, z]] },
        { points: [[-halfW, -halfH, z], [halfW, -halfH, z]] },
        { points: [[-halfW, -halfH, z], [-halfW, halfH, z]] },
        { points: [[halfW, -halfH, z], [halfW, halfH, z]] }
      );
    }

    for (let xi = 0; xi <= GRID_X; xi++) {
      const x = -halfW + xi * cellW;

      items.push(
        { points: [[x, halfH, 0], [x, halfH, -TUNNEL_DEPTH]] },
        { points: [[x, -halfH, 0], [x, -halfH, -TUNNEL_DEPTH]] }
      );
    }

    for (let yi = 0; yi <= GRID_Y; yi++) {
      const y = -halfH + yi * cellH;

      items.push(
        { points: [[-halfW, y, 0], [-halfW, y, -TUNNEL_DEPTH]] },
        { points: [[halfW, y, 0], [halfW, y, -TUNNEL_DEPTH]] }
      );
    }

    return items;
  }, []);

  return (
    <>
      {lines.map((line, index) => (
        <Line key={index} points={line.points} />
      ))}
    </>
  );
}

function ImageChunkContent({ images, slotIndex }) {
  const { viewport } = useThree();

  const panels = useMemo(() => {
    const random = seededRandom(200 + slotIndex * 13);

    const halfW = TUNNEL_WIDTH / 2;
    const halfH = TUNNEL_HEIGHT / 2;

    const cellW = TUNNEL_WIDTH / GRID_X;
    const cellH = TUNNEL_HEIGHT / GRID_Y;
    const cellD = TUNNEL_DEPTH / GRID_Z;

    const pxToWorld =
      typeof window !== "undefined" ? viewport.width / window.innerWidth : 0.01;

    const paddingWorld = pxToWorld * 10;

    return Array.from({ length: IMAGE_COUNT_PER_CHUNK }).map((_, i) => {
      const side = Math.floor(random() * 4);
      const zi = Math.floor(random() * (GRID_Z - 2));

      let position = [0, 0, 0];
      let rotation = [0, 0, 0];
      let scale = [1, 1, 1];

      if (side === 0) {
        const yi = Math.floor(random() * GRID_Y);
        const y = -halfH + yi * cellH + cellH / 2;
        const z = -zi * cellD - cellD / 2;

        position = [-halfW + 0.035, y, z];
        rotation = [0, Math.PI / 2, 0];

        scale = [
          Math.max(cellD - paddingWorld * 2, 0.2),
          Math.max(cellH - paddingWorld * 2, 0.2),
          1,
        ];
      }

      if (side === 1) {
        const yi = Math.floor(random() * GRID_Y);
        const y = -halfH + yi * cellH + cellH / 2;
        const z = -zi * cellD - cellD / 2;

        position = [halfW - 0.035, y, z];
        rotation = [0, -Math.PI / 2, 0];

        scale = [
          Math.max(cellD - paddingWorld * 2, 0.2),
          Math.max(cellH - paddingWorld * 2, 0.2),
          1,
        ];
      }

      if (side === 2) {
        const xi = Math.floor(random() * GRID_X);
        const x = -halfW + xi * cellW + cellW / 2;
        const z = -zi * cellD - cellD / 2;

        position = [x, -halfH + 0.035, z];
        rotation = [-Math.PI / 2, 0, 0];

        scale = [
          Math.max(cellW - paddingWorld * 2, 0.2),
          Math.max(cellD - paddingWorld * 2, 0.2),
          1,
        ];
      }

      if (side === 3) {
        const xi = Math.floor(random() * GRID_X);
        const x = -halfW + xi * cellW + cellW / 2;
        const z = -zi * cellD - cellD / 2;

        position = [x, halfH - 0.035, z];
        rotation = [Math.PI / 2, 0, 0];

        scale = [
          Math.max(cellW - paddingWorld * 2, 0.2),
          Math.max(cellD - paddingWorld * 2, 0.2),
          1,
        ];
      }

      return {
        id: `${slotIndex}-${i}`,
        url: images[(slotIndex * IMAGE_COUNT_PER_CHUNK + i) % images.length],
        position,
        rotation,
        scale,
      };
    });
  }, [images, slotIndex, viewport.width]);

  return (
    <>
      {panels.map((panel) => (
        <Suspense key={panel.id} fallback={null}>
          <Image
            url={panel.url}
            position={panel.position}
            rotation={panel.rotation}
            scale={panel.scale}
            toneMapped={false}
          />
        </Suspense>
      ))}
    </>
  );
}

function TunnelChunk({ images, slotIndex }) {
  const group = useRef();
  const { camera } = useThree();

  const initialZ = TUNNEL_START_Z - slotIndex * TUNNEL_DEPTH;
  const totalLoopDepth = TUNNEL_DEPTH * VISIBLE_CHUNKS;

  useFrame(() => {
    if (!group.current) return;

    const chunk = group.current;
    const cameraZ = camera.position.z;

    // Keep each chunk positioned near the camera using a stable wrap calculation.
    // This avoids visible "pops" when a chunk is recycled.
    const loops = Math.round((cameraZ - initialZ) / totalLoopDepth);
    const nextZ = initialZ + loops * totalLoopDepth;

    // Only apply when it meaningfully changes to avoid tiny float churn.
    if (Math.abs(chunk.position.z - nextZ) > 0.0001) {
      chunk.position.z = nextZ;
    }
  });

  return (
    <group ref={group} position={[0, 0, initialZ]}>
      <GridChunkContent />
      <ImageChunkContent images={images} slotIndex={slotIndex} />
    </group>
  );
}

function InfiniteTunnelWorld({ images }) {
  const chunks = useMemo(() => {
    return Array.from({ length: VISIBLE_CHUNKS }, (_, i) => i);
  }, []);

  return (
    <>
      {chunks.map((slotIndex) => (
        <TunnelChunk key={slotIndex} images={images} slotIndex={slotIndex} />
      ))}
    </>
  );
}

function InfiniteScrollCamera() {
  const { camera } = useThree();
  const targetZ = useRef(CAMERA_START_Z);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    const preventPageScroll = (event) => {
      event.preventDefault();

      // Accumulate velocity for a smoother inertial scroll feel.
      scrollVelocity.current += -event.deltaY * SCROLL_SPEED;
      scrollVelocity.current = THREE.MathUtils.clamp(
        scrollVelocity.current,
        -MAX_SCROLL_VELOCITY,
        MAX_SCROLL_VELOCITY
      );

      if (targetZ.current > CAMERA_START_Z) {
        targetZ.current = CAMERA_START_Z;
      }
    };

    window.addEventListener("wheel", preventPageScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventPageScroll);
    };
  }, []);

  useFrame((_, delta) => {
    camera.position.x = 0;
    camera.position.y = 0;

    // Decay velocity so the tunnel eases out after scrolling stops.
    const damping = Math.exp(-SCROLL_DAMPING * delta);
    scrollVelocity.current *= damping;

    // Integrate velocity into the target.
    targetZ.current += scrollVelocity.current;

    // Clamp start (no "pulling" past the start).
    if (targetZ.current > CAMERA_START_Z) {
      targetZ.current = CAMERA_START_Z;
      scrollVelocity.current = 0;
    }

    // Frame-rate independent follow lerp.
    const follow = 1 - Math.exp(-CAMERA_FOLLOW * delta);
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ.current,
      follow
    );

    camera.lookAt(0, 0, camera.position.z - 12);
  });

  return null;
}

function Scene({ images }) {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 22, 92]} />

      <ambientLight intensity={2.4} />

      <InfiniteScrollCamera />
      <InfiniteTunnelWorld images={images} />
    </>
  );
}

function Header() {
  return (
    <header className="pointer-events-auto absolute left-0 top-0 z-20 flex w-full items-center justify-between px-8 py-7 md:px-14">
      <div className="flex items-center gap-2 text-xl font-bold text-black">
        <span className="text-2xl leading-none">⌘</span>
        <span>Hyperiux</span>
      </div>

      <nav className="hidden items-center gap-10 text-base font-semibold text-slate-600 md:flex">
        <a href="#use-cases" className="transition hover:text-black">
          Use Cases
        </a>
        <a href="#discover" className="transition hover:text-black">
          Discover
        </a>
        <a href="#about" className="transition hover:text-black">
          About
        </a>
      </nav>

      <button
        type="button"
        className="rounded-full bg-black px-7 py-4 text-base font-bold text-white"
      >
        Get started now →
      </button>
    </header>
  );
}

function HeroContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
      <div className="mt-16 max-w-[30vw] text-center">
        <h1 className="text-[10vw] font-medium leading-[0.7]! tracking-[-0.08em] text-black">
          Clone yourself.
        </h1>

        <p className="mx-auto mt-15 max-w-[60vw] text-[1.5vw] font-medium leading-tight text-neutral-600">
          Build the digital version of you to scale your expertise and
          availability,
          <span className="text-[#ff5f00]"> infinitely</span>
        </p>

        <div className="pointer-events-auto mt-10 flex items-center justify-center gap-8">
          <button
            type="button"
            className="rounded-full bg-black px-10 py-3 text-lg font-bold text-white"
          >
            Try now
          </button>

          <button type="button" className="text-lg font-bold text-black">
            See examples →
          </button>
        </div>
      </div>
    </div>
  );
}

function FooterMark() {
  return (
    <div className="pointer-events-none absolute bottom-6 right-6 z-20 text-xs font-medium text-neutral-400">
      © 2026 Hyperiux.
    </div>
  );
}

export default function InfiniteGridTunnel({ images = [] }) {
  const fallbackImages = [
    "/assets/img/image01.webp",
    "/assets/img/image02.webp",
    "/assets/img/image03.webp",
    "/assets/img/image04.png",
    "/assets/img/image05.png",

    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=900&auto=format&fit=crop",
  ];

  const imageList = images.length > 0 ? images : fallbackImages;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <Canvas
        camera={{
          position: [0, 0, CAMERA_START_Z],
          fov: 72,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          // Avoid a black flash on reload before the scene background is applied.
          gl.setClearColor("#ffffff", 1);
        }}
      >
        <Scene images={imageList} />
        <Preload all />
      </Canvas>

      <Header />
      <HeroContent /> 
      <FooterMark />
    </section>
  );
}
