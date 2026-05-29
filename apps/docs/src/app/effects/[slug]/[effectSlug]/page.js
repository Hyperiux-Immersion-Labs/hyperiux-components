import { notFound } from "next/navigation";
import { getEffectConfig } from "@/lib/effect-configs";
import {
  getEffectCategory,
  getEffectCategoryBySlug,
  getEffectPrimaryCategory,
} from "@/lib/categories";
import {
  getAllEffectSlugs,
  getEffectBySlug,
  getEffectCode,
  getEffectsByCategory,
  getRegistryIndex,
} from "@/lib/registry";
import { getEffectContent } from "@/lib/effect-content";
import { EffectDetailContent } from "../effect-detail";

function effectBelongsToCategory(effect, categoryId) {
  const categories = effect.categories?.length
    ? effect.categories
    : [effect.category || "others"];

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
  const content = getEffectContent(slug, effectSlug);

  if (!effect || !category || !effectBelongsToCategory(effect, category.id)) {
    return { title: "Effect Not Found" };
  }

  return {
    title: content?.seo?.title || `${effect.title} | Hyperiux Vault`,
    description: content?.seo?.description || effect.description,
    keywords: [
      content?.seo?.primaryKeyword,
      ...(content?.seo?.secondaryKeywords || []),
    ].filter(Boolean),
  };
}

export default async function EffectPage({ params }) {
  const { slug, effectSlug } = await params;

  const effect = getEffectBySlug(effectSlug);
  const category = getEffectCategoryBySlug(slug);

  if (!effect || !category || !effectBelongsToCategory(effect, category.id)) {
    notFound();
  }

  const categoriesMap = getEffectsByCategory();

  const effectCounts = {};
  for (const [categoryId, effects] of Object.entries(categoriesMap)) {
    effectCounts[categoryId] = effects.length;
  }

  const config = getEffectConfig(effectSlug);
  const code = getEffectCode(effectSlug);
  const content = getEffectContent(slug, effectSlug);

  const effectCats = effect.categories?.length
    ? effect.categories
    : [effect.category];

  const seen = new Set();

  const relatedEffects = effectCats
    .flatMap((cat) => categoriesMap[cat] || [])
    .filter((relatedEffect) => {
      if (relatedEffect.name === effectSlug || seen.has(relatedEffect.name)) {
        return false;
      }

      seen.add(relatedEffect.name);
      return true;
    })
    .slice(0, 3);

  return (
    <EffectDetailContent
      slug={effectSlug}
      categorySlug={slug}
      effect={effect}
      config={config}
      code={code}
      content={content}
      relatedEffects={relatedEffects}
      effectCounts={effectCounts}
      totalEffects={getAllEffectSlugs().length}
    />
  );
}