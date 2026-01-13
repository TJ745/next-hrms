import { getEmployeeAction } from "@/actions/employee.actions";
import TimesheetTable from "./TimesheetTable";

export default async function Attendance({
  employeeId,
  month,
  year,
}: {
  employeeId: string;
  month: number;
  year: number;
}) {
  return (
    <TimesheetTable
      employeeId={employeeId}
      month={1} // 1–12
      year={2026} // 4-digit year
    />
  );
}
