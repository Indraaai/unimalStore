import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { sellerNavItems } from "@/lib/navigation/seller";

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SELLER") {
        redirect("/login");
    }

    return (
        <DashboardLayout
            navItems={sellerNavItems}
            user={{ name: session.user.name ?? "", role: "SELLER" }}
        >
            {children}
        </DashboardLayout>
    );
}