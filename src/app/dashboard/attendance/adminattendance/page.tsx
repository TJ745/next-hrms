// "use client";

// import { useEffect, useState } from "react";
// import { getAllAttendanceAction } from "@/actions/attendance.actions";

// type Attendance = {
//   id: string;
//   employeeName: string;
//   date: string;
//   status: string;
//   checkIn: string | null;
//   checkOut: string | null;
//   workedMinutes?: number;
//   overtimeMinutes?: number;
// };

// export default function AdminAttendance() {
//   const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchAttendance = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const allAttendance = await getAllAttendanceAction();
//       setAttendanceList(allAttendance);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   return (
//     <div className="max-w-5xl mx-auto mt-10 p-6 shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">All Employees Attendance</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <table className="w-full table-auto border-collapse">
//         <thead>
//           <tr className="">
//             <th className="border px-4 py-2 text-left">Employee</th>
//             <th className="border px-4 py-2">Status</th>
//             <th className="border px-4 py-2">Check-in</th>
//             <th className="border px-4 py-2">Check-out</th>
//             <th className="border px-4 py-2">Worked Minutes</th>
//             <th className="border px-4 py-2">Overtime</th>
//           </tr>
//         </thead>
//         <tbody>
//           {attendanceList.map((att) => (
//             <tr key={att.id} className="hover:bg-gray-50">
//               <td className="border px-4 py-2">{att.employeeName}</td>
//               <td className="border px-4 py-2">{att.status}</td>
//               <td className="border px-4 py-2">
//                 {att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "-"}
//               </td>
//               <td className="border px-4 py-2">
//                 {att.checkOut
//                   ? new Date(att.checkOut).toLocaleTimeString()
//                   : "-"}
//               </td>
//               <td className="border px-4 py-2">{att.workedMinutes ?? "-"}</td>
//               <td className="border px-4 py-2">{att.overtimeMinutes ?? "-"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getAllAttendanceAction,
  checkInAction,
  checkOutAction,
} from "@/actions/attendance.actions";
import { format } from "date-fns";

export default function AdminAttendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchAll() {
    setLoading(true);
    try {
      const data = await getAllAttendanceAction();
      setRecords(data);
    } catch (err: any) {
      toast.error(err.message || "Error fetching records");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualCheckIn(employeeId: string) {
    try {
      await checkInAction({ employeeId });
      toast.success("Checked in manually");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Check-in failed");
    }
  }

  async function handleManualCheckOut(employeeId: string) {
    try {
      await checkOutAction({ employeeId });
      toast.success("Checked out manually");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Check-out failed");
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">All Employee Attendance</h2>
      <table className="w-full border rounded text-left">
        <thead>
          <tr>
            <th className="p-2">Employee</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Worked</th>
            <th>Overtime</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.employeeName}</td>
              <td>
                {r.checkIn ? format(new Date(r.checkIn), "hh:mm a") : "-"}
              </td>
              <td>
                {r.checkOut ? format(new Date(r.checkOut), "hh:mm a") : "-"}
              </td>
              <td>{r.status}</td>
              <td>{(r.workedMinutes / 60).toFixed(2)}h</td>
              <td>{(r.overtimeMinutes / 60).toFixed(2)}h</td>
              <td className="flex gap-2 p-2">
                <Button
                  size="sm"
                  onClick={() => handleManualCheckIn(r.employeeId)}
                  disabled={!!r.checkIn}
                >
                  Check In
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleManualCheckOut(r.employeeId)}
                  disabled={!r.checkIn || !!r.checkOut}
                >
                  Check Out
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
