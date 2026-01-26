"use client";

import { DataProvider } from "@/lib/DataContext";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";

function DashboardContent({ children }) {
    const { isRTL } = useLanguage();

    return (
        <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar user={null} />
            <div className={isRTL ? "mr-64" : "ml-64"}>
                <DashboardHeader user={null} />
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
        <LanguageProvider>
            <DataProvider>
                <DashboardContent>{children}</DashboardContent>
            </DataProvider>
        </LanguageProvider>
    );
}
