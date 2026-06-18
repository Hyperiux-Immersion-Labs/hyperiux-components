import { getAuthToken } from "./auth.js";

const DEFAULT_API_URL =
  process.env.HYPERIUX_API_URL || "https://vault.hyperiux.com";

export function getApiUrl() {
  return DEFAULT_API_URL.replace(/\/$/, "");
}

export async function fetchEffectFromApi(effectName) {
  const token = getAuthToken();
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/cli/effects/${effectName}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data?.requiresPro) {
      throw new Error(`
This is a Pro effect.

Login with your Hyperiux Pro CLI token first:

  hyperiux login

Then try again:

  hyperiux add ${effectName}

Generate your token here:
  ${apiUrl}/cli-auth
`);
    }

    throw new Error(data?.error || "Unable to fetch effect from Hyperiux API.");
  }

  return data;
}