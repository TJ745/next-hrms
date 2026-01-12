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

// ---------------------- Holidays ----------------------
export async function createHolidayAction(formData: FormData) {
  const session = await getSession();
  const title = String(formData.get("title"));
  const date = new Date(String(formData.get("date")));
  const branchId = String(formData.get("branchId"));

  if (isNaN(date.getTime())) return { error: "Invalid date" };

  try {
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, companyId: session.user.companyId },
    });
    if (!branch) {
      throw new Error("Invalid branch — does not belong to your company");
    }

    const exists = await prisma.holiday.findFirst({
      where: { branchId, date },
    });
    if (exists) throw new Error("Holiday already exists for this date");

    const holiday = await prisma.holiday.create({
      data: {
        title,
        date,
        branchId,
      },
    });

    return { success: true, return: holiday };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create Holiday" };
  }
}

export async function updateHolidayAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id"));

  const holiday = await prisma.holiday.findFirst({
    where: {
      id,
      branch: { companyId: session.user.companyId },
    },
  });
  if (!holiday) throw new Error("Forbidden");

  const title = formData.get("title")
    ? String(formData.get("title"))
    : undefined;
  const date = formData.get("date")
    ? new Date(String(formData.get("date")))
    : undefined;
  return prisma.holiday.update({ where: { id }, data: { title, date } });
}

export async function deleteHolidayAction(id: string) {
  const session = await getSession();

  const holiday = await prisma.holiday.findFirst({
    where: { id, branch: { companyId: session.user.companyId } },
  });
  if (!holiday) throw new Error("Forbidden");
  return prisma.holiday.delete({ where: { id } });
}

export async function getHolidaysAction(branchId?: string) {
  const session = await getSession();
  return prisma.holiday.findMany({
    where: {
      branch: {
        companyId: session.user.companyId,
      },
      ...(branchId ? { branchId } : {}),
    },
    include: { branch: true },
  });
}
