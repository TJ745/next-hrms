"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AttendanceStatus } from "@prisma/client";

/* ---------------------------------- utils --------------------------------- */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function diffMinutes(a: Date, b: Date) {
  return Math.max(0, Math.floor((a.getTime() - b.getTime()) / 60000));
}

/* --------------------------------- session -------------------------------- */
async function getEmployeeFromSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
    include: {
      shift: true,
      department: {
        include: {
          branch: { include: { geoFences: true } },
        },
      },
    },
  });

  if (!employee) throw new Error("Employee not found");
  return employee;
}

/* --------------------------------- getters -------------------------------- */
export async function getTodayAttendanceAction() {
  const employee = await getEmployeeFromSession();

  return prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
  });
}

/* --------------------------------- CHECK IN -------------------------------- */
export async function checkInAction({
  lat,
  lng,
}: {
  lat?: number;
  lng?: number;
}) {
  const employee = await getEmployeeFromSession();
  if (!employee.shift) throw new Error("Shift not assigned");

  const now = new Date();

  // Prevent duplicate check-in
  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
  });

  if (existing?.checkIn) {
    throw new Error("Already checked in");
  }

  /* -------------------------- late / present logic ------------------------- */
  const shiftStart = new Date(now);
  shiftStart.setHours(
    employee.shift.startTime.getHours(),
    employee.shift.startTime.getMinutes(),
    0,
    0
  );

  const graceMs = employee.shift.graceMin * 60 * 1000;
  const status =
    now.getTime() > shiftStart.getTime() + graceMs
      ? AttendanceStatus.LATE
      : AttendanceStatus.PRESENT;

  /* ------------------------------ create record ---------------------------- */
  return prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: employee.id,
        date: startOfToday(),
      },
    },
    update: {
      checkIn: now,
      lat,
      lng,
      status,
    },
    create: {
      employeeId: employee.id,
      date: startOfToday(),
      checkIn: now,
      lat,
      lng,
      status,
    },
  });
}

/* -------------------------------- CHECK OUT -------------------------------- */
export async function checkOutAction() {
  const employee = await getEmployeeFromSession();
  if (!employee.shift) throw new Error("Shift not assigned");

  const attendance = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
  });

  if (!attendance?.checkIn) {
    throw new Error("Check-in required");
  }

  if (attendance.checkOut) {
    throw new Error("Already checked out");
  }

  const now = new Date();

  /* ---------------------- worked & overtime calculation -------------------- */
  const shiftEnd = new Date(now);
  shiftEnd.setHours(
    employee.shift.endTime.getHours(),
    employee.shift.endTime.getMinutes(),
    0,
    0
  );

  const workedMinutes = diffMinutes(now, attendance.checkIn);
  const overtimeMinutes = now > shiftEnd ? diffMinutes(now, shiftEnd) : 0;

  return prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOut: now,
      workedMinutes,
      overtimeMinutes,
    },
  });
}

/* ------------------------------ MONTH SUMMARY ------------------------------ */
export async function getMonthlyAttendanceSummaryAction(
  month: number,
  year: number
) {
  const employee = await getEmployeeFromSession();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const records = await prisma.attendance.findMany({
    where: {
      employeeId: employee.id,
      date: { gte: start, lte: end },
    },
  });

  return {
    totalDays: records.length,
    presents: records.filter((r) => r.status === "PRESENT").length,
    late: records.filter((r) => r.status === "LATE").length,
    absents: records.filter((r) => r.status === "ABSENT").length,
    workedMinutes: records.reduce((a, b) => a + (b.workedMinutes ?? 0), 0),
    overtimeMinutes: records.reduce((a, b) => a + (b.overtimeMinutes ?? 0), 0),
  };
}

export async function getAllAttendanceAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  if (session.user.role === "EMPLOYEE") {
    throw new Error("Forbidden");
  }

  const records = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startOfToday(),
        lte: endOfToday(),
      },
    },
    include: {
      employee: {
        include: {
          user: true,
          shift: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    employeeName: r.employee.user.name,
    status: r.status,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    workedMinutes:
      r.checkIn && r.checkOut
        ? Math.floor((r.checkOut.getTime() - r.checkIn.getTime()) / 60000)
        : 0,
    overtimeMinutes: r.checkOut && r.employee.shiftId ? 0 : 0, // extend logic if needed
  }));
}
