import Tabs from"@/components/Tabs/Tabs";
import"./page.css";
import CharStaggerPrimaryBtn from"@/components/Buttons/PrimaryButtons/CharStaggerPrimaryBtn/CharStaggerPrimaryBtn";

const tabsData = [
 {
 id:"overview",
 label:"Overview",
 content: (
 <div className="tab-card tab-card--overview">
 <h2 className="tab-card__title">Luxury Living Redefined</h2>

 <p className="tab-card__text">
 Discover a new standard of modern living designed for those who value
 precision, comfort, and architectural excellence.
 </p>

 <div className="tab-card__grid">
 <div className="tab-card__box">
 <h3>120+</h3>
 <p>Premium Units</p>
 </div>
 <div className="tab-card__box">
 <h3>5★</h3>
 <p>Amenities</p>
 </div>
 <div className="tab-card__box">
 <h3>24/7</h3>
 <p>Concierge</p>
 </div>
 </div>
 </div>
 ),
 },

 {
 id:"features",
 label:"Features",
 content: (
 <div className="tab-card tab-card--features">
 <h2 className="tab-card__title">Everything You Expect. And More.</h2>

 <div className="tab-card__features">
 <div className="feature-item">
 <h4>Smart Home Integration</h4>
 <p>
 Control lighting, security, and climate with a single interface.
 </p>
 </div>

 <div className="feature-item">
 <h4>Infinity Pool & Spa</h4>
 <p>
 Designed for relaxation with panoramic views and private access.
 </p>
 </div>

 <div className="feature-item">
 <h4>Co-working Spaces</h4>
 <p>Built for modern professionals who work and live seamlessly.</p>
 </div>

 <div className="feature-item">
 <h4>High-Speed Connectivity</h4>
 <p>
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
 <div className="tab-card tab-card--contact">
 <h2 className="tab-card__title">Let’s Build Something Together</h2>

 <p className="tab-card__text">
 Reach out to explore availability, pricing, or partnership
 opportunities.
 </p>

 <div className="tab-card__contact">
 <div>
 <p>Email</p>
 <span>hello@yourcompany.com</span>
 </div>

 <div>
 <p>Phone</p>
 <span>+91 98765 43210</span>
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
 <section className="tabs-page">
 <Tabs tabs={tabsData} />
 </section>
 );
}
