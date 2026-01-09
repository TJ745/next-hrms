import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">
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
      </div>
    </div>
  );
}

export default page;
