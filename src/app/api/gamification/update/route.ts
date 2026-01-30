import { NextRequest, NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import {
    calculateLevel,
    checkStreak,
    checkBadgeUnlocks,
    XP_REWARDS,
} from "@/lib/gamification-utils";
import { GamificationData, GamificationUpdate } from "@/types/gamification";

// Initialize Firebase Admin (only once)
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, "\n"),
            }),
        });
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

const db = getFirestore();

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Get current user data
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        const currentGamification: GamificationData = userData?.gamification || {
            xp: 0,
            level: 1,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            totalTasksCompleted: 0,
            badges: [],
        };

        // Calculate XP gain (base + streak bonus)
        const baseXP = XP_REWARDS.TASK_COMPLETE;
        const streakBonus = currentGamification.currentStreak * XP_REWARDS.STREAK_BONUS;
        const xpGained = baseXP + streakBonus;

        // Update XP and level
        const newXp = currentGamification.xp + xpGained;
        const oldLevel = currentGamification.level;
        const newLevel = calculateLevel(newXp);
        const levelUp = newLevel > oldLevel;

        // Check and update streak
        const streakCheck = checkStreak(currentGamification.lastActivityDate);
        let newStreak = currentGamification.currentStreak;
        let newLongestStreak = currentGamification.longestStreak;

        if (streakCheck.shouldReset) {
            newStreak = 1; // Reset to 1 (today's activity)
        } else if (streakCheck.shouldIncrement) {
            newStreak = currentGamification.currentStreak + 1;
        }

        if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
        }

        // Update task count
        const newTaskCount = currentGamification.totalTasksCompleted + 1;

        // Prepare updated gamification data
        const updatedGamification: GamificationData = {
            xp: newXp,
            level: newLevel,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActivityDate: new Date().toISOString(),
            totalTasksCompleted: newTaskCount,
            badges: currentGamification.badges,
        };

        // Check for new badge unlocks
        const newBadges = checkBadgeUnlocks(updatedGamification);
        if (newBadges.length > 0) {
            updatedGamification.badges = [
                ...currentGamification.badges,
                ...newBadges.map(b => b.id),
            ];
        }

        // Update Firestore
        await userRef.update({
            gamification: updatedGamification,
        });

        // Prepare response
        const response: GamificationUpdate = {
            xpGained,
            levelUp,
            newLevel: levelUp ? newLevel : undefined,
            newBadges,
            streakUpdated: streakCheck.shouldIncrement || streakCheck.shouldReset,
            newStreak: streakCheck.shouldIncrement || streakCheck.shouldReset ? newStreak : undefined,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Gamification update error:", error);
        return NextResponse.json(
            { error: "Failed to update gamification data" },
            { status: 500 }
        );
    }
}
