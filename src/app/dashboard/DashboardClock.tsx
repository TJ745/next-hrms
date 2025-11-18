"use client";

import { useEffect, useState } from "react";

export default function DashboardClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gregorian time
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const gregorianDate = now.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Hijri date
  const hijriDate = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div className="flex flex-col items-end text-right">
      <span className="text-2xl font-semibold">{time}</span>
      <span className="text-sm text-gray-500">{gregorianDate}</span>
      <span className="text-sm text-gray-400">{hijriDate} (Hijri)</span>
    </div>
  );
}
