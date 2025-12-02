"use client";
import { createShift } from "@/actions/attendance.actions";
import { useState } from "react";

export default function ShiftForm() {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createShift(name, new Date(start), new Date(end));
    alert("Shift created!");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow grid gap-4"
    >
      <input
        type="text"
        placeholder="Shift name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="input"
      />
      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">
        Create Shift
      </button>
    </form>
  );
}
