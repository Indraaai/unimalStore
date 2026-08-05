import { prisma } from "@/lib/prisma";
import { MembershipPlansTable } from "@/components/admin/membership-plans-table";

export const dynamic = "force-dynamic";

export default async function AdminMembershipPlansPage() {
    const plans = await prisma.membershipPlan.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Manajemen Paket Membership</h2>
                <p className="text-muted-foreground">
                    Kelola paket langganan yang tersedia untuk seller
                </p>
            </div>
            <MembershipPlansTable plans={plans} />
        </div>
    );
}