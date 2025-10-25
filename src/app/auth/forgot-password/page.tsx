import { BackButton } from "@/components/BackButton";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function Page() {
  return (
    <div>
      <div className="space-y-8">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Forgot Password</h1>
      </div>

      <p className="text-muted-foreground">
        Please enter your email address to receive a password reset link.
      </p>

      <ForgotPasswordForm />
    </div>
  );
}
