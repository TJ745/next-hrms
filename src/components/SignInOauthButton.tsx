"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface SignInOauthButtonProps {
  provider: "github" | "google";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {},
      },
    });
  }

  const action = signUp ? "Up" : "In";
  const providerName = provider === "github" ? "GitHub" : "Google";

  return (
    <Button onClick={handleClick}>
      Sign {action} with {providerName}
    </Button>
  );
};
