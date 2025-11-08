import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileDown, Plus, SlashIcon } from "lucide-react";
import React from "react";
import { DataTable } from "../data-table";
import { columns, Employee } from "../columns";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { AddEmployee } from "./AddEmployee";

async function AllEmployees() {
  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
  });

  const emptable: Employee[] = employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    image: employee.image,
    email: employee.email,
    phone: employee.phone,
    empId: employee.empId,
    position: employee.position,
    status: employee.status as "ACTIVE" | "INACTIVE",
    departmentId: employee.departmentId,
    branchId: employee.branchId,
    companyId: employee.companyId,
    createdBy: employee.createdBy,
    userId: employee.userId,
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
            <BreadcrumbLink href="/dashboard/employees/list">
              Manage Employees
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full overflow-x-auto">
        {/* Employees */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">All Employees</h1>
            <div className="flex space-x-2">
              <Button variant="outline">
                <FileDown size={20} /> Download
              </Button>

              <AddEmployee />
            </div>
          </div>
          <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4 mt-4">
            <DataTable columns={columns} data={emptable} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default AllEmployees;
