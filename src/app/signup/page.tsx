"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, GraduationCap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
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
            await signUp(email, password);
            router.push("/onboarding");
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


    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-indigo-50">
                <div className="absolute inset-0 bg-blue-500/5 transition-colors duration-700" />

                {/* Animated Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply filter bg-purple-300"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply filter bg-cyan-300"
                />

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-black/5 text-white bg-gradient-to-br from-cyan-400 to-blue-500">
                            <GraduationCap className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">
                            Master Any Course.
                        </h1>
                        <p className="text-lg text-slate-500">
                            Join thousands of learners organizing their education with AI-powered personalized study plans.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Start your learning journey today</p>
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
                                    placeholder="name@example.com"
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
                                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                            </Button>
                        </form>


                        <p className="text-center text-sm text-slate-500">
                            Already a member? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
