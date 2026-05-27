import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import TechDetailShowcase from "@/components/Tech/TechDetailShowcase";
import { getRegistryIndex, getEffectsByCategory, getAllEffectSlugs } from "@/lib/registry";
import { TECHNOLOGIES } from "@/components/Tech/tech-data";
import TechBackground from "@/components/Tech/TechBackground";

export async function generateStaticParams() {
  return TECHNOLOGIES.map((tech) => ({ slug: tech.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tech = TECHNOLOGIES.find((t) => t.slug === slug);
  if (!tech) return { title: "Technology Not Found | Hyperiux UI" };
  return {
    title: `${tech.title} | Hyperiux UI`,
    description: tech.description,
  };
}

export default async function TechDetailPage({ params }) {
  const { slug } = await params;
  const tech = TECHNOLOGIES.find((t) => t.slug === slug);

  if (!tech) {
    notFound();
  }

  const registry = getRegistryIndex();
  const categoriesMap = getEffectsByCategory();
  const allEffectSlugs = getAllEffectSlugs();

  // Populate sidebar counts
  const effectCounts = {};
  for (const [categoryId, effects] of Object.entries(categoriesMap)) {
    effectCounts[categoryId] = effects.length;
  }

  // Active filter for registry items based on technology
  const filteredEffects = registry.items.filter((item) => {
    switch (slug) {
      case "react":
        return true; // All components are React based
      case "nextjs":
        return (
          item.dependencies?.includes("next") ||
          item.dependencies?.includes("next-transition-router") ||
          item.previewUrl?.includes("page-transitions")
        );
      case "gsap":
        return item.dependencies?.includes("gsap");
      case "threejs":
        return item.dependencies?.includes("three");
      case "webgl":
        return (
          item.category === "webgl" ||
          item.dependencies?.includes("three") ||
          item.dependencies?.includes("@react-three/fiber")
        );
      case "lenis":
        return item.dependencies?.includes("lenis");
      default:
        return false;
    }
  });

  return (
    <VaultLayout
      effectCounts={effectCounts}
      totalEffects={allEffectSlugs.length}
      activeCategory={null}
      bgImageSrc="/assets/heroo-bg.png"
    >
      <TechBackground>
        {/* Sticky Header with Title */}
        <Suspense fallback={<div className="h-18" />}>
          <VaultHeader effectName={tech.name} showSearch={false} />
        </Suspense>

        {/* Dynamic technology content showcase split-layer */}
        <TechDetailShowcase
          slug={slug}
          tech={tech}
          filteredEffects={filteredEffects}
        />

        {/* Footer */}
        <footer className="relative overflow-hidden rounded-3xl border border-border/30 bg-zinc-950/40 backdrop-blur-md pt-10 pb-5 mb-8 px-12 max-sm:px-6 mt-20">
          <div className="relative z-10 flex flex-col items-center text-center max-sm:gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Hyperiux Immersion Labs</h2>
            <p className="text-sm text-zinc-500">Built using state of the art web engineering standards.</p>
            <p suppressHydrationWarning className="text-xs text-zinc-600 mt-6">© {new Date().getFullYear()} Hyperiux UI. All rights reserved.</p>
          </div>
        </footer>
      </TechBackground>
    </VaultLayout>
  );
}
