import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RegistryError } from "./types.js";

// getAuthToken falls back to a real ~/.hyperiux/auth.json on disk, which may
// genuinely exist on a dev machine that's run `hyperiux login` before - mock
// it so fetchEffect's token-present/absent branches are deterministic here
// regardless of the machine running the test. Same reasoning for
// getOrCreateDeviceId and ~/.hyperiux/state.json.
const { getAuthTokenMock } = vi.hoisted(() => ({ getAuthTokenMock: vi.fn() }));
vi.mock("./auth.js", () => ({ getAuthToken: getAuthTokenMock }));
vi.mock("./device-id.js", () => ({ getOrCreateDeviceId: () => "device-abc-123" }));

const { fetchRegistryIndex, fetchPublicEffect, fetchEffect } = await import("./registry-client.js");

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: "",
    json: async () => body,
  } as Response;
}

describe("fetchRegistryIndex", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed index on success", async () => {
    const items = [{ name: "dotted-grid", category: "backgrounds" }];
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ items }));

    const index = await fetchRegistryIndex();
    expect(index.items).toEqual(items);
  });

  it("throws a RegistryError with the malformed items array missing", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ notItems: [] }));

    await expect(fetchRegistryIndex()).rejects.toThrow(RegistryError);
  });

  it("throws a RegistryError when the HTTP response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(null, { ok: false, status: 500 }));

    await expect(fetchRegistryIndex()).rejects.toThrow(RegistryError);
  });

  it("throws a RegistryError when the network request itself fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(fetchRegistryIndex()).rejects.toThrow(/Could not reach the Hyperiux registry/);
  });
});

describe("fetchPublicEffect", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null on a 404 instead of throwing", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(null, { ok: false, status: 404 }));

    const effect = await fetchPublicEffect("does-not-exist");
    expect(effect).toBeNull();
  });

  it("returns the effect on success", async () => {
    const effect = { name: "dotted-grid", tier: "free", files: [] };
    vi.mocked(fetch).mockResolvedValue(jsonResponse(effect));

    await expect(fetchPublicEffect("dotted-grid")).resolves.toEqual(effect);
  });
});

describe("fetchEffect", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    getAuthTokenMock.mockReset();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the saved token for a free effect too - every install needs an account", async () => {
    getAuthTokenMock.mockReturnValue("test-token");
    const publicEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "// Sign in to install this effect" }] };
    const meteredEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "metered copy" }] };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockResolvedValueOnce(jsonResponse(meteredEffect));

    const result = await fetchEffect("dotted-grid");

    expect(result).toEqual(meteredEffect);
    expect(fetch).toHaveBeenCalledTimes(2);

    const [meteredUrl, meteredOptions] = vi.mocked(fetch).mock.calls[1];
    expect(meteredUrl).toContain("/api/cli/effects/dotted-grid");
    const headers = (meteredOptions as RequestInit).headers as Record<string, string>;
    expect(headers["x-hyperiux-device-id"]).toBe("device-abc-123");
    expect(headers["x-hyperiux-mcp-version"]).toEqual(expect.any(String));
    expect(headers.Authorization).toBe("Bearer test-token");
  });

  it("asks for sign-in with no token - no metered call, no public content", async () => {
    getAuthTokenMock.mockReturnValue(null);
    const publicEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "// Sign in to install this effect" }] };
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(publicEffect));

    const result = await fetchEffect("dotted-grid");

    expect(result?.signInRequired).toBe(true);
    expect(result?.files.every((f) => typeof f.content !== "string")).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("asks for sign-in when the server refuses the token (401)", async () => {
    getAuthTokenMock.mockReturnValue("stale-token");
    const publicEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "// stub" }] };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockResolvedValueOnce(jsonResponse({ error: "Sign in to install effects.", reason: "sign-in-required" }, { ok: false, status: 401 }));

    const result = await fetchEffect("dotted-grid");

    expect(result?.signInRequired).toBe(true);
    expect(result?.files.every((f) => typeof f.content !== "string")).toBe(true);
  });

  it("never falls back to the public JSON when the metered call fails", async () => {
    getAuthTokenMock.mockReturnValue("test-token");
    const publicEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "public copy" }] };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockRejectedValueOnce(new Error("network down"));

    await expect(fetchEffect("dotted-grid")).rejects.toBeInstanceOf(RegistryError);
  });

  it("reads only the public metadata when source isn't asked for - no install used", async () => {
    getAuthTokenMock.mockReturnValue("test-token");
    const publicEffect = { name: "dotted-grid", tier: "free", version: "1.2.0", files: [{ path: "index.jsx", content: "// stub" }] };
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(publicEffect));

    const result = await fetchEffect("dotted-grid", { includeSource: false });

    expect(result?.version).toBe("1.2.0");
    expect(result?.files.every((f) => typeof f.content !== "string")).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns metadata only for a Pro effect the account can't open (403)", async () => {
    getAuthTokenMock.mockReturnValue("free-user-token");
    const publicEffect = { name: "circle-text-reveal", tier: "pro", files: [{ path: "index.jsx" }] };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockResolvedValueOnce(jsonResponse({ error: "Pro subscription required.", requiresPro: true }, { ok: false, status: 403 }));

    const result = await fetchEffect("circle-text-reveal");

    expect(result?.signInRequired).toBeUndefined();
    expect(result?.files.every((f) => typeof f.content !== "string")).toBe(true);
  });

  it("does NOT fall back to the public JSON's content on a genuine 429 (Stage 3) - returns a rateLimited marker instead", async () => {
    getAuthTokenMock.mockReturnValue("test-token");
    const publicEffect = { name: "dotted-grid", tier: "free", files: [{ path: "index.jsx", content: "public copy" }] };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockResolvedValueOnce(
        jsonResponse(
          { error: "Daily install limit reached.", rateLimited: true, limit: 2, retryAfter: 3600 },
          { ok: false, status: 429 }
        )
      );

    const result = await fetchEffect("dotted-grid");

    expect(result?.rateLimited).toBe(true);
    expect(result?.retryAfter).toBe(3600);
    expect(result?.installLimit).toBe(2);
    // Content must not leak through from the public JSON's own copy.
    expect(result?.files.every((f) => typeof f.content !== "string")).toBe(true);
  });

  it("fetches the protected route when a token is available for a Pro effect", async () => {
    getAuthTokenMock.mockReturnValue("test-token");
    const publicEffect = { name: "circle-text-reveal", tier: "pro", files: [{ path: "index.jsx" }] };
    const protectedEffect = {
      name: "circle-text-reveal",
      tier: "pro",
      files: [{ path: "index.jsx", content: "real source" }],
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(publicEffect))
      .mockResolvedValueOnce(jsonResponse(protectedEffect));

    const result = await fetchEffect("circle-text-reveal");
    expect(result).toEqual(protectedEffect);
    expect(fetch).toHaveBeenCalledTimes(2);
    const secondCallHeaders = vi.mocked(fetch).mock.calls[1][1] as RequestInit;
    expect((secondCallHeaders.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-token"
    );
  });
});
