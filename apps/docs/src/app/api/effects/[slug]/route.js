import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// The full registry lives on disk at build time — read directly from source,
// not from public/r/ (which has file contents stripped for pro effects).
const REGISTRY_SOURCE = path.join(process.cwd(), "../../../registry/effects");

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

  // Hash the token and look it up
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

  // Find the effect in the source registry
  const effectData = findEffectInSource(slug);
  if (!effectData) {
    return NextResponse.json({ error: `Effect "${slug}" not found.` }, { status: 404 });
  }

  return NextResponse.json(effectData);
}

function findEffectInSource(slug) {
  // Walk all category directories looking for a folder named `slug`
  if (!fs.existsSync(REGISTRY_SOURCE)) return null;

  const categories = fs.readdirSync(REGISTRY_SOURCE);
  for (const category of categories) {
    const categoryPath = path.join(REGISTRY_SOURCE, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const effectPath = path.join(categoryPath, slug);
    if (!fs.existsSync(effectPath) || !fs.statSync(effectPath).isDirectory()) continue;

    const registryJsonPath = path.join(effectPath, "registry.json");
    if (!fs.existsSync(registryJsonPath)) continue;

    const registryJson = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"));

    // Read all component files
    const files = fs
      .readdirSync(effectPath)
      .filter((f) => f.endsWith(".jsx") || f.endsWith(".js") || f.endsWith(".css"))
      .filter((f) => f !== "registry.json");

    const fileContents = files.map((fileName) => {
      const filePath = path.join(effectPath, fileName);
      const content = fs.readFileSync(filePath, "utf-8");
      const isCss = fileName.endsWith(".css");
      const isModuleCss = fileName.endsWith(".module.css");

      return {
        path: fileName,
        type: isCss ? "registry:style" : "registry:component",
        target: isCss
          ? isModuleCss
            ? `components/hyperiux/${fileName}`
            : `styles/${fileName}`
          : `components/hyperiux/${fileName}`,
        content,
      };
    });

    // Sort: entry file first, then helpers, then CSS
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
