import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ClockButtons from "./ClockButtons";

export default async function AttendancePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const attendances = await prisma.attendance.findMany({
  //   where: { date: today },
  //   include: { employee: { include: { user: true } }, shift: true },
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Today&apos;s Attendance</h1>

      <ClockButtons />

      <div className="mt-6 grid gap-4">
        {/* {attendances.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-lg border bg-white shadow flex justify-between"
          >
            <div>
              <div className="font-medium">{a.employee.user.name}</div>
              <div className="text-sm text-muted-foreground">
                Clock In:{" "}
                {a.clockIn ? format(new Date(a.clockIn), "HH:mm") : "-"} | Clock
                Out: {a.clockOut ? format(new Date(a.clockOut), "HH:mm") : "-"}{" "}
                | Status: {a.status} | Overtime: {a.overtime ?? 0}h | Early
                Leave: {a.earlyLeave ?? 0}h
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
