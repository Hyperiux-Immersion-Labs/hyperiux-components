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
  },
};

export function getEffectContent(categorySlug, effectSlug) {
  return effectContent?.[categorySlug]?.[effectSlug] || null;
}
