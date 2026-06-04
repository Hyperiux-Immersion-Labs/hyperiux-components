import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, "../../../registry/effects");
const OUTPUT_PATH = path.join(__dirname, "../public/r");
const PUBLIC_PATH = path.join(__dirname, "../public");
const PUBLIC_ASSET_REGEX =
  /(?<![\w])["'`]((?:\/(?:assets|models|valley|601|svgs|img)\/[^"'`)\s]+)|(?:\/(?:showreel|eye-loop|hyperiux-wordmark|hyperiux)\.(?:mp4|svg)))["'`]/g;

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

function ensureMp4Extension(videoUrl, fallbackName) {
  if (videoUrl === null) return null;

  const rawValue =
    typeof videoUrl === "string" && videoUrl.trim()
      ? videoUrl.trim()
      : `${fallbackName}.mp4`;

  const [pathname, suffix = ""] = rawValue.split(/([?#].*)/, 2);
  if (pathname.toLowerCase().endsWith(".mp4")) {
    return `${pathname}${suffix}`;
  }

  return `${pathname}.mp4${suffix}`;
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

function toPascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function detectExport(content, preferredName) {
  const namedExportRegex = /export\s+(?:function|const|class)\s+([A-Za-z_$][\w$]*)/g;
  const namedExports = [...content.matchAll(namedExportRegex)].map((match) => match[1]);

  if (namedExports.length > 0) {
    return {
      exportName: namedExports.includes(preferredName) ? preferredName : namedExports[0],
      exportKind: "named",
    };
  }

  const defaultNamed = content.match(
    /export\s+default\s+(?:function|class)\s+([A-Za-z_$][\w$]*)/
  );
  if (defaultNamed) {
    return {
      exportName: defaultNamed[1],
      exportKind: "default",
    };
  }

  if (/export\s+default\b/.test(content)) {
    return {
      exportName: preferredName,
      exportKind: "default",
    };
  }

  const exportList = content.match(/export\s*\{([^}]+)\}/);
  if (exportList) {
    const exportedNames = exportList[1]
      .split(",")
      .map((entry) => entry.trim().split(/\s+as\s+/).pop()?.trim())
      .filter(Boolean);

    if (exportedNames.length > 0) {
      return {
        exportName: exportedNames.includes(preferredName)
          ? preferredName
          : exportedNames[0],
        exportKind: "named",
      };
    }
  }

  return null;
}

function collectPublicAssets(fileContents) {
  const seen = new Set();
  const assets = [];

  for (const file of fileContents) {
    for (const match of file.content.matchAll(PUBLIC_ASSET_REGEX)) {
      const publicPath = match[1].split(/[?#]/)[0];
      if (seen.has(publicPath)) continue;
      seen.add(publicPath);

      const sourcePath = path.join(PUBLIC_PATH, publicPath.slice(1));
      if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) continue;

      assets.push({
        path: publicPath.slice(1),
        type: "registry:asset",
        target: `public/${publicPath.slice(1)}`,
        source: publicPath,
      });
    }
  }

  return assets;
}

async function buildRegistry() {
  console.log("Building registry...");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  for (const fileName of fs.readdirSync(OUTPUT_PATH)) {
    if (fileName.endsWith(".json")) {
      fs.rmSync(path.join(OUTPUT_PATH, fileName));
    }
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
      const preferredExportName = registryJson.exportName || toPascalCase(registryJson.name);
      fileContents.sort((a, b) => {
        const score = (entry) => {
          if (registryJson.entry && entry.path === registryJson.entry) return -100;
          if (entry.path === `${entryBase}.jsx` || entry.path === `${entryBase}.js`) return -90;
          if (entry.path === `${effect}.jsx` || entry.path === `${effect}.js`) return -80;
          if (entry.path.endsWith(".css")) return 100;

          const baseName = entry.path.replace(/\.(jsx|js|css)$/, "");
          const nameParts = new Set(entryBase.split("-").filter(Boolean));
          const overlap = baseName
            .split("-")
            .filter((part) => nameParts.has(part)).length;
          const hasExport = detectExport(entry.content, preferredExportName) ? 0 : 20;

          return hasExport - overlap;
        };
        const d = score(a) - score(b);
        if (d !== 0) return d;
        return a.path.localeCompare(b.path);
      });

      const entryFile = fileContents.find((file) => file.type === "registry:component");
      const exportInfo = entryFile
        ? detectExport(entryFile.content, preferredExportName)
        : null;
      const exportName = registryJson.exportName || exportInfo?.exportName;
      const exportKind = registryJson.exportKind || exportInfo?.exportKind;

      if (!exportName || !exportKind) {
        throw new Error(
          `Unable to detect public export for ${registryJson.name}. Add exportName/exportKind to ${registryJsonPath}.`
        );
      }

      const assetFiles = collectPublicAssets(fileContents);

      // Resolve categories: support both legacy `category` string and new `categories` array
      const primaryCategory = registryJson.category || category;
      const categories_list = registryJson.categories
        ? registryJson.categories
        : [primaryCategory];

      // Build the full registry item
      const resolvedVideoUrl = ensureMp4Extension(
        registryJson.videoUrl,
        registryJson.name
      );
      const resolvedCoverImage = resolveCoverImage(
        registryJson.name,
        registryJson.coverImage
      );
      const registryItem = {
        name: registryJson.name,
        type: registryJson.type || "registry:component",
        title: registryJson.title,
        description: registryJson.description,
        category: primaryCategory,
        categories: categories_list,
        dependencies: registryJson.dependencies || [],
        registryDependencies: registryJson.registryDependencies || [],
        exportName,
        exportKind,
        previewUrl: registryJson.previewUrl || null,
        coverImage: resolvedCoverImage,
        videoUrl: resolvedVideoUrl,
        files: [...fileContents, ...assetFiles],
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
        dependencies: registryJson.dependencies || [],
        exportName,
        exportKind,
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
