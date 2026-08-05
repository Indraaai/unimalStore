import { prisma } from "@/lib/prisma";
import { SellersTable } from "@/components/admin/sellers-table";

export const dynamic = "force-dynamic"; // Hindari caching data

export default async function AdminSellersPage() {
    const sellers = await prisma.sellerProfile.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                },
            },
        },
        orderBy: { createdAt: "desc" }, // asumsikan ada createdAt, jika tidak bisa pakai updatedAt
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Manajemen Seller</h2>
                <p className="text-muted-foreground">
                    Verifikasi dan kelola akun penjual
                </p>
            </div>
            <SellersTable sellers={sellers} />
        </div>
    );
}