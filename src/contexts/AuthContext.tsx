"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type UserRole = "student" | "admin";

interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    role: UserRole;
    profile?: {
        class?: string;
        subjects?: string[];
        syllabusCompleted?: number;
        examDate?: string;
        weekdayHours?: number;
        weekendHours?: number;
        preferredTime?: string;
        goals?: string;
        weakTopics?: Record<string, string>;
    };
    gamification?: {
        xp: number;
        level: number;
        currentStreak: number;
        longestStreak: number;
        lastActivityDate: string;
        totalTasksCompleted: number;
        badges: string[];
    };
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, role: UserRole) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: (role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (profileData: UserProfile["profile"]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string, role: UserRole) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Create user profile in Firestore
        const userProfile: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            role,
            gamification: {
                xp: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: new Date().toISOString(),
                totalTasksCompleted: 0,
                badges: [],
            },
        };

        await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
        setUserProfile(userProfile);
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async (role: UserRole) => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user profile exists
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            // Create new profile if it doesn't exist
            const newUserProfile: UserProfile = {
                uid: user.uid,
                email: user.email!,
                role,
            };
            await setDoc(doc(db, "users", user.uid), newUserProfile);
            setUserProfile(newUserProfile);
        } else {
            setUserProfile(userDoc.data() as UserProfile);
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    const updateUserProfile = async (profileData: UserProfile["profile"]) => {
        if (!user) return;

        const updatedProfile = {
            ...userProfile,
            profile: profileData,
        };

        await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
        setUserProfile(updatedProfile as UserProfile);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                signUp,
                signIn,
                signInWithGoogle,
                signOut,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
