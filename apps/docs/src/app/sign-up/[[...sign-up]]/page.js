import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign Up | Hyperiux Vault",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignUp />
    </div>
  );
}
