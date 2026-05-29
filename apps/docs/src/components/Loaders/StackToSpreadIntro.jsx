"use client";

import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

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

gsap.registerPlugin(SplitText);

export default function StackToSpreadIntro() {
  // State and refs
  const rootRef = useRef(null);
  const imagesRef = useRef([]);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const descriptionTextRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animation targets
      const imageElements = imagesRef.current;

      // Split text
      const text1 = SplitText.create(text1Ref.current, { type: "words" });
      const text2 = SplitText.create(text2Ref.current, { type: "words" });
      const descriptionText = SplitText.create(descriptionTextRef.current, {
        type: "words lines",
      });
      const animatedTextTargets = [text1.words, text2.words, descriptionText.lines];

      // Initial state
      gsap.set(animatedTextTargets, {
        rotateX: TEXT_ROTATE_X_START,
        opacity: 0,
        transformPerspective: TEXT_TRANSFORM_PERSPECTIVE,
        transformOrigin: "50% 100%",
        willChange: "transform",
      });
      gsap.set(descriptionTextRef.current, { opacity: 1 });

      const tl = gsap.timeline({});

      // Entry
      tl.fromTo(
        "#imgs-wrapper",
        { yPercent: IMAGE_ENTRY_Y_PERCENT },
        {
          yPercent: 0,
          duration: 0.5,
          ease: INTRO_EASE,
        },
      );

      tl.to(
        animatedTextTargets,
        {
          rotateX: 0,
          opacity: 1,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<+0.5",
      );

      // Image layering
      imageElements.forEach((imageElement, index) => {
        tl.to(
          imageElement,
          {
            zIndex: index,
            duration: IMAGE_Z_INDEX_DURATION,
            ease: INTRO_EASE,
          },
          index * IMAGE_Z_INDEX_STAGGER,
        );
      }, "<");

      // Description exit
      tl.to(
        descriptionText.lines,
        {
          rotateX: TEXT_ROTATE_X_START,
          transformOrigin: "top center",
          opacity: 0,
          duration: 0.5,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<+0.2",
      );

      // Stack images
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
        "<",
      );

      // Spread images
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
        "+=0.2",
      );

      tl.to(
        "#imgs-wrapper",
        {
          yPercent: 0,
          ease: INTRO_EASE,
        },
        "<",
      );

      // Heading exit
      tl.to([text1.words, text2.words], {
        opacity: 0,
        duration: 0.5,
        rotateX: TEXT_ROTATE_X_START,
        transformOrigin: "top center",
        stagger: TEXT_STAGGER,
        ease: INTRO_EASE,
      });

      // Loader exit
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
                gsap.set(rootRef.current, { display: "none" });
              },
            });
          },
        },
        "<+0.2",
      );

      // Cleanup
      return () => {
        text1.revert();
        text2.revert();
        descriptionText.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Derived values
  const imgSources = [
    "/assets/img/image01.webp",
    "/assets/img/image07.png",
    "/assets/img/image04.png",
    "/assets/img/image05.png",
    "/assets/img/image10.jpg",
    "/assets/img/distortion.jpg",
    "/img/mobile.png",
  ];

  return (
    <section
      ref={rootRef}
      id="loader-wrapper"
      className="bg-[#FCFCFC] text-black px-[2.5vw] max-md:px-[5vw] max-sm:px-[6vw] h-screen flex items-center justify-center w-full"
    >
      <div className="w-full flex items-center justify-between max-md:flex-col max-md:justify-center max-md:gap-[33vh] max-sm:gap-[70vw]">
        <p ref={text1Ref} className="max-md:text-[2.8vw] max-sm:text-[5vw]">
          HUMAN THINKERS
        </p>

        <div
          id="imgs-wrapper"
          className="relative size-[6.5vw] max-md:z-99 max-md:size-[13vw] max-sm:size-[18vw]"
        >
          {imgSources.map((src, i) => (
            <div
              key={i}
              ref={(el) => (imagesRef.current[i] = el)}
              className="absolute top-0 left-0 rounded-sm  size-full overflow-hidden"
            >
              <Image
                src={src}
                width={1000}
                height={1000}
                className="h-full w-full  object-cover"
                alt=""
              />
            </div>
          ))}
        </div>

        <p ref={text2Ref} className="max-md:text-[2.8vw] max-sm:text-[4vw]">
          DIGITAL MAKERS
        </p>
      </div>

      <p
        ref={descriptionTextRef}
        className="absolute bottom-[3vw] left-1/2 w-[40vw] -translate-x-1/2 text-center leading-[1.1] text-black opacity-0 max-md:bottom-[3vw] max-md:w-[68vw] max-md:text-[2.4vw] max-sm:bottom-[6vw] max-sm:w-[90%] max-sm:text-[3.5vw]"
      >
        A multi-awarded interactive digital studio crafting
        immersive & interactive experiences for global brands since 2006.
      </p>
    </section>
  );
}
