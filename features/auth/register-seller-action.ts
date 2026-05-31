"use server"

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { register } from "@/schemas/auth/register";

function generateSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export async function registerSellerAction(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        storeName: formData.get("storeName"),
        whatsappNumber: formData.get("whatsappNumber"),
        description: formData.get("description"),
    };

    const result = register.safeParse(rawData);

    if (!result.success) {
        const firstError = result.error.issues[0]?.message || "Data tidak valid.";
        throw new Error(firstError);
    }

    const { name, email, password, storeName, whatsappNumber, description } =
        result.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("Email sudah digunakan.");
    }

    const baseSlug = generateSlug(storeName);

    const existingStore = await prisma.sellerProfile.findUnique({
        where: {
            storeSlug: baseSlug,
        },
    });

    const storeSlug = existingStore
        ? `${baseSlug}-${Date.now()}`
        : baseSlug;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "SELLER",
            status: "ACTIVE",
            sellerProfile: {
                create: {
                    storeName,
                    storeSlug,
                    whatsappNumber,
                    description: description || null,
                    status: "PENDING_VERIFICATION",
                },
            },
        },
    });

    redirect("/login");
}