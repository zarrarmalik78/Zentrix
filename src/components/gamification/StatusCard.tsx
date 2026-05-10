"use client";

import { motion } from "framer-motion";
import { Zap, Target, Star, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateLevel, getLevelProgress } from "@/lib/gamification-utils";

export function StatusCard() {
    const { userProfile } = useAuth();
    
    if (!userProfile?.gamification) return null;
    
    const { xp, currentStreak, level } = userProfile.gamification;
    const { currentXp, nextLevelXp, progress } = getLevelProgress(xp);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level & XP Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-indigo-500/20 group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-24 h-24 rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-500/30">
                            <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-indigo-300">Mastery Level</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-black">Level {level}</span>
                        <span className="text-indigo-400 font-bold text-sm">Rank: Explorer</span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-indigo-300/70">
                            <span>{currentXp} XP</span>
                            <span>{nextLevelXp} XP</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Current Streak</span>
                </div>
                
                <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900">{currentStreak}</span>
                        <span className="text-orange-500 font-bold">Days</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Keep it up! You're on fire. 🔥</p>
                </div>
            </motion.div>

            {/* Daily Goal Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Daily Focus</span>
                </div>
                
                <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900">3/5</span>
                        <span className="text-green-600 font-bold">Modules</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Almost there! Complete 2 more to hit your goal.</p>
                </div>
            </motion.div>
        </div>
    );
}
