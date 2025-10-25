import { BackButton } from "@/components/BackButton";

export default function Page() {
  return (
    <div>
      <div className="space-y-8">
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Email Verified</h1>
      </div>

      <p className="text-muted-foreground">
        Your email has been verified. You can now sign in.
      </p>
    </div>
  );
}
