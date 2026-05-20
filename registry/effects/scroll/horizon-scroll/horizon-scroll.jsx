"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultItems = [
  {
    number: "01",
    title: "Burj Khalifa",
    image: "/assets/horizontal-section/horizontal-img-1.png",
    paragraphs: [
      "Burj Khalifa represents the highest standard of luxury living in Dubai, combining iconic architecture and unmatched skyline views.",
      "From premium residences to a location at the heart of Downtown Dubai, it delivers an address defined by exclusivity and long-term value.",
    ],
  },
  {
    number: "02",
    title: "Palm Jumeirah",
    image: "/assets/horizontal-section/horizontal-img-2.png",
    paragraphs: [
      "Palm Jumeirah is one of Dubai's most sought-after waterfront destinations, known for private beachfront residences.",
      "The location offers a rare combination of luxury, privacy, and international appeal.",
    ],
  },
  {
    number: "03",
    title: "Dubai Marina",
    image: "/assets/horizontal-section/horizontal-img-3.png",
    paragraphs: [
      "Dubai Marina offers a dynamic urban waterfront experience with high-rise luxury apartments and vibrant retail.",
      "Its rental demand and lifestyle positioning make it compelling for investors and residents alike.",
    ],
  },
];

export function HorizonScroll({ items = defaultItems, className = "" }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth <= 1024) return;

      gsap.to(".horizon-scroll__track", {
        xPercent: -79,
        ease: "none",
        scrollTrigger: {
          trigger: "#horizon-scroll",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      document.querySelectorAll(".horizon-scroll__card").forEach((card) => {
        const image = card.querySelector(".horizon-scroll__image");
        const number = card.querySelector(".horizon-scroll__number");
        const title = card.querySelector(".horizon-scroll__title");
        const paragraphs = card.querySelectorAll(".horizon-scroll__paragraph");

        gsap.from([number, title, ...paragraphs], {
          yPercent: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: ScrollTrigger.getById("horizon-scroll-track"),
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });

        if (image) {
          gsap.to(image, {
            xPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="horizon-scroll" className={`relative h-[600vh] w-screen overflow-hidden bg-white text-black ${className}`}>
      <div className="sticky top-0 flex h-screen w-screen items-center overflow-hidden max-md:static max-md:h-fit max-md:flex-col max-md:px-[7vw] max-md:py-[15%]">
        <div className="horizon-scroll__track flex w-fit flex-nowrap gap-[15vw] max-md:w-full max-md:flex-col max-md:gap-[10vw]">
          {items.map((item, index) => (
            <div key={index} className="horizon-scroll__card flex h-screen w-[80vw] gap-[5vw] max-md:h-fit max-md:w-full max-md:flex-col-reverse">
              <div className="h-[100vh] w-[40vw] overflow-hidden max-md:h-[80vw] max-md:w-full max-md:rounded-[2vw] max-sm:h-[110vw] max-sm:rounded-[4vw]">
                <img src={item.image} alt={item.title} className="horizon-scroll__image h-full w-full scale-[1.4] object-cover max-md:scale-100" />
              </div>
              <div className="flex w-[60%] flex-col gap-[5vh] pt-[7%] max-md:w-full max-md:gap-[4vw]">
                <p className="horizon-scroll__number text-[6em] font-medium leading-none max-md:text-[10vw]">{item.number}</p>
                <div className="flex w-full flex-col gap-[4vh] max-sm:gap-[7vw]">
                  <h3 className="horizon-scroll__title text-[4em] leading-[1.05] max-md:text-[7.5vw] max-sm:text-[9vw]">{item.title}</h3>
                  <div className="flex flex-col gap-[1.5vw] max-md:text-[2.5vw] max-sm:text-[4.2vw]">
                    {item.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className="horizon-scroll__paragraph">
                        {paragraph}
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

export default HorizonScroll;
