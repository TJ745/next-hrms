"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/argon2";
import { redirect } from "next/navigation";

export async function setPasswordAction(formData: FormData) {
  const token = String(formData.get("token"));
  const password = String(formData.get("password"));

  if (!token || !password) {
    throw new Error("Missing fields");
  }

  const invite = await prisma.inviteToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!invite) throw new Error("Invalid token");
  if (invite.expiresAt < new Date()) throw new Error("Token expired");

  const hashed = await hashPassword(password);

  // Update user password
  await prisma.user.update({
    where: { id: invite.user.id },
    data: {
    //   password: hashed,
    },
  });

  // Delete onboarding token
  await prisma.inviteToken.delete({
    where: { token },
  });

  redirect("/auth/login");
}
