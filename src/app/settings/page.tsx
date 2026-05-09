"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    User,
    Mail,
    LogOut,
    Trash2,
    RefreshCw,
    AlertTriangle,
    Calendar,
    BookOpen,
    Clock,
    Target,
    Loader2,
} from "lucide-react";
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SettingsPage() {
    const { user, userProfile, signOut } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else {
            setDisplayName(user.displayName || userProfile?.displayName || user.email?.split("@")[0] || "");
        }
    }, [user, userProfile, router]);

    const handleSaveProfile = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                displayName: displayName.trim(),
                updatedAt: new Date(),
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetTasks = async () => {
        if (!user) return;

        setIsResetting(true);
        try {
            const tasksQuery = query(
                collection(db, "tasks"),
                where("userId", "==", user.uid)
            );
            const tasksSnapshot = await getDocs(tasksQuery);

            const batch = writeBatch(db);
            tasksSnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            toast.success(`Deleted ${tasksSnapshot.size} tasks`);
        } catch (error) {
            console.error("Error resetting tasks:", error);
            toast.error("Failed to reset tasks");
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetGamification = async () => {
        if (!user) return;

        setIsResetting(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                gamification: {
                    xp: 0,
                    level: 1,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastTaskDate: null,
                    badges: [],
                    tasksCompleted: 0,
                },
                updatedAt: new Date(),
            });

            toast.success("Gamification progress reset!");
        } catch (error) {
            console.error("Error resetting gamification:", error);
            toast.error("Failed to reset gamification");
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetAllData = async () => {
        if (!user) return;

        setIsResetting(true);
        try {
            // Delete all tasks
            const tasksQuery = query(
                collection(db, "tasks"),
                where("userId", "==", user.uid)
            );
            const tasksSnapshot = await getDocs(tasksQuery);

            const batch = writeBatch(db);
            tasksSnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            // Reset user profile
            await updateDoc(doc(db, "users", user.uid), {
                onboardingCompleted: false,
                profile: {},
                gamification: {
                    xp: 0,
                    level: 1,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastTaskDate: null,
                    badges: [],
                    tasksCompleted: 0,
                },
                updatedAt: new Date(),
            });

            toast.success("All data reset successfully!");
            setTimeout(() => router.push("/onboarding"), 1500);
        } catch (error) {
            console.error("Error resetting all data:", error);
            toast.error("Failed to reset data");
        } finally {
            setIsResetting(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/login");
            toast.success("Signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to sign out");
        }
    };

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your account and preferences
                    </p>
                </motion.div>

                {/* Profile Settings */}
                <Card className="rounded-3xl border-slate-200 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Profile Settings
                        </CardTitle>
                        <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Display Name</Label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {user.email}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="rounded-xl"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>

                {/* Onboarding Info */}
                {userProfile?.profile && (
                    <Card className="rounded-3xl border-slate-200 dark:border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Learning Profile
                            </CardTitle>
                            <CardDescription>Your current curriculum configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {userProfile.profile.courseName && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Course</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {userProfile.profile.courseName}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {userProfile.profile.level && (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Level</p>
                                        <p className="font-semibold text-slate-900 dark:text-white capitalize">
                                            {userProfile.profile.level}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {userProfile.profile.targetDate && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Target Date</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {format(new Date(userProfile.profile.targetDate), "MMMM dd, yyyy")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {userProfile?.profile?.weekdayHours && (
                                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Study Hours</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {userProfile.profile.weekdayHours}h weekdays, {userProfile.profile.weekendHours}h weekends
                                        </p>
                                    </div>
                                </div>
                            )}

                            {userProfile?.profile?.goals && (
                                <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Goals</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            {userProfile.profile.goals}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => router.push("/onboarding")}
                                className="w-full rounded-xl mt-4"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Update Learning Plan
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Danger Zone */}
                <Card className="rounded-3xl border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>Irreversible actions - proceed with caution</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Reset All Tasks
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete all tasks?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete all your study tasks. Your profile and gamification progress will remain intact.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleResetTasks}
                                        className="rounded-xl bg-red-600 hover:bg-red-700"
                                    >
                                        {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Tasks"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reset Gamification Progress
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reset gamification?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will reset your XP, level, streaks, and badges to zero. Your tasks will remain intact.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleResetGamification}
                                        className="rounded-xl bg-red-600 hover:bg-red-700"
                                    >
                                        {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Progress"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Reset All Data
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>⚠️ Reset everything?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete all your study tasks, gamification progress (XP, badges, streaks), and study plan configuration.
                                    </AlertDialogDescription>
                                    <div className="text-sm font-semibold text-red-600 dark:text-red-400 mt-2">
                                        ⚠️ This action cannot be undone!
                                    </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleResetAllData}
                                        className="rounded-xl bg-red-600 hover:bg-red-700"
                                    >
                                        {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Everything"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>

                {/* Sign Out */}
                <Card className="rounded-3xl border-slate-200 dark:border-slate-700">
                    <CardContent className="pt-6">
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="w-full rounded-xl"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
