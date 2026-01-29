"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
    const { user, loading } = useAuth();
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completionData, setCompletionData] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const students = usersSnapshot.docs.filter(d => d.data().role === "student");
            setTotalStudents(students.length);

            const tasksSnapshot = await getDocs(collection(db, "tasks"));
            const tasks = tasksSnapshot.docs.map(d => d.data());
            setTotalTasks(tasks.length);

            const completedCount = tasks.filter((t: any) => ["completed", "verified"].includes(t.status)).length;
            const pendingCount = tasks.filter((t: any) => t.status === "pending").length;
            const skippedCount = tasks.filter((t: any) => t.status === "skipped").length;

            setCompletionData([
                { name: "Completed", value: completedCount },
                { name: "Pending", value: pendingCount },
                { name: "Skipped", value: skippedCount },
            ]);

            setDataLoading(false);
        };

        fetchData();
    }, [user]);

    if (loading || dataLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
                <p className="text-muted-foreground">Platform-wide statistics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Global Task Status Distribution</CardTitle>
                    <CardDescription>Overall student performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={completionData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#8884d8" barSize={50} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
