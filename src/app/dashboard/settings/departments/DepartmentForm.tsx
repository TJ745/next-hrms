"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { createDepartmentAction } from "@/actions/department.actions";
import { getBranchesAction } from "@/actions/branch.actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DepartmentForm({ branches }: any) {
  const [isPending, setIsPending] = useState(false);
  const [branchId, setBranchId] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function loadBranches() {
      const data = await getBranchesAction();
    }
    loadBranches();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("branchId", branchId);
    const { error } = await createDepartmentAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Department registered successfully.");
      router.refresh();
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Name</Label>
      <Input
        type="text"
        name="name"
        placeholder="Department Name"
        className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <Label>Branch</Label>
      <Select onValueChange={setBranchId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {branches.map((b: any) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
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
