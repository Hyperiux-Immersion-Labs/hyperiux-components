// Same defaults and env overrides as the `hyperiux` CLI.
export const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://vault.hyperiux.com/r";
export const API_URL =
  process.env.HYPERIUX_API_URL || process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

export const CHARACTER_LIMIT = 25000;
