"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addSalaryHistoryAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN")
    return { error: "Unauthorized" };

  const employeeId = String(formData.get("employeeId"));
  const salary = Number(formData.get("salary"));
  const effectiveFrom = new Date(String(formData.get("effectiveFrom")));
  const reason = formData.get("reason")?.toString();

  if (!employeeId || !salary || !effectiveFrom)
    return { error: "Missing fields" };

  await prisma.$transaction([
    prisma.salaryHistory.create({
      data: {
        employeeId,
        salary,
        effectiveFrom,
        reason,
      },
    }),
    prisma.employee.update({
      where: { id: employeeId },
      data: { basicSalary: salary },
    }),
  ]);

  return { success: true };
}
