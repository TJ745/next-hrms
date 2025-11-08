"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createBranchAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");
  if (!["ADMIN", "HR_MANAGER"].includes(session.user.role))
    throw new Error("Forbidden");

  const name = String(formData.get("name"));
    if (!name) return { error: "Name is required" };
  const address = String(formData.get("address"));
  // const companyId = String(formData.get("companyId"));
  const phone = String(formData.get("phone"));


  try {
     // 🔹 Check that the company exists
    const company = await prisma.company.findFirst({
      where: { createdBy: session.user.id },
    });
    if (!company) {
      return { error: "Company not found. Please create a company first." };
    }


    // 🏢 Create company linked to admin
    const branch = await prisma.branch.create({
      data: {
      name,
      address,
      phone,
      company: { connect: { id: company.id } },
        creator: { connect: { id: session.user.id } },
    },include: {
        company: true,
        creator: true,
      },
    });

    return { success: true, branch };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create branch" };
  }
}

export async function getBranchesAction(companyId: string) {
  return await prisma.branch.findMany({
    where: { companyId },
    include: { company: true },
  });
}

export async function updateBranchAction(id: string, data: any) {
  return await prisma.branch.update({ where: { id }, data });
}

export async function deleteBranchAction(id: string) {
  return await prisma.branch.delete({ where: { id } });
}
