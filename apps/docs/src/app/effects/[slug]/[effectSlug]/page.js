import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
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
import { getUserPlan, canAccessEffect } from "@/lib/subscription";
import { EffectDetailContent } from "../effect-detail";

function effectBelongsToCategory(effect, categoryId) {
  const categories = effect.categories?.length
    ? effect.categories
    : [effect.category || "others"];

  return categories.includes(categoryId);
}

function normalize(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
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
    return {
      title: "Effect Not Found",
    };
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

  // Determine access: check Clerk session and subscription plan
  const { userId } = await auth();
  const userPlan = await getUserPlan(userId);
  const isLocked = !canAccessEffect(effect.tier ?? "pro", userPlan);

  const registry = getRegistryIndex();

  const categoriesMap = getEffectsByCategory();

  const effectCounts = {};

  for (const [categoryId, effects] of Object.entries(categoriesMap)) {
    effectCounts[categoryId] = effects.length;
  }

  const config = getEffectConfig(effectSlug);

  const code = getEffectCode(effectSlug);

  const content = getEffectContent(slug, effectSlug);

  /*
    ----------------------------------------
    RELATED EFFECTS FROM DATA
    ----------------------------------------
  */

  const relatedEffectNames = content?.relatedEffectNames || [];

  const relatedEffects = relatedEffectNames
    .map((relatedName) => {
      const normalizedRelatedName = normalize(relatedName);

      return registry.items.find((item) => {
        const normalizedTitle = normalize(item.title);

        const normalizedName = normalize(item.name);

        const normalizedSlug = normalize(item.slug);

        return (
          normalizedTitle === normalizedRelatedName ||
          normalizedName === normalizedRelatedName ||
          normalizedSlug === normalizedRelatedName
        );
      });
    })
    .filter(Boolean)
    .filter((item) => item.name !== effectSlug)
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
      isLocked={isLocked}
      userPlan={userPlan}
    />
  );
}