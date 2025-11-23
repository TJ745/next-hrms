import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Save, SlashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrgChartClient from "./OrgChartClient";
import { getAllEmployees, getOrgTree } from "@/actions/org-chart.actions";

export const dynamic = "force-dynamic"; // ensures fresh data



async function page() {
  const [employees, tree] = await Promise.all([getAllEmployees(), getOrgTree()]);

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
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Organization Chart</h1>
            <div className="flex space-x-2">
                          <Button variant={"outline"}><Save/> Print</Button>
                        </div>
          </div>
          <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4 mt-4">
            <OrgChartClient employees={employees} initialTree={tree} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default page;
