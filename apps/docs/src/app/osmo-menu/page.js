import React from "react";
import { OsmoMenuDesktop } from "../../components/osmo-nav/OsmoMenuDesktop";
import { OsmoMenuMobile } from "../../components/osmo-nav/OsmoMenuMobile";

export default function Page() {
    return (
        <div className="h-screen w-full bg-primary relative overflow-hidden">
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[4vw] md:text-[2vw] tracking-tight text-center w-full">
                HYPERIUX NAVIGATION
            </p>
            
            <OsmoMenuDesktop />
            <OsmoMenuMobile />
        </div>
    );
}
