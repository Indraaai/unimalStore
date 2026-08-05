import { prisma } from "@/lib/prisma";
import { CategoriesTable } from "@/components/admin/categories-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Manajemen Kategori</h2>
                <p className="text-muted-foreground">
                    Kelola kategori produk yang tersedia untuk seller
                </p>
            </div>
            <CategoriesTable categories={categories} />
        </div>
    );
}