"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/effects"
      afterSignUpUrl="/effects"
    >
      {children}
    </ClerkProvider>
  );
}