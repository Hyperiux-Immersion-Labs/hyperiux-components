import AuthShell from "@/components/auth/AuthShell";
import AccessRequestForm from "@/components/auth/AccessRequestForm";

export const metadata = {
  title: "Request Access | Hyperiux Vault",
};

export default function SignUpPage() {
  return (
    <AuthShell>
      <AccessRequestForm />
    </AuthShell>
  );
}