"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInEmailAction } from "@/actions/sign-in-email.action";
import Link from "next/link";

function LoginForm() {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const { error } = await signInEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Logged in successfully. Good to have you back.");
      router.push("/profile");
    }
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

      {/* Password */}
      <div>
        <div className="flex justify-between items-center">
          <Label className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative mt-1">
          <Input
            name="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 p-2.5 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {/* {showPass ? <EyeOff size={18} /> : <Eye size={18} />} */}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
