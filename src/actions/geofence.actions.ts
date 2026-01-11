"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session || !["ADMIN", "HR"].includes(session.user.role)) throw new Error("Unauthorized");
  return session;
}

export async function createGeoFenceAction(formData: FormData) {
  const session = await getSession();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const radiusM = Number(formData.get("radiusM"));
//   const branchId = formData.get("branchId") ? String(formData.get("branchId")) : null;
  const branchId = String(formData.get("branchId"));
  const companyId = branchId ? null : session.user.companyId;

  try {
       // 🔹 Check that the branch exists
        const branch = await prisma.branch.findFirst({
    where: { id: branchId },
  });
       if (!branch) {
    throw new Error("Invalid branch — does not belong to your company");
  }
  
      // 🏢 Create company linked to admin
      const geoFence = await prisma.geoFence.create({
        data: {
      latitude, longitude, radiusM, branchId, companyId
         
        },
        
      });
      
  
      return { success: true, return: geoFence };
    } catch (err) {
      console.error(err);
      return { error: "Failed to create GeoFence" };
    }

//   return prisma.geoFence.create({ data: { latitude, longitude, radiusM, branchId, companyId } });
}

export async function updateGeoFenceAction(formData: FormData) {
  const id = String(formData.get("id"));
  const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : undefined;
  const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : undefined;
  const radiusM = formData.get("radiusM") ? Number(formData.get("radiusM")) : undefined;

  return prisma.geoFence.update({ where: { id }, data: { latitude, longitude, radiusM } });
}

export async function deleteGeoFenceAction(formData: FormData) {
  const id = String(formData.get("id"));
  return prisma.geoFence.delete({ where: { id } });
}

export async function getGeoFencesAction(branchId?: string) {
  const session = await getSession();
  return prisma.geoFence.findMany({
    // where: { branchId: branchId ?? undefined, companyId: branchId ? undefined : session.user.companyId }
    include:{branch: true}
  });
}