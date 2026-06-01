import Tabs from"@/components/Tabs/Tabs";
import CharStaggerPrimaryBtn from"@/components/Buttons/PrimaryButtons/CharStaggerPrimaryBtn/CharStaggerPrimaryBtn";

const tabsData = [
 {
 id:"overview",
 label:"Overview",
 content: (
 <div className="h-full w-full rounded-[1.5vw] bg-[#fff4eb] p-[2vw] text-[#1a1a1a] max-md:rounded-[2.5vw] max-md:p-[4vw] max-sm:rounded-[4vw] max-sm:p-[5vw]">
 <h2 className="mb-[1vw] text-[2.2vw] leading-[1.1] font-medium max-md:mb-[2vw] max-md:text-[4.5vw] max-sm:mb-[3vw] max-sm:text-[7vw]">Luxury Living Redefined</h2>

 <p className="w-[70%] text-[1.1vw] leading-relaxed max-md:w-[90%] max-md:text-[2.2vw] max-sm:w-full max-sm:text-[4vw] max-sm:leading-[1.6]">
 Discover a new standard of modern living designed for those who value
 precision, comfort, and architectural excellence.
 </p>

 <div className="mt-[2vw] flex gap-[1.5vw] max-md:mt-[3vw] max-md:gap-[2.2vw] max-sm:mt-[5vw] max-sm:flex-col max-sm:gap-[3vw]">
 <div className="flex-1 rounded-[1vw] bg-black/4 p-[1.5vw] max-md:rounded-[1.8vw] max-md:p-[2.5vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h3 className="mb-[0.5vw] text-[2vw] leading-none font-semibold max-md:mb-[1vw] max-md:text-[3.8vw] max-sm:mb-[1.5vw] max-sm:text-[6vw]">120+</h3>
 <p className="text-[1vw] leading-[1.4] opacity-70 max-md:text-[1.9vw] max-sm:text-[3.7vw] max-sm:leading-relaxed">Premium Units</p>
 </div>
 <div className="flex-1 rounded-[1vw] bg-black/4 p-[1.5vw] max-md:rounded-[1.8vw] max-md:p-[2.5vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h3 className="mb-[0.5vw] text-[2vw] leading-none font-semibold max-md:mb-[1vw] max-md:text-[3.8vw] max-sm:mb-[1.5vw] max-sm:text-[6vw]">5★</h3>
 <p className="text-[1vw] leading-[1.4] opacity-70 max-md:text-[1.9vw] max-sm:text-[3.7vw] max-sm:leading-relaxed">Amenities</p>
 </div>
 <div className="flex-1 rounded-[1vw] bg-black/4 p-[1.5vw] max-md:rounded-[1.8vw] max-md:p-[2.5vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h3 className="mb-[0.5vw] text-[2vw] leading-none font-semibold max-md:mb-[1vw] max-md:text-[3.8vw] max-sm:mb-[1.5vw] max-sm:text-[6vw]">24/7</h3>
 <p className="text-[1vw] leading-[1.4] opacity-70 max-md:text-[1.9vw] max-sm:text-[3.7vw] max-sm:leading-relaxed">Concierge</p>
 </div>
 </div>
 </div>
 ),
 },

 {
 id:"features",
 label:"Features",
 content: (
 <div className="h-full w-full rounded-[1.5vw] bg-[#eef7ff] p-[2vw] text-[#1a1a1a] max-md:rounded-[2.5vw] max-md:p-[4vw] max-sm:rounded-[4vw] max-sm:p-[5vw]">
 <h2 className="mb-[1vw] text-[2.2vw] leading-[1.1] font-medium max-md:mb-[2vw] max-md:text-[4.5vw] max-sm:mb-[3vw] max-sm:text-[7vw]">Everything You Expect. And More.</h2>

 <div className="mt-[2vw] grid grid-cols-2 gap-[1.5vw] max-md:mt-[3vw] max-md:gap-[2.2vw] max-sm:mt-[5vw] max-sm:grid-cols-1 max-sm:gap-[4vw]">
 <div className="rounded-[1vw] bg-black/3 p-[1.4vw] max-md:rounded-[1.8vw] max-md:p-[2.2vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h4 className="mb-[0.5vw] text-[1.3vw] leading-[1.2] font-medium max-md:mb-[1vw] max-md:text-[2.4vw] max-sm:mb-[1.5vw] max-sm:text-[4.5vw]">Smart Home Integration</h4>
 <p className="text-[1vw] leading-relaxed opacity-70 max-md:text-[1.9vw] max-sm:text-[3.8vw] max-sm:leading-[1.6]">
 Control lighting, security, and climate with a single interface.
 </p>
 </div>

 <div className="rounded-[1vw] bg-black/3 p-[1.4vw] max-md:rounded-[1.8vw] max-md:p-[2.2vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h4 className="mb-[0.5vw] text-[1.3vw] leading-[1.2] font-medium max-md:mb-[1vw] max-md:text-[2.4vw] max-sm:mb-[1.5vw] max-sm:text-[4.5vw]">Infinity Pool & Spa</h4>
 <p className="text-[1vw] leading-relaxed opacity-70 max-md:text-[1.9vw] max-sm:text-[3.8vw] max-sm:leading-[1.6]">
 Designed for relaxation with panoramic views and private access.
 </p>
 </div>

 <div className="rounded-[1vw] bg-black/3 p-[1.4vw] max-md:rounded-[1.8vw] max-md:p-[2.2vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h4 className="mb-[0.5vw] text-[1.3vw] leading-[1.2] font-medium max-md:mb-[1vw] max-md:text-[2.4vw] max-sm:mb-[1.5vw] max-sm:text-[4.5vw]">Co-working Spaces</h4>
 <p className="text-[1vw] leading-relaxed opacity-70 max-md:text-[1.9vw] max-sm:text-[3.8vw] max-sm:leading-[1.6]">Built for modern professionals who work and live seamlessly.</p>
 </div>

 <div className="rounded-[1vw] bg-black/3 p-[1.4vw] max-md:rounded-[1.8vw] max-md:p-[2.2vw] max-sm:rounded-[3vw] max-sm:p-[4vw]">
 <h4 className="mb-[0.5vw] text-[1.3vw] leading-[1.2] font-medium max-md:mb-[1vw] max-md:text-[2.4vw] max-sm:mb-[1.5vw] max-sm:text-[4.5vw]">High-Speed Connectivity</h4>
 <p className="text-[1vw] leading-relaxed opacity-70 max-md:text-[1.9vw] max-sm:text-[3.8vw] max-sm:leading-[1.6]">
 Enterprise-grade internet infrastructure for uninterrupted work.
 </p>
 </div>
 </div>
 </div>
 ),
 },

 {
 id:"contact",
 label:"Contact",
 content: (
 <div className="h-full w-full rounded-[1.5vw] bg-[#f5fbe8] p-[2vw] text-[#1a1a1a] max-md:rounded-[2.5vw] max-md:p-[4vw] max-sm:rounded-[4vw] max-sm:p-[5vw]">
 <h2 className="mb-[1vw] text-[2.2vw] leading-[1.1] font-medium max-md:mb-[2vw] max-md:text-[4.5vw] max-sm:mb-[3vw] max-sm:text-[7vw]">Let’s Build Something Together</h2>

 <p className="w-[70%] text-[1.1vw] leading-relaxed max-md:w-[90%] max-md:text-[2.2vw] max-sm:w-full max-sm:text-[4vw] max-sm:leading-[1.6]">
 Reach out to explore availability, pricing, or partnership
 opportunities.
 </p>

 <div className="mt-[2vw] mb-[3vw] flex gap-[3vw] max-md:mt-[3vw] max-md:gap-[5vw] max-sm:mt-[5vw] max-sm:flex-col max-sm:gap-[4vw]">
 <div className="flex flex-col gap-[0.3vw] max-md:gap-[0.7vw] max-sm:gap-[1vw]">
 <p className="text-[0.9vw] leading-[1.3] opacity-60 max-md:text-[1.7vw] max-sm:text-[3.4vw]">Email</p>
 <span className="text-[1.1vw] leading-[1.4] font-medium max-md:text-[2.1vw] max-sm:text-[4vw]">hello@yourcompany.com</span>
 </div>

 <div className="flex flex-col gap-[0.3vw] max-md:gap-[0.7vw] max-sm:gap-[1vw]">
 <p className="text-[0.9vw] leading-[1.3] opacity-60 max-md:text-[1.7vw] max-sm:text-[3.4vw]">Phone</p>
 <span className="text-[1.1vw] leading-[1.4] font-medium max-md:text-[2.1vw] max-sm:text-[4vw]">+91 98765 43210</span>
 </div>
 </div>

 <CharStaggerPrimaryBtn
 href="#"
 text=" Book a Visit"
 bgClassName="rounded-full bg-[#ff6b00]"
 className="text-[1.2vw] max-sm:text-[4.5vw] text-white"
 />

 </div>
 ),
 },
];

export default function Page() {
 return (
 <section className="min-h-screen w-full bg-white">
 <Tabs tabs={tabsData} />
 </section>
 );
}
