import StackingCard from'@/components/CardsStack/StackingCard';
import { ReactLenis } from'lenis/react'

export default function Page() {
 return (
 <>
 <ReactLenis root>
 <StackingCard data={categoriesData} />
  </ReactLenis>
 </>
 );
}

const categoriesData = [
  {
    id: "01",
    category: "Astronomy",
    title: "Black Holes, Deep Space, Cosmic Discoveries",
    backgroundColor: "bg-[#F7FFDC]",
    description:
      "Explore mysterious galaxies, collapsing stars, and the endless possibilities hidden across the universe.",
    image: "/assets/img/image01.webp",
  },
  {
    id: "02",
    category: "Architecture",
    title: "Modern Homes, Urban Design, Smart Structures",
    backgroundColor: "bg-[#D1F3F5]",
    description:
      "Discover innovative spaces blending sustainability, functionality, and futuristic design philosophies.",
    image: "/assets/img/image02.webp",
  },
  {
    id: "03",
    category: "Wildlife",
    title: "Rare Species, Nature Expeditions, Conservation",
    backgroundColor: "bg-[#DDD9FF]",
    description:
      "Dive into the natural world through breathtaking ecosystems and stories of survival in the wild.",
    image: "/assets/img/image03.webp",
  },
  {
    id: "04",
    category: "Music",
    title: "Electronic Beats, Indie Sounds, Global Rhythms",
    backgroundColor: "bg-[#FFDDCA]",
    description:
      "Experience evolving sound cultures, underground artists, and genre-defining musical experiments.",
    image: "/assets/img/image01.webp",
  },
  {
    id: "05",
    category: "Technology",
    title: "Robotics, Quantum Computing, Future Devices",
     backgroundColor:"bg-[#DDD9FF]",
    description:
      "Uncover emerging innovations shaping how humans interact with machines and digital ecosystems.",
    image: "/assets/img/image02.webp",
  },
  {
    id: "06",
    category: "Travel",
    title: "Hidden Cities, Scenic Routes, Cultural Journeys",
    backgroundColor: "bg-[#E4F5D4]",
    description:
      "Journey through breathtaking destinations, local traditions, and unforgettable travel experiences.",
    image: "/assets/img/image03.webp",
  },
];
