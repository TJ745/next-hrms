"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // your better-auth session helper
import { headers } from "next/headers";
import fs from "fs/promises";
import path from "path";

export async function createCompanyAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // 🧩 Security — only admin can create company
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized — only admin can create company");
  }

  // ❗ Prevent admin from creating multiple companies
  if (session.user.companyId) {
    return { error: "A company already exists for this admin." };
  }

  const name = String(formData.get("name"));
  // const logo = formData.get("logo") as File | null;
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

  const logoFile = formData.get("logo") as File | null;
  let logoPath: string | null = null;

  // 🔥 If a file is uploaded, save it to public/uploads/company
  if (logoFile && logoFile.size > 0) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(logoFile.type)) {
      return { error: "Only PNG, JPG, JPEG, WEBP images are allowed." };
    }

    const bytes = Buffer.from(await logoFile.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "uploads", "company");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${session.user.id}-${Date.now()}-${logoFile.name}`;
    const fullPath = path.join(uploadDir, fileName);

    await fs.writeFile(fullPath, bytes);

    logoPath = `/uploads/company/${fileName}`;
  }

  try {
    // 🏢 Create company linked to admin
    const company = await prisma.company.create({
      data: {
        name,
        logo: logoPath,
        vatNumber,
        crNumber,
        phone,
        email,
        website,
        address,
      },
    });

      await prisma.user.update({
    where: { id: session.user.id },
    data: { companyId: company.id },
  });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create company" };
  }
}


export async function updateCompanyAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const companyId = session.user.companyId;
  if (!companyId) {
    throw new Error("No company found for this user");
  }

    const data: {
    name: string;
    logo: string | null;
    vatNumber: string | null;
    crNumber: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
  } = {
    name: String(formData.get("name")),
    logo: null, // default
    vatNumber: formData.get("vatNumber") ? String(formData.get("vatNumber")) : null,
    crNumber: formData.get("crNumber") ? String(formData.get("crNumber")) : null,
    phone: formData.get("phone") ? String(formData.get("phone")) : null,
    email: formData.get("email") ? String(formData.get("email")) : null,
    website: formData.get("website") ? String(formData.get("website")) : null,
    address: formData.get("address") ? String(formData.get("address")) : null,
  };

  const logoFile = formData.get("logo") as File | null;

  if (logoFile && logoFile.size > 0) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(logoFile.type)) {
      return { error: "Only PNG, JPG, JPEG, WEBP images are allowed." };
    }

    if (logoFile.size > 2 * 1024 * 1024) {
      return { error: "Logo image must be less than 2MB." };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    // Delete old logo if exists
    if (company?.logo) {
      const oldPath = path.join(process.cwd(), "public", company.logo);
      try {
        await fs.unlink(oldPath);
      } catch {}
    }

    // Save new file
    const bytes = Buffer.from(await logoFile.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "company");

    await fs.mkdir(uploadsDir, { recursive: true });

    const sanitized = logoFile.name.replace(/\s+/g, "_");
    const fileName = `${companyId}-${Date.now()}-${sanitized}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, bytes);

    data.logo = `/uploads/company/${fileName}`;
  }

  await prisma.company.update({
    where: { id: companyId },
    data,
  });

  return { success: true };
}