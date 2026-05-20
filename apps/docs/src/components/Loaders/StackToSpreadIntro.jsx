"use client";

import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

export default function StackToSpreadIntro() {
  const rootRef = useRef(null);
  const imagesRef = useRef([]);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const descriptionTextRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const imgs = imagesRef.current;

      // 🔥 SplitText
      const text1 = SplitText.create(text1Ref.current, { type: "words" });
      const text2 = SplitText.create(text2Ref.current, { type: "words" });
      const descriptionText = SplitText.create(descriptionTextRef.current, {
        type: "words lines",
      });

      // 🔥 Initial state
      gsap.set([text1.words, text2.words, descriptionText.lines], {
        rotateX: 90,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 100%",
        willChange: "transform",
      });

      const tl = gsap.timeline({});

      // 🚀 ENTRY
      tl.fromTo(
        "#imgs-wrapper",
        { yPercent: 500 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: "cubic-bezier(0.25,1,0.5,1)",
        },
      );

      tl.to(
        [text1.words, text2.words, descriptionText.lines],
        {
          rotateX: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "cubic-bezier(0.25,1,0.5,1)",
        },
        "<+0.5",
      );

      // 🟡 CHAOS Z-INDEX
      imgs.forEach((img, i) => {
        tl.to(
          img,
          {
            zIndex: i,
            duration: 0.1,
            ease: "cubic-bezier(0.25,1,0.5,1)",
          },
          i * 0.2,
        );
      }, "<");

      // 🔻 TEXT OUT
      tl.to(
        descriptionText.lines,
        {
          rotateX: 90,
          transformOrigin: "top center",
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "cubic-bezier(0.25,1,0.5,1)",
        },
        "<+0.2",
      );

      // 🟢 STACK
      tl.to(
        imgs,
        {
          scale: (i) => 1 + i * 0.15,
          yPercent: (i) => -(i * 20),
          duration: 1,
          stagger: {
            each: 0.01,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "<",
      );

      // tl.to(
      //"#imgs-wrapper",
      // {
      // yPercent: 50,
      // duration: .5,
      // ease:"power2.inOut"
      // },
      //"<"
      // )

      // 🔵 SPREAD (centered)
      tl.to(
        imgs,
        {
          scale: 1,
          yPercent: (i, _, arr) => {
            const n = arr.length;
            if (n === 1) return 0;
            const totalSpread = 110 * (n - 1);
            return -totalSpread / 2 + i * 110;
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
          ease: "cubic-bezier(0.25,1,0.5,1)",
        },
        "<",
      );

      // 🔻 TEXT OUT FINAL
      tl.to([text1.words, text2.words], {
        opacity: 0,
        duration: 0.5,
        rotateX: 90,
        transformOrigin: "top center",
        stagger: 0.08,
        ease: "cubic-bezier(0.25,1,0.5,1)",
      });

      // 🧨 FADE OUT IMAGES
      tl.to(
        imgs,
        {
          opacity: 0,
          duration: 0.8,
          stagger: {
            each: 0.08,
            from: "end",
          },
          // ease:"cubic-bezier(0.25,1,0.5,1)",
          onComplete: () => {
            gsap.to(rootRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: "cubic-bezier(0.25,1,0.5,1)",
              onComplete: () => {
                gsap.set(rootRef.current, { display: "none" });
              },
            });
          },
        },
        "<+0.2",
      );

      // 🔚 LOADER REMOVE

      // 🧹 CLEANUP SplitText
      return () => {
        text1.revert();
        text2.revert();
        descriptionText.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

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
      className="bg-[#FCFCFC] text-black px-[2.5vw] h-screen flex items-center justify-center w-full"
    >
      <div className="w-full flex items-center max-md:flex-col max-md:gap-[10vw] justify-between">
        <p ref={text1Ref}>HUMAN THINKERS</p>

        <div id="imgs-wrapper" className="relative max-md:z-99 max-md:size-[20vw] size-[6.5vw]">
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

        <p ref={text2Ref} className="">DIGITAL MAKERS</p>
      </div>

      <p
        ref={descriptionTextRef}
        className="absolute bottom-[3vw] max-md:w-[76%] leading-[1.1] left-1/2 -translate-x-1/2 text-black w-[40vw] text-center"
      >
        A multi-awarded interactive digital studio crafting <br className="max-md:hidden" />
        immersive & interactive experiences for global brands since 2006.
      </p>
    </section>
  );
}
