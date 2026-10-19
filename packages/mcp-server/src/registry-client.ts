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
 * uses (Installation-SyncUp.md Stage 1.7). `token` is required for every
 * effect, free included - see getAuthToken() (reuses `hyperiux login`'s saved
 * token, or HYPERIUX_TOKEN); without one the route answers 401
 * "sign-in-required".
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
 * Fetches one effect for hyperiux_get_effect.
 *
 * Every effect's code needs a signed-in account, free effects included
 * (NO_ANONYMOUS_INSTALLS.md in hyperiux-pro-components): the public JSON
 * carries no source, so code only comes from the metered API route, always
 * with the token from getAuthToken() (HYPERIUX_TOKEN or `hyperiux login`).
 * There is no fallback to the public JSON - a failure is a failure.
 *
 * `includeSource: false` (a details lookup) reads only the public metadata:
 * no request to the metered route, so it never uses one of the day's installs.
 *
 * With source asked for, a refusal still returns the metadata, with no file
 * content and a marker hyperiux_get_effect turns into a structured result:
 *   - signInRequired: no token, or the server didn't accept it (401)
 *   - rateLimited: the daily install limit is used up (429)
 *   - neither (a 403): a Pro effect without a Pro subscription
 */
export async function fetchEffect(
  name: string,
  options: { includeSource?: boolean } = {}
): Promise<RegistryEffect | null> {
  const { includeSource = true } = options;
  const publicEffect = await fetchPublicEffect(name);
  if (!publicEffect) return null;

  const metadata: RegistryEffect = {
    ...publicEffect,
    files: publicEffect.files.map((file) => ({ ...file, content: undefined })),
  };

  if (!includeSource) return metadata;

  const token = getAuthToken();
  if (!token) return { ...metadata, signInRequired: true };

  try {
    return await fetchProtectedEffect(name, token);
  } catch (error) {
    if (error instanceof RegistryError) {
      if (error.rateLimited) {
        return { ...metadata, rateLimited: true, retryAfter: error.retryAfter, installLimit: error.limit ?? null };
      }
      if (error.status === 401) return { ...metadata, signInRequired: true };
      if (error.status === 403) return metadata;
    }
    throw error;
  }
}
