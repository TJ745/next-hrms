import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Asterisk,
  Building,
  Building2,
  Clock,
  LucideBuilding,
  SlashIcon,
  User,
  UserStar,
} from "lucide-react";
import React from "react";
import BranchForm from "./branches/BranchForm";
import { DataTable } from "./branches/data-table";
import { Branch, columns } from "./branches/columns";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import DepartmentForm from "./departments/DepartmentForm";
import { Department } from "./departments/columns";
import { DepartmentTable } from "./departments/data-table";
import JobTitleForm from "./jobtitles/JobTitleForm";
import { JobTitleTable } from "./jobtitles/data-table";
import UserForm from "./users/UserForm";
import { UserTable } from "./users/data-table";
import { Employee } from "../columns";
import { getBranchesAction } from "@/actions/branch.actions";
import CompanyForm from "./companies/CompanyForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function Settings() {
  const headersList = await headers();
  const session = await auth.api.getSession({headers: headersList});

  const branches = await getBranchesAction();

  const table: Branch[] = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    companyId: branch.companyId,
  }));

  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  const dept: Department[] = departments.map((department) => ({
    id: department.id,
    name: department.name,
    branchId: department.branchId,
  }));

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

  const company = await prisma.company.findUnique({
    where: { id: session?.user.companyId },
  });

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full overflow-x-auto mt-4">
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="h-[50px] w-full gap-2">
            <TabsTrigger value="company">
              <Building /> Company
            </TabsTrigger>
            <TabsTrigger value="branch">
              <Building2 /> Branches
            </TabsTrigger>
            <TabsTrigger value="department">
              <LucideBuilding /> Departments
            </TabsTrigger>
            <TabsTrigger value="jobTitle">
              <UserStar /> Job Titles
            </TabsTrigger>
            <TabsTrigger value="user">
              <User /> Users
            </TabsTrigger>
            <TabsTrigger value="workSchedule">
              <Clock /> Work Schedule
            </TabsTrigger>
            <TabsTrigger value="password">
              <Asterisk /> Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
                <CardDescription>
                  Make changes to your company info here. Click update when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <CompanyForm company={company} />
              </CardContent>
              
            </Card>
          </TabsContent>

          <TabsContent value="branch">
            <Card>
              <CardHeader>
                <CardTitle>Branches</CardTitle>
                <CardDescription>
                  Create and manage your company branches here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid ">
                <BranchForm />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DataTable columns={columns} data={table} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="department">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>
                  Create and manage your branch departments here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid ">
                <DepartmentForm branches={branches} />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DepartmentTable columns={columns} data={dept} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobTitle">
            <Card>
              <CardHeader>
                <CardTitle>Job Title</CardTitle>
                <CardDescription>
                  Create and manage your job title&apos;s here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <JobTitleForm />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                {/* <JobTitleTable columns={columns} data={dept} /> */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User</CardTitle>
                <CardDescription>
                  Create and manage your user&apos;s here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <UserForm />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <UserTable columns={columns} data={employees} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workSchedule">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Settings;
