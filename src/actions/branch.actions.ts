"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createBranchAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

   if (!session || !["ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized — only admin can create branches." };
  }

  const name = String(formData.get("name"));
    if (!name) return { error: "Branch name is required" };
  const address = String(formData.get("address"));
  // const companyId = String(formData.get("companyId"));
  const phone = String(formData.get("phone"));


  try {
    if (!session.user.companyId) {
  return { error: "User does not belong to a company" };
}

    // 🏢 Create company linked to admin
    const branch = await prisma.branch.create({
      data: {
      name,
      address,
      phone,
      companyId: session.user.companyId!,
    }
    });

    return { success: true, return: branch};
  } catch (err) {
    console.error(err);
    return { error: "Failed to create branch" };
  }
}

export async function getBranchesAction() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  return prisma.branch.findMany({
    where: { companyId: session?.user.companyId  },
    include:{
      company: true,
    }
  });
}

export async function updateBranchAction(id: string, data: any) {
  return await prisma.branch.update({ where: { id }, data });
}

export async function deleteBranchAction(id: string) {
  return await prisma.branch.delete({ where: { id } });
}
