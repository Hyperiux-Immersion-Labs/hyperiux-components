// Sanity CMS integration — currently a scaffold.
// effect-content.js serves content from a static JS object today.
// When Sanity is set up, replace getEffectContent() with getSanityEffectContent() below
// and remove effect-content.js.
//
// Required env vars (add to Vercel + .env.local):
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET   (usually "production")
//   SANITY_API_TOKEN             (read-only token, server only)
//
// Install when ready:
//   pnpm add @sanity/client next-sanity

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";

export function isSanityConfigured() {
  return Boolean(PROJECT_ID);
}

// Returns a Sanity client instance. Call only on the server (API routes, Server Components).
// Throws if env vars are not set.
export function getSanityClient() {
  if (!PROJECT_ID) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
  }

  // Lazy import so the package is optional until actually used.
  // Replace with a top-level import once @sanity/client is installed.
  const { createClient } = require("@sanity/client");

  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
  });
}

// Fetches all effect content documents from Sanity.
// Expected Sanity document type: "effectContent"
// Fields: slug (string), h1, shortDescription, heroCopy[], bestUsedFor[],
//         tutorial[], customizationOptions[], notes{}, commonMistakes[],
//         faq[], finalCta{}, seo{}, relatedEffectNames[]
export async function getSanityEffectContent(categorySlug, effectSlug) {
  const client = getSanityClient();

  const query = `*[_type == "effectContent" && effectSlug == $effectSlug][0]`;
  const params = { effectSlug };

  const doc = await client.fetch(query, params);
  if (!doc) return null;

  return doc;
}

// Fetches all effect slugs from Sanity (for static generation).
export async function getAllSanityEffectSlugs() {
  const client = getSanityClient();
  return client.fetch(`*[_type == "effectContent"].effectSlug`);
}

// ── Sanity Schema reference ────────────────────────────────────────────────
//
// When you set up Sanity Studio, create a document type "effectContent" with:
//
// {
//   name: "effectContent",
//   type: "document",
//   fields: [
//     { name: "effectSlug", type: "slug" },          // matches registry effect name
//     { name: "h1", type: "string" },
//     { name: "shortDescription", type: "text" },
//     { name: "heroCopy", type: "array", of: [{ type: "text" }] },
//     { name: "bestUsedFor", type: "array", of: [{ type: "string" }] },
//     { name: "tutorial", type: "array", of: [{ type: "tutorialStep" }] },
//     { name: "customizationOptions", type: "array", of: [{ type: "customizationOption" }] },
//     { name: "notes", type: "notes" },
//     { name: "commonMistakes", type: "array", of: [{ type: "string" }] },
//     { name: "faq", type: "array", of: [{ type: "faqItem" }] },
//     { name: "finalCta", type: "finalCta" },
//     { name: "relatedEffectNames", type: "array", of: [{ type: "string" }] },
//     { name: "seo", type: "seo" },
//   ]
// }
//
// Migration path:
// 1. Install @sanity/client and next-sanity
// 2. Set env vars
// 3. Create Sanity Studio project, define schema above
// 4. Migrate content from effect-content.js into Sanity documents
// 5. In effect-detail page, replace getEffectContent() with getSanityEffectContent()
// 6. Delete effect-content.js
