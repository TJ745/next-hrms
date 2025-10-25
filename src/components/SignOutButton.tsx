"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onReqeust: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Signed out successfully.");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button
      variant="text"
      size="text"
      onClick={handleSignOut}
      disabled={isPending}
    >
      Logout
    </Button>
  );
}

export default SignOutButton;
