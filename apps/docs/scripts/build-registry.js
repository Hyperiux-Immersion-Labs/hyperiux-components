import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, "../../../registry/effects");
const OUTPUT_PATH = path.join(__dirname, "../public/r");
const PUBLIC_PATH = path.join(__dirname, "../public");

function resolveCoverImage(effectName, explicitCoverImage) {
  const normalize = (p) => (typeof p === "string" ? p.trim() : "");
  const existsInPublic = (publicUrlPath) => {
    const p = normalize(publicUrlPath);
    if (!p.startsWith("/")) return false;
    return fs.existsSync(path.join(PUBLIC_PATH, p.slice(1)));
  };

  const explicit = normalize(explicitCoverImage);
  if (explicit && existsInPublic(explicit)) return explicit;

  const defaultList = `/assets/list/${effectName}.png`;
  if (existsInPublic(defaultList)) return defaultList;

  // Guaranteed local fallback so cards never render empty.
  return "/assets/img/image01.webp";
}

// Controls the order categories appear in the listing.
// Categories not listed here will appear at the end alphabetically.
const CATEGORY_ORDER = [
  "scroll",
  "cursor",
  "backgrounds",
  "transitions",
  "text",
  "buttons",
  "carousels",
  "components",
  "navigation",
  "loaders",
  "webgl",
  "others",
];

async function buildRegistry() {
  console.log("Building registry...");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  const index = {
    items: [],
  };

  // Walk through registry directories, sorted by CATEGORY_ORDER
  const allCategories = fs.readdirSync(REGISTRY_PATH);
  const categories = [
    ...CATEGORY_ORDER.filter((c) => allCategories.includes(c)),
    ...allCategories
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort(),
  ];

  for (const category of categories) {
    const categoryPath = path.join(REGISTRY_PATH, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Sort effects within category by optional `order` field in registry.json (ascending), then alphabetically
    const effectDirs = fs.readdirSync(categoryPath);
    const effects = effectDirs.sort((a, b) => {
      const aJson = path.join(categoryPath, a, "registry.json");
      const bJson = path.join(categoryPath, b, "registry.json");
      const aOrder = fs.existsSync(aJson)
        ? (JSON.parse(fs.readFileSync(aJson, "utf-8")).order ?? 99)
        : 99;
      const bOrder = fs.existsSync(bJson)
        ? (JSON.parse(fs.readFileSync(bJson, "utf-8")).order ?? 99)
        : 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });

    for (const effect of effects) {
      const effectPath = path.join(categoryPath, effect);
      if (!fs.statSync(effectPath).isDirectory()) continue;

      const registryJsonPath = path.join(effectPath, "registry.json");
      if (!fs.existsSync(registryJsonPath)) {
        console.warn(`No registry.json found for ${effect}, skipping...`);
        continue;
      }

      // Read registry metadata
      const registryJson = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"));

      // Find component files (JS/JSX and CSS)
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

      // Entry component first: effect detail "Component Code" and CLI import hint use files[0].
      const entryBase = registryJson.name;
      fileContents.sort((a, b) => {
        const tier = (entry) => {
          if (entry.path === `${entryBase}.jsx` || entry.path === `${entryBase}.js`) return 0;
          if (entry.path.endsWith(".css")) return 2;
          if (entry.path.endsWith(".jsx") || entry.path.endsWith(".js")) return 1;
          return 1;
        };
        const d = tier(a) - tier(b);
        if (d !== 0) return d;
        return a.path.localeCompare(b.path);
      });

      // Resolve categories: support both legacy `category` string and new `categories` array
      const primaryCategory = registryJson.category || category;
      const categories_list = registryJson.categories
        ? registryJson.categories
        : [primaryCategory];

      // Build the full registry item
      const defaultVideoUrl = `${registryJson.name}.mp4`;
      const resolvedVideoUrl =
        registryJson.videoUrl === null ? null : registryJson.videoUrl || defaultVideoUrl;
      const resolvedCoverImage = resolveCoverImage(
        registryJson.name,
        registryJson.coverImage
      );
      const effectTier = registryJson.tier === "free" ? "free" : "pro";

      // Pro effect files have their content stripped from the public registry.
      // The actual source is served by the protected API route /api/effects/[slug].
      const publicFiles = effectTier === "pro"
        ? fileContents.map(({ content: _content, ...rest }) => rest)
        : fileContents;

      const registryItem = {
        name: registryJson.name,
        type: registryJson.type || "registry:component",
        title: registryJson.title,
        description: registryJson.description,
        category: primaryCategory,
        categories: categories_list,
        tier: effectTier,
        dependencies: registryJson.dependencies || [],
        registryDependencies: registryJson.registryDependencies || [],
        previewUrl: registryJson.previewUrl || null,
        coverImage: resolvedCoverImage,
        videoUrl: resolvedVideoUrl,
        files: publicFiles,
      };

      // Write individual effect JSON
      const outputFile = path.join(OUTPUT_PATH, `${registryJson.name}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(registryItem, null, 2));
      console.log(`  Created ${registryJson.name}.json`);

      // Add to index — record mtime so the vault can sort by recently added
      const addedAt = fs.statSync(registryJsonPath).mtimeMs;
      index.items.push({
        name: registryJson.name,
        title: registryJson.title,
        description: registryJson.description,
        category: primaryCategory,
        categories: categories_list,
        tier: effectTier,
        dependencies: registryJson.dependencies || [],
        previewUrl: registryJson.previewUrl || null,
        coverImage: resolvedCoverImage,
        videoUrl: resolvedVideoUrl,
        addedAt,
      });
    }
  }

  // Write index
  const indexFile = path.join(OUTPUT_PATH, "index.json");
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  console.log("  Created index.json");

  console.log(`\nRegistry built successfully! ${index.items.length} effects.`);
}

buildRegistry().catch(console.error);
