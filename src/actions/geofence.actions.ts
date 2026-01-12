"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session || !["ADMIN", "HR"].includes(session.user.role))
    throw new Error("Unauthorized");
  return session;
}

export async function createGeoFenceAction(formData: FormData) {
  const session = await getSession();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const radiusM = Number(formData.get("radiusM"));
  const branchId = String(formData.get("branchId"));

  if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusM) || radiusM <= 0) {
    return { error: "Invalid geo fence data" };
  }

  try {
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, companyId: session.user.companyId },
    });
    if (!branch) {
      throw new Error("Invalid branch — does not belong to your company");
    }

    const geoFence = await prisma.geoFence.create({
      data: {
        latitude,
        longitude,
        radiusM,
        branchId,
      },
    });

    return { success: true, return: geoFence };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create GeoFence" };
  }
}

export async function updateGeoFenceAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id"));

  const fence = await prisma.geoFence.findFirst({
    where: {
      id,
      branch: { companyId: session.user.companyId },
    },
  });
  if (!fence) throw new Error("Forbidden");

  const latitude = formData.get("latitude")
    ? Number(formData.get("latitude"))
    : undefined;
  const longitude = formData.get("longitude")
    ? Number(formData.get("longitude"))
    : undefined;
  const radiusM = formData.get("radiusM")
    ? Number(formData.get("radiusM"))
    : undefined;

  return prisma.geoFence.update({
    where: { id },
    data: { latitude, longitude, radiusM },
  });
}

export async function deleteGeoFenceAction(id: string) {
  const session = await getSession();
  const fence = await prisma.geoFence.findFirst({
    where: { id, branch: { companyId: session.user.companyId } },
  });
  if (!fence) throw new Error("Forbidden");
  return prisma.geoFence.delete({ where: { id } });
}

export async function getGeoFencesAction(branchId?: string) {
  const session = await getSession();
  return prisma.geoFence.findMany({
    where: {
      branch: {
        companyId: session.user.companyId,
      },
      ...(branchId ? { branchId } : {}),
    },
    include: { branch: true },
  });
}
