"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema validasi input
const SellerActionSchema = z.object({
  sellerId: z.string().min(1, "Seller ID wajib diisi"),
  reason: z.string().optional(),
});

export async function approveSeller(formData: FormData) {
  const { sellerId } = SellerActionSchema.parse({
    sellerId: formData.get("sellerId"),
  });

  // Update SellerProfile status menjadi ACTIVE
  await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: { status: "ACTIVE" },
  });

  // Pastikan user status juga ACTIVE (jika sebelumnya SUSPENDED)
  const profile = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
    select: { userId: true },
  });
  if (profile) {
    await prisma.user.update({
      where: { id: profile.userId },
      data: { status: "ACTIVE" },
    });
  }

  revalidatePath("/admin/sellers");
}

export async function rejectSeller(formData: FormData) {
  const { sellerId, reason } = SellerActionSchema.parse({
    sellerId: formData.get("sellerId"),
    reason: formData.get("reason") || undefined,
  });

  await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: {
      status: "REJECTED",
      rejectionReason: reason, // simpan alasan
    },
  });

  revalidatePath("/admin/sellers");
}

export async function suspendSeller(formData: FormData) {
  const { sellerId } = SellerActionSchema.parse({
    sellerId: formData.get("sellerId"),
  });

  const profile = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
    select: { userId: true },
  });

  if (profile) {
    await prisma.user.update({
      where: { id: profile.userId },
      data: { status: "SUSPENDED" },
    });
    await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status: "SUSPENDED" },
    });
  }

  revalidatePath("/admin/sellers");
}

export async function activateSeller(formData: FormData) {
  const { sellerId } = SellerActionSchema.parse({
    sellerId: formData.get("sellerId"),
  });

  const profile = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
    select: { userId: true },
  });

  if (profile) {
    await prisma.user.update({
      where: { id: profile.userId },
      data: { status: "ACTIVE" },
    });
    await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status: "ACTIVE" },
    });
  }

  revalidatePath("/admin/sellers");
}
