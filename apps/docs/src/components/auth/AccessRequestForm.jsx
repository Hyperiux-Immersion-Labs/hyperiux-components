"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccessRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "student",
    organisationName: "",
  });

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");

      if (data.temporaryPassword) {
        setMessage(
          `Dev mode password: ${data.temporaryPassword}. Use this with your email on the sign-in page.`
        );
        return;
      }

      setMessage(
        data.message ||
          "Your free account has been created. Check your email for the login password."
      );
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 p-8 backdrop-blur-xl max-sm:rounded-[1.5rem] max-sm:p-6">
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary">
          Hyperiux Vault
        </p>

        <h1 className="text-4xl font-normal tracking-[-0.05em]">
          Request free access
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/50">
          Fill the form and we’ll create your free account. You’ll receive your
          login password by email.
        </p>
      </div>

      {isSuccess ? (
        <div>
          <div className="rounded-3xl border border-primary/25 bg-primary/10 p-5 text-center">
            <p className="text-base font-medium text-white">
              Access request complete.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{message}</p>
          </div>

          <Link
            href="/sign-in"
            className="mt-5 block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover"
          >
            Go to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Full name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              placeholder="Your name"
              className="auth-input w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              placeholder="you@company.com"
              className="auth-input w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">
              I am a
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Student", value: "student" },
                { label: "Organisation", value: "organisation" },
                { label: "Other", value: "other" },
              ].map((option) => {
                const isActive = formData.userType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("userType", option.value)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {formData.userType === "organisation" && (
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Organisation name
              </label>
              <input
                type="text"
                value={formData.organisationName}
                onChange={(event) =>
                  updateField("organisationName", event.target.value)
                }
                required
                placeholder="Company / college / team name"
                className="auth-input w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
              />
            </div>
          )}

          {message && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Request free account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-white/45">
        Already have your password?{" "}
        <Link href="/sign-in" className="text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>

    </div>
  );
}