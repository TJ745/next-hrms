"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBranchAction } from "@/actions/branch.actions";
import { Label } from "@/components/ui/label";

export default function BranchForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await createBranchAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Branch registered successfully.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Name</Label>
      <Input
        type="text"
        name="name"
        placeholder="Branch Name"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <Label>Phone</Label>
      <Input
        type="text"
        name="phone"
        placeholder="Phone"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <Label>Address</Label>
      <Input
        type="text"
        name="address"
        placeholder="Address"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <div className="mt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="w-[15%] rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
