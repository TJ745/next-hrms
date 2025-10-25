import { BackButton } from "@/components/BackButton";

export default function Page() {
  return (
    <div>
      <div className="space-y-8">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Success</h1>
      </div>

      <p className="text-muted-foreground">
        A password reset link has been sent to your email address.
      </p>
    </div>
  );
}
