/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Installation-SyncUp.md Stage 1.6: free effects now route through the
// metered API (with a fallback to the public JSON if that call fails), and
// every protected-effect request carries device-id/cli-version headers.
// registry.test.js covers the pure functions (normalizeRegistryIndex,
// getRegistryItemFiles, TS stripping); this file covers fetchRegistry's
// network-facing branching, which needs fetch/cli-state mocked.

vi.mock("../utils/cli-state.js", () => ({
  getOrCreateDeviceId: vi.fn(() => "device-abc-123"),
}));

const { fetchRegistry } = await import("../utils/registry.js");

const FREE_PUBLIC_DATA = {
  name: "dotted-grid",
  tier: "free",
  files: [{ path: "index.jsx", content: "// free effect source" }],
};

const PRO_PUBLIC_DATA = { name: "fluid-ripple", tier: "pro" };

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, statusText: "", json: async () => body };
}

describe("fetchRegistry - metered routing (Stage 1.6)", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("routes a free effect through the metered API, not the raw public JSON", async () => {
    const meteredPayload = { ...FREE_PUBLIC_DATA, files: [{ path: "index.jsx", content: "// metered copy" }] };

    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA)) // fetchPublicEffect (tier check)
      .mockResolvedValueOnce(jsonResponse(meteredPayload)); // fetchProtectedEffect

    const result = await fetchRegistry("dotted-grid", {});

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const meteredUrl = fetchMock.mock.calls[1][0];
    expect(meteredUrl).toContain("/api/cli/effects/dotted-grid");
    expect(result).toEqual(meteredPayload);
  });

  it("sends device-id and cli-version headers on the metered request", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA));

    await fetchRegistry("dotted-grid", {});

    const [, meteredOptions] = fetchMock.mock.calls[1];
    expect(meteredOptions.headers["x-hyperiux-device-id"]).toBe("device-abc-123");
    expect(meteredOptions.headers["x-hyperiux-cli-version"]).toEqual(expect.any(String));
    expect(meteredOptions.headers.Authorization).toBeUndefined(); // no token passed
  });

  it("falls back to the public JSON if the metered request fails - a free install never breaks", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockRejectedValueOnce(new Error("network down"));

    const result = await fetchRegistry("dotted-grid", {});

    expect(result).toEqual(FREE_PUBLIC_DATA);
  });

  it("falls back to the public JSON if the metered request returns a non-ok response", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockResolvedValueOnce(jsonResponse({ error: "server error" }, { ok: false, status: 500 }));

    const result = await fetchRegistry("dotted-grid", {});

    expect(result).toEqual(FREE_PUBLIC_DATA);
  });

  it("does NOT fall back to the public JSON on a genuine 429 rate-limit denial (Stage 3) - that would bypass enforcement", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockResolvedValueOnce(
        jsonResponse({ error: "Daily install limit reached.", rateLimited: true, limit: 2, retryAfter: 3600 }, { ok: false, status: 429 })
      );

    await expect(fetchRegistry("dotted-grid", {})).rejects.toMatchObject({
      rateLimited: true,
      limit: 2,
      retryAfter: 3600,
    });
  });

  it("appends ?dependency=1 when isDependency is true, so it isn't charged against quota", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA));

    await fetchRegistry("dotted-grid", { isDependency: true });

    const meteredUrl = fetchMock.mock.calls[1][0];
    expect(meteredUrl).toContain("dependency=1");
  });

  it("does not append the dependency query param for a normal (non-dependency) install", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA))
      .mockResolvedValueOnce(jsonResponse(FREE_PUBLIC_DATA));

    await fetchRegistry("dotted-grid", {});

    const meteredUrl = fetchMock.mock.calls[1][0];
    expect(meteredUrl).not.toContain("dependency");
  });

  it("pro effects still go through the protected API with the token attached", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(PRO_PUBLIC_DATA))
      .mockResolvedValueOnce(jsonResponse({ ...PRO_PUBLIC_DATA, files: [] }));

    await fetchRegistry("fluid-ripple", { token: "hpx_sometoken" });

    const [meteredUrl, meteredOptions] = fetchMock.mock.calls[1];
    expect(meteredUrl).toContain("/api/cli/effects/fluid-ripple");
    expect(meteredOptions.headers.Authorization).toBe("Bearer hpx_sometoken");
  });
});
