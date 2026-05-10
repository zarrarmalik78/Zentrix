"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError("Invalid email or password");
            } else {
                setError("Failed to sign in");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">

                {/* Animated Gradient Bg */}
                <motion.div
                    animate={{
                        opacity: [0.4, 0.6, 0.4],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />

                {/* Floating Orbs */}
                <motion.div
                    animate={{ y: [0, -40, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] opacity-40 mix-blend-screen"
                />
                <motion.div
                    animate={{ y: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-fuchsia-500 rounded-full blur-[100px] opacity-30 mix-blend-screen"
                />

                <div className="relative z-10 p-16 text-center max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>AI-Powered Learning Journeys</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-white mb-6 leading-tight">
                        Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Zentrix</span>
                    </h1>
                    <p className="text-lg text-indigo-200/80 leading-relaxed">
                        Continue your learning journey. Check your tasks, monitor your progress, and crush your learning goals.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
                        <p className="text-slate-500 mt-2">Enter your credentials to continue</p>
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
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Password</Label>
                                    <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</Link>
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl text-base font-bold bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 text-white transition-all hover:scale-[1.02]"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                            </Button>
                        </form>


                        <p className="text-center text-sm text-slate-500">
                            New here? <Link href="/signup" className="font-bold text-indigo-600 hover:underline">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
