// Built using Hyperiux Vault: https://vault.hyperiux.com
import EllipseCarouselComp, { type EllipseCarouselProps, type EllipseCarouselItem } from "./EllipseCarouselComp";

const defaultItems: EllipseCarouselItem[] = [
  { bgColor: "#f5f5f2", textColor: "#111111", title: "↑" },
  {
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&h=900&fit=crop",
    alt: "Coastal landscape painting",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=900&fit=crop",
    alt: "Studio portrait",
  },
  { bgColor: "#ffffff", textColor: "#111111", title: "M" },
  { bgColor: "#0a0a0a", textColor: "#ffffff", title: "⌒", subtitle: "Nike" },
  { bgColor: "#f2c94c", textColor: "#111111", title: "Parks" },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=900&fit=crop",
    alt: "Mountain range",
  },
  { bgColor: "#111111", textColor: "#ffffff", title: "Ext" },
  {
    src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=900&fit=crop",
    alt: "Night sky",
  },
  { bgColor: "#dd4b39", textColor: "#ffffff", title: "ÖH" },
  {
    src: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=900&fit=crop",
    alt: "Profile portrait",
  },
  { bgColor: "#2b3a67", textColor: "#ffffff", title: "SSSIII" },
];

export type { EllipseCarouselItem, EllipseCarouselProps };

const EllipseCarousel = ({
  items = defaultItems,
  centerLabel = "HYPERIUX",
  showCenterLabel = true,
  ...rest
}: EllipseCarouselProps) => {
  return (
    <EllipseCarouselComp
      items={items}
      centerLabel={centerLabel}
      showCenterLabel={showCenterLabel}
      {...rest}
    />
  );
};

export default EllipseCarousel;
