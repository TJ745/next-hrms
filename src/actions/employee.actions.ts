"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmailAction } from "./send-email.action";
import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { JobTitle } from "@/generated/prisma";

export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
  include: {
    user: true;
    department: {
      include: {
        branch: {
          include: {
            company: true;
          };
        };
      };
    };
    manager: {
      select: {
        id: true;
        user: {
          select: {
            name: true;
            email: true;
            role: true;
          };
        };
      };
    };
    shift: true;
    assets: true;
    attendance: true;
    documents: true;
    leaveBalance: true;
    leaves: true;
    overtimes: true;
    payrolls: true;
    salaryHistory: true;
    team: true;
  };
}>;

export async function createEmployeeAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized — only admin can create employees" };
  }

  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const role = String(formData.get("role"));
  const departmentId = String(formData.get("departmentId"));

  if (!name) return { error: "Name is required" };
  if (!email) return { error: "Email is required" };
  if (!departmentId) return { error: "Department is required" };

  if (role === "ADMIN")
    return { error: "Admin cannot be created from this form" };

  try {
    // ❌ Prevent creating user that already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists" };

    // ✔ Fetch department + its branch + company
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { branch: true },
    });

    if (!department) return { error: "Department not found" };

    // const branchId = department.branchId;
    const companyId = department.branch.companyId;

    // 1️⃣ Create user WITHOUT password (BetterAuth accepts)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role === "HR" ? "HR" : "EMPLOYEE",

        company: {
          connect: { id: companyId },
        },

        employee: {
          create: {
            department: { connect: { id: departmentId } },
          },
        },
      },
      include: {
        employee: true,
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

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create employee" };
  }
}

// Get single employee with user info

export async function getEmployeeAction(
  id: string
): Promise<EmployeeWithUser | null> {
  return await prisma.employee.findUnique({
    where: { id },
    include: {
      user: true,
      department: { include: { branch: { include: { company: true } } } },
      manager: { select: { id: true, user: { select: { name: true } } } },
      shift: true,
      assets: true,
      attendance: true,
      documents: true,
      leaveBalance: true,
      leaves: true,
      overtimes: true,
      payrolls: true,
      salaryHistory: true,
      team: true,
    },
  });
}

// Get all employees with user info

export async function getEmployeesAction(): Promise<EmployeeWithUser[]> {
  return await prisma.employee.findMany({
    include: {
      user: true,
      department: { include: { branch: { include: { company: true } } } },
      manager: { select: { id: true, user: { select: { name: true } } } },
      shift: true,
      assets: true,
      attendance: true,
      documents: true,
      leaveBalance: true,
      leaves: true,
      overtimes: true,
      payrolls: true,
      salaryHistory: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Update employee action

export async function updateEmployeeAction(formData: FormData) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const employeeId = formData.get("employeeId")?.toString();
    if (!employeeId) throw new Error("Employee ID missing");

    // Field groups
    const dateFields = [
      "dateOfBirth",
      "iqamaExpiry",
      "passportExpiry",
      "joinDate",
      "insuranceIssueDate",
      "insuranceExpiryDate",
    ];
    const numberFields = [
      "basicSalary",
      "housingAllowance",
      "transportationAllowance",
      "foodAllowance",
      "mobileAllowance",
      "otherAllowance",
    ];

    const relationalFields = ["department", "manager", "shift"];

    const employeeFields = [
      "empId",
      "phone",
      "gender",
      "nationality",
      "maritalStatus",
      "address",
      "emergencyName",
      "emergencyPhone",
      "emergencyRelation",
      "iqamaNo",
      "passportNo",
      "jobTitle",
      "employmentType",
      "contractValidity",
      "probationPeriod",
      "workingHours",
      "workingDays",
      "workLocation",
      "insuranceName",
      "insuranceCategory",
      "bankName",
      "bankAccount",
      "bankIBAN",
      "status",
      ...dateFields,
      ...numberFields,
      ...relationalFields,
    ];

    const data: any = {};

    // Build employee payload ONLY from submitted fields
    for (const key of employeeFields) {
      const value = formData.get(key);

      // Do NOT overwrite existing values unless the field was submitted
      if (!value || value.toString().trim() === "") continue;

      // Date fields
      if (dateFields.includes(key)) {
        data[key] = new Date(value.toString());
      } else if (numberFields.includes(key)) {
        data[key] = Number(value);
      } else if (relationalFields.includes(key)) {
        data[key] = { connect: { id: value.toString() } };
      } else {
        data[key] = value.toString();
      }
    }

    // -----------------------------
    // USER UPDATE (name + email)
    // -----------------------------
    const userUpdate: any = {};

    const rawName = formData.get("name");
    const rawEmail = formData.get("email");

    if (rawName && rawName.toString().trim() !== "") {
      userUpdate.name = rawName.toString();
    }

    if (rawEmail && rawEmail.toString().trim() !== "") {
      userUpdate.email = rawEmail.toString();
    }

    // -----------------------------
    // Execute update
    // -----------------------------
    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...data,
        user: Object.keys(userUpdate).length
          ? { update: userUpdate }
          : undefined,
      },
      include: {
        user: true,
        department: { include: { branch: { include: { company: true } } } },
        manager: { select: { id: true, user: { select: { name: true } } } },
        shift: true,
        assets: true,
        attendance: true,
        documents: true,
        leaveBalance: true,
        leaves: true,
        overtimes: true,
        payrolls: true,
        salaryHistory: true,
        team: true,
      },
    });

    return { success: true, employee: updated };
  } catch (err) {
    console.error("updateEmployeeAction error:", err);
    return { error: "Failed to update employee" };
  }
}

// Delete employee action
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

  const employeeId = formData.get("employeeId")?.toString();
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
      return { error: "Image must be less than 2MB." };
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
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "employee"
    );

    await fs.mkdir(uploadsDir, { recursive: true });

    const sanitized = imageFile.name.replace(/\s+/g, "_");
    const fileName = `${employeeId}-${Date.now()}-${sanitized}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, bytes);

    newImagePath = `/uploads/employee/${fileName}`;
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: { image: newImagePath ?? employee.image },
  });

  return { success: true };
}
