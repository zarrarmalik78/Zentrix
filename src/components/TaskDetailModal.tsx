"use client";

import { motion } from "framer-motion";
import { X, Clock, BookOpen, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getSubjectConfig } from "@/lib/subject-config";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface TaskSubtask {
    description: string;
    estimatedMinutes: number;
}

interface TaskDetailModalProps {
    task: {
        id: string;
        subject: string;
        topic?: string;
        description: string;
        subtasks?: TaskSubtask[];
        duration?: number;
        difficulty?: "Easy" | "Medium" | "Hard";
        method?: string;
        resources?: string[];
        status: "pending" | "completed" | "verified" | "skipped";
    };
    open: boolean;
    onClose: () => void;
    onComplete: () => void;
    onSkip: () => void;
}

const DIFFICULTY_COLORS = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
};

const STUDY_TIPS: Record<string, Record<string, string>> = {
    Mathematics: {
        Learn: "Start by understanding the concept before memorizing formulas. Draw diagrams to visualize problems.",
        Practice: "Solve problems step-by-step. Don't skip steps even if they seem obvious. Check your work.",
        Revise: "Review your formula sheet daily. Practice mental math for common calculations.",
    },
    Physics: {
        Learn: "Visualize concepts with real-world examples. Use animations and simulations when possible.",
        Practice: "Pay close attention to units. Draw free-body diagrams for mechanics problems.",
        Revise: "Create a formula sheet with units. Practice dimensional analysis to check answers.",
    },
    Chemistry: {
        Learn: "Understand the 'why' behind reactions. Draw molecular structures to visualize bonding.",
        Practice: "Balance equations systematically. Use mnemonic devices for common reactions.",
        Revise: "Review periodic trends regularly. Practice naming compounds and writing formulas.",
    },
    default: {
        Learn: "Focus on understanding concepts deeply. Take notes in your own words.",
        Practice: "Apply what you've learned through active practice. Test yourself regularly.",
        Revise: "Review your notes within 24 hours. Use spaced repetition for long-term retention.",
    },
};

export function TaskDetailModal({ task, open, onClose, onComplete, onSkip }: TaskDetailModalProps) {
    const subjectConfig = getSubjectConfig(task.subject);
    const SubjectIcon = subjectConfig.icon;
    const [completedSubtasks, setCompletedSubtasks] = useState<Set<number>>(new Set());

    const studyTip = STUDY_TIPS[task.subject]?.[task.method || "Learn"] || STUDY_TIPS.default.Learn;

    const toggleSubtask = (index: number) => {
        const newCompleted = new Set(completedSubtasks);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedSubtasks(newCompleted);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {/* Subject Icon */}
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                            subjectConfig.bgColor
                        )}>
                            <SubjectIcon className={cn("w-7 h-7", subjectConfig.color)} />
                        </div>

                        <div className="flex-1">
                            {/* Subject Badge */}
                            <span className={cn(
                                "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-2",
                                subjectConfig.bgColor,
                                subjectConfig.color,
                                subjectConfig.borderColor
                            )}>
                                {task.subject}
                            </span>

                            {/* Topic/Title */}
                            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {task.topic || task.description}
                            </DialogTitle>

                            {task.description && task.topic && (
                                <p className="text-slate-600 dark:text-slate-400 mt-2">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Meta Information */}
                    <div className="grid grid-cols-3 gap-4">
                        {task.duration && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Time</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {task.duration} min
                                </p>
                            </div>
                        )}

                        {task.difficulty && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                    Difficulty
                                </div>
                                <span className={cn(
                                    "inline-block px-2 py-1 rounded-lg text-sm font-bold border",
                                    DIFFICULTY_COLORS[task.difficulty]
                                )}>
                                    {task.difficulty}
                                </span>
                            </div>
                        )}

                        {task.method && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Method</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {task.method}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                What to Study
                            </h3>
                            <div className="space-y-2">
                                {task.subtasks.map((subtask, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                                            completedSubtasks.has(index)
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50"
                                        )}
                                        onClick={() => toggleSubtask(index)}
                                    >
                                        <Checkbox
                                            checked={completedSubtasks.has(index)}
                                            onCheckedChange={() => toggleSubtask(index)}
                                            className="mt-0.5"
                                        />
                                        <div className="flex-1">
                                            <p className={cn(
                                                "font-medium",
                                                completedSubtasks.has(index)
                                                    ? "line-through text-muted-foreground"
                                                    : "text-slate-900 dark:text-white"
                                            )}>
                                                {subtask.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                ⏱️ {subtask.estimatedMinutes} minutes
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress indicator */}
                            <div className="mt-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-bold text-primary">
                                        {completedSubtasks.size} / {task.subtasks.length} completed
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(completedSubtasks.size / task.subtasks.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    {task.resources && task.resources.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Recommended Resources
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {task.resources.map((resource, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {resource}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Study Tip */}
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            💡 Study Tip
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {studyTip}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            variant="outline"
                            onClick={onSkip}
                            className="flex-1 rounded-xl"
                        >
                            Skip This
                        </Button>
                        <Button
                            onClick={onComplete}
                            className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:to-emerald-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Complete
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
