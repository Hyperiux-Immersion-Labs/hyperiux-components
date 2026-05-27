"use client";
import React from"react";
import Hero from"@/components/ScrollRigComponents/Hero";
import UseVideoWebGLTexture from"@/components/ScrollRigComponents/Utils/UseVideoWebGLTexture";
import UseWebGLText from"@/components/ScrollRigComponents/Utils/UseWebGLText";

export const HtmlComponent = () => {
 const fontUrl ="/giestsans.ttf";
 return (
 <>
 <Hero fontUrl={fontUrl} />
 <div className="h-screen relative flex items-center justify-center w-full">
 <div className="w-[50vw] absolute top-[55%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg h-auto saturate-20">
 <UseVideoWebGLTexture
 src="https://www.shutterstock.com/shutterstock/videos/3699962291/preview/stock-footage-player-entering-futuristic-city-level-in-sci-fi-video-game-shooter-shooter-computer-game-animation.webm"
 trackedWrapperClassName="w-full h-full"
 videoClassName="w-full h-full object-cover"
 showDomVideo={false}
 key="intro"
 />
 </div>
 <UseWebGLText font={fontUrl} className="text-[25vw] text-center leading-none absolute top-[30%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2">GAMING</UseWebGLText>
 <UseWebGLText font={fontUrl} className="text-[3vw] text-center leading-none absolute bottom-[5%] left-1/2 z-10 w-full -translate-x-1/2">WORKS ON IMAGES, TEXT, VIDEOS AND MORE.</UseWebGLText>
 </div>
 </>
 );
};

export default HtmlComponent;