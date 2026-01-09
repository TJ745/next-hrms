"use client";

import { useEffect, useState } from "react";
import { getAllAttendanceAction } from "@/actions/attendance.actions";

type Attendance = {
  id: string;
  employeeName: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  workedMinutes?: number;
  overtimeMinutes?: number;
};

export default function AdminAttendance() {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const allAttendance = await getAllAttendanceAction();
      setAttendanceList(allAttendance);
    } catch (err: any) {
      setError(err.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">All Employees Attendance</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="">
            <th className="border px-4 py-2 text-left">Employee</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Check-in</th>
            <th className="border px-4 py-2">Check-out</th>
            <th className="border px-4 py-2">Worked Minutes</th>
            <th className="border px-4 py-2">Overtime</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((att) => (
            <tr key={att.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{att.employeeName}</td>
              <td className="border px-4 py-2">{att.status}</td>
              <td className="border px-4 py-2">
                {att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "-"}
              </td>
              <td className="border px-4 py-2">
                {att.checkOut
                  ? new Date(att.checkOut).toLocaleTimeString()
                  : "-"}
              </td>
              <td className="border px-4 py-2">{att.workedMinutes ?? "-"}</td>
              <td className="border px-4 py-2">{att.overtimeMinutes ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
