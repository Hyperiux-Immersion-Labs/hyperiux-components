"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import DocsImage from "@/components/DocsContent/Image";
import DocsList, { DocsListItem } from "@/components/DocsContent/List";
import DocsTable from "@/components/DocsContent/Table";

export default function DocsIntro() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Introduction</Heading>

      <Para className="text-foreground/70">
        Welcome to <b> Hyperiux Vault</b> <br /> A curated library of premium Vault built for websites
        that need to be remembered.
      </Para>

      {/* <DocsImage
        src="/assets/heroo-bg.png"
        alt="Hyperiux Vault introduction preview"
        sizes="(max-width: 1280px) 100vw, 900px"
        priority
      /> */}

      <Para>
        Most UI libraries help teams assemble the expected parts of a page: buttons, cards,
        inputs, accordions, grids. Useful, yes. Distinctive, rarely.
      </Para>

      <Para>
        Hyperiux Vault operates at a different layer. We focus on the moments users actually
        feel: immersive scroll sequences, kinetic typography, dynamic cursor systems, fluid
        transitions, WebGL scenes, and interaction patterns that make a digital product feel
        authored rather than assembled.
      </Para>

      <Para>
        This is not a warehouse of generic interface parts. It is a production-ready
        interaction library for teams that care about perception, motion, polish, and code
        ownership.
      </Para>

      <Para>
        Hyperiux Vault exists to give developers and design-led teams access to high-end
        creative frontend execution without forcing every project into a custom engineering
        marathon.
      </Para>

      <Heading2 id="the-commodity-web-problem">The Commodity Web Problem</Heading2>

      <Para>
        The modern web has become painfully efficient at looking the same.
      </Para>

      <Para>
        Most landing pages now follow the same sequence: hero, feature grid, visual block,
        testimonial strip, final CTA. The structure works. That is also the problem. When
        every product uses the same rhythm, even strong positioning can start to feel like
        template residue.
      </Para>

      <Para>
        Differentiation rarely comes from moving a card grid six pixels to the left. It
        comes from the interaction layer: how a section enters, how typography responds,
        how scroll progression builds tension, how transitions maintain continuity, and how
        the interface makes the brand feel before the user reads the pitch.
      </Para>

      <Para>
        That level of execution is difficult to build well. It requires animation logic,
        responsive behavior, rendering performance, accessibility discipline, and enough
        restraint to avoid turning the website into a nightclub with a pricing page.
      </Para>

      <Para>Hyperiux Vault removes that friction.</Para>

      <Para>
        We provide production-ready Vaults that bring advanced creative frontend patterns
        into real projects quickly, cleanly, and without surrendering control of the codebase.
      </Para>

      <Heading2 id="core-philosophy">The Core Philosophy: Motion as Visual Intent</Heading2>

      <Para>At Hyperiux, motion is not decoration.</Para>

      <Para>
        Motion has a job. We believe that it should create clarity, emphasis, rhythm, or
        atmosphere. If it does none of those, it is noise with better easing.
      </Para>

      <Para>Hyperiux Vault is built around a simple design engineering principle:</Para>

      <Para>
        <span className="font-bold">
          "High-fidelity interaction should make the interface feel more intentional, not merely more animated."
        </span>
      </Para>

      <Para>
        A strong Vault should help users understand where they are, what matters, and how
        the experience is unfolding. It should give static content a sense of sequence. It
        should make scrolling feel composed rather than accidental.
      </Para>

      <Para>
        When motion is handled correctly, the page feels more expensive before anyone
        reaches a conversion point. That is not aesthetic vanity. Perceived quality affects
        trust, trust affects engagement, and engagement affects commercial outcomes.
      </Para>

      <Para>The interface is already speaking. Hyperiux Vault helps it stop mumbling.</Para>

      <Heading2 id="the-value-split">The Value Split</Heading2>

      <Para>
        Hyperiux Vault is built to provide multi-layered value across every stakeholder tier
        of a modern digital product.
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>For Developers (Speed &amp; Adaptability):</strong> Developers get clean,
            editable starting points for complex frontend interactions. Each Vault is designed
            to reduce the time usually lost to animation scaffolding, dependency mapping,
            cross-device tuning, and repeated motion experiments. Instead of spending weeks
            proving whether an interaction can work, developers can start from a
            production-calibrated base and adapt from there.Spacing, timing, content, styling, breakpoints, and visual treatments remain under
            your control. Hyperiux Vault does not hide the work from you. It gives you better
            work to start from.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>For Designers &amp; Founders (Perception &amp; Brand Value):</strong> Design
            quality is not only what users see. It is what they infer. A sharper motion system
            can make a brand feel more premium, more deliberate, and more technically mature. That matters for studios, SaaS products, portfolios, agencies, AI tools, and any
            business trying to avoid looking like it bought the same homepage as twelve
            competitors before lunch. The Vault gives teams the interaction layer usually
            reserved for bespoke creative builds, without requiring a bespoke budget every time.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>For Hyperiux (Proof Asset):</strong> The Vault also acts as a living proof
            system for our creative engineering standards. It shows how far modern web
            experiences can go when design, frontend engineering, motion logic, and performance
            discipline are treated as one system instead of separate departments arguing in
            Figma comments.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="modular-interaction-index">The Modular Interaction Index</Heading2>

      <Para>
        The Vault is structured as a searchable, crawlable interaction index designed to
        tackle complex UI environments where traditional component kits fall short.
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Scroll Behaviors:</strong> Cinematic page-scrolling, reveal animations, and
            sticky tracking built for feature storytelling, case studies, and service
            methodologies.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Cursor Systems:</strong> Interactive custom pointers, magnetic attraction
            elements, and sophisticated hover trails that add physical presence to standard
            desktop interactions.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Text &amp; Typographic Motion:</strong> Premium layouts for kinetic headers,
            letter-morphing, and text reveals that ensure copy feels dynamic and weighted.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Page Transitions:</strong> Immersive, fluid routing animations that maintain
            visual continuity and completely eliminate jarring layout jumps.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>WebGL Scenes &amp; Creative UI:</strong> High-impact, canvas-driven moments
            and advanced interface physics utilizing WebGL and TSL shaders for unmatched
            performance.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="technical-stack">The Technical Stack</Heading2>

      <Para>
        Every pattern in the Vault is authored natively for high-performance, modern web
        applications. The code architecture integrates seamlessly with industry-standard
        development workflows.
      </Para>

      <DocsTable
        columns={[
          { key: "category", header: "Category" },
          { key: "stack", header: "Stack" },
        ]}
        rows={[
          { category: "Core Frameworks", stack: "React, Next.js" },
          { category: "Styling Architecture", stack: "Tailwind CSS" },
          {
            category: "Animation & Graphics",
            stack: "Framer Motion, GSAP, Three.js, React Three Fiber, WebGL, TSL",
          },
        ]}
      />

      <Heading2 id="performance-accessibility-integrity">
        Performance, Accessibility, &amp; Integrity
      </Heading2>

      <Para>
        High-fidelity animations and WebGL scenes must never come at the expense of user
        experience, core web vitals, or accessibility guidelines. Hyperiux Vault patterns
        are written with a strict, performance-first architecture.
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Controlled Motion:</strong> We utilize hardware-accelerated animations,
            strictly manage high-memory canvas cycles, and optimize rendering loops to ensure
            interfaces remain fast and fluid across all device tiers.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Core Web Vitals:</strong> Interactions are built to prevent layout shifts
            and protect the page&apos;s time-to-interactive.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Accessibility First:</strong> Our implementation standards ensure that
            motion never hinders navigation or hides important information. Every pattern is
            built to respect reduced-motion media preferences and preserve content in an
            accessible, logical reading order with reliable mobile fallbacks.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="open-source-freemium-model">Open Source &amp; Freemium Model</Heading2>

      <Para>
        Hyperiux Vault operates on a flexible tier system designed to empower independent
        creators while providing enterprise confidence for scaling engineering teams.
      </Para>

      <Para>
        <strong>The Free Tier:</strong> We offer a curated selection of core individual
        effects completely free and open-source. Developers can copy, customize, and deploy
        these foundational interaction layers directly into commercial projects with
        absolute code ownership.
      </Para>

      <Para>
        <strong>Vault Pro &amp; Subscription Packs:</strong> To access our full catalog of
        advanced variants, curated end-to-end templates, premium animation bundles, and
        workflow acceleration tools, teams can upgrade to our paid subscription or unlock
        specialized Pro packs.
      </Para>

      <Para>
        <strong>Agency Ecosystem Integration:</strong> Beyond our pre-built premium catalog,
        we offer direct commercial confidence. Through the broader Hyperiux agency
        ecosystem, teams can gain priority access to custom implementation support,
        dedicated team licensing, and tailored optimization to adapt these complex interface
        physics to exact brand conversion goals.
      </Para>

      <Heading2 id="next-steps">Next Steps</Heading2>

      <Para>
        To build without introducing global project bloat, check out our step-by-step 
         <a href="/docs/installation" className="font-medium underline px-1">Installation Guide</a>. Learn how our dedicated CLI automatically resolves dependencies
        for individual interaction patterns, allowing you to deploy premium experiences in
        minutes.
      </Para>
    </DocsContent>
  );
}
