"use client";

import Link from "next/link";
import { OrgNode } from "@/types/org";

export default function EmployeeNode({
  node,
  onEdit,
  onAdd,
  onDelete,
  onContext,
  onClick,
}: {
  node: OrgNode;
  onEdit: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onContext: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const colorByDept = (d?: string) => {
    const map: Record<string, string> = {
      HR: "bg-blue-100",
      Engineering: "bg-green-100",
      Sales: "bg-yellow-100",
    };
    return map[d ?? ""] || "bg-gray-100";
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onContext(e);
      }}
      className={`p-2 rounded shadow cursor-pointer w-52 ${colorByDept(
        node.department
      )}`}
    >
      <div className="flex items-center gap-3" onClick={onClick}>
        <img
          src={node.image || node.avatarUrl || "/default-avatar.png"}
          className="w-12 h-12 rounded-full"
          alt={node.name}
        />
        <div className="flex-1">
          <div className="font-semibold text-sm">{node.name}</div>
          <div className="text-xs text-gray-600">{node.jobTitle}</div>
          <div className="text-xs text-gray-500">{node.department}</div>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="text-xs px-2 py-1 rounded bg-white shadow"
        >
          Add
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-xs px-2 py-1 rounded bg-white shadow"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-xs px-2 py-1 rounded bg-red-50 text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
