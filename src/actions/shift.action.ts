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

function timeToDate(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// ---------------------- Shifts ----------------------
export async function createShiftAction(formData: FormData) {
  const session = await getSession();
  const name = String(formData.get("name"));
  const start = String(formData.get("startTime"));
  const end = String(formData.get("endTime"));
  const graceMin = Number(formData.get("graceMin")) || 0;
  const companyId = session.user.companyId;

  if (!name || !start || !end) return { error: "Missing required fields" };

  const startTime = timeToDate(start);
  const endTime = timeToDate(end);

  try {
    const shift = await prisma.shift.create({
      data: {
        name,
        startTime,
        endTime,
        graceMin,
        // companyId
      },
    });

    return { success: true, return: shift };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create Shift" };
  }

  // return prisma.shift.create({
  //   data: { name, startTime, endTime, graceMin, companyId },
  // });
}

export async function updateShiftAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id"));
  const name = formData.get("name") ? String(formData.get("name")) : undefined;
  const startTime = formData.get("startTime")
    ? timeToDate(String(formData.get("startTime")))
    : undefined;
  const endTime = formData.get("endTime")
    ? timeToDate(String(formData.get("endTime")))
    : undefined;
  const graceMin = formData.get("graceMin")
    ? Number(formData.get("graceMin"))
    : undefined;

  return prisma.shift.update({
    where: { id },
    data: { name, startTime, endTime, graceMin },
  });
}

export async function deleteShiftAction(id: string) {
  return prisma.shift.delete({ where: { id } });
}

export async function getShiftsAction() {
  const session = await getSession();
  return prisma.shift.findMany({
    // where: { companyId: session.user.companyId },
  });
}
