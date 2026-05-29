"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";
import DocsList, { DocsListItem } from "@/components/DocsContent/List";
import DocsTable from "@/components/DocsContent/Table";

export default function DocsLicense() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Licensing and Commercial Confidence</Heading>

      <Para className="text-foreground/70">
        Hyperiux Vault is built on a transparent, developer-first licensing model.
      </Para>

      <Para>
        The goal is simple: give creators freedom, give commercial teams confidence, and keep
        legal friction out of the build path. Nobody wants a launch blocked because a motion
        file has a licensing clause written like a tax trap.
      </Para>

      <Para>
        By using any source files from Hyperiux Vault, you agree to the terms outlined below.
      </Para>

      <Heading2 id="core-principle">The Core Principle: Absolute Code Ownership</Heading2>

      <Para>
        Hyperiux Vault does not lock production code inside compiled, black-box packages.
      </Para>

      <Para>
        Whether you are using Free Vaults or deploying Pro configurations, the source lives
        directly inside your repository. Once a Vault is added to your workspace, your team can
        inspect it, modify it, extend it, and adapt its motion logic, styling, layout behavior,
        and interaction physics to match your product.
      </Para>

      <Para>The code is yours to work with.</Para>

      <Para>
        That does not mean the Vault catalog is yours to repackage, resell, or redistribute.
        Ownership of implementation is not ownership of the source library as a competing
        product. Important distinction. Conveniently, also the obvious one.
      </Para>

      <Heading2 id="license-tiers">License Tiers</Heading2>

      <Para>
        We divide our catalog into two distinct licensing classifications to balance public
        ecosystem contributions with high-end commercial scaling tools.
      </Para>

      <Para>
        <strong>Hyperiux Vault Catalog</strong>
      </Para>

      <Para>
        <strong>Core Catalog (Free Tier):</strong> MIT License for commercial and personal use.
      </Para>

      <Para>
        <strong>Pro &amp; Enterprise Packs:</strong> Hyperiux Pro Commercial License.
      </Para>

      <Heading2 id="core-catalog-free-tier">1. The Core Catalog (Free Tier)</Heading2>

      <Para>
        All individual interaction patterns designated as <strong>Free</strong> on our{" "}
        <strong>/effects</strong> index are distributed under the terms of the standard MIT
        License.
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>What is permitted:</strong> Complete personal and commercial usage. You are
            fully authorized to deploy these interaction files into production client builds, SaaS
            environments, commercial marketing landing pages, and e-commerce platforms.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>What is restricted:</strong> You may not extract these free-tier files to build
            competitive UI component kits, theme market templates, or public code registries.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Attribution:</strong> No public or frontend attribution is required. The license
            block header inside the source code file must simply be preserved within your repository
            workspace.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="vault-pro-subscription-packs">2. Vault Pro &amp; Subscription Packs</Heading2>

      <Para>
        Vault Pro includes advanced multi-variant Vaults, cinematic templates, premium WebGL
        configurations, complete motion layouts, and commercial-grade interaction systems.
      </Para>

      <Para>These assets are licensed under the Hyperiux Pro Commercial License.</Para>

      <Para>
        When you purchase an individual Pro Pack or maintain an active subscription seat, your
        team receives a perpetual, non-exclusive, non-transferable worldwide usage right for the
        licensed assets, subject to the terms of your selected plan.
      </Para>

      <Heading2 id="project-usage">Project Usage</Heading2>

      <Para>Your license may apply to either:</Para>

      <DocsTable
        columns={[
          { key: "license", header: "License Type" },
          { key: "scope", header: "Scope" },
        ]}
        rows={[
          {
            license: "Single-Project License",
            scope: "Use within one production project or web application.",
          },
          {
            license: "Multi-Project License",
            scope: "Use across multiple production projects managed by your organization or client roster.",
          },
          {
            license: "Enterprise License",
            scope: "Custom scope based on your agreement.",
          },
        ]}
      />

      <Para>Check your selected plan at checkout for the exact deployment scope.</Para>

      <Heading2 id="saas-and-product-platforms">SaaS and Product Platforms</Heading2>

      <Para>
        You can use licensed Pro Vaults inside monetized software products, subscription-based
        platforms, dashboards, enterprise tools, and commercial web applications.
      </Para>

      <Para>The restriction is not about making money with your product. You can.</Para>

      <Para>
        The restriction is about reselling Hyperiux Vault source assets as assets.
      </Para>

      <Heading2 id="resale-and-redistribution-restrictions">
        Resale and Redistribution Restrictions
      </Heading2>

      <Para>You may not:</Para>

      <DocsList>
        <DocsListItem>
          <Para>Redistribute Pro Vault source files.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Sub-license Pro Vaults to third parties.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Resell Pro Vaults as raw assets.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Include Pro Vaults in public boilerplates.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Package Pro Vaults inside website builder templates.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Upload Pro Vaults to marketplaces, repositories, or competing libraries.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>
            Offer Pro Vaults as downloadable source files outside the licensed project context.
          </Para>
        </DocsListItem>
      </DocsList>

      <Para>Build with them. Ship with them. Do not repackage them.</Para>

      <Heading2 id="licensing-matrix-breakdown">Licensing Matrix Breakdown</Heading2>

      <DocsTable
        columns={[
          { key: "permission", header: "Permission" },
          { key: "free", header: "Free Tier" },
          { key: "pro", header: "Vault Pro" },
        ]}
        rows={[
          { permission: "Personal & Case Study Projects", free: "Allowed", pro: "Allowed" },
          { permission: "Commercial Client Work", free: "Allowed", pro: "Allowed" },
          { permission: "Monetized SaaS/Product Platforms", free: "Allowed", pro: "Allowed" },
          { permission: "No Attribution Required", free: "Allowed", pro: "Allowed" },
          { permission: "Use in Themes/Templates for Resale", free: "Restricted", pro: "Restricted" },
          { permission: "Direct Source Redistribution", free: "Restricted", pro: "Restricted" },
        ]}
      />

      <Heading2 id="enterprise-governance-compliance">
        Enterprise Governance &amp; Compliance
      </Heading2>

      <Para>
        For high-growth scale-ups and corporate engineering teams, compliance tracking is
        critical. Hyperiux provides enterprise-level assurances to insulate your deployment:
      </Para>

      <DocsList>
        <DocsListItem>
          <Para>
            <strong>Surgical Code Auditing:</strong> Because our CLI streams unminified, clean code
            directly into your repository, your internal security teams can completely audit every
            physical math utility and canvas rendering cycle, ensuring no external telemetry
            trackers or security vulnerabilities enter your firewall.
          </Para>
        </DocsListItem>

        <DocsListItem>
          <Para>
            <strong>Indemnification:</strong> Custom corporate agreements including IP
            indemnification, tailored seat structures, and dedicated implementation compliance
            guarantees are available via our broader Hyperiux Agency Ecosystem.
          </Para>
        </DocsListItem>
      </DocsList>

      <Heading2 id="compliance-violations">Compliance Violations</Heading2>

      <Para>
        Hyperiux Vault is built to be generous for builders and firm with bad actors.
      </Para>

      <Para>
        If an individual or organization scrapes, resells, republishes, sub-licenses, or
        repackages proprietary Hyperiux Vault source into competing developer tools, public
        registries, marketplace templates, or redistributed asset libraries, we reserve the
        right to take action.
      </Para>

      <Para>That may include:</Para>

      <DocsList>
        <DocsListItem>
          <Para>Terminating associated access tokens.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Revoking Pro or Enterprise access.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Blocking registry pulls through the Hyperiux CLI.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Removing access to premium assets.</Para>
        </DocsListItem>
        <DocsListItem>
          <Para>Pursuing legal enforcement where necessary.</Para>
        </DocsListItem>
      </DocsList>

      <Para>We prefer building. We are also capable of reading logs.</Para>

      <Heading2 id="questions-enterprise-customization">
        Questions &amp; Enterprise Customization
      </Heading2>

      <Para>
        If your legal department requires a customized software license agreement, corporate
        volume pricing, or clarification regarding a unique deployment environment, such as
        embedded applications or physical digital signage installations, connect with our legal
        engineering team directly at <a href="mailto:hi@hyperiux.com" className="font-medium underline">hi@hyperiux.com</a>.
      </Para>
    </DocsContent>
  );
}
