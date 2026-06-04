"use client";

import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomSignUpForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState("details");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("verify");
    } catch (error) {
      setErrorMessage(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/effects");
        return;
      }

      setErrorMessage("Verification is incomplete. Please try again.");
    } catch (error) {
      setErrorMessage(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Invalid verification code. Please try again."
      );
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

        <h1 className="text-4xl font-normal tracking-[-0.05em]">
          {step === "details" ? "Create your account" : "Verify your email"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/50">
          {step === "details"
            ? "Create an account to access the vault, effects, docs, and Pro upgrades."
            : `We sent a verification code to ${emailAddress}.`}
        </p>
      </div>

      {step === "details" ? (
        <form onSubmit={handleCreateAccount} className="space-y-4">
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
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              placeholder="Create a strong password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!isLoaded || isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Verification code
            </label>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              inputMode="numeric"
              placeholder="Enter code"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!isLoaded || isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify and continue"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("details");
              setErrorMessage("");
              setCode("");
            }}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            Change email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-white/45">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}