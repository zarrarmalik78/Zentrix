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
    courseName: string;
    level: "beginner" | "intermediate" | "advanced";
    background: string;
    targetDate: string;
    weekdayHours: number;
    weekendHours: number;
    preferredTime: string;
    goals: string;
}

interface TaskSubtask {
    description: string;
    estimatedMinutes: number;
}

interface Task {
    subject: string; // Used as Category/Module in new model
    topic: string;
    description: string;
    subtasks: TaskSubtask[];
    date: string;
    duration: number;
    difficulty: "Easy" | "Medium" | "Hard";
    method: "Learn" | "Practice" | "Revise" | "Research" | "Project" | "Theory" | "Watch";
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
            courseName,
            level,
            background,
            targetDate,
            weekdayHours = 2,
            weekendHours = 4,
            preferredTime = "evening",
            goals = "",
        } = body;

        // Calculate days until target
        const today = new Date();
        const target = new Date(targetDate);
        const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 0) {
            return NextResponse.json(
                { error: "Target date must be in the future" },
                { status: 400 }
            );
        }

        const prompt = `You are Zentrix AI, an expert educational architect and learning scientist. 
Your goal is to design a high-performance, personalized learning curriculum for a student.

USER PROFILE:
- Course/Skill to Master: ${courseName}
- Current Level: ${level}
- Background/Experience: ${background}
- Target Completion Date: ${targetDate} (${daysRemaining} days remaining)
- Daily Availability: ${weekdayHours}h (weekdays), ${weekendHours}h (weekends)
- Preferred Study Time: ${preferredTime}
- Primary Objectives: ${goals}

YOUR TASK:
Create a comprehensive, day-by-day learning journey that transforms this user from ${level} to mastery in ${courseName}.

CURRICULUM REQUIREMENTS:
1. Divide the timeline (${daysRemaining} days) into progressive phases:
   - Phase 1: Foundations & Core Concepts
   - Phase 2: Deep Dive & Application
   - Phase 3: Advanced Topics & Projects
   - Phase 4: Mastery, Review & Final Goal Achievement

2. Generate SPECIFIC, ACTIONABLE tasks for each day from today (${today.toISOString().split("T")[0]}) until the target date.

3. For EACH task, provide:
   - **subject**: The Category of the task. Choose EXACTLY ONE from: ["Learn", "Practice", "Revise", "Research", "Project", "Theory", "Watch"]
   - **topic**: A clear, professional title for the module (e.g., "Intro to Neural Networks", "Advanced Italian Verb Conjugation")
   - **description**: A compelling overview of what will be achieved today
   - **subtasks**: Array of 3-5 specific micro-steps with estimated minutes
   - **date**: Date in YYYY-MM-DD format
   - **duration**: Total minutes (sum of subtasks). Must not exceed user's daily availability.
   - **difficulty**: "Easy", "Medium", or "Hard"
   - **method**: Detailed learning strategy (e.g., "Active Recall", "Feynman Technique", "Project-Based Learning")
   - **resources**: Array of high-quality resource suggestions (e.g., specific YouTube channels, documentation, books, or online platforms)

4. DESIGN PRINCIPLES:
   - **Spaced Repetition**: Schedule review tasks every 5-7 days.
   - **Scaffolding**: Ensure concepts build on each other logically.
   - **Variety**: Mix watching, reading, and doing to keep engagement high.
   - **Gamification Ready**: Create tasks that feel like "missions" or "levels".
   - **Realistic**: Respect the user's background. If they are a beginner, don't start with complex theory.

OUTPUT FORMAT (JSON only, NO markdown):
{
  "tasks": [
    {
      "subject": "Learn",
      "topic": "Fundamentals of [Course Name]",
      "description": "Establish a strong foundation by understanding the core principles...",
      "subtasks": [
        { "description": "Micro-step 1", "estimatedMinutes": 20 },
        { "description": "Micro-step 2", "estimatedMinutes": 30 }
      ],
      "date": "YYYY-MM-DD",
      "duration": 50,
      "difficulty": "Easy",
      "method": "Learn",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}

Make the curriculum dense, professional, and world-class. Focus on the user's specific goals: ${goals}`;

        console.log("Generating world-class curriculum with Groq AI...");

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.75,
            max_tokens: 8000,
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
                subject: task.subject, // Category (Learn/Practice/etc)
                topic: task.topic,
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

        console.log(`Successfully saved ${aiTasks.length} curriculum modules to Firestore`);

        return NextResponse.json({
            success: true,
            tasksCreated: aiTasks.length,
            message: `Created ${aiTasks.length} curriculum modules for your journey to master ${courseName}`,
        });
    } catch (error: unknown) {
        console.error("Error generating plan:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate plan" },
            { status: 500 }
        );
    }
}
