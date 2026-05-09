"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface GeneratingPlanLoaderProps {
    message?: string;
}

export function GeneratingPlanLoader({ message = "Creating your personalized plan..." }: GeneratingPlanLoaderProps) {
    const steps = [
        "Analyzing learning goals",
        "Structuring curriculum phases",
        "Mapping educational resources",
        "Optimizing your schedule",
        "Finalizing your journey",
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md mx-4 text-center space-y-6 shadow-2xl"
            >
                {/* Animated Robot Icon */}
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                    <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        🤖 AI is Working
                    </h2>
                    <p className="text-muted-foreground">{message}</p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className="flex items-center gap-3 text-sm"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    delay: index * 0.3,
                                    duration: 0.5,
                                }}
                                className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                            >
                                <motion.svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: index * 0.3 + 0.2, duration: 0.3 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </motion.svg>
                            </motion.div>
                            <span className="text-slate-700 dark:text-slate-300">{step}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Spinning Loader */}
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Please wait...</span>
                </div>
            </motion.div>
        </div>
    );
}
