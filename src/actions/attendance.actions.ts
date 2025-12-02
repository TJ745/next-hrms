  "use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

function getHoursDiff(start: Date, end: Date) {
  return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
}

// Clock-in
export async function clockIn(employeeId: string, shiftId?: string) {
const headersList = await headers();
const session = await auth.api.getSession({ headers: headersList });

  // "use server";

  const employee = await prisma.employee.findUnique({
  where: {  userId : session?.user.id  },
});

if (!employee) {
  throw new Error("Employee not found. Please create employee first.");
}

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId:employee.id, date: today },
  });

  if (existing) throw new Error("Already clocked in today");

  const shift = shiftId ? await prisma.shift.findUnique({ where: { id: shiftId } }) : null;

  let status = "PRESENT";
  if (shift && new Date() > shift.startTime) status = "LATE";

  const attendance = await prisma.attendance.create({
    data: {
      employeeId:employee.id,
      date: today,
      clockIn: new Date(),
      status,
      shiftId: shift?.id,
    },
  });

  revalidatePath("/attendance");
  return attendance;
}

// Clock-out
export async function clockOut(employeeId: string) {
  const headersList = await headers();
const session = await auth.api.getSession({ headers: headersList });
  // "use server";

  const employee = await prisma.employee.findUnique({
    where: { userId: session?.user.id },
  });
  if (!employee) throw new Error("Employee not found");

const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId:employee.id, date: today },include:{shift:true},
  });

  // const attendance = await prisma.attendance.findUnique({ where: { id: employeeId }, include: { shift: true } });
  if (!attendance) throw new Error("Attendance not found");

  const now = new Date();
  let earlyLeave = 0;
  let overtime = 0;

  if (attendance.shift) {
    const shiftEnd = attendance.shift.endTime;
    if (now < shiftEnd) earlyLeave = getHoursDiff(now, shiftEnd);
    else overtime = getHoursDiff(shiftEnd, now);
  }

  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      clockOut: now,
      earlyLeave,
      overtime,
    },
  });

  revalidatePath("/attendance");
  return updated;
}

// Optional: mark absent
export async function markAbsent(employeeId: string, date: Date) {
  // "use server";
  const employee = await prisma.employee.findUnique({
    where: { employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId: employee.id, date: today },
  });
  if (existing) throw new Error("Attendance already exists for this date");

  const attendance = await prisma.attendance.create({
    data: { employeeId: employee.id, date: today, status: "ABSENT" },
  });
  revalidatePath("/attendance");
  return attendance;
}

// Create Shift
export async function createShift(name: string, startTime: Date, endTime: Date,employeeIds: string[] = []) {
  // "use server";
  const employees = await prisma.employee.findMany({
    where: { employeeId: { in: employeeIds } },
  });

  const shift = await prisma.shift.create({
    data: {
      name,
      startTime,
      endTime,
      employees: {
        connect: employees.map((e) => ({ id: e.id })),
      },
    },
  });

  return shift;
}
