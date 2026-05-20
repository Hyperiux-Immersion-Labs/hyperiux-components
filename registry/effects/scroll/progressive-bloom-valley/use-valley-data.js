import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

function clampVal(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

const SPRITE_COLS = 8;
const SPRITE_ROWS = 7;

function smoothNoise(x, z, scale = 0.2) {
  return (
    (Math.sin(x * scale) * 0.5 +
      Math.sin(z * scale * 1.3) * 0.5 +
      Math.sin((x + z) * scale * 0.7) * 0.5) *
      0.5 +
    0.5
  );
}

function extractCameraPath(gltf) {
  if (!gltf) return fallbackCurve();

  if (gltf.animations?.length > 0) {
    const clip = gltf.animations[0];
    const posTrack = clip.tracks.find((t) => t.name.includes("position"));

    if (posTrack && posTrack.values.length >= 6) {
      const pts = [];
      for (let i = 0; i < posTrack.values.length; i += 3) {
        pts.push(
          new THREE.Vector3(
            posTrack.values[i],
            posTrack.values[i + 1],
            posTrack.values[i + 2]
          )
        );
      }
      const filtered = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        if (pts[i].distanceTo(filtered[filtered.length - 1]) > 0.01) {
          filtered.push(pts[i]);
        }
      }
      if (filtered.length >= 2) return new THREE.CatmullRomCurve3(filtered);
    }
  }

  gltf.scene.updateWorldMatrix(true, true);
  const verts = [];
  gltf.scene.traverse((child) => {
    if (child.geometry?.attributes?.position) {
      const pos = child.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        v.applyMatrix4(child.matrixWorld);
        verts.push(v);
      }
    }
  });
  if (verts.length >= 2) return new THREE.CatmullRomCurve3(verts);

  return fallbackCurve();
}

function fallbackCurve() {
  return new THREE.CatmullRomCurve3(
    Array.from({ length: 80 }, (_, i) => {
      const t = i / 79;
      return new THREE.Vector3(
        Math.sin(t * Math.PI * 2) * 4,
        Math.sin(t * Math.PI) * 1.5,
        -i * 3
      );
    })
  );
}

function buildTerrainPixels(img) {
  if (!img?.width || !img?.height) return null;
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  return {
    data: ctx.getImageData(0, 0, img.width, img.height).data,
    w: img.width,
    h: img.height,
  };
}

function generateValleyFlowers(curve, terrain, config) {
  const baseCount = config.rows * config.perRow;
  const MAX = baseCount * 2;

  const positions = new Float32Array(MAX * 3);
  const colorCoords = new Float32Array(MAX * 2);
  const scales = new Float32Array(MAX);
  const seeds = new Float32Array(MAX);
  const growNoise = new Float32Array(MAX);

  const worldUp = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3();
  const localUp = new THREE.Vector3();

  const WIDTH = 5;
  const MIN_LAT = 0;
  const SLOPE = 0.7;

  let pIdx = 0;

  for (let row = 0; row < config.rows; row++) {
    const t = row / (config.rows - 1);
    const pt = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);

    right.crossVectors(tan, worldUp);
    if (right.lengthSq() < 0.0001) right.set(1, 0, 0);
    right.normalize();
    localUp.crossVectors(right, tan).normalize();

    for (let f = 0; f < config.perRow; f++) {
      const side = f < config.perRow / 2 ? -1 : 1;

      const rawLat = Math.pow(Math.random(), 0.6);
      const lat = (MIN_LAT + rawLat * (WIDTH - MIN_LAT)) * side;
      const absLat = Math.abs(lat);
      const slopeH = absLat * SLOPE;

      let tMod = 1;
      if (terrain?.data) {
        const tx = clampVal(Math.floor(t * (terrain.w - 1)), 0, terrain.w - 1);
        const tv = clampVal(
          Math.floor(((lat + WIDTH) / (2 * WIDTH)) * (terrain.h - 1)),
          0,
          terrain.h - 1
        );
        tMod = terrain.data[(tv * terrain.w + tx) * 4] / 255;
      }

      const yOff = (Math.random() - 0.3) * 1.2 * tMod;
      const zOff = (Math.random() - 0.5) * 2.5;
      const h = slopeH + yOff;

      const px = pt.x + right.x * lat + localUp.x * h + tan.x * zOff;
      const py = pt.y + right.y * lat + localUp.y * h + tan.y * zOff;
      const pz = pt.z + right.z * lat + localUp.z * h + tan.z * zOff;

      const distFactor = clampVal(absLat / 1.5, 0.2, 1);
      const baseScale =
        (config.minScale + Math.random() * config.maxScaleRandom) *
        distFactor *
        config.globalScale;
      const baseSeed = Math.random();
      const baseGrow = 0.3 + Math.random() * 0.7;

      // Grass layer
      positions[pIdx * 3] = px;
      positions[pIdx * 3 + 1] = py;
      positions[pIdx * 3 + 2] = pz;

      const grassRow = 1 + Math.floor(Math.random() * 2);
      let grassCol = Math.floor(Math.random() * SPRITE_COLS);
      if (grassRow === 2 && (grassCol === 5 || grassCol === 6)) {
        grassCol = Math.floor(Math.random() * 5);
      }

      colorCoords[pIdx * 2] = (grassCol + 0.5) / SPRITE_COLS;
      colorCoords[pIdx * 2 + 1] = (grassRow + 0.5) / SPRITE_ROWS;

      scales[pIdx] = baseScale * (config.grassScaleMult ?? 0.8);
      seeds[pIdx] = baseSeed;
      growNoise[pIdx] = baseGrow;

      pIdx++;

      // Flower overlay
      const FLOWER_THRESHOLD = config.flowerThreshold ?? 0.82;
      const FLOWER_DENSITY = config.flowerDensity ?? 0.25;
      const flowerNoise = smoothNoise(px, pz, config.patchScale || 0.15);

      if (flowerNoise > FLOWER_THRESHOLD && Math.random() < FLOWER_DENSITY) {
        positions[pIdx * 3] = px;
        positions[pIdx * 3 + 1] = py + (config.flowerYOffset ?? -0.02);
        positions[pIdx * 3 + 2] = pz;

        const colorNoise = smoothNoise(px + 100, pz - 50, 0.3);
        let fRow;
        if (colorNoise < 0.25) fRow = 3;
        else if (colorNoise < 0.5) fRow = 4;
        else if (colorNoise < 0.75) fRow = 5;
        else fRow = 6;

        let fCol = Math.floor(Math.random() * SPRITE_COLS);
        if (fRow === 4 && fCol === 7) fCol = 0;
        if (fRow === 6 && fCol >= 6) fCol = 0;

        colorCoords[pIdx * 2] = (fCol + 0.5) / SPRITE_COLS;
        colorCoords[pIdx * 2 + 1] = (fRow + 0.5) / SPRITE_ROWS;

        scales[pIdx] = baseScale * (config.flowerScaleMult ?? 1.4);
        seeds[pIdx] = baseSeed + 0.1;
        growNoise[pIdx] = baseGrow;

        pIdx++;
      }
    }
  }

  return {
    positions: positions.slice(0, pIdx * 3),
    colorCoords: colorCoords.slice(0, pIdx * 2),
    scales: scales.slice(0, pIdx),
    seeds: seeds.slice(0, pIdx),
    growNoise: growNoise.slice(0, pIdx),
    count: pIdx,
  };
}

export default function useValleyData(gltf, terrainTex, config) {
  const [terrain, setTerrain] = useState(null);

  const curve = useMemo(() => {
    if (!gltf) return null;
    return extractCameraPath(gltf);
  }, [gltf]);

  useEffect(() => {
    const img = terrainTex?.image;
    if (!img) return;
    const built = buildTerrainPixels(img);
    if (built) setTerrain(built);
  }, [terrainTex]);

  const flowers = useMemo(() => {
    if (!curve || !terrain || !config) return null;
    return generateValleyFlowers(curve, terrain, config);
  }, [curve, terrain, config]);

  const pathOffset = useMemo(() => {
    if (!curve) return [0, 0, 0];
    const start = curve.getPointAt(0);
    const end = curve.getPointAt(0.999);
    return [end.x - start.x, end.y - start.y, end.z - start.z];
  }, [curve]);

  return { curve, terrain, flowers, pathOffset };
}
