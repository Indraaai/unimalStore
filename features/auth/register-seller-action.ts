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

export type RegisterSellerState = {
    success: boolean;
    message: string;
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
        storeName?: string[];
        whatsappNumber?: string[];
        description?: string[];
    };
}


export async function registerSellerAction(prevState: RegisterSellerState, formData: FormData): Promise<RegisterSellerState> {
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
        return {
            success: false,
            message: "Validasi gagal. Periksa kembali input Anda.",
            error: result.error.flatten().fieldErrors,
        };
    }
    const { name, email, password, storeName, whatsappNumber, description } =
        result.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return {
            success: false,
            message: "Email sudah terdaftar. Silakan gunakan email lain.",
            error: {
                email: ["Email sudah terdaftar. Silakan gunakan email lain."],
            },
        }
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

    redirect("/login?registered=success");
}