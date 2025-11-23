// app/(dashboard)/org-chart/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth"; // adapt to your auth helper
import { headers } from "next/headers";

// Types
export type OrgNodeDTO = {
  id: string;
  employeeId: string | null;
  children: OrgNodeDTO[];
};

const SaveSchema = z.array(
  z.object({
    id: z.string(),
    employeeId: z.string().nullable(),
    parentId: z.string().nullable(),
  })
);

// Fetch employees for selection
export async function getAllEmployees() {
  // Adjust selection if you want particular fields
  return prisma.employee.findMany({
    select: { id: true, userId: true, empId: true, jobTitle: true, position: true, createdAt: true, user:true },
    orderBy: { id: "asc" },
  });
}

// Fetch full org tree (reads OrgNode table; if empty, returns single empty root)
export async function getOrgTree(): Promise<OrgNodeDTO> {
  const nodes = await prisma.orgNode.findMany();
  if (nodes.length === 0) {
    // return a single root placeholder
    return { id: "root", employeeId: null, children: [] };
  }

  // map nodes by id
  const map = new Map<string, OrgNodeDTO>();
  nodes.forEach((n) => map.set(n.id, { id: n.id, employeeId: n.employeeId, children: [] }));

  let root: OrgNodeDTO | null = null;
  nodes.forEach((n) => {
    const dto = map.get(n.id)!;
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(dto);
    } else {
      root = dto;
    }
  });

  return root ?? { id: "root", employeeId: null, children: [] };
}

// Save flattened tree: replaces OrgNode table contents (simple approach)
export async function saveOrgTree(flatNodes: z.infer<typeof SaveSchema>) {
  // Restrict to ADMIN
  const headersList = await headers()
  const session = await auth.api.getSession?.({headers:headersList});
  if (session && session.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const parsed = SaveSchema.parse(flatNodes);

  // Simple strategy: delete all and recreate
  await prisma.$transaction([
    prisma.orgNode.deleteMany({}),
    ...parsed.map((n) =>
      prisma.orgNode.create({
        data: { id: n.id, employeeId: n.employeeId, parentId: n.parentId },
      })
    ),
  ]);

  return { ok: true };
}
