import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { prisma } from "@/lib/prisma";
import { SlashIcon } from "lucide-react";
import React from "react";
import { EmployeeCard } from "./EmployeeCard";

async function Directory() {
  const employees = await prisma.employee.findMany({
    // orderBy: { name: "asc" },
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
            <span className="text-sm">This is employee directory</span>
          </div>
          <div className="grid grid-cols-4 rounded-xl space-y-4 mt-4 gap-4">
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
