import { BackButton } from "@/components/BackButton";
import LoginForm from "@/components/LoginForm";
import MagicLinkForm from "@/components/MagicLinkForm";
import { SignInOauthButton } from "@/components/SignInOauthButton";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <BackButton href="/" label="Home" />
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Sign In
        </h1>
        <div className="space-y-4">
          <MagicLinkForm />
          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
        <hr className="max-w-sm my-6  " />
        <div className="flex flex-col gap-4  ">
          <SignInOauthButton provider="github" />
          <SignInOauthButton provider="google" />
        </div>
      </div>
    </div>
  );
}

export default page;
