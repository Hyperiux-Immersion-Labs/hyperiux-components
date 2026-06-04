import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Sign In | Hyperiux Vault",
};

export default function SignInPage() {
  return (
    <AuthShell>
      <div className="hyperiux-clerk">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/effects"
          forceRedirectUrl="/effects"
        />
      </div>
    </AuthShell>
  );
}