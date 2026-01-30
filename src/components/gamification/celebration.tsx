"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Badge } from "@/types/gamification";
import { getBadgeRarityColor } from "@/lib/gamification-utils";

interface CelebrationProps {
    type: "levelUp" | "badge";
    level?: number;
    badge?: Badge;
    onComplete: () => void;
}

export function Celebration({ type, level, badge, onComplete }: CelebrationProps) {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
            setTimeout(onComplete, 500);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <>
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={onComplete}
            >
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md mx-4 text-center space-y-4 shadow-2xl"
                >
                    {type === "levelUp" && (
                        <>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{ duration: 0.5 }}
                                className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center"
                            >
                                <Icons.Zap className="w-12 h-12 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Level Up!</h2>
                            <p className="text-6xl font-black bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                                {level}
                            </p>
                            <p className="text-muted-foreground">You've reached a new level!</p>
                        </>
                    )}

                    {type === "badge" && badge && (
                        <>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360],
                                }}
                                transition={{ duration: 1 }}
                                className={`w-24 h-24 mx-auto bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} rounded-full flex items-center justify-center`}
                            >
                                {(() => {
                                    const IconComponent = (Icons as any)[badge.icon] || Icons.Award;
                                    return <IconComponent className="w-12 h-12 text-white" />;
                                })()}
                            </motion.div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Badge Unlocked!</h2>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{badge.name}</p>
                            <p className="text-muted-foreground">{badge.description}</p>
                            <p className="text-sm font-medium capitalize text-primary">{badge.rarity}</p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}
