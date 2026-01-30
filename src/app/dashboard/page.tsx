"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    doc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
import { format, isSameDay } from "date-fns";
import {
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useGamification } from "@/hooks/use-gamification";
import { Celebration } from "@/components/gamification/celebration";
import { Badge } from "@/types/gamification";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { CalendarStrip } from "@/components/CalendarStrip";
import { TaskCard } from "@/components/TaskCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { XPProgress } from "@/components/gamification/xp-progress";
import { DashboardEmptyState } from "@/components/DashboardEmptyState";
import { TaskDetailModal } from "@/components/TaskDetailModal";

interface Task {
    id: string;
    subject: string;
    description: string;
    date: Timestamp;
    status: "pending" | "completed" | "verified" | "skipped";
    evidence?: string;
}

export default function Dashboard() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Interactions
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSkipOpen, setIsSkipOpen] = useState(false);
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    const [skipReason, setSkipReason] = useState("");
    const [evidenceLink, setEvidenceLink] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Gamification
    const { awardTaskCompletion, isUpdating } = useGamification();
    const [celebration, setCelebration] = useState<{ type: "levelUp" | "badge"; level?: number; badge?: Badge } | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[]);
        });
        return () => unsubscribe();
    }, [user]);

    // Derived State
    const filteredTasks = tasks.filter(task => isSameDay(task.date.toDate(), selectedDate));
    const completedCount = tasks.filter(t => ["completed", "verified"].includes(t.status)).length;
    const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

    const handleStatusUpdate = async (taskId: string, status: Task["status"], data?: any) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, "tasks", taskId), { status, ...data });

            // Award XP if task completed
            if (status === "completed") {
                const result = await awardTaskCompletion();
                if (result) {
                    // Show XP toast
                    toast.success(`+${result.xpGained} XP earned! 🎉`);

                    // Show level up celebration
                    if (result.levelUp && result.newLevel) {
                        setCelebration({ type: "levelUp", level: result.newLevel });
                    }

                    // Show badge unlock celebrations (one at a time)
                    if (result.newBadges && result.newBadges.length > 0) {
                        // Show first badge immediately or after level up
                        setTimeout(() => {
                            setCelebration({ type: "badge", badge: result.newBadges[0] });
                        }, result.levelUp ? 4500 : 0);
                    }

                    // Show streak update
                    if (result.streakUpdated && result.newStreak) {
                        toast(`🔥 ${result.newStreak} day streak!`);
                    }
                }
            }

            setIsSkipOpen(false);
            setIsEvidenceOpen(false);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || !userProfile) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col p-4 md:p-8 max-w-5xl mx-auto space-y-6 overflow-hidden">

            {/* Header with Stats */}
            <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Hello, {userProfile.email.split("@")[0]} 👋
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                        You've completed <span className="text-primary font-bold">{completedCount} tasks</span> this semester.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{progressPercent}%</span>
                    </div>
                </div>
            </div>

            {/* XP Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <XPProgress />
            </div>

            {/* Calendar Strip */}
            <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Tasks Area */}
            {tasks.length === 0 ? (
                <DashboardEmptyState onGeneratePlan={() => router.push("/onboarding")} />
            ) : (
                <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-20">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 py-2">
                        Tasks for {format(selectedDate, "MMMM do")}
                    </h3>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg shadow-indigo-50 mb-4">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No tasks for this date!</h3>
                                    <p className="text-slate-500 max-w-xs mt-2">
                                        Select another date from the calendar to view your tasks.
                                    </p>
                                </motion.div>
                            ) : (
                                filteredTasks.map((task) => (
                                    <div key={task.id} onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }}>
                                        <TaskCard
                                            task={task}
                                            onComplete={() => handleStatusUpdate(task.id, "completed")}
                                            onSkip={() => { setSelectedTask(task); setIsSkipOpen(true); }}
                                        />
                                    </div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <FloatingActionButton onClick={() => router.push("/onboarding")} />

            {/* Dialogs */}
            <Dialog open={isSkipOpen} onOpenChange={setIsSkipOpen}>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Skip Task</DialogTitle>
                        <DialogDescription>Reason for skipping?</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <Label>Reason</Label>
                        <Input value={skipReason} onChange={(e) => setSkipReason(e.target.value)} className="rounded-xl" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSkipOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={() => handleStatusUpdate(selectedTask!.id, "skipped", { skipReason })}
                            disabled={actionLoading}
                            className="rounded-xl"
                        >
                            Skip Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    open={isTaskDetailOpen}
                    onClose={() => setIsTaskDetailOpen(false)}
                    onComplete={() => {
                        handleStatusUpdate(selectedTask.id, "completed");
                        setIsTaskDetailOpen(false);
                    }}
                    onSkip={() => {
                        setIsTaskDetailOpen(false);
                        setIsSkipOpen(true);
                    }}
                />
            )}

            {/* Celebration Modals */}
            {celebration && (
                <Celebration
                    type={celebration.type}
                    level={celebration.level}
                    badge={celebration.badge}
                    onComplete={() => setCelebration(null)}
                />
            )}
        </div>
    );
}
