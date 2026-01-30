"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calculator,
    Zap,
    Beaker,
    Leaf,
    BookOpen,
    Code,
    ScrollText,
    Globe,
    TrendingUp,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Check,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

interface OnboardingData {
    class: string;
    subjects: string[];
    customSubjects: string;
    examDate: Date;
    syllabusProgress: Record<string, number>;
    weekdayHours: number;
    weekendHours: number;
    preferredTime: string;
    goals: string;
    weakTopics: Record<string, string>;
}

const SUBJECT_OPTIONS = [
    { id: "Mathematics", label: "Mathematics", icon: Calculator, color: "blue" },
    { id: "Physics", label: "Physics", icon: Zap, color: "purple" },
    { id: "Chemistry", label: "Chemistry", icon: Beaker, color: "green" },
    { id: "Biology", label: "Biology", icon: Leaf, color: "orange" },
    { id: "English", label: "English", icon: BookOpen, color: "red" },
    { id: "Computer Science", label: "Computer Science", icon: Code, color: "indigo" },
    { id: "History", label: "History", icon: ScrollText, color: "amber" },
    { id: "Geography", label: "Geography", icon: Globe, color: "teal" },
    { id: "Economics", label: "Economics", icon: TrendingUp, color: "emerald" },
];

export default function OnboardingPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const [data, setData] = useState<OnboardingData>({
        class: "",
        subjects: [],
        customSubjects: "",
        examDate: addDays(new Date(), 60),
        syllabusProgress: {},
        weekdayHours: 3,
        weekendHours: 5,
        preferredTime: "evening",
        goals: "",
        weakTopics: {},
    });

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    const totalSteps = 7;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return data.class !== "";
            case 2:
                return data.subjects.length > 0;
            case 3:
                return true; // Exam date has default
            case 4:
                return true; // Study hours have defaults
            case 5:
                return true; // Goals are optional
            default:
                return true;
        }
    };

    const handleGeneratePlan = async () => {
        if (!user) return;

        setIsGenerating(true);
        setStep(6); // Show generating screen

        try {
            // Get Firebase auth token
            const token = await user.getIdToken();

            // Save profile data to Firestore
            const { doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await updateDoc(doc(db, "users", user.uid), {
                onboardingCompleted: true,
                profile: {
                    class: data.class,
                    subjects: data.subjects,
                    customSubjects: data.customSubjects,
                    examDate: data.examDate.toISOString(),
                    syllabusProgress: data.syllabusProgress,
                    weekdayHours: data.weekdayHours,
                    weekendHours: data.weekendHours,
                    preferredTime: data.preferredTime,
                    goals: data.goals,
                    weakTopics: data.weakTopics,
                },
                updatedAt: new Date(),
            });

            // Generate study plan
            const response = await fetch("/api/generate-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    class: data.class,
                    subjects: data.subjects,
                    customSubjects: data.customSubjects,
                    examDate: data.examDate.toISOString(),
                    syllabusProgress: data.syllabusProgress,
                    weekdayHours: data.weekdayHours,
                    weekendHours: data.weekendHours,
                    preferredTime: data.preferredTime,
                    goals: data.goals,
                    weakTopics: data.weakTopics,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate plan");
            }

            const result = await response.json();
            console.log("Plan generated:", result);

            // Wait a bit to show the animation
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setStep(7); // Show success screen
        } catch (error) {
            console.error("Error generating plan:", error);
            alert("Failed to generate study plan. Please try again.");
            setStep(5); // Go back to last input step
        } finally {
            setIsGenerating(false);
        }
    };

    const handleComplete = () => {
        router.push("/dashboard");
    };

    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                {step < 6 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">
                                Step {step} of {totalSteps - 2}
                            </span>
                            <span className="text-sm font-medium text-primary">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                    >
                        {/* Step 1: Class Selection */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        What class are you in?
                                    </h2>
                                    <p className="text-slate-500">Help us personalize your study plan</p>
                                </div>

                                <RadioGroup value={data.class} onValueChange={(value) => setData({ ...data, class: value })}>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["10", "11", "12", "College"].map((classValue) => (
                                            <Label
                                                key={classValue}
                                                htmlFor={`class-${classValue}`}
                                                className={cn(
                                                    "flex items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all",
                                                    data.class === classValue
                                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                        : "border-slate-200 hover:border-primary/50"
                                                )}
                                            >
                                                <RadioGroupItem value={classValue} id={`class-${classValue}`} className="sr-only" />
                                                <span className="text-2xl font-bold">
                                                    {classValue === "College" ? "🎓" : `Class ${classValue}`}
                                                </span>
                                            </Label>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {/* Step 2: Subject Selection */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        Which subjects are you studying?
                                    </h2>
                                    <p className="text-slate-500">Select all that apply</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {SUBJECT_OPTIONS.map((subject) => {
                                        const Icon = subject.icon;
                                        const isSelected = data.subjects.includes(subject.id);

                                        return (
                                            <button
                                                key={subject.id}
                                                onClick={() => {
                                                    setData({
                                                        ...data,
                                                        subjects: isSelected
                                                            ? data.subjects.filter((s) => s !== subject.id)
                                                            : [...data.subjects, subject.id],
                                                    });
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                                    isSelected
                                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                        : "border-slate-200 hover:border-primary/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                                    `bg-${subject.color}-100`
                                                )}>
                                                    <Icon className={cn("w-6 h-6", `text-${subject.color}-600`)} />
                                                </div>
                                                <span className="text-sm font-semibold text-center">
                                                    {subject.label}
                                                </span>
                                                {isSelected && (
                                                    <Check className="w-5 h-5 text-primary" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2">
                                    <Label>Add Custom Subjects (Optional)</Label>
                                    <Input
                                        placeholder="e.g., Art, Music, Physical Education"
                                        value={data.customSubjects}
                                        onChange={(e) => setData({ ...data, customSubjects: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Exam Date & Syllabus Progress */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        When is your main exam?
                                    </h2>
                                    <p className="text-slate-500">We'll create a timeline to help you prepare</p>
                                </div>

                                <div className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={data.examDate}
                                        onSelect={(date) => date && setData({ ...data, examDate: date })}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-2xl border shadow-sm"
                                    />
                                </div>

                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-sm text-blue-700">
                                        <strong>Selected Date:</strong> {format(data.examDate, "MMMM dd, yyyy")}
                                        <br />
                                        <strong>Days Until Exam:</strong>{" "}
                                        {Math.ceil((data.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-900">How much syllabus is completed?</h3>
                                    {data.subjects.map((subject) => (
                                        <div key={subject} className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label>{subject}</Label>
                                                <span className="text-sm font-medium text-primary">
                                                    {data.syllabusProgress[subject] || 0}%
                                                </span>
                                            </div>
                                            <Slider
                                                value={[data.syllabusProgress[subject] || 0]}
                                                onValueChange={([value]) =>
                                                    setData({
                                                        ...data,
                                                        syllabusProgress: { ...data.syllabusProgress, [subject]: value },
                                                    })
                                                }
                                                max={100}
                                                step={10}
                                                className="py-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Study Availability */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        How many hours can you study daily?
                                    </h2>
                                    <p className="text-slate-500">Be realistic and honest</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label>Weekdays</Label>
                                        <Select
                                            value={data.weekdayHours.toString()}
                                            onValueChange={(value) => setData({ ...data, weekdayHours: parseInt(value) })}
                                        >
                                            <SelectTrigger className="rounded-xl h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                                                    <SelectItem key={hours} value={hours.toString()}>
                                                        {hours} {hours === 1 ? "hour" : "hours"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Weekends</Label>
                                        <Select
                                            value={data.weekendHours.toString()}
                                            onValueChange={(value) => setData({ ...data, weekendHours: parseInt(value) })}
                                        >
                                            <SelectTrigger className="rounded-xl h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hours) => (
                                                    <SelectItem key={hours} value={hours.toString()}>
                                                        {hours} {hours === 1 ? "hour" : "hours"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Preferred study time</Label>
                                    <RadioGroup
                                        value={data.preferredTime}
                                        onValueChange={(value) => setData({ ...data, preferredTime: value })}
                                    >
                                        <div className="grid gap-3">
                                            {[
                                                { value: "morning", label: "🌅 Morning (6am-12pm)", desc: "Fresh mind, better retention" },
                                                { value: "afternoon", label: "☀️ Afternoon (12pm-6pm)", desc: "Good energy levels" },
                                                { value: "evening", label: "🌙 Evening (6pm-12am)", desc: "Quiet and peaceful" },
                                            ].map((time) => (
                                                <Label
                                                    key={time.value}
                                                    htmlFor={time.value}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                        data.preferredTime === time.value
                                                            ? "border-primary bg-primary/5"
                                                            : "border-slate-200 hover:border-primary/50"
                                                    )}
                                                >
                                                    <RadioGroupItem value={time.value} id={time.value} />
                                                    <div>
                                                        <p className="font-semibold">{time.label}</p>
                                                        <p className="text-xs text-muted-foreground">{time.desc}</p>
                                                    </div>
                                                </Label>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Goals & Weak Topics */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        What are your goals?
                                    </h2>
                                    <p className="text-slate-500">Help us understand what you want to achieve</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Your Goals (Optional)</Label>
                                    <Textarea
                                        placeholder="e.g., Score 90%+ in all subjects, prepare for JEE, improve grades"
                                        value={data.goals}
                                        onChange={(e) => setData({ ...data, goals: e.target.value })}
                                        rows={4}
                                        className="rounded-xl resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-900">Any topics you find difficult?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We'll give these topics extra attention in your study plan
                                    </p>
                                    {data.subjects.slice(0, 3).map((subject) => (
                                        <div key={subject} className="space-y-2">
                                            <Label>{subject}</Label>
                                            <Input
                                                placeholder="e.g., Calculus, Quadratic Equations"
                                                value={data.weakTopics[subject] || ""}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        weakTopics: { ...data.weakTopics, [subject]: e.target.value },
                                                    })
                                                }
                                                className="rounded-xl"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 6: Generating Plan */}
                        {step === 6 && (
                            <div className="text-center space-y-6 py-8">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                                >
                                    <Sparkles className="w-12 h-12 text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    🤖 AI is creating your plan...
                                </h2>
                                <p className="text-slate-500">This will take a few moments</p>

                                <div className="space-y-3 max-w-sm mx-auto">
                                    {[
                                        "Analyzing exam timeline",
                                        "Breaking down subjects",
                                        "Scheduling daily tasks",
                                        "Optimizing study hours",
                                        "Finalizing your plan",
                                    ].map((text, index) => (
                                        <motion.div
                                            key={text}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.5 }}
                                            className="flex items-center gap-3 text-left"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-slate-700">{text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm font-medium">Please wait...</span>
                                </div>
                            </div>
                        )}

                        {/* Step 7: Success */}
                        {step === 7 && (
                            <div className="text-center space-y-6 py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.5 }}
                                    className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-12 h-12 text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    🎉 Your plan is ready!
                                </h2>
                                <p className="text-slate-500">Let's start your journey to success</p>

                                <div className="grid gap-4 max-w-md mx-auto text-left">
                                    <div className="p-4 bg-indigo-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">
                                                    {Math.ceil((data.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}-day study schedule
                                                </p>
                                                <p className="text-sm text-muted-foreground">Tailored to your exam date</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{data.subjects.length} subjects covered</p>
                                                <p className="text-sm text-muted-foreground">With personalized tasks</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Daily goals set</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {data.weekdayHours}h weekdays, {data.weekendHours}h weekends
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleComplete}
                                    size="lg"
                                    className="rounded-xl px-8 py-6 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700"
                                >
                                    View My Dashboard
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 6 && (
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="rounded-xl"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                {step === 5 ? (
                                    <Button
                                        onClick={handleGeneratePlan}
                                        disabled={!canProceed()}
                                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate My Plan
                                    </Button>
                                ) : (
                                    <Button onClick={nextStep} disabled={!canProceed()} className="rounded-xl">
                                        Continue
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
