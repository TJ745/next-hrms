"use client";

import { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  position: string;
}

interface Node {
  id: string;
  employeeId: string | null;
  children: Node[];
}

interface Props {
  employees: Employee[];
}

export default function OrgChartBuilder({ employees }: Props) {
  const [tree, setTree] = useState<Node>({
    id: crypto.randomUUID(),
    employeeId: null,
    children: [],
  });

  // ADD CHILD UNDER ANY NODE
const addChild = (nodeId: string) => {
  setTree((prevTree) => {
    const clone = structuredClone(prevTree);

    const queue = [clone];
    while (queue.length > 0) {
      const curr = queue.shift() as Node;

      if (curr.id === nodeId) {
        curr.children = [
          ...curr.children,
          {
            id: crypto.randomUUID(),
            employeeId: null,
            children: [],
          },
        ];
        break;
      }

      curr.children.forEach((c) => queue.push(c));
    }

    return clone; // Always return a NEW immutable tree
  });
};

  // ASSIGN EMPLOYEE TO A CARD
  const updateEmployee = (nodeId: string, empId: string) => {
    setTree((prev) => {
      const upd = (n: Node): Node =>
        n.id === nodeId
          ? { ...n, employeeId: empId }
          : { ...n, children: n.children.map(upd) };

      return upd(prev);
    });

    // Automatically add 1 empty child node (optional)
    addChild(nodeId);
  };

  // DRAGGABLE CARD COMPONENT
  const DraggableNode = ({ node }: { node: Node }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: node.id,
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : "none",
        }}
        className="relative flex flex-col items-center"
      >
        {/* Employee Card */}
        <Card
          {...listeners}
          {...attributes}
          className="px-4 py-3 w-56 shadow-md border flex flex-col items-center"
        >
          {node.employeeId ? (
            <>
              <div className="font-semibold">
                {employees.find((e) => e.id === node.employeeId)?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {employees.find((e) => e.id === node.employeeId)?.position}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground mb-2">
              Select employee
            </div>
          )}

          {/* Employee Selector */}
          <Select
            onValueChange={(v) => updateEmployee(node.id, v)}
            value={node.employeeId ?? undefined}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Assign employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name} — {e.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ADD MULTIPLE CHILDREN (THIS FIXES YOUR PROBLEM) */}
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => addChild(node.id)}
          >
            + Add Subordinate
          </Button>
        </Card>

        {/* Vertical Line */}
        {node.children.length > 0 && (
          <div className="w-px bg-gray-400 h-6" />
        )}

        {/* Children Container */}
        <div className="flex gap-6 mt-4">
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* Horizontal Line */}
              <div className="h-px bg-gray-400 w-24 mb-4" />
              <DraggableNode node={child} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DndContext>
      <div className="flex justify-center mt-10">
        <DraggableNode node={tree} />
      </div>
    </DndContext>
  );
}
