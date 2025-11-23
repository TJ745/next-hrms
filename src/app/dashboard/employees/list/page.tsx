import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { AddEmployee } from "./AddEmployee";
import { getDepartmentsAction } from "@/actions/department.actions";
import { DownloadEmployeesButton } from "./DownloadEmployeeList";
import { getEmployeesAction } from "@/actions/employee.actions";

async function AllEmployees() {
  const departments = await getDepartmentsAction();
  const employees = await getEmployeesAction();

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
              <DownloadEmployeesButton employees={employees} />
              <AddEmployee departments={departments} />
            </div>
          </div>
          <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4 mt-4">
            <DataTable columns={columns} data={employees} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default AllEmployees;
