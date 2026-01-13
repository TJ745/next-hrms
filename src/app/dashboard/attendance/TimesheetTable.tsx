"use client";

import { useEffect, useState } from "react";
import { getMonthlyAttendanceSummaryAction } from "@/actions/attendance.actions";
import { format } from "date-fns";

export default function TimesheetTable({
  employeeId,
  month,
  year,
}: {
  employeeId?: string;
  month: number;
  year: number;
}) {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function fetchSummary() {
      const data = await getMonthlyAttendanceSummaryAction(
        month,
        year,
        employeeId
      );
      setSummary(data);
    }
    fetchSummary();
  }, [month, year, employeeId]);

  if (!summary) return <div>Loading...</div>;

  return (
    <table className="w-full border rounded text-left">
      <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Worked Hours</th>
          <th>Overtime</th>
        </tr>
      </thead>
      <tbody>
        {summary.records.map((r: any) => (
          <tr key={r.date} className="border-t">
            <td>{format(new Date(r.date), "dd/MM/yyyy")}</td>
            <td>{r.status}</td>
            <td>{r.checkIn ? format(new Date(r.checkIn), "hh:mm a") : "-"}</td>
            <td>
              {r.checkOut ? format(new Date(r.checkOut), "hh:mm a") : "-"}
            </td>
            <td>{(r.workedMinutes / 60).toFixed(2)}</td>
            <td>{(r.overtimeMinutes / 60).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
