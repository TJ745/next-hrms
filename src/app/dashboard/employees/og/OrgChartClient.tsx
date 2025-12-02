"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { OrgNodeWithRelations } from "@/actions/org-actions";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  createNode,
  assignEmployee,
  moveNode,
  deleteNode,
} from "@/actions/org-crud"; // server actions called via form/button
import { fetch } from "next/dist/compiled/@edge-runtime/primitives/fetch"; // not necessary — we'll refresh page or use revalidate

// small helper to map dept -> color
const DEPT_COLORS: Record<string, string> = {
  HR: "bg-blue-50 border-blue-300",
  Engineering: "bg-green-50 border-green-300",
  Sales: "bg-yellow-50 border-yellow-300",
};

function deptClass(dept?: string) {
  if (!dept) return "bg-white border-gray-200";
  return DEPT_COLORS[dept] ?? "bg-white border-gray-200";
}

export default function OrgChartClient({
  initialData,
}: {
  initialData: OrgNodeWithRelations[];
}) {
  const [data, setData] = useState<OrgNodeWithRelations[]>(initialData);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => setData(initialData), [initialData]);

  // Flatten for DnD (we only DnD within same level in this simple example)
  function renderNodes(nodes: OrgNodeWithRelations[]) {
    return nodes.map((n) => (
      <TreeNode
        key={n.id}
        node={n}
        onAdd={() => onAdd(n.id)}
        onDelete={() => onDelete(n.id)}
        onAssign={() => onAssign(n.id)}
      />
    ));
  }

  async function onAdd(parentId?: string) {
    // call server action via fetch to an API route or use form actions — for simplicity, open prompt then call server action via fetch route
    const name = prompt(
      "Create empty node? Leave blank to create vacant node. Type 'employee:<EMPLOYEE_ID>' to assign immediately."
    );
    if (name === null) return;
    // We will call server action createNode then refresh — here we call a simple API route you'd create:
    await fetch("/api/org/create", {
      method: "POST",
      body: JSON.stringify({ parentId }),
    });
    location.reload(); // simple approach to reflect changes
  }

  async function onAssign(nodeId: string) {
    const empId = prompt(
      "Enter employeeId to assign (exact id). Leave blank to unassign."
    );
    if (empId === null) return;
    await fetch("/api/org/assign", {
      method: "POST",
      body: JSON.stringify({ nodeId, employeeId: empId || null }),
    });
    location.reload();
  }

  async function onDelete(nodeId: string) {
    if (
      !confirm(
        "Delete node? children will be re-parented to this node's parent."
      )
    )
      return;
    await fetch("/api/org/delete", {
      method: "POST",
      body: JSON.stringify({ nodeId }),
    });
    location.reload();
  }

  function onZoomIn() {
    setScale((s) => Math.min(2, s + 0.1));
  }
  function onZoomOut() {
    setScale((s) => Math.max(0.4, s - 0.1));
  }
  function onZoomReset() {
    setScale(1);
  }

  // pan by dragging background
  useEffect(() => {
    const el = panRef.current;
    if (!el) return;
    let pressing = false;
    let lastX = 0,
      lastY = 0;
    let tx = 0,
      ty = 0;

    function mDown(e: MouseEvent) {
      pressing = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function mMove(e: MouseEvent) {
      if (!pressing) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      tx += dx;
      ty += dy;
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    function mUp() {
      pressing = false;
    }

    el.addEventListener("mousedown", mDown);
    window.addEventListener("mousemove", mMove);
    window.addEventListener("mouseup", mUp);
    return () => {
      el.removeEventListener("mousedown", mDown);
      window.removeEventListener("mousemove", mMove);
      window.removeEventListener("mouseup", mUp);
    };
  }, [scale]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onAdd(null)}
          className="px-3 py-1 border rounded"
        >
          Add Root
        </button>
        <button onClick={() => onZoomIn()} className="px-3 py-1 border rounded">
          Zoom +
        </button>
        <button
          onClick={() => onZoomOut()}
          className="px-3 py-1 border rounded"
        >
          Zoom -
        </button>
        <button
          onClick={() => onZoomReset()}
          className="px-3 py-1 border rounded"
        >
          Reset
        </button>
        <button
          onClick={() => window.print()}
          className="px-3 py-1 border rounded"
        >
          Print
        </button>
      </div>

      <div className="border p-4 overflow-auto" style={{ height: "70vh" }}>
        <div
          ref={panRef}
          style={{
            transformOrigin: "0 0",
            transition: "transform .05s",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: `scale(${scale})` }}>
            <div className="flex gap-8 justify-center">{renderNodes(data)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small TreeNode component — renders box + recursively its children */
function TreeNode({ node, onAdd, onDelete, onAssign }: any) {
  const dept = node.employee?.user?.departmentId;
  const cls = deptClass(dept as any);

  return (
    <div className="flex flex-col items-center">
      <div className={`border p-3 rounded-lg min-w-[180px] text-center ${cls}`}>
        <div className="font-semibold text-sm">
          {node.employee?.user?.name ?? "Vacant"}
        </div>
        <div className="text-xs text-gray-700">
          {node.employee?.jobTitle ?? "—"}
        </div>
        <div className="text-[10px] text-gray-500">
          {node.employee?.user?.company?.name ?? "—"}
        </div>

        <div className="mt-2 flex gap-1 justify-center">
          <button
            className="text-xs px-2 py-1 border rounded"
            onClick={() => onAdd(node.id)}
          >
            Add
          </button>
          <button
            className="text-xs px-2 py-1 border rounded"
            onClick={() => onAssign(node.id)}
          >
            Assign
          </button>
          <button
            className="text-xs px-2 py-1 border rounded text-red-600"
            onClick={() => onDelete(node.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* connector */}
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-400"></div>
          <div className="flex gap-6 mt-4">
            {node.children.map((c: any) => (
              <TreeNode
                key={c.id}
                node={c}
                onAdd={onAdd}
                onDelete={onDelete}
                onAssign={onAssign}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
