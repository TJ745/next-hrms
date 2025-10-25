import AppSidebar from "@/components/AppSidebar";
import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/DeleteUserButton";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserRoleSelect } from "@/components/UserRoleSelect";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center bg-gray-100 p-4">
        <p className="text-red-500">
          You are not an admin!
          <br /> Please Log in with Admin Credentials.
        </p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    // <div className="flex flex-col min-h-screen items-center  p-4">
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Navbar />

          <div className="w-full overflow-x-auto">
            <table className="table-auto min-w-full whitespace-nowrap">
              <thead>
                <tr className="border-b text-sm">
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b text-sm text-center">
                    <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    {/* <td className="px-4 py-2">{user.role}</td> */}
                    <td className="px-4 py-2">
                      <UserRoleSelect userId={user.id} role={user.role} />
                    </td>
                    <td className="px-4 py-2">
                      {user.role === "USER" ? (
                        <DeleteUserButton userId={user.id} />
                      ) : (
                        <PlaceholderDeleteUserButton />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Dashboard;
