"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ---------------------- Helper ----------------------
async function getSession() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session || !["ADMIN", "HR"].includes(session.user.role))
    throw new Error("Unauthorized");
  return session;
}

// ---------------------- Weekend Rules ----------------------
export async function createWeekendRuleAction(formData: FormData) {
  const session = await getSession();
  const day = String(formData.get("day"));
  const isOff = formData.get("isOff") === "true";
  const branchId = String(formData.get("branchId"));

  try {
    // 🔹 Check that the branch exists
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, companyId: session.user.companyId },
    });
    if (!branch) {
      throw new Error("Invalid branch — does not belong to your company");
    }

    const exists = await prisma.weekendRule.findFirst({
      where: { branchId, day },
    });
    if (exists) throw new Error("Weekend rule already exists for this day");

    const weekendRule = await prisma.weekendRule.create({
      data: {
        day,
        isOff,
        branchId,
      },
    });

    return { success: true, return: weekendRule };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create Weekend Rule" };
  }
}

export async function updateWeekendRuleAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id"));

  const rule = await prisma.weekendRule.findFirst({
    where: {
      id,
      branch: { companyId: session.user.companyId },
    },
  });
  if (!rule) throw new Error("Forbidden");

  const day = formData.get("day") ? String(formData.get("day")) : undefined;
  const isOff = formData.get("isOff")
    ? formData.get("isOff") === "true"
    : undefined;

  return prisma.weekendRule.update({ where: { id }, data: { day, isOff } });
}

export async function deleteWeekendRuleAction(id: string) {
  const session = await getSession();

  const rule = await prisma.weekendRule.findFirst({
    where: { id, branch: { companyId: session.user.companyId } },
  });
  if (!rule) throw new Error("Forbidden");
  return prisma.weekendRule.delete({ where: { id } });
}

export async function getWeekendRulesAction(branchId?: string) {
  const session = await getSession();
  return prisma.weekendRule.findMany({
    where: {
      branch: { companyId: session.user.companyId },
      ...(branchId ? { branchId } : {}),
    },
    include: { branch: true },
  });
}
