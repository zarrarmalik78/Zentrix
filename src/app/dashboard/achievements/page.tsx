"use client";

import { useAuth } from "@/contexts/AuthContext";
import { XPProgress } from "@/components/gamification/xp-progress";
import { StreakDisplay } from "@/components/gamification/streak-display";
import { BadgeGrid } from "@/components/gamification/badge-grid";
import { Trophy, Target, Flame, Zap } from "lucide-react";

export default function AchievementsPage() {
    const { userProfile } = useAuth();
    const gamification = userProfile?.gamification;

    const stats = [
        {
            label: "Total XP",
            value: gamification?.xp || 0,
            icon: Zap,
            color: "from-purple-500 to-indigo-600",
        },
        {
            label: "Level",
            value: gamification?.level || 1,
            icon: Trophy,
            color: "from-amber-500 to-orange-600",
        },
        {
            label: "Tasks Completed",
            value: gamification?.totalTasksCompleted || 0,
            icon: Target,
            color: "from-blue-500 to-cyan-600",
        },
        {
            label: "Current Streak",
            value: `${gamification?.currentStreak || 0} days`,
            icon: Flame,
            color: "from-orange-500 to-red-600",
        },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Achievements</h1>
                <p className="text-muted-foreground mt-2">Track your progress and unlock badges</p>
            </div>

            {/* XP Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <XPProgress />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak Display */}
            <StreakDisplay />

            {/* Badges */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Badge Collection</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {gamification?.badges.length || 0} / 12 unlocked
                    </p>
                </div>
                <BadgeGrid />
            </div>
        </div>
    );
}
