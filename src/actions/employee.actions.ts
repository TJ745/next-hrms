"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmailAction } from "./send-email.action";
import { randomBytes } from "crypto";
import { Prisma } from "@/generated/prisma";
import { EmployeeWithUser } from "@/types/prisma";
import fs from "fs/promises";
import path from "path";

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
      user: {include: { department: true, branch: true, company: true } },
    },
  });
}

export async function getEmployeesAction(): Promise<EmployeeWithUser[]>  {
  return await prisma.employee.findMany({
  include: {
    user: true,
  },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// export async function updateEmployeeAction(id: string, data: Prisma.EmployeeUpdateInput) {
  // return await prisma.employee.update({
  //   where: { id },
  //   data,
  //   include: {
  //     user: true,
  //   },
  // });

//   export async function updateEmployeeAction(
//   // employeeId: string,
//   // data: {
//   //   user?: { name?: string; email?: string };
//   // } & Omit<Prisma.EmployeeUpdateInput, "user">
//   formData: FormData
// ) {const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });
//   if (!session || session.user.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

//   const companyId = session.user.companyId;
//   if (!companyId) {
//     throw new Error("No company found for this user");
//   }
//    return await prisma.employee.update({
//     where: { id:employeeId },
//     data: {
//       phone: data.phone,
//       gender: data.gender,
//       nationality: data.nationality,
//       dateOfBirth: data.dateOfBirth,
//       maritalStatus: data.maritalStatus,
//       address: data.address,
//       empId: data.empId,
//       jobTitle: data.jobTitle,
//       position: data.position,
//       basicSalary: data.basicSalary,
//       allowances: data.allowances,
//       totalSalary: data.totalSalary,
//       status: data.status,
//       emergencyName: data.emergencyName,
//       emergencyPhone: data.emergencyPhone,
//       emergencyRelation: data.emergencyRelation,
//       iqamaNo: data.iqamaNo,
//       iqamaExpiry: data.iqamaExpiry,
//       passportNo: data.passportNo,
//       passportExpiry: data.passportExpiry,
//       joinDate: data.joinDate,
//       contractType: data.contractType,
//       image: data.image,
//       user: data.user ? { update: { ...data.user } } : undefined,
//     },
//     include: { user: true },
//   });
// }

export async function updateEmployeeAction(formData: FormData) {
  try{
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const employeeId = formData.get("employeeId")?.toString();
  if (!employeeId) throw new Error("Employee ID missing");

  // Helper for dates
  const parseDate = (v: FormDataEntryValue | null) =>
    v ? new Date(v.toString()) : null;

  // Extract Employee fields
  const data = {
    empId: formData.get("empId")?.toString() || null,
    phone: formData.get("phone")?.toString() || null,
    gender: formData.get("gender")?.toString() || null,
    nationality: formData.get("nationality")?.toString() || null,
    dateOfBirth: parseDate(formData.get("dateOfBirth")),
    maritalStatus: formData.get("maritalStatus")?.toString() || null,
    address: formData.get("address")?.toString() || null,

    emergencyName: formData.get("emergencyName")?.toString() || null,
    emergencyPhone: formData.get("emergencyPhone")?.toString() || null,
    emergencyRelation: formData.get("emergencyRelation")?.toString() || null,

    iqamaNo: formData.get("iqamaNo")?.toString() || null,
    iqamaExpiry: parseDate(formData.get("iqamaExpiry")),
    passportNo: formData.get("passportNo")?.toString() || null,
    passportExpiry: parseDate(formData.get("passportExpiry")),

    jobTitle: formData.get("jobTitle")?.toString() || null,
    joinDate: parseDate(formData.get("joinDate")),
    contractType: formData.get("contractType")?.toString() || null,
    position: formData.get("position")?.toString() || null,
    basicSalary: formData.get("basicSalary")
      ? Number(formData.get("basicSalary"))
      : null,
    allowances: formData.get("allowances")
      ? Number(formData.get("allowances"))
      : null,
    totalSalary: formData.get("totalSalary")
      ? Number(formData.get("totalSalary"))
      : null,

    status: formData.get("status")?.toString() || null,
  };

  // User fields
  const userUpdate = {
    name: formData.get("userName")?.toString(),
    email: formData.get("userEmail")?.toString(),
  };

  // Remove empty values for user
  Object.keys(userUpdate).forEach((key) => {
    if (!userUpdate[key as keyof typeof userUpdate]) {
      delete userUpdate[key as keyof typeof userUpdate];
    }
  });

  const updated = await prisma.employee.update({
    where: { id: employeeId },
    data: {
      ...data,
      user: Object.keys(userUpdate).length
        ? { update: userUpdate }
        : undefined,
    },
    include: { user: true },
  });

  return { success: true, employee: updated };
} catch (err) {
  return { error: "Failed to update employee" };
}
}


export async function deleteEmployeeAction(id: string) {
  return await prisma.employee.delete({ where: { id } });
}

// Image upload action
export async function updateEmpImageAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const employeeId = formData.get("employeeId") as string | null;

  if (!employeeId) {
    throw new Error("No employee selected to update");
  }

  // 2️⃣ Load the Employee record
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, // <-- USE EMPLOYEE ID, not userId
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  let newImagePath: string | null = null;

  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { error: "Only PNG, JPG, JPEG, WEBP images are allowed." };
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      return { error: "Logo image must be less than 2MB." };
    }

    // Delete old logo if exists
    if (employee.image) {
      const oldPath = path.join(process.cwd(), "public", employee.image);
      try {
        await fs.unlink(oldPath);
      } catch {}
    }

    // Save new file
    const bytes = Buffer.from(await imageFile.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "employee");

    await fs.mkdir(uploadsDir, { recursive: true });

    const sanitized = imageFile.name.replace(/\s+/g, "_");
    const fileName = `${employeeId}-${Date.now()}-${sanitized}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, bytes);

    newImagePath = `/uploads/employee/${fileName}`;
  }

  await prisma.employee.update({
    where: { id:employeeId },
    data:{ image:newImagePath ?? employee.image },
  });

  return { success: true };
}