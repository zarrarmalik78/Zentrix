"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProgressToNextLevel, getXpToNextLevel } from "@/lib/gamification-utils";

export function XPProgress() {
    const { userProfile } = useAuth();
    const xp = userProfile?.gamification?.xp || 0;
    const level = userProfile?.gamification?.level || 1;
    const progress = getProgressToNextLevel(xp);
    const xpToNext = getXpToNextLevel(xp);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Level</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">{xp} XP</p>
                    <p className="text-xs text-muted-foreground">{xpToNext} to next</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
        </div>
    );
}
