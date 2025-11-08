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
  TrendingDown,
  TrendingUp,
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
import Image from "next/image";
import { getDashboardStatsAction } from "@/actions/dashboard.action";

async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  const { totalEmployees, totalBranches, totalDepartments } =
    await getDashboardStatsAction();

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

  const company = await prisma.company.findFirst({
    where: { createdBy: session.user.id },
  });

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
        {/* Welcome & Company Info */}

        <div className="grid grid-cols-3 gap-2 p-2 mt-2">
          <div className="col-span-1 space-y-1 bg-primary-foreground rounded-lg p-4">
            <h1 className="text-xl">
              Welcome Back,{" "}
              <span className="font-bold">{session.user.name}! 👋</span>
            </h1>
            <p className="text-sm">
              Here's what's happening with your company today.
            </p>
            <span></span>
          </div>
          <div className="col-span-2 bg-primary-foreground rounded-lg p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl">{company?.name}</h1>
              <span className="text-sm">{company?.address}</span>
              <span className="text-sm">{company?.createdBy}</span>
            </div>
            <div>
              {/* <Image
                src={`${company?.logo}`}
                alt="company logo"
                width={50}
                height={50}
              /> */}{" "}
              logo
            </div>
          </div>
        </div>

        {/* 1st Grid */}
        <div className="grid grid-cols-4  gap-2 p-2 mt-2">
          <div className="col-span-1 bg-primary-foreground rounded-lg flex items-center justify-between p-4">
            <div>
              <Users2 size={40} />
              <h1 className="text-lg font-bold">Total Employees</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h2 className="text-2xl">{totalEmployees}</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md text-red-600">
                <TrendingDown size={16} />
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
            <div className="flex flex-col items-center justify-center gap-1">
              <h2 className="text-2xl">{totalDepartments}</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md text-red-600">
                <TrendingDown size={16} />
              </span>
            </div>
          </div>
        </div>

        {/* 2nd Grid */}
        <div className="grid grid-cols-4 gap-2 p-2">
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
            <div className="flex flex-col items-center justify-center gap-1">
              <h2 className="text-2xl">{totalBranches}</h2>
              <span className="text-sm bg-accent px-2 py-1 rounded-md text-green-600">
                <TrendingUp size={16} />
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
          <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
            <h1 className="text-xl font-bold">Employees</h1>

            <DataTable columns={columns} data={employees} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
