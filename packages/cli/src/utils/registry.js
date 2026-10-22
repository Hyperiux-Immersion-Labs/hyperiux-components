/* SPDX-License-Identifier: MIT */

import fs from "fs";
import path from "path";
import { URL } from "url";
import { Buffer } from "buffer";
import { createRequire } from "module";
import ts from "typescript";
import { detectProjectLanguage } from "./config.js";
import { getOrCreateDeviceId } from "./cli-state.js";
import { APP_URL } from "./urls.js";

const require = createRequire(import.meta.url);
const { version: CLI_VERSION } = require("../../package.json");

const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://vault.hyperiux.com/r";

const API_URL = process.env.HYPERIUX_API_URL || APP_URL;

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
  error.rateLimited = Boolean(options.rateLimited);
  error.signInRequired = Boolean(options.signInRequired);
  error.retryAfter = options.retryAfter;
  error.limit = options.limit;

  return error;
}

async function parseJsonResponse(response) {
  return response.json().catch(() => null);
}

/**
 * Main registry fetcher used by `hyperiux add <effect>` (and `diff`, which needs
 * the code too).
 *
 * Every effect's code - free ones included - comes only from the signed-in,
 * metered API (/api/cli/effects/<name>), with the saved CLI token. The public
 * registry JSON carries no source any more, and there's no fallback to it: an
 * API failure is an error, never a reason to install something else.
 *
 * Signed out: the API answers 401 "sign-in-required", surfaced as
 * `error.signInRequired` so `add` can say "run npx hyperiux login".
 */
export async function fetchRegistry(name, options = {}) {
  const { token = null, isDependency = false } = options;

  return fetchProtectedEffect(name, token, { isDependency });
}

/**
 * An effect's public metadata - tier, version, changelog, dependencies, file
 * paths, no source. For `outdated` / `versions`, which only compare versions:
 * no sign-in needed, and it never counts as an install.
 */
export async function fetchRegistryMetadata(name) {
  return fetchPublicEffect(name);
}

async function fetchPublicEffect(name) {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/${encodeURIComponent(name)}.json`;

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

async function fetchProtectedEffect(name, token, options = {}) {
  const { isDependency = false } = options;
  const baseUrl = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${encodeURIComponent(name)}`;
  const url = isDependency ? `${baseUrl}?dependency=1` : baseUrl;
  const deviceId = getOrCreateDeviceId();

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] API URL:", url);
    console.log("[Hyperiux CLI] Token found:", Boolean(token));
    console.log("[Hyperiux CLI] Device ID:", deviceId);
  }

  let response;

  try {
    response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-hyperiux-device-id": deviceId,
        "x-hyperiux-cli-version": CLI_VERSION,
      },
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
      data?.error || `Failed to fetch effect: ${response.statusText}`,
      {
        status: response.status,
        signInRequired: data?.reason === "sign-in-required" || (response.status === 401 && !token),
        requiresPro: Boolean(data?.requiresPro),
        rateLimited: Boolean(data?.rateLimited),
        retryAfter: data?.retryAfter,
        limit: data?.limit,
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

export async function fetchRegistryIndex() {
  return normalizeRegistryIndex(await fetchRemoteRegistryIndex());
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

  if (resolvedUrl.protocol !== "https:") {
    throw createRegistryError(
      `Refusing to fetch asset over ${resolvedUrl.protocol.replace(":", "")}: ${source}`
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

// TypeScript's own transpiler, not a regex: regexes can't reliably strip TS
// (nested generics, declarations without initializers, ...).
export function stripTypeScriptFromReactSource(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
  });

  return outputText.replace(/\n{3,}/g, "\n\n");
}
