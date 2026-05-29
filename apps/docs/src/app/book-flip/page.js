import { BookFlipViewer } from"@/components/BookFlip/BookFlipViewer";
import { degToRad } from"three/src/math/MathUtils";

// Image array for the book pages
const BOOK_IMAGES = [
"nature01",
"nature02",
"nature03",
"nature04",
"nature05",
"nature06",
"nature07",
"nature08",
"nature09",
"nature10",
"nature11",
"nature12",
"nature13",
"nature14",
];

export default function BookFlipPage() {
 return (
 <BookFlipViewer
 images={BOOK_IMAGES}
 pathPattern="/assets/nature"
 bgColor="#000000"
 cameraDistance={{
 mobile: 9,
 desktop: 4,
 }}
 floatConfig={{
 rotation_x: -Math.PI / 4,
  floatIntensity: 1,
 speed: 2,
 rotationIntensity: 2,
 }}
 showUI={true}
 />
 );
}