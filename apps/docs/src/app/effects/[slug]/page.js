import { Suspense } from"react";
import { notFound } from"next/navigation";
import { getEffectCategoryBySlug } from"@/lib/categories";
import { getEffectsByCategory, getRegistryIndex } from"@/lib/registry";
import { VaultContent } from"../vault-content";

function VaultFallback() {
 return (
 <div className="h-screen w-screen bg-black">
 </div>
 );
}

export async function generateStaticParams() {
 const slugs = new Set();

 for (const categorySlug of Object.keys(getEffectsByCategory())) {
 const category = getEffectCategoryBySlug(categorySlug);
 slugs.add(categorySlug);
 slugs.add(category?.slug || categorySlug);
 }

 return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
 const { slug } = await params;
 const category = getEffectCategoryBySlug(slug);

 if (category) {
 return {
 title: `${category.name} | Hyperiux UI`,
 description: `Browse ${category.name.toLowerCase()} in the Hyperiux UI vault`,
 };
 }

 return { title:"Category Not Found" };
}

export default async function EffectsCategoryPage({ params }) {
 const { slug } = await params;
 const category = getEffectCategoryBySlug(slug);
 const categoriesMap = getEffectsByCategory();

 // Get effect counts for sidebar
 const effectCounts = {};
 for (const [categoryId, effects] of Object.entries(categoriesMap)) {
 effectCounts[categoryId] = effects.length;
 }

 if (!category || !categoriesMap[category.id]) {
 notFound();
 }

 const registry = getRegistryIndex();

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
