"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompanyAction } from "@/actions/create-company.action";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const { error } = await createCompanyAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success(
        "Company registered successfully. You are now redirecting to dashboard."
      );
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-primary-foreground p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Create Company</h1>

        <Input
          name="name"
          placeholder="Company Name"
          required
          className="w-full p-2 border rounded"
        />
        <Input
          name="logo"
          placeholder="Logo URL (optional)"
          className="w-full p-2 border rounded"
        />
        <Input
          name="vatNumber"
          placeholder="VAT Number"
          className="w-full p-2 border rounded"
        />
        <Input
          name="crNumber"
          placeholder="CR Number"
          className="w-full p-2 border rounded"
        />
        <Input
          name="phone"
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <Input
          name="email"
          type="email"
          placeholder="Company Email"
          className="w-full p-2 border rounded"
        />
        <Input
          name="website"
          placeholder="Website"
          className="w-full p-2 border rounded"
        />
        <Textarea
          name="address"
          placeholder="Address"
          className="w-full p-2 border rounded"
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Company
        </Button>
      </form>
    </div>
  );
}
