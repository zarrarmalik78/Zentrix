import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin (only once)
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GeneratePlanRequest {
    class: string;
    subjects: string[];
    syllabusCompleted: number;
    examDate: string;
}

interface Task {
    subject: string;
    description: string;
    date: string;
    status: "pending" | "completed" | "verified";
    evidence?: string;
}

export async function POST(req: NextRequest) {
    try {
        // Check if Groq API key is configured
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "Groq API key not configured. Please add GROQ_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        // Get the authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];

        // Verify the Firebase token
        let userId: string;
        try {
            const decodedToken = await auth().verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            console.error("Token verification error:", error);
            return NextResponse.json(
                { error: "Invalid authentication token" },
                { status: 401 }
            );
        }

        const body: GeneratePlanRequest = await req.json();
        const { class: classLevel, subjects, syllabusCompleted, examDate } = body;

        // Calculate days until exam
        const today = new Date();
        const exam = new Date(examDate);
        const daysUntilExam = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExam <= 0) {
            return NextResponse.json(
                { error: "Exam date must be in the future" },
                { status: 400 }
            );
        }

        const prompt = `You are an AI study planner. Generate a structured study plan for a student with the following details:

Class: ${classLevel}
Subjects: ${subjects.join(", ")}
Syllabus Completed: ${syllabusCompleted}%
Days Until Exam: ${daysUntilExam}

Create a daily study schedule from today until the exam date. For each task, provide:
1. Subject
2. Specific topic/chapter to study
3. Date (in YYYY-MM-DD format)

Focus on completing the remaining ${100 - syllabusCompleted}% of the syllabus first, then allocate time for revision.
Distribute tasks evenly across all subjects.
Keep tasks realistic (1-2 hours per task).

Return the response as a valid JSON object (NO Markdown formatting, NO \`\`\`json blocks) with a "tasks" array in this exact format:
{
  "tasks": [
    {
      "subject": "Mathematics",
      "description": "Study Chapter 5: Quadratic Equations - Practice problems 1-20",
      "date": "2026-01-30"
    }
  ]
}

Generate at least ${Math.min(daysUntilExam, 30)} tasks.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" },
        });

        let responseText = completion.choices[0]?.message?.content || "";

        // Parse the AI response
        let aiTasks: Task[];
        try {
            const parsed = JSON.parse(responseText);
            aiTasks = parsed.tasks || parsed;

            if (!Array.isArray(aiTasks) || aiTasks.length === 0) {
                throw new Error("Invalid tasks array from AI");
            }
        } catch (error) {
            console.error("JSON parsing error:", error);
            console.error("Raw response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        // Save tasks to Firestore
        const db = getFirestore();
        const batch = db.batch();

        aiTasks.forEach((task) => {
            const taskRef = db.collection("tasks").doc();
            batch.set(taskRef, {
                userId,
                subject: task.subject,
                description: task.description,
                date: new Date(task.date),
                status: "pending",
                evidence: null,
                createdAt: new Date(),
            });
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            tasksCreated: aiTasks.length,
        });
    } catch (error: unknown) {
        console.error("Error generating plan:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate plan" },
            { status: 500 }
        );
    }
}
