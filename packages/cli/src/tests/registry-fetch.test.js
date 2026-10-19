/* SPDX-License-Identifier: MIT */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Every effect - free ones included - comes only from the signed-in, metered API
// (NO_ANONYMOUS_INSTALLS.md in hyperiux-pro-components): one request, the CLI token
// attached, no fallback to the public JSON (which carries no source any more).
// registry.test.js covers the pure functions (normalizeRegistryIndex,
// getRegistryItemFiles, TS stripping); this file covers fetchRegistry's
// network-facing branching, which needs fetch/cli-state mocked.

vi.mock("../utils/cli-state.js", () => ({
  getOrCreateDeviceId: vi.fn(() => "device-abc-123"),
}));

const { fetchRegistry, fetchRegistryMetadata } = await import("../utils/registry.js");

const FREE_PAYLOAD = {
  name: "dotted-grid",
  tier: "free",
  files: [{ path: "index.jsx", content: "// free effect source" }],
};

const PRO_PAYLOAD = { name: "fluid-ripple", tier: "pro", files: [{ path: "index.jsx", content: "// pro source" }] };

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, statusText: "", json: async () => body };
}

describe("fetchRegistry - signed-in, metered delivery", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a free effect from the metered API with the token - one request, no public JSON", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(FREE_PAYLOAD));

    const result = await fetchRegistry("dotted-grid", { token: "hpx_sometoken" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/cli/effects/dotted-grid");
    expect(options.headers.Authorization).toBe("Bearer hpx_sometoken");
    expect(result).toEqual(FREE_PAYLOAD);
  });

  it("sends device-id and cli-version headers on the metered request", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(FREE_PAYLOAD));

    await fetchRegistry("dotted-grid", { token: "hpx_sometoken" });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers["x-hyperiux-device-id"]).toBe("device-abc-123");
    expect(options.headers["x-hyperiux-cli-version"]).toEqual(expect.any(String));
  });

  it("signed out: surfaces the server's 401 as signInRequired, never the public JSON", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "Sign in to install effects.", reason: "sign-in-required" }, { ok: false, status: 401 })
    );

    await expect(fetchRegistry("dotted-grid", {})).rejects.toMatchObject({ signInRequired: true, status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("a network failure is an error - no fallback", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(fetchRegistry("dotted-grid", { token: "hpx_sometoken" })).rejects.toThrow(/Could not reach Hyperiux API/);
  });

  it("a server error is an error - no fallback", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "server error" }, { ok: false, status: 500 }));

    await expect(fetchRegistry("dotted-grid", { token: "hpx_sometoken" })).rejects.toMatchObject({ status: 500, signInRequired: false });
  });

  it("passes a 429 rate-limit denial through", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "Daily install limit reached.", rateLimited: true, limit: 2, retryAfter: 3600 }, { ok: false, status: 429 })
    );

    await expect(fetchRegistry("dotted-grid", { token: "hpx_sometoken" })).rejects.toMatchObject({
      rateLimited: true,
      limit: 2,
      retryAfter: 3600,
    });
  });

  it("appends ?dependency=1 when isDependency is true, so it isn't charged against quota", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(FREE_PAYLOAD));

    await fetchRegistry("dotted-grid", { token: "hpx_sometoken", isDependency: true });

    expect(fetchMock.mock.calls[0][0]).toContain("dependency=1");
  });

  it("does not append the dependency query param for a normal (non-dependency) install", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(FREE_PAYLOAD));

    await fetchRegistry("dotted-grid", { token: "hpx_sometoken" });

    expect(fetchMock.mock.calls[0][0]).not.toContain("dependency");
  });

  it("pro effects go through the same protected API with the token attached", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(PRO_PAYLOAD));

    await fetchRegistry("fluid-ripple", { token: "hpx_sometoken" });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/cli/effects/fluid-ripple");
    expect(options.headers.Authorization).toBe("Bearer hpx_sometoken");
  });
});

describe("fetchRegistryMetadata - versions only, no install", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it("reads the public JSON and never calls the metered API", async () => {
    globalThis.fetch.mockResolvedValueOnce(jsonResponse({ name: "dotted-grid", tier: "free", version: "1.3.0", files: [] }));

    const result = await fetchRegistryMetadata("dotted-grid");

    expect(result.version).toBe("1.3.0");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch.mock.calls[0][0]).toMatch(/\/r\/dotted-grid\.json$/);
  });
});
