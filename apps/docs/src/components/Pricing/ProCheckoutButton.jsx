"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProCheckoutButton({
  billingInterval,
  children,
  className = "",
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingInterval,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("CHECKOUT_BUTTON_ERROR:", error);
      alert(error.message || "Unable to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Opening checkout..." : children}
    </button>
  );
}