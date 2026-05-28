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
          question: "Does Sticky Content Wrapper require GSAP or another dependency?",
          answer:
            "The exact dependency depends on the implementation. The effect page should list whether it uses GSAP, Motion, Lenis, Canvas, SVG, Three.js, React Three Fiber, or no external animation library.",
        },
        {
          question: "Can Hyperiux customize Sticky Content Wrapper for a website?",
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
  },
};

export function getEffectContent(categorySlug, effectSlug) {
  return effectContent?.[categorySlug]?.[effectSlug] || null;
}