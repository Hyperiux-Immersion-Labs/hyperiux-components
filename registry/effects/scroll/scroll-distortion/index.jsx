"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

const ImageDistortionVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ImageDistortionFragment = `
  uniform sampler2D u_texture0;
  uniform sampler2D u_texture1;
  uniform sampler2D u_displacement;
  uniform float u_progress;
  uniform float u_strength;
  uniform float u_rgbShift;
  uniform float u_scale;
  uniform vec2 u_resolution;
  uniform vec2 u_textureResolution0;
  uniform vec2 u_textureResolution1;

  varying vec2 vUv;

  vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
    float scale = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
    vec2 newSize = texRes * scale;
    return uv * (planeRes / newSize) + (newSize - planeRes) / 2.0 / newSize;
  }

  void main() {
    float disp = texture2D(u_displacement, vUv).r;

    disp = mix(
      disp,
      disp * (sin(vUv.y * 10.0 + u_progress * 6.28) * 0.5 + 0.5),
      0.3
    );

    vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
    vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

    float scaleEffect = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
    vec2 center = vec2(0.5);

    vec2 distortedUV0 =
      (uv0 - center) / scaleEffect +
      center +
      u_progress * disp * u_strength * vec2(1.0, 0.5);

    vec2 distortedUV1 =
      (uv1 - center) * scaleEffect +
      center -
      (1.0 - u_progress) * disp * u_strength * vec2(1.0, 0.5);

    float rgbOffset = u_progress * (1.0 - u_progress) * u_rgbShift;

    vec4 tex0 = vec4(
      texture2D(u_texture0, distortedUV0 + vec2(rgbOffset, 0.0)).r,
      texture2D(u_texture0, distortedUV0).g,
      texture2D(u_texture0, distortedUV0 - vec2(rgbOffset, 0.0)).b,
      texture2D(u_texture0, distortedUV0).a
    );

    vec4 tex1 = vec4(
      texture2D(u_texture1, distortedUV1 + vec2(rgbOffset, 0.0)).r,
      texture2D(u_texture1, distortedUV1).g,
      texture2D(u_texture1, distortedUV1 - vec2(rgbOffset, 0.0)).b,
      texture2D(u_texture1, distortedUV1).a
    );

    gl_FragColor = mix(tex0, tex1, smoothstep(0.0, 1.0, u_progress));
  }
`;

const DEFAULT_SECTIONS = [
  {
    text: "SHADOW",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg",
  },
  {
    text: "FLOWER",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-03.jpg",
  },
  {
    text: "RUN",
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-05.jpg",
  },
];

const DEFAULT_SHADER_CONFIG = {
  strength: 0.8,
  rgbShift: 0.05,
  scale: 0.15,
  transitionDuration: 1.25,
  transitionEase: "power3.inOut",
};

const MAX_PIXEL_RATIO = 2;
const WHEEL_THRESHOLD = 75;
const TOUCH_THRESHOLD = 45;
const TEXT_STAGGER = 0.035;
const TEXT_DURATION = 0.7;

function resolveImageSource(source) {
  if (typeof source === "string") return source;
  if (source?.src) return source.src;

  return source;
}

function loadCorsObjectUrl(source) {
  const imageSource = resolveImageSource(source);

  if (!imageSource) {
    return Promise.reject(new Error("A valid image URL is required."));
  }

  return fetch(imageSource, {
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Image request failed with ${response.status}`);
      }

      return response.blob();
    })
    .then((blob) => URL.createObjectURL(blob))
    .catch((error) => {
      throw new Error(
        `Unable to load scroll distortion texture: ${imageSource}. Current origin is ${window.location.origin}. Make sure R2 allows this exact origin. ${error?.message || ""}`
      );
    });
}

export default function ScrollDistortion({
  sections = DEFAULT_SECTIONS,
  shaderConfig = {},
  displacementSrc = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/distortion-noise.jpg",
}) {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const textRefs = useRef([]);
  const [objectUrls, setObjectUrls] = useState(null);
  const [decodedUrls, setDecodedUrls] = useState(() => new Set());

  const currentIndexRef = useRef(0);
  const targetIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const touchStartYRef = useRef(null);

  const splitSections = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      chars: section.text.split(""),
    }));
  }, [sections]);

  useEffect(() => {
    let isCancelled = false;
    let nextObjectUrls = [];

    Promise.all([
      ...sections.map((section) => loadCorsObjectUrl(section.src)),
      loadCorsObjectUrl(displacementSrc),
    ])
      .then((urls) => {
        nextObjectUrls = urls;

        if (!isCancelled) {
          setObjectUrls(urls);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.warn(error?.message || error);
        }
      });

    return () => {
      isCancelled = true;
      nextObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [displacementSrc, sections]);

  const areImagesDecoded =
    objectUrls?.length === sections.length + 1 &&
    objectUrls.every((url) => decodedUrls.has(url));

  const markImageDecoded = (url) => {
    if (!url) return;

    setDecodedUrls((currentUrls) => {
      if (currentUrls.has(url)) return currentUrls;

      const nextUrls = new Set(currentUrls);
      nextUrls.add(url);

      return nextUrls;
    });
  };

  useEffect(() => {
     gsap.set(".text-container",{
        opacity: 1,
      })

    const containerElement = containerRef.current;

    if (!containerElement || sections.length === 0 || !areImagesDecoded) {
      return undefined;
    }

    const config = {
      ...DEFAULT_SHADER_CONFIG,
      ...shaderConfig,
    };

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -1,
      1
    );

    const geometry = new THREE.PlaneGeometry(width, height);

    const textures = imageRefs.current
      .slice(0, sections.length)
      .filter(Boolean)
      .map(createTextureFromImage);

    const displacementImage = imageRefs.current[sections.length];

    if (textures.length === 0 || !displacementImage) {
      geometry.dispose();
      renderer.dispose();
      return undefined;
    }

    const displacementTexture = createTextureFromImage(displacementImage);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

    containerElement.replaceChildren(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_texture0: {
          value: textures[0],
        },
        u_texture1: {
          value: textures[0],
        },
        u_displacement: {
          value: displacementTexture,
        },
        u_progress: {
          value: 0,
        },
        u_resolution: {
          value: new THREE.Vector2(width, height),
        },
        u_textureResolution0: {
          value: new THREE.Vector2(1, 1),
        },
        u_textureResolution1: {
          value: new THREE.Vector2(1, 1),
        },
        u_strength: {
          value: config.strength,
        },
        u_rgbShift: {
          value: config.rgbShift,
        },
        u_scale: {
          value: config.scale,
        },
      },
      vertexShader: ImageDistortionVertex,
      fragmentShader: ImageDistortionFragment,
      transparent: true,
    });

    const setTextureResolution = (uniformIndex, texture) => {
      if (!texture?.image) return;

      material.uniforms[`u_textureResolution${uniformIndex}`].value.set(
        texture.image.width,
        texture.image.height
      );
    };

    setTextureResolution(0, textures[0]);
    setTextureResolution(1, textures[0]);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    gsap.set(textRefs.current[0], {
      yPercent: 0,
      autoAlpha: 1,
    });

    textRefs.current.forEach((chars, index) => {
      if (index === 0) return;

      gsap.set(chars, {
        yPercent: 100,
        autoAlpha: 0,
      });
    });

    const animateTextTransition = (fromIndex, toIndex, direction) => {
      const fromChars = textRefs.current[fromIndex] || [];
      const toChars = textRefs.current[toIndex] || [];

      gsap.killTweensOf([...fromChars, ...toChars]);

      const outgoingY = direction > 0 ? -100 : 100;
      const incomingY = direction > 0 ? 100 : -100;

      gsap.set(toChars, {
        yPercent: incomingY,
        autoAlpha: 0,
      });
     
      const timeline = gsap.timeline();

      timeline.to(
        fromChars,
        {
          yPercent: outgoingY,
          autoAlpha: 0,
          duration: TEXT_DURATION,
          stagger: TEXT_STAGGER,
          ease: "power3.inOut",
        },
        0
      );

      timeline.to(
        toChars,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: TEXT_DURATION,
          stagger: TEXT_STAGGER,
          ease: "power3.inOut",
        },
        0.08
      );

      return timeline;
    };

    const transitionTo = (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= textures.length) {
        return;
      }

      const currentIndex = currentIndexRef.current;

      if (nextIndex === currentIndex) {
        return;
      }

      targetIndexRef.current = nextIndex;

      if (isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;

      const direction = nextIndex > currentIndex ? 1 : -1;

      material.uniforms.u_texture0.value = textures[currentIndex];
      material.uniforms.u_texture1.value = textures[nextIndex];

      setTextureResolution(0, textures[currentIndex]);
      setTextureResolution(1, textures[nextIndex]);

      material.uniforms.u_progress.value = 0;

      animateTextTransition(currentIndex, nextIndex, direction);

      gsap.to(material.uniforms.u_progress, {
        value: 1,
        duration: config.transitionDuration,
        ease: config.transitionEase,
        overwrite: true,
        onComplete: () => {
          material.uniforms.u_texture0.value = textures[nextIndex];
          setTextureResolution(0, textures[nextIndex]);
          material.uniforms.u_progress.value = 0;

          currentIndexRef.current = nextIndex;
          isTransitioningRef.current = false;

          if (targetIndexRef.current !== currentIndexRef.current) {
            transitionTo(targetIndexRef.current);
          }
        },
      });
    };

    const goNext = () => {
      const nextIndex = Math.min(
        currentIndexRef.current + 1,
        sections.length - 1
      );

      transitionTo(nextIndex);
    };

    const goPrev = () => {
      const nextIndex = Math.max(currentIndexRef.current - 1, 0);

      transitionTo(nextIndex);
    };

    const onWheel = (event) => {
      event.preventDefault();

      wheelDeltaRef.current += event.deltaY;

      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) {
        return;
      }

      if (wheelDeltaRef.current > 0) {
        goNext();
      } else {
        goPrev();
      }

      wheelDeltaRef.current = 0;
    };

    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (touchStartYRef.current === null) return;

      const currentY = event.touches[0].clientY;
      const delta = touchStartYRef.current - currentY;

      if (Math.abs(delta) < TOUCH_THRESHOLD) return;

      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }

      touchStartYRef.current = currentY;
    };

    const renderScene = () => {
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(renderScene);
    };

    let animationFrameId = 0;
    renderScene();

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;

      renderer.setSize(nextWidth, nextHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

      camera.left = -nextWidth / 2;
      camera.right = nextWidth / 2;
      camera.top = nextHeight / 2;
      camera.bottom = -nextHeight / 2;
      camera.updateProjectionMatrix();

      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(nextWidth, nextHeight);

      material.uniforms.u_resolution.value.set(nextWidth, nextHeight);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);

    const textRefGroups = textRefs.current;

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);

      window.cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(material.uniforms.u_progress);

      textRefGroups.forEach((chars) => {
        gsap.killTweensOf(chars);
      });

      scene.remove(mesh);
      mesh.geometry.dispose();
      material.dispose();
      displacementTexture.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      containerElement.replaceChildren();
    };
  }, [areImagesDecoded, displacementSrc, sections, shaderConfig]);

  return (
    <section className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <div className="hidden">
        {objectUrls?.slice(0, sections.length).map((url, index) => (
          <div key={`${resolveImageSource(sections[index]?.src)}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(element) => {
                imageRefs.current[index] = element;
                if (element?.complete && element.naturalWidth > 0) {
                  markImageDecoded(url);
                }
              }}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              src={url}
              onLoad={() => markImageDecoded(url)}
              alt=""
            />
          </div>
        ))}

        {objectUrls?.[sections.length] && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={(element) => {
              imageRefs.current[sections.length] = element;
              if (element?.complete && element.naturalWidth > 0) {
                markImageDecoded(objectUrls[sections.length]);
              }
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            src={objectUrls[sections.length]}
            onLoad={() => markImageDecoded(objectUrls[sections.length])}
            alt=""
          />
        )}
      </div>

      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-0 text-container">
        {splitSections.map((section, sectionIndex) => (
          <h1
            key={`${section.text}-${sectionIndex}`}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 overflow-hidden text-[10vw] leading-none text-white"
            aria-label={section.text}
          >
            {section.chars.map((char, charIndex) => (
              <span
                key={`${section.text}-${charIndex}`}
                ref={(element) => {
                  if (!textRefs.current[sectionIndex]) {
                    textRefs.current[sectionIndex] = [];
                  }

                  textRefs.current[sectionIndex][charIndex] = element;
                }}
                className="inline-block will-change-transform"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        ))}
      </div>
       
    </section>
  );
}

function createTextureFromImage(imageElement) {
  const texture = new THREE.Texture(imageElement);

  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}
