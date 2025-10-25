"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgetPassword } from "@/lib/auth-client";

export const ForgotPasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Email is required.");

    await forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
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
        onSuccess: () => {
          toast.success("Reset link sent successfully to your email.");
          router.push("/auth/forgot-password/success");
        },
      },
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        Send Reset Link
      </Button>
    </form>
  );
};
