// Built using Hyperiux Vault: https://vault.hyperiux.com
import OrbitFlipSliderComp from './OrbitFlipSliderComp';

interface OrbitFlipSliderItem {
  id?: string | number;
  image: string;
  alt?: string;
}

interface OrbitFlipSliderProps {
  items?: OrbitFlipSliderItem[];

  backgroundColor?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageGap?: number;
  rounded?: string;
  enableHoverMovement?: boolean;
  hoverMoveY?: number;
  perspectiveRotateValue?: number;
  perspectiveRotateDirection?: "left" | "right";
  rotate?: boolean;
  rotateSpeed?: number;
  stopRotationOnHover?: boolean;
  flatRadiusX?: number;
  flatRadiusY?: number;
  flatScale?: number;
  ringRotateX?: number;
  ringRotateY?: number;
  ringRotateZ?: number;
  ringRadiusX?: number;
  ringRadiusY?: number;
  ringScale?: number;
  tiltRotateX?: number;
  tiltRotateY?: number;
  tiltRotateZ?: number;
  tiltRadiusX?: number;
  tiltRadiusY?: number;
  tiltScale?: number;
  tiltMoveY?: number;
  galleryRotateX?: number;
  galleryRotateY?: number;
  galleryRotateZ?: number;
  galleryRadiusX?: number;
  galleryRadiusY?: number;
  galleryScale?: number;
}

const defaultItems: OrbitFlipSliderItem[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  image: `https://picsum.photos/seed/orbit-flip-slider-${i}/400/500`,
  alt: `Selected work ${i + 1}`,
}));

const OrbitFlipSlider = ({
  items = defaultItems,

  backgroundColor = "#e9e9ea",
  imageWidth = 140,
  imageHeight = 200,
  imageGap = 0,
  rounded = "rounded-none",
  enableHoverMovement = true,
  hoverMoveY = -8,
  perspectiveRotateValue = 75,
  perspectiveRotateDirection = "right",
  rotate = true,
  rotateSpeed = 4,
  stopRotationOnHover = true,
  flatRadiusX = 1,
  flatRadiusY = 1,
  flatScale = 1,
  ringRotateX = 31,
  ringRotateY = 56,
  ringRotateZ = -25,
  ringRadiusX = 1.5,
  ringRadiusY = 0.65,
  ringScale = 0.6,
  tiltRotateX = 70,
  tiltRotateY = 0,
  tiltRotateZ = 0,
  tiltRadiusX = 1.2,
  tiltRadiusY = 1,
  tiltScale = 1,
  tiltMoveY = 325,
  galleryRotateX = 10,
  galleryRotateY = 0,
  galleryRotateZ = 0,
  galleryRadiusX = 1,
  galleryRadiusY = 1,
  galleryScale = 1,
}: OrbitFlipSliderProps) => {
  return (
    <OrbitFlipSliderComp
      items={items}

      backgroundColor={backgroundColor}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageGap={imageGap}
      rounded={rounded}
      enableHoverMovement={enableHoverMovement}
      hoverMoveY={hoverMoveY}
      perspectiveRotateValue={perspectiveRotateValue}
      perspectiveRotateDirection={perspectiveRotateDirection}
      rotate={rotate}
      rotateSpeed={rotateSpeed}
      stopRotationOnHover={stopRotationOnHover}
      flatRadiusX={flatRadiusX}
      flatRadiusY={flatRadiusY}
      flatScale={flatScale}
      ringRotateX={ringRotateX}
      ringRotateY={ringRotateY}
      ringRotateZ={ringRotateZ}
      ringRadiusX={ringRadiusX}
      ringRadiusY={ringRadiusY}
      ringScale={ringScale}
      tiltRotateX={tiltRotateX}
      tiltRotateY={tiltRotateY}
      tiltRotateZ={tiltRotateZ}
      tiltRadiusX={tiltRadiusX}
      tiltRadiusY={tiltRadiusY}
      tiltScale={tiltScale}
      tiltMoveY={tiltMoveY}
      galleryRotateX={galleryRotateX}
      galleryRotateY={galleryRotateY}
      galleryRotateZ={galleryRotateZ}
      galleryRadiusX={galleryRadiusX}
      galleryRadiusY={galleryRadiusY}
      galleryScale={galleryScale}
    />
  );
};

export default OrbitFlipSlider;
