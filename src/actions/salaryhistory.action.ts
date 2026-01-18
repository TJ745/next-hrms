"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addSalaryHistoryAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN")
    return { error: "Unauthorized" };

  const employeeId = String(formData.get("employeeId"));
  const effectiveFrom = new Date(String(formData.get("effectiveFrom")));
  const reason = formData.get("reason")?.toString();

  const basicSalary = Number(formData.get("basicSalary"));
  const housingAllowance = Number(formData.get("housingAllowance") || 0);
  const transportationAllowance = Number(
    formData.get("transportationAllowance") || 0
  );
  const foodAllowance = Number(formData.get("foodAllowance") || 0);
  const mobileAllowance = Number(formData.get("mobileAllowance") || 0);
  const otherAllowance = Number(formData.get("otherAllowance") || 0);

  if (!employeeId || !basicSalary || !effectiveFrom)
    return { error: "Missing fields" };

  const totalSalary =
    basicSalary +
    housingAllowance +
    transportationAllowance +
    foodAllowance +
    mobileAllowance +
    otherAllowance;

  await prisma.salaryHistory.create({
    data: {
      employeeId,
      basicSalary,
      housingAllowance,
      transportationAllowance,
      foodAllowance,
      mobileAllowance,
      otherAllowance,
      totalSalary,
      effectiveFrom,
      reason,
    },
  });

  return { success: true };
}
