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
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/^\"|\"$/g, '').replace(/\\n/g, "\n"),
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
    customSubjects?: string;
    examDate: string;
    syllabusProgress?: Record<string, number>;
    weekdayHours?: number;
    weekendHours?: number;
    preferredTime?: string;
    goals?: string;
    weakTopics?: Record<string, string>;
}

interface TaskSubtask {
    description: string;
    estimatedMinutes: number;
}

interface Task {
    subject: string;
    topic: string;
    description: string;
    subtasks: TaskSubtask[];
    date: string;
    duration: number;
    difficulty: "Easy" | "Medium" | "Hard";
    method: string;
    resources: string[];
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
        const {
            class: classLevel,
            subjects,
            customSubjects,
            examDate,
            syllabusProgress = {},
            weekdayHours = 3,
            weekendHours = 5,
            preferredTime = "evening",
            goals = "",
            weakTopics = {},
        } = body;

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

        // Combine subjects
        const allSubjects = [...subjects];
        if (customSubjects) {
            const custom = customSubjects.split(",").map((s) => s.trim()).filter(Boolean);
            allSubjects.push(...custom);
        }

        // Build detailed prompt for quality AI responses
        const subjectDetails = allSubjects
            .map((subject) => {
                const progress = syllabusProgress[subject] || 0;
                const weak = weakTopics[subject] || "None specified";
                return `- ${subject}: ${progress}% completed, Weak Topics: ${weak}`;
            })
            .join("\n");

        const prompt = `You are an expert study planner creating a personalized schedule for a student.

STUDENT PROFILE:
- Class/Level: ${classLevel}
- Exam Date: ${examDate} (${daysUntilExam} days remaining)
- Daily Study Time: ${weekdayHours} hours (weekdays), ${weekendHours} hours (weekends)
- Preferred Study Time: ${preferredTime}
${goals ? `- Goals: ${goals}` : ""}

SUBJECTS & PROGRESS:
${subjectDetails}

REQUIREMENTS:
1. Create a day-by-day study schedule from today (${today.toISOString().split("T")[0]}) until the exam date
2. For EACH task, provide:
   - **subject**: The subject name
   - **topic**: Specific, clear topic name (NOT vague like "Study Math")
   - **description**: Brief overview of what to study
   - **subtasks**: Array of 3-5 actionable steps with estimated minutes
     Example subtask: { "description": "Watch Khan Academy video on Chain Rule", "estimatedMinutes": 15 }
   - **date**: Date in YYYY-MM-DD format
   - **duration**: Total estimated time in minutes (sum of subtasks)
   - **difficulty**: "Easy", "Medium", or "Hard"
   - **method**: "Learn", "Practice", or "Revise"
   - **resources**: Array of resource names (e.g., "NCERT Textbook", "Khan Academy", "Practice Workbook")

3. Follow these principles:
   - Focus on weak topics first for each subject
   - Start with easier topics to build confidence
   - Increase difficulty gradually
   - Include regular revision cycles (every 7-10 days)
   - Distribute subjects evenly throughout the schedule
   - Add intensive revision in the last 2 weeks before exam
   - Limit tasks to ${weekdayHours} hours on weekdays, ${weekendHours} hours on weekends

4. Make tasks SPECIFIC and ACTIONABLE:
   ❌ Bad: "Study Mathematics"
   ✅ Good Topic: "Derivatives - Chain Rule and Product Rule"
   ✅ Good Subtasks:
      - Watch concept video (15 min)
      - Read textbook Chapter 5, Section 3 (20 min)
      - Solve 10 practice problems (25 min)
      - Create formula flashcard (5 min)

5. Task distribution:
   - First ${Math.floor(daysUntilExam * 0.7)} days: Cover remaining syllabus
   - Next ${Math.floor(daysUntilExam * 0.2)} days: Comprehensive revision
   - Last ${Math.floor(daysUntilExam * 0.1)} days: Mock tests and problem-solving

OUTPUT FORMAT (JSON only, NO markdown):
{
  "tasks": [
    {
      "subject": "Mathematics",
      "topic": "Derivatives - Chain Rule",
      "description": "Learn and practice derivative rules with special focus on chain rule applications",
      "subtasks": [
        { "description": "Watch Khan Academy video on Chain Rule", "estimatedMinutes": 15 },
        { "description": "Read NCERT Chapter 5, Pages 78-85", "estimatedMinutes": 20 },
        { "description": "Solve 10 problems from Exercise 5.3", "estimatedMinutes": 25 }
      ],
      "date": "2026-01-30",
      "duration": 60,
      "difficulty": "Medium",
      "method": "Learn",
      "resources": ["NCERT Class 12 Math", "Khan Academy Calculus"]
    }
  ]
}

Generate comprehensive tasks covering all subjects and the entire timeline. Ensure variety and proper pacing.`;

        console.log("Generating plan with Groq AI...");

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 8000, // Allow longer responses for detailed tasks
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

            console.log(`Generated ${aiTasks.length} tasks`);
        } catch (error) {
            console.error("JSON parsing error:", error);
            console.error("Raw response:", responseText.substring(0, 500));
            return NextResponse.json(
                { error: "Failed to parse AI response. Please try again." },
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
                topic: task.topic || task.description,
                description: task.description,
                subtasks: task.subtasks || [],
                date: new Date(task.date),
                duration: task.duration || 60,
                difficulty: task.difficulty || "Medium",
                method: task.method || "Learn",
                resources: task.resources || [],
                status: "pending",
                evidence: null,
                createdAt: new Date(),
            });
        });

        await batch.commit();

        console.log(`Successfully saved ${aiTasks.length} tasks to Firestore`);

        return NextResponse.json({
            success: true,
            tasksCreated: aiTasks.length,
            message: `Created ${aiTasks.length} personalized tasks for your ${daysUntilExam}-day study plan`,
        });
    } catch (error: unknown) {
        console.error("Error generating plan:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate plan" },
            { status: 500 }
        );
    }
}
