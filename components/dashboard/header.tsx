"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
    user: {
        name: string;
        role: "ADMIN" | "SELLER";
    };
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="flex items-center justify-between border-b px-6 py-4 bg-card">
            <div>
                <h1 className="text-lg font-semibold">Selamat datang, {user.name}</h1>
                <p className="text-sm text-muted-foreground">
                    Role: {user.role === "ADMIN" ? "Administrator" : "Seller"}
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
            >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>
        </header>
    );
}