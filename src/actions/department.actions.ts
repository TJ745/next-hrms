"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createDepartmentAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");

  const userCompanyId = session.user.companyId;

  if (!userCompanyId) {
    throw new Error("User does not belong to any company");
  }

  const name = String(formData.get("name"));
  const branchId = String(formData.get("branchId"));
  if (!name || !branchId) {
    throw new Error("Name and Branch are required");
  }

  try {
    // 🔹 Check that the branch exists
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, companyId: userCompanyId },
    });
    if (!branch) {
      throw new Error("Invalid branch — does not belong to your company");
    }

    // 🏢 Create company linked to admin
    const department = await prisma.department.create({
      data: {
        name,
        branchId,
      },
    });

    return { success: true, return: department };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create department" };
  }
}

export async function getDepartmentsAction() {
  return await prisma.department.findMany({
    include: {
      branch: true,
    },
  });
}

export async function updateDepartmentAction(id: string, data: any) {
  return await prisma.department.update({ where: { id }, data });
}

export async function deleteDepartmentAction(id: string) {
  return await prisma.department.delete({ where: { id } });
}

export async function getDepartmentEmployees(departmentId: string) {
  return prisma.employee.findMany({
    where: { departmentId },
    include: { user: true, shift: true },
  });
}
