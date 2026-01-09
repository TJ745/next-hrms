"use client";

import { useEffect, useState } from "react";
import {
  getTodayAttendanceAction,
  checkInAction,
  checkOutAction,
} from "@/actions/attendance.actions";

type Attendance = {
  id: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  workedMinutes?: number;
  overtimeMinutes?: number;
};

export default function EmployeeAttendance() {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const today = await getTodayAttendanceAction();
      setAttendance(today);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    try {
      const updated = await checkInAction({ lat: null, lng: null });
      setAttendance(updated);
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    try {
      const updated = await checkOutAction();
      setAttendance(updated);
    } catch (err: any) {
      setError(err.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Today's Attendance</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {attendance ? (
        <div className="space-y-3">
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                attendance.status === "PRESENT"
                  ? "text-green-600"
                  : attendance.status === "LATE"
                  ? "text-orange-600"
                  : "text-gray-600"
              }
            >
              {attendance.status}
            </span>
          </p>
          <p>
            <strong>Check-in:</strong>{" "}
            {attendance.checkIn
              ? new Date(attendance.checkIn).toLocaleTimeString()
              : "Not checked in"}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {attendance.checkOut
              ? new Date(attendance.checkOut).toLocaleTimeString()
              : "Not checked out"}
          </p>
          {attendance.workedMinutes !== undefined && (
            <p>
              <strong>Worked Minutes:</strong> {attendance.workedMinutes} min
            </p>
          )}
          {attendance.overtimeMinutes !== undefined && (
            <p>
              <strong>Overtime Minutes:</strong> {attendance.overtimeMinutes}{" "}
              min
            </p>
          )}

          <div className="flex gap-4 mt-4">
            {!attendance.checkIn && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleCheckIn}
              >
                Check In
              </button>
            )}
            {attendance.checkIn && !attendance.checkOut && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCheckOut}
              >
                Check Out
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No attendance record found for today.</p>
      )}
    </div>
  );
}
