"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Check, MoreVertical, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
    id: string;
    subject: string;
    description: string;
    status: "pending" | "completed" | "verified" | "skipped";
}

interface TaskCardProps {
    task: Task;
    onComplete: () => void;
    onSkip: () => void;
}

const subjectColors: Record<string, string> = {
    Math: "bg-red-50 text-red-700 border-red-100",
    Physics: "bg-blue-50 text-blue-700 border-blue-100",
    Chemistry: "bg-purple-50 text-purple-700 border-purple-100",
    Biology: "bg-green-50 text-green-700 border-green-100",
    History: "bg-amber-50 text-amber-700 border-amber-100",
    English: "bg-pink-50 text-pink-700 border-pink-100",
    default: "bg-slate-50 text-slate-700 border-slate-100",
};

export function TaskCard({ task, onComplete, onSkip }: TaskCardProps) {
    const isCompleted = ["completed", "verified"].includes(task.status);

    // Determine color based on subject (simple substring match or fallback)
    const colorKey = Object.keys(subjectColors).find(key => task.subject.includes(key)) || "default";
    const colorClass = subjectColors[colorKey];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative p-5 rounded-3xl border transition-all duration-300 group",
                isCompleted
                    ? "bg-slate-50/50 grayscale opacity-60 border-slate-100"
                    : "bg-white border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-100"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider", colorClass)}>
                        {task.subject}
                    </span>
                    <h3 className={cn(
                        "text-lg font-bold leading-tight transition-colors",
                        isCompleted ? "text-muted-foreground line-through decoration-2" : "text-slate-800"
                    )}>
                        {task.description}
                    </h3>
                </div>

                {/* Action Button */}
                <button
                    onClick={onComplete}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                        isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-slate-100 text-slate-400 hover:bg-green-500 hover:text-white hover:scale-110"
                    )}
                >
                    {isCompleted ? <Check className="w-5 h-5" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                </button>
            </div>

            <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:bg-slate-100 rounded-full">
                            <MoreVertical className="w-3 h-3 mr-1" />
                            Options
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl border-slate-100 shadow-lg shadow-indigo-500/10">
                        <DropdownMenuItem onClick={onSkip} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                            <SkipForward className="w-4 h-4 mr-2" /> Skip This
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>30m</span>
                </div>
            </div>
        </motion.div>
    );
}
