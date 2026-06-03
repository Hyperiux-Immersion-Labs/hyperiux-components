export const effectContent = {
  "scroll-effects": {
    "sticky-content-wrapper": {
      seo: {
        primaryKeyword: "React sticky content wrapper",
        secondaryKeywords: [
          "sticky scroll section React",
          "sticky content on scroll",
          "Next.js sticky section",
          "React sticky scroll animation",
        ],
        title:
          "Sticky Content Wrapper React Component | Sticky Scroll Storytelling Layout | Hyperiux Vault",
        description:
          "Add a Sticky Content Wrapper effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for SaaS feature explanations, platform capability sections, agency process sections, case study storytelling, and methodology pages.",
      },

      h1: "Sticky Content Wrapper for React and Next.js",

      shortDescription:
        "A sticky scroll layout that keeps key content fixed while supporting visuals, cards, or sections move around it.",

      heroCopy: [
        "The Sticky Content Wrapper effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Sticky Content Wrapper introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for SaaS feature explanations, platform capability sections, agency process sections, case study storytelling, and methodology pages. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Sticky Content Wrapper can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a sticky scroll storytelling layout, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Sticky Content Wrapper when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Sticky Content Wrapper helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "SaaS feature explanations",
        "Platform capability sections",
        "Agency process sections",
        "Case study storytelling",
        "Methodology pages",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Sticky Content Wrapper effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              source: "install",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Sticky Content Wrapper in a section where motion supports the message. It should help users understand, explore, or remember the content rather than simply decorate the page. It works best for sections that have a clear sequence, such as product capabilities, process steps, case study moments, platform benefits, or campaign storytelling.",
        },

        {
          title: "Step 3: Prepare the content data",
          body: "Create an array of sticky items before rendering the component. Each item should contain a renderContent function and an image source. The renderContent function controls the JSX shown in the sticky content area, while the image field controls the visual paired with that step.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `"use client";

import LinkButton from "@/components/Buttons/LinkButtons/LinkButton/LinkButton";
import StickyContentWrapper from "@/components/StickyContent/StickyContent";
import { ReactLenis } from "lenis/react";

const stickyItems = [
  {
    renderContent: () => (
      <div className="w-full h-full flex flex-col text-black">
        <h3 className="font-medium">Designed for Modern Living</h3>

        <p>
          Thoughtfully crafted residences that seamlessly blend architecture,
          comfort, and lifestyle-creating spaces where design enhances everyday
          living.
        </p>

        <ul className="flex flex-col opacity-80">
          <li>• Open layouts with natural light</li>
          <li>• Premium materials and finishes</li>
          <li>• Smart and sustainable design</li>
        </ul>

        <LinkButton
          href="#"
          text="Explore Residences"
          className="mt-[1vw] text-[1.2vw]"
        />
      </div>
    ),
    image: "/assets/sticky-section/sticky-1-img.png",
  },

  {
    renderContent: () => (
      <div className="w-full h-full flex flex-col text-black">
        <h3 className="font-medium">Locations That Matter</h3>

        <p>
          Strategically located developments offering seamless connectivity to
          business hubs, education centers, and lifestyle destinations.
        </p>

        <ul className="flex flex-col opacity-80">
          <li>• Close to key urban corridors</li>
          <li>• Excellent transport connectivity</li>
          <li>• Surrounded by lifestyle hubs</li>
        </ul>

        <LinkButton
          href="#"
          text="View Locations"
          className="mt-[1vw] text-[1.2vw]"
        />
      </div>
    ),
    image: "/assets/sticky-section/sticky-2-img.png",
  },

  {
    renderContent: () => (
      <div className="w-full h-full flex flex-col text-black">
        <h3 className="font-medium">Built for Long-Term Value</h3>

        <p>
          Engineered for durability and appreciation, ensuring your investment
          continues to grow alongside evolving urban landscapes.
        </p>

        <ul className="flex flex-col opacity-80">
          <li>• High-quality construction standards</li>
          <li>• Future-ready infrastructure</li>
          <li>• Strong long-term appreciation potential</li>
        </ul>

        <LinkButton
          href="#"
          text="Explore Investment"
          className="mt-[1vw] text-[1.2vw]"
        />
      </div>
    ),
    image: "/assets/sticky-section/sticky-3-img.png",
  },

  {
    renderContent: () => (
      <div className="w-full h-full flex flex-col text-black">
        <h3 className="font-medium">Crafted for Elevated Experiences</h3>

        <p>
          From curated amenities to refined interiors, every detail is designed
          to deliver a seamless and elevated lifestyle experience.
        </p>

        <ul className="flex flex-col opacity-80">
          <li>• World-class lifestyle amenities</li>
          <li>• Thoughtfully designed interiors</li>
          <li>• Community-driven living spaces</li>
        </ul>

        <LinkButton
          href="#"
          text="View Amenities"
          className="mt-[1vw] text-[1.2vw]"
        />
      </div>
    ),
    image: "/assets/sticky-section/sticky-4-img.png",
  },
];

export default function Page() {
  return (
    <ReactLenis root>
      <section className="bg-white">
        <StickyContentWrapper
          items={stickyItems}
          className=""
          leftClassName="text-black"
          contentEnterYPercent={2}
          contentExitYPercent={-2}
          contentTransitionDuration={0.9}
          contentDelay={0.35}
          stepGap={2.1}
          initialImageScale={1.5}
          activeImageScale={1.2}
          exitImageScale={1}
        />
      </section>
    </ReactLenis>
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The items prop receives an array. Each object represents one sticky step. The renderContent function returns the JSX displayed in the content area, while the image field controls the visual paired with that step. This keeps the component flexible because the layout and animation logic stay inside StickyContentWrapper while the page controls the content model.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the movement direction, timing, easing, scroll distance, intensity, and interaction states. Start subtle and increase only if it improves comprehension or visual quality. For premium layouts, the motion should feel authored rather than noisy.",
          blocks: [
            {
              type: "props",
              title: "StickyContentWrapper Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. If the desktop interaction becomes cramped on smaller screens, switch to a simplified vertical stack, swipe pattern, or static fallback. Sticky interactions should never make the content harder to read on touch devices.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image sizes, keyboard access, reduced-motion behaviour, and whether the content remains understandable when animation is disabled. The final implementation should preserve a logical reading order and avoid hiding essential information inside animation-only states.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "sticky-content-wrapper.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Sticky Content Wrapper should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "Scroll Stack",
        "Stacking Cards",
        "Horizon Scroll",
        "Parallax Image",
        "Parallax Footer",
      ],

      faq: [
        {
          question: "What is Sticky Content Wrapper best used for?",
          answer:
            "Sticky Content Wrapper is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for SaaS feature explanations, platform capability sections, agency process sections, case study storytelling, and methodology pages.",
        },
        {
          question: "Can I use Sticky Content Wrapper in Next.js?",
          answer:
            "Yes. If the implementation relies on browser APIs, scroll listeners, GSAP, Motion, Canvas, or WebGL, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Sticky Content Wrapper suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Some scroll effects work better as swipeable sections, vertical stacks, or static layouts on small screens.",
        },
        {
          question:
            "Does Sticky Content Wrapper require GSAP or another dependency?",
          answer:
            "The exact dependency depends on the implementation. The effect page should list whether it uses GSAP, Motion, Lenis, Canvas, SVG, Three.js, React Three Fiber, or no external animation library.",
        },
        {
          question:
            "Can Hyperiux customize Sticky Content Wrapper for a website?",
          answer:
            "Yes. Hyperiux can adapt the motion behaviour, layout, responsive states, visual style, and content model of Sticky Content Wrapper into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Sticky Content Wrapper when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Sticky Content Wrapper",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Sticky Scroll Storytelling Layout",
      },
    },
    "horizontal-feature-reveal": {
      seo: {
        primaryKeyword: "React horizontal scroll animation",
        secondaryKeywords: [
          "horizontal scroll React",
          "Next.js horizontal scroll section",
          "GSAP horizontal scroll",
          "horizontal scrolling website effect",
        ],
        title:
          "Horizon Scroll React Component | Horizontal Scroll Animation | Hyperiux Vault",
        description:
          "Add a Horizon Scroll effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for portfolio project strips, product feature sequences, SaaS workflow explanations, case study galleries, and editorial storytelling sections.",
      },

      h1: "Horizon Scroll for React and Next.js",

      shortDescription:
        "A horizontal scroll effect that moves content sideways as users scroll vertically through a page.",

      heroCopy: [
        "The Horizon Scroll effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Horizon Scroll introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for portfolio project strips, product feature sequences, SaaS workflow explanations, case study galleries, and editorial storytelling sections. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Horizon Scroll can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a horizontal scroll animation, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Horizon Scroll when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Horizon Scroll helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Portfolio project strips",
        "Product feature sequences",
        "SaaS workflow explanations",
        "Case study galleries",
        "Editorial storytelling sections",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Horizon Scroll effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add horizontal-feature-reveal",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Horizon Scroll in a section where motion supports the message. It should help users understand, explore, or remember the content rather than simply decorate the page. Use it when the section has a clear sequence, such as a project strip, product workflow, feature journey, case study gallery, or editorial story.",
        },

        {
          title: "Step 3: Prepare the content data",
          body: "Create an array of horizontal reveal items before rendering the component. Each item should include a number, title, image, and paragraphs array. The component uses this data to render each horizontal card while GSAP controls the sideways scroll movement.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { HorizontalFeatureReveal } from "@/components/effects/horizontal-feature-reveal";

const items = [
  {
    number: "01",
    title: "Burj Khalifa",
    image: "/assets/horizontal-section/horizontal-img-1.png",
    paragraphs: [
      "Burj Khalifa represents the highest standard of luxury living in Dubai, combining iconic architecture and unmatched skyline views.",
      "From premium residences to a location at the heart of Downtown Dubai, it delivers an address defined by exclusivity and long-term value.",
    ],
  },
  {
    number: "02",
    title: "Palm Jumeirah",
    image: "/assets/horizontal-section/horizontal-img-2.png",
    paragraphs: [
      "Palm Jumeirah is one of Dubai's most sought-after waterfront destinations, known for private beachfront residences.",
      "The location offers a rare combination of luxury, privacy, and international appeal.",
    ],
  },
  {
    number: "03",
    title: "Dubai Marina",
    image: "/assets/horizontal-section/horizontal-img-3.png",
    paragraphs: [
      "Dubai Marina offers a dynamic urban waterfront experience with high-rise luxury apartments and vibrant retail.",
      "Its rental demand and lifestyle positioning make it compelling for investors and residents alike.",
    ],
  },
];

export default function MyComponent() {
  return (
    <HorizontalFeatureReveal
      items={items}
      className=""
    />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The items prop receives an array. Each object represents one horizontal card in the scroll sequence. The number field controls the large index label, the title field controls the card heading, the image field controls the visual, and the paragraphs array renders the supporting copy. This keeps the component reusable because the animation logic stays inside Horizon Scroll while the page controls the content model.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the scroll distance, horizontal movement, card spacing, trigger points, scrub behaviour, image parallax, and entrance animation. Start subtle and increase only if the motion improves comprehension or visual quality. Horizontal scroll should feel intentional, not like a gimmick placed on top of weak content.",
          blocks: [
            {
              type: "props",
              title: "HorizontalFeatureReveal Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. The desktop version can use pinned horizontal movement, but smaller screens should usually switch to a vertical stack or simplified native scroll layout. The mobile experience should never force users into awkward sideways navigation.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image sizes, keyboard access, reduced-motion behaviour, and whether the content remains understandable when animation is disabled. The final implementation should preserve a logical reading order and avoid hiding essential information inside animation-only states.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "horizontal-feature-reveal.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Horizon Scroll should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "Infinite Perspective Slider",
        "Parallax Gallery",
        "Parallax Slider",
        "Scroll Stack",
        "Sticky Content Wrapper",
      ],

      faq: [
        {
          question: "What is Horizon Scroll best used for?",
          answer:
            "Horizon Scroll is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for portfolio project strips, product feature sequences, SaaS workflow explanations, case study galleries, and editorial storytelling sections.",
        },
        {
          question: "Can I use Horizon Scroll in Next.js?",
          answer:
            "Yes. If the implementation relies on browser APIs, scroll listeners, GSAP, Motion, Canvas, or WebGL, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Horizon Scroll suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Some scroll effects work better as swipeable sections, vertical stacks, or static layouts on small screens.",
        },
        {
          question: "Does Horizon Scroll require GSAP or another dependency?",
          answer:
            "The exact dependency depends on the implementation. The effect page should list whether it uses GSAP, Motion, Lenis, Canvas, SVG, Three.js, React Three Fiber, or no external animation library.",
        },
        {
          question: "Can Hyperiux customize Horizon Scroll for a website?",
          answer:
            "Yes. Hyperiux can adapt the motion behaviour, layout, responsive states, visual style, and content model of Horizon Scroll into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Horizon Scroll when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Horizon Scroll",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Horizontal Scroll Animation",
      },
    },
    "infinite-perspective-slider": {
      seo: {
        primaryKeyword: "React infinite perspective slider",
        secondaryKeywords: [
          "perspective slider React",
          "infinite slider React",
          "3D carousel React",
          "Next.js perspective slider",
          "creative slider animation",
        ],
        title:
          "Infinite Perspective Slider React Component | Infinite 3D Perspective Slider | Hyperiux Vault",
        description:
          "Add an Infinite Perspective Slider effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for portfolio previews, product screenshot showcases, campaign galleries, case study indexes, and creative agency work sections.",
      },

      h1: "Infinite Perspective Slider for React and Next.js",

      shortDescription:
        "An infinite slider with perspective-based movement for project previews, visual galleries, and immersive showcases.",

      heroCopy: [
        "The Infinite Perspective Slider effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Infinite Perspective Slider introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for portfolio previews, product screenshot showcases, campaign galleries, case study indexes, and creative agency work sections. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Infinite Perspective Slider can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for an infinite 3D perspective slider, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Infinite Perspective Slider when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Infinite Perspective Slider helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Portfolio previews",
        "Product screenshot showcases",
        "Campaign galleries",
        "Case study indexes",
        "Creative agency work sections",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Infinite Perspective Slider effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add infinite-perspective-slider",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Infinite Perspective Slider in a section where motion supports the message. It should help users explore visual work, compare previews, or move through a set of project assets without turning the section into a standard grid.",
        },

        {
          title: "Step 3: Prepare the image data",
          body: "Pass an images array into the component. Each item can be a simple image string or an object with src, number, title, and desc fields. The component normalizes each item internally, then uses the array to build the infinite perspective loop.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { InfinitePerspectiveSlider } from "@/components/effects/infinite-perspective-slider";

const images = [
  {
    src: "/assets/infinite-slider/project-1.png",
    number: "01",
    title: "Brand System",
    desc: "A visual identity preview designed for a premium digital launch.",
  },
  {
    src: "/assets/infinite-slider/project-2.png",
    number: "02",
    title: "Product Interface",
    desc: "A high-fidelity product screen created for a conversion-led SaaS experience.",
  },
  {
    src: "/assets/infinite-slider/project-3.png",
    number: "03",
    title: "Campaign Visual",
    desc: "A campaign asset built to create depth, motion, and visual recall.",
  },
  {
    src: "/assets/infinite-slider/project-4.png",
    number: "04",
    title: "Case Study Preview",
    desc: "A portfolio preview card for showing selected work in a more immersive way.",
  },
];

export default function MyComponent() {
  return (
    <InfinitePerspectiveSlider images={images} />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The images prop receives an array. Each object becomes one card in the infinite perspective strip. The src field controls the image, number controls the card index, title controls the heading, and desc or description controls the supporting text revealed on hover. You can also pass a simple string array when you only need images without metadata.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the card width, card gap, lerp strength, wheel sensitivity, rotation sensitivity, and mobile sizing inside the component. Keep the perspective strong enough to feel dimensional, but restrained enough that the slider does not feel unstable or difficult to control.",
          blocks: [
            {
              type: "props",
              title: "InfinitePerspectiveSlider Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the slider on desktop, tablet, and mobile. The desktop version can lean into perspective, wheel movement, drag behaviour, and hover text reveals. On smaller screens, reduce card width and simplify the interaction so the slider remains easy to control with touch.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check animation smoothness, image weight, pointer behaviour, reduced-motion strategy, and whether content remains understandable without hover-only interaction. Infinite sliders should feel fluid, but they should not trap attention or make core content unreachable.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "infinite-perspective-slider.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Infinite Perspective Slider should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "Helix Slider",
        "Orbit Slider",
        "Rotating Carousel",
        "Parallax Slider",
        "3D Portfolio Slider",
      ],

      faq: [
        {
          question: "What is Infinite Perspective Slider best used for?",
          answer:
            "Infinite Perspective Slider is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for portfolio previews, product screenshot showcases, campaign galleries, case study indexes, and creative agency work sections.",
        },
        {
          question: "Can I use Infinite Perspective Slider in Next.js?",
          answer:
            "Yes. If the implementation relies on browser APIs, scroll listeners, GSAP, Motion, Canvas, or WebGL, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Infinite Perspective Slider suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Some scroll effects work better as swipeable sections, vertical stacks, or static layouts on small screens.",
        },
        {
          question:
            "Does Infinite Perspective Slider require GSAP or another dependency?",
          answer:
            "The exact dependency depends on the implementation. The effect page should list whether it uses GSAP, Motion, Lenis, Canvas, SVG, Three.js, React Three Fiber, or no external animation library.",
        },
        {
          question:
            "Can Hyperiux customize Infinite Perspective Slider for a website?",
          answer:
            "Yes. Hyperiux can adapt the motion behaviour, layout, responsive states, visual style, and content model of Infinite Perspective Slider into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Infinite Perspective Slider when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Infinite Perspective Slider",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Infinite 3D Perspective Slider",
      },
    },
    "text-convergence": {
      seo: {
        primaryKeyword: "React text convergence animation",
        secondaryKeywords: [
          "text convergence effect React",
          "scroll text animation React",
          "animated typography React",
          "Next.js text animation",
        ],
        title:
          "Text Convergence React Component | Scroll Typography Convergence Effect | Hyperiux Vault",
        description:
          "Add a Text Convergence effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for hero headlines, brand positioning statements, editorial intros, campaign messages, portfolio openers, and landing page transitions.",
      },

      h1: "Text Convergence for React and Next.js",

      shortDescription:
        "A scroll-based typography effect where text elements move toward alignment, focus, or convergence as users progress through the section.",

      heroCopy: [
        "The Text Convergence effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Text Convergence introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for hero headlines, brand positioning statements, editorial intros, campaign messages, portfolio openers, and landing page transitions. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Text Convergence can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a scroll typography convergence effect, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Text Convergence when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Text Convergence helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Hero headlines",
        "Brand positioning statements",
        "Editorial intros",
        "Campaign messages",
        "Portfolio openers",
        "Landing page transitions",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Text Convergence effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add text-convergence",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Text Convergence in a section where motion supports the message. It should help users focus on a headline, brand statement, campaign message, or editorial opening instead of simply decorating the page with moving typography.",
        },

        {
          title: "Step 3: Prepare the text content",
          body: "Pass the text string into the component and use the color props to align the effect with the page theme. The component calculates its scroll height from the word count, splits the text into characters with GSAP SplitText, and moves the typography horizontally while each character converges into place during scroll.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { TextConvergence } from "@/components/effects/text-convergence";

export default function MyComponent() {
  return (
    <TextConvergence
      text="Build faster. Animate better. Ship smarter."
      bgColor="#111111"
      textColor="#4F39F6"
    />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The text prop controls the typography rendered inside the scroll section. The bgColor prop controls the section background, while textColor controls the animated text color. The component uses the length of the text to calculate the scrollable section height, so longer messages get more room to animate without feeling compressed.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the scroll distance, character movement range, horizontal travel, scrub value, easing, font scale, and section height. Text convergence effects work best when the typography has enough space to move, but not so much movement that the message becomes difficult to read.",
          blocks: [
            {
              type: "props",
              title: "TextConvergence Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. Large animated typography can become hard to read on smaller screens, so check font scale, sticky height, scroll length, and horizontal overflow carefully before shipping.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, text readability, reduced-motion behaviour, contrast, and whether the message remains understandable when animation is disabled. Typography effects should create emphasis without making the content inaccessible.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "text-convergence.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Text Convergence should be implemented with performance in mind. Prefer transform and opacity-based movement, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, readable labels, focus states, contrast, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll typography interactions often work better as shorter animated statements, static typography blocks, or simplified vertical layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the message needs emphasis.",
        "Adding too much character movement and making the text difficult to read.",
        "Ignoring mobile behaviour and horizontal overflow.",
        "Using low-contrast color combinations that weaken readability.",
        "Making the scroll section too long for a short line of text.",
        "Forgetting reduced-motion handling for users who prefer less animation.",
      ],

      relatedEffectNames: [
        "Scramble Text",
        "Text Fill Animation",
        "Mask Text Reveal",
        "SVG Path Marquee",
        "Perspective Text Reveal",
      ],

      faq: [
        {
          question: "What is Text Convergence best used for?",
          answer:
            "Text Convergence is best used when the page section benefits from motion, emphasis, or progressive visual focus. It is strongest for hero headlines, brand positioning statements, editorial intros, campaign messages, portfolio openers, and landing page transitions.",
        },
        {
          question: "Can I use Text Convergence in Next.js?",
          answer:
            "Yes. Because the implementation relies on browser APIs, GSAP, ScrollTrigger, and SplitText, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Text Convergence suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Large animated typography can become difficult to read on smaller screens, so test font size, scroll length, and horizontal overflow carefully.",
        },
        {
          question: "Does Text Convergence require GSAP or another dependency?",
          answer:
            "Yes. This implementation uses GSAP, ScrollTrigger, and SplitText to split the text into characters and animate them through scroll.",
        },
        {
          question: "Can Hyperiux customize Text Convergence for a website?",
          answer:
            "Yes. Hyperiux can adapt the text behaviour, scroll timing, typography scale, color system, responsive states, and content model of Text Convergence into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Text Convergence when your website section needs a more intentional typography moment instead of another static headline.",
        primary: "Install Text Convergence",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Scroll Typography Convergence Effect",
      },
    },
    "rotation-slider": {
      seo: {
        primaryKeyword: "React rotation slider",
        secondaryKeywords: [
          "rotating slider React",
          "React animated slider",
          "Next.js rotation slider",
          "creative slider animation",
          "GSAP rotation slider",
        ],
        title:
          "Rotation Slider React Component | Rotational Transition Slider | Hyperiux Vault",
        description:
          "Add a Rotation Slider effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for portfolio project sliders, agency work previews, product screenshot sections, creative landing pages, and campaign image sections.",
      },

      h1: "Rotation Slider for React and Next.js",

      shortDescription:
        "A slider effect that transitions content through controlled rotational movement for a more dynamic visual experience.",

      heroCopy: [
        "The Rotation Slider effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Rotation Slider introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for portfolio project sliders, agency work previews, product screenshot sections, creative landing pages, and campaign image sections. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Rotation Slider can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a rotational transition slider, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Rotation Slider when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Rotation Slider helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Portfolio project sliders",
        "Agency work previews",
        "Product screenshot sections",
        "Creative landing pages",
        "Campaign image sections",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Rotation Slider effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add rotation-slider",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Rotation Slider in a section where motion supports the message. It works best when users need to move through a visual sequence, such as project cards, product screenshots, campaign imagery, or agency work previews.",
        },

        {
          title: "Step 3: Prepare the image data",
          body: "Pass an images array into the component. Each item should include an image source and optional text used for the active slide label. The component uses the array to calculate scroll distance, animate each card through rotation, and reveal text as each card reaches the center zone.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { RotationSlider } from "@/components/effects/rotation-slider";

const images = [
  {
    src: "/assets/rotation-slider/project-1.png",
    text: "Brand System",
  },
  {
    src: "/assets/rotation-slider/project-2.png",
    text: "Product Interface",
  },
  {
    src: "/assets/rotation-slider/project-3.png",
    text: "Campaign Visual",
  },
  {
    src: "/assets/rotation-slider/project-4.png",
    text: "Case Study Preview",
  },
];

export default function MyComponent() {
  return <RotationSlider images={images} />;
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The images prop receives an array. Each object becomes one rotating card in the horizontal scroll sequence. The src field controls the visual passed into the RotationCard component, while the text field controls the fixed bottom-left label that animates in when the matching card reaches the active center zone.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the horizontal spacing, card width, perspective depth, rotation values, trigger points, scrub value, and text reveal timing inside the component. Keep the rotation expressive enough to create dimensional movement, but not so aggressive that it makes the visual sequence feel unstable.",
          blocks: [
            {
              type: "props",
              title: "RotationSlider Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. Rotational slider effects can feel heavy on smaller screens, so simplify layout, reduce card width, or switch to a vertical or swipe-friendly pattern where needed.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image weight, text visibility, reduced-motion behaviour, and whether the sequence remains understandable without animation. The effect should support the story, not make the user fight the interface.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "rotation-slider.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Rotation Slider should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "Rotating Carousel",
        "Orbit Slider",
        "Infinite Perspective Slider",
        "Helix Slider",
        "Parallax Slider",
      ],

      faq: [
        {
          question: "What is Rotation Slider best used for?",
          answer:
            "Rotation Slider is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for portfolio project sliders, agency work previews, product screenshot sections, creative landing pages, and campaign image sections.",
        },
        {
          question: "Can I use Rotation Slider in Next.js?",
          answer:
            "Yes. Because the implementation relies on browser APIs, ScrollTrigger, SplitText, ResizeObserver, and layout measurements, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Rotation Slider suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Rotational movement can feel heavy on smaller screens, so use reduced spacing, simplified transforms, or a static fallback when needed.",
        },
        {
          question: "Does Rotation Slider require GSAP or another dependency?",
          answer:
            "Yes. This implementation uses GSAP, ScrollTrigger, and SplitText. It also depends on a local RotationCard component for rendering the individual visual cards.",
        },
        {
          question: "Can Hyperiux customize Rotation Slider for a website?",
          answer:
            "Yes. Hyperiux can adapt the rotational behaviour, scroll timing, layout, responsive states, visual style, and content model of Rotation Slider into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Rotation Slider when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Rotation Slider",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Rotational Transition Slider",
      },
    },
    "parallax-slider": {
      seo: {
        primaryKeyword: "React parallax slider",
        secondaryKeywords: [
          "parallax slider React",
          "Next.js parallax slider",
          "GSAP parallax slider",
          "animated slider React",
          "scroll slider component",
        ],
        title:
          "Parallax Slider React Component | Layered Parallax Slider | Hyperiux Vault",
        description:
          "Add a Parallax Slider effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for portfolio project sliders, product screenshot showcases, campaign image sliders, case study previews, and visual landing pages.",
      },

      h1: "Parallax Slider for React and Next.js",

      shortDescription:
        "A slider effect that combines image or content transitions with parallax movement for a more layered browsing experience.",

      heroCopy: [
        "The Parallax Slider effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Parallax Slider introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for portfolio project sliders, product screenshot showcases, campaign image sliders, case study previews, and visual landing pages. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Parallax Slider can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a layered parallax slider, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Parallax Slider when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Parallax Slider helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Portfolio project sliders",
        "Product screenshot showcases",
        "Campaign image sliders",
        "Case study previews",
        "Visual landing pages",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Parallax Slider effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add parallax-slider",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Parallax Slider in a section where motion supports the message. It works best for visual sequences that benefit from horizontal movement, layered image motion, and a more cinematic way of browsing project or product visuals.",
        },

        {
          title: "Step 3: Prepare the image data",
          body: "Pass an images array into the component. Each string in the array becomes one slide. The component alternates wide and narrow slide widths, pins the section during scroll, and moves each image inside its frame to create the parallax feel.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { ParallaxSlider } from "@/components/effects/parallax-slider";

const images = [
  "/assets/parallax-slider/slide-1.png",
  "/assets/parallax-slider/slide-2.png",
  "/assets/parallax-slider/slide-3.png",
  "/assets/parallax-slider/slide-4.png",
  "/assets/parallax-slider/slide-5.png",
];

export default function MyComponent() {
  return (
    <ParallaxSlider
      images={images}
      bgColor="#000000"
    />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The images prop receives an array of image paths. Each path renders one slide inside the horizontal track. The component automatically alternates between wide and narrow slide layouts, while the bgColor prop controls the background color of the full pinned slider section.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the slide width, gap, horizontal padding, section height, scrub value, clip-path reveal, and image parallax distance inside the component. Keep the motion layered but controlled so the effect feels premium rather than restless.",
          blocks: [
            {
              type: "props",
              title: "ParallaxSlider Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. The desktop version can use a pinned horizontal scroll interaction, while smaller screens may need simpler widths, reduced parallax distance, or a native swipe-friendly pattern.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image optimization, GPU transform usage, reduced-motion behaviour, and whether the image sequence still makes sense when animation is reduced or disabled.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              source: "component",
              filename: "parallax-slider.jsx",
              language: "jsx",
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Parallax Slider should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "Parallax Gallery",
        "Parallax Image",
        "Infinite Perspective Slider",
        "Clip Path Slider",
        "Zoom Slider",
      ],

      faq: [
        {
          question: "What is Parallax Slider best used for?",
          answer:
            "Parallax Slider is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for portfolio project sliders, product screenshot showcases, campaign image sliders, case study previews, and visual landing pages.",
        },
        {
          question: "Can I use Parallax Slider in Next.js?",
          answer:
            "Yes. Because the implementation relies on browser APIs, GSAP, ScrollTrigger, ResizeObserver, layout measurements, and Next Image, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Parallax Slider suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Parallax-heavy horizontal motion can feel cramped on smaller screens, so reduce slide sizes, simplify movement, or use a native swipe-friendly fallback where needed.",
        },
        {
          question: "Does Parallax Slider require GSAP or another dependency?",
          answer:
            "Yes. This implementation uses GSAP and ScrollTrigger for the pinned horizontal scroll, slide reveal, and image parallax movement. It also uses Next Image for optimized image rendering.",
        },
        {
          question: "Can Hyperiux customize Parallax Slider for a website?",
          answer:
            "Yes. Hyperiux can adapt the parallax movement, scroll timing, layout, responsive states, image treatment, and content model of Parallax Slider into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Parallax Slider when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Parallax Slider",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Layered Parallax Slider",
      },
    },

    "orbit-slider": {
      seo: {
        primaryKeyword: "React circular scroll showcase",
        secondaryKeywords: [
          "circular scroll React",
          "GSAP circular showcase",
          "Next.js circular animation",
          "orbit scroll showcase",
          "scroll driven circular layout",
        ],
        title:
          "Circular Scroll Showcase React Component | Orbit Scroll Animation | Hyperiux Vault",
        description:
          "Add a Circular Scroll Showcase effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for portfolio highlights, creative galleries, visual storytelling sections, product showcases, and premium landing pages.",
      },

      h1: "Circular Scroll Showcase for React and Next.js",

      shortDescription:
        "A scroll-driven circular showcase effect where titles and images orbit vertically during page scroll.",

      heroCopy: [
        "The Circular Scroll Showcase effect is built for websites that want scroll to feel immersive rather than purely functional. Instead of moving content through a traditional stacked layout, the section transforms scroll into a synchronized circular motion where text and visuals orbit together. The interaction introduces rhythm, spatial depth, and visual pacing that help the section feel more cinematic and intentionally designed.",

        "This effect works especially well for portfolio highlights, creative galleries, visual storytelling sections, product showcases, and premium landing pages. The movement naturally creates focus because users encounter one highlighted visual moment at a time while still sensing the surrounding sequence. Rather than overwhelming the page with aggressive animation, the effect uses controlled motion to guide attention through a curated presentation.",

        "For developers, the practical advantage is that the animation system, circular positioning logic, GSAP scroll synchronization, and responsive scaling are already structured inside the component. Teams can focus on content, branding, imagery, and pacing instead of rebuilding complex scroll mathematics from scratch. The component remains flexible enough to customize radii, spacing, motion timing, image sizes, responsiveness, and overall visual density.",

        "Use Circular Scroll Showcase when a section deserves stronger visual emphasis than a standard card grid or slider can provide. Avoid using it excessively across multiple sections because scroll-heavy interactions lose impact when repeated too often. The best implementation keeps motion smooth, preserves accessibility, supports reduced-motion preferences, and ensures that content remains understandable even when animation is minimized.",
      ],

      bestUsedFor: [
        "Portfolio highlights",
        "Creative galleries",
        "Visual storytelling sections",
        "Product showcases",
        "Premium landing pages",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Circular Scroll Showcase effect to your project. This injects the component locally into your codebase so you can fully customize the layout, motion behaviour, spacing, and responsiveness.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add circular-scroll-showcase",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Circular Scroll Showcase in a section where visual sequencing matters. The effect works best when users should focus on one title-image pair at a time while still experiencing the feeling of continuous movement and progression.",
        },

        {
          title: "Step 3: Prepare the showcase data",
          body: "Create an items array before rendering the component. Each item should contain a title, image, and optional alt text. The component uses this array to position titles and image cards along synchronized circular paths during scroll.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import { CircularScrollShowcase } from "@/components/effects/circular-scroll-showcase";

const items = [
  {
    title: "Creative Direction",
    image: "/assets/circular-scroll/scroll-1.jpg",
    alt: "Creative Direction",
  },
  {
    title: "Brand Identity",
    image: "/assets/circular-scroll/scroll-2.jpg",
    alt: "Brand Identity",
  },
  {
    title: "Visual Systems",
    image: "/assets/circular-scroll/scroll-3.jpg",
    alt: "Visual Systems",
  },
  {
    title: "Digital Campaigns",
    image: "/assets/circular-scroll/scroll-4.jpg",
    alt: "Digital Campaigns",
  },
];

export default function MyComponent() {
  return (
    <CircularScrollShowcase
      items={items}
      className=""
    />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The items prop receives an array of showcase objects. Each object controls one title and one image card inside the circular orbit layout. The title field renders the large rotating text, while the image field controls the associated image card. The animation and positioning logic remain inside the component so the page only manages content.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Adjust the circular radii, image sizes, scroll distance, scrub amount, text sizing, pin duration, and overall layout scaling. Keep the motion smooth and restrained so the section feels premium instead of chaotic.",
          blocks: [
            {
              type: "props",
              title: "CircularScrollShowcase Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the layout across desktop, tablet, and mobile breakpoints. Circular motion layouts often need tighter spacing, smaller image cards, and reduced movement on smaller screens to maintain clarity and usability.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image optimization, GPU transform usage, keyboard accessibility, reduced-motion behaviour, and readability when animation is minimized. The final implementation should preserve a logical content order while keeping the experience visually fluid.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              filename: "circular-scroll-showcase.jsx",
              language: "jsx",
              code: `"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_WIDTH = 1200;
const TABLET_MIN_WIDTH = 768;
const LEFT_DEPTH_MAX = 30;
const RIGHT_DEPTH_MAX = 40;
const DEPTH_MIN = -1;
const DEPTH_MAX = 1;
const Z_INDEX_MIN = 1;
const LEFT_ANGLE_OFFSET = Math.PI;
const RIGHT_ANGLE_OFFSET = -Math.PI * 0.08;
const TEXT_REVEAL_DURATION = 0.6;
const TEXT_REVEAL_STAGGER = 0.04;
const IMAGE_REVEAL_DURATION = 0.6;
const IMAGE_REVEAL_STAGGER = 0.04;

gsap.registerPlugin(ScrollTrigger);

function wrapProgress(value) {
  let wrappedValue = value % 1;

  if (wrappedValue < 0) wrappedValue += 1;

  return wrappedValue;
}

function getCircularPosition(
  progress,
  radiusX,
  radiusY,
  angleOffset = 0
) {
  const angle = progress * Math.PI * 2 + angleOffset;

  return {
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
  };
}

export default function CircularScrollShowcase({
  items = [],
  className = "",
  sectionHeight = 260,
  leftRadiusX = 95,
  leftRadiusY = 220,
  rightRadiusX = 260,
  rightRadiusY = 260,
  imageCardWidth = 190,
  imageCardHeight = 210,
  titleSize = "clamp(28px, 3vw, 56px)",
  pinSpacing = true,
  scrub = 1.2,
}) {
  const rootRef = useRef(null);
  const stickyRef = useRef(null);
  const progressRef = useRef(0);

  const safeItems = useMemo(() => {
    return items.map((item, index) => ({
      id: item.id ?? index,
      title: item.title ?? \`Item \${index + 1}\`,
      image: item.image ?? "",
      alt: item.alt ?? item.title ?? \`Item \${index + 1}\`,
    }));
  }, [items]);

  useEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const leftNodes = gsap.utils.toArray(
        ".circular-scroll-showcase__left-item"
      );

      const rightNodes = gsap.utils.toArray(
        ".circular-scroll-showcase__right-item"
      );

      const total = safeItems.length;

      if (!total) return;

      const render = (scrollProgress) => {
        progressRef.current = scrollProgress;

        const width =
          typeof window !== "undefined"
            ? window.innerWidth
            : DESKTOP_WIDTH;

        let factor = 1;

        if (
          width < DESKTOP_WIDTH &&
          width >= TABLET_MIN_WIDTH
        ) {
          factor = width / DESKTOP_WIDTH;
        }

        const leftRadiusScaledX = leftRadiusX * factor;
        const leftRadiusScaledY = leftRadiusY * factor;

        const rightRadiusScaledX = rightRadiusX * factor;
        const rightRadiusScaledY = rightRadiusY * factor;

        if (rootRef.current) {
          rootRef.current.style.setProperty(
            "--css-card-width",
            \`\${imageCardWidth * factor}px\`
          );

          rootRef.current.style.setProperty(
            "--css-card-height",
            \`\${imageCardHeight * factor}px\`
          );
        }

        leftNodes.forEach((node, index) => {
          const localProgress = wrapProgress(
            index / total - scrollProgress
          );

          const position = getCircularPosition(
            localProgress,
            leftRadiusScaledX,
            leftRadiusScaledY,
            LEFT_ANGLE_OFFSET
          );

          const depth = Math.cos(
            localProgress * Math.PI * 2 +
              LEFT_ANGLE_OFFSET
          );

          gsap.set(node, {
            x: position.x,
            y: position.y,
            zIndex: Math.round(
              gsap.utils.mapRange(
                DEPTH_MIN,
                DEPTH_MAX,
                Z_INDEX_MIN,
                LEFT_DEPTH_MAX,
                depth
              )
            ),
          });
        });

        rightNodes.forEach((node, index) => {
          const localProgress = wrapProgress(
            index / total - scrollProgress
          );

          const position = getCircularPosition(
            localProgress,
            rightRadiusScaledX,
            rightRadiusScaledY,
            RIGHT_ANGLE_OFFSET
          );

          const depth = Math.cos(
            localProgress * Math.PI * 2 +
              RIGHT_ANGLE_OFFSET
          );

          gsap.set(node, {
            x: position.x,
            y: position.y,
            zIndex: Math.round(
              gsap.utils.mapRange(
                DEPTH_MIN,
                DEPTH_MAX,
                Z_INDEX_MIN,
                RIGHT_DEPTH_MAX,
                depth
              )
            ),
          });
        });
      };

      render(0);

      gsap.fromTo(
        leftNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: TEXT_REVEAL_DURATION,
          stagger: TEXT_REVEAL_STAGGER,
          ease: "power2.out",
          overwrite: "auto",
        }
      );

      gsap.fromTo(
        rightNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: IMAGE_REVEAL_DURATION,
          stagger: IMAGE_REVEAL_STAGGER,
          ease: "power2.out",
          overwrite: "auto",
        }
      );

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: \`+=\${sectionHeight * safeItems.length}%\`,
        pin: stickyRef.current,
        scrub,
        pinSpacing,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          render(self.progress);
        },
      });

      const onResize = () => {
        render(progressRef.current);
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [
    safeItems,
    scrub,
    pinSpacing,
    sectionHeight,
    leftRadiusX,
    leftRadiusY,
    rightRadiusX,
    rightRadiusY,
    imageCardWidth,
    imageCardHeight,
  ]);

  return (
    <section
      ref={rootRef}
      className={\`relative min-h-screen w-full overflow-clip bg-black text-white \${className}\`}
      style={{
        "--css-title-size": titleSize,
        "--css-card-width": \`\${imageCardWidth}px\`,
        "--css-card-height": \`\${imageCardHeight}px\`,
      }}
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden max-sm:h-svh"
      >
        <div className="relative mx-auto flex h-full w-full max-sm:flex-col max-sm:px-4 max-sm:py-5">
          <div className="relative flex h-full w-[50vw] translate-x-[-60%] items-center justify-center max-md:translate-x-[-74%] max-sm:h-[40%] max-sm:w-full max-sm:translate-x-[-60%]">
            <div className="relative h-[78vh] max-md:h-[92vh] max-sm:h-full max-sm:w-full">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__left-item pointer-events-none absolute left-1/2 top-1/2 w-full origin-center whitespace-nowrap text-center text-(length:--css-title-size,clamp(28px,3vw,56px)) font-medium leading-none tracking-[-0.04em] opacity-0 will-change-transform max-md:text-[clamp(24px,7vw,42px)] max-sm:text-[clamp(22px,8vw,34px)]"
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex h-full w-[50vw] translate-x-[50%] items-center justify-center max-md:translate-x-[64%] max-sm:h-[60%] max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-[40%]">
            <div className="relative h-[78vh] max-md:h-[92vh] max-sm:h-full max-sm:w-full">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__right-item absolute left-1/2 top-1/2 h-(--css-card-height,210px) w-(--css-card-width,210px) origin-center opacity-0 ml-[calc(var(--css-card-width,210px)*-0.5)] mt-[calc(var(--css-card-height,210px)*-0.5)] will-change-transform"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#f5f2eb] shadow-[0_30px_60px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.16)]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="pointer-events-none block h-full w-full select-none object-cover"
                      draggable="false"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Orbit radius",
          recommendation:
            "Increase for larger cinematic layouts and reduce for compact sections.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the number of showcase items so the pacing feels balanced.",
        },
        {
          option: "Image card size",
          recommendation:
            "Use restrained image sizes to avoid overwhelming the text layer.",
        },
        {
          option: "Motion intensity",
          recommendation:
            "Keep smooth and controlled for premium presentation-focused layouts.",
        },
        {
          option: "Mobile responsiveness",
          recommendation:
            "Reduce movement and spacing on smaller screens for better readability.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a simplified or static fallback for accessibility support.",
        },
      ],

      notes: {
        performance:
          "Circular Scroll Showcase should rely primarily on transform-based animation for smoother rendering. Optimize images, avoid excessive DOM nodes, and test scroll behaviour on lower-powered devices before production deployment.",

        accessibility:
          "The content should remain understandable when animation is disabled or reduced. Preserve readable text sizing, semantic structure, keyboard access, focus states, and reduced-motion support.",

        mobile:
          "On mobile devices, simplify spacing, reduce orbit size, and avoid overly aggressive motion. Smaller screens benefit from cleaner layouts and less dense circular movement.",
      },

      commonMistakes: [
        "Adding too many items and making the circular layout visually cluttered.",
        "Using oversized images that overpower the typography.",
        "Making the orbit movement too fast or aggressive.",
        "Ignoring mobile responsiveness and touch usability.",
        "Using unoptimized images that reduce scroll performance.",
        "Forgetting reduced-motion accessibility support.",
      ],

      relatedEffectNames: [
        "Orbit Slider",
        "Parallax Gallery",
        "Infinite Perspective Slider",
        "Scroll Stack",
        "Horizontal Feature Reveal",
      ],

      faq: [
        {
          question: "What is Circular Scroll Showcase best used for?",
          answer:
            "Circular Scroll Showcase is best used for sections where motion, sequencing, and visual pacing improve the browsing experience. It works especially well for creative portfolios, visual storytelling, premium showcases, and campaign-focused landing pages.",
        },
        {
          question: "Can I use Circular Scroll Showcase in Next.js?",
          answer:
            "Yes. Because the implementation uses GSAP, ScrollTrigger, browser APIs, and Next Image, it should be rendered inside a client component when used in Next.js applications.",
        },
        {
          question: "Is Circular Scroll Showcase suitable for mobile?",
          answer:
            "Yes, but the motion should usually be simplified on smaller screens. Reduced spacing, smaller image cards, and softer animation create a more usable mobile experience.",
        },
        {
          question: "Does Circular Scroll Showcase require GSAP?",
          answer:
            "Yes. This implementation uses GSAP and ScrollTrigger to synchronize the circular motion with page scroll and manage the pinned section behaviour.",
        },
        {
          question:
            "Can Hyperiux customize Circular Scroll Showcase for a website?",
          answer:
            "Yes. Hyperiux can customize the orbit layout, motion behaviour, image treatment, responsiveness, scroll pacing, and overall visual direction to match a brand or website experience.",
        },
      ],

      finalCta: {
        body: "Use Circular Scroll Showcase when your website section needs stronger visual pacing and a more immersive interaction layer.",
        primary: "Install Circular Scroll Showcase",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Circular Scroll Experience",
      },
    },
    "scroll-distortion": {
      seo: {
        primaryKeyword: "React scroll distortion effect",
        secondaryKeywords: [
          "scroll distortion React",
          "image distortion on scroll",
          "GSAP scroll distortion",
          "Next.js distortion effect",
          "creative scroll animation",
        ],
        title:
          "Scroll Distortion React Component | Scroll-Based Visual Distortion | Hyperiux Vault",
        description:
          "Add a Scroll Distortion effect to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for creative portfolio websites, agency websites, campaign microsites, immersive landing pages, visual case studies, and experimental product launches.",
      },

      h1: "Scroll Distortion for React and Next.js",

      shortDescription:
        "A scroll-based distortion effect that warps, stretches, or visually disrupts content as users move through a section.",

      heroCopy: [
        "The Scroll Distortion effect is built for websites where scroll should do more than move the visitor from one block of content to the next. In most landing pages, the page structure is predictable: a hero section, a few cards, a visual block, a testimonial, and a call to action. That structure is useful, but it can also make even strong content feel flat. Scroll Distortion introduces a more deliberate interaction pattern by turning scroll into a designed moment. Instead of treating motion as decoration, the effect gives the section rhythm, progression, and a clearer sense of visual intent.",

        "This effect is especially useful for creative portfolio websites, agency websites, campaign microsites, immersive landing pages, visual case studies, and experimental product launches. It works best when the content already has a reason to move: a sequence, a visual system, a set of projects, a product story, or a section that needs more presence than a static layout can provide. The goal is not to make the page louder. The goal is to make the user feel that the section has been authored with care. When implemented well, Scroll Distortion can make a familiar website pattern feel more premium without forcing the team into a heavy custom build.",

        "For developers, the practical value is speed. The effect gives a reusable starting point for a scroll-based visual distortion, while still leaving room to adapt spacing, timing, content, responsiveness, and visual treatment. For designers and founders, the value is perception. A section that responds well to scroll can make a website feel more expensive, more intentional, and more memorable. For Hyperiux, this is also a proof asset: it shows how small interaction decisions can change how a digital experience is perceived before the visitor has even reached a conversion point.",

        "Use Scroll Distortion when the section deserves attention and when the content benefits from movement. Avoid using it as a default animation on every page. Scroll effects should create clarity, emphasis, or atmosphere; they should not make navigation harder, slow the page down, or hide important information. The best implementation keeps the motion controlled, provides a mobile-friendly fallback, respects reduced-motion preferences, and preserves the same content in an accessible reading order. In the right place, Scroll Distortion helps the website feel less templated and more deliberately engineered.",
      ],

      bestUsedFor: [
        "Creative portfolio websites",
        "Agency websites",
        "Campaign microsites",
        "Immersive landing pages",
        "Visual case studies",
        "Experimental product launches",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Scroll Distortion effect to your project. This injects the component locally into your codebase so you can own, edit, and adapt the implementation without depending on a locked component package.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add scroll-distortion",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Choose the right section",
          body: "Place Scroll Distortion in a section where motion supports the message. It should help users understand, explore, or remember the content rather than simply decorate the page.",
        },

        {
          title: "Step 3: Prepare the content",
          body: "Pass a sections array into the component. Each object controls the fullscreen overlay text and image transition sequence while the shader handles the distortion behaviour.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import ScrollBasedImageDistortion from "@/components/showcase/ScrollBasedEffects/ImageDistortion/ScrollBasedImageDistortion";
import React from "react";

const sections = [
  { text: "SHADOW", src: "/assets/img/image01.webp" },
  { text: "FLOWER", src: "/assets/img/image02.webp" },
  { text: "RUN!!", src: "/assets/img/image03.webp" },
];

const shaderConfig = {
  strength: 0.8,
  rgbShift: 0.05,
  scale: 0.15,
  transitionDuration: 0.8,
  transitionEase: "power3.inOut",
};

export default function Page() {
  return (
    <ScrollBasedImageDistortion
      sections={sections}
      shaderConfig={shaderConfig}
      displacementSrc="/assets/img/distortion.jpg"
    />
  );
}`,
            },

            {
              type: "text",
              title: "How the data is passed",
              body: "The sections prop receives an array of fullscreen slides. Each object controls the overlay text and source image used inside the WebGL shader transition. The shaderConfig prop controls distortion intensity, RGB shift, scale, and transition timing while displacementSrc defines the distortion texture.",
            },
          ],
        },

        {
          title: "Step 4: Configure the motion behaviour",
          body: "Tune the movement direction, timing, easing, scroll distance, intensity, RGB shift, shader scaling, and interaction states. Start subtle and increase only if it improves comprehension or visual quality.",
          blocks: [
            {
              type: "props",
              title: "ScrollDistortion Props",
            },
          ],
        },

        {
          title: "Step 5: Test responsiveness",
          body: "Review the effect on desktop, tablet, and mobile. If the desktop interaction becomes cramped on smaller screens, switch to a simplified vertical stack, swipe pattern, or static fallback.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check scroll smoothness, image sizes, keyboard access, reduced-motion behaviour, and whether the content remains understandable when animation is disabled.",
          blocks: [
            {
              type: "code",
              title: "Shader Code",
              filename: "imageDistortion.js",
              language: "js",
              code: `export const ImageDistortionVertex = \`
 varying vec2 vUv;

 void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
\`

export const ImageDistortionFragment = \`
 uniform sampler2D u_texture0;
 uniform sampler2D u_texture1;
 uniform sampler2D u_displacement;
 uniform float u_progress;
 uniform float u_strength;
 uniform float u_rgbShift;
 uniform float u_scale;
 uniform vec2 u_resolution;
 uniform vec2 u_textureResolution0;
 uniform vec2 u_textureResolution1;

 varying vec2 vUv;

 vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
  float scale = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
  vec2 newSize = texRes * scale;
  return uv * (planeRes / newSize) + (newSize - planeRes) / 2.0 / newSize;
 }

 void main() {
  float disp = texture2D(u_displacement, vUv).r;
  disp = mix(disp, disp * (sin(vUv.y * 10.0 + u_progress * 6.28) * 0.5 + 0.5), 0.3);

  vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
  vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

  float scaleEffect = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
  vec2 center = vec2(0.5);

  vec2 distortedUV0 = (uv0 - center) / scaleEffect + center + u_progress * disp * u_strength * vec2(1.0, 0.5);
  vec2 distortedUV1 = (uv1 - center) * scaleEffect + center - (1.0 - u_progress) * disp * u_strength * vec2(1.0, 0.5);

  float rgbOffset = u_progress * (1.0 - u_progress) * u_rgbShift;

  vec4 tex0 = vec4(
   texture2D(u_texture0, distortedUV0 + vec2(rgbOffset, 0.0)).r,
   texture2D(u_texture0, distortedUV0).g,
   texture2D(u_texture0, distortedUV0 - vec2(rgbOffset, 0.0)).b,
   texture2D(u_texture0, distortedUV0).a
  );

  vec4 tex1 = vec4(
   texture2D(u_texture1, distortedUV1 + vec2(rgbOffset, 0.0)).r,
   texture2D(u_texture1, distortedUV1).g,
   texture2D(u_texture1, distortedUV1 - vec2(rgbOffset, 0.0)).b,
   texture2D(u_texture1, distortedUV1).a
  );

  gl_FragColor = mix(tex0, tex1, smoothstep(0.0, 1.0, u_progress));
 }
\`;`,
            },

            {
              type: "code",
              title: "Component Code",
              filename: "scroll-distortion.jsx",
              language: "jsx",
              code: `'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageDistortionVertex, ImageDistortionFragment } from './imageDistortion'
import { ReactLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

const defaultSections = [
  { text: 'SHADOW', src: '/assets/img/image01.webp' },
  { text: 'FLOWER', src: '/assets/img/image02.webp' },
  { text: 'RUN!!', src: '/assets/img/image03.webp' },
]

const defaultShaderConfig = {
  strength: 0.8,
  rgbShift: 0.05,
  scale: 0.15,
  transitionDuration: 1.5,
  transitionEase: 'power3.inOut',
}

export default function ScrollDistortion({
  sections = defaultSections,
  shaderConfig = {},
  displacementSrc = '/assets/img/distortion.jpg',
}) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  const imageRefs = useRef([])
  const texturesRef = useRef([])

  const hasInit = useRef(false)

  const config = { ...defaultShaderConfig, ...shaderConfig }

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return
    if (hasInit.current) return
    hasInit.current = true

    let renderer, scene, camera, mesh
    let currentIndex = 0
    let targetIndex = 0
    let isTransitioning = false

    const init = () => {
      const { clientWidth: w, clientHeight: h } = containerRef.current

      texturesRef.current = imageRefs.current.map((img) => {
        const texture = new THREE.Texture(img)
        texture.needsUpdate = true
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.minFilter = THREE.LinearFilter
        return texture
      })

      const displacement = new THREE.Texture(
        imageRefs.current[sections.length]
      )

      displacement.needsUpdate = true

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })

      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(renderer.domElement)

      scene = new THREE.Scene()

      camera = new THREE.OrthographicCamera(
        -w / 2,
        w / 2,
        h / 2,
        -h / 2,
        -1,
        1
      )

      const geometry = new THREE.PlaneGeometry(w, h)

      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_texture0: { value: texturesRef.current[0] },
          u_texture1: { value: texturesRef.current[0] },
          u_displacement: { value: displacement },
          u_progress: { value: 0 },
          u_resolution: { value: new THREE.Vector2(w, h) },
          u_textureResolution0: { value: new THREE.Vector2(1, 1) },
          u_textureResolution1: { value: new THREE.Vector2(1, 1) },
          u_strength: { value: config.strength },
          u_rgbShift: { value: config.rgbShift },
          u_scale: { value: config.scale },
        },
        vertexShader: ImageDistortionVertex,
        fragmentShader: ImageDistortionFragment,
        transparent: true,
      })

      const setRes = (index, texture) => {
        if (texture?.image) {
          material.uniforms[\`u_textureResolution\${index}\`].value.set(
            texture.image.width,
            texture.image.height
          )
        }
      }

      setRes(0, texturesRef.current[0])
      setRes(1, texturesRef.current[0])

      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const transitionTo = (index) => {
        if (
          index < 0 ||
          index >= texturesRef.current.length ||
          index === currentIndex ||
          isTransitioning
        ) {
          targetIndex = index
          return
        }

        targetIndex = index
        isTransitioning = true

        material.uniforms.u_texture1.value = texturesRef.current[index]
        setRes(1, texturesRef.current[index])

        gsap.to(material.uniforms.u_progress, {
          value: 1,
          duration: config.transitionDuration,
          ease: config.transitionEase,
          onComplete: () => {
            material.uniforms.u_texture0.value =
              texturesRef.current[index]

            setRes(0, texturesRef.current[index])

            material.uniforms.u_progress.value = 0

            currentIndex = index
            isTransitioning = false

            if (targetIndex !== currentIndex) {
              transitionTo(targetIndex)
            }
          },
        })
      }

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: \`+=\${(sections.length - 1) * 100}%\`,
        scrub: true,
        onUpdate: (self) => {
          const index = Math.round(
            self.progress * (sections.length - 1)
          )

          transitionTo(index)
        },
      })

      const render = () => {
        renderer.render(scene, camera)
        requestAnimationFrame(render)
      }

      render()
    }

    init()
  }, [sections, config])

  return (
    <ReactLenis root options={{ autoRaf: true, duration: 2 }}>
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: \`\${sections.length * 100}vh\` }}
      >
        <div className="hidden">
          {sections.map((s, i) => (
            <img
              key={i}
              ref={(el) => (imageRefs.current[i] = el)}
              src={s.src}
              alt=""
            />
          ))}

          <img
            ref={(el) =>
              (imageRefs.current[sections.length] = el)
            }
            src={displacementSrc}
            alt=""
          />
        </div>

        <div
          ref={containerRef}
          className="sticky top-0 h-screen w-full bg-black"
        />

        <div className="absolute inset-0 z-10 pointer-events-none">
          {sections.map((s, i) => (
            <div
              key={i}
              className="h-screen flex items-center justify-center"
            >
              <h1 className="text-[10vw] text-white">
                {s.text}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </ReactLenis>
  )
}`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Motion intensity",
          recommendation:
            "Keep restrained for premium layouts; increase only for expressive campaign pages.",
        },
        {
          option: "Scroll distance",
          recommendation:
            "Match the content length. Avoid making users scroll too long for a small amount of information.",
        },
        {
          option: "Content density",
          recommendation:
            "Use short, scannable content. Dense text usually weakens animated scroll sections.",
        },
        {
          option: "Visual hierarchy",
          recommendation:
            "Use clear titles, contrast, and spacing so motion does not fight readability.",
        },
        {
          option: "Mobile behaviour",
          recommendation:
            "Simplify the effect or convert it into a native mobile-friendly layout.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Provide a static or low-motion fallback for users who prefer reduced motion.",
        },
      ],

      notes: {
        performance:
          "Scroll Distortion should be implemented with performance in mind. Prefer transform and opacity-based movement, optimize all images or media, avoid unnecessary layout recalculation, and test scroll smoothness on lower-powered devices before shipping the effect on a production page.",

        accessibility:
          "The content should remain understandable and reachable even when animation is disabled. Preserve logical DOM order, keyboard access, readable labels, focus states, and reduced-motion fallbacks.",

        mobile:
          "On mobile, simplify the motion where necessary. Complex desktop scroll interactions often work better as vertical stacks, native horizontal scroll, swipeable sliders, or static layouts on smaller screens.",
      },

      commonMistakes: [
        "Using the effect because it looks impressive rather than because the section needs it.",
        "Adding too much movement and making the page feel unstable.",
        "Ignoring mobile behaviour and touch interaction.",
        "Using oversized images, heavy filters, or too many animated elements.",
        "Hiding important information inside animation-only states.",
        "Forgetting keyboard access, focus states, or reduced-motion handling.",
      ],

      relatedEffectNames: [
        "SVG Pixel Reveal",
        "Interactive Blur Reveal",
        "Mouse Pixelation",
        "Parallax Gallery",
        "Split Canvas",
      ],

      faq: [
        {
          question: "What is Scroll Distortion best used for?",
          answer:
            "Scroll Distortion is best used when the page section benefits from motion, sequence, depth, or progressive visual focus. It is strongest for creative portfolio websites, agency websites, campaign microsites, immersive landing pages, visual case studies, and experimental product launches.",
        },
        {
          question: "Can I use Scroll Distortion in Next.js?",
          answer:
            "Yes. If the implementation relies on browser APIs, scroll listeners, GSAP, Motion, Canvas, or WebGL, place it inside a client component and test it with your routing and layout setup.",
        },
        {
          question: "Is Scroll Distortion suitable for mobile?",
          answer:
            "Yes, but the mobile version should often be simplified. Some scroll effects work better as swipeable sections, vertical stacks, or static layouts on small screens.",
        },
        {
          question:
            "Does Scroll Distortion require GSAP or another dependency?",
          answer:
            "The exact dependency depends on the implementation. The effect page should list whether it uses GSAP, Motion, Lenis, Canvas, SVG, Three.js, React Three Fiber, or no external animation library.",
        },
        {
          question: "Can Hyperiux customize Scroll Distortion for a website?",
          answer:
            "Yes. Hyperiux can adapt the motion behaviour, layout, responsive states, visual style, and content model of Scroll Distortion into a custom website section.",
        },
      ],

      finalCta: {
        body: "Use Scroll Distortion when your website section needs a more intentional interaction layer instead of another static block.",
        primary: "Install Scroll Distortion",
        secondary: "View Scroll Effects",
        commercial: "Request a Custom Scroll-Based Visual Distortion",
      },
    },
  },
  "backgrounds": {
    "spider-particles": {
      seo: {
        primaryKeyword: "React spider particles background",
        secondaryKeywords: [
          "spider web particles React",
          "interactive particle background",
          "Three.js spider particles",
          "cursor particle effect",
          "React particle web",
          "Next.js particle background",
          "animated web background",
        ],
        title:
          "Spider Particles Background for React & Next.js | Hyperiux Vault",
        description:
          "Add an interactive spider particles background to your React or Next.js website. Build immersive cursor-based particle webs with Three.js, customize glow, density, and connections, and create futuristic landing pages and experimental interfaces.",
      },

      h1: "Spider Particles Background for React and Next.js",

      shortDescription:
        "An interactive spider web particle background for futuristic landing pages, creative developer portfolios, AI interfaces, and immersive technical websites.",

      heroCopy: [
        "Spider Particles is one of the most immersive interactive background effects because it reacts directly to cursor movement and creates a living network of particles around the user. Instead of behaving like a passive decorative background, the effect makes the interface feel responsive, intelligent, and spatial. It creates a sense of depth and interaction that works especially well for experimental products, AI tools, creative portfolios, technical showcases, gaming interfaces, and futuristic landing pages.",

        "The effect works by placing particles across a grid and dynamically connecting nearby particles to the cursor with animated web lines. As the user moves across the screen, the network expands and contracts naturally, creating the feeling of an intelligent digital system responding in real time. This makes the page feel more tactile and cinematic without requiring large 3D scenes or complex visual assets.",

        "Spider Particles is especially effective for hero sections because it immediately creates motion and atmosphere while still leaving room for typography and product messaging. For AI products, it can suggest neural systems, data flow, intelligence, or machine interaction. For developer tools and technical products, it reinforces an engineering-led visual identity. For creative agencies and portfolios, it creates a memorable first impression that feels interactive instead of static.",

        "The strongest versions of this effect are subtle and controlled. The interaction should feel smooth and atmospheric rather than aggressive. Particle density, connection distance, glow intensity, and spotlight radius should all be tuned carefully so the visual system feels elegant instead of chaotic. The background should support the experience, not overpower the interface itself.",

        "Spider Particles performs best on desktop because the effect depends heavily on cursor interaction. On mobile devices, simplified fallbacks or reduced interactivity are recommended. Since the effect uses WebGL and Three.js rendering, performance optimization is important for production use. Particle count, connection radius, and animation complexity should be adjusted depending on the design requirements and device constraints.",

        "Use Spider Particles when your website needs a futuristic interactive background that feels dynamic, technical, immersive, and visually alive without relying on heavy 3D scenes or complex simulations.",
      ],

      bestUsedFor: [
        "AI product websites",
        "Experimental landing pages",
        "Developer portfolios",
        "Technical showcases",
        "Gaming interfaces",
        "Creative technology brands",
        "Interactive hero sections",
        "Futuristic dashboards",
        "Product reveal pages",
        "Digital art experiences",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Use the Hyperiux CLI to add the Spider Particles effect to your project. This injects the component directly into your codebase so you can fully customize particle behaviour, glow intensity, interaction radius, spacing, and responsiveness.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add spider-particles",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Place the component",
          body: "Place SpiderParticles inside a full-screen hero section or immersive page wrapper where the cursor interaction can become part of the overall experience. The effect works best when users have enough visual space to explore the interaction naturally.",
        },

        {
          title: "Step 3: Render the effect",
          body: "Import the SpiderParticles component and render it directly inside your page or section. The component manages particle generation, mouse interaction, WebGL rendering, and animation internally.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import React from "react";
import SpiderParticles from "@/components/Particles/SpiderParticles";

const page = () => {
  return <SpiderParticles />;
};

export default page;`,
            },

            {
              type: "text",
              title: "How the component works",
              body: "SpiderParticles generates a responsive particle grid using Three.js and dynamically connects nearby particles to the cursor during movement. The component handles rendering, interaction logic, glow effects, spotlight behaviour, responsive scaling, and animation updates internally.",
            },
          ],
        },

        {
          title: "Step 4: Configure particle behaviour",
          body: "Adjust particle count, connection distance, spotlight radius, glow settings, and grid spacing to control the atmosphere of the effect. Lower density creates a cleaner interface while higher density produces a more immersive and cinematic visual system.",
          blocks: [
            {
              type: "props",
              title: "SpiderParticles Props",
            },
          ],
        },

        {
          title: "Step 5: Optimize for responsiveness",
          body: "Test the effect across desktop, tablet, and mobile layouts. Cursor-based interaction systems often need reduced density, lower connection counts, and simplified visuals on smaller devices to preserve clarity and performance.",
        },

        {
          title: "Step 6: Review performance and accessibility",
          body: "Check rendering performance, cursor responsiveness, GPU usage, resize handling, accessibility fallbacks, and reduced-motion behaviour before deploying the effect in production. The interaction should feel smooth without overwhelming the surrounding layout or distracting from the page content.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              filename: "spider-particles.jsx",
              language: "jsx",
              code: `"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOUSE_OFFSCREEN = -9999;
const MOUSE_THRESHOLD = -9000;

const LERP_SPEED = 0.1;
const FADE_SPEED = 0.04;

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ \`
  uniform float uSize;
  uniform vec2  uMouse;
  uniform float uSpotlightRadius;

  void main() {
    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist  = distance(position.xy, uMouse);

    float scale = dist < uSpotlightRadius
      ? 1.0 - (dist / uSpotlightRadius)
      : 0.0;

    gl_PointSize = uSize * scale;
    gl_Position  = projectionMatrix * mvPos;
  }
\`;

const CURSOR_VERT = /* glsl */ \`
  uniform float uSize;

  void main() {
    vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = uSize;
    gl_Position  = projectionMatrix * mvPos;
  }
\`;

const POINT_FRAG = /* glsl */ \`
  uniform vec3  uColor;
  uniform vec3  uGlow;
  uniform bool  uGlowEnabled;
  uniform float uAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);

    if (d > 0.5) discard;

    if (uGlowEnabled) {
      float core  = smoothstep(0.5, 0.0, d);
      float glow  = smoothstep(0.5, 0.1, d) * 0.6;

      vec3  col   = mix(uGlow, uColor, core);
      float alpha = (core + glow) * uAlpha;

      gl_FragColor = vec4(col, alpha);
    } else {
      float alpha = smoothstep(0.5, 0.45, d) * uAlpha;

      gl_FragColor = vec4(uColor, alpha);
    }
  }
\`;

export default function SpiderParticles({
  particleCount = 180,
  gridGap = 0,
  particleSize = 20.0,
  mouseConnectDist = 160,
  spotlightRadius = 300,
  particlesGlow = false,
  glowColor = 0xffffff,
  particleColor = 0xffffff,
  webColor = 0xffffff,
  centerColor = 0xffffff,
}) {
  const mountRef = useRef(null);

  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    let animId;

    const _glowColor = new THREE.Color(glowColor);
    const _particleColor = new THREE.Color(particleColor);
    const _webColor = new THREE.Color(webColor);
    const _centerColor = new THREE.Color(centerColor);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);

    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -500,
      500
    );

    camera.position.z = 1;

    const mouse = new THREE.Vector2(
      MOUSE_OFFSCREEN,
      MOUSE_OFFSCREEN
    );

    const smoothMouse = new THREE.Vector2(
      MOUSE_OFFSCREEN,
      MOUSE_OFFSCREEN
    );

    let mouseEntryAlpha = 0;
    let mousePresent = false;
    let mouseJustEntered = false;

    const isDesktop = () => window.innerWidth >= 768;

    const onMove = (e) => {
      if (!isDesktop()) return;

      const rect = mount.getBoundingClientRect();

      mouse.set(
        e.clientX - rect.left - width / 2,
        -(e.clientY - rect.top - height / 2)
      );

      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const onEnter = (e) => {
      if (!isDesktop()) return;

      const rect = mount.getBoundingClientRect();

      mouse.set(
        e.clientX - rect.left - width / 2,
        -(e.clientY - rect.top - height / 2)
      );

      mouseJustEntered = true;
      mousePresent = true;

      setActive(true);
    };

    const onLeave = () => {
      if (!isDesktop()) return;

      mousePresent = false;
      mouseJustEntered = false;

      setActive(false);
    };

    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);

    let cols;
    let rows;
    let actualCount;
    let spacingX;
    let spacingY;

    if (gridGap > 0) {
      cols = Math.max(1, Math.floor(width / gridGap));
      rows = Math.max(1, Math.floor(height / gridGap));

      actualCount = cols * rows;

      spacingX = spacingY = gridGap;
    } else {
      actualCount = particleCount;

      const aspect = width / height;

      rows = Math.max(
        1,
        Math.round(Math.sqrt(actualCount / aspect))
      );

      cols = Math.ceil(actualCount / rows);

      spacingX = width / cols;
      spacingY = height / rows;
    }

    const positions = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);

      positions[i * 3] =
        (c + 0.5) * spacingX - width / 2;

      positions[i * 3 + 1] =
        (r + 0.5) * spacingY - height / 2;

      positions[i * 3 + 2] = 0;
    }

    const particleGeo = new THREE.BufferGeometry();

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: _particleColor,
        },
        uGlow: {
          value: _glowColor,
        },
        uSize: {
          value:
            particleSize * window.devicePixelRatio,
        },
        uMouse: {
          value: new THREE.Vector2(
            MOUSE_OFFSCREEN,
            MOUSE_OFFSCREEN
          ),
        },
        uSpotlightRadius: {
          value: spotlightRadius,
        },
        uGlowEnabled: {
          value: particlesGlow,
        },
        uAlpha: {
          value: 0.0,
        },
      },

      vertexShader: PARTICLE_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(
      particleGeo,
      particleMat
    );

    scene.add(particles);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      mouseEntryAlpha = mousePresent
        ? Math.min(
            1,
            mouseEntryAlpha + FADE_SPEED
          )
        : Math.max(
            0,
            mouseEntryAlpha - FADE_SPEED
          );

      if (
        mousePresent &&
        mouse.x > MOUSE_THRESHOLD
      ) {
        if (mouseJustEntered) {
          smoothMouse.copy(mouse);

          mouseJustEntered = false;
        } else {
          smoothMouse.x +=
            (mouse.x - smoothMouse.x) *
            LERP_SPEED;

          smoothMouse.y +=
            (mouse.y - smoothMouse.y) *
            LERP_SPEED;
        }
      }

      particleMat.uniforms.uMouse.value.copy(
        smoothMouse
      );

      particleMat.uniforms.uAlpha.value =
        mouseEntryAlpha;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);

      if (mount) {
        mount.removeEventListener(
          "mousemove",
          onMove
        );

        mount.removeEventListener(
          "mouseenter",
          onEnter
        );

        mount.removeEventListener(
          "mouseleave",
          onLeave
        );

        if (
          mount.contains(renderer.domElement)
        ) {
          mount.removeChild(
            renderer.domElement
          );
        }
      }

      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [
    particleCount,
    gridGap,
    particleSize,
    mouseConnectDist,
    spotlightRadius,
    particlesGlow,
    glowColor,
    particleColor,
    webColor,
    centerColor,
  ]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    />
  );
}
`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Particle count",
          recommendation:
            "Lower counts feel cleaner and more premium while higher counts create a denser cinematic web.",
        },
        {
          option: "Connection distance",
          recommendation:
            "Use restrained connection ranges to avoid excessive visual noise.",
        },
        {
          option: "Spotlight radius",
          recommendation:
            "Increase for softer interaction spread and reduce for tighter cursor focus.",
        },
        {
          option: "Glow intensity",
          recommendation:
            "Keep glow subtle for technical and premium interfaces instead of overpowering brightness.",
        },
        {
          option: "Grid spacing",
          recommendation:
            "Wider spacing feels minimal while tighter spacing creates a more complex network.",
        },
        {
          option: "Mobile responsiveness",
          recommendation:
            "Reduce particle density and interaction complexity on smaller screens for smoother performance.",
        },
      ],

      notes: {
        performance:
          "Spider Particles uses WebGL and Three.js rendering, so performance optimization is important for production use. Prefer restrained particle counts, optimized animation loops, and efficient GPU transforms to maintain smooth interaction across devices.",

        accessibility:
          "The background should never overpower the main content. Maintain readable contrast, support reduced-motion preferences, and ensure that important interface elements remain visually clear during interaction.",

        mobile:
          "On mobile devices, simplify interaction complexity and reduce particle density. Cursor-based systems are naturally desktop-focused, so smaller screens benefit from cleaner visuals and less aggressive animation.",
      },

      commonMistakes: [
        "Using too many particles and reducing performance.",
        "Making the glow intensity excessively bright.",
        "Using large connection distances that create visual clutter.",
        "Placing important text directly inside dense interaction zones.",
        "Ignoring reduced-motion accessibility preferences.",
        "Using aggressive animation that distracts from content.",
        "Forgetting to optimize responsiveness for smaller devices.",
      ],

      relatedEffectNames: [
        "Dotted Grid",
        "Spider Field",
        "Particle Network",
        "Grid Tunnel",
        "Dither Canvas",
      ],

      faq: [
        {
          question: "What is Spider Particles best used for?",
          answer:
            "Spider Particles works best for immersive hero sections, AI interfaces, technical showcases, experimental landing pages, developer portfolios, gaming websites, and futuristic digital experiences.",
        },

        {
          question: "Does Spider Particles require Three.js?",
          answer:
            "Yes. The effect relies on Three.js and WebGL rendering to manage particles, cursor interaction, dynamic line generation, and animation performance.",
        },

        {
          question: "Is Spider Particles suitable for mobile devices?",
          answer:
            "Yes, but the interaction should usually be simplified on mobile. Reduced particle density and lighter visual complexity help preserve usability and performance.",
        },

        {
          question: "Can I customize the interaction behaviour?",
          answer:
            "Yes. You can customize particle count, glow colour, spotlight radius, connection distance, grid spacing, particle sizing, and overall visual intensity.",
        },

        {
          question: "Can Hyperiux customize Spider Particles for a website?",
          answer:
            "Yes. Hyperiux can customize the interaction system, particle behaviour, visual styling, responsiveness, branding, and motion direction to match a product or website experience.",
        },
      ],

      finalCta: {
        body: "Use Spider Particles when your website needs an immersive interactive background that feels technical, cinematic, and visually alive.",
        primary: "Install Spider Particles",
        secondary: "View Interactive Effects",
        commercial: "Request a Custom Particle Experience",
      },
    },
    "dotted-grid": {
      seo: {
        primaryKeyword: "React dotted grid background",
        secondaryKeywords: [
          "dotted background React",
          "CSS dotted grid background",
          "Next.js dotted background",
          "animated dotted grid",
          "SaaS website background",
          "React background effect",
        ],
        title: "Dotted Grid Background for React & Next.js | Hyperiux Vault",
        description:
          "Add a clean dotted grid background to your React or Next.js website. Preview the effect, install it with the Hyperiux CLI, and customize it for SaaS, AI, product, developer tool, and technical landing pages.",
      },

      h1: "Dotted Grid Background for React and Next.js",

      shortDescription:
        "A clean dotted grid background for SaaS, AI, product, developer tool, and technical landing pages.",

      heroCopy: [
        "The Dotted Grid effect is the most commercially useful background effect in this category because it solves a common design problem: how do you make a technical or product website feel structured without making it visually heavy? Many SaaS, AI, fintech, developer tool, and product websites need a background system that adds depth, precision, and atmosphere. But full illustrations can feel too specific. Gradients can feel generic. 3D backgrounds can be too heavy. Dotted Grid offers a cleaner middle ground.",

        "A dotted grid gives the page a sense of structure. It suggests systems, alignment, product thinking, technical architecture, interface design, or digital infrastructure without needing to explain any of that directly. It works especially well behind hero sections, feature blocks, product mockups, pricing sections, CTA areas, documentation intros, and developer-facing pages. The grid adds visual order while allowing the main content to stay clear.",

        "For SaaS landing pages, Dotted Grid can help the hero section feel more designed without distracting from the product message. For AI product pages, it can suggest technical depth and system intelligence. For developer tool websites, it can reinforce a precise, engineering-led visual identity. For agencies and portfolios, it can add a clean structural layer behind case studies, project sections, or service pages.",

        "The effect is powerful because it is flexible. It can be static, lightly animated, radial, masked, faded at the edges, used in dark mode, used in light mode, or blended with gradients. It can be subtle enough for enterprise products or more expressive for creative technology brands. It can sit behind text, but only when contrast is carefully managed.",

        "The biggest mistake is making the grid too visible. A background should support hierarchy, not compete with it. If the dots are too large, too bright, too dense, or too animated, the page can feel noisy. The best version feels almost invisible at first glance but adds polish when the user looks closer.",

        "Use Dotted Grid when your website needs a background that feels modern, technical, lightweight, and highly usable. It is one of the safest background effects for production websites because it gives visual depth without sacrificing performance or clarity.",
      ],

      bestUsedFor: [
        "SaaS landing pages",
        "AI product websites",
        "Developer tool websites",
        "Fintech websites",
        "Technical product pages",
        "Documentation intros",
        "Hero backgrounds",
        "Feature sections",
        "CTA blocks",
        "Dashboard marketing pages",
      ],

      tutorial: [
        {
          title: "Step 1: Install the effect",
          body: "Install the effect using the Hyperiux CLI.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add dotted-grid",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Place the background correctly",
          body: "Place the Dotted Grid component inside a hero, feature, CTA, pricing, or page wrapper section. Keep content layered above the background.",
        },

        {
          title: "Step 3: Add the component",
          body: "Import the Dotted Grid component and render it inside your page or layout. The background fills the container and creates a structured technical visual layer behind the content.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import DottedGrid from "@/components/DottedGrid/DottedGrid";
import React from "react";

const page = () => {
  return (
    <DottedGrid />
  );
};

export default page;
`,
            },
          ],
        },

        {
          title: "Step 4: Adjust spacing and density",
          body: "Set the dot size, grid spacing, and density. Tighter grids feel more technical; wider grids feel more premium and editorial.",
        },

        {
          title: "Step 5: Keep the grid subtle",
          body: "Keep the grid subtle. Use neutral tones, soft contrast, or brand accent colours only where appropriate. Use radial masks, edge fades, or gradient overlays to prevent the grid from feeling too rigid across the entire section.",
        },

        {
          title: "Step 6: Tune responsiveness and polish",
          body: "Tune grid colour, opacity, and contrast separately for light and dark backgrounds. Review responsiveness, motion intensity, pointer behaviour, and overall readability across desktop and mobile layouts.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              filename: "dotted-grid.jsx",
              language: "jsx",
              code: `"use client";

import { useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPACING = 24;
const BASE_RADIUS = 7.2;
const MOUSE_RADIUS = 380;
const TRAIL_LENGTH = 456;
const TRAIL_RADIUS = 230;
const TRAIL_FADE_MS = 1200;

const RANDOM_TIME = 0.6;
const COLLECT_TIME = 1.1;
const SHAPE_HOLD_TIME = 1.2;
const GRAY_DISPERSE_TIME = 0.9;

const TOTAL_CYCLE_TIME =
  RANDOM_TIME +
  COLLECT_TIME +
  SHAPE_HOLD_TIME +
  GRAY_DISPERSE_TIME;

const TOTAL_SHAPES = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp = (a, b, t) => a + (b - a) * t;

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const smoothstep = (e0, e1, v) => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// ─── Pure Shape Math ──────────────────────────────────────────────────────────

const getStarStrength = (x, y, time, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.28;

  const nx = (x - cx) / scale;
  const ny = (y - cy) / scale;

  const r = Math.sqrt(nx * nx + ny * ny);
  const angle = Math.atan2(ny, nx);

  const spikes = 5;
  const star = Math.cos(spikes * angle);
  const radius = 0.55 + 0.25 * star;

  return clamp01(
    1 - smoothstep(radius - 0.05, radius + 0.05, r)
  );
};

const getSquareStrength = (x, y, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.26;

  const rx = (x - cx) / scale;
  const ry = (y - cy) / scale;

  const d = Math.max(Math.abs(rx), Math.abs(ry));

  return clamp01(1 - smoothstep(0.78, 0.82, d));
};

const getCircleRingStrength = (x, y, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.28;

  const r = Math.sqrt(
    ((x - cx) / scale) ** 2 +
    ((y - cy) / scale) ** 2
  );

  return clamp01(
    1 - smoothstep(0.13, 0.17, Math.abs(r - 0.72))
  );
};

const getPlusStrength = (x, y, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.27;

  const rx = (x - cx) / scale;
  const ry = (y - cy) / scale;

  const thickness = 0.18;
  const length = 0.75;

  const vertical =
    Math.abs(rx) < thickness &&
    Math.abs(ry) < length;

  const horizontal =
    Math.abs(ry) < thickness &&
    Math.abs(rx) < length;

  const d = Math.min(
    Math.max(
      Math.abs(rx) - thickness,
      Math.abs(ry) - length
    ),
    Math.max(
      Math.abs(ry) - thickness,
      Math.abs(rx) - length
    )
  );

  return vertical || horizontal
    ? 1
    : clamp01(1 - smoothstep(0, 0.06, d));
};

const getTriangleStrength = (
  x,
  y,
  time,
  width,
  height
) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.32;

  const rotation = Math.sin(time * 0.3) * 0.12;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const rx =
    ((x - cx) * cos - (y - cy) * sin) / scale;

  const ry =
    ((x - cx) * sin + (y - cy) * cos) / scale;

  const a = Math.abs(rx) * 0.9 + ry * 0.52;
  const b = -ry * 0.95;

  return clamp01(
    1 - smoothstep(0.38, 0.48, Math.max(a, b))
  );
};

const getRawShapeStrength = (
  shapeIndex,
  x,
  y,
  time,
  width,
  height
) => {
  const i = shapeIndex % TOTAL_SHAPES;

  if (i === 0)
    return getStarStrength(x, y, time, width, height);

  if (i === 1)
    return getSquareStrength(x, y, width, height);

  if (i === 2)
    return getCircleRingStrength(x, y, width, height);

  if (i === 3)
    return getPlusStrength(x, y, width, height);

  return getTriangleStrength(
    x,
    y,
    time,
    width,
    height
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DottedGrid() {
  const canvasRef = useRef(null);

  const patternRef = useRef({
    currentShapeIndex: 0,
    transitionStartTime: null,
  });

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    trail: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationId;
    let dots = [];

    // ─── Dot Setup ─────────────────────────────────────────────────────────────

    const createDots = () => {
      dots = [];

      for (
        let y = SPACING / 2;
        y < height;
        y += SPACING
      ) {
        for (
          let x = SPACING / 2;
          x < width;
          x += SPACING
        ) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 1.0,
            randomOffset: Math.random() * 10,
            currentShapeStrength: 0,
            currentRandomStrength: 1,
            currentMouseStrength: 0,
            currentTrailStrength: 0,
            currentGrayDisperseStrength: 0,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createDots();
    };

    // ─── Event Handlers ────────────────────────────────────────────────────────

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active = true;

      mouseRef.current.trail.push({
        x,
        y,
        t: performance.now(),
      });

      if (
        mouseRef.current.trail.length >
        TRAIL_LENGTH
      ) {
        mouseRef.current.trail.shift();
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = () => {
      patternRef.current.currentShapeIndex =
        (patternRef.current.currentShapeIndex + 1) %
        TOTAL_SHAPES;

      patternRef.current.transitionStartTime =
        performance.now() * 0.001;
    };

    // ─── Main Loop ─────────────────────────────────────────────────────────────

    const animate = (ms) => {
      const time = ms * 0.001;

      const mouse = mouseRef.current;
      const now = performance.now();

      mouse.x = lerp(mouse.x, mouse.targetX, 0.12);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.12);

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (const dot of dots) {
        // animation logic...
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();

    window.addEventListener("resize", resize);

    canvas.addEventListener(
      "pointermove",
      handlePointerMove
    );

    canvas.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    canvas.addEventListener("click", handleClick);

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);

      canvas.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      canvas.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      canvas.removeEventListener(
        "click",
        handleClick
      );

      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-pointer touch-none bg-black"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 via-transparent to-black/40" />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />

      <div className="hidden max-sm:flex fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-center text-sm leading-tight pointer-events-none">
        Works best on desktop
        <br />
        Here, tap & drag to explore
      </div>
    </section>
  );
}
`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Grid spacing",
          recommendation:
            "Tighter spacing creates a more technical system feel while wider spacing feels cleaner and more premium.",
        },
        {
          option: "Dot size",
          recommendation:
            "Keep dots small and restrained so the background supports the layout instead of competing with it.",
        },
        {
          option: "Opacity",
          recommendation:
            "Use subtle opacity values to maintain readability across large sections.",
        },
        {
          option: "Edge masking",
          recommendation:
            "Use radial fades or gradient overlays to soften the outer boundaries of the grid.",
        },
        {
          option: "Dark and light mode",
          recommendation:
            "Tune grid contrast independently for dark and light themes instead of using the same values globally.",
        },
        {
          option: "Motion intensity",
          recommendation:
            "Keep movement minimal and ambient for production product pages and technical layouts.",
        },
      ],

      notes: {
        performance:
          "Dotted Grid should be lightweight. Prefer CSS-based implementation where possible. Avoid expensive canvas or animation logic if a static CSS background achieves the same result.",

        accessibility:
          "Make sure the background does not reduce text contrast. Avoid placing dense dotted patterns directly behind small body copy, form labels, or important CTAs.",

        mobile:
          "On mobile, reduce density and contrast. Dense dot patterns can make small layouts feel busy.",
      },

      commonMistakes: [
        "Making dots too bright",
        "Using too much grid density",
        "Placing the grid behind small text",
        "Over-animating the background",
        "Not tuning for light and dark mode",
        "Using strong brand colours everywhere",
        "Forgetting responsive spacing",
      ],

      relatedEffectNames: [
        "Dither Canvas",
        "Spider Particles",
        "Square Translate",
        "Grid Lift",
        "Grid Tunnel",
      ],

      faq: [
        {
          question: "Is Dotted Grid suitable for SaaS websites?",
          answer:
            "Yes. It is one of the safest background effects for SaaS, AI, fintech, developer tools, and product marketing websites.",
        },
        {
          question: "Does Dotted Grid need JavaScript?",
          answer:
            "Usually no. A dotted grid can often be implemented with CSS, making it lightweight and production-friendly.",
        },
        {
          question: "Can the grid be animated?",
          answer:
            "Yes, but animation should be subtle. For most product pages, a static or lightly masked grid is enough.",
        },
        {
          question: "Can I use it behind text?",
          answer:
            "Yes, if contrast is carefully managed. Keep opacity low and avoid dense patterns behind long body copy.",
        },
      ],

      finalCta: {
        body: "Use Dotted Grid when your product page needs structure, depth, and a clean technical background without visual noise.",
        primary: "Install Dotted Grid",
        secondary: "View Background Effects",
        commercial: "Request a Custom Dotted Grid Background",
      },
    },
    
  },
  "components": {
    "hover-stack": {
      seo: {
        primaryKeyword: "React hover stack cards",
        secondaryKeywords: [
          "stacked cards React",
          "hover stack component",
          "interactive card stack",
          "Next.js stacked cards",
          "animated card stack",
          "portfolio hover cards",
        ],

        title: "Hover Stack Cards for React & Next.js | Hyperiux Vault",

        description:
          "Create interactive stacked card layouts for React and Next.js websites. Add hover-based depth, layered motion, and premium card interactions for portfolios, SaaS websites, agencies, testimonials, and product sections.",
      },

      h1: "Hover Stack Cards for React and Next.js",

      shortDescription:
        "An interactive stacked card component for portfolios, SaaS websites, agencies, testimonials, and premium content layouts.",

      heroCopy: [
        "The Hover Stack component is designed for websites that want stacked content to feel interactive without requiring scroll sequences or complex navigation. A stack of cards naturally suggests depth, hierarchy, and grouped information. Hover Stack adds a direct interaction: when users hover over the stack or a specific card, the layers can spread, lift, shift, fan out, or reveal additional content. This makes the stack feel more tactile and discoverable.",

        "This component is especially useful for portfolios, agency websites, product cards, feature previews, service blocks, team sections, testimonial cards, resource cards, and creative landing pages. It can turn a compact content block into something more engaging. Instead of displaying all details upfront, the stack can reveal depth through hover interaction.",

        "For portfolios, Hover Stack can show multiple project images or case study previews in a compact footprint. For agency websites, it can present service layers, process steps, deliverables, or proof points. For SaaS and product websites, it can show related features, product cards, use cases, or interface states. For editorial or resource pages, it can make article groups or content previews feel more dynamic.",

        "The effect works best when the stack has a clear purpose. If the layers are purely decorative, users may interact once and move on. If each layer communicates something useful - an image, stat, label, preview, or CTA - the interaction becomes more valuable. The hover behaviour should also be predictable. Users should understand that the stack can be interacted with and should not lose access to content when hover ends.",

        "The biggest risk is hiding important information behind hover. Since hover is not available on most touch devices, critical content should remain accessible in another format. On mobile, the stack can become a tap-to-expand component, swipeable cards, or a vertical list.",

        "Use Hover Stack when a compact content group needs depth, motion, and tactile interaction. It is best for creative and marketing websites where card-based content should feel more premium than a static grid.",
      ],

      bestUsedFor: [
        "Portfolio previews",
        "Project cards",
        "Service cards",
        "Product feature cards",
        "Team cards",
        "Testimonial groups",
        "Resource cards",
        "Process previews",
        "Creative landing pages",
        "Agency capability sections",
      ],

      tutorial: [
        {
          title: "Step 1: Install the component",

          body: "Install the Hover Stack component using the Hyperiux CLI.",

          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add hover-stack",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Create a card group",

          body: "Create a small group of cards with images, labels, titles, testimonials, or short descriptions. Keep each card visually simple so the interaction stays clear.",
        },

        {
          title: "Step 3: Add the component",

          body: "Import the Hover Stack component and pass your card data into the layout. The stack automatically creates layered depth and interactive hover behaviour.",

          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",

              code: `import StackedHoverCards from "@/components/StackHoverCards/StackedHoverCards";
import React from "react";

const cards = [
  {
    id: 1,
    quote:
      "A must-have for anyone looking to save time and boost productivity.",
    tag: "Efficiency",
    bg: "#E4FF1A",
    accent: "text-[#1A1A1A]",
  },

  {
    id: 2,
    quote:
      "This tech has completely streamlined my daily tasks.",
    tag: "Workflow",
    bg: "#DD1155",
    accent: "text-[#ffffff]",
  },

  {
    id: 3,
    quote:
      "Innovative and powerful, yet so easy to use!",
    tag: "Simplicity",
    bg: "#FF5714",
    accent: "text-[#1A1A1A]",
  },
];

const TestimonialsSection = () => {
  return (
    <StackedHoverCards
      cards={cards}
      cardWidth={280}
      cardHeight={360}
      overlap={96}
      pushDistance={235}
      hoverLift={30}
    />
  );
};

export default TestimonialsSection;
`,
            },
          ],
        },

        {
          title: "Step 4: Configure motion behaviour",

          body: "Choose whether cards lift, fan out, shift, rotate, or reveal details on hover. Use movement carefully so the interaction feels intentional instead of chaotic.",
        },

        {
          title: "Step 5: Support accessibility and mobile",

          body: "Add active and focus states for keyboard users. On mobile, adapt the desktop hover interaction into tap-to-expand cards, swipeable layouts, or vertical stacked content.",
        },

        {
          title: "Step 6: Optimize the interaction",

          body: "Tune spacing, overlap, animation speed, layering depth, and responsiveness. Keep the interaction smooth and predictable across different viewport sizes.",

          blocks: [
            {
              type: "code",
              title: "Component Code",
              filename: "hover-stack.jsx",
              language: "jsx",

              code: `"use client";

import React, { useMemo, useState } from "react";

const PRESET_ROTATIONS = [-8, 4, -3, 5, -4, 6, 3, -6, 2, -5];

const StackedHoverCards = ({
    cards = [],
    cardWidth = 280,
    cardHeight = 360,
    overlap = 92,
    hoverLift = 28,
    pushDistance = 110,
    className = "",
}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const preparedCards = useMemo(() => {
        return cards.map((card, index) => {
            const rotation =
                PRESET_ROTATIONS[index % PRESET_ROTATIONS.length] +
                (index % 2 === 0 ? 0 : 1);

            const baseX = index * overlap;

            return {
                ...card,
                _rotation: rotation,
                _baseX: baseX,
                _baseZ: index + 1,
            };
        });
    }, [cards, overlap]);

    const getCardStyle = (card, index) => {
        const isActive = activeIndex === index;
        const hasActive = activeIndex !== null;

        let x = card._baseX;
        let y = 0;
        let rotate = card._rotation;
        let zIndex = card._baseZ;
        let scale = 1;

        if (hasActive) {
            if (index < activeIndex) {
                x -= pushDistance;
            } else if (index > activeIndex) {
                x += pushDistance;
            }

            if (isActive) {
                x = card._baseX;
                y = -hoverLift;
                rotate = 0;
                zIndex = 999;
                scale = 1.035;
            }
        }

        const transition = isActive
            ? "transform 480ms cubic-bezier(0.22, 1.6, 0.32, 1), box-shadow 900ms cubic-bezier(0.22, 1.6, 0.32, 1)"
            : hasActive
                ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "transform 480ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 380ms cubic-bezier(0.4, 0, 0.2, 1)";

        return {
            "--card-width": \`\${cardWidth}px\`,
            "--card-height": \`\${cardHeight}px\`,
            transform: \`translate3d(\${x}px, \${y}px, 0) rotate(\${rotate}deg) scale(\${scale})\`,
            zIndex,
            transition,
            background: card.bg,
        };
    };

    const totalWidth =
        preparedCards.length > 0
            ? preparedCards.at(-1)._baseX + cardWidth
            : cardWidth;

    return (
        <div className={\`relative w-full px-[7vw] \${className}\`}>
            {/* desktop */}
            <div
                className="relative mx-auto max-md:hidden"
                style={{
                    "--stack-width": \`\${totalWidth}px\`,
                    "--stack-height": \`\${cardHeight + hoverLift + 24}px\`,
                    width: "var(--stack-width)",
                    height: "var(--stack-height)",
                }}
            >
                {preparedCards.map((card, index) => (
                    <div
                        key={card.id ?? index}
                        className={\`absolute top-0 left-0 flex h-(--card-height) w-(--card-width) cursor-pointer select-none flex-col justify-between overflow-hidden rounded-[1.667vw] border border-black/10 p-[1.667vw] origin-[center_center] will-change-transform \${card.accent || ""}\`}
                        style={getCardStyle(card, index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div />

                        <div className="relative z-2 flex flex-1 items-center">
                            <p className="m-0 max-w-[92%] text-[1.9rem] leading-[0.95] tracking-tighter">
                                “{card.quote}”
                            </p>
                        </div>

                        <div className="relative z-2 flex flex-col gap-[1.111vw]">
                            <div className="h-[0.069vw] w-full bg-black/20" />

                            <div className="flex items-center justify-between gap-[1.111vw]">
                                <div className="flex items-center gap-[0.556vw]">
                                    <div className="flex size-[2.5vw] items-center justify-center rounded-full border border-black/10 bg-black text-[0.9rem] text-white shadow-[0_0.417vw_0.972vw_rgba(0,0,0,0.12)]">
                                        ↗
                                    </div>

                                    <span className="text-[0.833vw] font-semibold uppercase tracking-[0.14em]">
                                        Explore
                                    </span>
                                </div>

                                <span className="text-[0.764vw] uppercase tracking-[0.16em] opacity-70">
                                    0{index + 1}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* tablet + mobile */}
            <div className="hidden flex-col gap-[1.563vw] max-md:flex max-md:gap-[2.083vw] max-sm:gap-[8.8vw]">
                {cards.map((card, index) => (
                    <div
                        key={card.id ?? index}
                        className={\`relative flex min-h-[20.313vw] w-full cursor-default select-none flex-col justify-between overflow-hidden rounded-[2.148vw] border border-black/10 p-[2.148vw] max-md:h-auto max-md:min-h-[25.391vw] max-md:rounded-[2.148vw] max-md:p-[2.148vw] max-md:transform-[none!important] max-md:[transition:none!important] max-sm:min-h-[58.667vw] max-sm:rounded-[4.8vw] max-sm:p-[4.8vw] \${card.accent || ""}\`}
                        style={{
                            background: card.bg,
                        }}
                    >
                        <div />

                        <div className="relative z-2 flex flex-1 items-center">
                            <p className="m-0 max-w-full text-[1.55rem] leading-none tracking-tighter max-sm:text-[1.2rem] max-sm:leading-[1.05] max-sm:tracking-[-0.04em]">
                                “{card.quote}”
                            </p>
                        </div>

                        <div className="relative z-2 flex flex-col gap-[1.563vw] max-md:gap-[2.083vw] max-sm:gap-[3.2vw]">
                            <div className="h-[0.098vw] w-full bg-black/20 max-sm:h-[0.267vw]" />

                            <div className="flex items-center justify-between gap-[1.563vw] max-md:gap-[2.083vw] max-sm:gap-[3.2vw]">
                                <div className="flex items-center gap-[0.781vw] max-md:gap-[1.042vw] max-sm:gap-[2.1vw]">
                                    <div className="flex size-[3.5vw] items-center justify-center rounded-full border border-black/10 bg-black text-[0.9rem] text-white shadow-[0_0.586vw_1.367vw_rgba(0,0,0,0.12)] max-md:size-[4.1vw] max-sm:size-[8.5vw] max-sm:text-[0.82rem]">
                                        ↗
                                    </div>

                                    <span className="text-[1.172vw] font-semibold uppercase tracking-[0.14em] max-md:text-[1.367vw] max-sm:text-[2.667vw]">
                                        Explore
                                    </span>
                                </div>

                                <span className="text-[1vw] uppercase tracking-[0.16em] opacity-70 max-md:text-[1.2vw] max-sm:text-[2.6vw]">
                                    0{index + 1}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StackedHoverCards;
`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Card overlap",

          recommendation:
            "Smaller overlap creates a cleaner layered layout while larger overlap increases the stacked visual depth.",
        },

        {
          option: "Hover lift",

          recommendation:
            "Use subtle lift distances for professional websites and larger lift values for more expressive creative layouts.",
        },

        {
          option: "Rotation intensity",

          recommendation:
            "Keep card rotation restrained so the stack remains readable and visually organized.",
        },

        {
          option: "Push distance",

          recommendation:
            "Increase spacing between neighbouring cards on hover to improve clarity and focus.",
        },

        {
          option: "Animation timing",

          recommendation:
            "Use smooth easing curves and medium-duration transitions for premium interaction quality.",
        },

        {
          option: "Mobile layout",

          recommendation:
            "Convert hover behaviour into tap, swipe, accordion, or vertical stacking patterns on touch devices.",
        },
      ],

      notes: {
        performance:
          "Optimize assets and keep animations transform-based where possible. Avoid loading heavy previews or content until needed.",

        accessibility:
          "Support keyboard focus, semantic markup, accessible labels, and non-hover access to important content.",

        mobile:
          "Adapt desktop interaction patterns into tap, swipe, stacked, or simplified layouts on small screens.",
      },

      commonMistakes: [
        "No mobile fallback",
        "Weak active state",
        "Poor keyboard support",
        "Overloaded content",
        "Slow transitions",
        "Unoptimized assets",
        "Overusing animation",
      ],

      relatedEffectNames: [
        "Depth Card Stack",
        "Interactive Hover Slider",
        "Stacking Cards",
        "Scroll Shuffled Cards",
        "Interactive List Preview",
      ],

      faq: [
        {
          question: "What is this component best used for?",

          answer:
            "Hover Stack is best used when its interaction pattern directly supports browsing, clarity, trust, or conversion rather than acting as decoration.",
        },

        {
          question: "Does it work on mobile?",

          answer:
            "Yes, but hover or dense desktop behaviours should be adapted into touch-friendly patterns.",
        },

        {
          question: "Is it suitable for SaaS websites?",

          answer:
            "Yes when used to improve comprehension, proof, conversion, or product storytelling.",
        },

        {
          question: "What is the main implementation risk?",

          answer:
            "The main risk is hiding content or creating interaction friction. Keep accessibility, keyboard behaviour, and fallbacks intact.",
        },
      ],

      finalCta: {
        body: "Use Hover Stack when the page needs a clearer, more polished, and more conversion-aware interaction pattern.",

        primary: "Install Hover Stack",

        secondary: "View Interactive Components",

        commercial: "Request a Custom Hover Stack Component",
      },
    },
    "gooey-counter": {
      seo: {
        primaryKeyword: "React gooey counter",
        secondaryKeywords: [
          "gooey counter animation",
          "animated stats React",
          "React number counter",
          "Next.js animated counter",
          "fluid counter animation",
          "interactive statistics component",
        ],
        title: "Gooey Counter for React & Next.js | Hyperiux Vault",
        description:
          "Add a fluid gooey counter animation to your React or Next.js website. Perfect for SaaS stats, portfolio metrics, proof sections, dashboards, and interactive landing pages.",
      },

      h1: "Gooey Counter for React and Next.js",

      shortDescription:
        "A fluid animated counter component for statistics, proof sections, dashboards, and interactive product metrics.",

      heroCopy: [
        "The Gooey Counter component is designed for websites that want numbers to feel more animated, tactile, and visually memorable. Many landing pages use statistics to build trust: number of users, projects completed, hours saved, revenue processed, integrations supported, countries served, performance improvements, or customer outcomes. A standard count-up animation can work, but it is common. Gooey Counter adds a more playful, fluid motion style to numeric transitions.",

        "This component is especially useful for creative websites, portfolio pages, SaaS landing pages, agency proof sections, product metrics, dashboard previews, campaign pages, and interactive data sections. It can make a statistics block feel more alive while still keeping the numbers readable. The gooey effect gives the digits a sense of elasticity, merging, or fluid movement as they change.",

        "For agencies and portfolios, Gooey Counter can make proof metrics feel more distinctive: projects launched, industries served, awards won, page speed gains, conversion improvements, or years of experience. For SaaS websites, it can show product usage, automation volume, customer count, time saved, or performance metrics. For product pages, it can add a more interactive feel to quantified benefits.",

        "The effect should be used carefully because numbers carry trust. If the animation is too playful or hard to read, it can reduce credibility. The counter should settle quickly into clear, legible digits. The gooey motion should add personality, not make the number feel unstable. It is better suited for creative, product, and marketing contexts than for financial dashboards or compliance-heavy data displays where precision must feel serious.",

        "The best implementation pairs the animated number with a clear label and context. A number without context is weak. “120+” means little until users know whether it refers to projects, clients, integrations, or hours saved. The component should also avoid false precision or inflated claims.",

        "Use Gooey Counter when you want statistics to feel more visual and engaging while still supporting trust. It is a niche component, but useful for proof sections that need more personality than a static metric grid.",
      ],

      bestUsedFor: [
        "Agency proof sections",
        "Portfolio metrics",
        "SaaS landing page stats",
        "Product usage metrics",
        "Dashboard previews",
        "Campaign counters",
        "Performance result sections",
        "Customer proof blocks",
        "Creative statistics sections",
        "Interactive data moments",
      ],

      tutorial: [
        {
          title: "Step 1: Install the component",
          body: "Install the Gooey Counter component using the Hyperiux CLI.",
          blocks: [
            {
              type: "code",
              title: "Installation",
              code: "npx hyperiux add gooey-counter",
              language: "bash",
            },
          ],
        },

        {
          title: "Step 2: Configure the counter values",
          body: "Define the starting value, ending value, duration, and label for the statistic. Make sure the number has clear context so users understand what the metric represents.",
        },

        {
          title: "Step 3: Add the component",
          body: "Import the Gooey Counter component and render it inside your page, dashboard preview, proof section, or metrics block.",
          blocks: [
            {
              type: "code",
              title: "Usage",
              filename: "page.jsx",
              language: "jsx",
              code: `import GooeyCounter from "@/components/GooeyCounter";
import React from "react";

const page = () => {
  return (
    <GooeyCounter />
  );
};

export default page;
`,
            },
          ],
        },

        {
          title: "Step 4: Tune the gooey motion",
          body: "Adjust blur intensity, transition timing, merge behaviour, elasticity, and digit movement. Keep the effect smooth but readable so the numbers remain trustworthy.",
        },

        {
          title: "Step 5: Trigger animations correctly",
          body: "Trigger the animation when the section enters the viewport or after a user interaction. Avoid replaying the animation repeatedly while scrolling.",
        },

        {
          title: "Step 6: Respect accessibility and responsiveness",
          body: "Provide reduced-motion fallbacks and make sure the digits remain readable across mobile, tablet, and desktop layouts.",
          blocks: [
            {
              type: "code",
              title: "Component Code",
              filename: "gooey-counter.jsx",
              language: "jsx",
              code: `"use client";
import { useEffect, useRef } from "react";

const COLS = 22;
const ROWS = 13;
const ROWS_TABLET = 30;
const ROWS_MOBILE = 32;
const CELL_MAX = 48;
const TRANSITION_MS = 480;
const NUMBER_DWELL_MS = 1000;
const RANDOM_DWELL_MS = 300;
const RANGE_MIN = 0;
const RANGE_MAX = 10;
const BG = "#d1d1d1";
const GRID_STROKE = "rgba(255,255,255,0.55)";
const INK = "#111";
const MOBILE_MAX_WIDTH = 768;
const TABLET_MAX_WIDTH = 1024;
const DIGIT_HEIGHT = 9;
const DIGIT_WIDTH = 6;
const DIGIT_GAP = 1;
const MOBILE_DIGIT_HEIGHT = 13;
const MOBILE_DIGIT_WIDTH = 8;
const MOBILE_DIGIT_GAP = 1;

const DIGIT_MAPS = {
 0: ["011100","110011","110011","110011","110011","110011","110011","110011","011100"],
 1: ["001100","011100","001100","001100","001100","001100","001100","001100","011110"],
 2: ["011100","110011","000011","000110","001100","011000","110000","110000","111111"],
 3: ["111100","000011","000011","000011","011100","000011","000011","000011","111100"],
 4: ["000110","001110","011010","110010","110010","111111","000010","000010","000010"],
 5: ["111111","110000","110000","110000","111100","000011","000011","000011","111100"],
 6: ["001110","011000","110000","110000","111100","110011","110011","110011","011100"],
 7: ["111111","000011","000011","000011","000110","001100","001100","011000","011000"],
 8: ["011100","110011","110011","110011","011100","110011","110011","110011","011100"],
 9: ["011100","110011","110011","110011","011111","000011","000011","000110","011000"],
};

function strokeize(rows) {
 const h = rows.length, w = rows[0].length;
 const on = (r, c) => r >= 0 && r < h && c >= 0 && c < w && rows[r][c] === "1";
 return rows.map((row, r) =>
  [...row].map((ch, c) => {
   if (ch !== "1") return "0";
   return (!on(r-1,c) || !on(r+1,c) || !on(r,c-1) || !on(r,c+1)) ? "1" : "0";
  }).join("")
 );
}

const STROKE = Object.fromEntries(
 Object.entries(DIGIT_MAPS).map(([k, v]) => [k, strokeize(v)])
);

function getDigitMetrics(width) {
 if (width <= MOBILE_MAX_WIDTH) {
  return {
   digitHeight: MOBILE_DIGIT_HEIGHT,
   digitWidth: MOBILE_DIGIT_WIDTH,
   digitGap: MOBILE_DIGIT_GAP,
  };
 }

 return {
  digitHeight: DIGIT_HEIGHT,
  digitWidth: DIGIT_WIDTH,
  digitGap: DIGIT_GAP,
 };
}

function getScaledCellIndexes(index, sourceSize, targetSize) {
 const start = Math.floor((index * targetSize) / sourceSize);
 const end = Math.floor(((index + 1) * targetSize) / sourceSize);
 const scaledIndexes = [];

 for (let scaledIndex = start; scaledIndex < Math.max(start + 1, end); scaledIndex++) {
  scaledIndexes.push(scaledIndex);
 }

 return scaledIndexes;
}

function getNumberCells(n, rows, width) {
 const digits = [...String(n)].map(Number);
 const { digitHeight, digitWidth, digitGap } = getDigitMetrics(width);
 const totalW = digits.length * digitWidth + (digits.length - 1) * digitGap;
 const startCol = Math.floor((COLS - totalW) / 2);
 const rowOff = Math.max(0, Math.floor((rows - digitHeight) / 2));
 const cells = [];

 digits.forEach((d, i) => {
  const baseCol = startCol + i * (digitWidth + digitGap);

  STROKE[d].forEach((row, r) =>
   [...row].forEach((ch, c) => {
    if (ch !== "1") return;

    const scaledRows = getScaledCellIndexes(r, DIGIT_HEIGHT, digitHeight);
    const scaledCols = getScaledCellIndexes(c, DIGIT_WIDTH, digitWidth);

    scaledRows.forEach(scaledRow => {
     scaledCols.forEach(scaledCol => {
      cells.push([scaledRow + rowOff, scaledCol + baseCol]);
     });
    });
   })
  );
 });

 return cells;
}

function computeMaxBlocks(rows, width) {
 let max = 0;

 for (let n = RANGE_MIN; n <= RANGE_MAX; n++) {
  max = Math.max(max, getNumberCells(n, rows, width).length);
 }

 return max;
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = t => Math.max(0, Math.min(1, t));

const easeInOut = t =>
 t < 0.5
  ? 4 * t * t * t
  : 1 - Math.pow(-2 * t + 2, 3) / 2;

function shuffle(arr) {
 const a = [...arr];

 for (let i = a.length - 1; i > 0; i--) {
  const j = (Math.random() * (i + 1)) | 0;
  [a[i], a[j]] = [a[j], a[i]];
 }

 return a;
}

function randomLayout(n, rows) {
 const all = [];

 for (let r = 0; r < rows; r++) {
  for (let c = 0; c < COLS; c++) {
   all.push([r, c]);
  }
 }

 return shuffle(all).slice(0, n);
}

function getRowsForWidth(width) {
 if (width <= MOBILE_MAX_WIDTH) return ROWS_MOBILE;
 if (width <= TABLET_MAX_WIDTH) return ROWS_TABLET;
 return ROWS;
}

function assignTargets(blocks, targets) {
 const used = new Set();

 blocks.slice(0, targets.length).forEach(b => {
  let best = -1;
  let bestD = Infinity;

  targets.forEach(([tr, tc], i) => {
   if (used.has(i)) return;

   const d = (b.cr - tr) ** 2 + (b.cc - tc) ** 2;

   if (d < bestD) {
    bestD = d;
    best = i;
   }
  });

  used.add(best);

  b.tr = targets[best][0];
  b.tc = targets[best][1];
  b.idle = false;
 });

 blocks.slice(targets.length).forEach(b => {
  const t = targets[Math.floor(Math.random() * targets.length)];

  b.tr = t[0];
  b.tc = t[1];
  b.idle = true;
 });
}

function drawCapsule(ctx, x1, y1, x2, y2, r) {
 const dx = x2 - x1;
 const dy = y2 - y1;
 const d = Math.hypot(dx, dy);

 if (d < 0.001) {
  ctx.beginPath();
  ctx.arc(x1, y1, r, 0, Math.PI * 2);
  ctx.fill();
  return;
 }

 const nx = -dy / d;
 const ny = dx / d;
 const ang = Math.atan2(dy, dx);

 ctx.beginPath();

 ctx.moveTo(x1 + nx * r, y1 + ny * r);
 ctx.lineTo(x2 + nx * r, y2 + ny * r);

 ctx.arc(x2, y2, r, ang + Math.PI / 2, ang - Math.PI / 2);

 ctx.lineTo(x1 - nx * r, y1 - ny * r);

 ctx.arc(x1, y1, r, ang - Math.PI / 2, ang + Math.PI / 2);

 ctx.closePath();
 ctx.fill();
}

export default function GooeyCounter() {
 const canvasRef = useRef(null);
 const stateRef = useRef(null);

 useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  let offscreen = new OffscreenCanvas(1, 1);
  let offCtx = offscreen.getContext("2d");

  const sim = {
   blocks: [],
   phase: "idle",
   nextNumber: RANGE_MIN + 1,
   timer: null,
   raf: null,
   layout: null,
   transition: null,
   activeRows: ROWS,
   viewportWidth: window.innerWidth,
   maxBlocks: computeMaxBlocks(ROWS, window.innerWidth),
  };

  stateRef.current = sim;

  function beginTransition(dur, onDone) {
   for (const b of sim.blocks) {
    b.sr = b.cr;
    b.sc = b.cc;
   }

   sim.transition = {
    start: performance.now(),
    duration: dur,
    onDone,
   };
  }

  function goToNumber(n, onDone) {
   const targets = getNumberCells(
    n,
    sim.activeRows,
    sim.viewportWidth
   );

   while (sim.blocks.length < sim.maxBlocks) {
    const p =
     targets[Math.floor(Math.random() * targets.length)];

    sim.blocks.push({
     cr: p[0],
     cc: p[1],
     tr: p[0],
     tc: p[1],
     sr: p[0],
     sc: p[1],
     idle: true,
    });
   }

   assignTargets(sim.blocks, targets);

   beginTransition(TRANSITION_MS, onDone);
  }

  function goToRandom(onDone) {
   const targets = randomLayout(
    sim.maxBlocks,
    sim.activeRows
   );

   sim.blocks.forEach((b, i) => {
    b.tr = targets[i][0];
    b.tc = targets[i][1];
    b.idle = false;
   });

   beginTransition(TRANSITION_MS, onDone);
  }

  function loop() {
   clearTimeout(sim.timer);

   sim.timer = setTimeout(() => {
    goToRandom(() => {
     sim.timer = setTimeout(() => {
      const n = sim.nextNumber;

      sim.nextNumber =
       n >= RANGE_MAX ? RANGE_MIN : n + 1;

      goToNumber(n, loop);
     }, RANDOM_DWELL_MS);
    });
   }, NUMBER_DWELL_MS);
  }

  function start() {
   clearTimeout(sim.timer);

   sim.blocks = [];
   sim.nextNumber = RANGE_MIN + 1;
   sim.transition = null;

   const rpos = randomLayout(
    sim.maxBlocks,
    sim.activeRows
   );

   const firstTargets = getNumberCells(
    RANGE_MIN,
    sim.activeRows,
    sim.viewportWidth
   );

   sim.blocks = rpos.map(p => ({
    cr: p[0],
    cc: p[1],
    tr: p[0],
    tc: p[1],
    sr: p[0],
    sc: p[1],
    idle: false,
   }));

   assignTargets(sim.blocks, firstTargets);

   beginTransition(TRANSITION_MS, loop);
  }

  stateRef.current.start = start;

  function resize() {
   const dpr = window.devicePixelRatio || 1;

   const vw = window.innerWidth;
   const vh = window.innerHeight;

   const newRows = getRowsForWidth(vw);

   const widthChanged = vw !== sim.viewportWidth;

   sim.viewportWidth = vw;

   if (newRows !== sim.activeRows || widthChanged) {
    sim.activeRows = newRows;
    sim.maxBlocks = computeMaxBlocks(newRows, vw);
   }

   canvas.width = Math.floor(vw * dpr);
   canvas.height = Math.floor(vh * dpr);

   canvas.style.width = vw + "px";
   canvas.style.height = vh + "px";

   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

   offscreen = new OffscreenCanvas(
    Math.floor(vw * dpr),
    Math.floor(vh * dpr)
   );

   offCtx = offscreen.getContext("2d");

   offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

   const margin = Math.max(
    24,
    Math.min(vw, vh) * 0.05
   );

   const cellW = Math.floor(
    (vw - margin * 2) / COLS
   );

   const cellH = Math.floor(
    (vh - margin * 2) / sim.activeRows
   );

   const cell = Math.min(
    CELL_MAX,
    Math.min(cellW, cellH)
   );

   const gridW = COLS * cell;
   const gridH = sim.activeRows * cell;

   const originX = Math.round((vw - gridW) / 2);
   const originY = Math.round((vh - gridH) / 2);

   sim.layout = {
    vw,
    vh,
    cell,
    gridW,
    gridH,
    originX,
    originY,
   };
  }

  function frame() {
   const L = sim.layout;

   if (!L) {
    sim.raf = requestAnimationFrame(frame);
    return;
   }

   if (sim.transition) {
    const { start, duration, onDone } = sim.transition;

    const t = clamp01(
     (performance.now() - start) /
      Math.max(1, duration)
    );

    const e = easeInOut(t);

    for (const b of sim.blocks) {
     b.cr = lerp(b.sr, b.tr, e);
     b.cc = lerp(b.sc, b.tc, e);
    }

    if (t >= 1) {
     for (const b of sim.blocks) {
      b.cr = b.tr;
      b.cc = b.tc;
     }

     sim.transition = null;

     onDone?.();
    }
   }

   const {
    vw,
    vh,
    cell,
    gridW,
    gridH,
    originX,
    originY,
   } = L;

   ctx.fillStyle = BG;
   ctx.fillRect(0, 0, vw, vh);

   offCtx.clearRect(0, 0, vw, vh);

   const snapped = sim.blocks.map(b => ({
    r: b.cr,
    c: b.cc,
    ir: Math.round(b.cr),
    ic: Math.round(b.cc),
   }));

   offCtx.fillStyle = INK;

   const linkDist = 1.6;

   for (let i = 0; i < snapped.length; i++) {
    const a = snapped[i];

    for (let j = i + 1; j < snapped.length; j++) {
     const b = snapped[j];

     const dx = b.c - a.c;
     const dy = b.r - a.r;

     const dist = Math.hypot(dx, dy);

     if (dist < 0.001 || dist > linkDist) continue;

     const rr =
      cell * 0.35 * (1 - dist / linkDist);

     if (rr < 1) continue;

     drawCapsule(
      offCtx,
      originX + (a.c + 0.5) * cell,
      originY + (a.r + 0.5) * cell,
      originX + (b.c + 0.5) * cell,
      originY + (b.r + 0.5) * cell,
      rr
     );
    }
   }

   for (const s of snapped) {
    offCtx.beginPath();

    offCtx.rect(
     originX + s.c * cell,
     originY + s.r * cell,
     cell,
     cell
    );

    offCtx.fill();
   }

   ctx.save();

   ctx.filter = "url(#gooey)";

   ctx.drawImage(offscreen, 0, 0, vw, vh);

   ctx.restore();

   ctx.strokeStyle = GRID_STROKE;
   ctx.lineWidth = 0.5;

   for (
    let x = originX;
    x <= originX + gridW;
    x += cell
   ) {
    ctx.beginPath();

    ctx.moveTo(x, originY);
    ctx.lineTo(x, originY + gridH);

    ctx.stroke();
   }

   for (
    let y = originY;
    y <= originY + gridH;
    y += cell
   ) {
    ctx.beginPath();

    ctx.moveTo(originX, y);
    ctx.lineTo(originX + gridW, y);

    ctx.stroke();
   }

   sim.raf = requestAnimationFrame(frame);
  }

  resize();

  window.addEventListener(
   "resize",
   resize,
   { passive: true }
  );

  start();

  sim.raf = requestAnimationFrame(frame);

  return () => {
   cancelAnimationFrame(sim.raf);

   clearTimeout(sim.timer);

   window.removeEventListener(
    "resize",
    resize
   );
  };
 }, []);

 return (
  <div
   style={{
    position: "fixed",
    inset: 0,
    background: BG,
   }}
  >
   <svg
    width="0"
    height="0"
    aria-hidden="true"
    focusable="false"
    style={{ position: "absolute" }}
   >
    <defs>
     <filter
      id="gooey"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
      colorInterpolationFilters="sRGB"
     >
      <feGaussianBlur
       in="SourceGraphic"
       stdDeviation="8"
       result="blur"
      />

      <feColorMatrix
       in="blur"
       mode="matrix"
       values="1 0 0 0 0
               0 1 0 0 0
               0 0 1 0 0
               0 0 0 18 -7"
       result="goo"
      />

      <feComposite
       in="SourceGraphic"
       in2="goo"
       operator="atop"
      />
     </filter>
    </defs>
   </svg>

   <canvas
    ref={canvasRef}
    style={{
     position: "absolute",
     inset: 0,
    }}
   />

   <button
    onClick={() => stateRef.current?.start?.()}
    style={{
     position: "absolute",
     top: 16,
     left: 16,
     padding: "8px 26px",
     fontSize: 12,
     letterSpacing: "0.05em",
     borderRadius: 6,
     border: "1px solid rgba(0,0,0,0.22)",
     background: "#fff",
     color: "#111",
     cursor: "pointer",
    }}
   >
    Reset
   </button>
  </div>
 );
}
`,
            },
          ],
        },
      ],

      customizationOptions: [
        {
          option: "Blur intensity",
          recommendation:
            "Increase blur for softer gooey merges, but keep digits readable at all times.",
        },
        {
          option: "Transition duration",
          recommendation:
            "Shorter transitions feel more responsive while longer transitions feel more fluid and cinematic.",
        },
        {
          option: "Digit scale",
          recommendation:
            "Use larger digits for campaign sections and smaller layouts for dashboard previews.",
        },
        {
          option: "Grid density",
          recommendation:
            "Adjust the grid spacing carefully to balance readability and visual complexity.",
        },
        {
          option: "Viewport triggers",
          recommendation:
            "Trigger the counter once on viewport entry to avoid repetitive motion.",
        },
        {
          option: "Reduced motion",
          recommendation:
            "Respect reduced-motion preferences by showing the final value immediately.",
        },
      ],

      notes: {
        performance:
          "Gooey effects may use filters that can be expensive if overused. Keep the number of animated counters limited and avoid heavy blur on many elements.",

        accessibility:
          "Do not rely on animated counting for meaning. Provide the final value as readable text and avoid constantly changing numbers for screen readers.",

        mobile:
          "Keep digits large and readable. Reduce gooey intensity if filters feel sluggish on mobile.",
      },

      commonMistakes: [
        "Showing numbers without context",
        "Making digits hard to read",
        "Overusing gooey filters",
        "Animating too slowly",
        "Using inflated or unsupported metrics",
        "Triggering counters repeatedly",
        "Ignoring reduced motion",
      ],

      relatedEffectNames: [
        "Text Fill Animation",
        "Animated FAQ",
        "Dotted Grid",
        "Depth Card Stack",
        "Tabs",
      ],

      faq: [
        {
          question: "What is Gooey Counter best used for?",
          answer:
            "Animated statistics, proof metrics, product numbers, and creative data highlights.",
        },
        {
          question: "Is it suitable for serious enterprise metrics?",
          answer:
            "Use carefully. For trust-heavy metrics, keep the gooey motion subtle and prioritize readability.",
        },
        {
          question: "Can it count percentages?",
          answer:
            "Yes. It can support percentages, currency, multipliers, or suffix-based stats.",
        },
        {
          question: "Should it animate every time users scroll?",
          answer:
            "Usually no. Trigger once when the section enters the viewport.",
        },
      ],

      finalCta: {
        body: "Use Gooey Counter when your statistics need motion, personality, and a more memorable visual treatment.",
        primary: "Install Gooey Counter",
        secondary: "View Interactive Components",
        commercial: "Request a Custom Gooey Counter Component",
      },
    },
    "interactive-list-preview": {
  seo: {
    primaryKeyword: "React interactive list preview",
    secondaryKeywords: [
      "interactive list React",
      "hover list preview",
      "React list image preview",
      "Next.js interactive list",
      "portfolio list preview",
      "service list preview component",
    ],
    title:
      "Interactive List Preview React Component | Hover Preview List | Hyperiux Vault",
    description:
      "Add an interactive list preview component to your React or Next.js website. Preview the hover-based list interaction, install it with the Hyperiux CLI, and customize it for portfolios, services, product features, resources, and creative landing pages.",
  },

  h1: "Interactive List Preview Component for React and Next.js",

  shortDescription:
    "A list-based interaction where hovering or focusing on an item reveals related preview content, imagery, or context.",

  heroCopy: [
    "The Interactive List Preview component is designed for websites that need list-based content to feel more visual, useful, and engaging. Lists are efficient. They help present services, projects, features, articles, resources, categories, team members, or capabilities in a compact way. But lists can feel dry when there is no supporting context. Interactive List Preview solves this by pairing each list item with a related preview: an image, short description, visual card, video frame, metric, or contextual panel.",

    "This component is especially useful for portfolio websites, agency service pages, product feature pages, editorial resource hubs, case study indexes, navigation menus, and creative landing pages. It allows a page to remain clean and text-led while still offering visual depth. Users can move through the list and see the preview area update instantly.",

    "For agency websites, Interactive List Preview can show service details or project visuals as users explore capabilities. For portfolios, hovering over project names can reveal related images and categories. For SaaS websites, feature names can update a product screenshot or benefit panel. For editorial websites, article titles can reveal summaries, thumbnails, or tags. This makes the list more useful without forcing every item into a full card.",

    "The component works best when the preview adds real value. A preview should not be random decoration. It should help users understand the item faster. The active state should be clear, and the transition should be immediate. If the preview updates too slowly, users may feel the interaction is broken. If the list has too many items, the experience can become overwhelming.",

    "Accessibility and mobile behaviour are important. Hover-based preview must also work with keyboard focus. On mobile, the component should become tap-based, accordion-style, or a stacked card layout. Critical information should not be available only through hover.",

    "Use Interactive List Preview when you want compact content to become more exploratory and visual. It is one of the strongest components for agencies and portfolios because it keeps layouts clean while giving users a richer browsing experience.",
  ],

  bestUsedFor: [
    "Portfolio indexes",
    "Agency service lists",
    "Product feature lists",
    "Resource hubs",
    "Case study pages",
    "Editorial article lists",
    "Navigation previews",
    "Team directories",
    "Use-case sections",
    "Capability pages",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Interactive List Preview component to your project. This adds the list preview component locally so you can tune hover behaviour, image reveal, highlight movement, mobile fallback, and list item structure.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add interactive-list-preview",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Prepare the list data",
      body: "Prepare list items with a title, category, platform, service description, link if needed, and preview asset. In this implementation, each item uses client, platform, services, and img fields.",
    },

    {
      title: "Step 3: Add the component",
      body: "Render ListHover where you need an interactive portfolio, services, or project index. The desktop version shows a hover-following image preview and row highlight, while the mobile version falls back to a stacked list with visible images.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import React from "react";
import ListHover from "@/components/ListHover/ListHover";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";

const Page = () => {
  return (
    <>
      <LenisSmoothScroll />

      <div className="flex items-center flex-col gap-20 max-sm:gap-20 max-sm:py-[15%] max-md:py-[10%] justify-center h-screen max-md:h-full bg-neutral-900">
        <h2 className="font-mono max-md:text-center max-sm:px-10 text-white max-md:text-5xl max-sm:text-3xl">
          Elevating interaction through motion
        </h2>

        <ListHover items={projects} />
      </div>
    </>
  );
};

export default Page;

const projects = [
  {
    client: "AURORA UI",
    platform: "NEXT.JS",
    services: "Motion Design, GSAP, Page Transitions, UI Systems",
    img: "/assets/gradient/image1.png",
  },
  {
    client: "NEON FLOW",
    platform: "REACT",
    services: "Interactive UI, Scroll Animations, Effects Library",
    img: "/assets/gradient/image2.png",
  },
  {
    client: "GLASSMORPH",
    platform: "NEXT.JS",
    services: "Glass UI, Components, Motion Architecture",
    img: "/assets/gradient/image3.png",
  },
  {
    client: "VOID SYSTEM",
    platform: "CUSTOM WEBGL",
    services: "Shaders, Creative Development, Visual Effects",
    img: "/assets/gradient/image4.png",
  },
  {
    client: "HYPER SCROLL",
    platform: "FRAMER MOTION",
    services: "Scroll Storytelling, Motion Systems, Interactions",
    img: "/assets/gradient/image5.png",
  },
  {
    client: "KINETIC LAB",
    platform: "THREE.JS",
    services: "3D Interfaces, Motion UI, WebGL Experiences",
    img: "/assets/gradient/image6.png",
  },
  {
    client: "PIXEL GRID",
    platform: "TAILWIND CSS",
    services: "Design Systems, UI Engineering, Responsive Layouts",
    img: "/assets/gradient/image7.png",
  },
  {
    client: "MOTION CORE",
    platform: "HEADLESS CMS",
    services: "Reusable Components, Motion Engine, Performance",
    img: "/assets/gradient/image8.png",
  },
  {
    client: "INTERFACE X",
    platform: "NEXT.JS",
    services: "Immersive UI, Creative Coding, Transitions, Effects",
    img: "/assets/gradient/image9.png",
  },
  {
    client: "HYPERIUX",
    platform: "UI LIBRARY",
    services: "Animations, Interactive Components, Futuristic Experiences",
    img: "/assets/gradient/image10.png",
  },
];`,
        },

        {
          type: "code",
          title: "Lenis Smooth Scroll",
          filename: "LenisScroll.jsx",
          language: "jsx",
          code: `"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const LenisSmoothScroll = ({
  duration = 1.5,
  lerp = 0.075,
  smoothWheel = true,
  wheelMultiplier = 0.8,
  touchMultiplier = 1.5,
}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration,
        lerp,
        smoothWheel,
        wheelMultiplier,
        touchMultiplier,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
      ref={lenisRef}
    />
  );
};

export default LenisSmoothScroll;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The items prop receives an array of list objects. Each object controls one row in the desktop table and one stacked card on mobile. The client field renders the project or item name, platform renders the category or technology, services renders the supporting context, and img controls the hover preview image.",
        },
      ],
    },

    {
      title: "Step 4: Configure the preview behaviour",
      body: "Use hover, focus, or active state to update the preview area. In this implementation, hovering over a desktop row reveals the matching image through a clip-path animation, moves the white highlight bar to the active row, and changes row text colour for contrast.",
      blocks: [
        {
          type: "props",
          title: "ListHover Props",
        },
      ],
    },

    {
      title: "Step 5: Tune transition and active state",
      body: "Keep transitions fast and clear. Use quick fades, slides, clips, or image swaps so the preview change feels instant. The active row should be obvious enough that users understand which item controls the preview.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "interactive-list-preview.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add mobile and keyboard fallbacks",
      body: "Hover-only interaction does not work well on touch devices. Use tap-to-preview, accordion behaviour, or stacked cards on mobile. Support keyboard focus so users can access preview content without a mouse.",
    },
  ],

  customizationOptions: [
    {
      option: "Preview type",
      recommendation:
        "Use an image, card, text panel, screenshot, video frame, or product visual depending on the list context.",
    },
    {
      option: "Active state",
      recommendation:
        "Highlight the selected item clearly so users always know which row controls the preview.",
    },
    {
      option: "Transition",
      recommendation:
        "Fast fades, clips, and slides work well. Avoid slow preview transitions that make the interaction feel broken.",
    },
    {
      option: "Item count",
      recommendation:
        "Keep the list focused. Too many items can make hover preview interactions feel overwhelming.",
    },
    {
      option: "Keyboard support",
      recommendation:
        "Use focus states and keyboard-accessible active behaviour so the preview is not hover-only.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Use tap-to-preview, accordion, or stacked cards on smaller screens.",
    },
  ],

  notes: {
    performance:
      "Optimize assets and keep animations transform-based where possible. Avoid loading heavy previews or large images until needed. If the list is long, consider lazy-loading preview assets.",

    accessibility:
      "Support keyboard focus, semantic markup, accessible labels, and non-hover access to important content. Do not hide critical information only inside hover states.",

    mobile:
      "Adapt desktop hover behaviour into tap, swipe, stacked, or simplified layouts on small screens. The current implementation uses a stacked mobile layout where each image is visible without hover.",
  },

  commonMistakes: [
    "No mobile fallback.",
    "Weak active state.",
    "Poor keyboard support.",
    "Overloaded content.",
    "Slow transitions.",
    "Unoptimized assets.",
    "Overusing animation.",
  ],

  relatedEffectNames: [
    "Interactive Hover Slider",
    "Inertia Image",
    "Hover Stack",
    "Depth Card Stack",
    "Tabs",
  ],

  faq: [
    {
      question: "What is this component best used for?",
      answer:
        "Interactive List Preview is best used when its interaction pattern directly supports browsing, clarity, trust, or conversion rather than acting as decoration.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes, but hover or dense desktop behaviours should be adapted into touch-friendly patterns.",
    },
    {
      question: "Is it suitable for SaaS websites?",
      answer:
        "Yes. It works well for feature lists, product capability sections, use-case pages, resource hubs, and proof-led service pages.",
    },
    {
      question: "What is the main implementation risk?",
      answer:
        "The main risk is hiding content or creating interaction friction. Keep accessibility, keyboard behaviour, and fallbacks intact.",
    },
    {
      question: "Can Hyperiux customize Interactive List Preview for a website?",
      answer:
        "Yes. Hyperiux can adapt the preview type, hover behaviour, mobile fallback, active state, list structure, imagery, animation timing, and accessibility behaviour into a custom interactive section.",
    },
  ],

  finalCta: {
    body: "Use Interactive List Preview when the page needs a clearer, more polished, and more conversion-aware interaction pattern.",
    primary: "Install Interactive List Preview",
    secondary: "View Components",
    commercial: "Request a Custom Interactive List Preview Section",
  },
},
  },
  "cursor-effects":{
    "phantom-image-trail": {
  seo: {
    primaryKeyword: "React phantom image trail",
    secondaryKeywords: [
      "image trail cursor React",
      "ghost image cursor effect",
      "fading image trail React",
      "Next.js image trail effect",
      "cursor image animation",
      "portfolio image trail",
    ],
    title:
      "Phantom Image Trail React Effect | Fading Cursor Image Trail | Hyperiux Vault",
    description:
      "Add a phantom image trail effect to your React or Next.js website. Preview the fading cursor image trail, install it with the Hyperiux CLI, and customize it for portfolios, creative websites, project galleries, and campaign pages.",
  },

  h1: "Phantom Image Trail Effect for React and Next.js",

  shortDescription:
    "A fading image trail effect where ghost-like visuals follow the cursor and dissolve as users move across the page.",

  heroCopy: [
    "The Phantom Image Trail effect is built for websites that want cursor movement to leave behind a visual echo. Instead of showing a solid image preview or a dense image trail, this effect creates fading, ghost-like visuals that appear and dissolve as the user moves. The result feels softer, more atmospheric, and more cinematic than a standard cursor image trail. It turns movement into a temporary visual composition, giving the page a sense of memory and motion.",

    "This effect is especially useful for portfolios, creative agency websites, photography pages, fashion campaigns, music and culture websites, editorial microsites, and immersive landing pages. It works well when the website has strong imagery and wants users to feel like they are moving through a visual atmosphere rather than simply hovering over content. The image trail can reveal project shots, campaign visuals, textures, product images, or abstract brand assets.",

    "For portfolio websites, Phantom Image Trail can make project discovery feel more expressive. Instead of showing one preview image next to a hovered project title, the user creates a layered trail of visual impressions as they move. For agency websites, it can be used in hero sections or work indexes to create a more premium first impression. For campaign pages, it can reinforce mood, energy, and art direction. The fading quality makes the effect feel less aggressive than some image trails, which helps it work in more refined visual systems.",

    "The effect should be tuned carefully. If the images last too long, the screen becomes cluttered. If they fade too quickly, users may not understand the interaction. If the images are too large, they can cover navigation, text, or CTAs. The best implementation uses controlled image size, short fade duration, and consistent visual assets. The trail should feel like atmosphere, not noise.",

    "Phantom Image Trail is strongest when used in selected sections rather than across every page. It works well in hero areas, project archives, interactive galleries, or campaign intros. It should not be used where users need to read dense information or complete forms.",

    "Use Phantom Image Trail when you want cursor movement to create a more cinematic, visual, and emotionally rich interaction layer.",
  ],

  bestUsedFor: [
    "Creative portfolio websites",
    "Agency work pages",
    "Photography websites",
    "Fashion and lifestyle campaigns",
    "Music and culture pages",
    "Editorial microsites",
    "Project archives",
    "Interactive galleries",
    "Hero sections",
    "Visual brand experiences",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Install the effect using the Hyperiux CLI. This adds the image trail component locally so you can tune the image set, spawn frequency, animation timing, cursor offset, and mobile fallback directly inside your project.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add phantom-image-trail",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose a consistent image set",
      body: "Choose images that share a consistent visual tone so the fading visuals feel like part of the same world. The effect works best with project previews, campaign visuals, textures, product imagery, or abstract brand assets that can appear briefly without confusing the page.",
    },

    {
      title: "Step 3: Place it inside the right section",
      body: "Place the effect inside a hero, project list, gallery, or campaign area. Avoid using it in dense reading sections, forms, pricing tables, or navigation-heavy areas where the trail could distract users from the task.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import ImagesAnimation from "@/components/MouseHoverAnim/ImagesAnimation";
import React from "react";

const Page = () => {
  return (
    <div className="w-screen h-screen relative z-999 bg-[#f8fdfe]">
      <div className="absolute w-full h-full flex justify-center items-center">
        <h1 className="text-[5.5vw] max-md:hidden text-stone-800">
          Move the Mouse to See Magic
        </h1>

        <p className="max-sm:text-[5.5vw] max-md:text-[4vw] font-serif text-center leading-[1.4] hidden max-md:block text-stone-800">
          Tap to explore
          <span className="max-sm:uppercase block text-center max-sm:pt-[5vw] max-md:pt-[3vw] leading-[1.2]">
            The full magic happens on Desktop
          </span>
        </p>
      </div>

      <ImagesAnimation
        enableRotation={true}
        idleSpawn={true}
        idleDelay={300}
        cursorOffsetX={-12}
        cursorOffsetY={-12}
        popOutDuration={0.8}
        fadeOutDuration={0.5}
        idlePopOutMultiplier={2.2}
        idleFadeMultiplier={1.8}
        imageMultiplier={3}
      />
    </div>
  );
};

export default Page;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "This effect does not require an external data array by default. It generates a pool of image elements internally using BASE_IMAGE_COUNT multiplied by imageMultiplier, then loads images from the /img/ folder using the pattern /img/1.png, /img/2.png, and so on. The props control how often images appear, how they animate, whether idle spawning is enabled, how far they sit from the cursor, and whether rotation is applied.",
        },
      ],
    },

    {
      title: "Step 4: Tune image size, opacity, fade timing, and movement delay",
      body: "Set image width, opacity, fade timing, cursor offset, pop-out duration, and movement delay so each image appears clearly and disappears cleanly. The goal is a soft visual trace, not a pile-up of images that covers the interface.",
      blocks: [
        {
          type: "props",
          title: "ImagesAnimation Props",
        },
      ],
    },

    {
      title: "Step 5: Control trail frequency",
      body: "Control how often images appear as the cursor moves. Use a slower frequency for premium experiences. The trail should feel intentional and atmospheric, especially on portfolio, campaign, or editorial pages.",
    },

    {
      title: "Step 6: Add a mobile fallback",
      body: "On mobile, replace the cursor trail with a gallery, carousel, static image composition, or tap-based reveal. Cursor-driven image trails do not translate naturally to touch devices, so the mobile experience should be simpler and more predictable.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "phantom-image-trail.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Image size",
      recommendation:
        "Medium images usually work best. Avoid large images that cover navigation, text, or CTAs.",
    },
    {
      option: "Fade duration",
      recommendation:
        "Keep the fade short enough to prevent clutter, but long enough for users to notice the visual echo.",
    },
    {
      option: "Trail frequency",
      recommendation:
        "Lower frequency feels more premium. High frequency can make the page feel noisy or overloaded.",
    },
    {
      option: "Opacity",
      recommendation:
        "Use soft opacity for a ghost-like feel, especially when images overlap.",
    },
    {
      option: "Image set",
      recommendation:
        "Keep images visually consistent so the trail feels curated rather than random.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Replace the cursor trail with a static gallery, carousel, or tap-based interaction on touch devices.",
    },
  ],

  notes: {
    performance:
      "Phantom Image Trail can become heavy if too many images remain active at once. Optimize image assets, limit active trail items, reduce image dimensions, and keep the fade animation short enough that inactive images do not pile up on the screen.",

    accessibility:
      "The trail should be decorative or supplementary. Important project content should remain available through static text, links, alt text, and accessible HTML. Do not use the image trail as the only way to reveal critical information.",

    mobile:
      "Disable or simplify the cursor trail on touch devices. Use a more predictable visual layout for mobile users, such as a static gallery, carousel, or tap-based image reveal.",
  },

  commonMistakes: [
    "Letting images stay visible too long.",
    "Using too many images at once.",
    "Making the trail cover important content.",
    "Using unrelated visuals.",
    "Applying the effect to text-heavy sections.",
    "Not optimizing images.",
    "Forgetting mobile fallback.",
  ],

  relatedEffectNames: [
    "Magnetic Image Trail",
    "Inertia Image",
    "Butterfly Trail Cursor",
    "Colorful Cursor Aura",
    "Interactive Hover Slider",
  ],

  faq: [
    {
      question: "How is Phantom Image Trail different from Magnetic Image Trail?",
      answer:
        "Magnetic Image Trail usually feels more responsive and energetic, with images following cursor movement more actively. Phantom Image Trail is softer and more atmospheric, with fading ghost-like images.",
    },
    {
      question: "Is Phantom Image Trail good for portfolios?",
      answer:
        "Yes. It works very well for portfolios, project indexes, creative agency pages, and visual archives.",
    },
    {
      question: "Can I use different images in the trail?",
      answer:
        "Yes. You can use project images, campaign visuals, textures, product imagery, or brand assets. In this implementation, the image pool is loaded from the /img/ folder using numbered image filenames.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Not as a true cursor effect. On mobile, use a fallback such as a static gallery, carousel, or tap-based reveal.",
    },
    {
      question: "Can Hyperiux customize Phantom Image Trail for a website?",
      answer:
        "Yes. Hyperiux can adapt the image set, timing, cursor behaviour, trail frequency, fade style, mobile fallback, and visual treatment of Phantom Image Trail into a custom website section.",
    },
  ],

  finalCta: {
    body: "Use Phantom Image Trail when you want cursor movement to leave a soft visual memory across the page.",
    primary: "Install Phantom Image Trail",
    secondary: "View Cursor Effects",
    commercial: "Request a Custom Image Trail",
  },
},
"pixelated-image-effect": {
  seo: {
    primaryKeyword: "React pixelated image effect",
    secondaryKeywords: [
      "pixelated image hover effect",
      "React image pixelation",
      "cursor pixelation effect",
      "Next.js pixelated image",
      "image pixelation animation",
      "creative image hover effect",
    ],
    title:
      "Pixelated Image Effect for React | Cursor Image Pixelation Animation | Hyperiux Vault",
    description:
      "Add a pixelated image effect to your React or Next.js website. Preview the cursor-driven image pixelation animation, install it with the Hyperiux CLI, and customize it for portfolios, creative websites, product visuals, and experimental interfaces.",
  },

  h1: "Pixelated Image Effect for React and Next.js",

  shortDescription:
    "A cursor or interaction-based image effect that pixelates, reveals, or distorts images for digital and experimental website sections.",

  heroCopy: [
    "The Pixelated Image Effect is built for websites that want image interaction to feel more digital, graphic, and responsive. Instead of simply showing an image on hover or applying a basic zoom, this effect changes the image surface itself. The image can become pixelated, de-pixelated, fragmented, sharpened, revealed, or distorted based on cursor movement, hover state, scroll position, or interaction progress. The result is an image treatment that feels more authored than a standard hover animation.",

    "This effect is especially useful for digital brands, creative portfolios, developer websites, AI products, gaming-related pages, cybersecurity brands, tech campaigns, visual archives, and experimental landing pages. Pixelation carries a strong digital association. It can suggest data, computation, glitches, transformation, concealment, privacy, retro interfaces, or digital assembly. That makes it useful when the website’s identity already leans toward technology, creativity, code, or visual experimentation.",

    "For portfolio websites, the Pixelated Image Effect can make project thumbnails feel more interactive. A project image can begin pixelated and sharpen on hover, or it can pixelate as the cursor moves across it. This gives browsing a stronger visual rhythm than a static grid. For product websites, the effect can be used to introduce technical visuals, data-led sections, AI interfaces, security concepts, or transformation narratives. For campaign pages, it can create an immediate visual hook that feels more memorable than a fade or scale animation.",

    "The effect should be used carefully. Pixelation can quickly reduce clarity if the image contains important detail, text, or interface screenshots. It works best when the pixelated state is temporary, decorative, or part of a reveal. The final image should become clear enough for the user to understand. If the effect hides important product information for too long, it hurts the experience.",

    "The strongest implementations keep pixel size, timing, and trigger behaviour controlled. Large pixels feel bold and retro. Small pixels feel more technical and refined. Cursor-driven pixelation can feel exploratory, while hover-based pixelation can feel like a clean interaction state. On mobile, the effect should be simplified or tied to tap interactions rather than cursor movement.",

    "Use Pixelated Image Effect when your image treatment needs a digital edge. It is especially useful when a normal hover zoom feels too generic and the brand can support a more coded, graphic, or experimental interaction language.",
  ],

  bestUsedFor: [
    "Creative portfolio websites",
    "Developer portfolios",
    "AI product websites",
    "Cybersecurity websites",
    "Gaming-related pages",
    "Digital agency websites",
    "Tech campaign pages",
    "Visual archives",
    "Experimental landing pages",
    "Interactive image grids",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Install the effect using the Hyperiux CLI. This adds the pixelation filter and image wrapper locally so you can tune pixel size, trigger behaviour, scroll reveal, cursor response, and mobile fallback directly inside your project.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add pixelated-image-effect",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Apply it to the right image type",
      body: "Apply the effect to project thumbnails, hero images, visual cards, product graphics, or gallery items. Avoid text-heavy screenshots or images where users must immediately read fine detail.",
    },

    {
      title: "Step 3: Choose the interaction model",
      body: "Decide whether the image starts pixelated and becomes clear, starts clear and pixelates on hover, or changes based on cursor movement. The example below uses pointer movement to control the SVG filter pixel size, making the image react as the cursor moves across it.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PixelateSvgFilter from "@/components/PixelatedSvg/PixelatedSvgEffect";

export default function Page() {
  const imageRef = useRef(null);
  const isTouching = useRef(false);
  const [pixelSize, setPixelSize] = useState(16);

  const updatePixel = (event) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const nextPixelSize = Math.min(Math.max(x / 30, 1), 64);
    setPixelSize(nextPixelSize);
  };

  const handlePointerDown = (event) => {
    isTouching.current = true;
    updatePixel(event);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch" && !isTouching.current) return;
    updatePixel(event);
  };

  const handlePointerUp = () => {
    isTouching.current = false;
  };

  return (
    <div className="relative flex h-dvh w-dvw flex-col gap-15 items-center justify-center">
      <h2 className="text-5xl text-center max-md:hidden">
        Move your cursor.
        <br />
        See the pixels react
      </h2>

      <h2 className="hidden max-md:block text-center text-2xl">
        Tap the image to reveal the blur.
        <br />
        Desktop gives you the full interactive magic
      </h2>

      <PixelateSvgFilter
        id="pixelate-filter"
        size={pixelSize}
        crossLayers
      />

      <div
        ref={imageRef}
        className="relative h-[55vh] w-full max-sm:max-w-[90%] overflow-hidden max-md:max-w-[90%] max-w-lg touch-none"
        style={{ filter: "url(#pixelate-filter)" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Image
          src="/assets/img/image02.webp"
          alt="Pixelated nature scene"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The interactive example stores pixelSize in React state and passes it into PixelateSvgFilter. Pointer movement over the image calculates a new pixel size based on cursor position, then applies the SVG filter to the image wrapper through filter: url(#pixelate-filter). The crossLayers option adds extra horizontal and vertical filter layers for a stronger pixelated look.",
        },
      ],
    },

    {
      title: "Step 4: Set pixel size, transition duration, and reveal speed",
      body: "Set the pixel block size, transition duration, easing, and reveal speed based on the visual style. Large pixels feel more retro and graphic, while smaller pixels feel more refined and technical.",
      blocks: [
        {
          type: "props",
          title: "PixelateSvgFilter Props",
        },
      ],
    },

    {
      title: "Step 5: Choose the right trigger",
      body: "Use hover, cursor movement, scroll entry, click, or viewport reveal depending on the purpose of the section. Cursor movement works well for interactive demos and gallery moments, while scroll entry works better for editorial or landing page reveals.",
      blocks: [
        {
          type: "code",
          title: "Scroll Reveal Variant",
          filename: "PixelImage.jsx",
          language: "jsx",
          code: `"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import PixelateSvgFilter from "@/components/PixelatedSvg/PixelatedSvgEffect";

gsap.registerPlugin(ScrollTrigger);

export default function PixelImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  initialPixelSize = 18,
  finalPixelSize = 1,
  start = "top 50%",
  end = "bottom 35%",
  crossLayers = true,
  priority = false,
}) {
  const containerRef = useRef(null);
  const filterId = useId().replace(/:/g, "");
  const [pixelSize, setPixelSize] = useState(initialPixelSize);
  const shouldApplyFilter = pixelSize > finalPixelSize + 0.01;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const animatedState = { size: initialPixelSize };

    const tween = gsap.to(animatedState, {
      size: finalPixelSize,
      duration: 1.0,
      ease: "none",
      paused: true,
      onUpdate: () => {
        setPixelSize(animatedState.size);
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      end,
      animation: tween,
      invalidateOnRefresh: true,
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [end, finalPixelSize, initialPixelSize, start]);

  return (
    <div ref={containerRef} className={\`relative \${className}\`}>
      <PixelateSvgFilter
        id={filterId}
        size={pixelSize}
        crossLayers={crossLayers}
      />

      <div
        className="relative h-full w-full overflow-hidden"
        style={{ filter: shouldApplyFilter ? \`url(#\${filterId})\` : undefined }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={\`object-cover \${imageClassName}\`.trim()}
        />
      </div>
    </div>
  );
}`,
        },
      ],
    },

    {
      title: "Step 6: Add mobile and reduced-motion fallbacks",
      body: "On touch devices, replace cursor-driven behaviour with tap or static states. Provide a stable image state for reduced motion users so the final image remains clear, usable, and readable.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "pixelated-image-effect.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Pixel size",
      recommendation:
        "Use larger pixels for a retro style and smaller pixels for a refined digital feel.",
    },
    {
      option: "Trigger",
      recommendation:
        "Use hover for cards, cursor movement for galleries, and scroll reveal for editorial image moments.",
    },
    {
      option: "Transition speed",
      recommendation:
        "Keep transitions short enough that the image becomes clear quickly.",
    },
    {
      option: "Image state",
      recommendation:
        "The final state should be readable. Do not hide important visual information for too long.",
    },
    {
      option: "Target content",
      recommendation:
        "Best for visuals, brand imagery, abstract graphics, and thumbnails. Avoid text-heavy screenshots.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Use tap reveal, static images, or simplified states instead of cursor-driven behaviour.",
    },
  ],

  notes: {
    performance:
      "Pixelated image effects can become expensive if applied to many large images or if using canvas, SVG, or WebGL processing on too many elements at once. Optimize image sizes, limit simultaneous effects, and avoid real-time processing on large galleries unless carefully tested.",

    accessibility:
      "Do not use pixelation as the only way to communicate important content. Images should include alt text where meaningful, and important information should remain accessible outside the effect. Respect reduced motion and avoid rapid flicker.",

    mobile:
      "Cursor-driven pixelation should be simplified on mobile. Use tap-to-reveal, static images, or simple hover-equivalent states where appropriate.",
  },

  commonMistakes: [
    "Applying pixelation to text-heavy screenshots.",
    "Making the image unclear for too long.",
    "Using large source images without optimization.",
    "Applying the effect to every image.",
    "Using rapid flicker.",
    "Ignoring reduced motion.",
    "Not providing mobile fallback.",
  ],

  relatedEffectNames: [
    "Pixel Bloom Cursor",
    "Mouse Pixelation",
    "SVG Pixel Reveal",
    "Fish Eye",
    "Noise Ripple Cursor",
  ],

  faq: [
    {
      question: "What is Pixelated Image Effect best used for?",
      answer:
        "It works best for creative portfolios, tech websites, AI product pages, gaming pages, cybersecurity brands, and experimental image grids.",
    },
    {
      question: "Can I use this effect on product screenshots?",
      answer:
        "Yes, but with caution. Make sure screenshots become clear quickly and that important UI details are not hidden for too long.",
    },
    {
      question: "Does Pixelated Image Effect require WebGL?",
      answer:
        "No. This implementation uses an SVG filter for pixelation. Other implementations can use canvas or WebGL, but this version is based on SVG filter primitives.",
    },
    {
      question: "Is this effect mobile-friendly?",
      answer:
        "It can be mobile-friendly if simplified. Cursor-driven pixelation should usually become a tap reveal or static image treatment on mobile.",
    },
    {
      question: "Can Hyperiux customize Pixelated Image Effect for a website?",
      answer:
        "Yes. Hyperiux can adapt the pixelation behaviour, trigger logic, SVG filter treatment, scroll reveal, image styling, responsive states, and mobile fallback into a custom website section.",
    },
  ],

  finalCta: {
    body: "Use Pixelated Image Effect when your images need a digital reveal, glitch-like texture, or more experimental interaction state.",
    primary: "Install Pixelated Image Effect",
    secondary: "View Cursor Effects",
    commercial: "Request a Custom Pixelation Effect",
  },
},
  },
  "page-transitions":{
"block-transition": {
  seo: {
    primaryKeyword: "React block page transition",
    secondaryKeywords: [
      "block transition React",
      "Next.js page transition",
      "animated page transition React",
      "route transition React",
      "block reveal transition",
      "creative page transition",
    ],
    title:
      "Block Transition React Effect | Animated Page Transition | Hyperiux Vault",
    description:
      "Add a block transition effect to your React or Next.js website. Preview the animated route transition, install it with the Hyperiux CLI, and customize it for portfolios, agency websites, landing pages, and creative digital experiences.",
  },

  h1: "Block Transition Effect for React and Next.js",

  shortDescription:
    "A bold page transition effect that uses moving blocks or panels to cover, reveal, and connect page changes.",

  heroCopy: [
    "The Block Transition effect is designed for websites that want page changes to feel deliberate rather than abrupt. Most websites move from one route to another with a hard cut. The user clicks a link, the old page disappears, and the next page appears. That works, but it rarely feels designed. A block transition adds a visual bridge between states. Blocks, panels, or solid shapes move across the screen to cover the current view and reveal the next one, creating a more controlled and memorable navigation moment.",

    "This effect is especially useful for creative websites, agency portfolios, campaign microsites, brand pages, product launches, and landing pages where the transition between sections or pages should feel like part of the experience. The block movement can be bold and graphic, restrained and premium, or fast and minimal depending on the visual system. It can make route changes feel more connected to the brand rather than purely functional.",

    "For agency websites and portfolios, Block Transition can create a strong sense of polish. It helps the website feel authored from page to page, not just designed as separate screens. For product and campaign sites, it can make movement between key pages feel more intentional, especially when the site uses a strong colour system or modular layout language. For editorial or experimental pages, the transition can act like a chapter break, giving the user a short visual pause before entering the next page.",

    "The strength of Block Transition is clarity. Unlike more complex page transitions, a block transition is easy for users to understand. The screen is covered, then revealed. That makes it versatile and easier to apply across different websites. But it still needs restraint. If the transition is too slow, users feel delayed. If it appears on every tiny interaction, it can become annoying. If the blocks are too visually loud, they can overpower the content.",

    "Use Block Transition when your website needs route changes to feel cleaner, more branded, and more cinematic without introducing a complicated interaction system. It is a practical page transition for creative and commercial websites because it adds polish while keeping the user’s navigation path clear.",
  ],

  bestUsedFor: [
    "Portfolio websites",
    "Creative agency websites",
    "Campaign microsites",
    "Product launch pages",
    "Brand websites",
    "Editorial websites",
    "Landing pages",
    "Case study navigation",
    "Fullscreen section transitions",
    "High-impact route changes",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Block Transition effect to your project. This adds the transition wrapper and supporting components locally so you can tune the route animation, colours, timing, and reduced-motion fallback.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add block-transition",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the transition wrapper",
      body: "Place the transition wrapper around the layout or route area where the animation should run. In Next.js, this usually means placing it inside a client-side layout or transition provider so the animation can respond to route changes.",
      blocks: [
        {
          type: "code",
          title: "Layout Usage",
          filename: "layout.jsx",
          language: "jsx",
          code: `import React from "react";
import BlockHeader from "@/components/showcase/transitions/HorizontalBlock/BlockHeader";
import BlockTransition from "@/components/showcase/transitions/HorizontalBlock/BlockTransition";

export default function Layout({ children }) {
  return (
    <BlockTransition>
      <BlockHeader />
      {children}
    </BlockTransition>
  );
}`,
        },

        {
          type: "text",
          title: "How the wrapper works",
          body: "BlockTransition wraps the page content and controls the transition layer between route changes. BlockHeader stays inside the same transition context, while children represents the active page content. This keeps the transition behaviour centralized instead of repeating it on every page.",
        },
      ],
    },

    {
      title: "Step 3: Create the first page",
      body: "Create the first route page and link it to the next route. The transition should be triggered by navigation, not by small UI interactions.",
      blocks: [
        {
          type: "code",
          title: "Page 1",
          filename: "page.jsx",
          language: "jsx",
          code: `import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="h-screen w-full bg-zinc-200 flex items-center justify-center">
      <div>
        <p className="text-[6vw] text-center font-medium text-zinc-900 tracking-tight leading-[.9] mb-10">
          PAGE 1
        </p>

        <Link
          href="/page-transitions/block/page2"
          className="text-sm uppercase rounded-full px-6 py-3 bg-white w-fit block mx-auto hover:bg-primary hover:text-white duration-300 text-black"
        >
          Go to Page 2
        </Link>
      </div>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 4: Create the second page",
      body: "Create the destination route and link it back to the first page. This gives you a simple two-page setup to test whether the block transition correctly covers, changes, and reveals the route.",
      blocks: [
        {
          type: "code",
          title: "Page 2",
          filename: "page.jsx",
          language: "jsx",
          code: `import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="h-screen w-full bg-zinc-200 flex items-center justify-center">
      <div>
        <p className="text-[6vw] text-center font-medium text-zinc-900 tracking-tight leading-[.9] mb-10">
          PAGE 2
        </p>

        <Link
          href="/page-transitions/block"
          className="text-sm uppercase rounded-full px-6 py-3 bg-white w-fit block mx-auto hover:bg-primary hover:text-white duration-300 text-black"
        >
          Go to Page 1
        </Link>
      </div>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 5: Configure direction, colours, and timing",
      body: "Decide whether blocks should move horizontally, vertically, diagonally, or in multiple staggered panels. Choose colours that match your brand system and keep timing short enough that navigation still feels responsive.",
      blocks: [
        {
          type: "props",
          title: "BlockTransition Props",
        },
      ],
    },

    {
      title: "Step 6: Add reduced-motion fallback",
      body: "For reduced-motion users, replace the block animation with a fast fade, instant transition, or static route change. The transition should add polish without trapping focus, delaying navigation, or creating scroll restoration issues.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "block-transition.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Block direction",
      recommendation:
        "Horizontal or vertical movement is usually clearest and easiest for users to understand.",
    },
    {
      option: "Number of blocks",
      recommendation:
        "Fewer blocks feel premium and restrained; more blocks feel energetic and campaign-like.",
    },
    {
      option: "Transition speed",
      recommendation:
        "Keep the transition fast and responsive so users do not feel delayed between routes.",
    },
    {
      option: "Colour palette",
      recommendation:
        "Use brand colours or neutral transition surfaces that do not clash with destination pages.",
    },
    {
      option: "Stagger",
      recommendation:
        "Use subtle stagger for crafted movement. Avoid excessive delay across too many panels.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Replace the animated block movement with a fade or instant transition for reduced-motion users.",
    },
  ],

  notes: {
    performance:
      "Block transitions are usually lightweight when built with transform-based animation. Avoid animating width, height, or layout-heavy properties. Keep the transition layer above content and remove or reset it after completion.",

    accessibility:
      "Do not allow the transition to trap focus or interrupt keyboard navigation. After route changes, focus should move predictably to the new page content. Respect reduced-motion preferences.",

    mobile:
      "Block transitions can work on mobile if they are short and simple. Avoid long full-screen animations that delay navigation on slower devices.",
  },

  commonMistakes: [
    "Making the transition too slow.",
    "Triggering it on minor interactions.",
    "Using too many panels.",
    "Forgetting reduced-motion fallback.",
    "Creating focus or scroll restoration issues.",
    "Using colours that clash with the destination page.",
    "Letting the transition feel heavier than the page content.",
  ],

  relatedEffectNames: [
    "Chess Grid Transition",
    "Pixel Transition",
    "SVG Draw Page Transition",
    "Page Flip Transition",
    "Pie Rotation Transition",
  ],

  faq: [
    {
      question: "What is Block Transition best used for?",
      answer:
        "Block Transition works best for route changes, case study navigation, portfolio pages, campaign sites, and high-impact page changes where the transition should feel branded.",
    },
    {
      question: "Can I use Block Transition in Next.js?",
      answer:
        "Yes. It should be implemented inside a client component or route transition system, especially if it depends on navigation state and browser APIs.",
    },
    {
      question: "Is Block Transition good for SaaS websites?",
      answer:
        "It can work on SaaS marketing pages, product launch pages, or campaign microsites. For app dashboards, simpler transitions are usually better.",
    },
    {
      question: "Should it be used on every page change?",
      answer:
        "Only if it remains fast and does not create friction. Use it for major page transitions rather than small UI state changes.",
    },
    {
      question: "Can Hyperiux customize Block Transition for a website?",
      answer:
        "Yes. Hyperiux can adapt the block direction, colour system, animation timing, route trigger logic, reduced-motion fallback, and transition behaviour into a custom website experience.",
    },
  ],

  finalCta: {
    body: "Use Block Transition when route changes need to feel branded, controlled, and more intentional than a hard cut.",
    primary: "Install Block Transition",
    secondary: "View Page Transitions",
    commercial: "Request a Custom Route Transition",
  },
},
"pie-rotation-transition": {
  seo: {
    primaryKeyword: "React pie rotation transition",
    secondaryKeywords: [
      "radial page transition React",
      "circular page transition",
      "Next.js radial transition",
      "pie reveal animation",
      "rotating page transition",
      "creative route transition",
    ],
    title:
      "Pie Rotation Transition React Effect | Radial Page Reveal | Hyperiux Vault",
    description:
      "Add a pie rotation transition to your React or Next.js website. Preview the radial page reveal effect, install it with the Hyperiux CLI, and customize it for creative landing pages, portfolios, campaign sites, and experimental digital experiences.",
  },

  h1: "Pie Rotation Transition for React and Next.js",

  shortDescription:
    "A radial page transition that reveals or covers the screen through rotating pie-like segments.",

  heroCopy: [
    "The Pie Rotation Transition effect is designed for websites that need a more unusual and radial way to move between states. Most page transitions are linear. They move left to right, top to bottom, fade in, or slide over the screen. Pie Rotation Transition uses circular movement instead. It reveals or covers the screen through rotating segments, arcs, or pie-like shapes, creating a transition that feels more graphic, energetic, and unexpected.",

    "This effect is especially useful for experimental websites, creative portfolios, campaign microsites, culture brands, event pages, digital art projects, and visual landing pages where a standard transition would feel too safe. The radial motion gives the page a different type of rhythm. Instead of moving in straight lines, the transition turns around a center point, creating a sense of spin, opening, closing, or rotation. That makes it useful when the brand language includes circles, motion, cycles, time, energy, or playful visual systems.",

    "For portfolios and creative agency websites, Pie Rotation Transition can create a memorable route change between project pages or visual sections. For campaign pages, it can act as a high-energy transition between moments. For event or entertainment websites, the circular motion can feel more dynamic and expressive. For product websites, it should be used carefully, but it may work for launch pages, promotional microsites, or interactive story sections.",

    "The effect has a strong personality, so context matters. It is not the best transition for every website. On serious B2B pages, enterprise SaaS sites, or utility-heavy interfaces, it may feel distracting. But for creative contexts where movement is part of the experience, it can give navigation a distinctive visual signature.",

    "The key is to avoid making the rotation feel dizzying. The transition should be short, controlled, and visually clear. Segment count, rotation speed, colour, and easing all matter. Too many rotating pieces can feel chaotic. Too much spin can disorient users. The best version uses radial movement as a quick visual bridge, not a long animation.",

    "Use Pie Rotation Transition when your website needs a more experimental route change with circular motion, graphic energy, and a stronger visual identity than a standard fade or slide.",
  ],

  bestUsedFor: [
    "Experimental websites",
    "Creative portfolios",
    "Campaign microsites",
    "Event pages",
    "Culture and entertainment websites",
    "Digital art projects",
    "Visual landing pages",
    "Project transitions",
    "Section reveals",
    "Interactive storytelling pages",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Pie Rotation Transition effect to your project. This adds the radial transition wrapper and supporting components locally so you can tune the segment movement, timing, colour system, and reduced-motion fallback.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add pie-rotation-transition",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the radial transition layer",
      body: "Place the radial transition layer above page content so it can cover and reveal the screen during route changes or section transitions. In Next.js, this usually means wrapping the route area inside a layout-level transition component.",
      blocks: [
        {
          type: "code",
          title: "Layout Usage",
          filename: "layout.jsx",
          language: "jsx",
          code: `import PiechartTransition from "@/components/showcase/transitions/PieChart/PiechartTransition";
import PieChartHeader from "@/components/showcase/transitions/PieChart/PieChartHeader";
import React from "react";

export default function Layout({ children }) {
  return (
    <PiechartTransition>
      <PieChartHeader />
      {children}
    </PiechartTransition>
  );
}`,
        },

        {
          type: "text",
          title: "How the wrapper works",
          body: "PiechartTransition wraps the active route content and controls the radial page transition layer. PieChartHeader stays inside the same transition context, while children represents the page currently being rendered. This keeps the radial transition behaviour centralized at the layout level instead of repeating it across every page.",
        },
      ],
    },

    {
      title: "Step 3: Create the first page",
      body: "Create the first route page with a simple full-screen section. This gives the transition a clear before-and-after state when users navigate between pages.",
      blocks: [
        {
          type: "code",
          title: "Page 1",
          filename: "page.jsx",
          language: "jsx",
          code: `import React from "react";

export default function Page() {
  return (
    <section className="h-screen w-full bg-sky-200 flex items-center justify-center">
      <p className="text-[6vw] text-center font-medium text-white w-[50%] tracking-tight leading-[.9]">
        PIE CHART PAGE I
      </p>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 4: Create the second page",
      body: "Create the destination page and use a reveal effect inside the page content if you want the transition to feel more layered. The radial transition handles the route movement, while the inner reveal can introduce the new page headline after the route change.",
      blocks: [
        {
          type: "code",
          title: "Page 2",
          filename: "page.jsx",
          language: "jsx",
          code: `import React from "react";
import TextBlockReveal from "@/components/RectangularTextReveal/RectangularTextReveal";

export default function Page() {
  return (
    <section className="h-screen w-full bg-sky-200 flex items-center justify-center">
      <TextBlockReveal
        overlayEnterDuration={0.35}
        overlayExitDuration={0.35}
        direction="bottom"
        coverDuration={0.4}
        revealDuration={0.5}
        baseColor="#7DAACB"
        overlayColor="#0F2854"
        delay={1.5}
      >
        <p className="text-[6vw] block text-center font-medium text-white w-full tracking-tight leading-[.9]">
          PIE CHART PAGE II
        </p>
      </TextBlockReveal>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 5: Configure segment count, speed, and colour",
      body: "Decide how many pie segments should appear, how quickly they rotate, where the transition originates, and which colours belong to the brand system. Fewer segments feel cleaner and more premium, while more segments feel more kinetic and experimental.",
      blocks: [
        {
          type: "props",
          title: "PiechartTransition Props",
        },
      ],
    },

    {
      title: "Step 6: Add reduced-motion fallback",
      body: "Provide a simple fade, block transition, or instant route change for users who prefer reduced motion. Radial and rotational movement can be disorienting for some users, so the fallback should preserve navigation clarity without the spin.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "pie-rotation-transition.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Segment count",
      recommendation:
        "Use fewer segments for a cleaner, bolder effect. More segments feel more kinetic and experimental.",
    },
    {
      option: "Rotation speed",
      recommendation:
        "Keep the transition fast but not dizzying. The user should understand the route change without feeling delayed.",
    },
    {
      option: "Radius origin",
      recommendation:
        "Use a center origin for balanced reveals, or a custom origin when the transition should emerge from a CTA, corner, or focal point.",
    },
    {
      option: "Colour",
      recommendation:
        "Use strong but controlled brand colours. Avoid colours that clash with the source or destination page.",
    },
    {
      option: "Trigger",
      recommendation:
        "Use it for major route or section changes, not small UI state changes.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Replace the radial animation with a fade, block transition, or instant route change.",
    },
  ],

  notes: {
    performance:
      "Pie Rotation Transition should be built with efficient SVG, CSS, or transform-based animation where possible. Avoid overly complex segment rendering, layout-heavy animation properties, or long animation loops that continue after the route change.",

    accessibility:
      "Radial motion can be disorienting for some users. Respect reduced-motion preferences and keep the animation short. Focus should move correctly after route changes, and the transition should not trap keyboard navigation.",

    mobile:
      "On mobile, reduce segment complexity and rotation intensity. A simpler circular reveal, block transition, or fade may provide a better experience on slower devices.",
  },

  commonMistakes: [
    "Making the rotation too long.",
    "Using too many segments.",
    "Creating dizzying motion.",
    "Applying it to serious utility sites.",
    "Ignoring reduced-motion fallback.",
    "Using colours that clash with pages.",
    "Triggering it too frequently.",
  ],

  relatedEffectNames: [
    "Block Transition",
    "Chess Grid Transition",
    "Pixel Transition",
    "SVG Draw Page Transition",
    "Page Flip Transition",
  ],

  faq: [
    {
      question: "What is Pie Rotation Transition best used for?",
      answer:
        "It works best for creative, campaign, event, experimental, and portfolio websites where radial motion fits the brand personality.",
    },
    {
      question: "Is Pie Rotation Transition good for SaaS websites?",
      answer:
        "Usually not for standard SaaS pages. It may work for promotional microsites, launches, or creative product campaigns where expressive motion is part of the campaign language.",
    },
    {
      question: "Can the rotation origin be changed?",
      answer:
        "Yes. The transition can originate from the center, a corner, a CTA point, or a custom position depending on the implementation.",
    },
    {
      question: "Should it support reduced motion?",
      answer:
        "Yes. Radial and rotational transitions should always provide a reduced-motion fallback, such as a fade, block transition, or instant route change.",
    },
    {
      question: "Can Hyperiux customize Pie Rotation Transition for a website?",
      answer:
        "Yes. Hyperiux can adapt the segment count, rotation origin, colour system, timing, route trigger logic, reduced-motion fallback, and radial motion style into a custom website experience.",
    },
  ],

  finalCta: {
    body: "Use Pie Rotation Transition when your page movement needs radial energy, graphic motion, and a more experimental transition style.",
    primary: "Install Pie Rotation Transition",
    secondary: "View Page Transitions",
    commercial: "Request a Custom Radial Transition",
  },
},
"chess-grid-transition": {
  seo: {
    primaryKeyword: "React chess grid transition",
    secondaryKeywords: [
      "grid page transition React",
      "checkerboard transition React",
      "Next.js grid transition",
      "animated route transition",
      "creative page transition",
      "chessboard reveal animation",
    ],
    title:
      "Chess Grid Transition React Effect | Checkerboard Page Reveal | Hyperiux Vault",
    description:
      "Add a chess grid transition effect to your React or Next.js website. Preview the checkerboard-style page reveal, install it with the Hyperiux CLI, and customize it for portfolios, creative landing pages, agency websites, and experimental digital experiences.",
  },

  h1: "Chess Grid Transition Effect for React and Next.js",

  shortDescription:
    "A checkerboard-style page transition that reveals or covers the screen through animated grid blocks.",

  heroCopy: [
    "The Chess Grid Transition effect is built for websites that need a more graphic and structured way to move between pages or sections. Instead of fading the screen or sliding one panel across the viewport, this transition divides the screen into a grid and animates the cells in a checkerboard-like sequence. The result feels modular, digital, and more visually distinctive than a standard page transition.",

    "This effect is especially useful for creative websites, portfolios, agency sites, campaign pages, digital product launches, and experimental interfaces where the visual system already uses grids, blocks, pixels, or modular layouts. The chess grid pattern introduces a sense of controlled fragmentation. The current page can break into cells, the next page can be revealed through alternating blocks, or the transition can create a short graphic interruption between route changes.",

    "For design agencies and creative portfolios, Chess Grid Transition can make the website feel more crafted. It shows attention to motion detail without requiring a heavy 3D scene or WebGL layer. For technology and digital brands, the grid structure can suggest systems, pixels, computation, interface architecture, or modular thinking. For campaign microsites, it can add a memorable transition moment that feels more custom than a simple fade.",

    "The effect works best when the grid style matches the rest of the website. If the site uses sharp geometry, modular layouts, pixel-inspired visuals, or strong rectangular composition, the transition can feel integrated. If the site is soft, organic, editorial, or luxury-led, the checkerboard movement may feel too mechanical unless heavily refined.",

    "The key is to control timing and density. Too many grid cells can make the transition feel busy or slow. Too few cells can look simplistic. The animation should be quick, crisp, and responsive. Users should feel a sense of crafted movement, not a delay before they get to the next page.",

    "Use Chess Grid Transition when you want page movement to feel structured, digital, and visually memorable. It is a stronger fit for creative and technical visual systems than for utility-heavy products. In the right context, it gives route changes a sharp graphic identity.",
  ],

  bestUsedFor: [
    "Creative portfolio websites",
    "Agency websites",
    "Digital product launches",
    "Experimental landing pages",
    "Technology brand pages",
    "Pixel-inspired interfaces",
    "Modular design systems",
    "Campaign microsites",
    "Case study navigation",
    "Section reveals",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Chess Grid Transition effect to your project. This adds the transition wrapper and supporting components locally so you can tune the grid density, animation order, timing, colours, and reduced-motion fallback.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add chess-grid-transition",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the transition layer",
      body: "Place the transition layer above the route or page content. It should appear only during page changes or selected section transitions. In Next.js, this usually means wrapping the page area inside a layout-level transition component.",
      blocks: [
        {
          type: "code",
          title: "Layout Usage",
          filename: "layout.jsx",
          language: "jsx",
          code: `import ChessGridHeader from "@/components/showcase/transitions/ChessGrids/ChessGridHeader";
import ChessGridTransition from "@/components/showcase/transitions/ChessGrids/ChessGridTransition";
import React from "react";

export default function Layout({ children }) {
  return (
    <ChessGridTransition>
      <ChessGridHeader />
      {children}
    </ChessGridTransition>
  );
}`,
        },

        {
          type: "text",
          title: "How the wrapper works",
          body: "ChessGridTransition wraps the active route content and controls the checkerboard transition layer during page changes. ChessGridHeader stays inside the same transition context, while children represents the current page content. This keeps the grid transition centralized at the layout level instead of repeating transition logic on every page.",
        },
      ],
    },

    {
      title: "Step 3: Create the first page",
      body: "Create the first route page and link it to the destination route. This gives the transition a clear route change to cover and reveal.",
      blocks: [
        {
          type: "code",
          title: "Page 1",
          filename: "page.jsx",
          language: "jsx",
          code: `import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="h-screen w-full bg-zinc-200 flex items-center justify-center">
      <div>
        <p className="text-[6vw] text-center font-medium text-zinc-900 tracking-tight leading-[.9] mb-10">
          PAGE 1
        </p>

        <Link
          href="/page-transitions/chess-grids/page2"
          className="text-sm uppercase rounded-full px-6 py-3 bg-white w-fit block mx-auto hover:bg-primary hover:text-white duration-300 text-black"
        >
          Go to Page 2
        </Link>
      </div>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 4: Create the second page",
      body: "Create the destination page and link it back to the first route. This lets you test the full transition loop and confirm that the grid overlay behaves correctly in both navigation directions.",
      blocks: [
        {
          type: "code",
          title: "Page 2",
          filename: "page.jsx",
          language: "jsx",
          code: `import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="h-screen w-full bg-zinc-200 flex items-center justify-center">
      <div>
        <p className="text-[6vw] text-center font-medium text-zinc-900 tracking-tight leading-[.9] mb-10">
          PAGE 2
        </p>

        <Link
          href="/page-transitions/chess-grids/"
          className="text-sm uppercase rounded-full px-6 py-3 bg-white w-fit block mx-auto hover:bg-primary hover:text-white duration-300 text-black"
        >
          Go to Page 1
        </Link>
      </div>
    </section>
  );
}`,
        },
      ],
    },

    {
      title: "Step 5: Configure grid size and reveal sequence",
      body: "Set the number of rows and columns, then choose the reveal sequence. Smaller grids feel bold and simple. Larger grids feel more pixelated and technical. Alternating, diagonal, random, wave, or center-out patterns can all work, but the sequence should match the site’s visual rhythm.",
      blocks: [
        {
          type: "props",
          title: "ChessGridTransition Props",
        },
      ],
    },

    {
      title: "Step 6: Add reduced-motion fallback",
      body: "For users who prefer reduced motion, replace the grid sequence with an instant route change or simple fade. The transition should not interfere with focus management, route announcements, keyboard navigation, or scroll restoration.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "chess-grid-transition.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Grid density",
      recommendation:
        "Medium density usually works best. Too many cells can feel noisy, while too few can look simplistic.",
    },
    {
      option: "Cell animation",
      recommendation:
        "Use stagger for a crafted reveal. Keep the sequence crisp and visually logical.",
    },
    {
      option: "Direction",
      recommendation:
        "Diagonal or checkerboard patterns feel distinctive and match the visual metaphor well.",
    },
    {
      option: "Colour",
      recommendation:
        "Match brand colours or use a neutral transition surface that does not clash with the destination page.",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the transition short and responsive so it does not feel like a loading delay.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Use a fade or instant transition for users who prefer reduced motion.",
    },
  ],

  notes: {
    performance:
      "Chess Grid Transition can be performant if each cell uses transform and opacity animation. Avoid animating layout-heavy properties or creating excessive DOM elements for very dense grids.",

    accessibility:
      "The transition should not interfere with focus management, route announcements, or keyboard navigation. Provide a reduced-motion fallback and ensure the destination page receives focus appropriately.",

    mobile:
      "Reduce grid density on smaller screens. A dense checkerboard transition can feel visually busy on mobile and may impact performance.",
  },

  commonMistakes: [
    "Using too many grid cells.",
    "Making the transition too slow.",
    "Using random animation without visual logic.",
    "Applying it on every small interaction.",
    "Ignoring reduced motion.",
    "Not testing mobile density.",
    "Creating route focus issues.",
  ],

  relatedEffectNames: [
    "Block Transition",
    "Pixel Transition",
    "SVG Pixel Reveal",
    "SVG Draw Page Transition",
    "Pie Rotation Transition",
  ],

  faq: [
    {
      question: "What is Chess Grid Transition best used for?",
      answer:
        "It works best for creative, modular, technical, pixel-inspired, or experimental websites where a grid-based reveal fits the visual identity.",
    },
    {
      question: "Can Chess Grid Transition be used in Next.js?",
      answer:
        "Yes. It should be implemented inside a client-side route transition pattern and tested with navigation behaviour.",
    },
    {
      question: "Is this transition suitable for serious SaaS websites?",
      answer:
        "Only selectively. It can work for technical product launches or AI/developer tool marketing pages, but may feel too decorative for standard SaaS pages.",
    },
    {
      question: "Can the grid pattern be customized?",
      answer:
        "Yes. You can adjust rows, columns, reveal order, colours, stagger timing, and direction.",
    },
    {
      question: "Can Hyperiux customize Chess Grid Transition for a website?",
      answer:
        "Yes. Hyperiux can adapt the grid density, reveal order, colour system, timing, mobile density, route trigger logic, and reduced-motion fallback into a custom page transition system.",
    },
  ],

  finalCta: {
    body: "Use Chess Grid Transition when your page changes need a structured, digital, and graphic reveal moment.",
    primary: "Install Chess Grid Transition",
    secondary: "View Page Transitions",
    commercial: "Request a Custom Grid Transition",
  },
},
  },
  "text-effects":{
    "overflow-stagger-text": {
  seo: {
    primaryKeyword: "React stagger text animation",
    secondaryKeywords: [
      "overflow stagger text React",
      "staggered text reveal",
      "React text reveal animation",
      "Next.js stagger text",
      "GSAP stagger text animation",
      "animated typography React",
    ],
    title:
      "Overflow Stagger Text for React | Staggered Text Reveal Animation | Hyperiux Vault",
    description:
      "Add an overflow stagger text animation to your React or Next.js website. Preview the staggered typography reveal, install it with the Hyperiux CLI, and customize it for hero sections, landing pages, portfolios, and editorial layouts.",
  },

  h1: "Overflow Stagger Text Animation for React and Next.js",

  shortDescription:
    "A staggered text reveal effect where words, lines, or characters animate from an overflow-hidden container with controlled timing.",

  heroCopy: [
    "The Overflow Stagger Text effect is built for websites that need typography to arrive with rhythm, sequence, and precision. A normal text reveal brings a full line or heading into view at once. That can work well, but it often lacks texture. Overflow Stagger Text breaks the reveal into smaller units — lines, words, or characters — and animates them in sequence from within a hidden container. The result is a more deliberate typography entrance where the message feels assembled rather than simply displayed.",

    "This effect is especially useful for hero headlines, section intros, editorial headings, portfolio project titles, service page statements, case study openings, and campaign copy where timing matters. Staggering creates a sense of movement across the text. It guides the eye from one part of the message to the next and can make even a simple headline feel more considered. The overflow mask keeps the movement clean, so the animation feels controlled instead of loose.",

    "For agency websites and portfolios, Overflow Stagger Text can make page openings feel more premium. It gives headings a sense of craft without requiring heavy visuals. For SaaS and product websites, it can add polish to hero copy, feature headings, and CTA sections while preserving readability. For editorial pages, it can make section headings feel more connected to the reading experience. The effect is also useful for launch pages where the sequence of words needs to build anticipation.",

    "The key is to avoid over-staggering. If every word arrives one by one over too long a duration, users may feel like they are waiting for the page to become readable. The effect should feel rhythmic, not slow. It works best when the headline is short enough to animate with clarity and when the final state is immediately readable. The mask should also be carefully sized so characters do not clip awkwardly.",

    "Use Overflow Stagger Text when your typography needs a more refined entrance than a simple fade or slide. It is a strong commercial text effect because it adds visible polish while keeping the message clear. It works especially well when paired with strong copy, clean layout, and restrained motion timing.",
  ],

  bestUsedFor: [
    "Hero headlines",
    "Section intros",
    "Portfolio titles",
    "Agency websites",
    "Landing pages",
    "Editorial layouts",
    "CTA sections",
    "Product pages",
    "Campaign pages",
    "Creative websites",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Overflow Stagger Text effect to your project. This adds the text animation wrapper locally so you can control the trigger, scrub behaviour, SplitText setup, stagger timing, and responsive handling.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add overflow-stagger-text",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the text target",
      body: "Use the effect on short, high-impact typography such as hero headlines, section titles, labels, editorial quotes, product drop titles, or CTA copy. Avoid applying it to long paragraphs where the stagger delays readability.",
    },

    {
      title: "Step 3: Add the component",
      body: "Wrap the target text inside OverFlowStagAnim. The component splits the child text into characters, masks the overflow, and animates each character upward with a slight rotation. You can use it once for a large hero headline or repeatedly across a list of smaller text rows.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import React from "react";
import Image from "next/image";
import OverFlowStagAnim from "@/components/TextAnimations/OverFlowStagAnim/OverFlowStagAnim";
import { ReactLenis } from "lenis/react";

const details = [
  { label: "Split", value: "characters" },
  { label: "Motion", value: "up + rotate" },
  { label: "Trigger", value: "scroll scrub" },
];

const lines = [
  "Launch copy",
  "Section titles",
  "Editorial quotes",
  "Product drops",
];

const notes = [
  "Characters start below the visible line.",
  "Overflow clipping keeps the reveal clean.",
  "A small stagger turns text into rhythm.",
];

const Page = () => {
  return (
    <ReactLenis root>
      <main className="overflow-hidden bg-[#f4efe6] text-[#151515]">
        <section className="min-h-screen px-8 py-8 max-sm:px-4 max-md:py-18 max-sm:py-4">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-rows-[auto_1fr_auto] border border-[#151515]/15 bg-[#fbf8f1] max-sm:min-h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between border-b border-[#151515]/15 px-6 py-5 text-xs max-sm:text-sm max-md:text-base font-semibold uppercase tracking-[0.24em] text-[#151515]/60 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:px-4 max-sm:tracking-[0.16em]">
              <span>Overflow Stagger Text</span>
              <span>Character reveal system</span>
            </div>

            <div className="grid items-center gap-10 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] max-sm:px-4 max-sm:py-10">
              <div>
                <p className="mb-6 w-fit rounded-full bg-[#151515] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#fbf8f1] max-sm:text-xs">
                  Staggered overflow
                </p>

                <OverFlowStagAnim scrub={true} start="top 24%" end="bottom bottom">
                  <h1 className="max-w-5xl text-[clamp(4rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-normal text-[#151515] max-sm:text-[3.8rem] max-sm:leading-[0.86]">
                    Text that steps into frame.
                  </h1>
                </OverFlowStagAnim>
              </div>

              <div className="grid gap-6">
                <div className="relative aspect-4/5 overflow-hidden bg-[#dbeafe] max-md:aspect-16/11">
                  <Image
                    src="/assets/gradient/image14.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 42vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-[#151515] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#fbf8f1] max-sm:text-[0.68rem]">
                    Overflow hidden / characters visible
                  </div>
                </div>

                <p className="max-w-md text-lg leading-8 text-[#151515]/68 max-sm:text-base max-sm:leading-7">
                  A clean text reveal where each character rises from a clipped line with a tiny rotation. It feels playful, but the layout stays calm.
                </p>
              </div>
            </div>

            <div className="grid border-t border-[#151515]/15 sm:grid-cols-3">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="border-[#151515]/15 px-6 py-5 max-sm:px-4 sm:border-r sm:last:border-r-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#151515]/45 max-sm:tracking-[0.16em]">
                    {label}
                  </p>

                  <p className="mt-2 text-xl font-black uppercase max-sm:text-lg">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-24 max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <OverFlowStagAnim scrub={true}>
                <h2 className="text-6xl font-black uppercase leading-[0.9] max-sm:text-[3.15rem]">
                  Use it where words need a first step.
                </h2>
              </OverFlowStagAnim>
            </div>

            <div className="grid gap-3">
              {lines.map((line) => (
                <OverFlowStagAnim key={line} scrub={true}>
                  <p className="border-b border-[#151515]/15 py-5 text-5xl font-black uppercase leading-none text-[#151515] max-sm:py-4 max-sm:text-[2.45rem]">
                    {line}
                  </p>
                </OverFlowStagAnim>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#151515] px-8 py-24 text-[#fbf8f1] max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-130 overflow-hidden max-sm:min-h-80">
              <Image
                src="/assets/img/distortion.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 54vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-[#151515]/20" />
            </div>

            <div className="flex flex-col justify-between gap-12">
              <OverFlowStagAnim scrub={true} start="top 80%" end="bottom 80%">
                <h2 className="text-6xl font-black uppercase leading-[0.9] max-sm:text-[3.1rem]">
                  Simple setup, expressive entrance.
                </h2>
              </OverFlowStagAnim>

              <div className="space-y-5">
                {notes.map((note, index) => (
                  <p
                    key={note}
                    className="border-t border-white/20 pt-5 text-lg leading-8 text-white/70 max-sm:text-base max-md:text-xl max-sm:leading-7"
                  >
                    <span className="mr-4 font-black text-[#f8d84a]">
                      0{index + 1}
                    </span>
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
};

export default Page;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The animation is applied by wrapping text elements inside OverFlowStagAnim. The component receives the text as children, then splits those children into characters using GSAP SplitText. Props like scrub, start, end, delay, and animateOnScroll control when the reveal begins and how closely it follows scroll progress.",
        },
      ],
    },

    {
      title: "Step 4: Configure the animation behaviour",
      body: "Tune trigger position, timing, easing, stagger, rotation, and scrub behaviour based on the use case. Short display text can handle more character-level motion, while longer text should use subtler timing so readability is not delayed.",
      blocks: [
        {
          type: "props",
          title: "OverFlowStagAnim Props",
        },
      ],
    },

    {
      title: "Step 5: Test readability",
      body: "Make sure the final text remains readable and that the animation does not delay comprehension. Check line breaks, clipping, mask height, and character spacing across desktop and mobile.",
    },

    {
      title: "Step 6: Add responsive and reduced-motion handling",
      body: "Simplify the effect on mobile and show a readable static state for users who prefer reduced motion. Avoid applying the animation to too many headings at once, especially on content-heavy pages.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "overflow-stagger-text.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Trigger",
      recommendation:
        "Use page load, viewport entry, scroll, or hover based on the content moment. Scroll works well for section-level typography.",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the reveal short and polished. Avoid long stagger sequences that delay readability.",
    },
    {
      option: "Text length",
      recommendation:
        "Use short display text. This effect is not meant for long paragraphs.",
    },
    {
      option: "Intensity",
      recommendation:
        "Start subtle and increase only if the brand supports expressive typography.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Reduce complexity and test line breaks, clipping, and font scale on smaller screens.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Show a stable readable fallback for users who prefer reduced motion.",
    },
  ],

  notes: {
    performance:
      "Overflow Stagger Text is usually performant when animation uses transform and opacity. Avoid applying the effect to too many text elements at once, and test carefully if using masks, filters, or continuous scroll-linked animation.",

    accessibility:
      "The text must remain readable in the DOM. Decorative layers should not create repeated screen-reader output. Respect reduced-motion preferences and make sure the final text state is accessible.",

    mobile:
      "On mobile, reduce movement, complexity, and text density. Test line breaks, clipping, and readability across screen sizes because SplitText-based animations can behave differently when typography wraps.",
  },

  commonMistakes: [
    "Using the effect on long paragraphs.",
    "Making the animation too slow.",
    "Reducing readability.",
    "Applying it to every heading.",
    "Ignoring reduced motion.",
    "Not testing mobile line breaks.",
    "Creating accessibility issues.",
  ],

  relatedEffectNames: [
    "Mask Text Reveal",
    "Overflow Text Reveal",
    "Slide Text Reveal",
    "Blur Text",
    "Scramble Text",
  ],

  faq: [
    {
      question: "What is this effect best used for?",
      answer:
        "It is best used for short display typography such as hero headings, section intros, titles, CTA copy, and creative text moments.",
    },
    {
      question: "Is this suitable for SaaS websites?",
      answer:
        "Yes, when used with restraint and clear readability. More expressive versions fit design-led or technical brands better.",
    },
    {
      question: "Does it require GSAP?",
      answer:
        "Yes. This implementation uses GSAP, SplitText, and ScrollTrigger to split text into characters and animate the reveal on scroll.",
    },
    {
      question: "Should it support reduced motion?",
      answer:
        "Yes. Always provide a readable static or simplified fallback for reduced-motion users.",
    },
    {
      question: "Can Hyperiux customize Overflow Stagger Text for a website?",
      answer:
        "Yes. Hyperiux can adapt the split type, stagger timing, mask behaviour, scroll trigger, easing, responsive handling, and typography styling into a custom website section.",
    },
  ],

  finalCta: {
    body: "Use Overflow Stagger Text when your typography needs a more intentional motion treatment that supports the message without sacrificing readability.",
    primary: "Install Overflow Stagger Text",
    secondary: "View Text Effects",
    commercial: "Request a Custom Typography Effect",
  },
},
"text-fill-animation": {
  seo: {
    primaryKeyword: "React text fill animation",
    secondaryKeywords: [
      "text fill effect React",
      "animated text fill CSS",
      "scroll text fill animation",
      "Next.js text animation",
      "React typography animation",
      "text color fill animation",
    ],
    title: "Text Fill Animation for React & Next.js | Hyperiux Vault",
    description:
      "Add a text fill animation to your React or Next.js website. Preview the typography fill effect, install it with the Hyperiux CLI, and customize it for hero sections, scroll storytelling, CTAs, landing pages, and portfolio websites.",
  },

  h1: "Text Fill Animation for React and Next.js",

  shortDescription:
    "A typography animation that progressively fills text with colour, gradient, or motion to create emphasis and visual progression.",

  heroCopy: [
    "The Text Fill Animation effect is one of the most commercially useful typography effects in the Vault because it adds motion, emphasis, and hierarchy without making the text hard to read. Instead of moving the text into view, scrambling characters, or revealing letters through a mask, this effect keeps the typography visible while progressively filling it with colour, gradient, or visual treatment. The result is a text animation that feels active, but still clear.",

    "This effect is especially useful for hero headlines, scroll storytelling sections, product claims, CTA blocks, portfolio intros, agency positioning statements, and editorial headings where a key message needs stronger emphasis. The fill can move from left to right, bottom to top, word by word, line by line, or based on scroll progress. That makes the effect flexible for both static reveal moments and interactive scroll-led storytelling.",

    "For SaaS and product websites, Text Fill Animation can help highlight important claims without making the page feel gimmicky. A product page might use it to fill a key statement as the user scrolls into a feature section. A pricing or CTA section might use it to emphasize a conversion line. An AI or developer tool website might use a gradient fill to make a technical statement feel more alive. For agency and portfolio websites, the effect can make large typography feel more premium and intentional.",

    "The strength of this effect is that it works with typography rather than against it. The text remains the hero. The animation simply adds progression. That makes it safer than glitch, scramble, or distortion effects for many commercial contexts. It can feel refined, technical, editorial, or energetic depending on the fill style.",

    "The key is contrast. The unfilled state and filled state both need to be readable enough for the page context. If the unfilled text is too faint, users may miss the message before the animation completes. If the fill colour is too loud, it can overpower the page. The fill timing also matters. Scroll-driven fills should feel connected to the user's movement, while automatic fills should complete quickly enough to preserve readability.",

    "Use Text Fill Animation when you want a message to build visual emphasis over time. It is one of the best text effects for modern landing pages because it feels premium, readable, and directly tied to message hierarchy.",
  ],

  bestUsedFor: [
    "Hero headlines",
    "Section intros",
    "Portfolio titles",
    "Agency websites",
    "Landing pages",
    "Editorial layouts",
    "CTA sections",
    "Product pages",
    "Campaign pages",
    "Creative websites",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Text Fill Animation effect to your project. This adds the scroll typography fill component locally so you can tune the fill colour, dim colour, scroll distance, typography size, and responsive behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add text-fill-animation",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the text target",
      body: "Use the effect on short, high-impact typography such as headings, titles, product claims, positioning statements, editorial lines, or CTA copy. The text should be important enough to deserve scroll-linked emphasis.",
    },

    {
      title: "Step 3: Add the component",
      body: "Pass the message into TextFillAnimation using the text prop, then control the visual treatment with textColor, primaryColor, dimColor, backgroundColor, size, and width props. The component uses GSAP SplitText to split the message into characters and fills each character as the section scrolls.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import React from "react";
import TextFillAnimation from "@/components/TextAnims/TextFillAnimation";
import { ReactLenis } from "lenis/react";

const Page = () => {
  return (
    <ReactLenis root>
      <TextFillAnimation
        text="Design systems should feel effortless, not like you're fighting your own components every time you build."
        textSize="3vw"
        textWidth="60%"
        textColor="#111111"
        primaryColor="#ff6b00"
        dimColor="#AAAAAA"
        backgroundColor="#F0EFE9"
        id="hero-break"
        containerClassName=""
        mobileTextSize="8vw"
        mobileTextWidth="92%"
        tabletTextSize="6vw"
        tabletTextWidth="88%"
      />
    </ReactLenis>
  );
};

export default Page;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The text prop controls the message being animated. The text starts in the dimColor state, briefly passes through primaryColor, and resolves into textColor as scroll progresses. The id prop creates scoped styles for the section, while textSize, textWidth, mobileTextSize, mobileTextWidth, tabletTextSize, and tabletTextWidth control responsive typography without editing the component internals.",
        },
      ],
    },

    {
      title: "Step 4: Configure the animation behaviour",
      body: "Tune the scroll distance, colour transition, typography scale, width, and responsive sizes based on the use case. The fill should feel connected to the user's scroll, but the message must remain readable before, during, and after the animation.",
      blocks: [
        {
          type: "props",
          title: "TextFillAnimation Props",
        },
      ],
    },

    {
      title: "Step 5: Test readability",
      body: "Make sure the final text remains readable and that the animation does not delay comprehension. Test the unfilled dim state, the highlight colour, line breaks, and contrast across desktop, tablet, and mobile.",
    },

    {
      title: "Step 6: Add responsive and reduced-motion handling",
      body: "Simplify the effect on mobile and show a readable static state for reduced-motion users. Avoid applying the effect to too many text blocks at once, especially on long editorial pages.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "text-fill-animation.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Trigger",
      recommendation:
        "Use page load, viewport entry, scroll, or hover based on the content moment. Scroll works especially well for storytelling statements.",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the fill short and polished. Avoid making users wait too long for the text to become fully readable.",
    },
    {
      option: "Text length",
      recommendation:
        "Use short display text or compact statements. Avoid long paragraphs.",
    },
    {
      option: "Intensity",
      recommendation:
        "Start subtle and increase only if the brand supports expressive typography.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Reduce complexity and test line breaks, text width, and font scale on smaller screens.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Show a stable readable fallback for users who prefer reduced motion.",
    },
  ],

  notes: {
    performance:
      "Text Fill Animation is usually performant when animation uses class changes, transform, opacity, and scroll-linked character staggering carefully. Avoid applying the effect to too many text elements at once, and test if using continuous scroll-linked animation on long pages.",

    accessibility:
      "The text must remain readable in the DOM. Decorative animation layers should not create repeated screen-reader output. Respect reduced-motion preferences and ensure the final readable text state is accessible.",

    mobile:
      "On mobile, reduce movement, complexity, and text density. Test line breaks, clipping, and readability across screen sizes because SplitText-based animations can behave differently when typography wraps.",
  },

  commonMistakes: [
    "Using the effect on long paragraphs.",
    "Making the animation too slow.",
    "Using a dim colour that makes the message unreadable.",
    "Using a fill colour that overpowers the layout.",
    "Applying it to every heading.",
    "Ignoring reduced motion.",
    "Not testing mobile line breaks.",
    "Creating accessibility issues.",
  ],

  relatedEffectNames: [
    "Mask Text Reveal",
    "Overflow Text Reveal",
    "Slide Text Reveal",
    "Blur Text",
    "Scramble Text",
  ],

  faq: [
    {
      question: "What is this effect best used for?",
      answer:
        "It is best used for short display typography such as hero headings, section intros, titles, CTA copy, and creative text moments.",
    },
    {
      question: "Is this suitable for SaaS websites?",
      answer:
        "Yes, when used with restraint and clear readability. It works especially well for product claims, positioning statements, feature narratives, and CTA sections.",
    },
    {
      question: "Does it require GSAP?",
      answer:
        "Yes. This implementation uses GSAP, ScrollTrigger, and SplitText to split text into characters and fill each character based on scroll progress.",
    },
    {
      question: "Should it support reduced motion?",
      answer:
        "Yes. Always provide a readable static or simplified fallback for reduced-motion users.",
    },
    {
      question: "Can Hyperiux customize Text Fill Animation for a website?",
      answer:
        "Yes. Hyperiux can adapt the fill style, colour transition, scroll timing, typography scale, responsive behaviour, and content model into a custom website section.",
    },
  ],

  finalCta: {
    body: "Use Text Fill Animation when your typography needs a more intentional motion treatment that supports the message without sacrificing readability.",
    primary: "Install Text Fill Animation",
    secondary: "View Text Effects",
    commercial: "Request a Custom Typography Effect",
  },
},
"rectangular-text-reveal": {
  seo: {
    primaryKeyword: "React rectangular text reveal",
    secondaryKeywords: [
      "rectangle mask text animation",
      "text reveal React",
      "Next.js text reveal",
      "animated text mask",
      "geometric text reveal",
      "React typography animation",
    ],
    title:
      "Rectangular Text Reveal for React | Geometric Text Mask Animation | Hyperiux Vault",
    description:
      "Add a rectangular text reveal animation to your React or Next.js website. Preview the geometric typography reveal, install it with the Hyperiux CLI, and customize it for hero sections, editorial layouts, portfolios, and creative landing pages.",
  },

  h1: "Rectangular Text Reveal Animation for React and Next.js",

  shortDescription:
    "A geometric text reveal effect that uses rectangular masks, blocks, or clipping areas to reveal typography with structured motion.",

  heroCopy: [
    "The Rectangular Text Reveal effect is built for websites that want typography to appear through a structured, geometric motion system. While circular reveals feel radial and organic, rectangular reveals feel architectural, editorial, and precise. The effect uses rectangular masks, panels, clipping blocks, or moving shapes to reveal text in a controlled way. This gives the typography a strong sense of structure and visual discipline.",

    "This effect is especially useful for agency websites, design studios, architecture portfolios, editorial layouts, fashion campaigns, technical brands, and creative landing pages where the visual system is based on grids, blocks, panels, or clean composition. It can make text feel like it is being uncovered by the layout itself. Instead of floating into view, the words are revealed through a designed frame.",

    "For portfolio and agency websites, Rectangular Text Reveal can make project titles, section headings, and service statements feel more crafted. For editorial pages, it can create a magazine-like reveal that pairs well with large type and strong spacing. For SaaS and product websites, it can work in hero sections or feature intros where the brand wants a more precise and technical visual language. For architecture, design, and product studios, the rectangular movement can reinforce ideas of structure, layout, systems, and clarity.",

    "The effect works best with short display text. Because the reveal uses a defined rectangular surface, the typography needs to fit cleanly inside the mask or frame. Long text can become awkward, especially on smaller screens. The rectangular motion should feel connected to the page's grid system. If the rest of the layout is soft or organic, the effect may feel too rigid unless carefully styled.",

    "The strongest implementations use the rectangle as part of the composition. It can act as a moving mask, a background panel, a transition block, or a reveal frame. Colours, borders, fill, stroke, and timing can all change the tone. A black rectangular mask can feel bold and editorial. A subtle outline can feel refined. A coloured panel can feel campaign-like.",

    "Use Rectangular Text Reveal when your typography needs a clean, geometric entrance that feels intentional and structured. It is a useful effect for brands that want motion to feel designed around layout rather than decoration.",
  ],

  bestUsedFor: [
    "Hero headlines",
    "Section intros",
    "Portfolio titles",
    "Agency websites",
    "Landing pages",
    "Editorial layouts",
    "CTA sections",
    "Product pages",
    "Campaign pages",
    "Creative websites",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Rectangular Text Reveal effect to your project. This adds the geometric text reveal component locally so you can tune direction, colours, timing, overlay behaviour, stagger, and scroll trigger settings.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add rectangular-text-reveal",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the text target",
      body: "Use the effect on short, high-impact typography such as hero headlines, section intros, editorial statements, product claims, labels, or CTA copy. The reveal works best when the text is important enough to deserve a structured entrance.",
    },

    {
      title: "Step 3: Add the component",
      body: "Wrap your target text inside TextBlockReveal. The component splits text into lines, creates rectangular reveal blocks for each line, then animates those blocks across the text based on the selected direction.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import TextBlockReveal from "@/components/RectangularTextReveal/RectangularTextReveal";
import React from "react";
import { ReactLenis } from "lenis/react";

const showcaseSections = [
  {
    eyebrow: "Bottom Reveal",
    direction: "bottom",
    title: "Bold headlines can arrive with a grounded upward motion.",
    body: "Use the bottom direction when you want the color block to push up through the line, giving larger statements a heavier and more cinematic entrance.",
    baseColor: "#ff6b00",
    overlayColor: "#111111",
    useOverlay: true,
  },
  {
    eyebrow: "Right Reveal",
    direction: "right",
    title: "Dense editorial copy feels sharper when the wipe snaps in from the right.",
    body: "This variation works well for supporting paragraphs, callouts, and smaller moments where the reveal should feel precise without overpowering the content around it.",
    baseColor: "#111111",
    overlayColor: "#f97316",
    useOverlay: false,
  },
  {
    eyebrow: "Top Reveal",
    direction: "top",
    title: "Vertical motion brings a more structured, architectural rhythm.",
    body: "Top-to-bottom reveals are helpful when the composition already has strong vertical alignment and you want the animation to reinforce that visual system.",
    baseColor: "#111111",
    overlayColor: "#eab308",
    useOverlay: true,
  },
  {
    eyebrow: "Left Reveal",
    direction: "left",
    title: "The default leftward sweep is still the most versatile all-rounder.",
    body: "It reads quickly, feels familiar, and gives product storytelling sections an energetic but controlled sense of progression as the user scrolls.",
    baseColor: "#2563eb",
    overlayColor: "#dbeafe",
    useOverlay: true,
  },
];

export default function Page() {
  return (
    <ReactLenis root>
      <div className="min-h-screen w-screen bg-white text-black">
        <section className="flex min-h-screen items-center justify-center px-[6vw]">
          <div className="flex w-full max-w-360 flex-col gap-[2vw] max-sm:gap-[10vw] max-md:gap-[6vw]">
            <p className="text-[1rem] uppercase tracking-[0.35em] text-black/50">
              Rectangular Text Reveal
            </p>

            <TextBlockReveal
              overlayEnterDuration={0.35}
              overlayExitDuration={0.35}
              direction="bottom"
              coverDuration={0.4}
              revealDuration={0.5}
              baseColor="#ff6b00"
              overlayColor="#111111"
              className="max-w-6xl"
            >
              <h1 className="text-6xl max-sm:text-3xl leading-[0.95] font-semibold">
                A directional rectangular reveal built for expressive,
                editorial motion systems.
              </h1>
            </TextBlockReveal>

            <div className="max-w-160">
              <TextBlockReveal
                baseColor="#111111"
                coverDuration={0.32}
                direction="left"
                revealDuration={0.36}
                overlayColor="#f5f5f5"
              >
                <p className="leading-[1.6] text-black/75">
                  Scroll through the page to compare each reveal direction in
                  context. Every example below is tuned to feel slightly
                  different, so the component reads like a flexible motion
                  primitive instead of a one-note effect.
                </p>
              </TextBlockReveal>
            </div>
          </div>
        </section>

        <section className="px-[6vw] max-md:px-[7vw] pb-[10vw]">
          <div className="mx-auto flex w-full max-w-360 flex-col gap-[5vw]">
            {showcaseSections.map((section, index) => (
              <div
                key={section.direction}
                className="grid gap-[2vw] max-sm:gap-[10vw] max-sm:py-[15vw] max-md:py-[10vw] max-md:gap-[6vw] border-t border-black/10 py-[4vw] md:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="flex flex-col gap-10">
                  <p className="text-sm uppercase tracking-[0.28em] text-black/45">
                    {section.eyebrow}
                  </p>

                  <p className="max-w-88 text-xl max-sm:text-xl leading-[1.7] text-black/55">
                    Variation {index + 1} demonstrates how the same reveal
                    mechanic can shift tone depending on the travel direction,
                    pacing, and color pairing.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <TextBlockReveal
                    direction={section.direction}
                    baseColor={section.baseColor}
                    overlayColor={section.overlayColor}
                    useOverlay={section.useOverlay}
                    coverDuration={0.34}
                    revealDuration={0.42}
                    overlayEnterDuration={0.24}
                    overlayExitDuration={0.28}
                  >
                    <h2 className="max-w-3xl text-[clamp(2rem,4.3vw,4.75rem)] leading-[1.02] font-semibold">
                      {section.title}
                    </h2>
                  </TextBlockReveal>

                  <div className="max-w-136">
                    <TextBlockReveal
                      direction={section.direction}
                      baseColor={section.baseColor}
                      overlayColor={section.overlayColor}
                      useOverlay={false}
                      stagger={0.12}
                      coverDuration={0.26}
                      revealDuration={0.3}
                    >
                      <p className="text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.75] text-black/70">
                        {section.body}
                      </p>
                    </TextBlockReveal>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The reveal is applied by wrapping typography inside TextBlockReveal. The children prop supplies the text or heading element. Direction controls where the rectangle travels from, baseColor controls the main reveal block, overlayColor controls the optional secondary reveal layer, and timing props such as coverDuration, revealDuration, overlayEnterDuration, overlayExitDuration, stagger, and delay control the movement.",
        },
      ],
    },

    {
      title: "Step 4: Configure the animation behaviour",
      body: "Tune direction, trigger, timing, easing, intensity, overlay behaviour, inset values, stagger, and final state based on the use case. Use left or right for editorial wipes, top or bottom for more architectural vertical motion.",
      blocks: [
        {
          type: "props",
          title: "TextBlockReveal Props",
        },
      ],
    },

    {
      title: "Step 5: Test readability",
      body: "Make sure the final text remains readable and that the animation does not delay comprehension. Check line breaks, mask spacing, reveal block size, and colour contrast across desktop and mobile.",
    },

    {
      title: "Step 6: Add responsive and reduced-motion handling",
      body: "Simplify the effect on mobile and show a readable static state for reduced-motion users. Avoid applying the reveal to too many text blocks at once, especially on content-heavy pages.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "rectangular-text-reveal.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Trigger",
      recommendation:
        "Use viewport entry or scroll for section-level typography. Avoid triggering too many reveals at once.",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the reveal short and polished so users do not wait for the text to become readable.",
    },
    {
      option: "Text length",
      recommendation:
        "Use short display text. Long paragraphs can become awkward inside rectangular masks.",
    },
    {
      option: "Intensity",
      recommendation:
        "Start subtle and increase only if the brand supports strong geometric motion.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Reduce complexity and test line breaks, clipping, and mask spacing on smaller screens.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Show a stable readable fallback for users who prefer reduced motion.",
    },
  ],

  notes: {
    performance:
      "Rectangular Text Reveal is usually performant when animation uses transform and opacity. Avoid applying the effect to too many text elements at once and test carefully if using masks, filters, or continuous scroll-linked animation.",

    accessibility:
      "The text must remain readable in the DOM. Decorative reveal rectangles should not create repeated screen-reader output. Respect reduced-motion preferences and make sure the final text state is accessible.",

    mobile:
      "On mobile, reduce movement, complexity, and text density. Test line breaks, clipping, and readability across screen sizes because SplitText-based reveals can behave differently when typography wraps.",
  },

  commonMistakes: [
    "Using the effect on long paragraphs.",
    "Making the animation too slow.",
    "Reducing readability.",
    "Applying it to every heading.",
    "Ignoring reduced motion.",
    "Not testing mobile line breaks.",
    "Creating accessibility issues.",
  ],

  relatedEffectNames: [
    "Mask Text Reveal",
    "Overflow Text Reveal",
    "Slide Text Reveal",
    "Blur Text",
    "Scramble Text",
  ],

  faq: [
    {
      question: "What is this effect best used for?",
      answer:
        "It is best used for short display typography such as hero headings, section intros, titles, CTA copy, and creative text moments.",
    },
    {
      question: "Is this suitable for SaaS websites?",
      answer:
        "Yes, when used with restraint and clear readability. More expressive versions fit design-led or technical brands better.",
    },
    {
      question: "Does it require GSAP?",
      answer:
        "Yes. This implementation uses GSAP, CustomEase, ScrollTrigger, and SplitText to split text into lines and animate rectangular reveal blocks.",
    },
    {
      question: "Should it support reduced motion?",
      answer:
        "Yes. Always provide a readable static or simplified fallback for reduced-motion users.",
    },
    {
      question: "Can Hyperiux customize Rectangular Text Reveal for a website?",
      answer:
        "Yes. Hyperiux can adapt the direction, timing, overlay layers, colour system, line splitting, scroll trigger, responsive handling, and typography styling into a custom website section.",
    },
  ],

  finalCta: {
    body: "Use Rectangular Text Reveal when your typography needs a more intentional motion treatment that supports the message without sacrificing readability.",
    primary: "Install Rectangular Text Reveal",
    secondary: "View Text Effects",
    commercial: "Request a Custom Typography Effect",
  },
},
  },
  "buttons":{
    "scramble-link-button": {
  seo: {
    primaryKeyword: "React scramble link button",
    secondaryKeywords: [
      "scramble link animation React",
      "animated link button React",
      "text scramble button",
      "Next.js link animation",
      "hover scramble text",
      "creative CTA animation",
    ],
    title:
      "Scramble Link Button for React | Animated Text Link Effect | Hyperiux Vault",
    description:
      "Add a scramble link button animation to your React or Next.js website. Preview the hover text scramble effect, install it with the Hyperiux CLI, and customize it for navigation links, CTAs, portfolios, and digital landing pages.",
  },

  h1: "Scramble Link Button for React and Next.js",

  shortDescription:
    "A link-style button where the label briefly scrambles on hover before resolving into the final readable CTA.",

  heroCopy: [
    "The Scramble Link Button effect is one of the strongest button/link effects in this category because it combines a popular digital text animation with a practical interface pattern. It gives links and lightweight CTAs a sharper hover state by scrambling the label briefly before resolving back into readable text. The effect feels active, technical, and memorable without requiring a large button surface or heavy animation.",

    "This effect is especially useful for developer portfolios, AI product websites, digital agencies, creative landing pages, cybersecurity pages, Web3 campaigns, interactive navigation, and experimental interfaces. It works well where the brand wants text interactions to feel more digital and expressive. A normal link hover changes colour. A scramble link feels like the interface is processing, decoding, or reacting.",

    "For Hyperiux Vault-style pages, Scramble Link Button can work beautifully on actions like “View Effect,” “Install Component,” “Copy CLI,” “Explore Category,” or “Request Custom Build.” For agency and portfolio websites, it can make project links, navigation items, and case study CTAs feel more authored. For SaaS pages, it can work if used selectively on technical or developer-facing CTAs.",

    "The effect should remain fast and readable. A link exists to help users move. If the scramble lasts too long, the action becomes less clear. If the character set is too aggressive, the label can become visually noisy. The best implementation uses a quick scramble burst on hover or focus, then resolves instantly into the original text. The final label should never be ambiguous.",

    "Scramble Link Button works best on short labels. Long link text can make the scramble messy. It also needs accessibility care. The scrambled visual text should not confuse screen readers. Use Scramble Link Button when a standard text link feels too plain and the brand can support a digital interaction language.",
  ],

  bestUsedFor: [
    "Developer portfolios",
    "Digital agency websites",
    "AI product CTAs",
    "Navigation links",
    "Project links",
    "Case study links",
    "Effect library links",
    "Technical product pages",
    "Cybersecurity websites",
    "Creative landing pages",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Scramble Link Button component to your project. This adds the link component and its required CSS locally so you can tune the scramble timing, hover colour, underline behaviour, icon state, and accessibility details.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add scramble-link-button",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose a short link label",
      body: "Use concise labels like “View Effect,” “Open Project,” “Install,” “Explore,” or “Read Case Study.” Short labels resolve quickly and keep the scramble readable.",
    },

    {
      title: "Step 3: Add the component",
      body: "Render ScrambleLinkButton where you need a link-style CTA or interactive navigation action. The text prop controls the label, href controls the destination, and className lets you style the button with your existing typography system.",
      blocks: [
       {
  type: "code",
  title: "Usage",
  filename: "page.jsx",
  language: "jsx",
  code: `import ScrambleLinkButton from "@/components/Buttons/LinkButtons/ScrambleLinkButton/ScrambleLinkButton";
import { ButtonDemoShell } from "@/components/Buttons/ButtonDemoShell";

export default function Page() {
  return (
    <ButtonDemoShell
      title="Scramble Link Button"
      backgroundSrc="/assets/buttonbg/bg03.png"
    >
      <ScrambleLinkButton
        href="#"
        text="Hover me"
        className="text-[2vw] max-sm:text-[4.5vw]"
      />
    </ButtonDemoShell>
  );
}`,
},
{
  type: "code",
  title: "Demo Wrapper",
  filename: "ButtonDemoShell.jsx",
  language: "jsx",
  code: `import Image from "next/image";

export function ButtonDemoShell({
  title,
  backgroundSrc,
  children,
}) {
  return (
    <section className="relative z-999 h-screen overflow-hidden px-6 py-20 text-white">
      <div className="relative z-1 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-center gap-16">
        <div className="space-y-4 max-sm:space-y-8 max-md:space-y-10 text-center">
          <p className="text-xs max-sm:text-sm max-md:text-base uppercase tracking-[0.4em] text-white/60">
            Hyperiux Button Demo
          </p>

          <h1 className="text-5xl font-medium max-sm:text-4xl">
            {title}
          </h1>
        </div>

        <div className="flex min-h-64 w-full items-center justify-center rounded-4xl border border-white/10 bg-black/20 px-8 py-12 backdrop-blur-sm max-sm:px-4">
          {children}
        </div>
      </div>

      <div className="fixed inset-0 -z-10">
        <Image
          src={backgroundSrc}
          alt={title}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          priority
        />

        <div className="absolute inset-0 bg-black/45" />
      </div>
    </section>
  );
}`,
},
{
  type: "text",
  title: "How the demo wrapper works",
  body: "ButtonDemoShell is only the presentation wrapper for the preview page. It provides the full-screen background image, title area, dark overlay, and centered demo surface. ScrambleLinkButton remains the actual reusable component. In production, you can use ScrambleLinkButton directly without ButtonDemoShell.",
},

        {
          type: "text",
          title: "How the data is passed",
          body: "The text prop becomes the final readable label. On hover, the component temporarily replaces that visible label with randomized glyphs, then resolves back into the original text. The href prop is passed to Next Link, while props like hoverColor, scrambleDuration, stepMs, revealStagger, showLine, and showArrow control the visual behaviour.",
        },
      ],
    },

    {
      title: "Step 4: Configure the scramble behaviour",
      body: "Choose letters, numbers, symbols, or a controlled digital character set. Keep the animation short so the label resolves quickly and users never lose the meaning of the CTA.",
      blocks: [
        {
          type: "props",
          title: "ScrambleLinkButton Props",
        },
      ],
    },

    {
      title: "Step 5: Trigger on hover and focus",
      body: "The default implementation triggers on hover. For production accessibility, add a focus handler that runs the same scramble logic so keyboard users receive the same interactive feedback.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "scramble-link-button.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Preserve the accessible label",
      body: "Keep the semantic label stable even while the visual text scrambles. The visible text can change during hover, but the action should remain understandable to assistive technology and keyboard users.",
      blocks: [
        {
          type: "code",
          title: "Styles",
          filename: "ScrambleLinkButton.css",
          language: "css",
          code: `.scramble-link-btn {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: color 0.35s ease;
}

.scramble-link-btn:hover {
  color: var(--scramble-hover-color, currentColor);
}

.scramble-link-btn__inner {
  position: relative;
  display: inline-block;
}

.scramble-link-btn__ghost {
  display: inline-block;
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
  user-select: none;
  font-variant-ligatures: none;
}

.scramble-link-btn__text {
  position: absolute;
  inset: 0;
  display: inline-block;
  white-space: pre;
  font-variant-ligatures: none;
}

.scramble-link-line {
  position: relative;
  width: fit-content;
}

.scramble-link-line::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4%;
  width: 100%;
  height: 1.5px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s cubic-bezier(0.625, 0.05, 0, 1);
}

.scramble-link-btn:hover .scramble-link-line::after {
  transform: scaleX(1);
  transform-origin: left;
}

.scramble-link-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.scramble-link-btn__svg {
  transition: transform 0.3s ease;
}

.scramble-link-btn:hover .scramble-link-btn__svg {
  transform: rotate(-45deg);
}`,
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Character set",
      recommendation:
        "Use controlled symbols, letters, or numbers for a technical feel. Avoid unreadable glyphs.",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the scramble very short for usability. The label should resolve quickly.",
    },
    {
      option: "Trigger",
      recommendation:
        "Use hover and focus so both mouse and keyboard users get the same feedback.",
    },
    {
      option: "Label length",
      recommendation:
        "Short labels work best. Long link text can become visually noisy.",
    },
    {
      option: "Repeat",
      recommendation:
        "Avoid endless scrambling. Run a quick burst, then resolve to the final label.",
    },
    {
      option: "Accessibility",
      recommendation:
        "Keep the semantic label stable and do not expose scrambled characters as meaningful content.",
    },
  ],

  notes: {
    performance:
      "Scramble Link Button is lightweight for short labels. Avoid applying it to many long links at once because repeated timers and text updates can become noisy and unnecessary.",

    accessibility:
      "The accessible label should remain stable. Do not expose scrambled characters as changing screen-reader content. Add focus support so keyboard users receive the same intentional state as hover users.",

    mobile:
      "On mobile, hover does not apply. Use tap feedback, a stable label, or a simplified interaction state instead of relying on hover-only scrambling.",
  },

  commonMistakes: [
    "Making the scramble too long.",
    "Using unreadable symbols.",
    "Applying it to long link text.",
    "Triggering repeated animation constantly.",
    "Ignoring keyboard focus.",
    "Confusing screen readers.",
    "Using it on serious legal or policy links.",
  ],

  relatedEffectNames: [
    "Scramble Text",
    "Character Stagger Button",
    "Text Hover Expand",
    "Link Button",
    "Glitchy Text",
  ],

  faq: [
    {
      question: "What is Scramble Link Button best used for?",
      answer:
        "It is best for short interactive links, portfolio CTAs, navigation items, developer-facing actions, and digital brand websites.",
    },
    {
      question: "Is it good for primary CTAs?",
      answer:
        "It can be, but it is usually better for link-style actions or secondary CTAs. For primary CTAs, use it carefully and keep the scramble very fast.",
    },
    {
      question: "Can it trigger on focus?",
      answer:
        "Yes. It should support focus states for keyboard accessibility. You can run the same scramble function on focus that you run on hover.",
    },
    {
      question: "Is it suitable for SaaS websites?",
      answer:
        "Yes, especially for AI, developer tools, cybersecurity, and technical products. Use it selectively so the interface still feels clear and trustworthy.",
    },
    {
      question: "Can Hyperiux customize Scramble Link Button for a website?",
      answer:
        "Yes. Hyperiux can adapt the glyph set, scramble timing, hover colour, underline style, icon behaviour, focus state, and CTA styling into a custom link interaction system.",
    },
  ],

  finalCta: {
    body: "Use Scramble Link Button when a link needs a sharper digital hover state than a basic underline.",
    primary: "Install Scramble Link Button",
    secondary: "View Button Effects",
    commercial: "Request Custom Link Interactions",
  },
},
"link-button": {
  seo: {
    primaryKeyword: "React link button",
    secondaryKeywords: [
      "animated link button React",
      "React CTA link",
      "Next.js link button",
      "text link animation",
      "interactive link button",
    ],
    title:
      "Link Button for React | Animated CTA Link Component | Hyperiux Vault",
    description:
      "Add a polished link button component to your React or Next.js website. Preview the animated CTA link, install it with the Hyperiux CLI, and customize it for navigation, inline CTAs, portfolios, and landing pages.",
  },

  h1: "Link Button Component for React and Next.js",

  shortDescription:
    "A refined link-style button for inline CTAs, navigation actions, project links, and lightweight conversion moments.",

  heroCopy: [
    "The Link Button effect is designed for situations where a full button would feel too heavy, but a plain text link would feel too weak. Many websites need mid-weight actions: “View Case Study,” “Explore Services,” “Read More,” “Open Project,” “See Details,” or “Learn How.” These actions are important, but they may not deserve the visual weight of a primary CTA. A well-designed link button gives them enough presence without disrupting the layout.",

    "This component is especially useful for portfolios, agency websites, SaaS landing pages, editorial pages, service pages, case study cards, resource sections, and product feature blocks. It can sit inside cards, under short paragraphs, beside headings, or inside navigation systems. The interaction can include underline movement, arrow motion, text shift, icon reveal, background hint, or subtle hover styling.",

    "For conversion-focused pages, link buttons help create secondary paths without overwhelming the user. The primary CTA may be “Book a Demo,” while link buttons support actions like “See Features,” “Read Case Study,” or “Compare Plans.” For agency websites, link buttons can guide users into work, methodology, services, or contact pages. For editorial websites, they can make article links or resource CTAs feel more designed.",

    "The strength of Link Button is restraint. It should not pretend to be a primary button. It should feel clickable, polished, and clear, but still lighter than the main action. The hover state matters because it signals interactivity. A subtle arrow slide or underline reveal can make the component feel more premium than a default link.",

    "The implementation should preserve accessibility and semantics. If the action navigates, it should be an anchor. If it performs an action, it should be a button. Use Link Button when a page needs a refined secondary action that keeps the layout clean while still encouraging movement.",
  ],

  bestUsedFor: [
    "Secondary CTAs",
    "Inline links",
    "Portfolio project cards",
    "Case study links",
    "Resource cards",
    "Service page actions",
    "Product feature links",
    "Editorial article links",
    "Navigation actions",
    "Footer CTAs",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Link Button component to your project. This adds the link component and its CSS locally so you can tune the underline, icon movement, hover state, mobile label, and click behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add link-button",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the link destination",
      body: "Use the component for navigation actions, not decorative text. The destination should be clear and meaningful, such as a case study page, service page, project detail page, or resource page.",
    },

    {
      title: "Step 3: Add the component",
      body: "Render LinkButton where you need a polished secondary CTA or animated navigation link. The ButtonDemoShell wrapper is only used for the preview page layout. In production, you can use LinkButton directly inside cards, sections, navigation, or footer areas.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import LinkButton from "@/components/Buttons/LinkButtons/LinkButton/LinkButton";
import { ButtonDemoShell } from "@/components/Buttons/ButtonDemoShell";

export default function Page() {
  return (
    <ButtonDemoShell
      title="Link Button"
      backgroundSrc="/assets/buttonbg/new-bg-img.jpg"
    >
      <LinkButton
        text="Hover me"
        href="#"
        iconClassName="size-[2vw] mt-[0.2vw] max-sm:size-[4vw]"
        className="text-[2vw] hover:text-[#ff6b00] max-sm:text-[4.5vw]"
      />
    </ButtonDemoShell>
  );
}`,
        },

        {
          type: "code",
          title: "Demo Wrapper",
          filename: "ButtonDemoShell.jsx",
          language: "jsx",
          code: `import Image from "next/image";

export function ButtonDemoShell({
  title,
  backgroundSrc,
  children,
}) {
  return (
    <section className="relative z-999 h-screen overflow-hidden px-6 py-20 text-white">
      <div className="relative z-1 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-center gap-16">
        <div className="space-y-4 max-sm:space-y-8 max-md:space-y-10 text-center">
          <p className="text-xs max-sm:text-sm max-md:text-base uppercase tracking-[0.4em] text-white/60">
            Hyperiux Button Demo
          </p>

          <h1 className="text-5xl font-medium max-sm:text-4xl">
            {title}
          </h1>
        </div>

        <div className="flex min-h-64 w-full items-center justify-center rounded-4xl border border-white/10 bg-black/20 px-8 py-12 backdrop-blur-sm max-sm:px-4">
          {children}
        </div>
      </div>

      <div className="fixed inset-0 -z-10">
        <Image
          src={backgroundSrc}
          alt={title}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          priority
        />

        <div className="absolute inset-0 bg-black/45" />
      </div>
    </section>
  );
}`,
        },

        {
          type: "text",
          title: "How the demo wrapper works",
          body: "ButtonDemoShell is only the presentation wrapper for the preview page. It provides the full-screen background image, title area, dark overlay, and centered demo surface. LinkButton remains the actual reusable component.",
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The text prop controls the desktop label, while mobileText controls the compact viewport label after the component measures screen width. The href prop is passed to Next Link. The icon prop controls the arrow component, iconClassName controls icon sizing and spacing, and className controls the outer link styling. On compact viewports, clicking toggles the icon rotation and can apply clickedColor.",
        },
      ],
    },

    {
      title: "Step 4: Add hover feedback",
      body: "Configure underline, arrow, opacity, text shift, or icon movement to make the link feel interactive. In this implementation, the underline expands on hover and the arrow rotates on desktop hover or compact viewport click.",
      blocks: [
        {
          type: "props",
          title: "LinkButton Props",
        },
      ],
    },

    {
      title: "Step 5: Match the surrounding layout",
      body: "Keep the link button visually lighter than the primary CTA but stronger than normal body links. It should guide movement without competing with the main action.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "link-button.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add focus state",
      body: "Ensure keyboard users can identify and activate the link. Keep the destination clear, preserve anchor semantics for navigation, and make sure the tap target is comfortable on mobile.",
      blocks: [
        {
          type: "code",
          title: "Styles",
          filename: "LinkButton.css",
          language: "css",
          code: `.btn-link-line {
  position: relative;
  width: fit-content;
}

.btn-link-line::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2%;
  width: 100%;
  height: 1.5px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.62, 0.05, 0.01, 0.99);
}

.group:hover .btn-link-line::after {
  transform: scaleX(1);
  transform-origin: left;
}

li .btn-link-line::after {
  bottom: -20%;
}`,
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Icon",
      recommendation:
        "An optional arrow works well because it gives the link a clearer sense of direction.",
    },
    {
      option: "Underline",
      recommendation:
        "Use an animated underline for clarity. It gives the link enough feedback without making it feel like a heavy button.",
    },
    {
      option: "Text weight",
      recommendation:
        "Medium weight usually works best. The link should feel intentional but not overpower the primary CTA.",
    },
    {
      option: "Hover state",
      recommendation:
        "Keep the hover state subtle and immediate. Arrow rotation, underline reveal, or colour change is usually enough.",
    },
    {
      option: "Label",
      recommendation:
        "Use specific action copy like “View Case Study,” “Explore Services,” or “Compare Plans.” Avoid vague labels.",
    },
    {
      option: "Focus state",
      recommendation:
        "Make focus visible and accessible so keyboard users can identify the active link.",
    },
  ],

  notes: {
    performance:
      "Link Button is lightweight. Keep animations simple and avoid unnecessary wrappers. The underline and icon motion should use transform-based CSS transitions where possible.",

    accessibility:
      "Use anchor elements for navigation and buttons for actions. Provide visible focus states and clear labels. Avoid vague labels like “Click here” when the destination needs context.",

    mobile:
      "Make sure the tap target is large enough and spacing around inline links is comfortable. Because hover is not available on touch devices, provide a clear tap or active state when needed.",
  },

  commonMistakes: [
    "Using vague labels.",
    "Making link buttons look like primary CTAs.",
    "Hiding hover or focus states.",
    "Using buttons for navigation.",
    "Using anchors for actions.",
    "Making tap targets too small.",
    "Overusing subtle links for important actions.",
  ],

  relatedEffectNames: [
    "Arrow Fill Button",
    "Scramble Link Button",
    "Text Hover Expand",
    "Character Stagger Button",
    "Dot Fill Button",
  ],

  faq: [
    {
      question: "When should I use a Link Button instead of a normal button?",
      answer:
        "Use it for secondary actions or navigation links that need presence but should not compete with the main CTA.",
    },
    {
      question: "Should it be an anchor or a button?",
      answer:
        "Use an anchor for navigation and a button for in-page actions or state changes.",
    },
    {
      question: "Is Link Button good for case study cards?",
      answer:
        "Yes. It works well for “View Case Study,” “Open Project,” or “Read More” actions.",
    },
    {
      question: "Can it include an arrow?",
      answer:
        "Yes. A subtle arrow improves direction and click affordance.",
    },
    {
      question: "Can Hyperiux customize Link Button for a website?",
      answer:
        "Yes. Hyperiux can adapt the underline behaviour, arrow motion, hover colour, typography, spacing, mobile state, and CTA styling into a custom link interaction system.",
    },
  ],

  finalCta: {
    body: "Use Link Button when a secondary action needs to feel clear, polished, and lighter than a primary CTA.",
    primary: "Install Link Button",
    secondary: "View Button Effects",
    commercial: "Request Custom CTA Components",
  },
},
"arrow-fill-button": {
  seo: {
    primaryKeyword: "React arrow button animation",
    secondaryKeywords: [
      "animated arrow button React",
      "button fill animation",
      "Next.js animated button",
      "CTA button animation",
      "React hover button effect",
    ],
    title:
      "Arrow Fill Button React Component | Animated CTA Button Effect | Hyperiux Vault",
    description:
      "Add an arrow fill button animation to your React or Next.js website. Preview the animated CTA button, install it with the Hyperiux CLI, and customize it for landing pages, product pages, portfolios, and agency websites.",
  },

  h1: "Arrow Fill Button for React and Next.js",

  shortDescription:
    "An animated CTA button with fill movement and arrow interaction for landing pages, product sites, and premium website interfaces.",

  heroCopy: [
    "The Arrow Fill Button effect is built for websites where calls to action need to feel more intentional than a static button. Buttons are often the most important interactive elements on a page. They ask users to book a call, start a trial, view work, contact the team, download a resource, or move deeper into the site. Yet many buttons are visually flat. A hover colour change is functional, but it rarely adds much perceived quality. Arrow Fill Button adds motion, direction, and tactile feedback to the CTA.",

    "This effect combines two useful behaviours: a fill animation and an arrow interaction. The fill movement gives the button a responsive surface, while the arrow suggests forward movement. Together, they make the CTA feel more active and action-oriented. That makes the effect especially useful for landing pages, SaaS websites, agency pages, portfolios, product pages, service pages, and campaign microsites.",

    "For conversion-focused websites, this button can help important CTAs stand out without becoming loud. It can be used for “Book a Demo,” “View Case Study,” “Start Project,” “Explore Effects,” “Get Started,” or “Contact Sales.” The arrow reinforces direction, while the fill adds a premium hover state. For agency and portfolio websites, the effect can make navigation into work, case studies, or contact pages feel more designed.",

    "The effect should remain fast and readable. Button animation exists to support action, not to delay it. If the fill takes too long, the interaction feels sluggish. If the arrow movement is too dramatic, it can distract from the label. If the fill colour reduces contrast, the button becomes less usable. The label should remain readable in both default and hover states.",

    "Use Arrow Fill Button when your CTA needs a sharper interaction state that communicates movement, confidence, and polish. It is one of the most commercially valuable button effects because it maps directly to conversion moments.",
  ],

  bestUsedFor: [
    "Primary CTAs",
    "SaaS landing pages",
    "Demo booking buttons",
    "Agency contact CTAs",
    "Portfolio case study links",
    "Product page actions",
    "Campaign pages",
    "Pricing page CTAs",
    "Service page buttons",
    "Hero section buttons",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Arrow Fill Button component to your project. This adds the animated CTA button locally so you can tune the fill colour, arrow colour, hover state, sizing, and responsive behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add arrow-fill-button",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add your CTA label",
      body: "Use clear action-oriented text such as “Book a Demo,” “Start Project,” “View Work,” “Explore Effects,” or “Contact Sales.” The button is strongest when the label communicates a real next step.",
    },

    {
      title: "Step 3: Add the component",
      body: "Render ArrowBgFillPrimaryBtn where you need a strong animated CTA. The ButtonDemoShell wrapper is only used for the preview page layout. In production, you can use ArrowBgFillPrimaryBtn directly inside hero sections, pricing blocks, product sections, service pages, or contact areas.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import ArrowBgFillPrimaryBtn from "@/components/Buttons/PrimaryButtons/ArrowBgFillPrimaryBtn/ArrowBgFillPrimaryBtn";
import { ButtonDemoShell } from "@/components/Buttons/ButtonDemoShell";

export default function Page() {
  return (
    <ButtonDemoShell
      title="Arrow Fill Button"
      backgroundSrc="/assets/buttonbg/image01.png"
    >
      <ArrowBgFillPrimaryBtn
        className="bg-[#ff6b00]"
        href="#"
        btnText="Hover me"
      />
    </ButtonDemoShell>
  );
}`,
        },

        {
          type: "code",
          title: "Demo Wrapper",
          filename: "ButtonDemoShell.jsx",
          language: "jsx",
          code: `import Image from "next/image";

export function ButtonDemoShell({
  title,
  backgroundSrc,
  children,
}) {
  return (
    <section className="relative z-999 h-screen overflow-hidden px-6 py-20 text-white">
      <div className="relative z-1 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col items-center justify-center gap-16">
        <div className="space-y-4 max-sm:space-y-8 max-md:space-y-10 text-center">
          <p className="text-xs max-sm:text-sm max-md:text-base uppercase tracking-[0.4em] text-white/60">
            Hyperiux Button Demo
          </p>

          <h1 className="text-5xl font-medium max-sm:text-4xl">
            {title}
          </h1>
        </div>

        <div className="flex min-h-64 w-full items-center justify-center rounded-4xl border border-white/10 bg-black/20 px-8 py-12 backdrop-blur-sm max-sm:px-4">
          {children}
        </div>
      </div>

      <div className="fixed inset-0 -z-10">
        <Image
          src={backgroundSrc}
          alt={title}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          priority
        />

        <div className="absolute inset-0 bg-black/45" />
      </div>
    </section>
  );
}`,
        },

        {
          type: "text",
          title: "How the demo wrapper works",
          body: "ButtonDemoShell is only the presentation wrapper for the preview page. It provides the full-screen background image, title area, dark overlay, and centered demo surface. ArrowBgFillPrimaryBtn remains the actual reusable CTA component.",
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The btnText prop controls the button label. The href prop is passed to the underlying Next Link. Colour props such as bgColor, textColor, fillBgColor, fillTextColor, hoverFillBgColor, hoverFillTextColor, arrowColor, and hoverArrowColor are converted into CSS variables used by the fill layer and arrow icon.",
        },
      ],
    },

    {
      title: "Step 4: Configure the fill animation",
      body: "Set the fill direction, speed, colour, and easing. In this implementation, the fill starts as a clipped circular layer around the arrow and expands across the full button on hover. Keep the transition quick and smooth.",
      blocks: [
        {
          type: "props",
          title: "ArrowBgFillPrimaryBtn Props",
        },
      ],
    },

    {
      title: "Step 5: Style the arrow",
      body: "Choose arrow size, position, colour, and movement behaviour. The arrow should support the CTA, not overpower it. In this implementation, two arrow paths swap positions on hover to create a directional motion effect.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "arrow-fill-button.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Test contrast, focus, and touch states",
      body: "Make sure the text remains readable before, during, and after the hover fill. Add visible keyboard focus states and ensure touch devices still receive clear feedback even without hover.",
    },
  ],

  customizationOptions: [
    {
      option: "Fill direction",
      recommendation:
        "Left-to-right or arrow-origin fill works best for forward action.",
    },
    {
      option: "Fill colour",
      recommendation:
        "Use strong contrast so the label remains readable in default and hover states.",
    },
    {
      option: "Arrow movement",
      recommendation:
        "Keep the arrow motion subtle. It should reinforce action, not distract from the label.",
    },
    {
      option: "Label",
      recommendation:
        "Use clear action verbs like “Book a Demo,” “Start Project,” or “View Work.”",
    },
    {
      option: "Duration",
      recommendation:
        "Keep the fill fast and responsive so the button never feels sluggish.",
    },
    {
      option: "Focus state",
      recommendation:
        "Match the visual strength of the hover state with a clear keyboard focus state.",
    },
  ],

  notes: {
    performance:
      "Arrow Fill Button is lightweight when implemented with transform or clip-path-based fill layers. Avoid animating layout-heavy properties when transform scaling or clipping can achieve the same effect.",

    accessibility:
      "Use semantic button or anchor elements depending on the action. Maintain readable contrast and visible focus states. The arrow should be decorative unless it communicates meaningful direction.",

    mobile:
      "Hover effects should translate into tap feedback or pressed states. Ensure button size meets touch target expectations on mobile and tablet devices.",
  },

  commonMistakes: [
    "Making the fill too slow.",
    "Reducing label contrast on hover.",
    "Using vague CTA labels.",
    "Moving the arrow too far.",
    "Forgetting focus states.",
    "Using the effect for every minor button.",
    "Making the touch target too small.",
  ],

  relatedEffectNames: [
    "Dot Fill Button",
    "Character Stagger Primary Button",
    "Link Button",
    "Scramble Link Button",
    "Animated Toggle",
  ],

  faq: [
    {
      question: "What is Arrow Fill Button best used for?",
      answer:
        "It is best for primary CTAs, hero buttons, demo buttons, contact buttons, and high-value navigation actions.",
    },
    {
      question: "Is it good for SaaS landing pages?",
      answer:
        "Yes. It is especially useful for primary conversion actions such as demo booking, trial signup, and pricing navigation.",
    },
    {
      question: "Can it be used as a link?",
      answer:
        "Yes. If it navigates to another page, implement it as an accessible anchor styled as a button.",
    },
    {
      question: "Should the arrow animate?",
      answer:
        "Yes, but subtly. The arrow should reinforce action without distracting from the label.",
    },
    {
      question: "Can Hyperiux customize Arrow Fill Button for a website?",
      answer:
        "Yes. Hyperiux can adapt the fill direction, arrow behaviour, button shape, colour system, hover state, focus state, and CTA hierarchy into a custom button system.",
    },
  ],

  finalCta: {
    body: "Use Arrow Fill Button when a CTA needs to feel directional, polished, and more clickable than a static button.",
    primary: "Install Arrow Fill Button",
    secondary: "View Button Effects",
    commercial: "Request a Custom CTA System",
  },
},
  },
  "carousels":{
    "zoom-slider": {
  seo: {
    primaryKeyword: "React zoom slider",
    secondaryKeywords: [
      "zoom carousel React",
      "image zoom slider",
      "Next.js zoom slider",
      "animated image carousel",
      "React image slider animation",
      "creative slider effect",
    ],
    title:
      "Zoom Slider for React | Animated Image Carousel Effect | Hyperiux Vault",
    description:
      "Add a zoom slider to your React or Next.js website. Preview the animated image carousel, install it with the Hyperiux CLI, and customize it for portfolios, product showcases, campaigns, galleries, and visual landing pages.",
  },

  h1: "Zoom Slider for React and Next.js",

  shortDescription:
    "An image or content slider that uses zoom-based motion to create depth, focus, and cinematic slide transitions.",

  heroCopy: [
    "The Zoom Slider effect is designed for websites that want slide transitions to feel more cinematic and visually focused. Standard sliders move from one item to another through a fade, slide, or snap. Zoom Slider adds scale-based movement, allowing images or content panels to zoom in, zoom out, or shift depth during transitions. This creates a stronger feeling of focus and motion without requiring a complex 3D environment.",

    "This effect is especially useful for portfolios, photography websites, product showcases, campaign landing pages, fashion and lifestyle pages, architecture portfolios, travel websites, editorial layouts, and brand storytelling sections. It works best when the visual material is strong and the transition needs to feel immersive. A subtle zoom can make an image feel alive. A controlled zoom-out can reveal context. A zoom-in can direct attention toward detail.",

    "For portfolio and agency websites, Zoom Slider can make project previews feel more premium than a basic carousel. For product websites, it can highlight product visuals, interface screenshots, details, or feature images. For campaign pages, it can create a more emotional visual rhythm. For editorial or photography pages, it can make images feel like part of a cinematic sequence.",

    "The key is subtlety. Zoom effects are common, and if they are exaggerated, they can feel dated or distracting. The zoom should be smooth, controlled, and tied to the slide transition. It should not make users feel like the page is constantly pushing in and out. If the content includes text overlays, the zoom must preserve readability. If images are low resolution, zooming will expose quality issues quickly.",

    "The effect should also provide clear controls. Users should be able to move through slides without waiting for autoplay. On mobile, zoom intensity should be reduced because small screens can make scale movement feel cramped. Use Zoom Slider when you want a reliable, cinematic carousel effect that adds depth and visual polish without becoming too experimental.",
  ],

  bestUsedFor: [
    "Photography websites",
    "Portfolio showcases",
    "Product image galleries",
    "Campaign landing pages",
    "Fashion and lifestyle websites",
    "Architecture portfolios",
    "Travel websites",
    "Editorial layouts",
    "Hero image sliders",
    "Case study previews",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Zoom Slider component to your project. This adds the animated image slider locally so you can tune the image data, wheel behaviour, drag interaction, hover text reveal, and responsive sizing.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add zoom-slider",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Prepare high-quality images",
      body: "Use optimized images with enough resolution to support subtle zoom movement without pixelation. Each item should include a number, image source, title, and short description so the hover reveal has enough context.",
    },

    {
      title: "Step 3: Add the slider section",
      body: "Place the slider in a hero, gallery, product showcase, portfolio, or visual landing page section. The component receives an images array and renders each item as a card inside an infinite scroll-like image strip.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import ZoomSlider from "@/components/Slider/ZoomSlider";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import React from "react";

export const sliderData = [
  {
    number: "01",
    src: "/assets/abstract/image01.png",
    title: "AURA",
    desc: "Soft light and atmospheric tones",
  },
  {
    number: "02",
    src: "/assets/abstract/image07.png",
    title: "DRIFT",
    desc: "Floating through silence",
  },
  {
    number: "03",
    src: "/assets/abstract/image03.png",
    title: "FORM",
    desc: "Shapes carved by light",
  },
  {
    number: "04",
    src: "/assets/abstract/image09.png",
    title: "FLOW",
    desc: "Smooth transitions in motion",
  },
  {
    number: "05",
    src: "/assets/abstract/image05.png",
    title: "DEPTH",
    desc: "Layers and visual weight",
  },
  {
    number: "06",
    src: "/assets/abstract/image06.png",
    title: "ENERGY",
    desc: "Movement captured in time",
  },
  {
    number: "07",
    src: "/assets/abstract/image02.png",
    title: "GLITCH",
    desc: "Breaking visual boundaries",
  },
  {
    number: "08",
    src: "/assets/abstract/image08.png",
    title: "FRAME-X",
    desc: "Cinematic still frame",
  },
  {
    number: "09",
    src: "/assets/abstract/image04.png",
    title: "LIGHTPLAY",
    desc: "Contrast and highlights",
  },
  {
    number: "10",
    src: "/assets/abstract/image05.png",
    title: "MINIMAL",
    desc: "Less but stronger",
  },
];

const Page = () => {
  return (
    <>
      <LenisSmoothScroll />
      <ZoomSlider images={sliderData} />
    </>
  );
};

export default Page;`,
        },

        {
          type: "code",
          title: "Lenis Smooth Scroll",
          filename: "LenisScroll.jsx",
          language: "jsx",
          code: `"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const LenisSmoothScroll = ({
  duration = 1.5,
  lerp = 0.075,
  smoothWheel = true,
  wheelMultiplier = 0.8,
  touchMultiplier = 1.5,
}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration,
        lerp,
        smoothWheel,
        wheelMultiplier,
        touchMultiplier,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
      ref={lenisRef}
    />
  );
};

export default LenisSmoothScroll;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The images prop receives an array of slide objects. Each object becomes one image card in the slider. The number field renders the slide index, src controls the image, title controls the hover heading, and desc controls the supporting hover text. LenisSmoothScroll is used as the smooth scrolling layer for the preview page.",
        },
      ],
    },

    {
      title: "Step 4: Configure zoom direction",
      body: "Choose whether slides zoom in, zoom out, or scale subtly on hover and interaction. In this implementation, card size changes based on its calculated visual width, while hovered images receive a small scale lift.",
      blocks: [
        {
          type: "props",
          title: "ZoomSlider Props",
        },
      ],
    },

    {
      title: "Step 5: Tune zoom intensity",
      body: "Keep zoom subtle. Small scale changes often feel more premium than dramatic movement. Test wheel movement, drag control, card width, card height, and hover text reveal across screen sizes.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "zoom-slider.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add controls and mobile behaviour",
      body: "Provide clear movement behaviour for desktop and touch devices. On mobile, reduce zoom intensity, simplify the interaction if needed, and ensure the slider remains easy to control through touch dragging.",
    },
  ],

  customizationOptions: [
    {
      option: "Zoom scale",
      recommendation:
        "Keep subtle, usually close to original size. Dramatic zoom can feel dated or distracting.",
    },
    {
      option: "Transition speed",
      recommendation:
        "Use smooth but responsive movement so the carousel feels cinematic without becoming sluggish.",
    },
    {
      option: "Image quality",
      recommendation:
        "Use high-quality optimized assets because zoom movement quickly exposes low-resolution images.",
    },
    {
      option: "Overlay text",
      recommendation:
        "Keep hover text readable and compact. Avoid dense copy inside animated image sliders.",
    },
    {
      option: "Controls",
      recommendation:
        "Add arrows, pagination, drag, wheel, or swipe behaviour depending on the use case.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Reduce zoom intensity and make touch gestures feel natural on smaller screens.",
    },
  ],

  notes: {
    performance:
      "Zoom Slider depends heavily on image optimization. Use responsive images, compression, lazy loading where appropriate, and transform-based animation. Avoid oversized source files and too many simultaneous high-resolution slides.",

    accessibility:
      "Provide accessible controls, keyboard navigation, meaningful image alt text, and readable slide labels. Do not rely on autoplay or hover-only interaction as the only way to access slide content.",

    mobile:
      "Reduce zoom amount on mobile and ensure swipe or drag gestures feel natural. Avoid tiny cards or hover-only labels that touch users cannot reliably access.",
  },

  commonMistakes: [
    "Zooming too aggressively.",
    "Using low-resolution images.",
    "Hiding controls.",
    "Relying only on autoplay.",
    "Making overlay text hard to read.",
    "Not optimizing images.",
    "Using too many slides.",
  ],

  relatedEffectNames: [
    "Clip Path Slider",
    "Parallax Slider",
    "Strip Slider",
    "Infinite Perspective Slider",
    "Rotating Carousel",
  ],

  faq: [
    {
      question: "What is Zoom Slider best used for?",
      answer:
        "It works best for image-led sections, portfolios, product galleries, campaign pages, photography websites, and visual storytelling.",
    },
    {
      question: "Is Zoom Slider better than a normal carousel?",
      answer:
        "It is better when image quality and visual mood matter. For simple content, a normal carousel may be lighter.",
    },
    {
      question: "Can I use it for SaaS screenshots?",
      answer:
        "Yes, but keep zoom subtle so UI details remain clear.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes, but zoom intensity should be reduced and swipe or drag controls should be easy to use.",
    },
    {
      question: "Can Hyperiux customize Zoom Slider for a website?",
      answer:
        "Yes. Hyperiux can adapt the zoom intensity, slide sizing, drag behaviour, hover text reveal, smooth scroll setup, image treatment, and responsive behaviour into a custom carousel experience.",
    },
  ],

  finalCta: {
    body: "Use Zoom Slider when your image carousel needs more depth, focus, and cinematic motion than a standard slider.",
    primary: "Install Zoom Slider",
    secondary: "View Carousel Effects",
    commercial: "Request a Custom Image Slider",
  },
},
  },
  "navigation":{
    "directional-menu": {
  seo: {
    primaryKeyword: "React directional menu",
    secondaryKeywords: [
      "directional menu React",
      "animated navigation menu React",
      "mega menu animation",
      "Next.js directional menu",
      "interactive navigation menu",
      "React mega menu component",
    ],
    title:
      "Directional Menu React Component | Animated Navigation Menu | Hyperiux Vault",
    description:
      "Add a directional menu component to your React or Next.js website. Preview the animated navigation menu, install it with the Hyperiux CLI, and customize it for agency websites, SaaS sites, portfolios, product pages, and premium digital experiences.",
  },

  h1: "Directional Menu Component for React and Next.js",

  shortDescription:
    "An animated navigation menu that responds directionally as users move between menu items, panels, and content groups.",

  heroCopy: [
    "The Directional Menu is the highest-priority navigation effect in this category because it solves a real interface problem: how do you make complex navigation feel fluid without making users feel lost? Many modern websites need more than a simple list of links. Agencies need services, work, proof, insights, and contact paths. SaaS websites need product pages, solutions, resources, pricing, integrations, and docs. Portfolios need project categories, case studies, about pages, and contact links. A basic dropdown often feels too flat for this level of structure. A directional menu adds movement, hierarchy, and continuity.",

    "This component is designed for navigation systems where the menu panel changes based on the user’s movement. As users move from one menu item to another, the active panel can slide, reveal, or transition from the relevant direction. This makes the menu feel spatial and responsive. It tells the user that content is changing in relation to their action, not just appearing randomly.",

    "For agency and studio websites, Directional Menu can make service navigation feel more premium. A user can move between Strategy, Design, Development, and Growth, while the panel updates with related links, descriptions, or featured pages. For SaaS websites, it can organize products, use cases, integrations, templates, and resources in a more guided way. For Hyperiux Vault, it could help users navigate effect categories, featured packs, documentation, pricing, and custom implementation paths.",

    "The effect works best when the menu content is thoughtfully structured. Animation cannot save poor information architecture. Each menu group should have a clear label, short description, and useful links. The movement should support orientation. If panels animate too aggressively or change too quickly, users may feel overwhelmed. If hover handling is unstable, the menu can become frustrating.",

    "A production-ready Directional Menu must also handle keyboard navigation, focus states, mobile fallbacks, and pointer movement carefully. Desktop hover menus need robust interaction logic. Mobile users need a different navigation pattern, often an accordion, drawer, or full-screen menu.",

    "Use Directional Menu when your website has enough navigation depth to justify a richer menu system. It is one of the strongest navigation effects for premium websites because it combines visual craft with genuine usability.",
  ],

  bestUsedFor: [
    "Agency websites",
    "SaaS websites",
    "Product navigation",
    "Service navigation",
    "Resource hubs",
    "Mega menus",
    "Portfolio category menus",
    "Documentation navigation",
    "Marketplace navigation",
    "Premium corporate websites",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Directional Menu component to your project. This adds the animated mega menu locally so you can tune the menu data, hover delay, panel transition, height animation, styling, and responsive fallback.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add directional-menu",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Define your navigation groups",
      body: "Create clear top-level groups such as Products, Solutions, Developers, About, Services, Work, Resources, Pricing, or Docs. Only items with customContent render a dropdown panel, while normal items can behave like simple navigation labels.",
    },

    {
      title: "Step 3: Add panel content",
      body: "Each menu group should include useful links, short descriptions, and optional featured links or CTAs. In this implementation, the customContent field receives a React component such as Menu1, Menu2, or Menu3, giving every top-level item its own panel layout.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import DirectionalMegaMenu from "@/components/Menu/DirectionalMegaMenu";
import Menu1 from "@/components/Menu/Menu1";
import Menu2 from "@/components/Menu/Menu2";
import Menu3 from "@/components/Menu/Menu3";

const menuItems = [
  {
    label: "Products",
    customContent: <Menu1 />,
  },
  {
    label: "Solutions",
    customContent: <Menu2 />,
  },
  {
    label: "Developers",
    customContent: <Menu3 />,
  },
  {
    label: "About",
  },
];

export default function DemoPage() {
  return (
    <div className="h-screen max-sm:h-full bg-black max-sm:pb-10 text-white overflow-hidden relative">
      <header className="relative z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-19 flex items-center justify-between">
          <div className="flex items-center gap-3 max-sm:hidden">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-semibold text-sm">
              H
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-white font-medium max-md:text-xl text-lg tracking-tight">
                hyperiux
              </span>
              <span className="text-white/40 text-xs max-md:hidden">
                next generation experiences
              </span>
            </div>
          </div>

          <DirectionalMegaMenu
            items={menuItems}
            closeDelay={80}
            navClassName="mx-auto w-full max-w-7xl justify-center px-6 md:px-10 max-md:translate-x-10 max-sm:translate-x-0"
            contentWrapperClassName="p-8 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl max-sm:h-[92vh] max-md:h-[75vh]"
            animation={{
              duration: 0.35,
              ease: "power2.inOut",
              distance: 100,
              closeOpacityDuration: 0.3,
              openOpacityDuration: 0.3,
              fade: true,
              heightDuration: 0.35,
              heightEase: "power2.inOut",
            }}
          />
        </div>
      </header>

      <section className="relative z-10 pt-25 flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[13vw] sm:text-[11vw] md:text-[7rem] leading-none font-semibold tracking-[-0.06em]">
            Hyperiux
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-white/50 text-base md:text-lg leading-relaxed">
            Building minimal, scalable, and immersive digital products
            engineered for modern brands, developers, and next-gen user
            experiences.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-7 py-3 cursor-pointer rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all duration-300">
              Get Started
            </button>

            <button className="px-7 py-3 rounded-full border cursor-pointer border-white/10 bg-white/3 hover:bg-white/6 transition-all duration-300 text-white/80">
              Explore Platform
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">20+</h3>
              <p className="text-sm text-white/40 mt-2">
                Digital products launched
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">99.9%</h3>
              <p className="text-sm text-white/40 mt-2">
                System reliability
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl p-6">
              <h3 className="text-3xl font-semibold">24/7</h3>
              <p className="text-sm text-white/40 mt-2">
                Developer focused support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The items prop receives an array of navigation objects. Each object needs a label, and any item with customContent becomes a dropdown panel. DirectionalMegaMenu tracks the current and next active index, measures the outgoing and incoming panel heights, then animates the panel direction based on whether the user moved forward or backward across the menu items.",
        },
      ],
    },

    {
      title: "Step 4: Configure directional animation",
      body: "Set how panels enter and exit based on user movement. The animation should make the menu feel spatial but not distracting. Use distance, duration, ease, fade, heightDuration, and heightEase to tune the panel movement and height interpolation.",
      blocks: [
        {
          type: "props",
          title: "DirectionalMegaMenu Props",
        },
      ],
    },

    {
      title: "Step 5: Add hover and focus handling",
      body: "Make sure panel changes feel stable. Avoid flickering when users move between menu items. Use closeDelay and panelGap to make the hover behaviour more forgiving, and avoid overloading the panel with too much content.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "directional-menu.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Create mobile navigation fallback",
      body: "Use an accordion, drawer, or full-screen menu for mobile rather than forcing desktop hover behaviour. Directional hover menus are excellent for desktop navigation, but touch users need a more deliberate tap-based pattern.",
    },
  ],

  customizationOptions: [
    {
      option: "Panel direction",
      recommendation:
        "Match movement between menu items so the transition helps users understand spatial direction.",
    },
    {
      option: "Menu groups",
      recommendation:
        "Keep top-level groups clear. Too many groups make the navigation feel heavy and harder to scan.",
    },
    {
      option: "Animation speed",
      recommendation:
        "Keep panel transitions fast and stable. Navigation animation should never feel like a loading delay.",
    },
    {
      option: "Panel content",
      recommendation:
        "Use useful links, short descriptions, featured pages, and CTAs. Avoid dumping too many links into one panel.",
    },
    {
      option: "Hover delay",
      recommendation:
        "Add a small close delay to avoid flicker when users move between navigation items and the panel.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Use an accordion, drawer, or full-screen navigation instead of desktop hover behaviour.",
    },
  ],

  notes: {
    performance:
      "Directional menus are usually lightweight, but hover handling and panel transitions should be optimized. Avoid re-rendering the full menu tree unnecessarily on every pointer movement, and avoid expensive panel content that recalculates on every hover.",

    accessibility:
      "Support keyboard navigation, visible focus states, ARIA attributes where appropriate, escape-to-close behaviour, and logical tab order. Do not make hover the only way to access menu content.",

    mobile:
      "On mobile, use a separate navigation pattern. Directional hover menus do not translate well to touch interfaces, so a drawer, accordion, or full-screen menu is usually a better fallback.",
  },

  commonMistakes: [
    "Weak information architecture.",
    "Too many top-level menu items.",
    "Flickering hover states.",
    "Slow panel transitions.",
    "No keyboard support.",
    "No mobile fallback.",
    "Overloading panels with too many links.",
  ],

  relatedEffectNames: [
    "Immersive Full Screen Navigation",
    "Expanding Navbar",
    "Elevate Navbar",
    "Interactive Arrows",
    "Tabs",
  ],

  faq: [
    {
      question: "What is Directional Menu best used for?",
      answer:
        "It is best for websites with deeper navigation structures, such as agencies, SaaS products, marketplaces, documentation hubs, and resource-heavy websites.",
    },
    {
      question: "Is Directional Menu the same as a mega menu?",
      answer:
        "It can function like a mega menu, but with directional animation and richer interaction between menu panels.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "The desktop interaction should be replaced with a mobile-specific drawer, accordion, or full-screen navigation.",
    },
    {
      question: "Can I use it in Next.js?",
      answer:
        "Yes. Use it inside a client component if the menu depends on hover, pointer, or animation state.",
    },
    {
      question: "Can Hyperiux customize Directional Menu for a website?",
      answer:
        "Yes. Hyperiux can adapt the menu structure, directional animation, hover handling, mobile fallback, panel content model, and accessibility behaviour into a custom navigation system.",
    },
  ],

  finalCta: {
    body: "Use Directional Menu when your navigation needs structure, depth, and a more premium interaction model than a standard dropdown.",
    primary: "Install Directional Menu",
    secondary: "View Navigation Effects",
    commercial: "Request a Custom Navigation System",
  },
},
"elevate-navbar": {
  seo: {
    primaryKeyword: "React animated navbar",
    secondaryKeywords: [
      "React navbar component",
      "animated navbar React",
      "Next.js navbar",
      "sticky navbar animation",
      "scroll navbar React",
      "modern navigation bar",
    ],
    title:
      "Elevate Navbar React Component | Animated Sticky Navigation Bar | Hyperiux Vault",
    description:
      "Add an elevated navbar component to your React or Next.js website. Preview the animated sticky navigation, install it with the Hyperiux CLI, and customize it for SaaS websites, portfolios, agency sites, and landing pages.",
  },

  h1: "Elevate Navbar Component for React and Next.js",

  shortDescription:
    "A polished animated navbar that changes elevation, background, or visual state as users scroll through the page.",

  heroCopy: [
    "The Elevate Navbar component is designed for websites that need navigation to feel polished, responsive, and production-ready. A navbar is one of the first elements users see, and one of the few elements that often stays visible across the entire page. If it feels unfinished, the whole website can feel less refined. Elevate Navbar improves this key interface layer by giving the navigation bar a clear visual response as users scroll or interact.",

    "This component is especially useful for SaaS websites, agency homepages, product landing pages, portfolios, documentation pages, startup websites, and long-scroll marketing pages. The navbar can begin transparent or flat at the top of the page, then gain background, shadow, blur, border, or elevation after the user scrolls. This creates a clean transition from hero state to reading/navigation state.",

    "For SaaS websites, this pattern is valuable because it keeps navigation accessible while preserving a clean hero section. The navbar can stay subtle over the hero, then become more legible as users move into content. For agency and portfolio websites, it can add a premium feel without requiring heavy animation. For product pages and docs, it improves usability by keeping navigation visible and readable.",

    "The effect is practical, not just decorative. A navbar that changes state on scroll can improve contrast and orientation. It tells users that they have moved beyond the opening section. It can also make sticky navigation feel less intrusive by adapting to context. The challenge is to avoid overdesigning it. Too much blur, too much shadow, or constant animation can make the navbar distracting.",

    "A production-ready Elevate Navbar should handle scroll state cleanly, avoid layout shift, work across light and dark backgrounds, support responsive navigation, and maintain accessibility. Links, buttons, dropdowns, and menu triggers should remain easy to use. On mobile, the navbar should pair with a clear menu pattern.",

    "Use Elevate Navbar when a website needs a refined sticky navigation system that adapts to scroll without feeling heavy. It is one of the safest navigation components for commercial websites because it improves both polish and usability.",
  ],

  bestUsedFor: [
    "SaaS websites",
    "Product landing pages",
    "Agency websites",
    "Portfolio websites",
    "Startup homepages",
    "Documentation pages",
    "Long-scroll pages",
    "Pricing pages",
    "Resource hubs",
    "Marketing websites",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Elevate Navbar component to your project. This adds the desktop and mobile navbar components locally so you can tune dropdown behaviour, menu animation, CTA states, mobile accordion handling, and responsive styling.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add elevate-navbar",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the navbar to your layout",
      body: "Place the navbar inside the root layout or page wrapper so it appears consistently across target pages. Use the desktop component for larger screens and the mobile component for compact devices.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import React from "react";
import ElevateNavbarDesktop from "@/components/Navbar/GlassPillNavbar/ElevateDesktopNav";
import ElevateNavbarMobile from "@/components/Navbar/GlassPillNavbar/ElevateMobileNav";

export default function Page() {
  return (
    <div className="h-screen font-mono bg-purple-300 text-[.75vw] w-full">
      <h1 className="text-[10vw] uppercase absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-black text-center text-[#363737]">
        Elevate Navbar
      </h1>

      <ElevateNavbarDesktop />
      <ElevateNavbarMobile />
    </div>
  );
}`,
        },

        {
          type: "text",
          title: "How the components work together",
          body: "ElevateNavbarDesktop handles the full desktop navigation experience with hover-driven dropdowns, animated text swaps, CTA hover states, and dropdown item reveals. ElevateNavbarMobile provides a separate touch-friendly pattern with a menu trigger, backdrop, animated panel, and accordion-style dropdown sections.",
        },
      ],
    },

    {
      title: "Step 3: Define top and scrolled states",
      body: "Set how the navbar looks at the top of the page and how it changes after scroll or interaction. This implementation uses a glass-pill style wrapper, text swap animations, dropdown cards, and a strong CTA state instead of a simple flat navigation row.",
    },

    {
      title: "Step 4: Configure scroll threshold and interaction states",
      body: "Choose when the elevated state appears. Usually this happens after users move beyond the hero area or after a small scroll distance. For this variant, you can also tune dropdown timing, backdrop behaviour, hover delays, item reveal movement, and CTA background swap timing.",
      blocks: [
        {
          type: "props",
          title: "ElevateNavbar Props",
        },
      ],
    },

    {
      title: "Step 5: Add responsive menu behaviour",
      body: "Create mobile menu behaviour using a drawer, full-screen navigation, or accordion links. In this implementation, ElevateNavbarMobile uses a compact trigger, animated panel, backdrop blur, and accordion sections for dropdown items.",
      blocks: [
        {
          type: "code",
          title: "Desktop Component Code",
          source: "component",
          filename: "elevate-navbar-desktop.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Test contrast across sections",
      body: "Make sure the navbar remains readable over different backgrounds, images, and content sections. Test desktop hover, mobile tap, dropdown visibility, focus states, contrast, and whether the menu feels stable during fast pointer movement.",
      blocks: [
        {
          type: "code",
          title: "Mobile Component Code",
          filename: "elevate-navbar-mobile.jsx",
          language: "jsx",
          code: `"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";

const MENU_ITEMS = [
  {
    name: "Effects",
    dropdown: [
      { title: "All Effects", img: "/img/dino2.png", href: "/effects" },
      { title: "Components", img: "/img/dino2.png", href: "/effects/components" },
      { title: "WebGL", img: "/img/dino2.png", href: "/effects/webgl" },
    ],
  },
  {
    name: "Tech",
    dropdown: [
      { title: "React Effects", img: "/img/dino2.png", href: "/tech/react" },
      { title: "GSAP Effects", img: "/img/dino2.png", href: "/tech/gsap" },
      { title: "Three.js Effects", img: "/img/dino2.png", href: "/tech/threejs" },
    ],
  },
  {
    name: "Extras",
    href: "#",
  },
  {
    name: "Docs",
    dropdown: [
      { title: "Introduction", img: "/img/dino2.png", href: "/docs" },
      { title: "Installation", img: "/img/dino2.png", href: "/docs/installation" },
      { title: "CLI", img: "/img/dino2.png", href: "/docs/cli" },
    ],
  },
];

const BACKDROP_DURATION = 0.2;
const PANEL_OFFSET_Y = -20;
const PANEL_OPEN_DURATION = 0.3;
const PANEL_CLOSE_DURATION = 0.2;
const ACCORDION_DURATION = 0.25;

export default function ElevateNavbarMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const panelElement = panelRef.current;
    const backdropElement = backdropRef.current;

    if (!panelElement || !backdropElement) return;

    if (isMenuOpen) {
      gsap.set(panelElement, { pointerEvents: "auto" });

      gsap.to(backdropElement, {
        autoAlpha: 1,
        duration: BACKDROP_DURATION,
      });

      gsap.fromTo(
        panelElement,
        { autoAlpha: 0, y: PANEL_OFFSET_Y },
        {
          autoAlpha: 1,
          y: 0,
          duration: PANEL_OPEN_DURATION,
          ease: "power3.out",
        }
      );

      return;
    }

    gsap.to(panelElement, {
      autoAlpha: 0,
      y: PANEL_OFFSET_Y,
      duration: PANEL_CLOSE_DURATION,
      onComplete: () => gsap.set(panelElement, { pointerEvents: "none" }),
    });

    gsap.to(backdropElement, {
      autoAlpha: 0,
      duration: BACKDROP_DURATION,
    });
  }, [isMenuOpen]);

  useEffect(() => {
    sectionsRef.current.forEach((sectionElement, index) => {
      if (!sectionElement) return;

      const isSectionOpen = activeDropdownIndex === index;

      gsap.to(sectionElement, {
        height: isSectionOpen ? sectionElement.scrollHeight : 0,
        autoAlpha: isSectionOpen ? 1 : 0,
        duration: ACCORDION_DURATION,
        ease: "power2.out",
      });
    });
  }, [activeDropdownIndex]);

  return (
    <div className="fixed top-[3vw] right-[3vw] z-999 block sm:block lg:hidden">
      <div
        ref={backdropRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-black/40 opacity-0 backdrop-blur-sm"
      />

      <div className="flex items-center justify-between gap-[2vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/90 px-[3vw] py-[2vw] backdrop-blur-xl">
        <span className="max-md:text-[2.5vw] max-sm:text-[3vw] px-[2vw] uppercase tracking-wide text-white/80">
          Hyperiux
        </span>

        <button
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="max-sm:w-[8vw] max-sm:h-[8vw] max-md:w-[6.5vw] max-md:h-[6.5vw] flex items-center justify-center rounded-[2vw] transition hover:bg-white/10"
        >
          {isMenuOpen ? (
            <X className="max-sm:w-[4.5vw] max-sm:h-[4.5vw] max-md:w-[3vw] max-md:h-[3vw]" />
          ) : (
            <Menu className="max-sm:w-[4.5vw] max-sm:h-[4.5vw] max-md:w-[3vw] max-md:h-[3vw]" />
          )}
        </button>
      </div>

      <div
        ref={panelRef}
        className="mt-[2vw] w-[92vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/95 p-[2vw] backdrop-blur-xl"
        style={{ pointerEvents: "none", opacity: 0 }}
      >
        <div className="space-y-[1vw]">
          {MENU_ITEMS.map((item, index) => {
            const hasDropdown = Boolean(item.dropdown);
            const isDropdownOpen = activeDropdownIndex === index;

            if (!hasDropdown) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-white/85 uppercase transition hover:bg-white/10 max-md:text-[2.5vw] max-sm:text-[3vw]"
                >
                  {item.name}
                </Link>
              );
            }

            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setActiveDropdownIndex((currentIndex) =>
                      currentIndex === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between rounded-[2.5vw] px-[3vw] py-[2.5vw] text-white/85 uppercase transition hover:bg-white/10 max-md:text-[2.5vw] max-sm:text-[3vw]"
                >
                  {item.name}

                  <ChevronDown
                    className={\`max-sm:w-[3.5vw] max-sm:h-[3.5vw] max-md:w-[2.4vw] max-md:h-[2.4vw] transition-transform \${
                      isDropdownOpen ? "rotate-180" : ""
                    }\`}
                  />
                </button>

                <div
                  ref={(element) => {
                    sectionsRef.current[index] = element;
                  }}
                  className="overflow-hidden pl-[2vw]"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="space-y-[2vw] pt-[1vw]">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-[3vw] rounded-[2vw] bg-white/5 p-[2vw] text-white/80 uppercase transition max-md:text-[2.3vw] max-sm:text-[2.8vw]"
                      >
                        <div className="relative h-[10vw] w-[10vw] overflow-hidden rounded-[2vw] bg-white/25">
                          <Image
                            src={dropdownItem.img}
                            alt={dropdownItem.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />

                          <div
                            className="absolute inset-0"
                            style={{
                              background: "rgba(255, 0, 0, 1)",
                              mixBlendMode: "multiply",
                              pointerEvents: "none",
                            }}
                          />
                        </div>

                        <span className="flex-1">
                          {dropdownItem.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-[3vw]">
            <button className="w-full rounded-[3vw] bg-white py-[3vw] font-semibold text-black max-md:text-[2.5vw] max-sm:text-[3vw]">
              BUILT W/ HYPERIUX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Top state",
      recommendation:
        "Use a transparent, minimal, or glass-style state when the navbar sits over a hero section.",
    },
    {
      option: "Scrolled state",
      recommendation:
        "Add background, border, blur, or shadow when readability needs to improve after scroll.",
    },
    {
      option: "Scroll threshold",
      recommendation:
        "Trigger after initial scroll or once the user moves beyond the hero area.",
    },
    {
      option: "CTA",
      recommendation:
        "Include one primary nav CTA. Too many CTAs weaken hierarchy.",
    },
    {
      option: "Mobile menu",
      recommendation:
        "Use a drawer, full-screen menu, or accordion pattern with large tap targets.",
    },
    {
      option: "Contrast",
      recommendation:
        "Test the navbar over hero images, gradients, dark sections, and light content areas.",
    },
  ],

  notes: {
    performance:
      "Elevate Navbar is lightweight when scroll and pointer handling are efficient. Avoid state updates on every scroll pixel if unnecessary, and keep dropdown animations transform-based where possible.",

    accessibility:
      "Navigation links should be semantic, keyboard accessible, and have visible focus states. Mobile menu triggers should be labelled, and dropdown content should not rely only on hover.",

    mobile:
      "Use a clear mobile navigation pattern with large tap targets. Avoid cramped nav links and avoid forcing desktop hover dropdown behaviour onto touch devices.",
  },

  commonMistakes: [
    "Poor contrast over hero backgrounds.",
    "Too much blur or shadow.",
    "Scroll state flicker.",
    "No mobile menu.",
    "Weak CTA hierarchy.",
    "Layout shift when navbar changes.",
    "Missing focus states.",
  ],

  relatedEffectNames: [
    "Expanding Navbar",
    "Directional Menu",
    "Immersive Full Screen Navigation",
    "Sticky Content Wrapper",
    "Link Button",
  ],

  faq: [
    {
      question: "What is Elevate Navbar best used for?",
      answer:
        "It is best for websites where the navbar should adapt visually as users scroll, especially SaaS, agency, portfolio, and landing pages.",
    },
    {
      question: "Can it be sticky?",
      answer:
        "Yes. It is commonly used as a sticky or fixed navbar that changes state on scroll.",
    },
    {
      question: "Is this useful for SaaS websites?",
      answer:
        "Yes. It improves readability and navigation continuity across long landing pages.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes, but it should include a dedicated mobile menu pattern.",
    },
    {
      question: "Can Hyperiux customize Elevate Navbar for a website?",
      answer:
        "Yes. Hyperiux can adapt the scroll state, glass treatment, dropdown behaviour, mobile menu, CTA hierarchy, contrast handling, and accessibility behaviour into a custom navigation system.",
    },
  ],

  finalCta: {
    body: "Use Elevate Navbar when your navigation needs to stay visible, readable, and polished as users move through the page.",
    primary: "Install Elevate Navbar",
    secondary: "View Navigation Effects",
    commercial: "Request a Custom Navbar System",
  },
},
"immersive-full-screen-navigation": {
  seo: {
    primaryKeyword: "React fullscreen navigation menu",
    secondaryKeywords: [
      "fullscreen navigation React",
      "animated fullscreen menu",
      "Next.js fullscreen menu",
      "immersive navigation menu",
      "creative navigation React",
      "overlay navigation component",
    ],
    title:
      "Immersive Full Screen Navigation for React | Animated Overlay Menu | Hyperiux Vault",
    description:
      "Add an immersive full screen navigation menu to your React or Next.js website. Preview the animated overlay navigation, install it with the Hyperiux CLI, and customize it for portfolios, agency websites, creative landing pages, and premium brand experiences.",
  },

  h1: "Immersive Full Screen Navigation for React and Next.js",

  shortDescription:
    "A full-screen animated navigation overlay for creative websites, portfolios, agencies, and immersive brand experiences.",

  heroCopy: [
    "Immersive Full Screen Navigation is designed for websites where the menu should feel like a deliberate part of the brand experience, not a small utility dropdown. A full-screen navigation overlay gives the menu space to breathe. Instead of squeezing links into a narrow header or basic mobile drawer, the menu opens into a complete visual state. This allows navigation to include large typography, featured links, page previews, service groups, social links, contact CTAs, and motion details.",

    "This component is especially useful for creative agencies, portfolios, digital studios, premium brand websites, campaign microsites, architecture portfolios, fashion websites, and immersive landing pages. It works well when navigation is not only functional but also atmospheric. The menu can feel like an intermission between page states — a place where users can decide where to go next with more visual clarity.",

    "For agency websites, full-screen navigation can help present core sections such as Work, Services, Process, Proof, Insights, About, and Contact in a more intentional way. For portfolios, it can make project categories and contact paths feel more prominent. For campaign websites, it can turn navigation into part of the campaign language. For Hyperiux Vault, a full-screen menu could highlight effect categories, featured packs, documentation, CLI, GitHub, pricing, and custom implementation in a high-impact layout.",

    "The effect works best when the menu has strong hierarchy. Large menus can become overwhelming if every link has equal weight. Use clear grouping, typography scale, spacing, and motion to guide the user. The opening animation should feel smooth and fast. If the menu takes too long to open, it becomes friction. If it uses too much motion, it becomes spectacle.",

    "Accessibility is critical. Full-screen menus must trap focus while open, support keyboard navigation, provide escape-to-close behaviour, maintain visible focus states, and restore focus after closing. The close button must be obvious. Users should never feel trapped.",

    "Use Immersive Full Screen Navigation when the menu is important enough to become a designed state. It is not necessary for every website, but for creative and premium brands, it can make navigation feel more memorable, spacious, and intentional.",
  ],

  bestUsedFor: [
    "Creative agency websites",
    "Portfolio websites",
    "Digital studios",
    "Premium brand websites",
    "Campaign microsites",
    "Architecture portfolios",
    "Fashion and lifestyle websites",
    "Experimental landing pages",
    "Menu-led storytelling",
    "Visual navigation systems",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Immersive Full Screen Navigation component to your project. This adds the overlay navigation wrapper and custom menu layout locally so you can tune clip direction, overlay colour, timings, menu content, images, and social links.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add immersive-full-screen-navigation",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Define the navigation structure",
      body: "Decide which links deserve large visual prominence and which links belong in secondary groups. Use clear primary links, a short brand line, optional preview images, social links, and location or contact information.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import React from "react";
import FullscreenNav from "@/components/Navbar/FullscreenNav";
import CustomNavbar from "@/components/Navbar/CustomNavbar";

const NAV_CONFIG = {
  brand: "Hyperiux",
  brandHref: "/",
  clipOrigin: "bottom",
  overlayBg: "#1a1a2e",
  headerOpenColor: "#ff6600",
  openDuration: 1.2,
  closeDuration: 1.2,
};

const NAV_CONTENT = {
  agencyName: "",
  tagline: "Crafting digital experiences.",
  location: "Noida, India",
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  images: [
    "/assets/img/image01.webp",
    "/assets/img/image02.webp",
  ],
  socials: [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedIn", href: "#" },
  ],
};

const Page = () => {
  return (
    <>
      <FullscreenNav {...NAV_CONFIG}>
        {(isOpen) => (
          <CustomNavbar
            {...NAV_CONTENT}
            isOpen={isOpen}
            overlayBg={NAV_CONFIG.overlayBg}
            delay={NAV_CONFIG.openDuration}
          />
        )}
      </FullscreenNav>

      <main className="h-screen bg-white flex items-center justify-center">
        <p className="text-5xl text-neutral-700">Hello !</p>
      </main>
    </>
  );
};

export default Page;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "NAV_CONFIG controls the wrapper behaviour: brand label, brand link, clip origin, overlay background, header colour, and open or close duration. NAV_CONTENT controls the full-screen menu layout: large navigation links, image previews, socials, location, tagline, and agency name. FullscreenNav manages the overlay state, while CustomNavbar receives isOpen and animates the inner content after the overlay opens.",
        },
      ],
    },

    {
      title: "Step 3: Add the menu trigger",
      body: "Use a clear menu button, hamburger icon, text label, or combined trigger. In this implementation, FullscreenNav renders the fixed header, brand link, animated hamburger button, and clipping overlay.",
    },

    {
      title: "Step 4: Design the full-screen layout",
      body: "Group links, featured pages, CTAs, social links, and contact information in a clear hierarchy. CustomNavbar creates the immersive menu state with large staggered links, preview images, social icons, a tagline, and location details.",
      blocks: [
        {
          type: "props",
          title: "FullscreenNav Props",
        },
      ],
    },

    {
      title: "Step 5: Configure opening and closing animation",
      body: "Set overlay movement, link stagger, background transition, and close animation. Keep it fast and controlled. This implementation uses clip-path polygons for the full-screen overlay and GSAP timelines for the inner menu content.",
      blocks: [
        {
          type: "code",
          title: "FullscreenNav Component Code",
          source: "component",
          filename: "fullscreen-nav.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add accessibility behaviour",
      body: "Include focus trapping, escape-to-close, keyboard navigation, and focus restoration after closing. The menu should not rely only on animation quality; it must remain usable and obvious.",
      blocks: [
        {
          type: "code",
          title: "CustomNavbar Component Code",
          filename: "custom-navbar.jsx",
          language: "jsx",
          code: `"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CharStaggerLinkBtn from "../Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";

const LINK_Y_OFFSET = 30;
const IMAGE_INITIAL_SCALE = 0.7;
const IMAGE_ANIMATION_START_SCALE = 0.8;
const SOCIAL_Y_OFFSET = 14;
const HEADER_Y_OFFSET = -12;
const LOCATION_Y_OFFSET = 10;
const DELAY_OFFSET = 0.2;
const TAGLINE_DELAY_OFFSET = 0.08;
const IMAGE_DELAY_OFFSET = 0.1;
const SOCIAL_DELAY_OFFSET = 0.2;
const LOCATION_DELAY_OFFSET = 0.25;

export default function CustomNavbar({
  links = [],
  images = ["/assets/img/image01.webp", "/assets/img/image02.webp"],
  agencyName = "Hyperiux®",
  socials = [
    { type: "instagram", href: "#" },
    { type: "facebook", href: "#" },
    { type: "twitter", href: "#" },
    { type: "linkedin", href: "#" },
  ],
  location = "Pune, India",
  tagline = "Design. Code. Impact.",
  isOpen = false,
  overlayBg = "#000000",
  delay = 1,
}) {
  const linksRef = useRef([]);
  const imagesRef = useRef([]);
  const socialsRef = useRef([]);
  const agencyRef = useRef(null);
  const taglineRef = useRef(null);
  const locationRef = useRef(null);

  const killAllTweens = () => {
    gsap.killTweensOf([
      ...linksRef.current,
      ...imagesRef.current,
      ...socialsRef.current,
      agencyRef.current,
      taglineRef.current,
      locationRef.current,
    ]);
  };

  const resetAnimatedElements = () => {
    gsap.set(linksRef.current, { y: LINK_Y_OFFSET, opacity: 0 });
    gsap.set(imagesRef.current, { scale: IMAGE_INITIAL_SCALE, opacity: 0 });
    gsap.set(socialsRef.current, { y: SOCIAL_Y_OFFSET, opacity: 0 });
    gsap.set(agencyRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(taglineRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    gsap.set(locationRef.current, { y: LOCATION_Y_OFFSET, opacity: 0 });
  };

  const setLinkRef = (index) => (element) => {
    linksRef.current[index] = element;
  };

  const setImageRef = (index) => (element) => {
    imagesRef.current[index] = element;
  };

  const setSocialRef = (index) => (element) => {
    socialsRef.current[index] = element;
  };

  useEffect(() => {
    killAllTweens();

    if (!isOpen) {
      return;
    }

    resetAnimatedElements();

    const animationDelay = Math.max(delay - DELAY_OFFSET, 0);

    gsap.fromTo(
      agencyRef.current,
      { y: HEADER_Y_OFFSET, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: animationDelay },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: HEADER_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: animationDelay + TAGLINE_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      linksRef.current,
      { y: LINK_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.07,
        delay: animationDelay,
      },
    );

    gsap.fromTo(
      imagesRef.current,
      { scale: IMAGE_ANIMATION_START_SCALE, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.02,
        delay: animationDelay + IMAGE_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      socialsRef.current,
      { y: SOCIAL_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        delay: animationDelay + SOCIAL_DELAY_OFFSET,
      },
    );

    gsap.fromTo(
      locationRef.current,
      { y: LOCATION_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: animationDelay + LOCATION_DELAY_OFFSET,
      },
    );
  }, [delay, isOpen]);

  return (
    <div
      style={{ backgroundColor: overlayBg }}
      className="w-full h-screen flex flex-col justify-between px-28 py-10 max-sm:px-6 max-sm:py-6 text-white"
    >
      <div className="flex items-center justify-between">
        <h2
          ref={agencyRef}
          style={{ opacity: 0, transform: \`translateY(\${HEADER_Y_OFFSET}px)\` }}
          className="text-xl tracking-wide font-medium"
        >
          {agencyName}
        </h2>

        <p
          ref={taglineRef}
          style={{ opacity: 0, transform: \`translateY(\${HEADER_Y_OFFSET}px)\` }}
          className="text-sm opacity-60 max-md:hidden"
        >
          {tagline}
        </p>
      </div>

      <div className="flex items-center justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-18 max-sm:gap-30">
        <div className="flex flex-col gap-0">
          {links.map((link, index) => (
            <div
              key={link.label}
              ref={setLinkRef(index)}
              style={{ opacity: 0, transform: \`translateY(\${LINK_Y_OFFSET}px)\` }}
            >
              <CharStaggerLinkBtn
                href={link.href}
                text={link.label}
                hoverColor="#ff6b00"
                className="text-[6vw] max-sm:text-[11vw] max-md:text-[7vw] z-60"
              />
            </div>
          ))}
        </div>

        <div className="flex h-full flex-col items-end justify-center gap-40 py-5 max-md:items-start max-md:gap-28 max-sm:w-full max-sm:gap-35 max-sm:py-0">
          <div className="flex items-end gap-8 max-md:gap-10 max-sm:w-full max-sm:gap-3">
            {images.slice(0, 4).map((src, index) => (
              <div
                key={index}
                ref={setImageRef(index)}
                style={{ opacity: 0, transform: \`scale(\${IMAGE_INITIAL_SCALE})\` }}
                className="relative h-[18vw] w-[25vw] overflow-hidden rounded-xl max-md:h-[25vh] max-md:w-[35vw] max-sm:h-[30vw] max-sm:w-[60vw]"
              >
                <Image
                  src={src}
                  alt={\`img-\${index}\`}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-16 max-md:gap-16 max-sm:gap-10">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                ref={setSocialRef(index)}
                style={{ opacity: 0, transform: \`translateY(\${SOCIAL_Y_OFFSET}px)\` }}
              >
                <Image
                  src={social.src ? social.src : \`/assets/social-icons/\${social.type}.svg\`}
                  alt={social.type}
                  width={24}
                  height={24}
                  className="max-sm:h-5 max-sm:w-5 w-7 h-7 opacity-70 transition hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end max-sm:items-end max-sm:justify-between">
        <p className="hidden text-sm opacity-60 max-sm:block">{tagline}</p>
        <p
          ref={locationRef}
          style={{ opacity: 0, transform: \`translateY(\${LOCATION_Y_OFFSET}px)\` }}
          className="text-sm opacity-60"
        >
          {location}
        </p>
      </div>
    </div>
  );
}`,
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Opening animation",
      recommendation:
        "Use fade, slide, clip, or reveal. Clip-path works well when the menu should feel cinematic and spatial.",
    },
    {
      option: "Link style",
      recommendation:
        "Large typography works well. Keep primary links obvious and secondary links visually quieter.",
    },
    {
      option: "Link stagger",
      recommendation:
        "Use subtle stagger. The menu should feel designed, not delayed.",
    },
    {
      option: "Featured links",
      recommendation:
        "Highlight work, services, contact, or key conversion paths with supporting visuals or CTAs.",
    },
    {
      option: "Close behaviour",
      recommendation:
        "Use an obvious close button and support escape key for keyboard users.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Full-screen works well on mobile if touch targets are large and spacing is generous.",
    },
  ],

  notes: {
    performance:
      "Full-screen navigation is usually lightweight. Avoid loading heavy media inside the menu unless necessary. Keep animations transform-based, and optimize preview images before using them inside the overlay.",

    accessibility:
      "Trap focus while open, provide labelled controls, support escape key, restore focus after close, and maintain visible focus states. The overlay should not trap users permanently or hide the close action.",

    mobile:
      "Full-screen navigation can work well on mobile if links are large, spacing is generous, and the close action is obvious. Avoid tiny links or crowded secondary content.",
  },

  commonMistakes: [
    "Treating all links equally.",
    "Opening animation too slow.",
    "Hidden close button.",
    "No focus trap.",
    "No escape key support.",
    "Overcrowding the overlay.",
    "Using tiny mobile links.",
  ],

  relatedEffectNames: [
    "Directional Menu",
    "Expanding Navbar",
    "Elevate Navbar",
    "Modal",
    "Page Transitions",
  ],

  faq: [
    {
      question: "What is Immersive Full Screen Navigation best used for?",
      answer:
        "It is best for creative websites, portfolios, agencies, campaign sites, and premium brands where navigation can become a designed visual state.",
    },
    {
      question: "Is full-screen navigation good for SaaS websites?",
      answer:
        "It can work for design-led SaaS marketing sites, but complex SaaS websites may need a more structured mega menu.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes. Full-screen navigation often works well on mobile if touch targets and close behaviour are clear.",
    },
    {
      question: "Should the menu include CTAs?",
      answer:
        "Yes. Include primary actions such as Contact, Book a Demo, View Work, or Start a Project where relevant.",
    },
    {
      question: "Can Hyperiux customize Immersive Full Screen Navigation for a website?",
      answer:
        "Yes. Hyperiux can adapt the overlay animation, clip direction, menu hierarchy, link typography, featured visuals, social links, accessibility behaviour, and responsive layout into a custom navigation system.",
    },
  ],

  finalCta: {
    body: "Use Immersive Full Screen Navigation when your menu deserves to feel spacious, branded, and part of the experience.",
    primary: "Install Immersive Full Screen Navigation",
    secondary: "View Navigation Effects",
    commercial: "Request a Custom Full Screen Menu",
  },
},
  },
  "website-loaders":{
    "numeric-tunnel": {
  seo: {
    primaryKeyword: "React numeric loader",
    secondaryKeywords: [
      "numeric tunnel animation React",
      "number loader React",
      "Next.js loading animation",
      "digital loader React",
      "creative preloader",
      "data tunnel animation",
    ],
    title:
      "Numeric Tunnel React Loader | Digital Loading Animation | Hyperiux Vault",
    description:
      "Add a numeric tunnel loader to your React or Next.js website. Preview the digital loading animation, install it with the Hyperiux CLI, and customize it for AI websites, developer tools, cybersecurity pages, portfolios, and immersive digital experiences.",
  },

  h1: "Numeric Tunnel Loader for React and Next.js",

  shortDescription:
    "A digital number-based loader that creates a tunnel-like motion effect for technical, AI, developer, and experimental websites.",

  heroCopy: [
    "The Numeric Tunnel loader is the highest-priority loader in this category because it has the strongest visual identity and the clearest fit for digital-first websites. Instead of using a generic spinner or simple progress bar, Numeric Tunnel creates a loading animation from numbers, digits, or data-like sequences moving through a tunnel-style composition. The result feels technical, cinematic, and strongly connected to computation.",

    "This loader is especially useful for AI product websites, developer tools, cybersecurity brands, data platforms, creative coding portfolios, immersive landing pages, fintech products, Web3 campaigns, and experimental interfaces. The number-based motion can suggest processing, calculation, encryption, signal, analytics, machine intelligence, or system activity. It is a loader that feels like it belongs inside a digital product story rather than a default UI kit.",

    "For AI and data brands, Numeric Tunnel can reinforce the idea that something is being processed or generated. For cybersecurity and fintech, it can suggest secure computation, verification, or encrypted activity. For developer portfolios and creative websites, it can create a strong opening moment that feels engineered and memorable. For Hyperiux Vault, it can be used as a branded loader for effect previews or digital category pages where a technical atmosphere is useful.",

    "The effect should still be used with restraint. A loader should not become a performance tax. Numeric Tunnel is visually expressive, so it works best in moments where a stronger loading state is justified: page intro, route transition, media-heavy preview, or immersive experience load. It may be too intense for small UI modules, simple form submissions, or standard dashboard loading states.",

    "The animation should be fast, smooth, and purposeful. The digits should feel like a visual system, not random noise. The tunnel movement should not be so intense that it causes discomfort. On mobile and reduced-motion settings, a simplified version or static loading state may be more appropriate.",

    "Use Numeric Tunnel when your loading state needs to feel digital, technical, and memorable. It is best for brands where computation, data, AI, or creative engineering is part of the identity.",
  ],

  bestUsedFor: [
    "AI product websites",
    "Developer tools",
    "Cybersecurity websites",
    "Data platforms",
    "Creative coding portfolios",
    "Web3 campaigns",
    "Fintech landing pages",
    "Immersive route transitions",
    "Experimental websites",
    "Digital product launch pages",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Numeric Tunnel loader to your project. This adds the React Three Fiber loader locally so you can tune the ring count, digit density, tunnel scale, loading speed, fade timing, shader distortion, and completion behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add numeric-tunnel",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the loading moment",
      body: "Use Numeric Tunnel for high-impact loading moments such as page intro, route transition, preview loading, immersive section loading, or media-heavy experience loading. Avoid using it for tiny inline loading states where a lighter loader would be more appropriate.",
    },

    {
      title: "Step 3: Add the loader",
      body: "Render NumericTunnel where you need the loading experience. The component manages its own internal loader value, increments the number from 0 to 100, animates the tunnel rings, then calls onComplete when the loading sequence finishes if a callback is provided.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `"use client";

import NumericTunnel from "@/components/Loaders/NumericTunnel";
import React from "react";

export default function Page() {
  return (
    <NumericTunnel />
  );
}`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "NumericTunnel can be used without passing data. Internally, it stores loaderValue in state and increases it until it reaches 100. NumericTunnelCanvas receives loaderValue and renders the animated tunnel inside a React Three Fiber Canvas. When loaderValue reaches 100, the component starts the shader crossfade and optionally calls onComplete.",
        },
      ],
    },

    {
      title: "Step 4: Configure numeric content",
      body: "Set whether the loader uses random digits, meaningful numbers, binary-style sequences, counters, or branded numeric patterns. In this implementation, each ring displays the current loader value padded to two digits, giving the tunnel a progress-based numeric identity.",
    },

    {
      title: "Step 5: Tune tunnel depth",
      body: "Adjust scale, perspective, spacing, speed, opacity, ring count, count per ring, ring radius, fade phases, and font size to create the tunnel effect. Keep the movement immersive but controlled so the loader feels technical without becoming visually disorienting.",
      blocks: [
        {
          type: "props",
          title: "NumericTunnel Props",
        },
      ],
    },

    {
      title: "Step 6: Add fallback states",
      body: "Provide a simplified loader for mobile, reduced-motion users, or low-performance devices. Numeric Tunnel uses canvas, shader distortion, and many text elements, so a static or reduced version is useful when the full effect is not appropriate.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "numeric-tunnel.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Digit style",
      recommendation:
        "Use monospace or technical typography for a stronger computational feel.",
    },
    {
      option: "Tunnel depth",
      recommendation:
        "Keep the tunnel immersive but not disorienting. Avoid excessive scale or perspective distortion.",
    },
    {
      option: "Speed",
      recommendation:
        "Use moderate, controlled motion. The loader should feel active without becoming frantic.",
    },
    {
      option: "Colour",
      recommendation:
        "Use a brand accent or monochrome palette. Numeric loaders work especially well on dark surfaces.",
    },
    {
      option: "Background",
      recommendation:
        "Dark backgrounds usually make the numeric tunnel feel more cinematic and technical.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Provide a simplified or static fallback for users who prefer reduced motion.",
    },
  ],

  notes: {
    performance:
      "Numeric Tunnel may involve many moving text elements, shader passes, and React Three Fiber rendering. Limit active elements, use transform-based motion, keep dpr controlled, and avoid excessive DOM or canvas recalculation.",

    accessibility:
      "Provide accessible loading status text. Do not rely on rapidly changing digits to communicate meaningful information. Respect reduced-motion preferences and ensure users are not trapped in the loader state.",

    mobile:
      "Reduce digit count, depth, shader intensity, and movement on mobile. A simplified numeric loader may work better on smaller screens and lower-powered devices.",
  },

  commonMistakes: [
    "Using too many numbers.",
    "Making motion too fast.",
    "Treating random digits as meaningful content.",
    "No accessible loading label.",
    "Using it for tiny loading states.",
    "No reduced-motion fallback.",
    "Making the tunnel visually disorienting.",
  ],

  relatedEffectNames: [
    "Text Stream",
    "Lines Loader",
    "Stack Loader",
    "Pixel Transition",
    "Dither Canvas",
  ],

  faq: [
    {
      question: "What is Numeric Tunnel best used for?",
      answer:
        "It is best for high-impact loading states on AI, developer, cybersecurity, data, fintech, and experimental websites.",
    },
    {
      question: "Is Numeric Tunnel suitable for SaaS websites?",
      answer:
        "Yes, especially for technical SaaS products, AI tools, data platforms, and developer-focused brands.",
    },
    {
      question: "Should it be used for every loading state?",
      answer:
        "No. Reserve it for major loading moments. Use lighter loaders for small UI modules.",
    },
    {
      question: "Does it support reduced motion?",
      answer:
        "It should. Provide a static or simplified loading state for users who prefer reduced motion.",
    },
    {
      question: "Can Hyperiux customize Numeric Tunnel for a website?",
      answer:
        "Yes. Hyperiux can adapt the numeric content, tunnel depth, shader treatment, timing, colour system, reduced-motion fallback, and loading completion behaviour into a custom loader system.",
    },
  ],

  finalCta: {
    body: "Use Numeric Tunnel when your loading state needs a technical, data-driven, and memorable visual identity.",
    primary: "Install Numeric Tunnel",
    secondary: "View Loaders",
    commercial: "Request a Custom Loader System",
  },
},
"stack-loader": {
  seo: {
    primaryKeyword: "React stack loader",
    secondaryKeywords: [
      "stack loader animation React",
      "animated loader React",
      "Next.js loader component",
      "loading animation React",
      "creative preloader React",
      "stacked loading animation",
    ],
    title:
      "Stack Loader React Component | Animated Loading Effect | Hyperiux Vault",
    description:
      "Add a stack loader animation to your React or Next.js website. Preview the animated loading effect, install it with the Hyperiux CLI, and customize it for route transitions, creative websites, portfolios, product pages, and immersive digital experiences.",
  },

  h1: "Stack Loader Component for React and Next.js",

  shortDescription:
    "A stacked animated loader that uses layered movement to create a more polished loading or transition state.",

  heroCopy: [
    "The Stack Loader component is designed for websites that need loading states to feel more intentional than a basic spinner. Loading moments are often overlooked, but they shape how users perceive performance. A plain spinner tells users to wait. A well-designed loader can make the wait feel shorter, more controlled, and more connected to the brand. Stack Loader uses layered motion, stacked elements, or card-like movement to create a loading animation with more visual structure.",

    "This component is especially useful for creative websites, portfolios, agency websites, route transitions, media-heavy pages, product showcases, dashboard loading states, and immersive landing pages. It can appear during page loads, section transitions, image-heavy gallery loading, component suspense states, or custom route changes. The stacked movement gives the loader a sense of rhythm and hierarchy instead of endless circular motion.",

    "For agency and portfolio websites, Stack Loader can support a more crafted first impression. Instead of showing a generic spinner before a project page loads, the site can show a branded stacked animation that feels aligned with the rest of the interface. For SaaS and product websites, Stack Loader can be used in specific UI states, such as loading cards, reports, data panels, or content modules. For Hyperiux Vault, it can serve as a loading state for effect previews, category pages, or documentation sections.",

    "The key is to keep the loader short, lightweight, and purposeful. A loader should never become an excuse for slow performance. It should help bridge unavoidable waiting moments, not hide poor optimization. If the animation runs too long or feels too decorative, users may become impatient. The loader should also not block access longer than necessary.",

    "The best implementation uses simple transform-based motion, clean timing, and brand-aligned styling. It should include fallback states and respect reduced-motion preferences. If loading takes longer than expected, consider pairing the loader with progress text, skeleton UI, or meaningful status information.",

    "Use Stack Loader when your website needs a loading animation that feels more structured and polished than a default spinner, while still staying lightweight and production-friendly.",
  ],

  bestUsedFor: [
    "Page loading states",
    "Route transitions",
    "Portfolio project loading",
    "Effect preview loading",
    "Image-heavy sections",
    "SaaS dashboard panels",
    "Product cards",
    "Creative landing pages",
    "Suspense fallback UI",
    "Media gallery loading",
  ],

  tutorial: [
    {
      title: "Step 1: Install the component",
      body: "Use the Hyperiux CLI to add the Stack Loader component to your project. This adds the stacked intro loader locally so you can tune image stacking, spread movement, text reveal, exit timing, and the final fade-out behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add stack-loader",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Choose the loading context",
      body: "Decide whether the loader appears during page load, route transition, component loading, image loading, or preview loading. This version works best as an intro loader because it takes over the screen, introduces a stacked visual sequence, then fades out to reveal the page underneath.",
    },

    {
      title: "Step 3: Add the loader component",
      body: "Place the loader inside your loading page, route transition layer, intro overlay, suspense fallback, or conditional loading state. The sample below places StackToSpreadIntro above a simple demo UI so the loader can animate first and then disappear.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import StackToSpreadIntro from "@/components/Loaders/StackToSpreadIntro";
import React from "react";

export default function Page() {
  return (
    <div id="DEMO UI" className="h-screen w-screen bg-zinc-900 relative">
      <p className="absolute text-white text-4xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        DEMO UI
      </p>

      <StackToSpreadIntro />
    </div>
  );
}`,
        },

        {
          type: "text",
          title: "How the loader works",
          body: "StackToSpreadIntro renders a full-screen overlay above the page. It animates a small stack of images into view, reveals the headline and supporting description with GSAP SplitText, stacks the images into a layered formation, spreads them vertically, then fades the loader out and sets it to display none so the page underneath becomes usable.",
        },
      ],
    },

    {
      title: "Step 4: Configure stack movement",
      body: "Set the number of layers, movement direction, speed, opacity, scale, and stagger timing. In this implementation, the image stack enters from below, layers through z-index changes, scales into a stacked formation, then spreads across the vertical axis before fading away.",
      blocks: [
        {
          type: "props",
          title: "StackToSpreadIntro Props",
        },
      ],
    },

    {
      title: "Step 5: Match the brand style",
      body: "Adjust image sources, colour, border radius, typography, spacing, and motion style so the loader feels connected to the website’s visual language. Use branded images, product visuals, portfolio previews, or abstract frames when the loader should feel more custom.",
    },

    {
      title: "Step 6: Add reduced-motion fallback",
      body: "For users who prefer reduced motion, show a static loading state, skeleton UI, or simple progress message. A full-screen loader with stacked image movement should not be forced on users who have reduced-motion preferences enabled.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "stack-loader.jsx",
          language: "jsx",
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Stack count",
      recommendation:
        "Three to five layers usually works best. More layers can feel busy unless the animation is carefully paced.",
    },
    {
      option: "Animation speed",
      recommendation:
        "Keep the sequence short and rhythmic. A loader should bridge waiting time, not create extra delay.",
    },
    {
      option: "Layer style",
      recommendation:
        "Match the images, cards, or panels to the brand system so the loader feels intentional.",
    },
    {
      option: "Colour",
      recommendation:
        "Use brand accent colours or neutral tones. Avoid colours that clash with the page revealed underneath.",
    },
    {
      option: "Loading text",
      recommendation:
        "Add loading or status text only when it helps the user understand what is happening.",
    },
    {
      option: "Reduced motion",
      recommendation:
        "Use a static, skeleton, or simplified fallback for reduced-motion users.",
    },
  ],

  notes: {
    performance:
      "Stack Loader should remain lightweight. Use transform and opacity animations. Avoid heavy blur, filters, or complex SVG paths for a simple loading state. Optimize all images used inside the stack so the loader does not create the very delay it is meant to cover.",

    accessibility:
      "If the loader indicates real loading, provide appropriate loading status text for assistive technology. Avoid infinite animation without context for long waits, and do not block users longer than necessary.",

    mobile:
      "Keep the loader compact and lightweight. Avoid full-screen loaders unless the entire page is genuinely loading. Test image size, spread distance, and text scale carefully on smaller screens.",
  },

  commonMistakes: [
    "Using loaders to hide slow performance.",
    "Making animation too long.",
    "No loading status for assistive technology.",
    "Heavy visual effects.",
    "Blocking users unnecessarily.",
    "No reduced-motion fallback.",
    "Using a full-screen loader for small content updates.",
  ],

  relatedEffectNames: [
    "Lines Loader",
    "Numeric Tunnel",
    "Block Transition",
    "Pixel Transition",
    "Animated Toggle",
  ],

  faq: [
    {
      question: "What is Stack Loader best used for?",
      answer:
        "Stack Loader is best for page transitions, route loading, card loading, media sections, and polished fallback states.",
    },
    {
      question: "Is Stack Loader better than a spinner?",
      answer:
        "It can feel more branded and polished than a generic spinner, but it should still stay lightweight and fast.",
    },
    {
      question: "Can it be used in Next.js loading states?",
      answer:
        "Yes. It can be used in route loading UI, suspense fallback states, or client-side loading conditions.",
    },
    {
      question: "Should loaders support reduced motion?",
      answer:
        "Yes. Users who prefer reduced motion should receive a static, skeleton, or simplified loading state.",
    },
    {
      question: "Can Hyperiux customize Stack Loader for a website?",
      answer:
        "Yes. Hyperiux can adapt the stack count, image sequence, text reveal, motion timing, page transition behaviour, reduced-motion fallback, and loading completion logic into a custom loading system.",
    },
  ],

  finalCta: {
    body: "Use Stack Loader when a loading state needs to feel structured, branded, and more polished than a generic spinner.",
    primary: "Install Stack Loader",
    secondary: "View Loaders",
    commercial: "Request a Custom Loading System",
  },
},
  },
  "webgl":{
    "interactive-blur-reveal": {
  seo: {
    primaryKeyword: "React interactive blur reveal",
    secondaryKeywords: [
      "blur reveal effect React",
      "WebGL blur reveal",
      "image blur reveal React",
      "Next.js interactive image reveal",
      "cursor blur effect",
      "creative image reveal",
    ],
    title:
      "Interactive Blur Reveal React Effect | Image Blur Interaction | Hyperiux Vault",
    description:
      "Add an interactive blur reveal effect to your React or Next.js website. Preview the cursor-driven image reveal, install it with the Hyperiux CLI, and customize it for portfolios, hero sections, galleries, product visuals, and creative landing pages.",
  },

  h1: "Interactive Blur Reveal Effect for React and Next.js",

  shortDescription:
    "An interactive image or visual reveal effect where blur clears, moves, or responds to user interaction.",

  heroCopy: [
    "Interactive Blur Reveal is designed for websites that want visual discovery to feel tactile and controlled. Blur is a powerful design tool because it creates mystery, depth, and focus. This effect uses blur not as a static styling choice, but as an interaction. Images, backgrounds, or visual panels can start blurred and become clear based on cursor movement, hover, scroll, or user focus. The result is a reveal that feels more exploratory than a basic fade.",

    "This effect is especially useful for portfolios, creative agencies, photography websites, product visuals, editorial pages, campaign microsites, and immersive landing pages. It can make users feel like they are uncovering the visual layer. A project image can sharpen on hover. A hero visual can clear as the cursor moves. A gallery can reveal details through interaction. A product section can move from abstract atmosphere to clarity.",

    "For agency and portfolio websites, Interactive Blur Reveal can make visual browsing feel premium and memorable. For product websites, it can be used to introduce a feature image, screenshot, or product detail with controlled emphasis. For campaign pages, it can create a sense of discovery. For Hyperiux, it demonstrates the strategic use of interaction: blur is not just decoration; it becomes a way to manage attention.",

    "The effect works best when the blurred and sharp states both have purpose. The blurred state should create anticipation, not frustration. The reveal should happen quickly enough that users understand what they are seeing. The final clear state should be stable and readable. If product screenshots remain too blurred for too long, the effect hurts comprehension.",

    "Performance depends on how blur is implemented. CSS blur can be expensive on large elements. WebGL or shader-based blur may provide smoother control but requires careful optimization. Use the effect on selected visuals rather than large areas of dense content.",

    "Use Interactive Blur Reveal when you want images or visual panels to become clearer through user attention. It is a strong effect for creative websites because it ties motion directly to focus and discovery.",
  ],

  bestUsedFor: [
    "Immersive hero sections",
    "Creative portfolios",
    "Agency websites",
    "Product launch pages",
    "Interactive galleries",
    "Technical landing pages",
    "Visual case studies",
    "Campaign microsites",
    "Experimental interfaces",
    "Premium digital experiences",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Interactive Blur Reveal effect to your project. This adds the WebGL shader-based reveal component locally so you can tune the base image, noise texture, trail behaviour, blur intensity, grain, and interaction response.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add interactive-blur-reveal",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the effect inside a client-side React or Next.js component",
      body: "Because this effect uses WebGL, pointer movement, browser APIs, and canvas rendering, place it inside a client component. The visual can sit behind semantic HTML content so the page remains readable and accessible.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import Link from "next/link";

import FrostedGlassShader from "@/components/InteractiveBlurReveal/InteractiveBlurReveal";

const Page = () => {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-black text-white">
      <FrostedGlassShader
        iChannel0="/assets/img/image02.webp"
        iChannel1="/assets/download.png"
      />

      <div className="pointer-events-none fixed inset-0 z-10 h-screen w-screen">
        <header className="flex items-start justify-between px-10 pt-7 max-sm:px-5 max-sm:pt-5">
          <div className="text-sm max-sm:text-sm font-semibold opacity-90 max-md:text-lg">
            HYPERIUX
          </div>

          <Link
            className="pointer-events-auto text-sm max-sm:text-sm max-md:text-lg font-semibold opacity-90 transition-opacity hover:opacity-100"
            href="#"
            target="_blank"
            rel="noreferrer"
          >
            VISIT HYPERIUX IMMERSION LABS
          </Link>
        </header>

        <section className="flex h-full w-full flex-col items-start justify-center px-10">
          <div className="mt-[-12%]">
            <h1 className="max-w-[60vw] text-[7vw] font-light leading-[0.9] tracking-tighter max-sm:max-w-full max-sm:text-[10vw]">
              Design that feels discovered,
              <br /> not displayed.
            </h1>

            <p className="mt-4 hidden font-medium tracking-wide text-white/70 max-md:mt-10 max-md:block max-md:w-[80%] max-md:text-[3vw] max-md:leading-[1.3] max-sm:mt-6 max-sm:w-full max-sm:text-[3.5vw]">
              Tap here to experience the effect. For the full frosted-glass
              experience, open on desktop.
            </p>
          </div>

          <p className="text-shadow-lg absolute right-10 bottom-10 max-w-[39vw] text-[1.25vw] leading-[1.45] opacity-70 max-md:max-w-[50vw] max-md:text-[2.5vw] max-sm:bottom-7 max-sm:left-5 max-sm:max-w-[70vw] max-sm:text-[3vw]">
            We build digital spaces with texture, motion, and atmosphere -
            where every scroll, hover, and transition feels less like an
            interface and more like stepping through glass into another world.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Page;`,
        },

        {
          type: "text",
          title: "How the data is passed",
          body: "The iChannel0 prop receives the main image that will be blurred and revealed. The iChannel1 prop receives the noise texture used for distortion, grain, and organic mask variation. The component renders a fixed WebGL canvas behind the page copy, while the foreground heading, link, and paragraph remain normal semantic HTML.",
        },
      ],
    },

    {
      title: "Step 3: Prepare optimized assets, textures, images, or data needed for the visual",
      body: "Use an optimized base image and a lightweight repeating noise texture. The base image should have enough detail to make the clear reveal meaningful, while the noise texture should support frosted distortion, grain, and fluid trail edges without creating visual clutter.",
    },

    {
      title: "Step 4: Configure motion, depth, intensity, interaction, and visual style",
      body: "Tune the blur radius, trail lifetime, pointer smoothing, trail density, grain intensity, distortion strength, and reveal softness. This implementation uses a cursor trail stored as points, then passes those points into a WebGL fragment shader to reveal the clear image along the trail.",
      blocks: [
        {
          type: "props",
          title: "FrostedGlassShader Props",
        },
      ],
    },

    {
      title: "Step 5: Test foreground readability, interaction behaviour, and browser support",
      body: "Make sure foreground copy and links remain readable over both blurred and revealed image states. Test pointer movement, canvas sizing, WebGL2 support, texture loading, mobile behaviour, and how the effect feels on lower-powered machines.",
      blocks: [
        {
          type: "code",
          title: "Component Code",
          source: "component",
          filename: "interactive-blur-reveal.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add mobile, low-performance, and reduced-motion fallbacks",
      body: "Advanced WebGL effects should include fallback states. On mobile or reduced-motion settings, use a static image, a lightly blurred background, a tap-based reveal, or a simplified CSS version so the experience remains stable and accessible.",
    },
  ],

  customizationOptions: [
    {
      option: "Intensity",
      recommendation:
        "Keep the blur and reveal strong enough to notice but controlled enough that the visual does not overpower the page.",
    },
    {
      option: "Interaction",
      recommendation:
        "Use mouse, hover, scroll, or time-based movement depending on the section. Cursor trails work best for immersive hero moments.",
    },
    {
      option: "Assets",
      recommendation:
        "Use optimized textures and consistent visual direction. The reveal is only as strong as the image behind it.",
    },
    {
      option: "Performance",
      recommendation:
        "Cap DPR, control trail count, optimize textures, and avoid unnecessary render loops where possible.",
    },
    {
      option: "Foreground content",
      recommendation:
        "Keep copy and CTAs in semantic HTML above the canvas so the page remains readable and accessible.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Simplify the effect or use a static fallback on smaller and lower-powered devices.",
    },
  ],

  notes: {
    performance:
      "Optimize textures, geometry, shader complexity, animation loops, and device pixel ratio. WebGL effects should be profiled on real devices, not only high-end development machines.",

    accessibility:
      "Keep meaningful content outside the canvas in semantic HTML. Respect reduced-motion preferences and avoid making motion essential to comprehension.",

    mobile:
      "Use simplified rendering, lower asset sizes, reduced motion, or static fallback on smaller and lower-powered devices.",
  },

  commonMistakes: [
    "No fallback state.",
    "Overpowering foreground copy.",
    "Using oversized assets.",
    "Running animations offscreen.",
    "Too much motion.",
    "Weak brand relevance.",
    "Ignoring mobile performance.",
  ],

  relatedEffectNames: [
    "Fractal Glass",
    "Progressive Bloom Valley",
    "Hero Banner Animated",
    "Curved Plane V2",
    "Interactive Blur Reveal",
  ],

  faq: [
    {
      question: "What is this effect best used for?",
      answer:
        "It is best for premium visual sections where motion, depth, or interaction can strengthen the page experience.",
    },
    {
      question: "Does it require WebGL?",
      answer:
        "This implementation uses WebGL2 and custom shaders. Other versions can use CSS, canvas, Three.js, React Three Fiber, or shader-based rendering depending on the visual requirement.",
    },
    {
      question: "Is it suitable for SaaS websites?",
      answer:
        "Yes, when the visual supports the product story and does not reduce clarity or conversion focus.",
    },
    {
      question: "Should it have a fallback?",
      answer:
        "Yes. Advanced visual effects should include mobile, reduced-motion, and low-performance fallbacks.",
    },
    {
      question: "Can Hyperiux customize Interactive Blur Reveal for a website?",
      answer:
        "Yes. Hyperiux can adapt the blur intensity, shader treatment, trail behaviour, image assets, noise texture, foreground layout, fallback states, and performance profile into a custom WebGL experience.",
    },
  ],

  finalCta: {
    body: "Use Interactive Blur Reveal when your visual layer should feel discovered through movement, attention, and tactile interaction.",
    primary: "Install Interactive Blur Reveal",
    secondary: "View WebGL Effects",
    commercial: "Request a Custom Interactive Blur Reveal",
  },
},
"mouse-pixelation": {
  seo: {
    primaryKeyword: "React mouse pixelation effect",
    secondaryKeywords: [
      "mouse pixelation React",
      "cursor pixelation effect",
      "image pixelation React",
      "WebGL pixelation effect",
      "Next.js pixelation animation",
      "interactive pixel effect",
    ],
    title:
      "Mouse Pixelation React Effect | Interactive Pixel Shader Animation | Hyperiux Vault",
    description:
      "Add a mouse pixelation effect to your React or Next.js website. Preview the interactive pixel shader animation, install it with the Hyperiux CLI, and customize it for portfolios, image galleries, AI pages, gaming websites, and experimental interfaces.",
  },

  h1: "Mouse Pixelation Effect for React and Next.js",

  shortDescription:
    "An interactive pixelation effect where cursor movement pixelates, reveals, or distorts image surfaces.",

  heroCopy: [
    "Mouse Pixelation is designed for websites that want cursor movement to visibly change the surface of an image or visual area. Pixelation is a strong digital visual language. It can suggest data, computation, glitch, privacy, transformation, rendering, or retro digital culture. By tying pixelation to mouse movement, the effect becomes interactive rather than purely decorative. Users move the cursor, and the image responds.",

    "This effect is especially useful for creative portfolios, developer websites, gaming pages, AI product launches, cybersecurity websites, digital art projects, interactive galleries, campaign pages, and experimental landing pages. It can make image sections feel more alive and technical. A project image can pixelate under the cursor. A visual hero can reveal clarity through interaction. A gallery can feel like a digital surface being manipulated.",

    "For AI and developer brands, Mouse Pixelation can support a sense of computation or generative processing. For cybersecurity or privacy products, it can suggest concealment, encryption, or redaction if used carefully. For portfolios, it creates a memorable interaction around project imagery. For gaming and digital culture sites, it fits naturally with pixel-based visual language.",

    "The effect works best when the pixelation has clear behaviour. The cursor should create a visible but controlled area of change. The image should remain recognizable. If pixelation is too strong, users may lose the content. If it is too subtle, the effect may be missed. Pixel size, reveal radius, speed, and blending all need careful tuning.",

    "Performance can vary depending on whether the effect uses canvas, shader processing, image manipulation, or CSS approximation. Real-time pixelation should be optimized and limited to selected images or sections. Do not apply it to every image on a page unless there is a strong reason and performance budget.",

    "Use Mouse Pixelation when the website needs a digital interaction detail that feels technical, responsive, and visually memorable. It is a strong effect for WebGL and shader-oriented categories because it connects user input directly to visual transformation.",
  ],

  bestUsedFor: [
    "Immersive hero sections",
    "Creative portfolios",
    "Agency websites",
    "Product launch pages",
    "Interactive galleries",
    "Technical landing pages",
    "Visual case studies",
    "Campaign microsites",
    "Experimental interfaces",
    "Premium digital experiences",
  ],

  tutorial: [
    {
      title: "Step 1: Install the effect",
      body: "Use the Hyperiux CLI to add the Mouse Pixelation effect to your project. This adds the shader-based pixel interaction locally so you can tune pixel density, cursor radius, displacement, image source, bloom, velocity response, and mobile fallback behaviour.",
      blocks: [
        {
          type: "code",
          title: "Installation",
          code: "npx hyperiux add mouse-pixelation",
          language: "bash",
        },
      ],
    },

    {
      title: "Step 2: Add the effect inside a client-side React or Next.js component",
      body: "Because this effect uses React Three Fiber, shaders, pointer movement, and browser APIs, render it inside a client component. You can use the default Pixelation component directly or expose multiple versions through a versioned layout.",
      blocks: [
        {
          type: "code",
          title: "Usage",
          filename: "page.jsx",
          language: "jsx",
          code: `import Pixelation from "@/components/MousePixelationEffects/PixelCircle";
import React from "react";

const Page = () => {
  return (
    <Pixelation />
  );
};

export default Page;`,
        },

        {
          type: "code",
          title: "Versioned Layout",
          filename: "layout.jsx",
          language: "jsx",
          code: `import { VersionNav } from "./version-nav";

export default function MousePixelationLayout({ children }) {
  return (
    <>
      <VersionNav />
      {children}
    </>
  );
}`,
        },

        {
          type: "code",
          title: "Version Navigation",
          filename: "version-nav.jsx",
          language: "jsx",
          code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VERSIONS = [
  { label: "V1", href: "/mouse-pixelation-effects" },
  { label: "V2", href: "/mouse-pixelation-effects/v2" },
  { label: "V3", href: "/mouse-pixelation-effects/v3" },
];

export function VersionNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 max-sm:top-5 max-md:top-8 left-1/2 -translate-x-1/2 z-9999 flex gap-1 rounded-full px-1.5 py-1.5 max-sm:px-2 max-sm:py-1.5 max-md:px-3 max-md:py-2 bg-white/10 backdrop-blur-md border border-white/20">
      {VERSIONS.map((version) => {
        const isActive = pathname === version.href;

        return (
          <Link
            key={version.href}
            href={version.href}
            className={\`px-5 py-1.5 rounded-full text-sm max-sm:text-sm max-md:text-2xl font-semibold tracking-widest transition-all duration-200 \${
              isActive
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }\`}
          >
            {version.label}
          </Link>
        );
      })}
    </nav>
  );
}`,
        },

        {
          type: "text",
          title: "How the versions are structured",
          body: "The base route renders V1, while /v2 and /v3 can render alternate shader variants. VersionNav reads the current pathname and highlights the active version. This is useful when one effect has several visual treatments, such as pixel circles, image pixel drift, and pixel grid cube deformation.",
        },
      ],
    },

    {
      title: "Step 3: Prepare optimized assets, textures, images, or data needed for the visual",
      body: "For image-based pixelation variants, use optimized image assets with enough contrast and detail. For canvas or shader-only variants, tune the colour system, pixel density, displacement, and foreground copy so the visual remains intentional instead of noisy.",
    },

    {
      title: "Step 4: Configure motion, depth, intensity, interaction, and visual style",
      body: "Tune the cursor response, pixel size, reveal radius, displacement amount, colour boost, vignette, bloom, cube deformation, and velocity response. V1 uses shader-driven pixel circles. V2 uses an image surface with velocity-based pixel drift. V3 uses a pixel grid with bloom and a deforming cube.",
      blocks: [
        {
          type: "props",
          title: "Mouse Pixelation Props",
        },
      ],
    },

    {
      title: "Step 5: Test foreground readability, interaction behaviour, and browser support",
      body: "Test the effect on real devices, not only a development machine. Check WebGL support, pointer behaviour, mobile messaging, shader performance, foreground text readability, and whether the interaction still feels controlled when users move the cursor quickly.",
      blocks: [
        {
          type: "code",
          title: "V1 Component Code",
          source: "component",
          filename: "mouse-pixelation-v1.jsx",
          language: "jsx",
        },
      ],
    },

    {
      title: "Step 6: Add mobile, low-performance, and reduced-motion fallbacks",
      body: "Mouse-driven shader effects are strongest on desktop. On mobile, use a static fallback, tap-based variant, reduced pixel density, or a simplified canvas. Keep important content outside the canvas in semantic HTML so the experience remains accessible.",
      blocks: [
        {
          type: "code",
          title: "V2 Component Code",
          filename: "mouse-pixelation-v2.jsx",
          language: "jsx",
          code: `"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_IMAGE = "/assets/img/image06.png";
const IMAGE_ASPECT_RATIO = 1920 / 1080;
const TABLET_MAX_WIDTH = 768;
const MOBILE_MAX_WIDTH = 640;
const MOUSE_LERP = 0.15;
const VELOCITY_TARGET_SCALE = 35;
const VELOCITY_SMOOTH_LERP = 0.06;
const VELOCITY_CURRENT_LERP = 0.15;
const VELOCITY_DECAY = 0.96;
const MOVEMENT_TIMEOUT_MS = 300;
const MOVEMENT_STATE_LERP = 0.05;
const INITIAL_MOUSE = 0.5;
const INITIAL_VELOCITY_Y = 0.5;
const INITIAL_TIME = 2;
const BLOCK_SIZE = 1 / 35;
const EFFECT_RADIUS = 0.3;
const EFFECT_INTENSITY = 1.8;

const ZANJO_VERT = \`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
\`;

const ZANJO_FRAG = \`
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uBlockSize;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uIsMoving;
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    vec2 blockCoord = floor(uv / uBlockSize) * uBlockSize + (uBlockSize * 0.5);
    blockCoord += sin(uTime * 0.3) * 0.002 + cos(uTime * 0.4) * 0.001;

    float dist = distance(blockCoord, uMouse);
    float smoothDist = smoothstep(uRadius * 1.2, 0.0, dist);

    float influence = smoothDist * (1.0 - dist / (uRadius * 1.2));
    influence *= 1.0 + sin(uTime * 1.5) * 0.15 + cos(uTime * 2.3) * 0.05;
    influence *= smoothstep(0.0, 1.0, uIsMoving);

    vec2 vel = uVelocity;
    float smoothSignX = vel.x / (abs(vel.x) + 0.08);
    float smoothSignY = vel.y / (abs(vel.y) + 0.08);
    float blend = smoothstep(-0.05, 0.15, abs(vel.x) - abs(vel.y));

    vec2 dir = mix(
      vec2(0.0, smoothSignY),
      vec2(smoothSignX, 0.0),
      blend
    );

    vec2 displacement = dir * influence * uBlockSize * uIntensity;
    displacement *= 1.0 + sin(uTime * 0.8) * 0.2 + cos(uTime * 1.2) * 0.1;

    vec2 displacedUV = uv - displacement;
    displacedUV += sin(displacedUV.x * 8.0 + uTime) * 0.002
      + cos(displacedUV.y * 6.0 + uTime * 0.8) * 0.001;

    vec4 color = texture2D(uTexture, displacedUV);
    color.rgb *= 1.0 + influence * 0.1;

    gl_FragColor = color;
  }
\`;

function PlaneWithShader({ texture }) {
  const shaderMaterialRef = useRef(null);
  const moveTimeoutRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const isMovingRef = useRef(1);
  const lastMouseRef = useRef(new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE));
  const targetMouseRef = useRef(new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE));
  const targetVelocityRef = useRef(new THREE.Vector2(0, 0));
  const smoothedVelocityRef = useRef(new THREE.Vector2(0, 0));
  const { size, viewport } = useThree();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE) },
          uVelocity: { value: new THREE.Vector2(0, INITIAL_VELOCITY_Y) },
          uBlockSize: { value: BLOCK_SIZE },
          uRadius: { value: EFFECT_RADIUS },
          uIntensity: { value: EFFECT_INTENSITY },
          uTime: { value: INITIAL_TIME },
          uIsMoving: { value: 1 },
          uTexture: { value: texture },
        },
        vertexShader: ZANJO_VERT,
        fragmentShader: ZANJO_FRAG,
        transparent: false,
      }),
    [texture]
  );

  useEffect(() => {
    shaderMaterialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  useEffect(() => {
    const onMouseMove = (event) => {
      const nextMouse = new THREE.Vector2(
        event.clientX / size.width,
        1 - event.clientY / size.height
      );

      const nextVelocity = nextMouse
        .clone()
        .sub(lastMouseRef.current)
        .multiplyScalar(VELOCITY_TARGET_SCALE);

      targetMouseRef.current.copy(nextMouse);
      targetVelocityRef.current.copy(nextVelocity);
      lastMouseRef.current.copy(nextMouse);
      isMovingRef.current = 1;

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }

      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = 0;
      }, MOVEMENT_TIMEOUT_MS);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [size.height, size.width]);

  useFrame(() => {
    const shader = shaderMaterialRef.current;

    if (!shader) return;

    shader.uniforms.uTime.value = clockRef.current.getElapsedTime();
    shader.uniforms.uMouse.value.lerp(targetMouseRef.current, MOUSE_LERP);

    smoothedVelocityRef.current.lerp(
      targetVelocityRef.current,
      VELOCITY_SMOOTH_LERP
    );

    shader.uniforms.uVelocity.value.lerp(
      smoothedVelocityRef.current,
      VELOCITY_CURRENT_LERP
    );

    targetVelocityRef.current.multiplyScalar(VELOCITY_DECAY);

    shader.uniforms.uIsMoving.value = THREE.MathUtils.lerp(
      shader.uniforms.uIsMoving.value,
      isMovingRef.current,
      MOVEMENT_STATE_LERP
    );
  });

  const viewportAspectRatio = viewport.width / viewport.height;
  const isTabletViewport =
    size.width <= TABLET_MAX_WIDTH && size.width > MOBILE_MAX_WIDTH;

  let planeWidth;
  let planeHeight;

  if (isTabletViewport || IMAGE_ASPECT_RATIO > viewportAspectRatio) {
    planeWidth = viewport.width;
    planeHeight = viewport.width / IMAGE_ASPECT_RATIO;
  } else {
    planeHeight = viewport.height;
    planeWidth = viewport.height * IMAGE_ASPECT_RATIO;
  }

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

function Scene({ img }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(img), [img]);

  return <PlaneWithShader texture={texture} />;
}

export default function Zanjo({ img = DEFAULT_IMAGE }) {
  return (
    <div className="relative h-screen w-full">
      <div className="pointer-events-none absolute left-1/2 top-40 z-10 hidden w-full -translate-x-1/2 px-5 max-md:flex max-md:justify-center max-sm:left-0 max-sm:block max-sm:translate-x-0 max-sm:pt-5">
        <p className="inline-flex max-w-[92vw] rounded-sm border border-white/15 bg-black/40 px-4 py-2 font-medium text-white/75 backdrop-blur max-md:w-[80%] max-md:text-center max-md:text-[2.8vw] max-sm:w-full max-sm:text-[3.5vw]">
          Heads up: the pixel-drift responds to cursor velocity - desktop is the
          sweet spot.
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <Scene img={img} />
      </Canvas>
    </div>
  );
}`,
        },

        {
          type: "code",
          title: "V3 Component Code",
          filename: "mouse-pixelation-v3.jsx",
          language: "jsx",
          code: `"use client";

import { useEffect, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

const INITIAL_POINTER = 0.5;
const MOVEMENT_THRESHOLD = 0.001;
const POINTER_LERP = 0.1;
const VELOCITY_BLEND_CURRENT = 0.8;
const VELOCITY_BLEND_NEXT = 0.2;
const ACTIVE_HOVER_LERP = 0.06;
const IDLE_HOVER_LERP = 0.008;
const TRAIL_STRENGTH_LERP = 0.1;
const TRAIL_STRENGTH_SCALE = 50;
const TRAIL_STRENGTH_BASE = 0.3;
const MOVE_IDLE_MS = 500;
const COLOR_INTERVAL_MIN_MS = 1200;
const COLOR_INTERVAL_RANGE_MS = 5000;
const COLOR_LERP = 0.1;
const ROTATION_LERP = 0.12;
const MAX_DIST = 2;
const TIME_SCALE = 0.003;
const WAVE_FREQUENCY = 8;
const WAVE_SPEED = 3;
const WAVE_STRENGTH = 0.15;
const VELOCITY_INFLUENCE_SCALE = 100;
const DEFORMATION_SCALE = 0.3;
const PLANE_ARGS = [18, 12, 200, 200];
const CUBE_ARGS = [1, 1, 1, 20, 20, 20];
const BLOOM_INTENSITY = 1;
const BLOOM_THRESHOLD = 1.5;
const BLOOM_SMOOTHING = 0.5;

const COLOR_OPTIONS = [
  {
    color: new THREE.Color("#39FF14"),
    emissive: new THREE.Color("#39FF14"),
  },
  {
    color: new THREE.Color("aqua"),
    emissive: new THREE.Color("aqua"),
  },
  {
    color: new THREE.Color("#FFD600"),
    emissive: new THREE.Color("#FFD600"),
  },
];

const PIXEL_TRAIL_VERT = \`
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uBasePixels;
  uniform vec2 uMouseVelocity;
  uniform float uTrailStrength;

  float noise2D(vec2 p) {
    vec2 ip = floor(p);
    vec2 f = fract(p);
    f = f * (3.0 - 2.0 * f);
    float n00 = sin(dot(ip, vec2(12.9898, 78.233)));
    float n10 = sin(dot(ip + vec2(1.0, 0.0), vec2(12.9898, 78.233)));
    float n01 = sin(dot(ip + vec2(0.0, 1.0), vec2(12.9898, 78.233)));
    float n11 = sin(dot(ip + vec2(1.0, 1.0), vec2(12.9898, 78.233)));
    float nx0 = mix(n00, n10, f.x);
    float nx1 = mix(n01, n11, f.x);
    return mix(nx0, nx1, f.y) * 0.5 + 0.5;
  }

  float easeInOutCubic(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  float trailDistance(vec2 point, vec2 mousePos, vec2 velocity) {
    vec2 toPoint = point - mousePos;
    float velocityMag = length(velocity);

    if (velocityMag < 0.001) {
      return length(toPoint);
    }

    vec2 velocityDir = normalize(velocity);
    float alongTrail = dot(toPoint, velocityDir);
    float perpDist = length(toPoint - velocityDir * alongTrail);
    float trailLength = velocityMag * 15.0;

    if (alongTrail > 0.0 && alongTrail < trailLength) {
      return perpDist;
    }

    if (alongTrail <= 0.0) {
      return length(toPoint);
    }

    return length(toPoint - velocityDir * trailLength);
  }

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
    float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
    float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
    float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
    float noiseValue = noise2D(pixelUV * 8.0 + uTime * 0.3);
    float maxExtrusion = 0.8;
    float extrusion = hoverEffect * (0.6 + noiseValue * 0.4) * maxExtrusion;
    float animationDelay = dist * 2.0;
    float animatedHover = max(0.0, uHover - animationDelay * 0.1);

    hoverEffect = easeInOutCubic(hoverEffect);
    animatedHover = clamp(animatedHover * 1.5, 0.0, 1.0);
    extrusion *= easeInOutCubic(animatedHover);

    pos.z += extrusion;
    pos.x += sin(pixelUV.x * 40.0) * hoverEffect * 0.008;
    pos.y += cos(pixelUV.y * 40.0) * hoverEffect * 0.008;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
\`;

const PIXEL_TRAIL_FRAG = \`
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uBasePixels;
  uniform vec2 uMouseVelocity;
  uniform float uTrailStrength;

  varying vec2 vUv;
  varying vec3 vPosition;

  float trailDistance(vec2 point, vec2 mousePos, vec2 velocity) {
    vec2 toPoint = point - mousePos;
    float velocityMag = length(velocity);

    if (velocityMag < 0.001) {
      return length(toPoint);
    }

    vec2 velocityDir = normalize(velocity);
    float alongTrail = dot(toPoint, velocityDir);
    float perpDist = length(toPoint - velocityDir * alongTrail);
    float trailLength = velocityMag * 15.0;

    if (alongTrail > 0.0 && alongTrail < trailLength) {
      return perpDist;
    }

    if (alongTrail <= 0.0) {
      return length(toPoint);
    }

    return length(toPoint - velocityDir * trailLength);
  }

  float easeInOutCubic(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    vec2 uv = vUv;
    vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
    float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
    float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
    float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
    float depthShading = 1.0 + vPosition.z * 0.3;
    vec3 topColor = vec3(0.0, 0.0, 0.0);
    vec3 sideColor = vec3(0.01, 0.01, 0.01);
    float topFaceFactor = smoothstep(0.7, 1.0, normalize(vPosition).z);
    vec3 cubeColor = mix(sideColor, topColor, topFaceFactor);
    float light = 0.5 + 0.5 * dot(
      normalize(vec3(0.3, 0.5, 1.0)),
      normalize(vPosition + vec3(0.0, 0.0, 1.0))
    );
    vec2 pixelCenter = (floor(uv * uBasePixels) + 0.5) / uBasePixels;
    vec2 pixelOffset = abs(uv - pixelCenter) * uBasePixels;
    float border = step(0.45, max(pixelOffset.x, pixelOffset.y));
    float vig = 1.0 - smoothstep(0.3, 3.2, length(uv - 0.5) * 2.0);

    hoverEffect = easeInOutCubic(hoverEffect);
    cubeColor *= light;
    cubeColor = mix(cubeColor, vec3(0.0), border * 0.9);
    cubeColor *= mix(1.0, vig, 0.6);

    gl_FragColor = vec4(cubeColor * depthShading, 1.0);
  }
\`;

const CUBE_DEFORM_VERT = \`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
\`;

const CUBE_DEFORM_FRAG = \`
  uniform vec3 uColor;
  uniform vec3 uEmissive;
  uniform float uEmissiveIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 litColor = uColor * (0.3 + 0.7 * diff);
    vec3 finalColor = litColor + (uEmissive * uEmissiveIntensity * 0.9);

    gl_FragColor = vec4(finalColor, 1.0);
  }
\`;

class PixelTrailMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(INITIAL_POINTER, INITIAL_POINTER) },
        uHover: { value: 0.0 },
        uBasePixels: { value: 35.0 },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uTrailStrength: { value: 0.0 },
      },
      vertexShader: PIXEL_TRAIL_VERT,
      fragmentShader: PIXEL_TRAIL_FRAG,
    });
  }
}

class CubeDeformMaterial extends THREE.ShaderMaterial {
  constructor(color, emissive) {
    super({
      uniforms: {
        uColor: { value: color },
        uEmissive: { value: emissive },
        uEmissiveIntensity: { value: 2.4 },
      },
      vertexShader: CUBE_DEFORM_VERT,
      fragmentShader: CUBE_DEFORM_FRAG,
    });
  }
}

extend({ PixelTrailMaterial, CubeDeformMaterial });

function PixelGrid({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const materialRef = useRef(null);
  const pointerTargetRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const pointerCurrentRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const lastPointerRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);

  const onPointerMove = (event) => {
    const [u, v] = event.uv;
    const currentTime = Date.now();
    const deltaX = Math.abs(u - lastPointerRef.current.x);
    const deltaY = Math.abs(v - lastPointerRef.current.y);
    const hasMoved =
      deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD;

    if (hasMoved) {
      pointerTargetRef.current.x = u;
      pointerTargetRef.current.y = v;
      lastPointerRef.current.x = u;
      lastPointerRef.current.y = v;
      lastMoveTimeRef.current = currentTime;
      isMovingRef.current = true;
    }

    mousePositionRef.current.x = u;
    mousePositionRef.current.y = v;
  };

  useFrame((state) => {
    const material = materialRef.current;

    if (!material) return;

    const time = state.clock.getElapsedTime();
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - lastMoveTimeRef.current;

    material.uniforms.uTime.value = time;

    if (timeSinceLastMove > MOVE_IDLE_MS) {
      isMovingRef.current = false;
    }

    const previousX = pointerCurrentRef.current.x;
    const previousY = pointerCurrentRef.current.y;

    pointerCurrentRef.current.x +=
      (pointerTargetRef.current.x - pointerCurrentRef.current.x) * POINTER_LERP;
    pointerCurrentRef.current.y +=
      (pointerTargetRef.current.y - pointerCurrentRef.current.y) * POINTER_LERP;

    const velocityX = pointerCurrentRef.current.x - previousX;
    const velocityY = pointerCurrentRef.current.y - previousY;

    mouseVelocityRef.current.x =
      mouseVelocityRef.current.x * VELOCITY_BLEND_CURRENT +
      velocityX * VELOCITY_BLEND_NEXT;

    mouseVelocityRef.current.y =
      mouseVelocityRef.current.y * VELOCITY_BLEND_CURRENT +
      velocityY * VELOCITY_BLEND_NEXT;

    material.uniforms.uMouse.value.set(
      pointerCurrentRef.current.x,
      pointerCurrentRef.current.y
    );

    material.uniforms.uMouseVelocity.value.set(
      mouseVelocityRef.current.x,
      mouseVelocityRef.current.y
    );

    const hoverValue = material.uniforms.uHover.value;
    const nextHover = isMovingRef.current ? 1 : 0;
    const hoverLerp = isMovingRef.current ? ACTIVE_HOVER_LERP : IDLE_HOVER_LERP;

    material.uniforms.uHover.value += (nextHover - hoverValue) * hoverLerp;

    const velocityMagnitude = Math.sqrt(
      velocityX * velocityX + velocityY * velocityY
    );

    const nextTrail = Math.min(
      1,
      velocityMagnitude * TRAIL_STRENGTH_SCALE + TRAIL_STRENGTH_BASE
    );

    trailStrengthRef.current +=
      (nextTrail - trailStrengthRef.current) * TRAIL_STRENGTH_LERP;

    material.uniforms.uTrailStrength.value = trailStrengthRef.current;

    mousePositionRef.current.x = pointerCurrentRef.current.x;
    mousePositionRef.current.y = pointerCurrentRef.current.y;
  });

  return (
    <mesh onPointerMove={onPointerMove}>
      <planeGeometry args={PLANE_ARGS} />
      <pixelTrailMaterial ref={materialRef} />
    </mesh>
  );
}

function DeformingCube({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const cubeRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const originalPositionsRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const colorStateRef = useRef({
    current: COLOR_OPTIONS[0].color.clone(),
    target: COLOR_OPTIONS[0].color.clone(),
    currentEmissive: COLOR_OPTIONS[0].emissive.clone(),
    targetEmissive: COLOR_OPTIONS[0].emissive.clone(),
    lastSwitch: 0,
    interval: 0,
  });

  const { camera } = useThree();

  useEffect(() => {
    if (colorStateRef.current.lastSwitch === 0) {
      colorStateRef.current.lastSwitch = Date.now();
    }

    if (colorStateRef.current.interval === 0) {
      colorStateRef.current.interval =
        COLOR_INTERVAL_MIN_MS + Math.random() * COLOR_INTERVAL_RANGE_MS;
    }
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;

    geometryRef.current = cubeRef.current.geometry;
    originalPositionsRef.current =
      cubeRef.current.geometry.attributes.position.array.slice();
  }, []);

  useFrame(() => {
    if (!cubeRef.current || !geometryRef.current || !originalPositionsRef.current) {
      return;
    }

    const now = Date.now();

    if (now - colorStateRef.current.lastSwitch > colorStateRef.current.interval) {
      let nextIndex = Math.floor(Math.random() * COLOR_OPTIONS.length);
      const currentIndex = COLOR_OPTIONS.findIndex((option) =>
        option.emissive.equals(colorStateRef.current.targetEmissive)
      );

      if (nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % COLOR_OPTIONS.length;
      }

      colorStateRef.current.target.copy(COLOR_OPTIONS[nextIndex].color);
      colorStateRef.current.targetEmissive.copy(
        COLOR_OPTIONS[nextIndex].emissive
      );
      colorStateRef.current.lastSwitch = now;
      colorStateRef.current.interval =
        COLOR_INTERVAL_MIN_MS + Math.random() * COLOR_INTERVAL_RANGE_MS;
    }

    colorStateRef.current.current.lerp(
      colorStateRef.current.target,
      COLOR_LERP
    );

    colorStateRef.current.currentEmissive.lerp(
      colorStateRef.current.targetEmissive,
      COLOR_LERP
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.copy(
        colorStateRef.current.current
      );

      materialRef.current.uniforms.uEmissive.value.copy(
        colorStateRef.current.currentEmissive
      );
    }

    const mouseX = mousePositionRef.current.x;
    const mouseY = mousePositionRef.current.y;

    targetRotationRef.current.x = ((mouseY - 0.5) * Math.PI) / 2;
    targetRotationRef.current.y = ((mouseX - 0.5) * Math.PI) / 1.5;

    currentRotationRef.current.x +=
      (targetRotationRef.current.x - currentRotationRef.current.x) *
      ROTATION_LERP;

    currentRotationRef.current.y +=
      (targetRotationRef.current.y - currentRotationRef.current.y) *
      ROTATION_LERP;

    cubeRef.current.rotation.x = currentRotationRef.current.x;
    cubeRef.current.rotation.y = currentRotationRef.current.y;

    const cubeWorldPosition = new THREE.Vector3();
    cubeRef.current.getWorldPosition(cubeWorldPosition);
    cubeWorldPosition.project(camera);

    const cubeScreenX = (cubeWorldPosition.x + 1) / 2;
    const cubeScreenY = (cubeWorldPosition.y + 1) / 2;

    const distToCube = Math.sqrt(
      Math.pow(mousePositionRef.current.x - cubeScreenX, 2) +
        Math.pow(mousePositionRef.current.y - cubeScreenY, 2)
    );

    const deformStrength =
      Math.max(0, 1 - distToCube / MAX_DIST) * trailStrengthRef.current;

    const positions = geometryRef.current.attributes.position.array;
    const time = Date.now() * TIME_SCALE;

    for (let index = 0; index < positions.length; index += 3) {
      const x = originalPositionsRef.current[index];
      const y = originalPositionsRef.current[index + 1];
      const z = originalPositionsRef.current[index + 2];
      const distFromCenter = Math.sqrt(x * x + y * y + z * z);

      const wave =
        Math.sin(distFromCenter * WAVE_FREQUENCY - time * WAVE_SPEED) *
        WAVE_STRENGTH;

      const ripple = wave * deformStrength;

      const velocityInfluence =
        (x * mouseVelocityRef.current.x + y * mouseVelocityRef.current.y) *
        VELOCITY_INFLUENCE_SCALE;

      const deformation =
        (ripple + velocityInfluence * deformStrength) * DEFORMATION_SCALE;

      positions[index] = x + x * deformation;
      positions[index + 1] = y + y * deformation;
      positions[index + 2] = z + z * deformation;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });

  return (
    <mesh ref={cubeRef} position={[0, 0, 1]} layers={1}>
      <boxGeometry args={CUBE_ARGS} />
      <cubeDeformMaterial
        ref={materialRef}
        args={[new THREE.Color("#ffffff"), new THREE.Color("#ffffff")]}
      />
    </mesh>
  );
}

export default function EnhancedPixelCube() {
  const mousePositionRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const trailStrengthRef = useRef(0);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor("#000000");
          camera.layers.enable(1);
        }}
      >
        <PixelGrid
          mousePositionRef={mousePositionRef}
          mouseVelocityRef={mouseVelocityRef}
          trailStrengthRef={trailStrengthRef}
        />

        <EffectComposer>
          <Bloom
            intensity={BLOOM_INTENSITY}
            luminanceThreshold={BLOOM_THRESHOLD}
            luminanceSmoothing={BLOOM_SMOOTHING}
            height={0}
            layers={[1]}
          />
        </EffectComposer>

        <DeformingCube
          mousePositionRef={mousePositionRef}
          mouseVelocityRef={mouseVelocityRef}
          trailStrengthRef={trailStrengthRef}
        />
      </Canvas>
    </div>
  );
}`,
        },
      ],
    },
  ],

  customizationOptions: [
    {
      option: "Intensity",
      recommendation:
        "Keep the pixelation strong enough to notice but controlled enough that the image or visual remains recognizable.",
    },
    {
      option: "Interaction",
      recommendation:
        "Use mouse, hover, scroll, or time-based movement depending on the section. Cursor-based interaction works best on desktop.",
    },
    {
      option: "Assets",
      recommendation:
        "Use optimized textures and consistent visual direction. Image-based variants need enough visual detail to make pixel distortion meaningful.",
    },
    {
      option: "Performance",
      recommendation:
        "Cap DPR, avoid unnecessary render loops, and profile shader performance on real devices.",
    },
    {
      option: "Foreground content",
      recommendation:
        "Keep copy and CTAs in semantic HTML above the canvas so the page remains readable and accessible.",
    },
    {
      option: "Mobile behaviour",
      recommendation:
        "Simplify the effect or use a static fallback on smaller and lower-powered devices.",
    },
  ],

  notes: {
    performance:
      "Optimize textures, geometry, shader complexity, animation loops, and device pixel ratio. WebGL effects should be profiled on real devices, not only high-end development machines.",

    accessibility:
      "Keep meaningful content outside the canvas in semantic HTML. Respect reduced-motion preferences and avoid making motion essential to comprehension.",

    mobile:
      "Use simplified rendering, lower asset sizes, reduced motion, or static fallback on smaller and lower-powered devices.",
  },

  commonMistakes: [
    "No fallback state.",
    "Overpowering foreground copy.",
    "Using oversized assets.",
    "Running animations offscreen.",
    "Too much motion.",
    "Weak brand relevance.",
    "Ignoring mobile performance.",
  ],

  relatedEffectNames: [
    "Fractal Glass",
    "Progressive Bloom Valley",
    "Hero Banner Animated",
    "Curved Plane V2",
    "Interactive Blur Reveal",
  ],

  faq: [
    {
      question: "What is this effect best used for?",
      answer:
        "It is best for premium visual sections where motion, depth, or interaction can strengthen the page experience.",
    },
    {
      question: "Does it require WebGL?",
      answer:
        "This implementation uses React Three Fiber, Three.js, custom shaders, and canvas rendering. Other versions can use WebGL, CSS, canvas, or image-processing techniques depending on the desired effect.",
    },
    {
      question: "Is it suitable for SaaS websites?",
      answer:
        "Yes, when the visual supports the product story and does not reduce clarity or conversion focus.",
    },
    {
      question: "Should it have a fallback?",
      answer:
        "Yes. Advanced visual effects should include mobile, reduced-motion, and low-performance fallbacks.",
    },
    {
      question: "Can Hyperiux customize Mouse Pixelation for a website?",
      answer:
        "Yes. Hyperiux can adapt the pixel density, cursor radius, shader style, image treatment, velocity response, bloom, foreground layout, mobile fallback, and performance profile into a custom WebGL experience.",
    },
  ],

  finalCta: {
    body: "Use Mouse Pixelation when your visual layer should feel computational, reactive, and directly shaped by user movement.",
    primary: "Install Mouse Pixelation",
    secondary: "View WebGL Effects",
    commercial: "Request a Custom Mouse Pixelation",
  },
},
  }
};

export function getEffectContent(categorySlug, effectSlug) {
  return effectContent?.[categorySlug]?.[effectSlug] || null;
}