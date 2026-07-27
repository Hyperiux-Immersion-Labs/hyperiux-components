// Same defaults as packages/cli/src/utils/registry.js's REGISTRY_URL/API_URL -
// both overridable for local development against a dev registry build.
export const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://vault.hyperiux.com/r";
export const API_URL = process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

export const CHARACTER_LIMIT = 25000;
