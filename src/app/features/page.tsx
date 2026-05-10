"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
    Brain, 
    Sparkles, 
    Zap, 
    Target, 
    Trophy, 
    Clock, 
    CheckCircle2, 
    ArrowRight,
    Search,
    Layout,
    LineChart,
    Shield
} from "lucide-react";

export default function FeaturesPage() {
    const features = [
        {
            title: "AI Course Architect",
            description: "Simply enter any subject, from 'Quantum Physics' to 'Italian Cooking', and our AI builds a comprehensive curriculum tailored to your level.",
            icon: <Brain className="w-8 h-8 text-indigo-500" />,
            color: "bg-indigo-50",
            example: "User inputs 'React Native for Beginners' → AI generates a 30-day roadmap with 45 atomic modules."
        },
        {
            title: "Atomic Learning Modules",
            description: "Generic courses are overwhelming. Zentrix breaks them down into small, digestible tasks that you can complete in 30-60 minutes.",
            icon: <Layout className="w-8 h-8 text-blue-500" />,
            color: "bg-blue-50",
            example: "A massive 'JavaScript' course becomes 'Arrow Functions', 'Promises', and 'Async/Await' daily tasks."
        },
        {
            title: "Gamified Progress System",
            description: "Stay motivated with an RPG-like experience. Earn XP for every task, maintain streaks to unlock multipliers, and collect rare badges.",
            icon: <Trophy className="w-8 h-8 text-amber-500" />,
            color: "bg-amber-50",
            example: "Complete 7 days in a row to earn the 'Week Warrior' badge and +50 bonus XP."
        },
        {
            title: "AI Mastery Forecast",
            description: "Our algorithms analyze your learning speed to predict exactly when you'll master your current course.",
            icon: <LineChart className="w-8 h-8 text-green-500" />,
            color: "bg-green-50",
            example: "AI detects you're ahead of schedule and updates your Mastery Date from Oct 20th to Oct 12th."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-primary/30 selection:text-primary-foreground">
            {/* Navbar */}
            <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Zentrix</span>
                </Link>
                <nav className="ml-auto flex items-center gap-8">
                    <Link className="text-sm font-semibold text-primary" href="/features">
                        Features
                    </Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="/login">
                        Sign In
                    </Link>
                    <Link href="/signup">
                        <Button className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20">
                {/* Hero Feature Section */}
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm text-indigo-600 mb-8 font-bold uppercase tracking-widest border border-indigo-100"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>The Zentrix Advantage</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight"
                    >
                        Master Anything. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Zero Guesswork.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
                    >
                        Stop wasting time planning and start learning. Zentrix uses advanced AI to create the perfect roadmap for your goals.
                    </motion.p>
                </div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group"
                        >
                            <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 border border-slate-50 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                {f.description}
                            </p>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 font-medium">
                                <span className="text-indigo-600 font-bold not-italic">Example:</span> {f.example}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works Section */}
                <div className="mb-32">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">How it works</h2>
                        <p className="text-xl text-slate-500 font-medium">Your journey to mastery in 4 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { step: "01", title: "Set Goal", desc: "Tell us what you want to learn and your current background.", icon: <Search className="text-indigo-500" /> },
                            { step: "02", title: "AI Blueprint", desc: "Our AI generates a custom roadmap with atomic modules.", icon: <Brain className="text-purple-500" /> },
                            { step: "03", title: "Execute", desc: "Follow your daily plan and tick off modules as you go.", icon: <Zap className="text-amber-500" /> },
                            { step: "04", title: "Master", desc: "Earn badges and watch your mastery score reach 100%.", icon: <CheckCircle2 className="text-green-500" /> }
                        ].map((s, i) => (
                            <div key={i} className="relative text-center">
                                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 text-2xl font-black">
                                    {s.icon}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-2">{s.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-slate-100 z-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden mb-32">
                    <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
                    </div>
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Why Zentrix is the <br /> <span className="text-indigo-400">future of learning.</span></h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Saves 10+ hours/week", desc: "No more searching for what to study next." },
                                    { title: "Reduces Study Stress", desc: "Manageable daily tasks keep you calm." },
                                    { title: "Guaranteed Consistency", desc: "Gamification keeps you coming back every day." },
                                    { title: "AI-Powered Verification", desc: "Coming soon: AI feedback on your study notes." }
                                ].map((b, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl">{b.title}</h4>
                                            <p className="text-slate-400 font-medium">{b.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-12 border border-white/20">
                            <blockquote className="text-2xl font-medium italic mb-8 leading-relaxed">
                                &quot;Zentrix transformed my learning habit. I went from being overwhelmed by my AI course to mastering it in 45 days. The daily roadmaps are a game changer.&quot;
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-bold">SM</div>
                                <div>
                                    <p className="font-bold">Sarah Mitchell</p>
                                    <p className="text-slate-400 text-sm font-medium">University of Toronto</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-12">Stop Planning. Start Mastering.</h2>
                    <Link href="/signup">
                        <Button size="lg" className="h-20 px-12 text-2xl rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 flex items-center gap-4 group mx-auto font-black">
                            Get Started for Free
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </main>

            <footer className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Zentrix</span>
                    </div>
                    <p className="text-slate-400 font-medium">© 2026 Zentrix AI. Empowering the next generation of masters.</p>
                </div>
            </footer>
        </div>
    );
}
