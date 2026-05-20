"use client";

import VideoPlayer from"@/components/VideoPlayer/VideoPlayer";
import"./page.css";

export default function Page() {
 return (
 <section className="video-section">
 <div className="video-section__inner">
 {/* LEFT VIDEO */}
 <div className="video-section__video">
 <VideoPlayer
 videoSrc="/assets/videoplayer/video-player.mp4"
 poster="/assets/videoplayer/poster.png"
 autoPlay
 startMuted
 />
 </div>

 {/* RIGHT CONTENT */}
 <div className="video-section__content">
 <h2 className="video-section__heading">
 Experience Spaces That Redefine Urban Living
 </h2>

 <p className="video-section__paragraph">
 This project is not just about building homes, it is about crafting
 a lifestyle ecosystem where design, functionality, and long-term
 value seamlessly converge. Every element is engineered to elevate
 how modern urban living is experienced.
 </p>

 <ul className="video-section__list">
 <li>Strategically located within high-growth urban corridors</li>
 <li>Architecture designed for natural light and spatial openness</li>
 <li>Integrated lifestyle amenities for wellness and convenience</li>
 <li>Built with long-term durability and investment value in mind</li>
 </ul>
 </div>
 </div>
 </section>
 );
}