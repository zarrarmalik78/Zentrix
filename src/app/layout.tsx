import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Zentrix - AI Learning Platform",
    description: "Master any skill with personalized AI-powered learning journeys",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} font-sans antialiased bg-slate-50`}>
                <AuthProvider>
                    <AppShell>{children}</AppShell>
                </AuthProvider>
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
