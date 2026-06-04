import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_PRO_REPO_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_PRO_REPO_OWNER || "Hyperiux-Immersion-Labs";
const GITHUB_REPO = process.env.GITHUB_PRO_REPO_NAME || "hyperiux-pro-components";
const GITHUB_BRANCH = process.env.GITHUB_PRO_REPO_BRANCH || "master";

// GET /api/effects/[slug]
// Returns the full registry JSON including file contents for a pro effect.
// Requires a valid CLI token in the Authorization: Bearer <token> header.
export async function GET(req, { params }) {
  const { slug } = await params;

  // Extract Bearer token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token) {
    return NextResponse.json({ error: "Authorization token required." }, { status: 401 });
  }

  // Hash the token and look it up in Supabase
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("cli_token_hash", tokenHash)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  if (data.status !== "active" || data.plan !== "pro") {
    return NextResponse.json({ error: "Pro subscription required." }, { status: 403 });
  }

  if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
    return NextResponse.json({ error: "Subscription has expired." }, { status: 403 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  // Fetch the effect from the private GitHub repo
  const effectData = await fetchEffectFromGitHub(slug);
  if (!effectData) {
    return NextResponse.json({ error: `Effect "${slug}" not found.` }, { status: 404 });
  }

  return NextResponse.json(effectData);
}

async function githubFetch(apiPath) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${apiPath}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 300 }, // cache GitHub responses for 5 min
  });

  if (!res.ok) return null;
  return res.json();
}

async function getFileContent(path) {
  const data = await githubFetch(`contents/${path}?ref=${GITHUB_BRANCH}`);
  if (!data || !data.content) return null;
  // GitHub returns base64-encoded content
  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function fetchEffectFromGitHub(slug) {
  // The private repo mirrors the same structure: registry/effects/<category>/<name>/
  // First fetch the registry.json to find which category the effect is in
  // We do this by listing all category directories
  const categoriesData = await githubFetch(`contents/registry/effects?ref=${GITHUB_BRANCH}`);
  if (!categoriesData || !Array.isArray(categoriesData)) return null;

  for (const categoryEntry of categoriesData) {
    if (categoryEntry.type !== "dir") continue;

    const category = categoryEntry.name;
    const effectDirPath = `registry/effects/${category}/${slug}`;

    // Check if this effect exists in this category
    const registryJsonContent = await getFileContent(`${effectDirPath}/registry.json`);
    if (!registryJsonContent) continue;

    let registryJson;
    try {
      registryJson = JSON.parse(registryJsonContent);
    } catch {
      continue;
    }

    // List all files in the effect directory
    const effectDirData = await githubFetch(`contents/${effectDirPath}?ref=${GITHUB_BRANCH}`);
    if (!effectDirData || !Array.isArray(effectDirData)) continue;

    const componentFiles = effectDirData.filter(
      (f) =>
        f.type === "file" &&
        f.name !== "registry.json" &&
        (f.name.endsWith(".jsx") || f.name.endsWith(".js") || f.name.endsWith(".css"))
    );

    // Fetch all file contents in parallel
    const fileContents = await Promise.all(
      componentFiles.map(async (file) => {
        const content = await getFileContent(`${effectDirPath}/${file.name}`);
        const isCss = file.name.endsWith(".css");
        const isModuleCss = file.name.endsWith(".module.css");

        return {
          path: file.name,
          type: isCss ? "registry:style" : "registry:component",
          target: isCss
            ? isModuleCss
              ? `components/hyperiux/${file.name}`
              : `styles/${file.name}`
            : `components/hyperiux/${file.name}`,
          content: content || "",
        };
      })
    );

    // Sort: entry file first, helpers, then CSS
    const entryBase = registryJson.name;
    fileContents.sort((a, b) => {
      const tier = (entry) => {
        if (entry.path === `${entryBase}.jsx` || entry.path === `${entryBase}.js`) return 0;
        if (entry.path.endsWith(".css")) return 2;
        return 1;
      };
      const d = tier(a) - tier(b);
      return d !== 0 ? d : a.path.localeCompare(b.path);
    });

    const primaryCategory = registryJson.category || category;
    const categories_list = registryJson.categories ?? [primaryCategory];

    return {
      name: registryJson.name,
      type: registryJson.type || "registry:component",
      title: registryJson.title,
      description: registryJson.description,
      category: primaryCategory,
      categories: categories_list,
      tier: registryJson.tier ?? "pro",
      dependencies: registryJson.dependencies || [],
      registryDependencies: registryJson.registryDependencies || [],
      previewUrl: registryJson.previewUrl || null,
      files: fileContents,
    };
  }

  return null;
}
