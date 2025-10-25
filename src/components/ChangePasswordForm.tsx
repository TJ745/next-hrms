"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { changePasswordAction } from "@/actions/change-password.action";

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);
    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await changePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully!");
      (evt.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label>Current Password</Label>
        <Input name="currentPassword" type="password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>New Password</Label>
        <Input type="password" name="newPassword" />
      </div>
      <Button type="submit" disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
};
