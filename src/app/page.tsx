"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Star, Users, Zap, Shield, Sparkles, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useRef } from "react";

export default function LandingPage() {
    const { user, loading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    if (!loading && user) {
        redirect("/dashboard");
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div ref={containerRef} className="flex flex-col min-h-screen bg-slate-50 selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
            {/* Navbar */}
            <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Zentrix</span>
                </div>
                <nav className="ml-auto flex items-center gap-8">
                    <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors hidden md:block" href="/login">
                        Features
                    </Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors hidden md:block" href="/login">
                        Pricing
                    </Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="/login">
                        Sign In
                    </Link>
                    <Link href="/signup">
                        <Button className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-6 overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"
                        />
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm md:text-base text-primary mb-8 font-semibold backdrop-blur-sm border border-primary/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Revolutionizing Education with AI</span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-5xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Your Syllabus, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-blue-600">Simultaneously Solved.</span>
                        </motion.h1>

                        <motion.p
                            className="mt-8 mx-auto max-w-[800px] text-slate-600 text-lg md:text-2xl font-medium leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Zentrix transforms complex curriculums into personalized daily missions.
                            Stay ahead, stay organized, and ace your exams with zero stress.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link href="/signup">
                                <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 flex items-center gap-2 group">
                                    Start Learning for Free
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full border-2 bg-white/50 backdrop-blur-md hover:bg-slate-50">
                                    Watch Video
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Hero Image/Mockup */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-20 relative w-full max-w-6xl px-4"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-8 border-slate-900/5 bg-white flex items-center justify-center">
                                <Image
                                    src="/saas_dashboard_mockup_1769728810125.png"
                                    alt="Zentrix Dashboard"
                                    width={1024}
                                    height={1024}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none" />
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -left-6 md:-left-12 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 hidden md:flex"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Productivity</p>
                                    <p className="font-bold text-slate-900">+85% Efficiency</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 -right-6 md:-right-12 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 hidden md:flex"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Verified</p>
                                    <p className="font-bold text-slate-900">Expert Content</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center font-bold text-slate-400 uppercase tracking-[0.2em] text-sm mb-12">Empowering 50,000+ Students globally</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-50 grayscale contrast-125">
                            {/* Dummy Logo Placeholders */}
                            <div className="text-2xl font-black text-slate-900 italic">STANFORD</div>
                            <div className="text-2xl font-black text-slate-900 italic">HARVARD</div>
                            <div className="text-2xl font-black text-slate-900 italic">MIT</div>
                            <div className="text-2xl font-black text-slate-900 italic">OXFORD</div>
                            <div className="text-2xl font-black text-slate-900 italic">CAMBRIDGE</div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Bento Grid */}
                <section className="py-24 md:py-32 bg-slate-50 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Built for Modern Minds</h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Everything you need to master your academics in one powerful, aesthetic dashboard.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full md:grid-rows-2">
                            {/* Feature 1 */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="md:col-span-8 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-700 text-white relative overflow-hidden group min-h-[400px]"
                            >
                                <div className="relative z-10 max-w-md">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/30">
                                        <Calendar className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Hyper-Personalized Scheduling</h3>
                                    <p className="text-lg text-white/80 leading-relaxed">
                                        Our AI doesn't just list tasks. It understands your pace, detects subjects you struggle with, and optimizes your time for maximum retention.
                                    </p>
                                </div>
                                <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[80px] group-hover:opacity-20 transition-opacity" />
                            </motion.div>

                            {/* Feature 2 */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="md:col-span-4 p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 border border-blue-100">
                                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Evidence-Based Progress</h3>
                                    <p className="text-slate-500 text-lg">
                                        Upload study selfies or notes to verify your hard work. Gamify your learning with streaks and points.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Feature 3 */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="md:col-span-4 p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8 border border-indigo-100">
                                    <Brain className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Subtopic Detection</h3>
                                    <p className="text-slate-500 text-lg">
                                        AI breaks down generic subjects into atomic chapters. You'll always know exactly what to study next.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Feature 4 */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="md:col-span-8 p-8 md:p-12 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
                            >
                                <div className="flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/20">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Admin & Tutor Central</h3>
                                    <p className="text-lg text-white/70 leading-relaxed">
                                        Perfect for organizations. Monitor student engagement, verify tasks, and view cohort analytics at a glance.
                                    </p>
                                </div>
                                <div className="flex-1 w-full bg-slate-800 rounded-2xl p-6 border border-white/10 shadow-inner">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                                        <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                                        <div className="h-4 w-full bg-white/10 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">What our community says</h2>
                                <p className="text-xl text-slate-500 mb-12">Trusted by students from the world's most prestigious institutions.</p>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="w-12 h-12 rounded-full p-0">
                                        <ArrowRight className="w-6 h-6 rotate-180" />
                                    </Button>
                                    <Button variant="outline" className="w-12 h-12 rounded-full p-0">
                                        <ArrowRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ x: 20 }}
                                    className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-100/50"
                                >
                                    <div className="flex gap-1 mb-6 text-yellow-400">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-xl text-slate-700 italic mb-8">
                                        &quot;Before Zentrix, I was drowning in my syllabus. Now, every morning I have a clear mission. My grades have improved by 30% in just one month!&quot;
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden relative">
                                            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" fill alt="User avatar" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 border-none">Sarah Millers</p>
                                            <p className="text-slate-500 text-sm">Medical Student, UCL</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto rounded-[3.5rem] bg-slate-900 p-12 md:p-24 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-[40%] h-[100%] bg-primary/20 blur-[100px]" />
                            <div className="absolute bottom-0 right-0 w-[40%] h-[100%] bg-indigo-600/20 blur-[100px]" />
                        </div>

                        <h2 className="text-4xl md:text-7xl font-black text-white mb-8">Ready to transform your <br /> learning journey?</h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
                            Join thousands of students who are already using AI to master their syllabus and reduce study stress.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/signup">
                                <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-2xl font-bold">
                                    Get Started for Free
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white/10 text-white backdrop-blur-xl border border-white/20 hover:bg-white/20 font-bold">
                                    Book a Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/40 font-bold text-sm uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                No Credit Card
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                Instant Access
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                Cancel Anytime
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 border-none">Zentrix</span>
                    </div>

                    <nav className="flex gap-8">
                        <Link className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#">Twitter</Link>
                        <Link className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#">LinkedIn</Link>
                        <Link className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#">Legal</Link>
                        <Link className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors" href="#">Privacy</Link>
                    </nav>

                    <p className="text-sm text-slate-400 font-medium">© 2026 Zentrix AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
