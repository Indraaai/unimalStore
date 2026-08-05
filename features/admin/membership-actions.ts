"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MembershipPlanSchema } from "@/schemas/membership-plan";

export async function createMembershipPlan(formData: FormData) {
    const data = MembershipPlanSchema.parse({
        name: formData.get("name"),
        price: formData.get("price"),
        durationDays: formData.get("durationDays"),
        productLimit: formData.get("productLimit"),
        canUseFeaturedAds:
            formData.get("canUseFeaturedAds") === "true" ||
            formData.get("canUseFeaturedAds") === "on",
    });

    await prisma.membershipPlan.create({ data });
    revalidatePath("/admin/membership-plans");
}

export async function updateMembershipPlan(formData: FormData) {
    const id = formData.get("id") as string;
    const data = MembershipPlanSchema.parse({
        name: formData.get("name"),
        price: formData.get("price"),
        durationDays: formData.get("durationDays"),
        productLimit: formData.get("productLimit"),
        canUseFeaturedAds:
            formData.get("canUseFeaturedAds") === "true" ||
            formData.get("canUseFeaturedAds") === "on",
    });

    await prisma.membershipPlan.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/membership-plans");
}

export async function toggleMembershipPlanStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const plan = await prisma.membershipPlan.findUnique({ where: { id } });
    if (!plan) return;

    await prisma.membershipPlan.update({
        where: { id },
        data: { isActive: !plan.isActive },
    });
    revalidatePath("/admin/membership-plans");
}

export async function deleteMembershipPlan(formData: FormData) {
    const id = formData.get("id") as string;
    // Cek apakah ada pembayaran terkait?
    // Sementara kita izinkan hapus, atau bisa ditambahkan validasi nanti
    await prisma.membershipPlan.delete({ where: { id } });
    revalidatePath("/admin/membership-plans");
}