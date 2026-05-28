import { notFound } from"next/navigation";
import { getEffectConfig } from"@/lib/effect-configs";
import {
 getEffectCategory,
 getEffectCategoryBySlug,
 getEffectPrimaryCategory,
} from"@/lib/categories";
import { getEffectBySlug, getRegistryIndex } from"@/lib/registry";
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

 const config = getEffectConfig(effectSlug);

 return <FullscreenPreview slug={effectSlug} effect={effect} config={config} />;
}
