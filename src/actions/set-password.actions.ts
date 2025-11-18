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

  // 1. Check if credentials account exists
  const existingAccount = await prisma.account.findFirst({
    where: {
      userId: invite.userId,
      providerId: "credential",
    },
  });

  // 2. If found → update password
  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: hashed },
    });
  } 
  // 3. If not → create credentials account
  else {
    await prisma.account.create({
      data: {
        userId: invite.userId,
        providerId: "credential",
        accountId: invite.userId, // can be anything unique-ish
        password: hashed,
      },
    });
  }

  // Delete onboarding token
  await prisma.inviteToken.delete({
    where: { token },
  });

  redirect("/auth/login");
}
