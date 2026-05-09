import { LucideIcon, BookOpen, Code, Lightbulb, PenTool, CheckCircle2, Search, Video, GraduationCap } from "lucide-react";

export interface LearningConfig {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const CATEGORY_CONFIG: Record<string, LearningConfig> = {
    Learn: {
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
    },
    Practice: {
        icon: PenTool,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
    },
    Revise: {
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
    },
    Research: {
        icon: Search,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
    },
    Project: {
        icon: Code,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
    },
    Theory: {
        icon: Lightbulb,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
    },
    Watch: {
        icon: Video,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
    },
    // Default fallback
    default: {
        icon: GraduationCap,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
};

export function getLearningConfig(category: string): LearningConfig {
    // Try to match category directly or check if any key is contained in the category
    const foundKey = Object.keys(CATEGORY_CONFIG).find(
        (key) => category.toLowerCase().includes(key.toLowerCase())
    );
    
    return foundKey ? CATEGORY_CONFIG[foundKey] : CATEGORY_CONFIG.default;
}
