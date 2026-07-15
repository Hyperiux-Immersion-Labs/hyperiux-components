import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { fetchRegistryAsset } from "./registry.js";

/**
 * Shared by `add` and `update` — writes a registry item's files to disk and
 * returns exactly what was written (targetPath -> content), so the caller
 * can hash it into the lockfile. Keeping this in one place means both
 * commands stay in sync on path safety, Next/Image patching, and the shared
 * HyperiuxImage helper.
 */
export async function writeInstallableFiles(files, { cwd, config, overwriteHelper = false }) {
  const written = {};
  let shouldWriteHyperiuxImageHelper = false;

  for (const file of files) {
    const targetPath = path.resolve(cwd, file.targetPath);

    if (!isSafeTargetPath(cwd, targetPath)) {
      throw new Error(
        `Unsafe file path detected and blocked: "${file.targetPath}"`
      );
    }

    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let content = await getFileContent(file);

    if (typeof content === "string") {
      const patchedContent = patchNextImageImport(content, config);

      if (patchedContent !== content) {
        content = patchedContent;
        shouldWriteHyperiuxImageHelper = true;
      }
    }

    fs.writeFileSync(targetPath, content);
    written[file.targetPath] = content;
  }

  if (shouldWriteHyperiuxImageHelper) {
    const helperTargetPath = getHyperiuxImageHelperTargetPath(cwd, config);
    const helperAbsolutePath = path.resolve(cwd, helperTargetPath);

    // Shared utility, not a per-effect file — only create/overwrite it if
    // it doesn't already exist (or the caller explicitly asked to
    // overwrite), so re-running add/update for an unrelated effect never
    // clobbers any customization made to it.
    if (overwriteHelper || !fs.existsSync(helperAbsolutePath)) {
      const helperContent = getHyperiuxImageHelperContent();

      writeHyperiuxImageHelper(cwd, config, helperContent);
      written[helperTargetPath] = helperContent;
    }
  }

  return { written, shouldWriteHyperiuxImageHelper };
}

export async function getFileContent(file) {
  if (file.type === "registry:asset" && file.source && !file.content) {
    return fetchRegistryAsset(file.source);
  }

  if (file.encoding === "base64") {
    return Buffer.from(file.content, "base64");
  }

  return file.content || "";
}

export function hasNextImageImport(content) {
  return /import\s+Image\s+from\s+["']next\/image["'];?/g.test(content);
}

export function patchNextImageImport(content, config) {
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  const helperImportPath = `${effectsAlias}/_hyperiux/HyperiuxImage`;

  return content.replace(
    /import\s+Image\s+from\s+["']next\/image["'];?/g,
    `import Image from "${helperImportPath}";`
  );
}

export function writeHyperiuxImageHelper(cwd, config, content) {
  const helperTargetPath = getHyperiuxImageHelperTargetPath(cwd, config);
  const helperAbsolutePath = path.resolve(cwd, helperTargetPath);

  if (!isSafeTargetPath(cwd, helperAbsolutePath)) {
    throw new Error(
      `Unsafe helper path detected and blocked: "${helperTargetPath}"`
    );
  }

  const helperDir = path.dirname(helperAbsolutePath);

  if (!fs.existsSync(helperDir)) {
    fs.mkdirSync(helperDir, { recursive: true });
  }

  fs.writeFileSync(helperAbsolutePath, content ?? getHyperiuxImageHelperContent());
}

export function getHyperiuxImageHelperTargetPath(cwd, config) {
  const effectsAlias = config.aliases?.effects || "@/components/effects";

  let effectsPath = effectsAlias.replace("@/", "");

  if (fs.existsSync(path.join(cwd, "src")) && !effectsPath.startsWith("src/")) {
    effectsPath = `src/${effectsPath}`;
  }

  return normalizePath(path.join(effectsPath, "_hyperiux", "HyperiuxImage.jsx"));
}

export function getHyperiuxImageHelperContent() {
  return `"use client";

import NextImage from "next/image";

const isRemoteImage = (src) => {
  return typeof src === "string" && /^https?:\\/\\//.test(src);
};

export default function HyperiuxImage({
  src,
  alt = "",
  unoptimized,
  ...props
}) {
  return (
    <NextImage
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? isRemoteImage(src)}
      {...props}
    />
  );
}

export { HyperiuxImage };
`;
}

export function isSafeTargetPath(cwd, targetPath) {
  const root = path.resolve(cwd);

  return targetPath === root || targetPath.startsWith(root + path.sep);
}

export function normalizePath(value) {
  return value.replaceAll("\\", "/");
}
