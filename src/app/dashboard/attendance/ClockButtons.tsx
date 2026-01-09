"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInAction, checkOutAction } from "@/actions/attendance.actions";

export default function ClockButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const employeeId = "EMP001"; // Replace with logged-in employee
  const attendanceId = "ATTENDANCE_ID"; // Replace dynamically if needed

  async function handleClockIn() {
    setLoading(true);
    try {
      await checkInAction(employeeId);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    setLoading(true);
    try {
      await checkOutAction(attendanceId);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-4">
      <button onClick={handleClockIn} className="btn" disabled={loading}>
        Clock In
      </button>
      <button onClick={handleClockOut} className="btn" disabled={loading}>
        Clock Out
      </button>
    </div>
  );
}
