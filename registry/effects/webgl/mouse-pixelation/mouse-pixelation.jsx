/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

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

  return <Component imageUrl={imageUrl} {...props} />;
}

export default MousePixelation;
export { PixelCircle, PixelShift, EnhancedPixelCube };
