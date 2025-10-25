import { BackButton } from "@/components/BackButton";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/login");
  return (
    <div>
      <div className="space-y-8">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>

      <p className="text-muted-foreground">
        Please enter your new password. Make sure it is not shorter than 6
        characters.
      </p>

      <ResetPasswordForm token={token} />
    </div>
  );
}
