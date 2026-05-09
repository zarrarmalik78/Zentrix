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
import { StatusCard } from "@/components/gamification/StatusCard";
import { BADGES, getBadgeRarityColor } from "@/lib/gamification-utils";
import { 
    Sparkles, 
    ArrowRight, 
    LayoutDashboard, 
    Calendar as CalendarIcon,
    TrendingUp,
    Quote,
    Trophy,
    ChevronLeft,
    ChevronRight,
    Lock,
    Brain
} from "lucide-react";
import { addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";

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

    const nextDay = () => setSelectedDate(prev => addDays(prev, 1));
    const prevDay = () => setSelectedDate(prev => subDays(prev, 1));

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
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 pb-20">
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
                
                {/* Premium Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Student Dashboard
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                                {userProfile.email.split("@")[0]}
                            </span>!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-2 text-lg">
                            Ready to crush your learning goals today? 🚀
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Mastery</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{progressPercent}%</p>
                        </div>
                    </motion.div>
                </div>

                {/* Status Dashboard */}
                <StatusCard />

                {/* Daily Inspiration / AI Tip */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Quote className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 flex-shrink-0">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">AI Learning Insight</h3>
                            <p className="text-indigo-50/90 font-medium leading-relaxed italic">
                                &quot;The best way to learn is to build. Don't just consume information—create something with it today.&quot;
                            </p>
                        </div>
                        <Button className="ml-auto rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-6 h-12 shadow-lg shadow-black/10">
                            Get New Tip
                        </Button>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Tasks & Calendar */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:shadow-indigo-500/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-indigo-500" />
                                    Your Schedule
                                </h3>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                                    <Button variant="ghost" size="icon" onClick={prevDay} className="w-6 h-6 rounded-full hover:bg-indigo-50">
                                        <ChevronLeft className="w-4 h-4 text-indigo-500" />
                                    </Button>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 min-w-[120px] text-center">
                                        {format(selectedDate, "MMMM yyyy")}
                                    </span>
                                    <Button variant="ghost" size="icon" onClick={nextDay} className="w-6 h-6 rounded-full hover:bg-indigo-50">
                                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                                    </Button>
                                </div>
                            </div>
                            <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                        </div>

                        {/* Tasks Area */}
                        {tasks.length === 0 ? (
                            <DashboardEmptyState onGeneratePlan={() => router.push("/onboarding")} />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                            Modules for {format(selectedDate, "MMMM do")}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                                            <Button variant="ghost" size="icon" onClick={prevDay} className="w-8 h-8 rounded-lg">
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={nextDay} className="w-8 h-8 rounded-lg">
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                                        {filteredTasks.length} Pending
                                    </span>
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {filteredTasks.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-center shadow-inner shadow-slate-50"
                                        >
                                            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                                                <Sparkles className="w-12 h-12 text-indigo-500" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Daily Mission Complete!</h3>
                                            <p className="text-slate-500 max-w-xs mt-2 font-medium">
                                                You've cleared all modules for today. Great job, Explorer!
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredTasks.map((task) => (
                                                <motion.div 
                                                    key={task.id} 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }}
                                                    className="cursor-pointer group"
                                                >
                                                    <div className="relative">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition duration-500" />
                                                        <TaskCard
                                                            task={task}
                                                            onComplete={() => handleStatusUpdate(task.id, "completed")}
                                                            onSkip={() => { setSelectedTask(task); setIsSkipOpen(true); }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right: Insights & Achievements */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Achievements Card */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                Mastery Badges
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {BADGES.map((badge) => {
                                    const isUnlocked = userProfile.gamification.badges.includes(badge.id);
                                    return (
                                        <div key={badge.id} className="group relative">
                                            <div className={cn(
                                                "w-full aspect-square rounded-xl flex items-center justify-center border transition-all relative overflow-hidden",
                                                getBadgeRarityColor(badge.rarity),
                                                "border-transparent shadow-sm",
                                                !isUnlocked && "opacity-80 saturate-[0.8]"
                                            )}>
                                                <span className="text-xl transition-transform group-hover:scale-125 z-10">
                                                    {badge.icon === 'CheckCircle' && '✅'}
                                                    {badge.icon === 'Target' && '🎯'}
                                                    {badge.icon === 'Zap' && '⚡'}
                                                    {badge.icon === 'Flame' && '🔥'}
                                                    {badge.icon === 'Crown' && '👑'}
                                                    {badge.icon === 'BookOpen' && '📖'}
                                                    {badge.icon === 'GraduationCap' && '🎓'}
                                                    {badge.icon === 'Award' && '🏅'}
                                                    {badge.icon === 'Trophy' && '🏆'}
                                                </span>
                                                {!isUnlocked && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[0.5px] z-20">
                                                        <Lock className="w-3 h-3 text-white/90" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] p-2 rounded-lg whitespace-nowrap z-50 shadow-2xl pointer-events-none border border-white/10">
                                                <p className="font-black">{badge.name}</p>
                                                <p className="text-[8px] opacity-70">{badge.description}</p>
                                                {!isUnlocked && <p className="text-[8px] text-amber-400 mt-1 font-bold">LOCKED</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Button variant="link" className="w-full mt-6 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:no-underline hover:text-indigo-700 h-auto p-0">
                                View Full Collection <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>

                        {/* AI Mastery Forecast */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-slate-900 text-white p-8 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                <Brain className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                AI Forecast
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Est. Mastery Date</p>
                                    <p className="text-2xl font-black">{format(addDays(new Date(), 45), "MMM dd, yyyy")}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                                    <p className="text-[10px] font-medium text-indigo-100 leading-relaxed">
                                        Based on your current velocity of <span className="text-amber-400 font-bold">12 tasks/week</span>, you'll reach Level 20 in approximately 6 weeks.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Activity Graph Preview */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-blue-500" />
                                Weekly Pulse
                            </h3>
                            <div className="h-32 flex items-end justify-between gap-1.5">
                                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.8 }}
                                        className="w-full bg-indigo-500/10 rounded-t-xl relative group overflow-hidden"
                                    >
                                        <div className="absolute bottom-0 left-0 w-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors h-full translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <div className="absolute bottom-0 left-0 w-full bg-indigo-500/20 h-full" />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Mon</span>
                                <span>Sun</span>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/30 dark:shadow-none">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Recent Activity</h3>
                            <div className="space-y-4">
                                {[
                                    { text: "Completed 'Advanced Italian'", time: "2h ago", color: "bg-green-500" },
                                    { text: "Earned 'On Fire' Badge", time: "5h ago", color: "bg-orange-500" },
                                    { text: "Daily Streak Extended!", time: "Yesterday", color: "bg-blue-500" },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 rounded-full", activity.color)} />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{activity.text}</p>
                                            <p className="text-[10px] text-slate-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
