"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateEmpImageAction } from "@/actions/employee.actions";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

interface EmpImageProps {
  employeeId: string; // 👈 REQUIRED
}

export default function EmpImage({ employeeId }: EmpImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();


  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPending(true);

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("image", file);

    const { error } = await updateEmpImageAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Employee Image updated successfully.");
      router.refresh();
        setIsPending(false);
    }
  }

  return (
  <div>
      {/* hidden input */}
      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* button */}
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Camera /> {isPending ? "Updating..." : "Change Image"}
      </Button>
    </div>);
}
