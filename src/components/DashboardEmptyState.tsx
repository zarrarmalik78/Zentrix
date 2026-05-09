"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    onGeneratePlan: () => void;
}

export function DashboardEmptyState({ onGeneratePlan }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
            {/* Animated Icon */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8"
            >
                <Sparkles className="w-16 h-16 text-white" />
            </motion.div>

            {/* Heading */}
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                Welcome to Zentrix! 👋
            </h2>

            <p className="text-lg text-muted-foreground max-w-md mb-2">
                You don't have any tasks yet.
            </p>

            <p className="text-md text-muted-foreground max-w-md mb-8">
                Let's create your personalized AI-powered learning journey!
            </p>

            {/* CTA Button */}
            <Button
                size="lg"
                onClick={onGeneratePlan}
                className="rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
            >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Generate My Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Info Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl mb-2">🤖</div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">AI-Powered</h3>
                    <p className="text-sm text-muted-foreground">
                        Personalized curriculum based on your course and level
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Smart Scheduling</h3>
                    <p className="text-sm text-muted-foreground">
                        Daily tasks optimized for your study hours
                    </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl mb-2">🔥</div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Track Progress</h3>
                    <p className="text-sm text-muted-foreground">
                        Earn XP, build streaks, unlock achievements
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
