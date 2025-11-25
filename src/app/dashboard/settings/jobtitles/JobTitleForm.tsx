"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { createJobTitleAction } from "@/actions/jobtitle.actions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JobTitleForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await createJobTitleAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Job Title registered successfully.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Job Title</Label>
      <Input
        type="text"
        name="name"
        placeholder="Job Title"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <Label>Status</Label>
      <Select onValueChange={(value) => setStatus(value)} name="status">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">In Active</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

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
