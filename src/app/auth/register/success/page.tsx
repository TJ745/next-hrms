import { BackButton } from "@/components/BackButton";

export default function Page() {
  return (
    <div>
      <div className="space-y-8">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Email Registered</h1>
      </div>

      <p className="text-muted-foreground">
        Your email has been registered. You can now check your email for the
        verification link.
      </p>
    </div>
  );
}
