"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Star, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function LandingPage() {
    const { user, loading } = useAuth();

    if (!loading && user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">EduPlus</span>
                </div>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/login">
                        Sign In
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl opacity-20" />
                    </div>

                    <div className="flex flex-col items-center space-y-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4 font-medium">
                                ✨ AI-Powered Study Assistant
                            </div>
                        </motion.div>
                        <motion.h1
                            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-4xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Detailed Study Plans, <br />
                            <span className="text-primary">Tailored Just for You.</span>
                        </motion.h1>
                        <motion.p
                            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Stop guessing what to study. Our AI analyzes your syllabus and exam date to create the perfect daily schedule for academic success.
                        </motion.p>
                        <motion.div
                            className="space-x-4 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link href="/signup">
                                <Button size="lg" className="h-12 px-8 text-lg">
                                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                    See Demo
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
                    <div className="px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                                <p className="text-muted-foreground">
                                    AI automatically distributes your syllabus topics evenly until your exam day, ensuring you cover everything without burnout.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                                <p className="text-muted-foreground">
                                    Visualize your completion rates. Mark tasks as done, skip them with reasons, or upload evidence for accountability.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Admin Oversight</h3>
                                <p className="text-muted-foreground">
                                    Perfect for tutors and schools. Admins can verify student tasks and monitor class performance in real-time.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Social Proof / Testimonials */}
                <section className="w-full py-12 md:py-24 border-t">
                    <div className="px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight mb-12">Trusted by Students Everywhere</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col items-center bg-card p-6 rounded-xl border">
                                    <div className="flex gap-1 mb-4 text-yellow-400">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-muted-foreground mb-4 italic">
                                        &quot;EduPlus saved my semester. I went from overwhelmed to organized in 5 minutes.&quot;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden" />
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">Alex Johnson</p>
                                            <p className="text-xs text-muted-foreground">High School Senior</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground text-center">
                    <div className="px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">Ready to Ace Your Exams?</h2>
                        <p className="mx-auto max-w-[600px] text-primary-foreground/80 mb-8 text-lg">
                            Join EduPlus today and get your personalized AI study plan in seconds.
                        </p>
                        <Link href="/signup">
                            <Button variant="secondary" size="lg" className="h-12 px-8 text-lg font-semibold">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="py-6 w-full shrink-0 border-t flex flex-col sm:flex-row items-center justify-between px-4 md:px-6">
                <p className="text-xs text-muted-foreground">© 2026 EduPlus AI. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
