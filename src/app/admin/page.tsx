"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Student {
    uid: string;
    email: string;
    role: string;
    profile?: {
        class?: string;
        subjects?: string[];
        examDate?: string;
    };
}

interface Task {
    id: string;
    subject: string;
    description: string;
    date: any;
    status: "pending" | "completed" | "verified";
    evidence?: string;
    userId: string;
}

export default function AdminPage() {
    const { user, userProfile, signOut, loading: authLoading } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (!authLoading && userProfile?.role !== "admin") {
            router.push("/dashboard");
            return;
        }

        if (!user) return;

        // Fetch all students
        const fetchStudents = async () => {
            const q = query(
                collection(db, "users"),
                where("role", "==", "student")
            );

            const snapshot = await getDocs(q);
            const studentsData: Student[] = [];
            snapshot.forEach((doc) => {
                studentsData.push({ uid: doc.id, ...doc.data() } as Student);
            });

            setStudents(studentsData);
            setLoading(false);
        };

        fetchStudents();
    }, [user, userProfile, authLoading, router]);

    useEffect(() => {
        if (!selectedStudent) return;

        // Real-time listener for selected student's tasks
        const q = query(
            collection(db, "tasks"),
            where("userId", "==", selectedStudent.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: Task[] = [];
            snapshot.forEach((doc) => {
                tasksData.push({ id: doc.id, ...doc.data() } as Task);
            });

            // Sort by date
            tasksData.sort((a, b) => a.date.toMillis() - b.date.toMillis());

            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, [selectedStudent]);

    const handleVerifyTask = async (taskId: string) => {
        try {
            await updateDoc(doc(db, "tasks", taskId), {
                status: "verified",
            });
        } catch (error) {
            console.error("Error verifying task:", error);
        }
    };

    const handleRejectTask = async (taskId: string) => {
        try {
            await updateDoc(doc(db, "tasks", taskId), {
                status: "pending",
                evidence: null,
            });
        } catch (error) {
            console.error("Error rejecting task:", error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                        </div>
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Students List */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Students
                                </CardTitle>
                                <CardDescription>
                                    {students.length} total students
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {students.map((student) => (
                                    <button
                                        key={student.uid}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedStudent?.uid === student.uid
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <p className="font-medium text-sm">{student.email}</p>
                                        {student.profile?.class && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {student.profile.class}
                                            </p>
                                        )}
                                    </button>
                                ))}

                                {students.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No students yet
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Student Details & Tasks */}
                    <div className="lg:col-span-2">
                        {selectedStudent ? (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Student Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                                        </div>
                                        {selectedStudent.profile?.class && (
                                            <div>
                                                <p className="text-sm font-medium">Class</p>
                                                <p className="text-sm text-muted-foreground">{selectedStudent.profile.class}</p>
                                            </div>
                                        )}
                                        {selectedStudent.profile?.subjects && (
                                            <div>
                                                <p className="text-sm font-medium">Subjects</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedStudent.profile.subjects.map((subject, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedStudent.profile?.examDate && (
                                            <div>
                                                <p className="text-sm font-medium">Exam Date</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(selectedStudent.profile.examDate), "MMMM d, yyyy")}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Tasks</h2>

                                    {tasks.map((task) => (
                                        <Card key={task.id}>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <CardTitle className="text-base">{task.subject}</CardTitle>
                                                            <Badge
                                                                variant={
                                                                    task.status === "verified"
                                                                        ? "success"
                                                                        : task.status === "completed"
                                                                            ? "warning"
                                                                            : "outline"
                                                                }
                                                            >
                                                                {task.status}
                                                            </Badge>
                                                        </div>
                                                        <CardDescription>{task.description}</CardDescription>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Due: {format(task.date.toDate(), "MMM d, yyyy")}
                                                        </p>
                                                        {task.evidence && (
                                                            <div className="mt-3 p-3 bg-muted rounded-md">
                                                                <p className="text-xs font-medium mb-1">Evidence:</p>
                                                                <p className="text-xs text-muted-foreground">{task.evidence}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            {task.status === "completed" && task.evidence && (
                                                <CardContent>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() => handleVerifyTask(task.id)}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleRejectTask(task.id)}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}

                                    {tasks.length === 0 && (
                                        <Card>
                                            <CardContent className="py-8">
                                                <p className="text-sm text-muted-foreground text-center">
                                                    No tasks for this student yet
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12">
                                    <p className="text-center text-muted-foreground">
                                        Select a student to view their details and tasks
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
