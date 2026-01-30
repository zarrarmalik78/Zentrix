import { Badge, GamificationData } from "@/types/gamification";

// XP Formula: Level = sqrt(XP / 100)
// To reach level N, you need N^2 * 100 XP
export function calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100));
}

export function getXpForLevel(level: number): number {
    return level * level * 100;
}

export function getXpToNextLevel(currentXp: number): number {
    const currentLevel = calculateLevel(currentXp);
    const nextLevelXp = getXpForLevel(currentLevel + 1);
    return nextLevelXp - currentXp;
}

export function getProgressToNextLevel(currentXp: number): number {
    const currentLevel = calculateLevel(currentXp);
    const currentLevelXp = getXpForLevel(currentLevel);
    const nextLevelXp = getXpForLevel(currentLevel + 1);
    const progress = (currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp);
    return Math.round(progress * 100);
}

// Check if user's streak should continue, break, or stay the same
export function checkStreak(lastActivityDate: string | null): {
    shouldIncrement: boolean;
    shouldReset: boolean;
} {
    if (!lastActivityDate) {
        return { shouldIncrement: true, shouldReset: false };
    }

    const last = new Date(lastActivityDate);
    const now = new Date();

    // Reset time to start of day for comparison
    last.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day - no change
        return { shouldIncrement: false, shouldReset: false };
    } else if (daysDiff === 1) {
        // Next day - increment streak
        return { shouldIncrement: true, shouldReset: false };
    } else {
        // Missed a day - reset streak
        return { shouldIncrement: false, shouldReset: true };
    }
}

// Predefined badges
export const BADGES: Badge[] = [
    // Starter Badges (Common)
    {
        id: 'first_task',
        name: 'Getting Started',
        description: 'Complete your first task',
        icon: 'CheckCircle',
        color: 'green-500',
        rarity: 'common',
        requirement: { type: 'tasks', value: 1 }
    },
    {
        id: 'ten_tasks',
        name: 'Task Master',
        description: 'Complete 10 tasks',
        icon: 'Target',
        color: 'blue-500',
        rarity: 'common',
        requirement: { type: 'tasks', value: 10 }
    },
    {
        id: 'fifty_tasks',
        name: 'Productivity Pro',
        description: 'Complete 50 tasks',
        icon: 'Zap',
        color: 'blue-600',
        rarity: 'common',
        requirement: { type: 'tasks', value: 50 }
    },

    // Streak Badges (Rare)
    {
        id: 'three_day_streak',
        name: '3-Day Fire',
        description: 'Maintain a 3-day streak',
        icon: 'Flame',
        color: 'orange-500',
        rarity: 'rare',
        requirement: { type: 'streak', value: 3 }
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'Zap',
        color: 'yellow-500',
        rarity: 'rare',
        requirement: { type: 'streak', value: 7 }
    },
    {
        id: 'month_master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: 'Crown',
        color: 'orange-600',
        rarity: 'rare',
        requirement: { type: 'streak', value: 30 }
    },

    // XP Badges (Epic)
    {
        id: 'novice',
        name: 'Novice Scholar',
        description: 'Reach 100 XP',
        icon: 'BookOpen',
        color: 'purple-500',
        rarity: 'epic',
        requirement: { type: 'xp', value: 100 }
    },
    {
        id: 'expert',
        name: 'Expert Scholar',
        description: 'Reach 500 XP',
        icon: 'GraduationCap',
        color: 'purple-600',
        rarity: 'epic',
        requirement: { type: 'xp', value: 500 }
    },
    {
        id: 'master',
        name: 'Master Scholar',
        description: 'Reach 1000 XP',
        icon: 'Award',
        color: 'purple-700',
        rarity: 'epic',
        requirement: { type: 'xp', value: 1000 }
    },

    // Level Badges (Legendary)
    {
        id: 'level_5',
        name: 'Level 5 Achievement',
        description: 'Reach level 5',
        icon: 'Award',
        color: 'amber-500',
        rarity: 'legendary',
        requirement: { type: 'level', value: 5 }
    },
    {
        id: 'level_10',
        name: 'Level 10 Achievement',
        description: 'Reach level 10',
        icon: 'Crown',
        color: 'amber-600',
        rarity: 'legendary',
        requirement: { type: 'level', value: 10 }
    },
    {
        id: 'level_20',
        name: 'Level 20 Achievement',
        description: 'Reach level 20',
        icon: 'Trophy',
        color: 'amber-700',
        rarity: 'legendary',
        requirement: { type: 'level', value: 20 }
    },
];

// Check which badges should be unlocked
export function checkBadgeUnlocks(userData: GamificationData): Badge[] {
    const newBadges: Badge[] = [];

    for (const badge of BADGES) {
        // Skip if already unlocked
        if (userData.badges.includes(badge.id)) {
            continue;
        }

        let shouldUnlock = false;

        switch (badge.requirement.type) {
            case 'tasks':
                shouldUnlock = userData.totalTasksCompleted >= badge.requirement.value;
                break;
            case 'streak':
                shouldUnlock = userData.currentStreak >= badge.requirement.value;
                break;
            case 'xp':
                shouldUnlock = userData.xp >= badge.requirement.value;
                break;
            case 'level':
                shouldUnlock = userData.level >= badge.requirement.value;
                break;
        }

        if (shouldUnlock) {
            newBadges.push(badge);
        }
    }

    return newBadges;
}

// Get rarity color classes
export function getBadgeRarityColor(rarity: Badge['rarity']): string {
    switch (rarity) {
        case 'common':
            return 'from-green-500 to-emerald-600';
        case 'rare':
            return 'from-blue-500 to-blue-600';
        case 'epic':
            return 'from-purple-500 to-purple-600';
        case 'legendary':
            return 'from-amber-500 to-amber-600';
    }
}

// XP rewards
export const XP_REWARDS = {
    TASK_COMPLETE: 10,
    DAILY_LOGIN: 5,
    STREAK_BONUS: 5, // Extra XP per streak day
    PLAN_GENERATED: 20,
};
