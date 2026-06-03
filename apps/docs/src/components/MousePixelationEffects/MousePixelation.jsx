"use client";

import PixelCircle from "./PixelCircle";
import PixelShift from "./PixelShift";
import EnhancedPixelCube from "./EnhancedPixelCube";

const VARIANTS = {
  "pixel-circle": PixelCircle,
  "pixel-shift": PixelShift,
  "enhanced-pixel-cube": EnhancedPixelCube,
};

export function MousePixelation({
  variant = "pixel-circle",
  imageUrl,
  ...props
}) {
  const Component = VARIANTS[variant] ?? PixelCircle;

  return <Component imageUrl={imageUrl} {...props} />;
}

export default MousePixelation;
export { PixelCircle, PixelShift, EnhancedPixelCube };
