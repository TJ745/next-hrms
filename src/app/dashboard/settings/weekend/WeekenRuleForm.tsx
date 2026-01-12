"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBranchesAction } from "@/actions/branch.actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWeekendRuleAction } from "@/actions/weekend-rule.action";

export default function WeekendRuleForm({ branches }: any) {
  const [isPending, setIsPending] = useState(false);
  const [branchId, setBranchId] = useState("");
  const [day, setDay] = useState("");
  const [isOff, setIsOff] = useState("");

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
    const { error } = await createWeekendRuleAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Weekend Rule registered successfully.");
      router.refresh();
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Day</Label>
      <Select name="day" onValueChange={setDay}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Day" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>Off Day</Label>
      <Select name="isOff" onValueChange={setIsOff}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Day Off" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="true">Off</SelectItem>
            <SelectItem value="false">Working</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
