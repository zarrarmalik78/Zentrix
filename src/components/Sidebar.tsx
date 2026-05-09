"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CalendarDays,
    BarChart3,
    Settings,
    LogOut,
    GraduationCap,
    BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export function Sidebar() {
    const pathname = usePathname();
    const { userProfile, signOut } = useAuth();

    const routes = [
        {
            label: "Home",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Schedule",
            icon: CalendarDays,
            href: "/calendar",
            active: pathname === "/calendar",
        },
        {
            label: "Progress",
            icon: BarChart3,
            href: "/analytics",
            active: pathname === "/analytics",
        },
        {
            label: "Achievements",
            icon: GraduationCap,
            href: "/dashboard/achievements",
            active: pathname === "/dashboard/achievements",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            active: pathname === "/settings",
        },
    ];

    return (
        <div className="h-full py-6 flex flex-col bg-slate-50 border-r border-slate-100">
            {/* Logo */}
            <div className="px-6 mb-10">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Zentrix</h1>
                        <p className="text-xs text-muted-foreground font-medium">Study Planner AI</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="px-4 flex-1 space-y-1">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "relative group flex p-3.5 w-full justify-start font-medium cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden",
                            route.active
                                ? "bg-white text-primary shadow-sm shadow-indigo-100"
                                : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                        )}
                    >
                        {route.active && (
                            <motion.div
                                layoutId="activeTabOutline"
                                className="absolute inset-0 rounded-2xl border-2 border-primary/5 pointer-events-none"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <div className="flex items-center flex-1 relative z-10">
                            <route.icon className={cn(
                                "h-5 w-5 mr-3 transition-colors",
                                route.active ? "text-primary" : "text-slate-400 group-hover:text-primary/70"
                            )} />
                            {route.label}
                        </div>
                        {route.active && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full"
                            />
                        )}
                    </Link>
                ))}
            </div>

            {/* User & Settings */}
            <div className="px-4 mt-auto space-y-2">
                <Link
                    href="/settings"
                    className={cn(
                        "group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl hover:bg-white transition-all text-slate-500 hover:text-slate-800"
                    )}
                >
                    <div className="flex items-center flex-1">
                        <Settings className="h-5 w-5 mr-3 text-slate-400 group-hover:text-slate-600" />
                        Settings
                    </div>
                </Link>

                <div className="pt-4 border-t border-slate-200/60">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-primary font-bold text-sm border-2 border-white shadow-sm">
                                {userProfile?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{userProfile?.email.split('@')[0]}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
