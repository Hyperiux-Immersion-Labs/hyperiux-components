'use client'
import ContactForm from"@/components/Form/ContactForm";

const FIELDS = [
 { type:"text", name:"name", label:"Name*", required: true },
 { type:"email", name:"email", label:"Business Email*", required: true },
 { type:"phone", name:"phone", label:"Phone*", required: true, defaultCountry:"IN" },
 {
 type:"select",
 name:"topic",
 label:"Topic*",
 required: true,
 options: [
 { value:"general", label:"General Inquiry" },
 { value:"partnership", label:"Partnership" },
 ],
 },
 { type:"textarea", name:"message", label:"Your message", rows: 4 },
 {
 type:"checkbox",
 name:"terms",
 required: true,
 label: <>I agree to the <a href="#" className="underline">Terms</a>.</>,
 },
];

async function submitHandler(data) {
 console.log("Contact form submitted:", data);
}

export default function ContactPage() {
 return (
 <main className="w-full bg-white min-h-screen mx-auto py-20 px-6">
  <div className="w-[50%] max-sm:w-[95%] mx-auto">  <h1 className="text-3xl text-black mb-8">Get in touch</h1>
 <ContactForm
 fields={FIELDS}
 onSubmit={submitHandler}
 submitLabel="Send Message"
 />
 </div>
 </main>
 );
}
