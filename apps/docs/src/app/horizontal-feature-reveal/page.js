import HorizontalScroll from "@/components/HorizontalScrollSection/HorizontalScroll";
import React from "react";
import { ReactLenis } from "lenis/react";


const PROPERTIES_DATA = [
  {
    number: "01",
    imgClass: "img-1",
    no: "1",
    titleClass: "property-title-1",
    contentClass: "property-content-1",
    title: "Burj Khalifa",
    image: "/assets/horizontal-section/horizontal-img-1.png",
    paragraphs: [
      "Burj Khalifa represents the highest standard of luxury living in Dubai, combining iconic architecture, unmatched skyline views, and an address that carries global prestige.",
      "From ultra-premium residences to a location at the heart of Downtown Dubai, the property offers immediate access to luxury retail, fine dining, and a lifestyle defined by exclusivity, convenience, and long-term value.",
    ],
    triggers: {
      img: { start: "-10% top", end: "10% top" },
      no: { start: "-1% top", end: "5% top" },
      title: { start: "-1% top", end: "5% top" },
      content: { start: "-1% top", end: "5% top" },
    },
  },
  {
    number: "02",
    imgClass: "img-2",
    no: "2",
    titleClass: "property-title-2",
    contentClass: "property-content-2",
    title: "Palm Jumeirah",
    image: "/assets/horizontal-section/horizontal-img-2.png",
    paragraphs: [
      "Palm Jumeirah is one of Dubai’s most sought-after waterfront destinations, known for its private beachfront residences, resort-style environment, and exceptional coastal views.",
      "Whether for end-use or investment, the location offers a rare combination of luxury, privacy, and international appeal, making it one of the strongest lifestyle-led property assets in the region.",
    ],
    triggers: {
      img: { start: "-5% top", end: "35% top" },
      no: { start: "18% top", end: "23% top" },
      title: { start: "18% top", end: "23% top" },
      content: { start: "18% top", end: "23% top" },
    },
  },
  {
    number: "03",
    imgClass: "img-3",
    no: "3",
    titleClass: "property-title-3",
    contentClass: "property-content-3",
    title: "Dubai Marina",
    image: "/assets/horizontal-section/horizontal-img-3.png",
    paragraphs: [
      "Dubai Marina offers a dynamic urban waterfront experience, blending high-rise luxury apartments with vibrant retail, dining, and leisure experiences in one connected district.",
      "Its strong rental demand, premium lifestyle positioning, and consistent desirability make Dubai Marina a compelling option for both investors and residents seeking modern city living.",
    ],
    triggers: {
      img: { start: "25% top", end: "65% top" },
      no: { start: "45% top", end: "50% top" },
      title: { start: "45% top", end: "50% top" },
      content: { start: "45% top", end: "50% top" },
    },
  },
  {
    number: "04",
    imgClass: "img-4",
    no: "4",
    titleClass: "property-title-4",
    contentClass: "property-content-4",
    title: "Dubai Creek Harbour",
    image: "/assets/horizontal-section/horizontal-img-4.png",
    paragraphs: [
      "Dubai Creek Harbour is emerging as one of the city’s most future-ready residential destinations, offering refined waterfront living with a strong focus on design, accessibility, and long-term growth.",
      "With its master-planned ecosystem, premium residences, and strong development vision, the district is positioned as a next-generation address for buyers seeking both lifestyle and appreciation potential.",
    ],
    triggers: {
      img: { start: "45% top", end: "85% top" },
      no: { start: "65% top", end: "70% top" },
      title: { start: "65% top", end: "70% top" },
      content: { start: "65% top", end: "70% top" },
    },
  },
];



const Page = () => {
  return (
    <ReactLenis root>
      <div>
        <HorizontalScroll propertiesData={PROPERTIES_DATA} />
      </div>
    </ReactLenis>
  );
};

export default Page;
