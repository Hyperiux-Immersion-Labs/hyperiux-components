// Configuration for effect showcases
// Defines the props, defaults, and demo content for each effect

export const effectConfigs = {
"inertia-img": {
 props: [],
 defaults: {},
 note:"Pass an array of image paths to the images prop. Hover over each image to see the inertia wobble effect.",
 },

"svg-path-marquee": {
 props: [
 { name:"baseVelocity", type:"range", min: 1, max: 20, step: 1, description:"Base scroll speed of items along the path" },
 { name:"repeat", type:"range", min: 1, max: 6, step: 1, description:"How many times to repeat each child item" },
 { name:"slowDownFactor", type:"range", min: 0.1, max: 1, step: 0.05, description:"Speed multiplier when hovered (if slowdownOnHover is true)" },
 { name:"dragSensitivity", type:"range", min: 0.05, max: 0.5, step: 0.05, description:"Drag movement sensitivity" },
 { name:"slowdownOnHover", type:"boolean", description:"Slow the marquee when hovered" },
 { name:"draggable", type:"boolean", description:"Allow dragging to scrub position" },
 { name:"useScrollVelocity", type:"boolean", description:"Boost speed based on scroll velocity" },
 { name:"showPath", type:"boolean", description:"Render the SVG path for debugging" },
 { name:"grabCursor", type:"boolean", description:"Show grab cursor when draggable" },
 { name:"responsive", type:"boolean", description:"Scale the SVG to fit its container" },
 ],
 defaults: {
 baseVelocity: 8,
 repeat: 2,
 slowDownFactor: 0.3,
 dragSensitivity: 0.1,
 slowdownOnHover: true,
 draggable: true,
 useScrollVelocity: true,
 showPath: false,
 grabCursor: true,
 responsive: true,
 },
 note:"Pass a path prop (SVG path d string) and a viewBox to position items along any shape.",
 },

"spotlight-text": {
 props: [
 { name:"size", type:"text", description:"Tailwind font size class e.g. text-3xl md:text-5xl" },
 { name:"align", type:"select", options: ["left","center","right"], description:"Text alignment" },
 ],
 defaults: {
 size:"text-3xl md:text-5xl",
 align:"center",
 },
 demoText:"Hyperiux UI is where design meets precision — a component library built for developers who care about performance, aesthetics, and experience.",
 note:"Works on desktop only; on mobile the text is shown fully visible without the spotlight effect.",
 },

"blur-text": {
 props: [
 { name:"blur", type:"range", min: 0, max: 20, step: 1, description:"Initial blur amount in pixels" },
 { name:"duration", type:"range", min: 0.1, max: 2, step: 0.1, description:"Animation duration in seconds" },
 { name:"delay", type:"range", min: 0, max: 1, step: 0.1, description:"Delay before animation starts" },
 ],
 defaults: {
 blur: 10,
 duration: 0.5,
 delay: 0,
 },
 demoText:"Blur Text Effect",
 demoClassName:"text-4xl font-bold text-white",
 },

"text-reveal": {
 props: [
 { name:"duration", type:"range", min: 0.5, max: 2, step: 0.1, description:"Animation duration" },
 { name:"stagger", type:"range", min: 0.05, max: 0.3, step: 0.01, description:"Delay between each word" },
 { name:"y", type:"range", min: 20, max: 150, step: 10, description:"Initial Y offset in pixels" },
 ],
 defaults: {
 duration: 1,
 stagger: 0.1,
 y: 100,
 },
 demoText:"Scroll to reveal this text animation",
 demoClassName:"text-3xl font-bold text-white",
 },

"chevron-bird": {
 props: [
 { name:"size", type:"range", min: 10, max: 40, step: 2, description:"Size of the icon" },
 { name:"strokeWidth", type:"range", min: 4, max: 16, step: 2, description:"Stroke width" },
 { name:"duration", type:"range", min: 0.1, max: 1, step: 0.05, description:"Animation duration" },
 ],
 defaults: {
 size: 14,
 strokeWidth: 10,
 duration: 0.32,
 },
 demoClassName:"text-white",
 note:"Animated chevron that transforms between up/down states.",
 },

"animated-faq": {
 props: [
 { name:"duration", type:"range", min: 0.2, max: 1, step: 0.05, description:"Open/close animation duration" },
 { name:"iconSize", type:"range", min: 10, max: 24, step: 2, description:"Chevron icon size" },
 ],
 defaults: {
 duration: 0.45,
 iconSize: 14,
 },
 isContainer: true,
 note:"Accessible accordion component with smooth GSAP animations. Use FAQGroup, FAQWrapper, FAQTitle, and FAQContent.",
 },

"char-stagger-button": {
 props: [
 { name:"staggerStep", type:"range", min: 0.005, max: 0.05, step: 0.005, description:"Delay between each character" },
 { name:"showLine", type:"boolean", description:"Show underline on hover" },
 { name:"showArrow", type:"boolean", description:"Show arrow icon" },
 ],
 defaults: {
 staggerStep: 0.01,
 showLine: false,
 showArrow: false,
 hoverColor:"#ff6b00",
 },
 demoText:"Hover over me",
 demoClassName:"text-2xl font-medium text-white",
 },

"directional-menu": {
 props: [
 { name:"closeDelay", type:"range", min: 50, max: 500, step: 50, description:"Delay before closing menu" },
 { name:"panelGap", type:"range", min: 0, max: 40, step: 4, description:"Gap between nav and panel" },
 ],
 defaults: {
 closeDelay: 180,
 panelGap: 20,
 },
 isContainer: true,
 note:"Mega menu with directional content transitions. Pass items array with label and customContent.",
 },

"parallax-footer": {
 props: [],
 defaults: {},
 isContainer: true,
 note:"Wrap your footer content for a fixed parallax reveal effect on scroll.",
 },

"parallax-image": {
 props: [
 { name:"translateY", type:"text", description:"Vertical parallax offset (e.g.,'30%')" },
 { name:"enableScale", type:"boolean", description:"Enable scale animation" },
 { name:"scaleFrom", type:"range", min: 1, max: 2, step: 0.1, description:"Initial scale" },
 { name:"scaleTo", type:"range", min: 1, max: 2, step: 0.1, description:"Final scale" },
 ],
 defaults: {
 translateY:"30%",
 enableScale: false,
 scaleFrom: 1.6,
 scaleTo: 1.2,
 },
 demoClassName:"w-full h-[400px]",
 note:"Image with parallax scrolling effect using GSAP ScrollTrigger.",
 },

"rectangular-text-reveal": {
 props: [
 { name:"baseColor", type:"color", description:"Primary reveal color" },
 { name:"overlayColor", type:"color", description:"Secondary overlay color" },
 { name:"stagger", type:"range", min: 0.1, max: 0.5, step: 0.05, description:"Stagger between lines" },
 { name:"useOverlay", type:"boolean", description:"Use two-tone overlay effect" },
 ],
 defaults: {
 baseColor:"#ea580c",
 overlayColor:"#ffffff",
 stagger: 0.2,
 useOverlay: true,
 },
 demoText:"Scroll to reveal this text with rectangles",
 demoClassName:"text-3xl font-bold text-white",
 },

};

export function getEffectConfig(slug) {
 return effectConfigs[slug] || null;
}
