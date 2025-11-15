"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDashboardStatsAction() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");
// return null
  // ✅ If the user is admin or HR, show all company employees
  if (["ADMIN", "MANAGER"].includes(session.user.role)) {

    const totalEmployees = await prisma.user.count({
      
    });

    const totalBranches = await prisma.branch.count({
    });

    const totalDepartments = await prisma.department.count({
    });

    return {
      totalEmployees,
      totalBranches,
      totalDepartments,
    };
  }

  // ✅ If a normal employee is logged in, show only their own info
  if (session.user.role === "EMPLOYEE") {
    return { totalEmployees: 1, totalBranches: 0, totalDepartments: 0 };
  }

  return { totalEmployees: 0, totalBranches: 0, totalDepartments: 0 };
}
