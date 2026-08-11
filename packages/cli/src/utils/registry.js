/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "url";
import { Buffer } from "buffer";
import { detectProjectLanguage } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://vault.hyperiux.com/r";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

const API_URL = process.env.HYPERIUX_API_URL || APP_URL;

const LOCAL_REGISTRY_PATH = "public/r";

// Path to local registry in the monorepo for development
const DEV_REGISTRY_PATH = path.join(
  __dirname,
  "../../../../apps/docs/public/r",
);

function isProEffect(item) {
  const tier = item?.tier || "free";

  return tier === "pro" || tier === "paid";
}

function getRegistryTier(item) {
  return isProEffect(item) ? "pro" : "free";
}

function createRegistryError(message, options = {}) {
  const error = new Error(message);

  error.status = options.status;
  error.requiresPro = Boolean(options.requiresPro);

  return error;
}

async function parseJsonResponse(response) {
  return response.json().catch(() => null);
}

/**
 * Main registry fetcher used by `hyperiux add <effect>`.
 *
 * Flow:
 * 1. Fetch the public registry JSON to check tier.
 * 2. If free → return it directly (files included in public JSON).
 * 3. If pro → go through the protected API with the CLI token.
 */
export async function fetchRegistry(name, options = {}) {
  const { local = false, cwd = process.cwd(), token = null } = options;

  if (local) {
    return fetchLocalRegistry(name, cwd, token);
  }

  // First, check what tier this effect is via the public registry index.
  const publicData = await fetchPublicEffect(name);

  if (!isProEffect(publicData)) {
    return publicData;
  }

  // Pro effect — go through the authenticated API.
  return fetchProtectedEffect(name, token);
}

async function fetchPublicEffect(name) {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/${name}.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(`Could not reach Hyperiux registry: ${error.message}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw createRegistryError(`Effect "${name}" not found. Run \`hyperiux list\` to see available effects.`, { status: 404 });
    }
    throw createRegistryError(`Failed to fetch effect: ${response.statusText}`, { status: response.status });
  }

  const data = await parseJsonResponse(response);

  if (!data) {
    throw createRegistryError(`Invalid registry response for "${name}"`);
  }

  return data;
}

async function fetchLocalRegistry(name, cwd, token) {
  const registryPath = path.join(cwd, LOCAL_REGISTRY_PATH, `${name}.json`);

  if (!fs.existsSync(registryPath)) {
    throw createRegistryError(`Effect "${name}" not found in local registry`, {
      status: 404,
    });
  }

  const content = fs.readFileSync(registryPath, "utf-8");
  const meta = JSON.parse(content);

  /**
   * If the local registry item is Pro, still enforce token access.
   */
  if (isProEffect(meta)) {
    return fetchProtectedEffect(name, token);
  }

  return meta;
}

async function fetchProtectedEffect(name, token) {
  const url = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] API URL:", url);
    console.log("[Hyperiux CLI] Token found:", Boolean(token));
  }

  let response;

  try {
    response = await fetch(url, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
  } catch (error) {
    throw createRegistryError(`Could not reach Hyperiux API: ${error.message}`);
  }

  const data = await parseJsonResponse(response);

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] Response status:", response.status);
    console.log("[Hyperiux CLI] Response body:", data);
  }

  if (!response.ok) {
    throw createRegistryError(
      data?.error || `Failed to fetch Pro effect: ${response.statusText}`,
      {
        status: response.status,
        requiresPro: Boolean(data?.requiresPro),
      }
    );
  }

  if (!data) {
    throw createRegistryError(`Invalid protected registry response for "${name}"`);
  }

  validateRegistryPayload(name, data);

  return data;
}

function validateRegistryPayload(name, data) {
  if (typeof data !== "object" || data === null) {
    throw createRegistryError(`Registry payload for "${name}" is not an object`);
  }

  if (typeof data.name !== "string" || !data.name) {
    throw createRegistryError(`Registry payload for "${name}" is missing "name"`);
  }

  if (!Array.isArray(data.files)) {
    throw createRegistryError(`Registry payload for "${name}" is missing "files" array`);
  }

  // Reject any file path that contains traversal sequences
  const SAFE_PATH = /^[\w\-./]+$/;

  for (const file of data.files) {
    const filePath = file.targetPath || file.target || file.path || "";

    if (!filePath || filePath.includes("..") || !SAFE_PATH.test(filePath)) {
      throw createRegistryError(
        `Unsafe file path in registry payload for "${name}": "${filePath}"`
      );
    }
  }
}

export async function fetchRegistryIndex(options = {}) {
  const { local = false, cwd = process.cwd() } = options;

  if (local) {
    return normalizeRegistryIndex(await fetchLocalRegistryIndex(cwd));
  }

  if (fs.existsSync(path.join(DEV_REGISTRY_PATH, "index.json"))) {
    return normalizeRegistryIndex(await fetchDevRegistryIndex());
  }

  return normalizeRegistryIndex(await fetchRemoteRegistryIndex());
}

async function fetchDevRegistryIndex() {
  const indexPath = path.join(DEV_REGISTRY_PATH, "index.json");
  const content = fs.readFileSync(indexPath, "utf-8");

  return JSON.parse(content);
}

async function fetchLocalRegistryIndex(cwd) {
  const indexPath = path.join(cwd, LOCAL_REGISTRY_PATH, "index.json");

  if (!fs.existsSync(indexPath)) {
    throw createRegistryError("Registry index not found locally", {
      status: 404,
    });
  }

  const content = fs.readFileSync(indexPath, "utf-8");

  return JSON.parse(content);
}

export function normalizeRegistryIndex(index) {
  const sourceItems = Array.isArray(index) ? index : index?.items;

  if (!Array.isArray(sourceItems)) {
    throw createRegistryError("Invalid registry index response");
  }

  const items = sourceItems.map((item) => ({
    ...item,
    tier: getRegistryTier(item),
  }));

  return {
    ...(Array.isArray(index) ? {} : index),
    items,
    tiers: {
      free: items.filter((item) => item.tier === "free"),
      pro: items.filter((item) => item.tier === "pro"),
    },
  };
}

async function fetchRemoteRegistryIndex() {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/index.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch registry index: ${error.message}`,
    );
  }

  if (!response.ok) {
    throw createRegistryError(
      `Failed to fetch registry index: ${response.statusText}`,
      {
        status: response.status,
      },
    );
  }

  return response.json();
}

const ALLOWED_ASSET_HOSTS = new Set(["vault.hyperiux.com"]);

export async function fetchRegistryAsset(source) {
  const resolvedUrl = source.startsWith("http")
    ? new URL(source)
    : new URL(source, new URL(REGISTRY_URL).origin);

  if (!ALLOWED_ASSET_HOSTS.has(resolvedUrl.hostname)) {
    throw createRegistryError(
      `Refusing to fetch asset from untrusted host: ${resolvedUrl.hostname}`
    );
  }

  let response;

  try {
    response = await fetch(resolvedUrl);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch asset "${source}": ${error.message}`,
    );
  }

  if (!response.ok) {
    throw createRegistryError(`Failed to fetch asset: ${response.statusText}`, {
      status: response.status,
    });
  }

  return Buffer.from(await response.arrayBuffer());
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

export function getRegistryItemFiles(item, config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const files = item.files || [];
  const shouldInstallAsJsx = detectProjectLanguage(cwd) === "jsx";

  return files.map((file) => {
    let targetPath = file.targetPath || file.target || file.path;

    if (!targetPath) {
      throw createRegistryError(
        `Invalid registry file in "${item.name}". Missing target path.`,
      );
    }

    const shouldPrefixSrc =
      !targetPath.startsWith("public/") && !targetPath.startsWith("src/");

    // Replace Hyperiux default paths with user's configured aliases
    if (targetPath.startsWith("components/hyperiux/")) {
      const effectsPath =
        config.aliases?.effects?.replace("@/", "") || "components/effects";

      targetPath = targetPath.replace(
        "components/hyperiux/",
        `${effectsPath}/`,
      );
    } else if (targetPath.startsWith("components/effects/")) {
      const effectsPath =
        config.aliases?.effects?.replace("@/", "") || "components/effects";

      targetPath = targetPath.replace("components/effects/", `${effectsPath}/`);
    } else if (targetPath.startsWith("hooks/")) {
      const hooksPath = config.aliases?.hooks?.replace("@/", "") || "hooks";

      targetPath = targetPath.replace("hooks/", `${hooksPath}/`);
    } else if (targetPath.startsWith("lib/")) {
      const libPath = config.aliases?.lib?.replace("@/", "") || "lib";

      targetPath = targetPath.replace("lib/", `${libPath}/`);
    }

    if (shouldInstallAsJsx) {
      targetPath = toJsxTargetPath(targetPath);
    }

    return {
      ...file,
      targetPath: `${shouldPrefixSrc ? prefix : ""}${targetPath}`,
      content:
        shouldInstallAsJsx && typeof file.content === "string"
          ? stripTypeScriptFromReactSource(file.content)
          : file.content,
    };
  });
}

function toJsxTargetPath(targetPath) {
  return targetPath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
}

export function stripTypeScriptFromReactSource(source) {
  let output = source;

  output = output.replace(/^\s*import\s+type\s+[^;]+;\s*$/gm, "");
  output = output.replace(/^\s*export\s+type\s+\w+[^=]*=\s*\{[\s\S]*?^};?\s*$/gm, "");
  output = output.replace(/^\s*type\s+\w+[^=]*=\s*\{[\s\S]*?^};?\s*$/gm, "");
  output = output.replace(/^\s*export\s+type\s+[\s\S]*?;\s*$/gm, "");
  output = output.replace(/^\s*type\s+\w+[\s\S]*?;\s*$/gm, "");
  output = output.replace(/^\s*export\s+interface\s+\w+[\s\S]*?^}\s*$/gm, "");
  output = output.replace(/^\s*interface\s+\w+[\s\S]*?^}\s*$/gm, "");

  output = output.replace(
    /\b(useRef|useState|useReducer|useMemo|useCallback|createRef)<[^>\n]+>\s*\(/g,
    "$1("
  );
  output = output.replace(/:\s*(React\.)?(FC|FunctionComponent)<[^>\n]+>\s*=/g, " =");
  output = output.replace(/\b(React\.)?(FC|FunctionComponent)<[^>\n]+>/g, "");

  output = stripFunctionTypeAnnotations(output);
  output = output.replace(/(\b(?:const|let|var)\s+[A-Za-z_$][\w$]*)\s*:\s*[\w$.<>,\s|&[\]?]+\s*(?==)/g, "$1 ");

  output = output.replace(/\s+as\s+const\b/g, "");
  output = output.replace(/\s+as\s+[\w$.<>,\s|&[\]?]+(?=[,);\]}])/g, "");
  output = output.replace(/([A-Za-z_$][\w$]*)!\./g, "$1.");
  output = output.replace(/([A-Za-z_$][\w$]*)!\[/g, "$1[");

  return output.replace(/\n{3,}/g, "\n\n");
}

function stripFunctionTypeAnnotations(source) {
  let output = source;

  output = output.replace(
    /function(\s+[A-Za-z_$][\w$]*)?\s*\(([^)]*)\)(\s*:\s*[\w$.<>,\s|&[\]?]+)?\s*\{/g,
    (_match, name = "", params) => `function${name}(${stripParameterTypes(params)}) {`
  );

  output = output.replace(
    /\(([^()]*:[^()]*)\)(\s*:\s*[\w$.<>,\s|&[\]?]+)?\s*=>/g,
    (_match, params) => `(${stripParameterTypes(params)}) =>`
  );

  return output;
}

function stripParameterTypes(params) {
  return splitTopLevel(params, ",")
    .map((param) => stripSingleParameterType(param))
    .join(",");
}

function stripSingleParameterType(param) {
  const colonIndex = findTopLevelColon(param);

  if (colonIndex === -1) {
    return param;
  }

  const equalsIndex = findTopLevelChar(param, "=");
  const suffix = equalsIndex === -1 ? "" : param.slice(equalsIndex);
  const left = param.slice(0, colonIndex).replace(/\?(\s*)$/, "$1");

  return `${left}${suffix}`;
}

function splitTopLevel(value, separator) {
  const parts = [];
  let start = 0;
  let angleDepth = 0;
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const previous = value[index - 1];

    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "<") {
      angleDepth += 1;
    } else if (char === ">") {
      angleDepth = Math.max(0, angleDepth - 1);
    } else if (char === "{") {
      braceDepth += 1;
    } else if (char === "}") {
      braceDepth = Math.max(0, braceDepth - 1);
    } else if (char === "[") {
      bracketDepth += 1;
    } else if (char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (char === "(") {
      parenDepth += 1;
    } else if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    } else if (
      char === separator &&
      angleDepth === 0 &&
      braceDepth === 0 &&
      bracketDepth === 0 &&
      parenDepth === 0
    ) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(value.slice(start));
  return parts;
}

function findTopLevelColon(value) {
  return findTopLevelChar(value, ":");
}

function findTopLevelChar(value, target) {
  let angleDepth = 0;
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const previous = value[index - 1];

    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "<") {
      angleDepth += 1;
    } else if (char === ">") {
      angleDepth = Math.max(0, angleDepth - 1);
    } else if (char === "{") {
      braceDepth += 1;
    } else if (char === "}") {
      braceDepth = Math.max(0, braceDepth - 1);
    } else if (char === "[") {
      bracketDepth += 1;
    } else if (char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (char === "(") {
      parenDepth += 1;
    } else if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    } else if (
      char === target &&
      angleDepth === 0 &&
      braceDepth === 0 &&
      bracketDepth === 0 &&
      parenDepth === 0
    ) {
      return index;
    }
  }

  return -1;
}
