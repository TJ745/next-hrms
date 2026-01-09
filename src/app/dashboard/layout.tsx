import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center bg-gray-100 p-4">
        <p className="text-red-500">
          You are not an admin!
          <br /> Please Log in with Admin Credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar role={session.user.role} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
