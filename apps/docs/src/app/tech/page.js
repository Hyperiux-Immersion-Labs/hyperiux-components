import { Suspense } from "react";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { getRegistryIndex, getEffectsByCategory, getAllEffectSlugs } from "@/lib/registry";
import { TECHNOLOGIES, getCountForTech } from "@/components/Tech/tech-data";
import TechHeader from "@/components/Tech/TechHeader";
import TechCard from "@/components/Tech/TechCard";
import TechBackground from "@/components/Tech/TechBackground";

export default async function TechOverviewPage() {
  const registry = getRegistryIndex();
  const categoriesMap = getEffectsByCategory();
  const allEffectSlugs = getAllEffectSlugs();

  // Populate sidebar counts
  const effectCounts = {};
  for (const [categoryId, effects] of Object.entries(categoriesMap)) {
    effectCounts[categoryId] = effects.length;
  }

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
          <VaultHeader effectName="Technologies" showSearch={false} />
        </Suspense>

        {/* Hero Section */}
        <div className="mx-auto px-8 pt-28 pb-10 max-sm:px-0">
          <TechHeader />

          {/* Cards Grid showing 6 selected technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TECHNOLOGIES.map((tech) => {
              const count = getCountForTech(tech.slug, registry.items);
              return (
                <TechCard
                  key={tech.slug}
                  tech={tech}
                  count={count}
                />
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative overflow-hidden rounded-3xl border border-border/30 bg-zinc-950/40 backdrop-blur-md pt-10 pb-5 mb-8 px-12 max-sm:px-6">
          <div className="relative z-10 flex flex-col items-center text-center max-sm:gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Hyperiux Immersion Labs</h2>
            <p className="text-sm text-zinc-500">Optimized creative engineering for elite web developers.</p>
            <p suppressHydrationWarning className="text-xs text-zinc-600 mt-6">© {new Date().getFullYear()} Hyperiux UI. All rights reserved.</p>
          </div>
        </footer>
      </TechBackground>
    </VaultLayout>
  );
}
