"use client";

import { useState } from "react";
import Link from "next/link";

export function CliAuthClient({ isPro }) {
  const [token, setToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateToken() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cli/token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate token");
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToken() {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Pro Required</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              CLI tokens are available to Hyperiux Pro subscribers. Subscribe to unlock all 100+ effects via CLI.
            </p>
          </div>
          <Link
            href="/effects"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40">Hyperiux Pro</p>
          <h1 className="text-3xl font-semibold text-white">CLI Token</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Generate a token, then paste it when prompted by{" "}
            <code className="text-white/80 bg-white/10 px-1.5 py-0.5 rounded text-xs">npx hyperiux login</code>.
          </p>
        </div>

        {!token ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 text-sm text-white/60">
              <p className="font-medium text-white/80">How it works</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Click <span className="text-white">Generate Token</span> below</li>
                <li>Copy the token — it is shown <span className="text-white">once only</span></li>
                <li>Run <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">npx hyperiux login</code> in your project</li>
                <li>Paste the token when prompted</li>
              </ol>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={generateToken}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {loading ? "Generating…" : "Generate Token"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/20 bg-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Your Token</span>
                <button
                  onClick={copyToken}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <code className="block text-xs text-white/80 break-all font-mono leading-relaxed">
                {token}
              </code>
            </div>

            <p className="text-center text-yellow-400/80 text-xs">
              ⚠ This token will not be shown again. Copy it now.
            </p>

            <button
              onClick={() => { setToken(null); setCopied(false); }}
              className="w-full px-5 py-2.5 rounded-lg border border-white/20 text-white/60 text-sm hover:bg-white/5 transition-colors"
            >
              Generate a new token (invalidates current)
            </button>
          </div>
        )}

        <p className="text-center text-white/30 text-xs">
          Each token is tied to your Pro subscription. It stops working if you cancel.
        </p>
      </div>
    </div>
  );
}
