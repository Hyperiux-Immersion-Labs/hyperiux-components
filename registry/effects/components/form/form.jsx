"use client";

import { useCallback, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const baseFieldClassName =
  "w-full rounded-3xl border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none transition focus:border-black/30";

function defaultValidate(field, value) {
  if (field.required && (value === "" || value === false || value == null)) {
    return `${typeof field.label === "string" ? field.label.replace("*", "") : "This field"} is required.`;
  }
  if (field.type === "email" && value && !EMAIL_RE.test(value)) return "Invalid email address.";
  if (field.type === "phone" && value && value.replace(/\D/g, "").length < 7) return "Invalid phone number.";
  return undefined;
}

function buildInitialValues(fields) {
  const values = {};
  fields.forEach((field) => {
    values[field.name] = field.type === "checkbox" ? false : "";
  });
  return values;
}

function FieldShell({ label, error, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-black/75">{label}</span>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

export default function Form({
  fields = [],
  onSubmit,
  submitLabel = "Submit",
  loadingLabel = "Sending...",
  successMessage = "Form submitted successfully.",
  errorMessage = "Error sending message. Please try again.",
}) {
  const [values, setValues] = useState(() => buildInitialValues(fields));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  }, []);

  const clearError = useCallback((name) => {
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }, []);

  const validateField = useCallback((field, value) => {
    const builtIn = defaultValidate(field, value);
    if (builtIn) return builtIn;
    if (field.validate) return field.validate(value);
    return undefined;
  }, []);

  const validateAll = useCallback(() => {
    const nextErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) nextErrors[field.name] = error;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fields, validateField, values]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateAll()) return;

      setIsLoading(true);
      setFailed(false);

      try {
        await onSubmit?.(values);
        setSubmitted(true);
        setValues(buildInitialValues(fields));
        setTimeout(() => setSubmitted(false), 7000);
      } catch {
        setFailed(true);
        setTimeout(() => setFailed(false), 7000);
      } finally {
        setIsLoading(false);
      }
    },
    [fields, onSubmit, validateAll, values]
  );

  const renderField = (field) => {
    const value = values[field.name];
    const error = errors[field.name];
    const commonChange = (nextValue) => {
      setValue(field.name, nextValue);
      clearError(field.name);
    };

    if (field.type === "checkbox") {
      return (
        <label key={field.name} className="flex items-start gap-3 rounded-3xl border border-black/10 p-4">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => commonChange(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm text-black/80">{field.label}</span>
          {error ? <span className="ml-auto text-sm text-red-600">{error}</span> : null}
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <FieldShell key={field.name} label={field.label} error={error}>
          <select
            value={value}
            onChange={(event) => commonChange(event.target.value)}
            className={baseFieldClassName}
          >
            <option value="">Select an option</option>
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );
    }

    if (field.type === "textarea") {
      return (
        <FieldShell key={field.name} label={field.label} error={error}>
          <textarea
            rows={field.rows || 4}
            value={value}
            onChange={(event) => commonChange(event.target.value)}
            className={baseFieldClassName}
          />
        </FieldShell>
      );
    }

    return (
      <FieldShell key={field.name} label={field.label} error={error}>
        <input
          type={field.type === "phone" ? "tel" : field.type || "text"}
          value={value}
          onChange={(event) => commonChange(event.target.value)}
          className={baseFieldClassName}
        />
      </FieldShell>
    );
  };

  return (
    <section className="w-full">
      <form
        autoComplete="off"
        className="space-y-5 rounded-[2rem] border border-black/10 bg-[#f7f3eb] p-6 md:p-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-black">Get in touch</h2>
          <p className="text-sm text-black/65">
            Use the field config to build your form schema and wire your own submit handler.
          </p>
        </div>

        {fields.map((field) => renderField(field))}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? loadingLabel : submitLabel}
        </button>

        {submitted ? <p className="text-sm text-green-700">{successMessage}</p> : null}
        {failed ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      </form>
    </section>
  );
}
