"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // your better-auth session helper
import { headers } from "next/headers";

export async function createCompanyAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // 🧩 Security — only admin can create company
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized — only admin can create company");
  }


  const name = String(formData.get("name"));
  const logo = formData.get("logo") ? String(formData.get("logo")) : null;
  const vatNumber = formData.get("vatNumber")
    ? String(formData.get("vatNumber"))
    : null;
  const crNumber = formData.get("crNumber")
    ? String(formData.get("crNumber"))
    : null;
  const phone = formData.get("phone") ? String(formData.get("phone")) : null;
  const email = formData.get("email") ? String(formData.get("email")) : null;
  const website = formData.get("website")
    ? String(formData.get("website"))
    : null;
  const address = formData.get("address")
    ? String(formData.get("address"))
    : null;

  if (!name) {
    return { error: "Company name is required" };
  }

  try {
    // 🏢 Create company linked to admin
    const company = await prisma.company.create({
      data: {
        name,
        logo,
        vatNumber,
        crNumber,
        phone,
        email,
        website,
        address,
        createdBy: session.user.id,
      },
    });

    return { success: true, company };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create company" };
  }
}
