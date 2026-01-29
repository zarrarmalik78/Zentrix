"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, GraduationCap, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"student" | "admin">("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, role);
            router.push(role === "student" ? "/onboarding" : "/admin");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to create account");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle(role);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setError("Failed to sign up with Google");
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Dynamic Visuals */}
            <div className={cn(
                "hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden transition-colors duration-700",
                role === "student" ? "bg-blue-50" : "bg-indigo-50"
            )}>
                <motion.div
                    initial={false}
                    animate={{
                        backgroundColor: role === "student" ? "rgba(59, 130, 246, 0.1)" : "rgba(79, 70, 229, 0.1)"
                    }}
                    className="absolute inset-0 transition-colors duration-700"
                />

                {/* Animated Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply filter transition-colors duration-700",
                        role === "student" ? "bg-purple-300" : "bg-indigo-300"
                    )}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply filter transition-colors duration-700",
                        role === "student" ? "bg-cyan-300" : "bg-purple-300"
                    )}
                />

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={cn(
                                "mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-black/5 text-white transition-colors duration-500",
                                role === "student" ? "bg-gradient-to-br from-cyan-400 to-blue-500" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                            )}>
                                {role === "student" ? <GraduationCap className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                            </div>
                            <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">
                                {role === 'student' ? "Ace Your Exams." : "Manage & Monitor."}
                            </h1>
                            <p className="text-lg text-slate-500">
                                {role === 'student'
                                    ? "Join thousands of students organizing their academic life with AI."
                                    : "Powerful tools for educators and administrators to track progress."}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Choose your role to get started</p>
                    </div>

                    {/* Role Selector Card */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100/50 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => setRole("student")}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300",
                                role === "student" ? "bg-white shadow-sm ring-2 ring-blue-100" : "hover:bg-slate-200/50 text-slate-500"
                            )}
                        >
                            <GraduationCap className={cn("w-6 h-6 mb-2", role === "student" ? "text-blue-500" : "text-slate-400")} />
                            <span className="font-bold text-sm">Student</span>
                            {role === "student" && <motion.div layoutId="roleCheck" className="absolute top-2 right-2 text-blue-500"><Check className="w-4 h-4" /></motion.div>}
                        </button>
                        <button
                            onClick={() => setRole("admin")}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300",
                                role === "admin" ? "bg-white shadow-sm ring-2 ring-indigo-100" : "hover:bg-slate-200/50 text-slate-500"
                            )}
                        >
                            <ShieldCheck className={cn("w-6 h-6 mb-2", role === "admin" ? "text-indigo-500" : "text-slate-400")} />
                            <span className="font-bold text-sm">Admin</span>
                            {role === "admin" && <motion.div layoutId="roleCheck" className="absolute top-2 right-2 text-indigo-500"><Check className="w-4 h-4" /></motion.div>}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@school.edu"
                                    className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm</Label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className={cn(
                                    "w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]",
                                    role === "student"
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700"
                                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 shadow-indigo-500/20"
                                )}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span></div>
                        </div>

                        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium">
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </Button>

                        <p className="text-center text-sm text-slate-500">
                            Already a member? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
