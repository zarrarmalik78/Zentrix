"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BADGES, getBadgeRarityColor } from "@/lib/gamification-utils";
import { Badge } from "@/types/gamification";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function BadgeGrid() {
    const { userProfile } = useAuth();
    const unlockedBadges = userProfile?.gamification?.badges || [];
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    return (
        <>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {BADGES.map((badge) => {
                    const isUnlocked = unlockedBadges.includes(badge.id);
                    const IconComponent = (Icons as any)[badge.icon] || Icons.Award;

                    return (
                        <motion.button
                            key={badge.id}
                            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                            whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative aspect-square rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${isUnlocked
                                    ? `bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} border-white/50 shadow-lg`
                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-40 grayscale'
                                }`}
                        >
                            <IconComponent className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-slate-400'}`} />
                            {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                    <Icons.Lock className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Badge Detail Modal */}
            <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedBadge && (
                                <>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getBadgeRarityColor(selectedBadge.rarity)} flex items-center justify-center`}>
                                        {(() => {
                                            const IconComponent = (Icons as any)[selectedBadge.icon] || Icons.Award;
                                            return <IconComponent className="w-6 h-6 text-white" />;
                                        })()}
                                    </div>
                                    <div>
                                        <p>{selectedBadge.name}</p>
                                        <p className="text-sm font-normal text-muted-foreground capitalize">
                                            {selectedBadge.rarity}
                                        </p>
                                    </div>
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedBadge?.description}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
