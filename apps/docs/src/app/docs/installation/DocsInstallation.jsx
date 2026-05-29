"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import { CodeBlock } from "@/components/ui/CodeBlock";
import DocsTable from "@/components/DocsContent/Table";
import DocsList, { DocsListItem } from "@/components/DocsContent/List";

export default function DocsInstallation() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Installation Guide</Heading>

      <Para className="text-foreground/70">
        Using <b> Hyperiux Vault </b> is not a package install. It is a code ownership decision.
      </Para>

      <Para>
        We do not ship a heavy global dependency that quietly expands inside your production
        bundle. Hyperiux Vault is built around local source ownership: Vaults are added
        directly into your workspace, where your team can inspect, edit, tune, and ship them
        on your terms.
      </Para>

      <Para>
        That matters because Vaults are not static UI primitives. They handle the interaction
        layer of your frontend: motion logic, rendering behavior, visual physics, responsive
        timing, and high-memory creative effects. Treat that layer like a black box and you
        inherit someone else&apos;s constraints.
      </Para>

      <Para>
        Hyperiux Vault gives you production-ready source files without asking you to surrender
        architectural control. A rare arrangement. We recommend keeping it.
      </Para>

      <Heading2 id="technical-prerequisites">Technical Prerequisites</Heading2>

      <Para>
        Before adding Vaults, make sure your project has the core frontend foundation required
        for high-fidelity motion and creative rendering.
      </Para>

      <DocsTable
        columns={[
          { key: "prereq", header: "Prerequisite" },
          { key: "details", header: "Details" },
        ]}
        rows={[
          { prereq: "Core framework", details: "React 18+ or Next.js 14/15" },
          { prereq: "Styling architecture", details: "Tailwind CSS v3 or v4" },
          {
            prereq: "Language",
            details: "TypeScript recommended, modern JavaScript supported",
          },
          { prereq: "Package manager", details: "npm, pnpm, yarn, or bun" },
          {
            prereq: "Project structure",
            details: "App Router, Pages Router, or modern Vite-based React setup",
          },
        ]}
      />

      <Para>
        Hyperiux Vault is optimized for modern React and Next.js environments, especially
        projects that separate server and client behavior cleanly. Motion-heavy Vaults often
        need client-side rendering boundaries, so a disciplined project structure will make
        implementation cleaner.
      </Para>

      <Para>
        TypeScript is recommended when working with advanced animation props, responsive
        controls, and configurable motion states. JavaScript works, but TypeScript gives your
        future self fewer reasons to mutter at the screen.
      </Para>

      <Heading2 id="choose-your-architectural-pathway">
        Choose Your Architectural Pathway
      </Heading2>

      <Para>
        We recognize that engineering workflows dictate repository structures. To preserve
        your team&apos;s development autonomy, we offer two deliberate integration frameworks
        engineered to respect your pipeline architecture.
      </Para>

      <Heading2 id="method-a-automated-scaffolding">
        Method A: Automated Scaffolding via the Hyperiux CLI
      </Heading2>

      <Para>
        The Hyperiux CLI is engineered for velocity. Acting as a surgical injection engine, it
        automatically streams the raw component source code directly into your local directory
        space, maps structural dependencies, and instantiates any required secondary math
        engines.
      </Para>

      <Para>
        This approach aligns natively with modern, modular registry specifications such as
        shadcn/ui, giving you the speed of a package manager with the complete customizability
        of local code space.
      </Para>

      <Heading2 id="link-the-hyperiux-architecture-registry">
        1. Link the Hyperiux Architecture Registry
      </Heading2>

      <Para>
        To route incoming component injections smoothly into your designated workspace, append
        our remote registry extension directly within your local <strong>components.json</strong>{" "}
        blueprint:
      </Para>

      <CodeBlock
        language="json"
        filename="components.json"
        code={`{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@hyperiux": "https://components.hyperiux.com/r/{name}.json"
  }
}`}
      />

      <Heading2 id="trigger-the-injection-engine">
        2. Trigger the Injection Engine
      </Heading2>

      <Para>
        Execute the dedicated workspace command to pull down the exact interaction file, along
        with its isolated mathematical utility scripts, straight into your repository root:
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux add [effect-name]`} />

      <Heading2 id="why-dependencies-are-resolved-per-vault">
        Why Dependencies Are Resolved Per Vault
      </Heading2>

      <Para>
        High-fidelity interaction work often depends on specialized animation and rendering
        tools. Some Vaults may need <strong>gsap</strong>. Others may need{" "}
        <strong>framer-motion</strong>, <strong>three</strong>, or{" "}
        <strong>@react-three/fiber</strong>.
      </Para>

      <Para>
        Installing every possible dependency globally would be lazy architecture dressed as
        convenience.
      </Para>

      <Para>
        Hyperiux Vault resolves dependencies based on the Vault you actually add. If a Vault
        needs a physics engine, rendering library, or animation utility, the CLI installs what
        that specific Vault requires. Nothing more by default.
      </Para>

      <Para>
        This keeps your project cleaner, protects bundle discipline, and reduces the chance of
        shipping unused creative machinery into production.
      </Para>

      <Para>Motion should create value. It should not smuggle dead weight into your build.</Para>

      <Heading2 id="method-b-manual-integration">
        Method B: Manual Integration (Absolute Repository Custody)
      </Heading2>

      <Para>
        For enterprise development teams working within highly air-gapped systems, rigid CI/CD
        pipelines, or for engineers who demand absolute, line-by-line code auditing before
        anything enters their codebase, we offer a completely unmediated setup flow.
      </Para>

      <Para>
        Manual integration bypasses automated terminal utilities entirely, treating the source
        files as an open, adaptable blueprint.
      </Para>

      <Heading2 id="source-the-interaction-blueprint">
        1. Source the Interaction Blueprint
      </Heading2>

      <Para>
        Browse our modular <strong>/effects</strong> catalog and isolate the exact behavioral
        layer required for your layout block.
      </Para>

      <Heading2 id="calibrate-environment-variables">
        2. Calibrate Environment Variables
      </Heading2>

      <Para>
        Utilize the documentation engine&apos;s interactive interface toggles to match your
        exact local runtime environment, instantly re-mapping the raw source files between
        strict, type-safe TypeScript architecture and modern JavaScript.
      </Para>

      <Heading2 id="audit-and-install-peer-math-dependencies">
        3. Audit and Install Peer Math Dependencies
      </Heading2>

      <Para>
        Review the explicit Dependencies Checklist declared on that specific interaction page.
        Before extracting the component code, ensure that any necessary math or physics
        sub-engines such as <strong>three</strong> or <strong>gsap</strong> are correctly
        mapped inside your local <strong>package.json</strong> manifest and compiled:
      </Para>

      <CodeBlock language="bash" code={`npm install gsap framer-motion`} />

      <Heading2 id="extract-and-deploy-the-source-code">
        4. Extract and Deploy the Source Code
      </Heading2>

      <Para>
        Open the verified production Code Tab, copy the complete, unminified script, and
        transition it into your local repository directory structure, for example{" "}
        <strong>@/components/hyperiux/TextMorph.tsx</strong>.
      </Para>

      <Heading2 id="verify-import-pathways">5. Verify Import Pathways</Heading2>

      <Para>
        Once the script is in place, manually audit the internal relative file pathways to
        align with your project&apos;s custom utility aliases such as <strong>@/lib/utils</strong>,
        and let your native compiler initialize the physics engine.
      </Para>

      <Heading2 id="implementation-blueprint">Implementation Blueprint</Heading2>

      <Para>
        Once the interaction script lives inside your local directory space, using its
        high-fidelity properties to alter the interface environment is completely frictionless.
        Below is a foundational implementation pattern showing how to structure a Vault
        typographic element with customized motion parameters:
      </Para>

      <CodeBlock
        language="tsx"
        filename="app/page.tsx"
        code={`import { KineticHeader } from "@/components/hyperiux/KineticHeader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden perspective-1000">
      {/* Deliberately authored interaction layer.
        Fine-tune properties to manipulate timing, responsiveness, and canvas physics.
      */}
      <KineticHeader
        text="REDEFINING THE WEB LAYER"
        animationSpeed={0.45}
        magneticForce={1.2}
        glitchTrigger="hover"
        className="tracking-tight text-white font-bold"
      />
    </main>
  );
}`}
      />

      <Heading2 id="next-steps">Next Steps</Heading2>

      <Para>
        With your environment calibrated, you are fully equipped to eliminate web
        standardization and build digital experiences that leave a lasting impression.
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Deploy From the Index:</strong> Head over to our <strong>/effects</strong>{" "}
            index to find and configure your very first interaction pattern.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Scale Your Output:</strong> To unlock a vast library of multi-variant
            components, production-ready cinematic templates, and comprehensive animation layouts,
            explore our premium tier options at Hyperiux Vault Pro.
          </Para>
        </DocsListItem>
      </DocsList>
    </DocsContent>
  );
}
