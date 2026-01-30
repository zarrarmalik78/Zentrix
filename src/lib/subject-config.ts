import { LucideIcon } from "lucide-react";

export interface SubjectConfig {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const SUBJECT_ICONS: Record<string, SubjectConfig> = {
    Mathematics: {
        icon: require("lucide-react").Calculator,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
    },
    Physics: {
        icon: require("lucide-react").Zap,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
    },
    Chemistry: {
        icon: require("lucide-react").Beaker,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
    },
    Biology: {
        icon: require("lucide-react").Leaf,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
    },
    English: {
        icon: require("lucide-react").BookOpen,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
    },
    "Computer Science": {
        icon: require("lucide-react").Code,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
    },
    History: {
        icon: require("lucide-react").ScrollText,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
    },
    Geography: {
        icon: require("lucide-react").Globe,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-200",
    },
    Economics: {
        icon: require("lucide-react").TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
    },
    // Default fallback
    default: {
        icon: require("lucide-react").BookMarked,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
    },
};

export function getSubjectConfig(subject: string): SubjectConfig {
    return SUBJECT_ICONS[subject] || SUBJECT_ICONS.default;
}
