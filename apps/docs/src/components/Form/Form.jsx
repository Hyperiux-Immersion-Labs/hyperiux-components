// components/ContactForm/Form.jsx
"use client";

/**
 * Page-level Contact section — drop-in replacement for the original Form.jsx.
 * All field definitions and the submit handler live HERE, keeping ContactForm pure.
 */

import React from"react";
import Link from"next/link";
import dynamic from"next/dynamic";

// UI icons (keep your existing SVG components)
import { Facebook, Insta, LinkedIn, Twitter, Youtube } from"../Svg/Icons";

// Animations (keep your existing wrappers)
import Copy from"../Animations/Copy";
import HeadingAnim from"../Animations/HeadingAnim";

// Lazy-load the reusable form
const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false });

// ─── Social links ─────────────────────────────────────────────────────────────

const socialLinks = [
 {
 name:"LinkedIn",
 icon: <LinkedIn />,
 url:"https://www.linkedin.com/company/data-science-wizards/",
 },
 {
 name:"Instagram",
 icon: <Insta />,
 url:"https://www.instagram.com/datasciencewizards/",
 },
 {
 name:"Facebook",
 icon: <Facebook />,
 url:"https://www.facebook.com/datasciencewizards/",
 },
 { name:"X", icon: <Twitter />, url:"https://x.com/dswizards" },
 {
 name:"YouTube",
 icon: <Youtube />,
 url:"https://www.youtube.com/@DataScienceWizards",
 },
];

// ─── Field definitions ────────────────────────────────────────────────────────

const CONTACT_FIELDS = [
 {
 type:"text",
 name:"name",
 label:"Name*",
 required: true,
 validate: (v) =>
 v.length < 3 ?"Name must be at least 3 characters." : undefined,
 },
 {
 type:"email",
 name:"email",
 label:"Business Email*",
 required: true,
 // You can add async validation via the `validate` prop if needed
 // validate: async (v) => { ... }
 },
 {
 type:"text",
 name:"designation",
 label:"Designation*",
 required: true,
 validate: (v) =>
 v.length < 2 ?"Designation is required." : undefined,
 },
 {
 type:"text",
 name:"company",
 label:"Company Name*",
 required: true,
 validate: (v) =>
 v.length < 2 ?"Company name is required." : undefined,
 },
 {
 type:"phone",
 name:"number",
 label:"Phone Number*",
 required: true,
 defaultCountry:"IN",
 },
 {
 type:"select",
 name:"reason",
 label:"Reason*",
 required: true,
 options: [
 { value:"support", label:"Support" },
 { value:"sales", label:"Sales Inquiry" },
 { value:"partnership", label:"Partnership" },
 { value:"feedback", label:"Feedback" },
 { value:"other", label:"Other" },
 ],
 },
 {
 type:"textarea",
 name:"message",
 label:"Message",
 required: false,
 rows: 5,
 },
 {
 type:"checkbox",
 name:"terms",
 required: true,
 label: (
 <>
 I agree to{""}
 <a
 href="/privacy-policy"
 className="border-b border-black/40 hover:border-orange-500 duration-300 transition-all"
 >
 Privacy Policy
 </a>{""}
 and{""}
 <a
 href="/terms-and-conditions"
 className="border-b border-black/40 hover:border-orange-500 duration-300 transition-all"
 >
 Terms and Conditions
 </a>
 .
 </>
 ),
 },
];

// ─── Submit handler ───────────────────────────────────────────────────────────

async function handleContactSubmit(data) {
 const formattedData = {
 ...data,
 pageUrl: typeof window !=="undefined" ? window.location.href :"",
 };

 const res = await fetch("/api/contactform", {
 method:"POST",
 body: JSON.stringify(formattedData),
 headers: {"Content-Type":"application/json" },
 });

 if (!res.ok) throw new Error("Failed to send message");
}

// ─── Section layout (identical to original Form.jsx) ─────────────────────────

const Form = () => {
 return (
 <section
 className="w-screen h-full overflow-hidden relative z-10 max-md:mt-0 px-[5vw] max-md:px-[6vw] max-sm:px-[7vw] max-sm:py-[15%] py-[7%]"
 id="contact-form"
 >
 <div className="h-full w-full flex items-start justify-between max-sm:flex-col max-md:flex-col max-sm:gap-[8vw] max-md:gap-[10vw] max-sm:px-[2vw] max-md:px-0">
 {/* ── Left column ── */}
 <div className="w-[52%] h-full max-sm:w-full max-md:w-full space-y-[1.5vw] max-md:space-y-[3vw] max-sm:space-y-[4.5vw] flex flex-col justify-between gap-[6.5vw]">
 <div className="h-[35%] space-y-[1.5vw] max-md:space-y-[7vw] max-sm:space-y-[10vw]">
 <HeadingAnim>
 <h2 className="w-[85%] max-sm:w-full max-md:w-[90%] text-76 max-md:text-center max-md:mx-auto font-head text-[#0A1B4B] leading-[1.2]">
 Have a specific request or question?
 </h2>
 </HeadingAnim>

 <div className="w-[60%] max-sm:w-full max-md:mx-auto max-md:w-[85%]">
 <Copy>
 <p className="text-30 font-normal max-md:text-center max-sm:text-left">
 Fill out the form below and our team will get back to you
 within 24 hours.
 </p>
 </Copy>
 </div>
 </div>

 {/* Desktop contact info */}
 <div className="h-[40%] max-md:hidden flex flex-col justify-between gap-[3vw]">
 <div className="space-y-[0.3vw] text-head text-white-300 font-normal fadeup">
 <p className="text-30 text-foreground">Phone:</p>
 <div className="under-multi-parent w-fit">
 <a href="tel:+353894015233" className="under-multi text-30 text-foreground">
 +353 89401 5233
 </a>
 </div>
 <div className="under-multi-parent w-fit">
 <a href="tel:+919664056847" className="under-multi text-30 text-foreground">
 +91 96640 56847
 </a>
 </div>
 </div>

 <div className="text-white-300 space-y-[0.3vw] fadeup">
 <p className="text-30 text-foreground">E-mail:</p>
 <div className="under-multi-parent w-fit text-30 text-foreground">
 <a href="mailto:contact@datasciencewizards.ai" className="under-multi">
 contact@datasciencewizards.ai
 </a>
 </div>
 </div>

 <div className="text-white-300 space-y-[0.8vw] fadeup">
 <p className="text-30 text-foreground">Socials:</p>
 <div className="flex items-center gap-[1.5vw] mt-[1vw] max-sm:gap-[7vw] max-sm:w-full max-sm:justify-center max-sm:my-[10vw]">
 {socialLinks.map((social) => (
 <Link
 key={social.name}
 href={social.url}
 target="_blank"
 className="w-auto h-[2.2vw] relative duration-500 transition-all hover:scale-[0.95] block max-sm:h-[10vw] text-foreground hover:text-[#1727ff]"
 >
 {social.icon}
 </Link>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* ── Right column — form ── */}
 <div className="w-[50%] max-md:w-full mt-[11vw] max-sm:w-full max-md:mt-0">
 <ContactForm
 fields={CONTACT_FIELDS}
 onSubmit={handleContactSubmit}
 submitLabel="Submit"
 loadingLabel="Sending..."
 successMessage="✅ Form submitted successfully!"
 errorMessage="❌ Error sending message. Please try again."
 />
 </div>

 {/* ── Mobile contact info ── */}
 <div className="hidden max-md:block">
 <div className="h-[40%] max-md:pt-[5vw] flex flex-col justify-between gap-[5vw]">
 <div className="space-y-[0.3vw] text-head text-white-300 font-normal fadeup">
 <p className="text-[3vw] max-sm:text-[4vw]">Phone:</p>
 <p className="underline cursor-pointer max-md:text-[2.5vw] max-sm:text-[3.5vw]">
 +353894015233
 </p>
 <p className="underline cursor-pointer max-md:text-[2.5vw] max-sm:text-[3.5vw]">
 +919664056847
 </p>
 </div>

 <div className="text-white-300 space-y-[0.3vw] fadeup">
 <p className="text-[3vw] max-sm:text-[4vw]">E-mail:</p>
 <p className="underline cursor-pointer max-sm:text-[3.5vw] max-md:text-[2.5vw]">
 contact@datasciencewizards.ai
 </p>
 </div>

 <div className="text-white-300 space-y-[0.8vw] max-sm:space-y-[0.5vw] fadeup">
 <p className="text-[3vw] max-sm:text-[4vw]">Socials:</p>
 <div className="flex items-center gap-[1.5vw] mt-[1vw] max-md:mt-[3vw] max-sm:mt-[5vw] max-md:gap-[7vw] max-sm:w-full max-sm:justify-center max-sm:my-[10vw]">
 {socialLinks.map((social) => (
 <Link
 key={social.name}
 href={social.url}
 target="_blank"
 className="w-auto h-[2.2vw] max-md:h-[6vw] relative duration-500 transition-all hover:scale-[0.95] block max-sm:h-[10vw] text-foreground hover:text-[#1727ff]"
 >
 {social.icon}
 </Link>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
};

export default Form;