import { BackButton } from "@/components/BackButton";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div>
      <div>
        <BackButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Login Error</h1>
      </div>

      <p className="text-destructive">
        {sp.error === "account_not_linked"
          ? "The account you are trying to sign in with is not linked. Please use the correct sign-in method."
          : "An error occurred during login. Please try again."}
      </p>
    </div>
  );
}
