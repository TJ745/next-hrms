// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { DndContext, DragEndEvent } from "@dnd-kit/core";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import type { OrgNodeDTO } from "@/actions/org-chart.actions";

// // Types from server
// type Employee = {
//   id: string;
//   empId?: string | null;
//   jobTitle?: string | null;
//   position?: string | null;
// };

// type Node = {
//   id: string;
//   employeeId: string | null;
//   children: Node[];
// };

// interface Props {
//   employees: Employee[];
//   initialTree: OrgNodeDTO;
// }

// function mapDtoToNode(dto: OrgNodeDTO): Node {
//   return { id: dto.id, employeeId: dto.employeeId ?? null, children: dto.children.map(mapDtoToNode) };
// }

// export default function OrgChartBuilderClient({ employees, initialTree }: Props) {
//   const [tree, setTree] = useState<Node>(() => mapDtoToNode(initialTree));
//   const [saving, setSaving] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
//   const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

//   // Prevent duplicate assignment (allow the node's own employee)
//   const assignedIds = useMemo(() => {
//     const set = new Set<string>();
//     const q: Node[] = [tree];
//     while (q.length) {
//       const n = q.shift()!;
//       if (n.employeeId) set.add(n.employeeId);
//       n.children.forEach((c) => q.push(c));
//     }
//     return set;
//   }, [tree]);

//   // Add child immutably
//   const addChild = (parentId: string) => {
//     setTree((prev) => {
//       const clone = structuredClone(prev) as Node;
//       const q: Node[] = [clone];
//       while (q.length) {
//         const cur = q.shift()!;
//         if (cur.id === parentId) {
//           cur.children = [...cur.children, { id: crypto.randomUUID(), employeeId: null, children: [] }];
//           break;
//         }
//         cur.children.forEach((c) => q.push(c));
//       }
//       return clone;
//     });
//   };

//   // Remove a node and its subtree
//   const removeNode = (nodeId: string) => {
//     setTree((prev) => {
//       if (prev.id === nodeId) {
//         // reset root
//         return { id: crypto.randomUUID(), employeeId: null, children: [] };
//       }
//       const clone = structuredClone(prev) as Node;
//       const removeRec = (parent: Node) => {
//         parent.children = parent.children.filter((c) => c.id !== nodeId).map((c) => {
//           removeRec(c);
//           return c;
//         });
//       };
//       removeRec(clone);
//       return clone;
//     });
//   };

//   // Assign employee to node immutably (and add an empty child if none)
//   const assignEmployee = (nodeId: string, employeeId: string) => {
//     setTree((prev) => {
//       const clone = structuredClone(prev) as Node;
//       const q: Node[] = [clone];
//       while (q.length) {
//         const cur = q.shift()!;
//         if (cur.id === nodeId) {
//           cur.employeeId = employeeId;
//           if (!cur.children.some((c) => c.employeeId === null)) {
//             cur.children = [...cur.children, { id: crypto.randomUUID(), employeeId: null, children: [] }];
//           }
//           break;
//         }
//         cur.children.forEach((c) => q.push(c));
//       }
//       return clone;
//     });
//   };

//   // DnD: simple model: drop dragged node onto target node to reparent
//   function flattenAndRemove(root: Node, nodeId: string): { root: Node; removed?: Node } {
//     const clone = structuredClone(root) as Node;
//     if (clone.id === nodeId) {
//       // removing root: return new empty root and removed node
//       return { root: { id: crypto.randomUUID(), employeeId: null, children: clone.children }, removed: clone };
//     }
//     const queue: Node[] = [clone];
//     while (queue.length) {
//       const cur = queue.shift()!;
//       const idx = cur.children.findIndex((c) => c.id === nodeId);
//       if (idx !== -1) {
//         const [removed] = cur.children.splice(idx, 1);
//         return { root: clone, removed };
//       }
//       cur.children.forEach((c) => queue.push(c));
//     }
//     return { root: clone };
//   }

//   const onDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     setActiveNodeId(null);
//     if (!over) return;
//     const draggedId = active.id as string;
//     const targetId = over.id as string;
//     if (draggedId === targetId) return;

//     setTree((prev) => {
//       const { root: without, removed } = flattenAndRemove(prev, draggedId);
//       if (!removed) return prev;
//       // attach removed to target node
//       const clone = structuredClone(without) as Node;
//       const q: Node[] = [clone];
//       while (q.length) {
//         const cur = q.shift()!;
//         if (cur.id === targetId) {
//           cur.children = [...cur.children, removed];
//           break;
//         }
//         cur.children.forEach((c) => q.push(c));
//       }
//       return clone;
//     });
//   };

//   // Render node recursively (client-side only)
//   const NodeCard: React.FC<{ node: Node }> = ({ node }) => {
//     return (
//       <div className="flex flex-col items-center">
//         <div
//           ref={(el) => nodeRefs.current.set(node.id, el)}
//           id={`node-${node.id}`}
//           className="relative z-10"
//           draggable
//           onDragStart={() => setActiveNodeId(node.id)}
//           onDragEnd={() => setActiveNodeId(null)}
//         >
//           <Card className="w-64 p-3 flex flex-col items-center">
//             {node.employeeId ? (
//               <>
//                 <div className="font-semibold">
//                   {employees.find((e) => e.id === node.employeeId)?.position ?? employees.find((e) => e.id === node.employeeId)?.empId ?? "Employee"}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {employees.find((e) => e.id === node.employeeId)?.jobTitle ?? ""}
//                 </div>
//               </>
//             ) : (
//               <div className="text-sm text-muted-foreground">(unassigned)</div>
//             )}

//             <div className="w-full mt-3">
//               <Select
//                 value={node.employeeId ?? undefined}
//                 onValueChange={(v) => assignEmployee(node.id, v)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Assign employee" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {employees
//                     .filter((emp) => !assignedIds.has(emp.id) || emp.id === node.employeeId)
//                     .map((emp) => (
//                       <SelectItem key={emp.id} value={emp.id}>
//                         {emp.empId ?? emp.id} — {emp.jobTitle ?? emp.position ?? "—"}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex gap-2 mt-3">
//               <Button size="sm" onClick={() => addChild(node.id)}>+ Sub</Button>
//               <Button size="sm" variant="destructive" onClick={() => removeNode(node.id)}>Remove</Button>
//             </div>
//           </Card>
//         </div>

//         {/* connector */}
//         {node.children.length > 0 && <div className="w-px bg-slate-300 h-6 mt-2" />}

//         <div className="flex gap-6 mt-4">
//           {node.children.map((c) => (
//             <div key={c.id} className="flex flex-col items-center">
//               <div className="h-px w-20 bg-slate-300 mb-4" />
//               <NodeCard node={c} />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Convert current tree to flat save payload: { id, employeeId, parentId }
//   const buildFlatPayload = (root: Node) => {
//     const out: { id: string; employeeId: string | null; parentId: string | null }[] = [];
//     const q: { node: Node; parentEmployeeId: string | null }[] = [{ node: root, parentEmployeeId: null }];
//     while (q.length) {
//       const { node, parentEmployeeId } = q.shift()!;
//       out.push({ id: node.id, employeeId: node.employeeId, parentId: parentEmployeeId });
//       node.children.forEach((c) => q.push({ node: c, parentEmployeeId: node.employeeId ?? parentEmployeeId }));
//     }
//     return out;
//   };

//   // Save server action (server action wrapper will be used; here we call a client-side fetch that triggers a server action via POST to a route — since you requested server actions, I'll call action via form/action approach)
//   // We'll wire to the server action by calling `saveOrgTree` via an exported server action module function using `form action` approach would be ideal.
//   // Simpler client call: fetch to server action route via a small helper endpoint that internally calls server action.
//   // Because you explicitly use server actions, below we call a client fetch to our server-action bridge route `/org/save` that you will create (or use the server action file directly if you prefer).
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const payload = buildFlatPayload(tree);
//       // POST to server action route
//       await fetch("/dashboard/employees/org-builder/save", {
//         method: "POST",
//         body: JSON.stringify({ nodes: payload }),
//         headers: { "content-type": "application/json" },
//       });
//       alert("Saved");
//     } catch (err) {
//       console.error(err);
//       alert("Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Export to PDF
//   const handleExport = async () => {
//     const el = containerRef.current;
//     if (!el) return;
//     const canvas = await html2canvas(el, { scale: 2 });
//     const img = canvas.toDataURL("image/png");
//     const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
//     const width = pdf.internal.pageSize.getWidth();
//     const height = (canvas.height * width) / canvas.width;
//     pdf.addImage(img, "PNG", 0, 0, width, height);
//     pdf.save("org-chart.pdf");
//   };

//   // Compute connectors (SVG) — recompute on tree change and layout
//   const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
//   useEffect(() => {
//     const compute = () => {
//       const containerRect = containerRef.current?.getBoundingClientRect();
//       if (!containerRect) return setLines([]);
//       const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
//       const traverse = (n: Node) => {
//         const parentEl = nodeRefs.current.get(n.id);
//         if (!parentEl) { n.children.forEach(traverse); return; }
//         const pRect = parentEl.getBoundingClientRect();
//         n.children.forEach((c) => {
//           const childEl = nodeRefs.current.get(c.id);
//           if (!childEl) return;
//           const cRect = childEl.getBoundingClientRect();
//           const x1 = pRect.left + pRect.width / 2 - containerRect.left;
//           const y1 = pRect.top + pRect.height - containerRect.top;
//           const x2 = cRect.left + cRect.width / 2 - containerRect.left;
//           const y2 = cRect.top - containerRect.top;
//           out.push({ x1, y1, x2, y2 });
//           traverse(c);
//         });
//       };
//       traverse(tree);
//       setLines(out);
//     };

//     const id = setTimeout(compute, 60);
//     window.addEventListener("resize", compute);
//     return () => { clearTimeout(id); window.removeEventListener("resize", compute); };
//   }, [tree, employees]);

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-2">
//         <Button onClick={() => addChild(tree.id)}>+ Add Top Child</Button>
//         <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
//         <Button onClick={handleExport}>Export PDF</Button>
//       </div>

//       <div ref={containerRef} id="org-chart-container" className="relative bg-white p-6 rounded shadow overflow-auto" style={{ minHeight: 480 }}>
//         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
//           {lines.map((l, i) => (
//             <path key={i} d={`M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2} ${l.x2} ${(l.y1 + l.y2) / 2} ${l.x2} ${l.y2}`} stroke="#9CA3AF" fill="none" strokeWidth={2} />
//           ))}
//         </svg>

//         <DndContext onDragEnd={onDragEnd} onDragStart={(e) => setActiveNodeId(e.active.id as string)}>
//           <div className="flex justify-center">
//             <div className="flex flex-col items-center">
//               <NodeCard node={tree} />
//             </div>
//           </div>
//         </DndContext>
//       </div>
//     </div>
//   );
// }


// File: src/app/dashboard/employees/org-builder/OrgChartBuilderClient.tsx
"use client";

import React, {  useMemo, useRef, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { OrgNodeDTO, saveOrgTree } from "@/actions/org-chart.actions";

// Types from server
type Employee = {
  id: string;
  empId?: string | null;
  jobTitle?: string | null;
  position?: string | null;
};

type Node = {
  id: string;
  employeeId: string | null;
  children: Node[];
};

interface Props {
  employees: Employee[];
  initialTree: OrgNodeDTO;
}

function mapDtoToNode(dto: OrgNodeDTO): Node {
  return { id: dto.id, employeeId: dto.employeeId ?? null, children: dto.children.map(mapDtoToNode) };
}

export default function OrgChartBuilderClient({ employees, initialTree }: Props) {
  const [tree, setTree] = useState<Node>(() => mapDtoToNode(initialTree));
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const assignedIds = useMemo(() => {
    const set = new Set<string>();
    const q: Node[] = [tree];
    while (q.length) {
      const n = q.shift()!;
      if (n.employeeId) set.add(n.employeeId);
      n.children.forEach((c) => q.push(c));
    }
    return set;
  }, [tree]);

  const addChild = (parentId: string) => {
    setTree((prev) => {
      const clone = structuredClone(prev) as Node;
      const q: Node[] = [clone];
      while (q.length) {
        const cur = q.shift()!;
        if (cur.id === parentId) {
          cur.children = [...cur.children, { id: crypto.randomUUID(), employeeId: null, children: [] }];
          break;
        }
        cur.children.forEach((c) => q.push(c));
      }
      return clone;
    });
  };

  const removeNode = (nodeId: string) => {
    setTree((prev) => {
      if (prev.id === nodeId) {
        return { id: crypto.randomUUID(), employeeId: null, children: [] };
      }
      const clone = structuredClone(prev) as Node;
      const removeRec = (parent: Node) => {
        parent.children = parent.children.filter((c) => c.id !== nodeId).map((c) => {
          removeRec(c);
          return c;
        });
      };
      removeRec(clone);
      return clone;
    });
  };

  const assignEmployee = (nodeId: string, employeeId: string) => {
    setTree((prev) => {
      const clone = structuredClone(prev) as Node;
      const q: Node[] = [clone];
      while (q.length) {
        const cur = q.shift()!;
        if (cur.id === nodeId) {
          cur.employeeId = employeeId;
          if (!cur.children.some((c) => c.employeeId === null)) {
            cur.children = [...cur.children, { id: crypto.randomUUID(), employeeId: null, children: [] }];
          }
          break;
        }
        cur.children.forEach((c) => q.push(c));
      }
      return clone;
    });
  };

  function flattenAndRemove(root: Node, nodeId: string): { root: Node; removed?: Node } {
    const clone = structuredClone(root) as Node;
    if (clone.id === nodeId) {
      return { root: { id: crypto.randomUUID(), employeeId: null, children: clone.children }, removed: clone };
    }
    const queue: Node[] = [clone];
    while (queue.length) {
      const cur = queue.shift()!;
      const idx = cur.children.findIndex((c) => c.id === nodeId);
      if (idx !== -1) {
        const [removed] = cur.children.splice(idx, 1);
        return { root: clone, removed };
      }
      cur.children.forEach((c) => queue.push(c));
    }
    return { root: clone };
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNodeId(null);
    if (!over) return;
    const draggedId = active.id as string;
    const targetId = over.id as string;
    if (draggedId === targetId) return;

    setTree((prev) => {
      const { root: without, removed } = flattenAndRemove(prev, draggedId);
      if (!removed) return prev;
      const clone = structuredClone(without) as Node;
      const q: Node[] = [clone];
      while (q.length) {
        const cur = q.shift()!;
        if (cur.id === targetId) {
          cur.children = [...cur.children, removed];
          break;
        }
        cur.children.forEach((c) => q.push(c));
      }
      return clone;
    });
  };

  const NodeCard: React.FC<{ node: Node }> = ({ node }) => (
    <div className="flex flex-col items-center">
      <div
        ref={(el) => nodeRefs.current.set(node.id, el)}
        id={`node-${node.id}`}
        className="relative z-10"
        draggable
        onDragStart={() => setActiveNodeId(node.id)}
        onDragEnd={() => setActiveNodeId(null)}
      >
        <Card className="w-64 p-3 flex flex-col items-center">
          {node.employeeId ? (
            <>
              <div className="font-semibold">
                {employees.find((e) => e.id === node.employeeId)?.position ?? employees.find((e) => e.id === node.employeeId)?.empId ?? "Employee"}
              </div>
              <div className="text-sm text-muted-foreground">
                {employees.find((e) => e.id === node.employeeId)?.jobTitle ?? ""}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">(unassigned)</div>
          )}

          <div className="w-full mt-3">
            <Select
              value={node.employeeId ?? undefined}
              onValueChange={(v) => assignEmployee(node.id, v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Assign employee" />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter((emp) => !assignedIds.has(emp.id) || emp.id === node.employeeId)
                  .map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.empId ?? emp.id} — {emp.jobTitle ?? emp.position ?? "—"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={() => addChild(node.id)}>+ Sub</Button>
            <Button size="sm" variant="destructive" onClick={() => removeNode(node.id)}>Remove</Button>
          </div>
        </Card>
      </div>

      {node.children.length > 0 && <div className="w-px bg-slate-300 h-6 mt-2" />}

      <div className="flex gap-6 mt-4">
        {node.children.map((c) => (
          <div key={c.id} className="flex flex-col items-center">
            <div className="h-px w-20 bg-slate-300 mb-4" />
            <NodeCard node={c} />
          </div>
        ))}
      </div>
    </div>
  );

  const buildFlatPayload = (root: Node) => {
    const out: { id: string; employeeId: string | null; parentId: string | null }[] = [];
    const q: { node: Node; parentId: string | null }[] = [{ node: root, parentId: null }];
    while (q.length) {
      const { node, parentId } = q.shift()!;
      out.push({ id: node.id, employeeId: node.employeeId, parentId });
      node.children.forEach((c) => q.push({ node: c, parentId: node.id }));
    }
    return out;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = buildFlatPayload(tree);
      await saveOrgTree(payload); // server action imported
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    const el = containerRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("org-chart.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => addChild(tree.id)}>+ Add Top Child</Button>
        <Button variant="outline" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button variant="outline" onClick={handleExport}>Export PDF</Button>
      </div>
      <div ref={containerRef} className="relative p-6 rounded shadow overflow-auto min-h-[480px]">
        <DndContext onDragEnd={onDragEnd} onDragStart={(e) => setActiveNodeId(e.active.id as string)}>
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <NodeCard node={tree} />
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
