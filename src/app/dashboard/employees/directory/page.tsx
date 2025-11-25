import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";

import { EmployeeCard } from "./EmployeeCard";
import { getEmployeesAction } from "@/actions/employee.actions";

async function Directory() {
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
            <BreadcrumbLink href="/dashboard/employees/directory">
              Employees Directory
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full overflow-x-auto">
        {/* Employees */}
        <div className="mt-4">
          <div>
            <h1 className="text-xl font-bold">Employees Directory</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {/* Directory content goes here */}
            {employees.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Directory;
