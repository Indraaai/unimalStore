"use client";

import { Sidebar, NavItem } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
    navItems: readonly NavItem[];
    user: {
        name: string;
        role: "ADMIN" | "SELLER";
    };
    children: React.ReactNode;
}

export function DashboardLayout({ navItems, user, children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar navItems={navItems} role={user.role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}