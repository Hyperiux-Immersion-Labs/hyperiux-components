import { Suspense } from"react";
import { notFound } from"next/navigation";
import { getEffectBySlug, getAllEffectSlugs, getEffectCode, getEffectsByCategory, getRegistryIndex } from"@/lib/registry";
import { getEffectConfig } from"@/lib/effect-configs";
import { getEffectCategoryBySlug } from"@/lib/categories";
import { EffectDetailContent } from"./effect-detail";
import { VaultContent } from"../vault-content";

function VaultFallback() {
 return (
 <div className="h-screen w-screen bg-black">
 </div>
 );
}

export async function generateStaticParams() {
 const slugs = new Set(getAllEffectSlugs());
 const categorySlugs = Object.keys(getEffectsByCategory());

 for (const categorySlug of categorySlugs) {
 const category = getEffectCategoryBySlug(categorySlug);
 slugs.add(categorySlug);
 slugs.add(category?.slug || categorySlug);
 }

 return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
 const { slug } = await params;
 const effect = getEffectBySlug(slug);
 const category = getEffectCategoryBySlug(slug);

 if (category) {
 return {
 title: `${category.name} | Hyperiux UI`,
 description: `Browse ${category.name.toLowerCase()} in the Hyperiux UI vault`,
 };
 }

 if (!effect) {
 return { title:"Effect Not Found" };
 }

 return {
 title: `${effect.title} | Hyperiux UI`,
 description: effect.description,
 };
}

export default async function EffectPage({ params }) {
 const { slug } = await params;
 const effect = getEffectBySlug(slug);
 const category = getEffectCategoryBySlug(slug);
 const categoriesMap = getEffectsByCategory();

 // Get effect counts for sidebar
 const effectCounts = {};
 for (const [categoryId, effects] of Object.entries(categoriesMap)) {
 effectCounts[categoryId] = effects.length;
 }

 if (category) {
 const categoryEffects = categoriesMap[category.id];
 const registry = getRegistryIndex();

 if (!categoryEffects) {
 notFound();
 }

 return (
 <Suspense fallback={<VaultFallback />}>
 <VaultContent
 effects={[...registry.items].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))}
 effectCounts={effectCounts}
 initialCategory={category.id}
 />
 </Suspense>
 );
 }

 if (!effect) {
 notFound();
 }

 const config = getEffectConfig(slug);
 const code = getEffectCode(slug);

 // Get related effects (any shared category, excluding current)
 const effectCats = effect.categories?.length ? effect.categories : [effect.category];
 const seen = new Set();
 const relatedEffects = effectCats
 .flatMap((cat) => categoriesMap[cat] || [])
 .filter((e) => {
 if (e.name === slug || seen.has(e.name)) return false;
 seen.add(e.name);
 return true;
 })
 .slice(0, 3);

 const totalEffects = getAllEffectSlugs().length;

 return (
    <>
 <EffectDetailContent
 slug={slug}
 effect={effect}
 config={config}
 code={code}
 relatedEffects={relatedEffects}
 effectCounts={effectCounts}
 totalEffects={totalEffects}
 />
  </>
 );
}
