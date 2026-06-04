"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EyeIcon({ hidden = false }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-3.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7.8C5.3 9.1 3.8 11 3 12c1.4 1.8 4.7 5.5 9 5.5 1.4 0 2.7-.4 3.8-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 6.7c.6-.1 1.2-.2 1.8-.2 4.3 0 7.6 3.7 9 5.5-.4.6-1.2 1.5-2.2 2.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M3 12s3.4-5.5 9-5.5S21 12 21 12s-3.4 5.5-9 5.5S3 12 3 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.5A2.5 2.5 0 1012 9a2.5 2.5 0 000 5.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function CustomSignInForm() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit =
    emailAddress.trim().length > 0 &&
    password.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/custom-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Unable to sign in.");
        return;
      }

      router.push("/effects");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/45 p-8 shadow-2xl backdrop-blur-2xl max-sm:rounded-[1.5rem] max-sm:p-6">
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary">
          Hyperiux Vault
        </p>

        <h1 className="text-4xl font-normal tracking-[-0.05em]">Sign in</h1>

        <p className="mt-3 text-sm leading-6 text-white/50">
          Use your email and the latest password sent to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Email address
          </label>

          <input
            type="email"
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="auth-input w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Latest password from email"
              className="auth-input w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-white/45 transition-colors hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon hidden={showPassword} />
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/45">
        Need a fresh temporary password?{" "}
        <Link href="/sign-up" className="text-primary hover:text-primary-hover">
          Request again
        </Link>
      </p>

      <style jsx global>{`
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus,
        .auth-input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          box-shadow: 0 0 0px 1000px rgba(255, 107, 0, 0.08) inset !important;
          border-color: rgba(255, 107, 0, 0.45) !important;
          transition: background-color 9999s ease-in-out 0s !important;
        }

        .auth-input {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}