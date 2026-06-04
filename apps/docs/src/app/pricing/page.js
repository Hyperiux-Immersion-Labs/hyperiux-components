import { VaultLayout } from "@/components/layout/VaultLayout";
import Link from "next/link";
import ProCheckoutButton from "@/components/pricing/ProCheckoutButton";

const pricingFeatures = [
  "100+ premium interactive effects",
  "Copy-paste React and Next.js components",
  "Hyperiux CLI installation support",
  "Scroll effects, WebGL effects, loaders, navbars, buttons, text animations, sliders, and transitions",
  "New effects added continuously",
  "Priority access to upcoming component releases",
  "Commercial-friendly implementation structure",
  "Clean documentation and usage examples",
  "Designed for agencies, SaaS websites, portfolios, and premium landing pages",
];

const upcomingFeatures = [
  "More WebGL and shader-based effects",
  "Advanced page transition packs",
  "More navigation and mega menu systems",
  "Premium animation presets",
  "Additional CLI improvements",
];

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    eyebrow: "Flexible",
    price: "₹499",
    suffix: "/month",
    description:
      "Best if you want to try Pro access without a long commitment.",
    badge: null,
    buttonText: "Upgrade Monthly",
  },
  {
    id: "quarterly",
    name: "Quarterly",
    eyebrow: "Balanced",
    price: "₹1,299",
    suffix: "/quarter",
    description:
      "Best for teams actively building multiple pages or client projects.",
    badge: "Recommended",
    buttonText: "Upgrade Quarterly",
  },
  {
    id: "yearly",
    name: "Yearly",
    eyebrow: "Best Value",
    price: "₹4,999",
    suffix: "/year",
    description:
      "Best for agencies, founders, and developers who want long-term access.",
    badge: "Best Value",
    buttonText: "Upgrade Yearly",
  },
];

export default function PricingPage() {
  return (
    <VaultLayout>
      <main className="min-h-screen bg-black px-8 pt-32 pb-16 text-white max-sm:px-5">
        <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-white/60 backdrop-blur-md">
            Hyperiux Vault Pricing
          </p>

          <h1 className="max-w-4xl text-7xl font-normal leading-[0.95] tracking-[-0.06em] max-md:text-6xl max-sm:text-4xl">
            One vault. 100+ effects. Built to make websites feel expensive.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/55 max-sm:text-base max-sm:leading-7">
            Get access to a growing library of production-ready interactive
            components, motion systems, WebGL effects, loaders, navigation
            patterns, buttons, sliders, text animations, and upcoming premium
            releases.
          </p>
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl grid-cols-3 gap-6 max-lg:grid-cols-1">
          {plans.map((plan) => {
            const isHighlighted = plan.id === "quarterly";

            return (
              <div
                key={plan.id}
                className={`relative rounded-[2rem] border p-8 backdrop-blur-xl max-sm:rounded-[1.5rem] max-sm:p-6 ${
                  isHighlighted
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute right-6 top-6 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    {plan.badge}
                  </div>
                )}

                <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-primary">
                  {plan.eyebrow}
                </p>

                <h2 className="text-4xl font-normal tracking-[-0.04em]">
                  {plan.name}
                </h2>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-6xl font-normal leading-none tracking-[-0.06em] max-sm:text-5xl">
                    {plan.price}
                  </span>
                  <span className="pb-2 text-base text-white/45">
                    {plan.suffix}
                  </span>
                </div>

                <p className="mt-5 min-h-18 text-sm leading-6 text-white/55">
                  {plan.description}
                </p>

                <ProCheckoutButton
                  billingInterval={plan.id}
                  className={`mt-8 w-full rounded-full px-7 py-3 text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isHighlighted
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "bg-white text-black hover:bg-primary hover:text-white"
                  }`}
                >
                  {plan.buttonText}
                </ProCheckoutButton>
              </div>
            );
          })}
        </section>

        <section className="mx-auto mt-6 grid max-w-6xl grid-cols-[0.95fr_1.05fr] gap-6 max-lg:grid-cols-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl max-sm:rounded-[1.5rem] max-sm:p-6">
            <div className="flex items-start justify-between gap-6 max-sm:flex-col">
              <div>
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-primary">
                  Pro Access
                </p>

                <h2 className="text-4xl font-normal tracking-[-0.04em] max-sm:text-3xl">
                  Premium Component Library
                </h2>
              </div>

              <div className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Pro Tier
              </div>
            </div>

            <div className="mt-10">
              <p className="max-w-md text-base leading-7 text-white/50">
                Built for developers, agencies, founders, and creative teams who
                want premium interaction patterns without rebuilding every
                effect from scratch.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/effects"
                className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Explore Effects
              </Link>

              <Link
                href="/docs"
                className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                View Docs
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101010] p-8 max-sm:rounded-[1.5rem] max-sm:p-6">
            <div className="mb-7 flex items-center justify-between gap-6 border-b border-white/10 pb-6 max-sm:flex-col max-sm:items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  Included
                </p>
                <h3 className="mt-2 text-3xl font-normal tracking-[-0.04em] max-sm:text-2xl">
                  Everything you need to ship better interactions.
                </h3>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left">
                <p className="text-3xl font-medium leading-none">100+</p>
                <p className="mt-1 text-sm text-white/45">effects</p>
              </div>
            </div>

            <div className="grid gap-3">
              {pricingFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] text-white">
                    ✓
                  </span>
                  <p className="text-sm leading-6 text-white/70">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 grid max-w-6xl grid-cols-3 gap-6 max-lg:grid-cols-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 max-sm:rounded-[1.5rem]">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              CLI
            </p>
            <h3 className="mt-4 text-2xl font-normal tracking-[-0.03em]">
              Install effects faster.
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/50">
              Use the Hyperiux CLI to add effects directly into your project
              structure, then customize the code locally.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 max-sm:rounded-[1.5rem]">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Updates
            </p>
            <h3 className="mt-4 text-2xl font-normal tracking-[-0.03em]">
              More effects coming.
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/50">
              The library is designed to keep expanding with new animations,
              interaction systems, WebGL visuals, and production components.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 max-sm:rounded-[1.5rem]">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Priority
            </p>
            <h3 className="mt-4 text-2xl font-normal tracking-[-0.03em]">
              Early access to new drops.
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/50">
              Get priority access to upcoming effect packs, new component
              categories, and improvements as the vault grows.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 max-sm:rounded-[1.5rem] max-sm:p-6">
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-8 max-lg:grid-cols-1">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                Upcoming
              </p>
              <h3 className="mt-4 text-3xl font-normal tracking-[-0.04em] max-sm:text-2xl">
                The vault keeps getting heavier.
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/50">
                This is not a static UI kit. Hyperiux Vault is built as a
                growing interaction library for modern websites.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {upcomingFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-6 text-white/65"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </VaultLayout>
  );
}