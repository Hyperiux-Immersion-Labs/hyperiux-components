export const effectCategories = [
  { id: "all", name: "All Effects", slug: "all" },
  { id: "text", name: "Text Animations", slug: "text-effects" },
  { id: "backgrounds", name: "Backgrounds", slug: "backgrounds" },
  { id: "buttons", name: "Buttons", slug: "buttons" },
  { id: "scroll", name: "Scroll Animations", slug: "scroll-effects" },
  { id: "components", name: "Components", slug: "components" },
  { id: "navigation", name: "Navigation", slug: "navigation" },
  { id: "cursor", name: "Cursor Effects", slug: "cursor-effects" },
  { id: "transitions", name: "Page Transitions", slug: "page-transitions" },
  { id: "loaders", name: "Website Loaders", slug: "website-loaders" },
  { id: "webgl", name: "WebGL", slug: "webgl" },
  { id: "others", name: "Others", slug: "others" },
];

const categoriesById = new Map(effectCategories.map((category) => [category.id, category]));
const categoriesBySlug = new Map(effectCategories.map((category) => [category.slug, category]));

export function getEffectCategory(id) {
  return categoriesById.get(id) || null;
}

export function getEffectCategoryBySlug(slug) {
  return categoriesBySlug.get(slug) || categoriesById.get(slug) || null;
}

export function getEffectCategoryHref(id) {
  if (id === "all") return "/effects";

  const category = getEffectCategory(id);
  return `/effects/${category?.slug || id}`;
}
