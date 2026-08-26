// Built using Hyperiux Vault: https://vault.hyperiux.com
import ArcFlowCarouselComp, {
  type ArcFlowCarouselCompProps,
  type SmoothSliderItem,
} from "./ArcFlowCarouselComp";

const defaultItems: SmoothSliderItem[] = [
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-10.jpg",
    alt: "Editorial portrait",
    title: "Editorial Portrait",
    description: "Soft-focus studio portrait with a quiet, print-like color grade.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-11.jpg",
    alt: "Studio still life",
    title: "Studio Still Life",
    description: "A minimal composition built around light falloff and glassy texture.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-12.jpg",
    alt: "Type poster",
    title: "Type Poster",
    description: "Poster exploration balancing negative space, blur, and sharp letterforms.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-13.jpg",
    alt: "Product campaign",
    title: "Product Campaign",
    description: "Commercial visual with polished highlights and a restrained luxury tone.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-14.jpg",
    alt: "Landscape study",
    title: "Landscape Study",
    description: "Atmospheric frame capturing motion, depth, and a misty horizon line.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-15.jpg",
    alt: "Motion frame",
    title: "Motion Frame",
    description: "A cinematic still chosen for its sweeping blur and directional energy.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-22.jpg",
    alt: "Brand artwork",
    title: "Brand Artwork",
    description: "Graphic composition designed to feel tactile, glossy, and dimensional.",
  },
  {
    src: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-23.jpg",
    alt: "Cover art",
    title: "Cover Art",
    description: "A cover-style visual with sculptural forms and a cool editorial palette.",
  },
];

export type { SmoothSliderItem };

export default function ArcFlowCarousel({ items = defaultItems, ...rest }: ArcFlowCarouselCompProps) {
  return <ArcFlowCarouselComp items={items} {...rest} />;
}
