import LenisSmoothScroll from"@/components/SmoothScroll/LenisScroll";
import React from"react";

export default function layout({ children }) {
 return (
 <div>
 <LenisSmoothScroll />
 {children}
 </div>
 );
}
