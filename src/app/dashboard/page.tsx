import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Building2,
  File,
  FileMinus,
  FilePlus,
  GitBranch,
  SlashIcon,
  UserMinus,
  UserPlus,
  Users2,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { columns, Employee } from "./columns";
import { DataTable } from "./data-table";
import { ChartPieDonutText } from "@/components/TotalEmployeePieCHart";
import { ChartLineMultiple } from "@/components/TotalEmployeeLineChart";

async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  // Fetch employees from Prisma
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  // Map to Employee type
  const employees: Employee[] = users.map((user) => ({
    id: user.id,
    name: user.name ?? "N/A",
    email: user.email,
    role: user.role as "ADMIN" | "USER",
  }));

  return (
    <main className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-4 bg-secondary gap-2 p-2 mt-4 rounded-xl">
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <Users2 size={40} />
              <h1 className="text-lg font-bold">Total Employees</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">150</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <File size={40} />
              <h1 className="text-lg font-bold">Total Leaves</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">5</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <UserPlus size={40} />
              <h1 className="text-lg font-bold">New Employees</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">10</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <Building2 size={40} />
              <h1 className="text-lg font-bold">Total Department</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">20</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
        </div>

        {/* 2nd Grid */}
        <div className="grid grid-cols-4 bg-secondary gap-2 p-2 mt-4 rounded-xl">
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <UserMinus size={40} />
              <h1 className="text-lg font-bold">Resignations</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">3</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <FileMinus size={40} />
              <h1 className="text-lg font-bold">Total Absents</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">15</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <FilePlus size={40} />
              <h1 className="text-lg font-bold">New Jobs</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">10</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <GitBranch size={40} />
              <h1 className="text-lg font-bold">Total Branches</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl">20</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md">
                Down
              </span>
            </div>
          </div>
        </div>
        {/* Pie Chart */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="col-span-1 bg-secondary p-2 rounded-xl">
            <h1 className="text-xl font-bold">Total Employees</h1>
            <ChartPieDonutText />
          </div>
          <div className="col-span-1 bg-secondary p-2 rounded-xl">
            <h1 className="text-xl font-bold">Total Departments</h1>
            <ChartPieDonutText />
          </div>
          <div className="col-span-2 bg-secondary p-2 rounded-xl">
            <h1 className="text-xl font-bold">Team Performance</h1>
            <ChartLineMultiple />
          </div>
        </div>

        {/* Employees */}
        <div className="mt-4">
          <div className="bg-secondary p-2 rounded-xl space-y-4">
            <h1 className="text-xl font-bold">Employees</h1>

            <DataTable columns={columns} data={employees} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
