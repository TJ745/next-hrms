import RegisterForm from "@/components/RegisterForm";
import { SignInOauthButton } from "@/components/SignInOauthButton";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Create an Account
        </h1>
        <div className="space-y-4">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
        <hr className="max-w-sm my-6" />
        <div className="flex flex-col gap-4">
          <SignInOauthButton signUp provider="github" />
          <SignInOauthButton signUp provider="google" />
        </div>
      </div>
    </div>
  );
}

export default page;
