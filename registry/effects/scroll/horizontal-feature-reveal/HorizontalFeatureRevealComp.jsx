"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const defaultPropertiesData = [];

export default function HorizontalScrollComp({ propertiesData = defaultPropertiesData }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth <= 1025) return;

      gsap.set(
        ".industry-img, .industry-no, .industry-title, .industry-content",
        { opacity: 1 },
      );

      const head = document.querySelector(".industry-head");
      if (head) {
        const headSplit = new SplitText(head, { type: "chars" });

        gsap.from(headSplit.chars, {
          yPercent: () =>
            (Math.random() < 0.5 ? 1 : -1) * (200 * Math.random()),
          xPercent: () => 200 * Math.random(),
          stagger: 0.1,
          duration: 1,
          ease: "back.out",
          scrollTrigger: {
            trigger: "#industries",
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }

      gsap.to(".industry-container", {
        xPercent: -79,
        ease: "none",
        scrollTrigger: {
          trigger: "#industries",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          // markers: true,
        },
      });

      const cards = document.querySelectorAll(".industry-card");

      cards.forEach((card, i) => {
        const cfg = propertiesData[i]?.triggers || {};
        const startNo = cfg.no?.start || "top 70%";
        const endNo = cfg.no?.end || "top 40%";
        const startTitle = cfg.title?.start || "top 70%";
        const endTitle = cfg.title?.end || "top 40%";
        const startContent = cfg.content?.start || "top 70%";
        const endContent = cfg.content?.end || "top 40%";
        const startImg = cfg.img?.start || "top 70%";
        const endImg = cfg.img?.end || "top 40%";

        const noEl = card.querySelector(`[class*="industry-no-"]`);
        if (noEl) {
          const splitNo = new SplitText(noEl, {
            type: "chars,lines",
            mask: "lines",
          });

          gsap.from(splitNo.chars, {
            y: 150,
            rotate: 10,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#industries",
              start: startNo,
              end: endNo,
              toggleActions: "play none none reverse",
            },
          });
        }

        // FIXED: query property-title instead of industry-title
        const titleEl = card.querySelector(`[class*="property-title-"]`);
        if (titleEl) {
          const titleLines = new SplitText(titleEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.set(titleEl, { lineHeight: 1.2 });
          gsap.set(titleLines.lines, { lineHeight: 1.2 });

          gsap.from(titleLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#industries",
              start: startTitle,
              end: endTitle,
              // markers: true,
              toggleActions: "play none none reverse",
            },
          });
        }

        // FIXED: query property-content instead of industry-content
        const contentEls = card.querySelectorAll(`[class*="property-content-"]`);
        contentEls.forEach((contentEl) => {
          const contentLines = new SplitText(contentEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.from(contentLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            delay: 0.3,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#industries",
              start: startContent,
              end: endContent,
              toggleActions: "play none none reverse",
            },
          });
        });

        // this one was already okay, but keep it consistent
        const propertyImgs = card.querySelectorAll(`[class*="industry-img-"]`);
        propertyImgs.forEach((propertyImg) => {
          gsap.to(propertyImg, {
            translateX: "30%",
            ease: "none",
            scrollTrigger: {
              trigger: "#industries",
              start: startImg,
              end: endImg,
              scrub: true,
              // markers:true
            },
          });
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [propertiesData]);


  return (
    <section
      className="w-screen h-[600vh] bg-white text-black relative z-10 max-xl:mt-0 max-xl:h-fit max-xl:py-[15%] max-xl:px-[7vw]"
      id="industries"
    >
      
      <div className="w-screen  overflow-hidden h-screen justify-center items-center sticky top-0 max-xl:static max-xl:w-full max-xl:h-fit max-xl:flex max-xl:flex-col max-xl:items-start">

        
        <div className="flex flex-nowrap w-fit industry-container gap-[15vw] max-xl:flex-col max-xl:gap-[10vw] max-md:gap-[15vw]">
          {propertiesData.map((property, index) => (
            <div
              key={index}
              className="w-[80vw] h-screen flex gap-[5vw] industry-card max-xl:h-fit max-xl:flex-col-reverse max-xl:w-full"
            >
              <div className="w-[40vw] h-screen overflow-hidden max-md:h-[110vw] max-xl:w-full max-md:rounded-[4vw] max-xl:h-[80vw] max-xl:rounded-[2vw]">
                <img
                  src={property.image}
                  alt={`property-img-${index + 1}`}
                  className={`w-full h-full scale-[1.4] translate-x-[-30%] opacity-0 industry-img industry-${property.imgClass} max-xl:translate-x-0 max-xl:scale-[1] max-xl:object-cover max-xl:opacity-100`}
                  width={500}
                  height={1080}
                />
              </div>

              <div className="flex flex-col gap-[5vh] w-[60%] pt-[7%] max-md:pt-0 max-xl:w-full max-xl:gap-[4vw] max-md:gap-[7vw]">
                <p
                  className={`text-[6em] font-medium font-display text-secondary leading-none opacity-0 industry-no industry-no-${property.no} max-xl:text-[10vw] max-xl:opacity-100`}
                >
                  {property.number}
                </p>

                <div className="w-full h-fit flex flex-col gap-[4vh] max-md:gap-[7vw]">
                  <h3
                    className={`text-[4em] opacity-0 industry-title max-md:text-[9vw] max-xl:text-[7.5vw] max-xl:opacity-100 leading-[1.3] ${property.titleClass}`}
                  >
                    {property.title}
                  </h3>

                  <div className="space-y-[1.5vw] max-xl:text-[2.5vw] max-md:text-[4.2vw]">
                    {property.paragraphs.map((para, pIndex) => (
                      <p
                        key={pIndex}
                        className={`opacity-0 industry-content max-xl:opacity-100 ${property.contentClass}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
