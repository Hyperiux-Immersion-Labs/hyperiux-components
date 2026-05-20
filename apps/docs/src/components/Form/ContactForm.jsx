
"use client";

/**
 *
 * ─── Props
 *
 * fields: FieldConfig[]
 * Array that drives EVERY form field. Each object can be:
 *

 * onSubmit: async (data: Record<string, any>) => void
 * Called with the collected form data when validation passes.
 * Should throw on failure so the form can show the error banner.
 *
 * submitLabel?: string (default"Submit")
 * loadingLabel?: string (default"Sending...")
 * successMessage?: string (default" Form submitted successfully!")
 * errorMessage?: string (default" Error sending message. Please try again.")
 *
 * Built-in validation  * - required fields checked automatically
 * - email fields validated with regex
 * - phone fields validated for minimum length
 * - Each field can supply its own `validate(value) => string | undefined`

 */

import React, { useState, useCallback } from"react";
import Input from"./Input";
import Textarea from"./Textarea";
import Select from"./Select";
import PhoneInput from"./PhoneInput";
import Checkbox from"./Checkbox";
import Button from"./Button";


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function defaultValidate(field, value) {
 if (field.required && (value ==="" || value === false || value == null)) {
 return `${typeof field.label ==="string" ? field.label.replace("*","") :"This field"} is required.`;
 }
 if (field.type ==="email" && value && !EMAIL_RE.test(value)) {
 return"Invalid email address.";
 }
 if (field.type ==="phone" && value && value.replace(/\D/g,"").length < 7) {
 return"Invalid phone number.";
 }
 return undefined;
}

function buildInitialValues(fields) {
 const values = {};
 for (const f of fields) {
 if (f.type ==="checkbox") values[f.name] = false;
 else if (f.type ==="select") values[f.name] ="";
 else values[f.name] ="";
 }
 return values;
}

// component 
export default function ContactForm({
 fields = [],
 onSubmit,
 submitLabel ="Submit",
 loadingLabel ="Sending...",
 successMessage =" Form submitted successfully!",
 errorMessage =" Error sending message. Please try again.",
}) {
 const [values, setValues] = useState(() => buildInitialValues(fields));
 const [errors, setErrors] = useState({});
 const [isLoading, setIsLoading] = useState(false);
 const [submitted, setSubmitted] = useState(false);
 const [failed, setFailed] = useState(false);

 // ── value helpers ──
 const setValue = useCallback((name, value) => {
 setValues((prev) => ({ ...prev, [name]: value }));
 }, []);

 const clearError = useCallback((name) => {
 setErrors((prev) => {
 if (!prev[name]) return prev;
 const next = { ...prev };
 delete next[name];
 return next;
 });
 }, []);

 // ── per-field validation ──
 const validateField = useCallback(
 (field, value) => {
 // Run built-in checks first
 const builtIn = defaultValidate(field, value);
 if (builtIn) return builtIn;
 // Then custom validator
 if (field.validate) return field.validate(value);
 return undefined;
 },
 []
 );

 // ── full-form validation ──
 const validateAll = useCallback(() => {
 const newErrors = {};
 for (const f of fields) {
 const err = validateField(f, values[f.name]);
 if (err) newErrors[f.name] = err;
 }
 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 }, [fields, values, validateField]);

 // ── submit ──
 const handleSubmit = useCallback(
 async (e) => {
 e.preventDefault();
 if (!validateAll()) return;

 setIsLoading(true);
 setFailed(false);

 try {
 await onSubmit(values);
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
 [fields, values, validateAll, onSubmit]
 );

 // ── render field ──
 const renderField = (field) => {
 const { name, type, label, options, rows, defaultCountry } = field;
 const value = values[name];
 const error = errors[name];

 const commonChange = (val) => {
 setValue(name, val);
 clearError(name);
 };

 switch (type) {
 case"textarea":
 return (
 <Textarea
 key={name}
 id={name}
 label={label}
 rows={rows}
 value={value}
 onChange={(e) => commonChange(e.target.value)}
 error={error}
 />
 );

 case"select":
 return (
 <Select
 key={name}
 id={name}
 label={label}
 options={options || []}
 value={value}
 onChange={(e) => commonChange(e.target.value)}
 error={error}
 />
 );

 case"phone":
 return (
 <PhoneInput
 key={name}
 id={name}
 label={label}
 value={value}
 onChange={(val) => commonChange(val)}
 defaultCountry={defaultCountry ||"IN"}
 error={error}
 />
 );

 case"checkbox":
 return (
 <Checkbox
 key={name}
 id={name}
 label={label}
 checked={!!value}
 onChange={(checked) => commonChange(checked)}
 error={error}
 />
 );

 // text | email | url | number | password |
 default:
 return (
 <Input
 key={name}
 id={name}
 label={label}
 type={type ||"text"}
 value={value}
 onChange={(e) => commonChange(e.target.value)}
 error={error}
 />
 );
 }
 };

 return (
 <section className="h-full w-full" id="contact-form">
 <div className="w-full h-full">
 <div className="w-full flex flex-col gap-[2vw]">
 <form
 autoComplete="off"
 className="space-y-[1.2vw] max-sm:space-y-[4vw] max-md:space-y-[4vw]"
 onSubmit={handleSubmit}
 >
 {fields.map((field) => renderField(field))}

 <div className="flex items-center justify-start max-sm:justify-center max-sm:mt-[10vw]">
 <Button
 type="submit"
 isLoading={isLoading}
 loadingText={loadingLabel}
 className="mt-[3vw] max-sm:mx-auto max-sm:mt-0 max-md:mt-[3vw]"
 >
 {submitLabel}
 </Button>
 </div>

 {submitted && (
 <p className="text-green-600 text-sm mt-2">{successMessage}</p>
 )}
 {failed && (
 <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
 )}
 </form>
 </div>
 </div>
 </section>
 );
}
