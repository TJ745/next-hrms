"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createDepartmentAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");

  const name = String(formData.get("name"));
  // const branchId = String(formData.get("branchId"));



  try {
       // 🔹 Check that the company exists
      const branch = await prisma.branch.findFirst({
        where: { createdBy: session.user.id },
      });
      if (!branch) {
        return { error: "Branch not found. Please create a branch first." };
      }
  
  
      // 🏢 Create company linked to admin
      const department = await prisma.department.create({
        data: {
      name,
      // branchId,
         branch: { connect: { id: branch.id } },
        creator: { connect: { id: session.user.id } },
      // createdBy: session.user.id,
    },include: {
          branch: true,
          creator: true,
        },
        
      });
  
      return { success: true, department };
    } catch (err) {
      console.error(err);
      return { error: "Failed to create department" };
    }
}

export async function getDepartmentsAction(branchId: string) {
  return await prisma.department.findMany({
    where: { branchId },
    include: { branch: true },
  });
}

export async function updateDepartmentAction(id: string, data: any) {
  return await prisma.department.update({ where: { id }, data });
}

export async function deleteDepartmentAction(id: string) {
  return await prisma.department.delete({ where: { id } });
}
