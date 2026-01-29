"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Search, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StudentProfile {
    uid: string;
    email: string;
    role: "student";
    profile?: {
        class?: string;
        subjects?: string[];
        syllabusCompleted?: number;
        examDate?: string;
    };
}

export default function StudentsPage() {
    const { user, loading } = useAuth();
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!user) return;

        // In a real app, you'd likely paginate this. 
        // Secure this query with security rules ensuring only admins can read 'users' collection generally
        const q = query(collection(db, "users"), where("role", "==", "student"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentList = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() })) as StudentProfile[];
            setStudents(studentList);
            setDataLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredStudents = students.filter(student =>
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.profile?.class?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground">Manage and monitor student progress.</p>
            </div>

            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    type="email"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon" variant="ghost">
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No students found.
                    </div>
                ) : (
                    filteredStudents.map((student) => (
                        <Card key={student.uid} className="hover:shadow-md transition-all">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                        {student.email[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base">{student.email}</CardTitle>
                                    <CardDescription>
                                        {student.profile?.class || "No Grade Set"}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {student.profile?.subjects?.map((subject) => (
                                        <Badge key={subject} variant="secondary" className="text-xs">
                                            {subject}
                                        </Badge>
                                    ))}
                                    {(!student.profile?.subjects || student.profile.subjects.length === 0) && (
                                        <span className="text-xs text-muted-foreground italic">No subjects</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{student.profile?.syllabusCompleted || 0}%</span>
                                </div>
                                {/* Add View Details button in future */}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
