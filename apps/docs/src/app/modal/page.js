"use client";

import DotScaleFillCharBtn from "@/components/Buttons/PrimaryButtons/DotBgFillPrimaryBtn/DotBgFillPrimaryBtn";
import Modal from "@/components/Modal/Modal";
import ScrollablePopupContent from "@/components/ScrollablePopupContent/ScrollablePopupContent";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { useState } from "react";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";

const popupSections = [
  {
    heading: "Project Overview",
    paragraph:
      "This development is envisioned as a premium mixed-use destination, combining residential comfort, retail convenience, and elevated lifestyle experiences in one cohesive ecosystem.",
    list: [
      "Prime urban location with excellent access",
      "Integrated amenities for work, wellness, and leisure",
      "Architecture focused on long-term livability",
    ],
  },
  {
    heading: "Design Philosophy",
    paragraph:
      "Every detail has been planned to create an experience that feels contemporary, intuitive, and timeless. The emphasis is on spatial openness, natural light, and refined materials.",
    list: [
      "Open-plan living concepts",
      "Daylight-first spatial planning",
      "Contemporary material palette",
    ],
  },
  {
    heading: "Investment Potential",
    paragraph:
      "With strong connectivity, growing infrastructure, and a carefully positioned offering, the project is designed to appeal to both end-users and long-term investors seeking sustained value.",
    list: [
      "High-demand micro-market",
      "Future-forward development strategy",
      "Strong long-term appreciation potential",
    ],
  },
  {
    heading: "Lifestyle Experience",
    paragraph:
      "The experience extends beyond residences, offering amenities and shared spaces that promote wellness, community, and a more balanced urban lifestyle.",
    list: [
      "Curated leisure and wellness zones",
      "Community-first shared spaces",
      "Elevated everyday convenience",
    ],
  },
];

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);

  return (
    <>
      <LenisSmoothScroll />

      <section
        className="
          relative flex w-screen  bg-white py-[2%]
          max-md:py-[12%]
          max-sm:pt-[18%] h-screen overflow-hidden max-sm:pb-[16%]
        "
      >
        <div
          className="
            flex h-screen w-full flex-col items-center justify-center gap-[3vw]
            max-md:gap-[6vw]
            max-sm:gap-[10vw]
          "
        >
          <h1
            className="
              text-center font-medium leading-none text-[#111111]
              text-[4.5vw]
              max-md:text-[7vw]
              max-sm:text-[11vw]
            "
          >
            Play The Video
          </h1>

          <div
            className="
              relative overflow-hidden bg-[#e5e5e5]
              w-[50vw] h-[50vh] rounded-[1vw]
              max-md:w-[88vw] max-md:h-[58vh] max-md:rounded-[2vw]
              max-sm:w-[94vw] max-sm:h-[36vh] max-sm:rounded-[4vw]
            "
          >
            <img
              src="/assets/videoplayer/poster.png"
              alt="Video thumbnail"
              className="block h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open video"
              className="group absolute inset-0 flex items-center justify-center border-0 bg-transparent cursor-pointer"
            >
              <span
                className="
                  flex items-center justify-center rounded-full
                  bg-black/20 text-white backdrop-blur-[18px]
                  transition-all duration-300
                  w-[4vw] h-[4vw] text-[1.2vw]
                  group-hover:scale-[1.06]
                  group-hover:bg-black/30

                  max-md:w-[8vw]
                  max-md:h-[8vw]
                  max-md:text-[2.2vw]

                  max-sm:w-[16vw]
                  max-sm:h-[16vw]
                  max-sm:text-[4.5vw]
                "
              >
                ▶
              </span>
            </button>
          </div>

          <DotScaleFillCharBtn
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsContentOpen(true);
            }}
            btnText="Open a Modal"
            bgColor="#ff6b00"
            textColor="#000000"
            fillColor="#000000"
            hoverTextColor="#ff6b00"
          />

          <Modal
            className="h-full backdrop-blur-none "
            isOpen={isContentOpen}
            onClose={() => setIsContentOpen(false)}
          >
            <ScrollablePopupContent
              title="A Deeper Look at the Project"
              subtitle="Explore the thinking, design strategy, and long-term value proposition behind the development."
              sections={popupSections}
            />
          </Modal>
        </div>
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseButton={false}
      >
        <VideoPlayer
          videoSrc="/assets/videoplayer/video-player.mp4"
          poster="/assets/videoplayer/poster.png"
          onRequestClose={() => setIsOpen(false)}
          showCloseButton
          autoPlay
          startMuted
          isActive={isOpen}
        />
      </Modal>
    </>
  );
}