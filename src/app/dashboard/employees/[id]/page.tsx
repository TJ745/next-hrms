import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, SlashIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import avatar from "../../../../../public/image/default.jpg";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GeneralFrom from "./GeneralFrom";
import JobForm from "./JobForm";
import PayrollForm from "./PayrollForm";
import DocumentsForm from "./DocumentsForm";
import SettingForm from "./SettingForm";

interface EmployeePageProps {
  params: { id: string };
}

export default async function page({ params }: EmployeePageProps) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
  });

  // ✅ Handle missing employee gracefully
  if (!employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold text-red-500">
          Employee not found
        </h2>
      </div>
    );
  }

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
            <BreadcrumbLink href="/dashboard/employees/directory">
              Employees Directory
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Employee Detail</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full overflow-x-auto">
        {/* Employees */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Employee Details</h1>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="col-span-1 bg-primary-foreground p-4 rounded-xl">
              <Card className="flex flex-col items-center p-4 text-center shadow-sm transition hover:shadow-md">
                <Image
                  src={employee.image || avatar}
                  alt={employee.name}
                  width={70}
                  height={70}
                  className="rounded-full object-cover"
                />
                <CardContent className="space-y-4">
                  <h3 className="text-base font-semibold">{employee.name}</h3>
                  <p className="text-sm text-gray-500">
                    {employee.position || "—"}
                  </p>
                  {employee.status && (
                    <Badge
                      className={`${
                        employee.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </Badge>
                  )}
                  <hr />
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-2 mt-2">
                    <Mail size={14} /> {employee.email}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                    <Phone size={14} /> {employee.phone}
                  </p>
                  <hr />
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-2 mt-2">
                    Department
                  </p>
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                    Branch
                  </p>
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                    Manager
                  </p>
                  {/* {employee.department && (
                    <Badge variant="outline">{employee.department.name}</Badge>
                  )} */}
                  <Button className="w-full mt-6">Action</Button>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3 bg-primary-foreground p-4 rounded-xl">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="h-[50px] w-full gap-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="job">Job</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="setting">Setting</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <GeneralFrom employee={employee} />
                </TabsContent>

                <TabsContent value="job">
                  <JobForm />
                </TabsContent>

                <TabsContent value="payroll">
                  <PayrollForm />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentsForm />
                </TabsContent>

                <TabsContent value="setting">
                  <SettingForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
