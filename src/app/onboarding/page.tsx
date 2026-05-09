"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    BookOpen,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Check,
    Loader2,
    Target,
    Brain,
    Trophy,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

interface OnboardingData {
    courseName: string;
    level: "beginner" | "intermediate" | "advanced";
    background: string;
    targetDate: Date;
    weekdayHours: number;
    weekendHours: number;
    preferredTime: string;
    goals: string;
}

export default function OnboardingPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const [data, setData] = useState<OnboardingData>({
        courseName: "",
        level: "beginner",
        background: "",
        targetDate: addDays(new Date(), 30),
        weekdayHours: 2,
        weekendHours: 4,
        preferredTime: "evening",
        goals: "",
    });

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    const totalSteps = 6;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return data.courseName.trim().length > 2;
            case 2:
                return data.background.trim().length > 5;
            case 3:
                return true; // Target date has default
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
                    courseName: data.courseName,
                    level: data.level,
                    background: data.background,
                    targetDate: data.targetDate.toISOString(),
                    weekdayHours: data.weekdayHours,
                    weekendHours: data.weekendHours,
                    preferredTime: data.preferredTime,
                    goals: data.goals,
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
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate plan");
            }

            // Wait a bit to show the animation
            await new Promise((resolve) => setTimeout(resolve, 3000));

            setStep(7); // Show success screen
        } catch (error) {
            console.error("Error generating plan:", error);
            alert("Failed to generate learning plan. Please try again.");
            setStep(5); // Go back to last input step
        } finally {
            setIsGenerating(false);
        }
    };

    const handleComplete = () => {
        router.push("/dashboard");
    };

    const progress = (step / (totalSteps - 1)) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                {step < 6 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">
                                Step {step} of {totalSteps - 1}
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
                        {/* Step 1: Course Name */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        What do you want to master?
                                    </h2>
                                    <p className="text-slate-500">Enter the name of the course or skill you want to learn</p>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-semibold">Course or Skill Name</Label>
                                    <Input
                                        placeholder="e.g. Machine Learning, Piano for Beginners, Italian Language..."
                                        value={data.courseName}
                                        onChange={(e) => setData({ ...data, courseName: e.target.value })}
                                        className="h-14 text-lg rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                    />
                                    <p className="text-sm text-slate-400">Our AI will design a complete curriculum for you.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Background & Level */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Brain className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        What's your current level?
                                    </h2>
                                    <p className="text-slate-500">Tell us what you already know about {data.courseName}</p>
                                </div>

                                <RadioGroup 
                                    value={data.level} 
                                    onValueChange={(value: any) => setData({ ...data, level: value })}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {[
                                        { id: "beginner", label: "Beginner", desc: "Starting from zero" },
                                        { id: "intermediate", label: "Intermediate", desc: "I know the basics" },
                                        { id: "advanced", label: "Advanced", desc: "Looking for mastery" }
                                    ].map((level) => (
                                        <Label
                                            key={level.id}
                                            htmlFor={level.id}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all text-center",
                                                data.level === level.id
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                    : "border-slate-200 hover:border-primary/50"
                                            )}
                                        >
                                            <RadioGroupItem value={level.id} id={level.id} className="sr-only" />
                                            <span className="font-bold">{level.label}</span>
                                            <span className="text-[10px] text-slate-400 mt-1">{level.desc}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>

                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Your Experience (Optional)</Label>
                                    <Textarea
                                        placeholder="e.g. I have a background in math, I've watched some YouTube tutorials..."
                                        value={data.background}
                                        onChange={(e) => setData({ ...data, background: e.target.value })}
                                        className="rounded-2xl resize-none border-slate-200"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Target Date */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        When do you want to finish?
                                    </h2>
                                    <p className="text-slate-500">We'll create a timeline to help you reach your goal</p>
                                </div>

                                <div className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={data.targetDate}
                                        onSelect={(date) => date && setData({ ...data, targetDate: date })}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-2xl border shadow-sm"
                                    />
                                </div>

                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Sparkles className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">
                                            Target: {format(data.targetDate, "MMMM dd, yyyy")}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            {Math.ceil((data.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to master {data.courseName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Study Availability */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        How much time can you give?
                                    </h2>
                                    <p className="text-slate-500">Be realistic about your daily study hours</p>
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
                                                { value: "morning", label: "🌅 Morning (6am-12pm)", desc: "Fresh mind, better focus" },
                                                { value: "afternoon", label: "☀️ Afternoon (12pm-6pm)", desc: "Deep study sessions" },
                                                { value: "evening", label: "🌙 Evening (6pm-12am)", desc: "Quiet and reflective" },
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

                        {/* Step 5: Goals */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Trophy className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        What's your ultimate goal?
                                    </h2>
                                    <p className="text-slate-500">What do you want to be able to do at the end?</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg font-semibold">Learning Objectives</Label>
                                    <Textarea
                                        placeholder="e.g. Build my first web app, pass the certification exam, be able to converse in Italian..."
                                        value={data.goals}
                                        onChange={(e) => setData({ ...data, goals: e.target.value })}
                                        rows={6}
                                        className="rounded-2xl resize-none border-slate-200 text-lg p-6"
                                    />
                                    <p className="text-sm text-slate-400">AI will use this to prioritize specific topics in your curriculum.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Generating Plan */}
                        {step === 6 && (
                            <div className="text-center space-y-6 py-8">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200"
                                >
                                    <Sparkles className="w-12 h-12 text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    🤖 AI is building your curriculum...
                                </h2>
                                <p className="text-slate-500">Creating a personalized journey for {data.courseName}</p>

                                <div className="space-y-3 max-w-sm mx-auto">
                                    {[
                                        "Mapping learning trajectory",
                                        "Curating specific modules",
                                        "Identifying best resources",
                                        "Optimizing study schedule",
                                        "Finalizing your master plan",
                                    ].map((text, index) => (
                                        <motion.div
                                            key={text}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.6 }}
                                            className="flex items-center gap-3 text-left"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center gap-2 text-primary pt-4">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm font-bold">Crafting perfection...</span>
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
                                    className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100"
                                >
                                    <Check className="w-12 h-12 text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    🚀 Your Master Plan is Ready!
                                </h2>
                                <p className="text-slate-500">Let's start your journey to mastering {data.courseName}</p>

                                <div className="grid gap-4 max-w-md mx-auto text-left">
                                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <Target className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Curriculum generated</p>
                                                <p className="text-sm text-muted-foreground">From {data.level} to mastery</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Resource links included</p>
                                                <p className="text-sm text-muted-foreground">Tailored to your background</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Adaptive schedule</p>
                                                <p className="text-sm text-muted-foreground">Fits your {data.weekdayHours}h-{data.weekendHours}h availability</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleComplete}
                                    size="lg"
                                    className="rounded-2xl px-10 py-7 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 shadow-xl shadow-indigo-100 transition-all hover:scale-105"
                                >
                                    Go to My Dashboard
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 6 && (
                            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="rounded-xl border-slate-200"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                {step === 5 ? (
                                    <Button
                                        onClick={handleGeneratePlan}
                                        disabled={!canProceed()}
                                        className="rounded-xl px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate My Plan
                                    </Button>
                                ) : (
                                    <Button onClick={nextStep} disabled={!canProceed()} className="rounded-xl px-6">
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
