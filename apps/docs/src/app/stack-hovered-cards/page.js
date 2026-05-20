import StackedHoverCards from"@/components/StackHoverCards/StackedHoverCards";
import React from"react";
// import StackedHoverCards from"./StackedHoverCards";

const cards = [
 {
 id: 1,
 quote:"A must-have for anyone looking to save time and boost productivity.",
 tag:"Efficiency",
 bg:"#E4FF1A",
 accent:"text-[#1A1A1A]",
 },
 {
 id: 2,
 quote:"This tech has completely streamlined my daily tasks.",
 tag:"Workflow",
 bg:"#DD1155",
 accent:"text-[#ffffff]",
 },
 {
 id: 3,
 quote:"Innovative and powerful, yet so easy to use!",
 tag:"Simplicity",
 bg:"#FF5714",
 accent:"text-[#1A1A1A]",
 },
 {
 id: 4,
 quote:"It made everything smoother. Highly recommend!",
 tag:"Reliability",
 bg:"#E980FC",
 accent:"text-[#1A1A1A]",
 },
 {
 id: 5,
 quote:"Fast, reliable, and user-friendly. Exactly what I needed.",
 tag:"Speed",
 bg:"#67D6A3",
 accent:"text-[#1A1A1A]",
 },
 {
 id: 6,
 quote:"I can’t imagine my workflow without it now. Simply amazing!",
 tag:"Impact",
 bg:"#3454D1",
 accent:"text-[#ffffff]",
 },
 {
 id: 7,
 quote:"Performance is a game changer. So much smoother now.",
 tag:"Performance",
 bg:"#B98CFF",
 accent:"text-[#1A1A1A]",
 },
];

const TestimonialsSection = () => {
 return (
 <section className="w-full h-fit bg-[#fff9ec] py-[10%] overflow-hidden flex flex-col gap-[7vw] justify-center items-center">
 <h1 className="text-[#1a1a1a] text-[5.5vw]">
 Stack Hovered Cards
 </h1>

 <StackedHoverCards
 cards={cards}
 cardWidth={280}
 cardHeight={360}
 overlap={96}
 pushDistance={235}
 hoverLift={30}
 />
 </section>
 );
};

export default TestimonialsSection;
