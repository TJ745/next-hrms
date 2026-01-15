"use client";

import { SalaryHistory } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  history: SalaryHistory[];
};

export default function SalaryHistoryTimeline({ history }: Props) {
  if (!history.length)
    return (
      <p className="text-sm text-muted-foreground">No salary history found.</p>
    );

  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime()
  );

  return (
    <div className="relative border-l pl-6 space-y-6">
      {sorted.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Dot */}
          <span
            className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${
              index === 0 ? "bg-green-600" : "bg-gray-400"
            }`}
          />

          <div className="rounded-lg border p-4 bg-background shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">
                {item.salary.toLocaleString()} SAR
              </h4>
              <span className="text-xs text-muted-foreground">
                {format(new Date(item.effectiveFrom), "dd MMM yyyy")}
              </span>
            </div>

            {item.reason && (
              <p className="mt-2 text-sm text-muted-foreground">
                {item.reason}
              </p>
            )}

            {index === 0 && (
              <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                Current Salary
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
