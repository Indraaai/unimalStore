"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    Menu,
    LayoutDashboard,
    ShoppingBag,
    Crown,
    Zap,
    BarChart3,
    Store,
    Users,
    Tags,
    Package,
    CreditCard,
    LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    ShoppingBag,
    Crown,
    Zap,
    BarChart3,
    Store,
    Users,
    Tags,
    Package,
    CreditCard,
};

export interface NavItem {
    label: string;
    href: string;
    icon: string | React.ElementType;
}

interface SidebarProps {
    navItems: readonly NavItem[];
    role: "ADMIN" | "SELLER";
}

export function Sidebar({ navItems, role }: SidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Tutup sheet mobile saat rute berubah
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-6">
            <div className="px-4 mb-8">
                <h2 className="text-xl font-bold text-primary">
                    {role === "ADMIN" ? "Admin Panel" : "Seller Panel"}
                </h2>
                <p className="text-xs text-muted-foreground">Unimal Store</p>
            </div>
            <nav className="flex-1 space-y-1 px-2">
                {navItems.map((item) => {
                    const IconComponent =
                        typeof item.icon === "string" ? iconMap[item.icon] : item.icon;
                    const Icon = IconComponent || LayoutDashboard;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:border-r bg-card">
                <SidebarContent />
            </aside>

            {/* Mobile sheet trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}