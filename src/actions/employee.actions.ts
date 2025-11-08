"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createEmployeeAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session?.user) throw new Error("Unauthorized");
  if (!["ADMIN", "HR_MANAGER"].includes(session.user.role))
    throw new Error("Forbidden");

  const name = String(formData.get("name"));
  if (!name) return { error: "Name is required" };
  const email = String(formData.get("email"));
  
  const empId = String(formData.get("empId"));

  const phone = formData.get("phone") ? String(formData.get("phone")) : null;
  const position = formData.get("position") ? String(formData.get("position")) : null;
  const status = formData.get("status") ? String(formData.get("status")) : null;
  const departmentId = formData.get("departmentId") ? String(formData.get("departmentId")) : null;
  const branchId = formData.get("branchId") ? String(formData.get("branchId")) : null;
  const companyId = formData.get("companyId") ? String(formData.get("companyId")) : null;
  const userId = formData.get("userId") ? String(formData.get("userId")) : null;
  const image = formData.get("image") ? String(formData.get("image")) : null;

  try {
       // 🔹 Check that the company exists
      const company = await prisma.company.findFirst({
        where: { createdBy: session.user.id },
      });
      if (!company) {
        return { error: "Company not found. Please create a company first." };
      }
  
  
      const emp = await prisma.employee.create({
    data: {
      name,
      email,
      phone,
      empId,
      image,
      position,
      status,
      departmentId,
      branchId,
      companyId,
      userId,
      createdBy: session.user.id,
    },
  });
  
      return { success: true, redirect: `/dashboard/employees/${emp.id}` };
      
    } catch (err) {
      console.error(err);
      return { error: "Failed to create employee" };
    }
}

export async function getEmployeesAction(departmentId: string) {
  return await prisma.employee.findMany({
    where: { departmentId },
    include: { department: true },
  });
}

export async function updateEmployeeAction(id: string, data: any) {
  return await prisma.employee.update({ where: { id }, data });
}

export async function deleteEmployeeAction(id: string) {
  return await prisma.employee.delete({ where: { id } });
}
