import { Button } from "@/components/ui/button";
import { UpdateUserForm } from "@/components/UpdateUserForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/login");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headerList,
    body: {
      userId: session.user.id,
      permissions: {
        posts: ["update", "delete"],
      },
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="w-full max-w-md rounded-2xl bg-primary-foreground p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Profile
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          {session.user.role === "ADMIN" && (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
        <div className="text-2xl font-bold">Permissions</div>

        <div className="my-8">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="User Image"
              className="size-24 border border-primary rounded-md object-cover"
            />
          ) : (
            <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <span className="uppercase text-lg font-bold">
                {session.user.name.slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        <pre className="text-sm overflow-clip">
          {JSON.stringify(session, null, 2)}
        </pre>

        <div className="space-y-4 p-4 rounded-b-md border-t-8 border-blue-600">
          <h2 className="text-2xl font-bold">Update User</h2>

          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
