"use client";

import { DataProvider } from "@/lib/DataContext";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";

function DashboardContent({ children }) {
    const { isRTL } = useLanguage();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0b12]">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar user={user} />
            <div className={isRTL ? "mr-64" : "ml-64"}>
                <DashboardHeader user={user} />
                <main className="p-8">
                    {children}
                </main>
            </div>
            {/* Global Floating ChatBot */}
            <ChatBot />
        </div>
    );
}

export default function DashboardLayout({ children }) {
    return (
        <AuthProvider>
            <LanguageProvider>
                <DataProvider>
                    <DashboardContent>{children}</DashboardContent>
                </DataProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}
