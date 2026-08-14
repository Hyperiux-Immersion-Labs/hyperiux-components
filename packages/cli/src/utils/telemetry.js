/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { createHash } from "crypto";
import { createRequire } from "module";
import os from "os";
import { getAuthToken } from "./auth.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

const TELEMETRY_URL =
  process.env.HYPERIUX_TELEMETRY_URL ||
  `${APP_URL.replace(/\/$/, "")}/api/cli/telemetry`;

const TELEMETRY_TIMEOUT_MS = 1500;

export async function trackCliEvent(eventName, properties = {}) {
  if (isTelemetryDisabled() || typeof globalThis.fetch !== "function") {
    return;
  }

  const controller = new globalThis.AbortController();
  const timeout = globalThis.setTimeout(
    () => controller.abort(),
    TELEMETRY_TIMEOUT_MS,
  );

  // Best-effort attribution: a signed-in Pro user's saved token lets the
  // server credit installs to their account instead of only the anonymous
  // per-project ID. Never required - trackCliEvent must work the same for
  // anonymous free users, who simply have no token to attach.
  const token = getAuthToken();

  try {
    await globalThis.fetch(TELEMETRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event: eventName,
        anonymousId: getAnonymousProjectId(process.cwd()),
        cliVersion: version,
        platform: os.platform(),
        nodeVersion: process.versions.node,
        properties,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
  } catch {
    // Telemetry must never interrupt the install flow.
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function isTelemetryDisabled() {
  return (
    process.env.HYPERIUX_TELEMETRY_DISABLED === "1" ||
    process.env.HYPERIUX_TELEMETRY_DISABLED === "true" ||
    process.env.DO_NOT_TRACK === "1"
  );
}

function getAnonymousProjectId(cwd) {
  return createHash("sha256")
    .update(`${cwd}:${os.hostname()}`)
    .digest("hex")
    .slice(0, 32);
}
