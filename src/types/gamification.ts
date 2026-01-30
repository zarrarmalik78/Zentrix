// Gamification Type Definitions

export interface GamificationData {
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string; // ISO date string
    totalTasksCompleted: number;
    badges: string[]; // Array of badge IDs
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name
    color: string; // Tailwind color class
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    requirement: {
        type: 'streak' | 'tasks' | 'xp' | 'level';
        value: number;
    };
}

export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatarUrl?: string;
    xp: number;
    level: number;
    weeklyXp: number;
    monthlyXp: number;
    rank: number;
    updatedAt: Date;
}

export interface GamificationUpdate {
    xpGained: number;
    levelUp: boolean;
    newLevel?: number;
    newBadges: Badge[];
    streakUpdated: boolean;
    newStreak?: number;
}
