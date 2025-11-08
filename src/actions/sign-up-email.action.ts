"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Name is required" };

  const email = String(formData.get("email"));
  if (!email) return { error: "Email is required" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Password is required" };

  try {
    // await auth.api.signUpEmail({ body: { name, email, password } });
    // return { error: null };


    // 🟢 Check if any user exists — only the first one can register
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return { error: "Registration is closed. Please contact your system admin." };
    }

    // 🔵 Register via Better Auth
    const user  = await auth.api.signUpEmail({
      body: { name, email, password },
    });

    // 🟣 Update user role in database (if stored separately)
    await prisma.user.update({
      where: { id: user.user.id },
      data: { role: "ADMIN" },
    });


// 🟠 After registration, redirect user to "Create Company" page
    return { success: true, redirect: "/company/create" };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return { error: "Oops! Something went wrong. Please try again." };
        default:
          return { error: err.message };
      }
    }
    return { error: "Internal Server Error." };
  }
}
