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
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralFrom from "./GeneralFrom";
import JobForm from "./JobForm";
import PayrollForm from "./PayrollForm";
import DocumentsForm from "./DocumentsForm";
import { getEmployeeAction } from "@/actions/employee.actions";
import EmpImage from "./EmpImage";
import Image from "next/image";
import MedicalForm from "./MedicalForm";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const employee = await getEmployeeAction(id);

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
            <div className="col-span-1 bg-primary-foreground rounded-xl">
              <Card className="flex flex-col items-center text-center shadow-sm transition hover:shadow-md h-full">
                <Image
                  src={`${employee.image}`}
                  alt="Employee Image"
                  width={100}
                  height={100}
                  className="rounded-2xl"
                />
                <CardContent className="space-y-4">
                  <h3 className="text-base font-semibold">
                    {employee.user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {employee.jobTitle || "—"}
                  </p>
                  <Badge
                    variant={
                      employee.status === "Active" ? "success" : "destructive"
                    }
                    className="px-2 py-1"
                  >
                    {employee.status === "Active" ? "Active" : "Inactive"}
                  </Badge>
                  <hr />
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        <Mail size={14} />
                      </p>
                      <span className="text-xs">{employee.user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        <Phone size={14} />
                      </p>
                      <span className="text-xs">{employee.phone}</span>
                    </div>
                  </div>
                  <hr />
                  <div className="flex flex-col items-start gap-2 justify-between">
                    <p className="w-12 text-xs text-gray-400 gap-2">
                      Department
                    </p>
                    <span className="text-sm">
                      {employee.user.department?.name}
                    </span>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                      Branch
                    </p>
                    <span className="text-sm">
                      {employee.user.branch?.name}
                    </span>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                      Manager
                    </p>
                    <span className="text-sm">{"N/A"}</span>
                  </div>
                  <EmpImage employeeId={employee.id} />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3 bg-primary-foreground p-4 rounded-xl">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="h-[50px] w-full gap-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="job">Job</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <GeneralFrom employee={employee} />
                </TabsContent>

                <TabsContent value="job">
                  <JobForm employee={employee} />
                </TabsContent>

                <TabsContent value="payroll">
                  <PayrollForm employee={employee} />
                </TabsContent>

                <TabsContent value="medical">
                  <MedicalForm employee={employee} />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentsForm employee={employee} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
