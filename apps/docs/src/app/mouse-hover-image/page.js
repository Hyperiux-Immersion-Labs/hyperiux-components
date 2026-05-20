import ImagesAnimation from "@/components/MouseHoverAnim/ImagesAnimation";
import React from "react";

const page = () => {
    return (
        <div className="w-screen h-screen relative z-999 bg-[#f8fdfe]">
            <div className="absolute w-full h-full flex justify-center items-center">
                <h1 className="text-[5.5vw] text-stone-800">
                    Move the Mouse to See Magic
                </h1>
            </div>
            <ImagesAnimation
                enableRotation={true}
                idleSpawn={true}
                idleDelay={300}
                cursorOffsetX={-12}
                cursorOffsetY={-12}
                popOutDuration={0.8}
                fadeOutDuration={0.5}
                idlePopOutMultiplier={2.2}
                idleFadeMultiplier={1.8}
                imageMultiplier={3}
            />
        </div>
    );
};

export default page;
