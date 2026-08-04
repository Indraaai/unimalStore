import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";  // pastikan path auth config benar
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { adminNavItems } from "@/lib/navigation/admin";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <DashboardLayout
            navItems={adminNavItems}
            user={{ name: session.user.name ?? "", role: "ADMIN" }}
        >
            {children}
        </DashboardLayout>
    );
}