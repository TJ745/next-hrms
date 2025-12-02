import { prisma } from "@/lib/prisma";

export async function getOrgTree() {
  return prisma.orgNode.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          employee: {
            include: {
              user: {
                include: {
                  company: true,
                },
              },
            },
          },
          children: {
            include: {
              employee: {
                include: {
                  user: {
                    include: {
                      company: true,
                    },
                  },
                },
              },
              children: true,
            },
          },
        },
      },
      employee: {
        include: {
          user: {
            include: {
              company: true,
            },
          },
        },
      },
    },
  });
}
