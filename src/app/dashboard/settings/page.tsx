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
  Calendar,
  Clock,
  Globe,
  LucideBuilding,
  SlashIcon,
  User,
  UserStar,
} from "lucide-react";
import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DataTable } from "@/components/Data-Table";

import BranchForm from "./branches/BranchForm";
import { BranchColumns } from "./branches/columns";
import { getBranchesAction } from "@/actions/branch.actions";

import { ChangePasswordForm } from "@/components/ChangePasswordForm";

import DepartmentForm from "./departments/DepartmentForm";
import { DepartmentColumns, DepartmentType } from "./departments/columns";
import { getDepartmentsAction } from "@/actions/department.actions";

import JobTitleForm from "./jobtitles/JobTitleForm";
import { jobTitleColumns, JobTitleType } from "./jobtitles/columns";
import { getJobTitleAction } from "@/actions/jobtitle.actions";

import UserForm from "./users/UserForm";
import { Employee } from "../columns";

import CompanyForm from "./companies/CompanyForm";
import { UserColumns } from "./users/columns";

import GeoFenceForm from "./geofence/GeoFenceForm";
import { GeoFenceColumns } from "./geofence/columns";
import { getGeoFencesAction } from "@/actions/geofence.actions";
import HolidayForm from "./holidays/HolidaysForm";
import { HolidayColumns } from "./holidays/columns";
import { getHolidaysAction } from "@/actions/holiday.action";
import WeekendRuleForm from "./weekend/WeekenRuleForm";
import { WeekendRuleColumns } from "./weekend/columns";
import { getWeekendRulesAction } from "@/actions/weekend-rule.action";
import ShiftForm from "./shifts/ShiftForm";
import { ShiftColumns } from "./shifts/columns";
import { getShiftsAction } from "@/actions/shift.action";

async function Settings() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const branches = await getBranchesAction();

  const departments = await getDepartmentsAction();

  const jobtitles = await getJobTitleAction();

  const geoFence = await getGeoFencesAction();

  const holiday = await getHolidaysAction();

  const weekendRule = await getWeekendRulesAction();

  const shifts = await getShiftsAction();

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

            <TabsTrigger value="geoFence">
              <Globe /> Geo Fence
            </TabsTrigger>
            <TabsTrigger value="holidays">
              <Calendar /> Holidays
            </TabsTrigger>
            <TabsTrigger value="weekendRules">
              <Calendar /> Weekend Rules
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
                  Make changes to your company info here. Click update when
                  you&apos;re done.
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
                <DataTable columns={BranchColumns} data={branches} />
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
                <DataTable
                  columns={DepartmentColumns}
                  data={departments as DepartmentType[]}
                />
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
                <DataTable
                  columns={jobTitleColumns}
                  data={jobtitles as JobTitleType[]}
                />
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
                <DataTable columns={UserColumns} data={employees} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geoFence">
            <Card>
              <CardHeader>
                <CardTitle>Geo Fence</CardTitle>
                <CardDescription>
                  Create and manage your geo fence here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <GeoFenceForm branches={branches} />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DataTable columns={GeoFenceColumns} data={geoFence} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holidays">
            <Card>
              <CardHeader>
                <CardTitle>Holidays</CardTitle>
                <CardDescription>
                  Create and manage your holidays here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <HolidayForm branches={branches} />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DataTable columns={HolidayColumns} data={holiday} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekendRules">
            <Card>
              <CardHeader>
                <CardTitle>Weekend Rules</CardTitle>
                <CardDescription>
                  Create and manage your weekend rules here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <WeekendRuleForm branches={branches} />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DataTable columns={WeekendRuleColumns} data={weekendRule} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workSchedule">
            <Card>
              <CardHeader>
                <CardTitle>Work Schedule</CardTitle>
                <CardDescription>
                  Create and manage your work schedule here.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <ShiftForm />
              </CardContent>
            </Card>
            <div className="mt-2">
              <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4">
                <DataTable columns={ShiftColumns} data={shifts} />
              </div>
            </div>
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
