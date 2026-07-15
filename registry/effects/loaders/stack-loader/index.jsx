"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

const INTRO_EASE = "cubic-bezier(0.25,1,0.5,1)";
const IMAGE_ENTRY_Y_PERCENT = 500;
const TEXT_ROTATE_X_START = 90;
const TEXT_TRANSFORM_PERSPECTIVE = 1000;
const IMAGE_Z_INDEX_DURATION = 0.1;
const IMAGE_Z_INDEX_STAGGER = 0.2;
const TEXT_STAGGER = 0.08;
const STACK_SCALE_STEP = 0.15;
const STACK_Y_PERCENT_STEP = 20;
const SPREAD_Y_PERCENT_STEP = 110;
const IMAGE_FADE_STAGGER = 0.08;

const DEFAULT_IMAGE_SOURCES = [
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg",
];

const StackToSpreadIntro = forwardRef(function StackToSpreadIntro(
  { images = DEFAULT_IMAGE_SOURCES, onComplete },
  ref
) {
  const rootRef = useRef(null);
  const imagesRef = useRef([]);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const descriptionTextRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const imageElements = imagesRef.current.filter(Boolean);

      const text1 = SplitText.create(text1Ref.current, {
        type: "words",
      });

      const text2 = SplitText.create(text2Ref.current, {
        type: "words",
      });

      const descriptionText = SplitText.create(descriptionTextRef.current, {
        type: "words,lines",
      });

      const animatedTextTargets = [
        text1.words,
        text2.words,
        descriptionText.lines,
      ];

      gsap.set(animatedTextTargets, {
        rotateX: TEXT_ROTATE_X_START,
        opacity: 0,
        transformPerspective: TEXT_TRANSFORM_PERSPECTIVE,
        transformOrigin: "50% 100%",
        willChange: "transform",
      });

      gsap.set(imageElements, {
        opacity: 0,
      });

      gsap.set(descriptionTextRef.current, {
        opacity: 1,
      });

      const tl = gsap.timeline();

      tl.fromTo(
        "#imgs-wrapper",
        {
          yPercent: IMAGE_ENTRY_Y_PERCENT,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: INTRO_EASE,
        }
      );

      tl.set([text1Ref.current, text2Ref.current], { opacity: 1 }, "<");

      tl.to(
        imageElements,
        {
          opacity: 1,
          duration: 0.5,
          ease: INTRO_EASE,
        },
        "<"
      );

      tl.to(
        animatedTextTargets,
        {
          rotateX: 0,
          opacity: 1,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<+0.5"
      );

      

      imageElements.forEach((imageElement, index) => {
        tl.to(
          imageElement,
          {
            zIndex: index,
            duration: IMAGE_Z_INDEX_DURATION,
            ease: INTRO_EASE,
          },
          index * IMAGE_Z_INDEX_STAGGER
        );
      });

      

      tl.to(
        imageElements,
        {
          scale: (index) => 1 + index * STACK_SCALE_STEP,
          yPercent: (index) => -(index * STACK_Y_PERCENT_STEP),
          duration: 1,
          stagger: {
            each: 0.01,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "<"
      );

      
      tl.to(
        imageElements,
        {
          scale: 1,
          yPercent: (index, _, elements) => {
            const totalImages = elements.length;

            if (totalImages === 1) return 0;

            const totalSpread = SPREAD_Y_PERCENT_STEP * (totalImages - 1);

            return -totalSpread / 2 + index * SPREAD_Y_PERCENT_STEP;
          },
          duration: 1,
          stagger: {
            each: 0.01,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "+=0.2"
      );

      tl.to(
        descriptionText.lines,
        {
          rotateX: TEXT_ROTATE_X_START,
          transformOrigin: "top center",
          opacity: 0,
          duration: 1,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<-0.1"
      );


      tl.to(
        "#imgs-wrapper",
        {
          yPercent: 0,
          ease: INTRO_EASE,
        },
        "<"
      );

      tl.to([text1.words, text2.words], {
        opacity: 0,
        duration: 0.5,
        rotateX: TEXT_ROTATE_X_START,
        transformOrigin: "top center",
        stagger: TEXT_STAGGER,
        ease: INTRO_EASE,
      });

      tl.to(
        imageElements,
        {
          opacity: 0,
          duration: 0.8,
          stagger: {
            each: IMAGE_FADE_STAGGER,
            from: "end",
          },
          onComplete: () => {
            gsap.to(rootRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: INTRO_EASE,
              onComplete: () => {
                gsap.set(rootRef.current, {
                  display: "none",
                });

                onCompleteRef.current?.();
              },
            });
          },
        },
        "<+0.2"
      );

      return () => {
        text1.revert();
        text2.revert();
        descriptionText.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(element) => {
        rootRef.current = element;

        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      id="loader-wrapper"
      className="flex h-screen w-full items-center justify-center bg-[#FCFCFC] px-[2.5vw] text-black max-xl:px-[5vw] max-md:px-[6vw]"
    >
      <div className="flex w-full items-center justify-between max-xl:flex-col max-xl:justify-center max-xl:gap-[33vh] max-md:gap-[70vw]">
        <p
          ref={text1Ref}
          className="opacity-0 max-xl:text-[2.8vw] max-md:text-[5vw]"
        >
          HUMAN THINKERS
        </p>

        <div
          id="imgs-wrapper"
          className="relative size-[6.5vw] max-xl:z-99 max-xl:size-[13vw] max-md:size-[18vw]"
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              ref={(element) => {
                imagesRef.current[index] = element;
              }}
              className="absolute top-0 left-0 size-full overflow-hidden rounded-sm opacity-0"
            >
              <Image
                src={src}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                alt=""
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <p
          ref={text2Ref}
          className="opacity-0 max-xl:text-[2.8vw] max-md:text-[4vw]"
        >
          DIGITAL MAKERS
        </p>
      </div>

      <p
        ref={descriptionTextRef}
        className="absolute bottom-[3vw] left-1/2 w-[40vw] -translate-x-1/2 text-center leading-[1.1] text-black opacity-0 max-xl:bottom-[3vw] max-xl:w-[68vw] max-xl:text-[2.4vw] max-md:bottom-[6vw] max-md:w-[90%] max-md:text-[3.5vw]"
      >
        Hyperiux Vault
      </p>
    </section>
  );
});

export default function StackLoader({
  images = DEFAULT_IMAGE_SOURCES,
}) {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [introInstance, setIntroInstance] = useState(0);
  const stackToSpreadIntroRef = useRef(null);

  const handleLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
  }, []);

  const handleReplay = useCallback(() => {
    setIsLoaderComplete(false);
    setIntroInstance((currentInstance) => currentInstance + 1);
  }, []);

  return (
    <div
      id="DEMO UI"
      className="relative h-screen w-screen overflow-hidden bg-zinc-900"
    >
      <p
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-neutral-300 transition-opacity duration-300 text-center ${
          isLoaderComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        HYPERIUX VAULT
      </p>

     <button
  type="button"
  onClick={handleReplay}
  className={`absolute top-[calc(50%+4.5rem)] left-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-full border border-white/15 bg-white/5 px-5 py-2
    text-sm font-medium text-white backdrop-blur-md
    
    transition-all duration-300 cursor-pointer
    hover:scale-105 hover:border-white/30 hover:bg-white/10
    active:scale-95
    ${
      isLoaderComplete
        ? "opacity-100"
        : "pointer-events-none opacity-0"
    }`}
>
  ↻ Replay
</button>

      <StackToSpreadIntro
        key={introInstance}
        ref={stackToSpreadIntroRef}
        images={images}
        onComplete={handleLoaderComplete}
      />
    </div>
  );
}
