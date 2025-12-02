// app/actions/org-actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrgTree() {
  const tree = await prisma.orgNode.findMany({
    where: { parentId: null },
    include: {
      employee: {
        include: {
          user: {
            include: { company: true },
          },
        },
      },
      children: {
        include: {
          employee: {
            include: {
              user: {
                include: { company: true },
              },
            },
          },
          children: true,
        },
      },
    },
  });

  return tree;
}
