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
import { getOrgTree } from "@/lib/getOrgTree";
import OrgChartTree from "./OrgChartTree";

export const dynamic = "force-dynamic"; // ensures fresh data

async function page() {
  const data = await getOrgTree();

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
              <Button variant={"outline"}>
                <Save /> Print
              </Button>
            </div>
          </div>
          <div className="flex flex-col bg-secondary p-2 rounded-xl space-y-4 mt-4">
            <OrgChartTree nodes={data} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default page;
