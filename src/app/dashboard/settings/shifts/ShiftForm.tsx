"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createShiftAction } from "@/actions/shift.action";

export default function ShiftForm() {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await createShiftAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Work Schedule registered successfully.");
      router.refresh();
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Shift Name</Label>
      <Input
        type="text"
        name="name"
        placeholder="Shift Name"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <Label>Start Time</Label>
      <Input
        type="time"
        name="startTime"
        placeholder="Start Time"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <Label>End Time</Label>
      <Input
        type="time"
        name="endTime"
        placeholder="End Time"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <Label>Grace Minutes</Label>
      <Input
        type="number"
        name="graceMin"
        placeholder="Grace Minutes"
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
