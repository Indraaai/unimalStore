import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { sellerNavItems } from "@/lib/navigation/seller";
import { PendingVerification } from "@/components/seller/pending-verification";
import { RejectedNotice } from "@/components/seller/rejected-notice";

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SELLER") {
        redirect("/login");
    }

    const profile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
        select: {
            status: true,
            storeName: true,
            rejectionReason: true,
        },
    });

    const userName = session.user.name ?? "";

    if (!profile) {
        return (
            <DashboardLayout
                navItems={sellerNavItems}
                user={{ name: userName, role: "SELLER" }}
            >
                <div className="flex items-center justify-center h-full">
                    <p>Profil tidak ditemukan. Hubungi admin.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (profile.status === "PENDING_VERIFICATION") {
        return (
            <DashboardLayout
                navItems={sellerNavItems}
                user={{ name: userName, role: "SELLER" }}
            >
                <PendingVerification storeName={profile.storeName} />
            </DashboardLayout>
        );
    }

    if (profile.status === "REJECTED") {
        return (
            <DashboardLayout
                navItems={sellerNavItems}
                user={{ name: userName, role: "SELLER" }}
            >
                <RejectedNotice
                    storeName={profile.storeName}
                    reason={profile.rejectionReason}
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            navItems={sellerNavItems}
            user={{ name: userName, role: "SELLER" }}
        >
            {children}
        </DashboardLayout>
    );
}