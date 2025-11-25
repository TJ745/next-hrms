"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { JobTitle, Status } from "@/generated/prisma";

export async function createJobTitleAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");

  const userCompanyId = session.user.companyId;

  if (!userCompanyId) {
    throw new Error("User does not belong to any company");
  }

  const name = String(formData.get("name"));
  const status = (String(formData.get("status")) || "ACTIVE") as Status;

  try {
      // 🏢 Create company linked to admin
      const jobtitle = await prisma.jobTitle.create({
        data: {
      name,
      status,
      createdById: session.user.id,
        },
      });

      return { success: true, return: jobtitle};
    } catch (err) {
      console.error(err);
      return { error: "Failed to create job title" };
    }
}

export async function getJobTitleAction() {
  return await prisma.jobTitle.findMany({
    include: {
      createdBy:{ select: { id: true, name: true } 
    }
  }
  }) as JobTitle[];
}

export async function updateJobTitleAction(id: string, data: any) {
  return await prisma.jobTitle.update({ where: { id }, data });
}

export async function deleteJobTitleAction(id: string) {
  return await prisma.jobTitle.delete({ where: { id } });
}
