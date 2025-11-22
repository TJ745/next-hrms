"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmailAction } from "./send-email.action";
import { randomBytes } from "crypto";
import { Prisma } from "@/generated/prisma";

export async function createEmployeeAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = String(formData.get("name"));
  if (!name) return { error: "Name is required" };
  const email = String(formData.get("email"));
  if (!email) return { error: "Email is required" };
  const role = String(formData.get("role"));
  const departmentId = String(formData.get("departmentId"));
  if (!departmentId) return { error: "Department is required" };
  

  try {

    if (role === "ADMIN") {
      return { error: "Admin cannot be created from this form" };
    }

    // ❌ Prevent creating user that already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { error: "User already exists" };

    // ✔ Fetch department + its branch + company
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { branch: true },
    });

    if (!department) return { error: "Department not found" };

    const branchId = department.branchId;
    const companyId = department.branch.companyId;


    // 1️⃣ Create user WITHOUT password (BetterAuth accepts)
      const user = await prisma.user.create({
    data: {
      name,
      email,
      role: role === "MANAGER" ? "MANAGER" : "EMPLOYEE",
      companyId,
      branchId,
      departmentId,
    },
  });
  


  // 2️⃣ Create Employee profile (empty for now)
  await prisma.employee.create({
    data: {
      userId: user.id,
    },
  });

   // 3️⃣ Generate onboarding token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  await prisma.inviteToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  // 4️⃣ Send onboarding email
  const link = `${process.env.NEXT_PUBLIC_API_URL}/auth/create-password?token=${token}`;

  await sendEmailAction({
    to: email,
    subject: "Welcome - Set Your Password",
    meta: {
      description:
        "Your account has been created. Please click the link below to set your password.",
      link,
    },
  });
  
      // return { success: true, redirect: `/dashboard/employees/${employee.id}` };
      
      return { success: true };

    } catch (err) {
      console.error(err);
      return { error: "Failed to create employee" };
    }
}

export async function getEmployeeAction(id: string) {
  return await prisma.employee.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}

export async function getEmployeesAction() {
  return await prisma.employee.findMany({
  include: {
    user: true,
  },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateEmployeeAction(id: string, data: Prisma.EmployeeUpdateInput) {
  return await prisma.employee.update({ 
    where: { id }, 
    data, 
    include: { 
      user: true, 
    }, 
  });
}

export async function deleteEmployeeAction(id: string) {
  return await prisma.employee.delete({ where: { id } });
}
