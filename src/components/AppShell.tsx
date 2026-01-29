"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { redirect, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    // Public routes that don't need the shell
    const publicRoutes = ["/login", "/signup", "/", "/onboarding"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user && !isPublicRoute) {
        redirect("/login");
    }

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full bg-background min-h-screen">
                {children}
            </main>
        </div>
    );
}
