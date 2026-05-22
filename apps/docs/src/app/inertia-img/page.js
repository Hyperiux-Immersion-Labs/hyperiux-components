import React from "react";
import InertiaImage from "@/components/InertiaImg/InertiaImg";

const images = [
    "/assets/without-bg/strawberry.png",
    "/assets/without-bg/honey-bee.png",
    "/assets/without-bg/kunai.png",
    "/assets/without-bg/earth.png",
    "/assets/without-bg/earth.png",
    "/assets/without-bg/fire.png",
    "/assets/without-bg/strawberry.png",
    "/assets/without-bg/star.png",
    "/assets/without-bg/kunai.png",
    "/assets/without-bg/star.png",
    "/assets/without-bg/honey-bee.png",
    "/assets/without-bg/fire.png",
];

const page = () => {
    return (
        <main className="h-screen overflow-hidden max-sm:min-h-screen max-sm:h-full max-sm:overflow-visible w-full bg-black px-6 py-12 text-white md:px-10">
            <div className="mx-auto flex w-full flex-col gap-14">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xl max-sm:text-2xl uppercase tracking-[0.35em] text-white/75">
                        Inertia Image
                    </p>
                    <p className="text-white/50 max-sm:mt-2 hidden max-sm:block max-sm:text-base max-sm:pt-2 max-sm:mx-6 max-sm:leading-[1.2] ">
                        Tap to try it.
                       <span className="block mt-2 w-50 mx-auto text-center">

                         Hover on desktop to see what it was truly made for.
                       </span>
                    </p>
                </div>

                <InertiaImage images={images} />
            </div>
        </main>
    );
};

export default page;
