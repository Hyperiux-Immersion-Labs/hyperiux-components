import React from "react";
import { ExpandingNavbarDesktop } from "../../components/osmo-nav/ExpandingNavbarDesktop";
import { ExpandingNavbarMobile } from "../../components/osmo-nav/ExpandingNavbarMobile";

export default function Page() {
    return (
        <div className="h-screen w-full bg-primary relative overflow-hidden">
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[4vw] md:text-[2vw] tracking-tight text-center w-full">
                HYPERIUX NAVIGATION
            </p>
            
            <ExpandingNavbarDesktop />
            <ExpandingNavbarMobile />
        </div>
    );
}
