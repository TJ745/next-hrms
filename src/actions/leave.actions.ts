"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { LeaveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";


/* ------------------ GET PENDING LEAVES ------------------ */

export async function getPendingLeaves() {
  return prisma.leaveRequest.findMany({
    where: { status: "PENDING" },
    include: {
      employee: { include: { user: true } },
      leaveType: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

/* ------------------ GET ALL LEAVES FOR CALENDAR ------------------ */

export async function getAllLeavesForCalendar() {
  return prisma.leaveRequest.findMany({
    include: {
      employee: { include: { user: true } },
      leaveType: true,
    },
    orderBy: { fromDate: "asc" },
  });
}

/* ---------------------- APPLY LEAVE ---------------------- */
export async function applyLeaveAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  });
  if (!employee) throw new Error("Employee not found");

  const leaveTypeId = String(formData.get("leaveTypeId"));
  const fromDate = new Date(String(formData.get("fromDate")));
  const toDate = new Date(String(formData.get("toDate")));
  const reason = String(formData.get("reason") ?? "");

  // Create leave request
  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      leaveTypeId,
      fromDate,
      toDate,
      reason,
      status: LeaveStatus.PENDING,
    },
  });

  revalidatePath("/leave"); // Refresh page
}

/* ---------------------- APPROVE LEAVE ---------------------- */
export async function approveLeaveAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  const leaveId = String(formData.get("leaveId"));

  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { employee: true },
  });
  if (!leave) throw new Error("Leave not found");

  // Check if current user is manager of this employee
//   const employee = leave.employee;
//   if (employee.managerId !== session.user.id) {
//     throw new Error("Forbidden: Not manager");
//   }

  const manager = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  });
  if (!manager || leave.employee.managerId !== manager.id) {
    throw new Error("Manager record not found");
  }

  await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: LeaveStatus.APPROVED },
  });

  revalidatePath("/leave");
}

/* ---------------------- REJECT LEAVE ---------------------- */
export async function rejectLeaveAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  const leaveId = String(formData.get("leaveId"));

  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { employee: true },
  });
  if (!leave) throw new Error("Leave not found");

  const manager = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  });

  if (!manager || leave.employee.managerId !== manager.id) {
    throw new Error("Forbidden");
  }

  // Check if current user is manager of this employee
//   const employee = leave.employee;
//   if (employee.managerId !== session.user.id) {
//     throw new Error("Forbidden: Not manager");
//   }

  await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: LeaveStatus.REJECTED },
  });

  revalidatePath("/leave");
}


/* ------------------ CREATE LEAVE TYPE ------------------ */
export async function createLeaveTypeAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  // Only Admin/HR can create
  if (!["ADMIN", "HR"].includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  const name = String(formData.get("name"));
  const maxPerYear = Number(formData.get("maxPerYear"));
  const paid = Boolean(formData.get("paid"));

  await prisma.leaveType.create({
    data: { name, maxPerYear, paid },
  });

  revalidatePath("/leave/types");
}

/* ------------------ GET ALL LEAVE TYPES ------------------ */
export async function getLeaveTypes() {
  return prisma.leaveType.findMany();
}

/* ------------------ DELETE LEAVE TYPE ------------------ */
export async function deleteLeaveTypeAction(id: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Unauthorized");

  if (!["ADMIN", "HR"].includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  await prisma.leaveType.delete({ where: { id } });
  revalidatePath("/leave/types");
}