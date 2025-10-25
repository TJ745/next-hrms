"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth-client";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    const password = String(formData.get("password"));
    if (!password) return toast.error("Password is required.");

    const confirmPassword = String(formData.get("confirmPassword"));
    if (password !== confirmPassword) {
      return toast.error("Password does not match.");
    }

    await resetPassword({
      newPassword: password,
      token,
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
          toast.success("Password reset successfully.");
          router.push("/auth/login");
        },
      },
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Password */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          New Password
        </Label>
        <Input
          type="password"
          name="password"
          placeholder="********"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="********"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        Reset Password
      </Button>
    </form>
  );
};
