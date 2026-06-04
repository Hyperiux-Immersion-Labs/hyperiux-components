import { notFound } from"next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getEffectConfig } from"@/lib/effect-configs";
import {
 getEffectCategory,
 getEffectCategoryBySlug,
 getEffectPrimaryCategory,
} from"@/lib/categories";
import { getEffectBySlug, getRegistryIndex } from"@/lib/registry";
import { getUserPlan, canAccessEffect } from "@/lib/subscription";
import { FullscreenPreview } from"../../preview/fullscreen-preview";

function effectBelongsToCategory(effect, categoryId) {
 const categories = effect.categories?.length
 ? effect.categories
 : [effect.category ||"others"];

 return categories.includes(categoryId);
}

export async function generateStaticParams() {
 const registry = getRegistryIndex();

 return registry.items.map((effect) => {
 const categoryId = getEffectPrimaryCategory(effect);
 const category = getEffectCategory(categoryId);

 return {
 slug: category?.slug || categoryId,
 effectSlug: effect.name,
 };
 });
}

export async function generateMetadata({ params }) {
 const { slug, effectSlug } = await params;
 const effect = getEffectBySlug(effectSlug);
 const category = getEffectCategoryBySlug(slug);

 if (!effect || !category || !effectBelongsToCategory(effect, category.id)) {
 return { title:"Preview Not Found" };
 }

 return {
 title: `${effect.title} Preview | Hyperiux Vault`,
 description: `Live preview of ${effect.title}`,
 };
}

export default async function PreviewPage({ params }) {
 const { slug, effectSlug } = await params;
 const effect = getEffectBySlug(effectSlug);
 const category = getEffectCategoryBySlug(slug);

 if (!effect || !category || !effectBelongsToCategory(effect, category.id)) {
   notFound();
 }

 // Gate pro previews — return a minimal locked page so the iframe shows nothing
 const { userId } = await auth();
 const userPlan = await getUserPlan(userId);
 if (!canAccessEffect(effect.tier ?? "pro", userPlan)) {
   return (
     <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
       <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
       </svg>
       <p className="text-white/60 text-sm">Pro effect — subscribe to preview</p>
     </div>
   );
 }

 const config = getEffectConfig(effectSlug);

 return <FullscreenPreview slug={effectSlug} effect={effect} config={config} />;
}
