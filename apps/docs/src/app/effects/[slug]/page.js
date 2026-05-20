import { notFound } from"next/navigation";
import { getEffectBySlug, getAllEffectSlugs, getEffectCode, getEffectsByCategory } from"@/lib/registry";
import { getEffectConfig } from"@/lib/effect-configs";
import { EffectDetailContent } from"./effect-detail";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";

export async function generateStaticParams() {
 const slugs = getAllEffectSlugs();
 return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
 const { slug } = await params;
 const effect = getEffectBySlug(slug);

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

 if (!effect) {
 notFound();
 }

 const config = getEffectConfig(slug);
 const code = getEffectCode(slug);

 // Get related effects (any shared category, excluding current)
 const categoriesMap = getEffectsByCategory();
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

 // Get effect counts for sidebar
 const effectCounts = {};
 for (const [category, effects] of Object.entries(categoriesMap)) {
 effectCounts[category] = effects.length;
 }
 const totalEffects = getAllEffectSlugs().length;

 return (
    <>
   <LenisSmoothScroll />
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
