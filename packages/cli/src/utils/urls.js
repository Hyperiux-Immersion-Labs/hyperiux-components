/* SPDX-License-Identifier: MIT */

// The Hyperiux Vault app: sign-in pages, the CLI validate/telemetry endpoints,
// and (unless HYPERIUX_API_URL overrides it) the effects API.
export const APP_URL = (
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com"
).replace(/\/$/, "");
