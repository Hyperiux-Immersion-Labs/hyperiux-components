import { API_URL, REGISTRY_URL } from "./constants.js";
import { getAuthToken } from "./auth.js";
import { RegistryError, type RegistryEffect, type RegistryIndex } from "./types.js";

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
 * Fetches full source for a Pro effect via the same authenticated CLI API
 * route packages/cli uses. Requires a token - see getAuthToken() (reuses
 * `hyperiux login`'s saved token, or HYPERIUX_TOKEN).
 */
export async function fetchProtectedEffect(name: string, token: string): Promise<RegistryEffect> {
  const url = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new RegistryError(`Could not reach the Hyperiux API: ${(error as Error).message}`);
  }

  const data = (await parseJsonResponse(response)) as
    | { error?: string; requiresPro?: boolean }
    | null;

  if (!response.ok) {
    throw new RegistryError(data?.error || `Failed to fetch Pro effect: ${response.statusText}`, {
      status: response.status,
      requiresPro: Boolean(data?.requiresPro),
    });
  }

  return data as RegistryEffect;
}

/**
 * Fetches an effect's full metadata, transparently including Pro source when
 * a token is available (env var or a saved `hyperiux login` session) and the
 * effect requires it. Falls back to the public (source-stripped) response
 * when no token is available or the request isn't authorized.
 */
export async function fetchEffect(name: string): Promise<RegistryEffect | null> {
  const publicEffect = await fetchPublicEffect(name);
  if (!publicEffect) return null;

  if (publicEffect.tier !== "pro" && publicEffect.tier !== "paid") {
    return publicEffect;
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
