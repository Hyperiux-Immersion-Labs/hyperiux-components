"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import { CodeBlock } from "@/components/ui/CodeBlock";
import DocsList, { DocsListItem } from "@/components/DocsContent/List";


export default function DocsCli() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Hyperiux Vault CLI</Heading>

      <Para className="text-foreground/70">
        The Hyperiux Vault CLI gives teams a controlled way to install, audit, update, and
        remove premium 3D UI components inside modern frontend repositories.
      </Para>

      <Para>
        It does not lock your product into a bloated global dependency. It does not hide
        interaction logic inside a black box. The CLI writes components directly into your
        workspace, resolves required dependencies, and keeps your motion layer traceable,
        editable, and production-aware.
      </Para>

      <Para>
        For teams building expressive interfaces, that matters. The difference between a
        premium interaction and a performance liability is usually not taste. It is
        implementation discipline.
      </Para>

      <Heading2 id="cli-reference">CLI Reference</Heading2>

      <Para>
        The Hyperiux CLI <strong>hyperiux</strong> is a surgical scaffolding and environment
        automation toolkit engineered to manage the high-fidelity interaction layer of your
        repository.
      </Para>

      <Para>
        Rather than restricting your architecture within a global, monolithic node module, the
        CLI executes isolated, local file injections, automatically maps complex layout or
        canvas math dependencies, and optimizes your workspace health without introducing
        global bundle bloat.
      </Para>

      <Heading2 id="installation-execution">Installation &amp; Execution</Heading2>

      <Para>
        You can utilize the Hyperiux CLI on-demand using modern package executables, or choose
        a global machine installation for persistent workflow acceleration.
      </Para>

      <Heading2 id="on-demand-execution">On-Demand Execution — Recommended</Heading2>

      <Para>Run commands directly without local environment contamination:</Para>

      <CodeBlock language="bash" code={`npx hyperiux [command]`} />

      <Heading2 id="global-installation">Global Installation</Heading2>

      <Para>For rapid execution across multi-brand workspaces:</Para>

      <CodeBlock language="bash" code={`npm install -g hyperiux`} />

      <Heading2 id="core-commands">Core Commands</Heading2>

      <Heading2 id="init">init</Heading2>

      <Para>
        Initializes a clean, production-calibrated frontend repository pre-configured with the
        Hyperiux UI environment, local directory routing variables, and hardware-accelerated
        rendering rules.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux init [project-name] [options]`} />

      <Para>
        <strong>Options</strong>
      </Para>

      <Para>
        <strong>-t, --template &lt;string&gt;:</strong> Specifies the starter architecture
        blueprint, for example <strong>next-app</strong>, <strong>next-pages</strong>, or{" "}
        <strong>vite</strong>.
      </Para>

      <Para>
        <strong>-p, --package &lt;string&gt;:</strong> Forces a specific workspace runtime
        package manager, such as <strong>npm</strong>, <strong>pnpm</strong>,{" "}
        <strong>yarn</strong>, or <strong>bun</strong>.
      </Para>

      <Heading2 id="add">add</Heading2>

      <Para>Adds a Hyperiux Vault component to your project.</Para>

      <Para>
        The command installs the selected interaction pattern into your local component
        directory, along with the supporting animation logic, layout utilities, and peer
        dependencies required for it to run correctly.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux add [effect-name] [options]`} />

      <Para>
        <strong>Options</strong>
      </Para>

      <Para>
        <strong>-o, --overwrite:</strong> Forces a fresh override of an existing component
        script, resetting modified visual physics to factory production baselines.
      </Para>

      <Para>
        <strong>-y, --yes:</strong> Skips interactive terminal checklist prompts,
        automatically resolving peer layout structures.
      </Para>

      <CodeBlock
        language="bash"
        code={`# Example: Injecting advanced typographic motion along with its required GSAP sub-engines
npx hyperiux add kinetic-header`}
      />

      <Heading2 id="upgrade">upgrade</Heading2>

      <Para>
        Audits your local <strong>/components/hyperiux</strong> source files against our master
        registry, performing surgical upstream updates on your motion math matrices while
        carefully preserving your custom inline styling properties.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux upgrade [effect-name]`} />

      <Heading2 id="uninstall">uninstall</Heading2>

      <Para>
        Safely purges an interaction pattern from your local directory, recursively auditing
        your workspace to clear out obsolete internal animation or physical math helpers,
        provided they are not active in other active layouts.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux uninstall [effect-name]`} />

      <Heading2 id="list">list</Heading2>

      <Para>
        Generates a complete architectural overview of all Hyperiux interaction layers
        currently deployed within your active repository.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux list`} />

      <Heading2 id="doctor">doctor</Heading2>

      <Para>
        An environment diagnostics utility built to protect your site&apos;s Core Web Vitals.
        <strong> doctor</strong> comprehensively scans your workspace to detect missing
        animation peer utilities, layout conflicts, or untracked bundle leaks.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux doctor`} />

      <Para>
        <strong>System Health Checks Performed:</strong>
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            Validates that mandatory peer engines such as <strong>gsap</strong>,{" "}
            <strong>framer-motion</strong>, and <strong>three</strong> match minimal physics
            calculation criteria.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            Inspects local configuration integrity within your <strong>components.json</strong>{" "}
            registry file.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            Verifies Tailwind style pipelines to prevent layout-shift vulnerabilities during
            animation cycles.
          </Para>
        </DocsListItem>
      </DocsList>

      <Para>
        <strong>Example Output:</strong>
      </Para>

      <CodeBlock
        language="plaintext"
        code={`Hyperiux CLI v1.4.2
Checking repository health...

Your workspace has 1 optimization bottleneck requiring attention:

Issue 1: Missing Peer Math Engine
The interaction file '@components/hyperiux/TextMorph.tsx' relies on missing peer primitives.
- 'framer-motion' is not declared in package.json.

Run \`npx hyperiux add text-morph --resolve\` to automatically patch this workspace.`}
      />

      <Heading2 id="env">env</Heading2>

      <Para>
        Outputs a clean debug snapshot of your current hardware-rendering software layer,
        perfect for attaching to custom development issues when collaborating with our
        advanced creative engineering agency ecosystem.
      </Para>

      <CodeBlock language="bash" code={`npx hyperiux env`} />

      <Heading2 id="next-steps">Next Steps</Heading2>

      <Para>Now that your command-line environment is fully calibrated:</Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Deploy an Asset:</strong> Execute{" "}
            <strong>npx hyperiux add [effect-name]</strong> to inject your first cinematic
            interaction.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Explore Pro Capabilities:</strong> Unlock premium multi-variant CLI wrappers
            and curated high-end templates by authenticating your workspace access token via{" "}
            <strong>npx hyperiux auth [pro-token]</strong>.
          </Para>
        </DocsListItem>
      </DocsList>
    </DocsContent>
  );
}
