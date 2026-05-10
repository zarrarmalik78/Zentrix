"use client";

import { motion } from "framer-motion";
import { X, Clock, BookOpen, CheckCircle, ExternalLink, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getLearningConfig } from "@/lib/learning-config";
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

const STUDY_TIPS: Record<string, string> = {
    Learn: "Focus on understanding the core principles first. Don't rush to move on until the basics feel intuitive.",
    Practice: "Apply the concepts in different contexts. Repetition is key to building muscle memory and deep understanding.",
    Revise: "Use spaced repetition and active recall. Summarize what you've learned in your own words to solidify memory.",
    Research: "Explore multiple high-quality sources. Cross-reference information to build a well-rounded perspective.",
    Project: "Break the project down into tiny, manageable steps. Focus on building a functional MVP before adding polish.",
    Theory: "Try to explain the concept to someone else (or an imaginary student). If you can't explain it simply, you don't understand it well enough.",
    Watch: "Be an active viewer. Pause, take notes, and try to predict what's coming next in the explanation.",
    default: "Stay consistent and take regular breaks. Your brain needs time to process and store new information.",
};

export function TaskDetailModal({ task, open, onClose, onComplete, onSkip }: TaskDetailModalProps) {
    const learningConfig = getLearningConfig(task.subject);
    const CategoryIcon = learningConfig.icon;
    const [completedSubtasks, setCompletedSubtasks] = useState<Set<number>>(new Set());

    const studyTip = STUDY_TIPS[task.method || "Learn"] || STUDY_TIPS.default;

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
                        {/* Category Icon */}
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                            learningConfig.bgColor
                        )}>
                            <CategoryIcon className={cn("w-7 h-7", learningConfig.color)} />
                        </div>

                        <div className="flex-1">
                            {/* Category Badge */}
                            <span className={cn(
                                "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2",
                                learningConfig.bgColor,
                                learningConfig.color,
                                learningConfig.borderColor
                            )}>
                                {task.subject}
                            </span>

                            {/* Topic/Title */}
                            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                                {task.topic || task.description}
                            </DialogTitle>

                            {task.description && task.topic && (
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
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
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {task.duration}m
                                </p>
                            </div>
                        )}

                        {task.difficulty && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                    Difficulty
                                </div>
                                <span className={cn(
                                    "inline-block px-2 py-0.5 rounded-lg text-xs font-bold border",
                                    DIFFICULTY_COLORS[task.difficulty]
                                )}>
                                    {task.difficulty}
                                </span>
                            </div>
                        )}

                        {task.method && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {task.method}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                                <CheckCircle className="w-5 h-5 text-indigo-500" />
                                Module Checklist
                            </h3>
                            <div className="space-y-2">
                                {task.subtasks.map((subtask, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                            completedSubtasks.has(index)
                                                ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900"
                                                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900"
                                        )}
                                        onClick={() => toggleSubtask(index)}
                                    >
                                        <Checkbox
                                            checked={completedSubtasks.has(index)}
                                            onCheckedChange={() => toggleSubtask(index)}
                                            className="mt-1 w-5 h-5 rounded-md"
                                        />
                                        <div className="flex-1">
                                            <p className={cn(
                                                "font-semibold transition-all",
                                                completedSubtasks.has(index)
                                                    ? "line-through text-slate-400"
                                                    : "text-slate-900 dark:text-white"
                                            )}>
                                                {subtask.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[10px] font-medium">{subtask.estimatedMinutes} mins</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress indicator */}
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">Completion</span>
                                    <span className="font-black text-indigo-600">
                                        {Math.round((completedSubtasks.size / task.subtasks.length) * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
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
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                                <BookOpen className="w-5 h-5 text-indigo-500" />
                                Learning Resources
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {task.resources.map((resource, index) => {
                                    const isUrl = resource.startsWith('http') || resource.startsWith('www');
                                    const href = isUrl 
                                        ? (resource.startsWith('http') ? resource : `https://${resource}`)
                                        : `https://www.google.com/search?q=${encodeURIComponent(resource)}`;

                                    return (
                                        <motion.a
                                            key={index}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40 cursor-pointer no-underline"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            {resource}
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Study Tip */}
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                        <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Expert Advice
                        </h3>
                        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                            {studyTip}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="outline"
                            onClick={onSkip}
                            className="flex-1 h-12 rounded-2xl font-bold border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                        >
                            Skip Task
                        </Button>
                        <Button
                            onClick={onComplete}
                            className="flex-1 h-12 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Module
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
