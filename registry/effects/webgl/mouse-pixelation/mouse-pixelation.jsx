"use client";
import PixelCircle from "./pixel-circle";
import PixelShift from "./pixel-shift";
import EnhancedPixelCube from "./enhanced-pixel-cube";

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

  if (Component === PixelShift) {
    return <Component img={imageUrl} {...props} />;
  }

  return <Component {...props} />;
}

export default MousePixelation;
export { PixelCircle, PixelShift, EnhancedPixelCube };
