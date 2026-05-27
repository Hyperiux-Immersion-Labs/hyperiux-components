"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import DocsImage from "@/components/DocsContent/Image";
import { VaultContent } from "../effects/vault-content";

export default function DocsIntro() {
  return (
    
    <DocsContent className="max-w-none mx-0">
      <Heading>Introduction</Heading>

      <Para className="text-foreground/70">
        Welcome to Hyperiux Vault - a curated catalog of creative interaction patterns engineered
        for websites that need to be remembered.
      </Para>

      <DocsImage
        src="/assets/heroo-bg.png"
        alt="Docs preview"
        sizes="(max-width: 1280px) 100vw, 900px"
        priority
      />

      <Para>
        Unlike standard component marketplaces that focus on static, commodity UI primitives like
        buttons or input fields, Hyperiux Vault focuses entirely on the interaction layer.
      </Para>

      <Para>
        We build the high-fidelity web moments that capture attention and elevate digital
        storytelling: immersive scroll behaviors, dynamic cursor systems, typographic motion, fluid
        page transitions, and WebGL-driven scenes.
      </Para>

      <Para>
        Hyperiux Vault serves as the definitive bridge between production-ready developer execution
        and high-end creative frontend design.
      </Para>

      <Heading2 id="what-it-contains">What it Contains</Heading2>

      <Para>
        The Vault is designed as a modular, searchable interaction index. It provides deep,
        crawlable categories built specifically to tackle complex UI moments where traditional
        component kits fall short.
      </Para>

      <Para>
        <strong>Scroll Behaviors:</strong> Cinematic page-scrolling, reveal animations, and sticky
        tracking.
      </Para>

      <Para>
        <strong>Cursor Systems:</strong> Interactive custom pointers, magnetic attraction elements,
        and hover trails.
      </Para>

      <Para>
        <strong>Text & Typographic Motion:</strong> Premium layouts for text reveals,
        letter-morphing, and kinetic headers.
      </Para>

      <Para>
        <strong>Page Transitions:</strong> Fluid, immersive routing animations that eliminate
        jarring layout jumps.
      </Para>

      <Para>
        <strong>WebGL Scenes & Creative UI:</strong> High-impact, immersive canvas moments and
        advanced interface interactions.
      </Para>

      <Heading2 id="technical-stack">The Technical Stack</Heading2>

      <Para>
        Every interaction pattern in Hyperiux Vault is built natively for modern, high-performance
        web applications.
      </Para>

      <Para>
        <strong>Frameworks:</strong> React and Next.js
      </Para>

      <Para>
        <strong>Styling:</strong> Tailwind CSS
      </Para>

      <Para>
        <strong>Animation & Graphics:</strong> Framer Motion, GSAP, Three.js, React Three Fiber,
        WebGL and TSL
      </Para>

      <Heading2 id="why-hyperiux-vault">Why Hyperiux Vault?</Heading2>

      <Para>
        The modern web has become hyper-standardized. While current UI libraries excel at helping
        teams ship layout grids and standard dashboard components quickly, they leave a glaring gap
        where memorable, premium brand experiences are made.
      </Para>

      <Para>
        Hyperiux Vault exists to hand production-ready, highly complex creative frontend patterns
        directly to developers, saving weeks of R&D and ensuring your project stands out in a
        crowded digital landscape.
      </Para>

      <Heading2 id="our-mission">Our Mission</Heading2>

      <Para>
        Our mission is twofold: first, we want to empower developers by removing the technical
        friction from advanced web physics, WebGL, and complex animation timelines.
      </Para>

      <Para>
        Second, we aim to demonstrate the absolute peak of immersive web capabilities. Hyperiux
        Vault acts as living public proof of what our creative engineering agency can achieve.
      </Para>

      <Heading2 id="getting-started">Getting Started</Heading2>

      <Para>
        To get started without introducing global project bloat, check out our step-by-step
        Installation Guide to see how our CLI automatically resolves dependencies for individual
        components.
      </Para>

      <Heading2 id="open-source-freemium-model">Open Source & Freemium Model</Heading2>

      <Para>
        Hyperiux Vault operates on a freemium model designed to provide immediate value while
        supporting long-term production development.
      </Para>

      <Para>
        <strong>The Free Tier:</strong> We offer a selection of core individual effects completely
        free and open-source. Developers can copy, customize, and deploy these foundational
        interaction layers into commercial projects with absolute code ownership.
      </Para>

      <Para>
        <strong>Vault Pro & Subscription Tiers:</strong> To access our full catalog of advanced
        variants, curated templates, premium bundles, and workflow acceleration tools, teams can
        upgrade to our paid subscription or unlock specialized Pro packs.
      </Para>

      <Heading2 id="performance">Performance</Heading2>

      <Para>
        High-fidelity animations and WebGL scenes should never come at the expense of user
        experience, core web vitals, or accessibility. Hyperiux Vault patterns are written with a
        strict performance-first architecture.
      </Para>

      <Para>
        Every pattern includes comprehensive production-ready implementation notes. We utilize
        hardware-accelerated animations, strictly manage high-memory interface moments, and optimize
        canvas cycles to ensure that your website remains incredibly fast, fluid, and responsive
        across all device tiers and conversion environments.
      </Para>
    </DocsContent>
   
  );
}