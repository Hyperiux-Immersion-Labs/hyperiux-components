"use client"
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

const Page = () => {
  const splitRef = useRef({});
  const [isDisabled, setIsDisabled] = useState(false);

  const runAnimation = (delay = 0.2) => {
    const { splitText, split2, split3, split4 } = splitRef.current;
    if (!splitText) return;

    // Reset text positions before animation
    gsap.set(split2.chars, { yPercent: 100 });
    gsap.set(split4.chars, { yPercent: 100 });
    gsap.set(splitText.chars, { yPercent: 0 });
    gsap.set(split3.chars, { yPercent: 0 });

    gsap.to(splitText.chars, {
      delay: delay,
      yPercent: -100,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.025,
    });

    gsap.to(split3.chars, {
      delay: delay + 0.03,
      yPercent: -100,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.025,
    });

    gsap.to(split2.chars, {
      delay: delay + 0.2,
      yPercent: 0,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.025,
    });

    gsap.to(split4.chars, {
      delay: delay + 0.23,
      yPercent: 0,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.025,
    });
  };

  const handleReplay = () => {
    if (isDisabled) return;

    runAnimation();

    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 1800);
  };

  useEffect(() => {
    const splitText = new SplitText(".v2-text1", {
      type: "chars,lines",
      linesClass: "lines",
    });
    const split2 = new SplitText(".v2-text2", {
      type: "chars,lines",
      linesClass: "lines",
    });
    const split3 = new SplitText(".v2-text3", {
      type: "chars,lines",
      linesClass: "lines",
    });
    const split4 = new SplitText(".v2-text4", {
      type: "chars,lines",
      linesClass: "lines",
    });

    splitRef.current = { splitText, split2, split3, split4 };

    // Run once on page load
    runAnimation(2.5);

    return () => {
      splitText.revert();
      split2.revert();
      split3.revert();
      split4.revert();
    };
  }, []);


  return (
    <>
     
       
          <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#111111]">
            <div className="h-[8.2vw] text-white overflow-hidden relative w-full pl-[2vw]">
              <div className="relative h-[6vw] w-full overflow-hidden">
                <p className="text-[6.5vw] leading-[1] z-[4] text-nowrap tracking-tighter italic uppercase absolute top-0 left-[2vw]">
                  <span className="v2-text1 block">Engineering meets artistry</span>
                </p>
                <p className="text-[6.5vw] leading-[1] text-yellow-500 z-[2] text-nowrap tracking-tighter italic uppercase absolute top-0 left-[2vw]">
                  <span className="v2-text3 block">Engineering meets artistry</span>
                </p>
                <p className="text-[6.5vw] leading-[1] text-nowrap tracking-tighter italic uppercase absolute top-0 left-[2vw] z-[8]">
                  <span className="v2-text2 block">Engineering meets artistry</span>
                </p>
                <p className="text-[6.5vw] leading-[1] text-nowrap z-[6] tracking-tighter italic uppercase absolute top-0 left-[2vw] text-yellow-500">
                  <span className="v2-text4 block">Engineering meets artistry</span>
                </p>
              </div>
            </div>

            {/* Replay button */}
            <button
              onClick={handleReplay}
              disabled={isDisabled}
              className={`mt-10 px-6 py-3 font-bold rounded-lg  hover:scale-[0.95] transition-all duration-300 ease-linear ${isDisabled
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-black"
                }`}
            >
              {isDisabled ? "Please wait..." : "Replay Animation"}
            </button>
          </div>
    </>
  );
};

export default Page;
