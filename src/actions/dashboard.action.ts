"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDashboardStatsAction() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");

  // ✅ If the user is admin or HR, show all company employees
  if (["OWNER", "ADMIN", "HR_MANAGER"].includes(session.user.role)) {
    const totalEmployees = await prisma.employee.count({
      where: { company: { createdBy: session.user.id } },
    });

    const totalBranches = await prisma.branch.count({
      where: { creator: { id: session.user.id } },
    });

    const totalDepartments = await prisma.department.count({
      where: { branch: { creator: { id: session.user.id } } },
    });

    return {
      totalEmployees,
      totalBranches,
      totalDepartments,
    };
  }

  // ✅ If a normal employee is logged in, show only their own info
  if (session.user.role === "STAFF" || session.user.role === "WORKER") {
    return { totalEmployees: 1, totalBranches: 0, totalDepartments: 0 };
  }

  return { totalEmployees: 0, totalBranches: 0, totalDepartments: 0 };
}
