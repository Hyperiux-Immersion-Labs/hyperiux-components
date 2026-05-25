import { Suspense } from"react";
import { getEffectsByCategory, getRegistryIndex } from"@/lib/registry";
import { VaultContent } from"./vault-content";

export const metadata = {
 title:"The Vault | Hyperiux UI",
 description:"Browse all available effects and animations",
};

function VaultFallback() {
 return (
 <div className="h-screen w-screen bg-black">
 </div>
 );
}

export default function EffectsPage() {
 const categories = getEffectsByCategory();
 const registry = getRegistryIndex();

 // Calculate effect counts per category
 const effectCounts = {};
 for (const [category, effects] of Object.entries(categories)) {
 effectCounts[category] = effects.length;
 }

 return (
 <Suspense fallback={<VaultFallback />}>
   
 <VaultContent
 effects={[...registry.items].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))}
 effectCounts={effectCounts}
 />
 
 </Suspense>
 );
}
