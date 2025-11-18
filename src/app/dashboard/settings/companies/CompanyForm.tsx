"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { updateCompanyAction } from "@/actions/create-company.action";
import CompanyLogoInput from "./CompanyLogo";
import { Company } from "@/generated/prisma";

interface CompanyFormProps {
  company: Company | null;
}

export default function CompanyForm({company}: CompanyFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await updateCompanyAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Company updated successfully.");
      router.refresh();
        setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-2">
      <Label>Company Name</Label>
      <Input name="name" defaultValue={company?.name || ""} />
      
       <CompanyLogoInput defaultLogo={company?.logo || ""} />
        
        <Label>VAT Number</Label>
        <Input name="vatNumber" defaultValue={company?.vatNumber || ""} />
        <Label>CR Number</Label>
        <Input name="crNumber" defaultValue={company?.crNumber || ""} />
        <Label>Phone</Label>
        <Input name="phone" defaultValue={company?.phone || ""} />
        <Label>Email</Label>
        <Input name="email" defaultValue={company?.email || ""} />
        <Label>Website</Label>
        <Input name="website" defaultValue={company?.website || ""} />
        <Label>Address</Label>
        <Input name="address" defaultValue={company?.address || ""} />
      <div className="mt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="w-[15%] rounded-lg bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
