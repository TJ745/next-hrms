"use client";

import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

function MagicLinkForm() {
  const [isPending, setIsPending] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));
    if (!email) return toast.error("Email is required.");

    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/profile",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Magic Link sent successfully.");
          if (ref.current) ref.current.open = false;
          (evt.target as HTMLFormElement).reset();
        },
      },
    });
  }

  return (
    <details
      ref={ref}
      className="max-w-sm rounded-md border border-purple-600 overflow-hidden"
    >
      <summary className="flex gap-2 items-center px-2 py-1 bg-purple-600 text-white hover:bg-purple-600/80 transition">
        Try Magic Link <StarIcon size={16} />
      </summary>

      <form onSubmit={handleSubmit} className="px-2 py-1">
        <Label className="sr-only">Email</Label>
        <div className="flex gap-2 items-center">
          <Input type="email" name="email" placeholder="Enter your email" />
          <Button type="submit" disabled={isPending}>
            Send
          </Button>
        </div>
      </form>
    </details>
  );
}

export default MagicLinkForm;
