"use client";

import DotScaleFillCharBtn from "@/components/Buttons/PrimaryButtons/DotBgFillPrimaryBtn/DotBgFillPrimaryBtn";
import Modal from "@/components/Modal/Modal";
import ScrollablePopupContent from "@/components/ScrollablePopupContent/ScrollablePopupContent";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { useState } from "react";
import "./page.css";

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
            <section className="video-demo-page__hero">
                <div className="video-demo-page__hero-inner">
                    <h1 className="video-demo-page__title">Play The Video</h1>

                    <div className="video-demo-page__poster-card">
                        <img
                            src="/assets/videoplayer/poster.png"
                            alt="Video thumbnail"
                            className="video-demo-page__poster-image"
                        />

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="video-demo-page__poster-trigger"
                            aria-label="Open video"
                        >
                            <span className="video-demo-page__poster-play">▶</span>
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

                    <Modal className="h-full backdrop-blur-none" isOpen={isContentOpen} onClose={() => setIsContentOpen(false)}>
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