import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign In | Hyperiux Vault",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignIn />
    </div>
  );
}
