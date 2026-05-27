import React from "react";
import { getEffectsByCategory, getRegistryIndex } from "@/lib/registry";
import { VaultLayout } from "@/components/layout/VaultLayout";
import DocsBody from "./DocsBody";
import { VaultHeader } from "@/components/layout/VaultHeader";

export default function Layout({ children }) {
  const categories = getEffectsByCategory();
  const registry = getRegistryIndex();

  const effectCounts = {};
  for (const [category, effects] of Object.entries(categories)) {
    effectCounts[category] = effects.length;
  }

  const totalEffects = registry?.items?.length ?? 0;

  return (
    <VaultLayout effectCounts={effectCounts} totalEffects={totalEffects} >
      <div className="min-h-screen bg-black text-foreground px-15 max-sm:px-6">
      <VaultHeader showSearch totalEffects={totalEffects} effects={registry?.items || []} />
      <DocsBody>{children}</DocsBody>
      </div>
    </VaultLayout>
  );
}
