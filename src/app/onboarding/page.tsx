"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
    { id: 1, title: "Academic Details", description: "Tell us about your current grade" },
    { id: 2, title: "Subjects", description: "What are you studying?" },
    { id: 3, title: "Progress", description: "How much have you covered?" },
    { id: 4, title: "Goal", description: "When is your exam?" },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { updateUserProfile } = useAuth();
    const router = useRouter();

    // Form State
    const [grade, setGrade] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [currentSubject, setCurrentSubject] = useState("");
    const [syllabusCompleted, setSyllabusCompleted] = useState([0]);
    const [examDate, setExamDate] = useState<Date>();

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!examDate) return;

        setLoading(true);
        try {
            await updateUserProfile({
                class: grade,
                subjects,
                syllabusCompleted: syllabusCompleted[0],
                examDate: examDate.toISOString(),
            });

            // Trigger initial plan generation
            const token = await (await import("@/lib/firebase")).auth.currentUser?.getIdToken();
            await fetch("/api/generate-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    class: grade,
                    subjects,
                    syllabusCompleted: syllabusCompleted[0],
                    examDate: examDate.toISOString(),
                }),
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentSubject.trim()) {
            e.preventDefault();
            if (!subjects.includes(currentSubject.trim())) {
                setSubjects([...subjects, currentSubject.trim()]);
            }
            setCurrentSubject("");
        }
    };

    const removeSubject = (subjectToRemove: string) => {
        setSubjects(subjects.filter((s) => s !== subjectToRemove));
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-background rounded-2xl shadow-xl border overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Steps */}
                <div className="w-full md:w-1/3 bg-muted/50 p-8 border-r">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Setup Profile</h2>
                            <p className="text-muted-foreground mt-2">
                                Let&apos;s personalize your study plan.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div key={step.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors",
                                                currentStep > step.id
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : currentStep === step.id
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background text-muted-foreground border-muted-foreground/30"
                                            )}
                                        >
                                            {currentStep > step.id ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        {step.id !== steps.length && (
                                            <div
                                                className={cn(
                                                    "w-0.5 h-full mt-2 min-h-[20px] transition-colors",
                                                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/20"
                                                )}
                                            />
                                        )}
                                    </div>
                                    <div className={cn("pb-8", currentStep === step.id ? "opacity-100" : "opacity-60")}>
                                        <p className="font-medium text-sm leading-none">{step.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1"
                        >
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">What grade are you in?</h3>
                                        <p className="text-muted-foreground">
                                            This helps us calibrate the difficulty of your study tasks.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Class / Grade / Year</Label>
                                        <Input
                                            placeholder="e.g. 10th Grade, Sophomore Year"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            className="h-12 text-lg"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">What subjects are you taking?</h3>
                                        <p className="text-muted-foreground">
                                            Press Enter to add each subject.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Add Subject</Label>
                                            <Input
                                                placeholder="Type subject (e.g. Physics) and press Enter"
                                                value={currentSubject}
                                                onChange={(e) => setCurrentSubject(e.target.value)}
                                                onKeyDown={handleAddSubject}
                                                className="h-12"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {subjects.map((subject) => (
                                                <div
                                                    key={subject}
                                                    className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 animate-in zoom-in"
                                                >
                                                    {subject}
                                                    <button
                                                        onClick={() => removeSubject(subject)}
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            {subjects.length === 0 && (
                                                <p className="text-sm text-muted-foreground italic">
                                                    No subjects added yet
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Syllabus Completion</h3>
                                        <p className="text-muted-foreground">
                                            Roughly how much of the syllabus have you already covered?
                                        </p>
                                    </div>
                                    <div className="space-y-8 py-8">
                                        <div className="text-center">
                                            <span className="text-6xl font-black text-primary">
                                                {syllabusCompleted[0]}%
                                            </span>
                                        </div>
                                        <Slider
                                            value={syllabusCompleted}
                                            onValueChange={setSyllabusCompleted}
                                            max={100}
                                            step={5}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                                            <span>Just Started</span>
                                            <span>Halfway</span>
                                            <span>Almost Done</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">When is your exam?</h3>
                                        <p className="text-muted-foreground">
                                            We&apos;ll build your schedule working backwards from this date.
                                        </p>
                                    </div>
                                    <div className="flex justify-center py-6">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full max-w-sm justify-start text-left font-normal h-12 text-lg",
                                                        !examDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-5 w-5" />
                                                    {examDate ? (
                                                        format(examDate, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="center">
                                                <Calendar
                                                    mode="single"
                                                    selected={examDate}
                                                    onSelect={setExamDate}
                                                    disabled={(date) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between pt-8 border-t mt-auto">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !grade) ||
                                (currentStep === 2 && subjects.length === 0) ||
                                (currentStep === 4 && !examDate) ||
                                loading
                            }
                            className="px-8"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : currentStep === 4 ? (
                                "Personalize Plan"
                            ) : (
                                <>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
