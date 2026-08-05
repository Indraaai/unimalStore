"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema validasi
const CategorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    description: z.string().optional(),
});

// Helper untuk generate slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
    const data = CategorySchema.parse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    let slug = generateSlug(data.name);
    // Cek duplikat slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
        slug = `${slug}-${Date.now()}`;
    }

    await prisma.category.create({
        data: {
            name: data.name,
            slug,
            description: data.description,
        },
    });

    revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
    const id = formData.get("id") as string;
    const data = CategorySchema.parse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    let slug = generateSlug(data.name);
    const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id } },
    });
    if (existing) {
        slug = `${slug}-${Date.now()}`;
    }

    await prisma.category.update({
        where: { id },
        data: {
            name: data.name,
            slug,
            description: data.description,
        },
    });

    revalidatePath("/admin/categories");
}

export async function toggleCategoryStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return;

    await prisma.category.update({
        where: { id },
        data: { isActive: !category.isActive },
    });

    revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
    const id = formData.get("id") as string;
    // Cek apakah ada produk yang terhubung
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
        throw new Error("Kategori tidak bisa dihapus karena masih ada produk yang menggunakannya.");
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
}