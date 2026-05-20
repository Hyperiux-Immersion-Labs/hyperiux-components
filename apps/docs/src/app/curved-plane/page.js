import CurvedImageSwiper from "@/components/CurvedPlane/CurvedSwiperHorizontal";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import React from "react";

export default function v1() {
  const routes = [
    { href: "/curved-plane/demo/v1", children: "V1" },
    { href: "/curved-plane/demo/v2", children: "V2" },
  ];
  return (
    <>
        <LenisSmoothScroll />
        <CurvedImageSwiper />
    </>
  );
}
