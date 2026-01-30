"use client";

import { useState } from "react";
import { GamificationUpdate } from "@/types/gamification";
import { auth } from "@/lib/firebase";

export function useGamification() {
    const [isUpdating, setIsUpdating] = useState(false);

    const awardTaskCompletion = async (): Promise<GamificationUpdate | null> => {
        setIsUpdating(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error("Not authenticated");
            }

            const response = await fetch("/api/gamification/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update gamification");
            }

            const data: GamificationUpdate = await response.json();
            return data;
        } catch (error) {
            console.error("Gamification update error:", error);
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        awardTaskCompletion,
        isUpdating,
    };
}
