"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import { CodeBlock } from "@/components/ui/CodeBlock";
import DocsList, { DocsListItem } from "@/components/DocsContent/List";
import DocsTable from "@/components/DocsContent/Table";

export default function DocsDependencies() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Dependencies and Peer Engines</Heading>

      <Para className="text-foreground/70">
        Hyperiux Vault is built around a simple technical position: premium interaction work
        should not drag unnecessary weight into your application.
      </Para>

      <Para>
        Vaults are injected into your local project as clean, editable source files. They do
        not arrive as a sealed package, and they do not force your entire app to carry
        libraries it may never use.
      </Para>

      <Para>
        That matters because high-fidelity Vaults are not decorative snippets. They may depend
        on animation engines, physics utilities, canvas renderers, or WebGL layers. Those tools
        are powerful. They are also not free. Add them carelessly and your production bundle
        will remind you, usually at the worst possible moment.
      </Para>

      <Para>
        Hyperiux Vault handles dependencies with precision: structural requirements stay clear,
        peer engines are added only when a Vault needs them, and your team keeps full control
        over what enters the codebase.
      </Para>

      <Heading2 id="dependency-philosophy">The Dependency Philosophy</Heading2>

      <Para>
        We categorize dependencies into two distinct types to give you complete visibility and
        control over your repository&apos;s bundle size:
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Structural Essentials (Global):</strong> The underlying framework and styling
            engine that you must have installed globally in your project.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Animation &amp; Math Peer Engines (On-Demand):</strong> Specialized physics or
            rendering engines that are only required if you deploy an interaction pattern that
            commands them.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="performance-optimization-guardrail">
        Performance Optimization Guardrail
      </Heading2>

      <Para>
        When utilizing Method A, the Hyperiux CLI, to add an effect, our scaffolding engine
        will automatically audit your <strong>package.json</strong>, install missing peer
        engines dynamically, and isolate their application scope.
      </Para>

      <Para>
        If you choose Method B, manual integration, you have full custody to install these
        versions manually.
      </Para>

      <Heading2 id="structural-essentials">1. Structural Essentials</Heading2>

      <Para>
        Every pattern in the Vault assumes your project is calibrated with modern,
        high-performance web building blocks. Ensure these core frameworks are configured
        before introducing Vault files:
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>React 18+ / Next.js 14 or 15:</strong> Fully compatible with both standard
            client applications and Next.js App Router architectures, handling Server and Client
            component splits fluidly.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Tailwind CSS v3 or v4:</strong> All visual design presets, layout tokens, and
            utility classes are written utilizing native Tailwind primitives.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="animation-math-peer-engines">
        2. Animation &amp; Math Peer Engines
      </Heading2>

      <Para>
        Our components leverage specific heavy-lifting tools depending on the complexity of
        the visual intent. Below are the verified, production-stable core frameworks used
        across our five main interaction categories:
      </Para>

      <DocsTable
        columns={[
          { key: "category", header: "Category" },
          { key: "deps", header: "Core Peer Dependencies" },
          { key: "purpose", header: "Purpose" },
        ]}
        rows={[
          {
            category: "Scroll Behaviors",
            deps: (
              <>
                <strong>framer-motion</strong>, <strong>gsap</strong>
              </>
            ),
            purpose: "Smooth frame interpolation, kinetic scroll tracking, and timeline scrub pinning.",
          },
          {
            category: "Cursor Systems",
            deps: (
              <>
                <strong>gsap</strong>
              </>
            ),
            purpose: "Sub-pixel pointer tracking, physical inertia calculations, and magnetic attraction arrays.",
          },
          {
            category: "Typographic Motion",
            deps: (
              <>
                <strong>framer-motion</strong>, <strong>gsap</strong>
              </>
            ),
            purpose: "Complex text-splitting, character layout morphing, and dynamic sequencing.",
          },
          {
            category: "Page Transitions",
            deps: (
              <>
                <strong>framer-motion</strong>
              </>
            ),
            purpose: "Route-listener orchestration and fluid layout continuity during mounting and unmounting.",
          },
          {
            category: "WebGL & Creative UI",
            deps: (
              <>
                <strong>three</strong>, <strong>@react-three/fiber</strong>,{" "}
                <strong>@react-three/drei</strong>
              </>
            ),
            purpose:
              "Canvas lifecycle initialization, mathematical shader pipelines, and GPU hardware acceleration via WebGL and TSL.",
          },
        ]}
      />

      <Heading2 id="version-pinning-compliance">Version Pinning &amp; Compliance</Heading2>

      <Para>
        To guarantee mathematical precision and prevent runtime calculation discrepancies, we
        recommend matching the following peer dependency parameters when maintaining your local
        environment:
      </Para>

      <CodeBlock
        language="json"
        filename="package.json"
        code={`{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.5",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.90.0"
  }
}`}
      />

      <Heading2 id="bundle-management-tree-shaking">
        Bundle Management &amp; Tree-Shaking
      </Heading2>

      <Para>High-fidelity interaction should never come at the cost of Core Web Vitals.</Para>

      <Para>
        Hyperiux Vault files are structured to support clean imports, isolated execution, and
        practical tree-shaking. The goal is not just to make the interaction work. The goal is
        to make it work without taxing pages that never use it.
      </Para>

      <Heading2 id="isolated-canvas-execution">Isolated Canvas Execution</Heading2>

      <Para>
        Vaults that use WebGL, Three.js, or canvas rendering keep execution scoped to the page
        or section where they are mounted.
      </Para>

      <Para>
        If a page does not render a WebGL Vault, it should not inherit canvas runtime overhead
        from that Vault by default.
      </Para>

      <Heading2 id="hardware-accelerated-motion">Hardware-Accelerated Motion</Heading2>

      <Para>Animation logic prioritizes transform-based properties such as:</Para>

      <CodeBlock
        language="css"
        code={`translate3d()
scale3d()
rotate3d()`}
      />

      <Para>
        These properties allow the browser to use GPU acceleration more effectively and reduce
        unnecessary layout recalculation.
      </Para>

      <Para>
        Translation: move pixels intelligently. Do not ask the browser to rebuild the room
        every frame.
      </Para>

      <Heading2 id="accessibility-aware-motion">Accessibility-Aware Motion</Heading2>

      <Para>
        Vaults are designed to respect the browser&apos;s reduced-motion preference.
      </Para>

      <Para>
        Motion should enhance the experience for users who want it and step back for users who
        do not. Accessibility is not a patch after the animation is approved. It is part of the
        motion system.
      </Para>

      <Heading2 id="diagnostics">Diagnostics</Heading2>

      <Para>
        If you are uncertain whether a newly injected interaction component is experiencing
        dependency friction or causing structural bundle leaks, utilize the internal system
        health utility via the Hyperiux CLI:
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux doctor`} />

      <Para>
        This utility will thoroughly inspect your local repository space, map component
        requirements against your <strong>package.json</strong>, and output precise
        installation directives to restore environment stability.
      </Para>
    </DocsContent>
  );
}
