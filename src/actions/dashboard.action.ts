"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDashboardStatsAction() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  const now = new Date();
  
  // First day of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // First day of next month (exclusive end)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

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

    const newEmployees = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
  });

    return {
      totalEmployees,
      totalBranches,
      totalDepartments,
      newEmployees,
    };
  }

  // ✅ If a normal employee is logged in, show only their own info
  if (session.user.role === "EMPLOYEE") {
    return { totalEmployees: 1, totalBranches: 0, totalDepartments: 0 };
  }

  return { totalEmployees: 0, totalBranches: 0, totalDepartments: 0 };
}

export async function getEmployeesByGender() {
  const male = await prisma.employee.count({ where: { gender: "MALE" } });
  const female = await prisma.employee.count({ where: { gender: "FEMALE" } });
  const other = await prisma.employee.count({ where: { gender: "OTHER" } });

  return {
    male,
    female,
    other,
  };
}