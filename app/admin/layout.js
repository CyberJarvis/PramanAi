"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminTabs = [
    { name: "Overview", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Roles", href: "/admin/roles", icon: "🔐" },
    { name: "Activity", href: "/admin/activity", icon: "📋" },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0b12] via-[#0f1019] to-[#0a0b12]">
            {/* Admin Header */}
            <header className="border-b border-white/[0.05] bg-[#0b0c15]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                                ← Dashboard
                            </Link>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                                    <span className="text-white text-lg">🛡️</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                                    <p className="text-xs text-gray-500">Role-Based Access Control</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
                                🔴 Admin Access
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex gap-1">
                        {adminTabs.map((tab) => {
                            const isActive = pathname === tab.href ||
                                (tab.href !== "/admin" && pathname.startsWith(tab.href));
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${isActive
                                            ? "text-rose-400 border-rose-400"
                                            : "text-gray-400 border-transparent hover:text-white hover:border-white/20"
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
