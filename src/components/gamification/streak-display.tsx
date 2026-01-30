"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function StreakDisplay() {
    const { userProfile } = useAuth();
    const currentStreak = userProfile?.gamification?.currentStreak || 0;
    const longestStreak = userProfile?.gamification?.longestStreak || 0;

    return (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-200 dark:border-orange-800">
            <motion.div
                animate={{
                    scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
                }}
                transition={{
                    duration: 2,
                    repeat: currentStreak > 0 ? Infinity : 0,
                    ease: "easeInOut",
                }}
            >
                <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            </motion.div>
            <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentStreak} Day Streak
                </p>
                <p className="text-xs text-muted-foreground">
                    Best: {longestStreak}
                </p>
            </div>
        </div>
    );
}
