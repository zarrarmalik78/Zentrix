"use client";

import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, CheckCircle2, Clock, Circle } from "lucide-react";

interface Task {
    id: string;
    subject: string;
    description: string;
    date: Timestamp;
    status: "pending" | "completed" | "verified" | "skipped";
}

export default function CalendarPage() {
    const { user, loading } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("date", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const taskList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(taskList);
            setDataLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading || dataLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Find all dates that have tasks for the daily indicator (modifier)
    const daysWithTasks = tasks.map((t) => t.date.toDate());

    // Filter tasks for the selected date
    const selectedDateTasks = tasks.filter((task) =>
        date && isSameDay(task.date.toDate(), date)
    );

    return (
        <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Study Calendar</h1>
                <p className="text-muted-foreground">Visual view of your study schedule.</p>
            </div>

            <div className="grid md:grid-cols-[1fr_350px] gap-8 flex-1 overflow-hidden">
                {/* Calendar View */}
                <Card className="h-full flex flex-col">
                    <CardContent className="p-6 flex-1 flex items-center justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow p-8 scale-125 origin-center"
                            modifiers={{
                                booked: daysWithTasks
                            }}
                            modifiersStyles={{
                                booked: { fontWeight: 'bold', textDecoration: 'underline decoration-primary' }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Selected Date Tasks */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            {date ? format(date, "MMMM do") : "Select a date"}
                        </CardTitle>
                        <CardDescription>
                            {selectedDateTasks.length} tasks scheduled
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full px-6 pb-6">
                            <div className="space-y-4">
                                {selectedDateTasks.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No tasks for this day.
                                    </div>
                                ) : (
                                    selectedDateTasks.map(task => (
                                        <div key={task.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <Badge variant="outline">{task.subject}</Badge>
                                                <StatusIcon status={task.status} />
                                            </div>
                                            <p className="text-sm font-medium leading-normal">{task.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusIcon({ status }: { status: Task["status"] }) {
    if (status === "completed" || status === "verified")
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "skipped")
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    return <Circle className="w-4 h-4 text-yellow-500" />;
}
