import { Suspense } from"react";
import { getEffectsByCategory, getRegistryIndex } from"@/lib/registry";
import { VaultContent } from"./vault-content";
import { getUserPlan } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
 title:"The Vault | Hyperiux Vault",
 description:"Browse all available effects and animations",
};

function VaultFallback() {
 return (
 <div className="h-screen w-screen bg-black">
 </div>
 );
}

export default async function EffectsPage() {
 const categories = getEffectsByCategory();
 const registry = getRegistryIndex();

 // Calculate effect counts per category
 const effectCounts = {};
 for (const [category, effects] of Object.entries(categories)) {
 effectCounts[category] = effects.length;

 }
const { userId } = await auth();
 const userPlan = await getUserPlan(userId);
 return (
 <Suspense fallback={<VaultFallback />}>
   
 <VaultContent
 effects={[...registry.items].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))}
 effectCounts={effectCounts}
  userPlan={userPlan}
 />
 
 </Suspense>
 );
}
