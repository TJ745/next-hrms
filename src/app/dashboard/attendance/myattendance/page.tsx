// "use client";

// import { useEffect, useState } from "react";
// import {
//   getTodayAttendanceAction,
//   checkInAction,
//   checkOutAction,
// } from "@/actions/attendance.actions";

// type Attendance = {
//   id: string;
//   date: string;
//   status: string;
//   checkIn: string | null;
//   checkOut: string | null;
//   workedMinutes?: number;
//   overtimeMinutes?: number;
// };

// export default function EmployeeAttendance() {
//   const [attendance, setAttendance] = useState<Attendance | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchAttendance = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const today = await getTodayAttendanceAction();
//       setAttendance(today);
//     } catch (err: any) {
//       setError(err.message || "Failed to load attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckIn = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const updated = await checkInAction({ lat: null, lng: null });
//       setAttendance(updated);
//     } catch (err: any) {
//       setError(err.message || "Check-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckOut = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const updated = await checkOutAction();
//       setAttendance(updated);
//     } catch (err: any) {
//       setError(err.message || "Check-out failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">Today's Attendance</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {attendance ? (
//         <div className="space-y-3">
//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               className={
//                 attendance.status === "PRESENT"
//                   ? "text-green-600"
//                   : attendance.status === "LATE"
//                   ? "text-orange-600"
//                   : "text-gray-600"
//               }
//             >
//               {attendance.status}
//             </span>
//           </p>
//           <p>
//             <strong>Check-in:</strong>{" "}
//             {attendance.checkIn
//               ? new Date(attendance.checkIn).toLocaleTimeString()
//               : "Not checked in"}
//           </p>
//           <p>
//             <strong>Check-out:</strong>{" "}
//             {attendance.checkOut
//               ? new Date(attendance.checkOut).toLocaleTimeString()
//               : "Not checked out"}
//           </p>
//           {attendance.workedMinutes !== undefined && (
//             <p>
//               <strong>Worked Minutes:</strong> {attendance.workedMinutes} min
//             </p>
//           )}
//           {attendance.overtimeMinutes !== undefined && (
//             <p>
//               <strong>Overtime Minutes:</strong> {attendance.overtimeMinutes}{" "}
//               min
//             </p>
//           )}

//           <div className="flex gap-4 mt-4">
//             {!attendance.checkIn && (
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 onClick={handleCheckIn}
//               >
//                 Check In
//               </button>
//             )}
//             {attendance.checkIn && !attendance.checkOut && (
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 onClick={handleCheckOut}
//               >
//                 Check Out
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>No attendance record found for today.</p>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getTodayAttendanceAction,
  checkInAction,
  checkOutAction,
  getMonthlyAttendanceSummaryAction,
} from "@/actions/attendance.actions";
import { format } from "date-fns";

export default function EmployeeAttendance() {
  const [today, setToday] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchToday() {
    try {
      const data = await getTodayAttendanceAction();
      setToday(data);
    } catch (err: any) {
      toast.error(err.message || "Error fetching today attendance");
    }
  }

  async function fetchSummary() {
    try {
      const now = new Date();
      const data = await getMonthlyAttendanceSummaryAction(
        now.getMonth() + 1,
        now.getFullYear()
      );
      setSummary(data);
    } catch (err: any) {
      toast.error(err.message || "Error fetching summary");
    }
  }

  async function handleCheckIn() {
    setLoading(true);
    try {
      // Optional: get device geo location
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej)
      );
      await checkInAction({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      toast.success("Checked In!");
      fetchToday();
      fetchSummary();
    } catch (err: any) {
      toast.error(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    setLoading(true);
    try {
      await checkOutAction();
      toast.success("Checked Out!");
      fetchToday();
      fetchSummary();
    } catch (err: any) {
      toast.error(err.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchToday();
    fetchSummary();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Today's Attendance</h2>
      <div className="flex gap-4">
        <Button onClick={handleCheckIn} disabled={loading || today?.checkIn}>
          Check In
        </Button>
        <Button
          onClick={handleCheckOut}
          disabled={loading || !today?.checkIn || today?.checkOut}
        >
          Check Out
        </Button>
      </div>

      {today && (
        <div className="mt-4 p-4 border rounded space-y-2">
          <div>
            Check-in:{" "}
            {today.checkIn ? format(new Date(today.checkIn), "hh:mm a") : "-"}
          </div>
          <div>
            Check-out:{" "}
            {today.checkOut ? format(new Date(today.checkOut), "hh:mm a") : "-"}
          </div>
          <div>Status: {today.status}</div>
          <div>Worked Minutes: {today.workedMinutes ?? 0}</div>
          <div>Overtime Minutes: {today.overtimeMinutes ?? 0}</div>
        </div>
      )}

      {summary && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">Monthly Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            <div>Total Days: {summary.totalDays}</div>
            <div>Present: {summary.presents}</div>
            <div>Late: {summary.late}</div>
            <div>Absent: {summary.absents}</div>
            <div>Worked Hours: {(summary.workedMinutes / 60).toFixed(1)}</div>
            <div>
              Overtime Hours: {(summary.overtimeMinutes / 60).toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
