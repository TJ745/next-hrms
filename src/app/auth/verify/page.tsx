import { BackButton } from "@/components/BackButton";
import { SendVerificationEmail } from "@/components/SendVerificationEmail";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;

  if (!error) redirect("/profile");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Verify Email</h1>
        <div className="space-y-4">
          <SendVerificationEmail />
        </div>
        <p className="text-destructive">
          {error === "invalid_token" || error === "token_expired"
            ? "The verification token is invalid or has expired. Please try again."
            : error === "email_not_verified"
            ? "Verify your email or request a new verification email by clicking on the button below."
            : "An error occurred during email verification. Please try again."}
        </p>
      </div>
    </div>
  );
}
