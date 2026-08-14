import { createRequire } from "node:module";
import { API_URL, REGISTRY_URL } from "./constants.js";
import { getAuthToken } from "./auth.js";
import { getOrCreateDeviceId } from "./device-id.js";
import { RegistryError, type RegistryEffect, type RegistryIndex } from "./types.js";

const require = createRequire(import.meta.url);
const { version: MCP_SERVER_VERSION } = require("../package.json") as { version: string };

async function parseJsonResponse(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

/**
 * Fetches the lightweight catalog index (name/category/dependencies/version
 * per effect). Does NOT include `tier` - the live index.json this reads from
 * doesn't carry it (a pre-existing gap in build-registry.js, shared with the
 * CLI's own `hyperiux list`). Use fetchEffect() for a specific slug's tier.
 */
export async function fetchRegistryIndex(): Promise<RegistryIndex> {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/index.json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new RegistryError(
      `Could not reach the Hyperiux registry: ${(error as Error).message}`
    );
  }

  if (!response.ok) {
    throw new RegistryError(`Failed to fetch registry index: ${response.statusText}`, {
      status: response.status,
    });
  }

  const data = (await parseJsonResponse(response)) as { items?: unknown } | null;
  if (!data || !Array.isArray(data.items)) {
    throw new RegistryError("Registry index response was malformed");
  }

  return data as RegistryIndex;
}

/**
 * Fetches one effect's public metadata by slug. For free-tier effects this
 * already includes full source in `files[].content`; for pro-tier effects
 * `files[].content` is stripped (public JSON never carries Pro source) - use
 * fetchProtectedEffect() with a token to get Pro source.
 */
export async function fetchPublicEffect(name: string): Promise<RegistryEffect | null> {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/${name}.json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new RegistryError(`Could not reach the Hyperiux registry: ${(error as Error).message}`);
  }

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new RegistryError(`Failed to fetch effect "${name}": ${response.statusText}`, {
      status: response.status,
    });
  }

  return (await parseJsonResponse(response)) as RegistryEffect;
}

/**
 * Fetches an effect through the same metered CLI API route packages/cli
 * uses (Installation-SyncUp.md Stage 1.7). `token` is only required for Pro
 * effects - see getAuthToken() (reuses `hyperiux login`'s saved token, or
 * HYPERIUX_TOKEN); free effects can call this with `token: null` since the
 * route grants free tier unconditionally.
 */
export async function fetchProtectedEffect(
  name: string,
  token: string | null,
  options: { isDependency?: boolean } = {}
): Promise<RegistryEffect> {
  const baseUrl = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;
  const url = options.isDependency ? `${baseUrl}?dependency=1` : baseUrl;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-hyperiux-device-id": getOrCreateDeviceId(),
        "x-hyperiux-mcp-version": MCP_SERVER_VERSION,
      },
    });
  } catch (error) {
    throw new RegistryError(`Could not reach the Hyperiux API: ${(error as Error).message}`);
  }

  const data = (await parseJsonResponse(response)) as
    | { error?: string; requiresPro?: boolean; rateLimited?: boolean; retryAfter?: number; limit?: number | null }
    | null;

  if (!response.ok) {
    throw new RegistryError(data?.error || `Failed to fetch Pro effect: ${response.statusText}`, {
      status: response.status,
      requiresPro: Boolean(data?.requiresPro),
      rateLimited: Boolean(data?.rateLimited),
      retryAfter: data?.retryAfter,
      limit: data?.limit,
    });
  }

  return data as RegistryEffect;
}

/**
 * Fetches an effect's full metadata, transparently including Pro source when
 * a token is available (env var or a saved `hyperiux login` session) and the
 * effect requires it. Falls back to the public (source-stripped) response
 * when no token is available or the request isn't authorized.
 *
 * Free effects also route through the metered API now (Installation-SyncUp.md
 * §2/Stage 1.7: the public JSON bypassed all server code, so a free fetch
 * could never be tracked or limited), falling back to the public JSON's own
 * embedded content if that call fails - an API hiccup should never break a
 * free effect lookup.
 *
 * A genuine rate-limit denial (Stage 3) is the one failure that must NOT
 * fall back to the public JSON's embedded content - that would silently
 * bypass enforcement for every free effect (mirrors the same fix in the
 * CLI's registry.js). Instead the metadata is still returned, but with
 * `rateLimited: true` and no file content, so hyperiux_get_effect can
 * surface a structured "limit reached" result instead of source.
 */
export async function fetchEffect(name: string): Promise<RegistryEffect | null> {
  const publicEffect = await fetchPublicEffect(name);
  if (!publicEffect) return null;

  if (publicEffect.tier !== "pro" && publicEffect.tier !== "paid") {
    try {
      return await fetchProtectedEffect(name, null);
    } catch (error) {
      if (error instanceof RegistryError && error.rateLimited) {
        return {
          ...publicEffect,
          files: publicEffect.files.map((file) => ({ ...file, content: undefined })),
          rateLimited: true,
          retryAfter: error.retryAfter,
          installLimit: error.limit ?? null,
        };
      }
      return publicEffect;
    }
  }

  const token = getAuthToken();
  if (!token) return publicEffect;

  try {
    return await fetchProtectedEffect(name, token);
  } catch (error) {
    if (error instanceof RegistryError && (error.status === 401 || error.status === 403)) {
      return publicEffect;
    }
    throw error;
  }
}
