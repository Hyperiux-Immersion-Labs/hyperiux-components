import CurvedSwiperVertical from "@/components/CurvedPlane/CurvedSwiperVertical";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import React from "react";

export default function v2() {
  const routes = [
    { href: "/curved-plane/demo/v1", label: "V1" },
    { href: "/curved-plane/demo/v2", label: "V2" },
  ];

  return (
    <>
      <LenisSmoothScroll />
        <CurvedSwiperVertical routes={routes} />
    </>
  );
}
