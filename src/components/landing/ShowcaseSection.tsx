"use client";

import { motion } from "framer-motion";
import { 
    TrendingUp, 
    Trophy, 
    Zap, 
    Star, 
    BarChart3, 
    Target,
    Award
} from "lucide-react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const data = [
    { name: "Mon", xp: 400 },
    { name: "Tue", xp: 700 },
    { name: "Wed", xp: 500 },
    { name: "Thu", xp: 900 },
    { name: "Fri", xp: 1200 },
    { name: "Sat", xp: 1500 },
    { name: "Sun", xp: 2100 },
];

export function ShowcaseSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm text-indigo-600 mb-6 font-bold uppercase tracking-widest border border-indigo-100"
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Real-Time Mastery Tracking</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Experience Your Growth</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">Visualize your learning journey with advanced analytics and reward systems built to keep you motivated.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Graph */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-indigo-100/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-indigo-500/5">
                            <TrendingUp className="w-64 h-64" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Weekly XP Gain</h3>
                                    <p className="text-slate-500 font-medium">Your learning velocity this week</p>
                                </div>
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <TrendingUp className="w-6 h-6 text-indigo-500" />
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            itemStyle={{color: '#6366f1', fontWeight: 800}}
                                        />
                                        <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Badges & Stats */}
                    <div className="space-y-8">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 border border-orange-100 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                                </div>
                                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Longest Streak</h4>
                                <p className="text-4xl font-black text-slate-900">42 Days</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-indigo-500/20 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform">
                                    <Star className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                                </div>
                                <h4 className="text-indigo-300 font-bold uppercase tracking-widest text-[10px] mb-2">Current Level</h4>
                                <p className="text-4xl font-black">Level 18</p>
                            </motion.div>
                        </div>

                        {/* Badges Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-indigo-600" />
                                    Mastery Badges
                                </h3>
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">12 Unlocked</span>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: "🔥", label: "On Fire", color: "bg-orange-50" },
                                    { icon: "🧠", label: "Deep Learner", color: "bg-blue-50" },
                                    { icon: "🎯", label: "Goal Crusher", color: "bg-green-50" },
                                    { icon: "⚡", label: "Speed Demon", color: "bg-yellow-50" },
                                    { icon: "📚", label: "Book Worm", color: "bg-purple-50" },
                                    { icon: "🏅", label: "Top 1%", color: "bg-indigo-50" },
                                ].map((badge, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-16 h-16 ${badge.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 cursor-pointer`}
                                        title={badge.label}
                                    >
                                        {badge.icon}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
