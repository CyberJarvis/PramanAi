"use client";

import Link from "next/link";
import { useData } from "@/lib/DataContext";

const ROLE_CONFIG = {
    admin: { color: "rose", icon: "🛡️", label: "Admin" },
    policy_designer: { color: "purple", icon: "📋", label: "Policy Designer" },
    analyst: { color: "blue", icon: "📊", label: "Analyst" },
    user: { color: "emerald", icon: "👤", label: "User" },
    viewer: { color: "gray", icon: "👁️", label: "Viewer" },
};

export default function DashboardHeader({ user }) {
    const { data } = useData();

    const confidenceScore = data?.confidence?.score || 0;
    const confidenceColor = confidenceScore >= 85
        ? "text-emerald-400"
        : confidenceScore >= 65
            ? "text-amber-400"
            : "text-red-400";

    const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.viewer;
    const roleBadgeClass = `bg-${roleConfig.color}-500/10 border-${roleConfig.color}-500/20 text-${roleConfig.color}-400`;

    return (
        <header className="h-20 bg-[#0b0c15]/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-8 sticky top-0 z-30 supports-[backdrop-filter]:bg-[#0b0c15]/60">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400">System Active</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Role Badge */}
                {user && (
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${user.role === "admin" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                            user.role === "policy_designer" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                                user.role === "analyst" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                    user.role === "user" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        "bg-gray-500/10 border-gray-500/20 text-gray-400"
                        }`}>
                        <span>{roleConfig.icon}</span>
                        <span className="text-xs font-medium">{roleConfig.label}</span>
                    </div>
                )}

                {/* Confidence Level Indicator */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-xs text-gray-500">Model Confidence:</span>
                    <span className={`text-sm font-semibold ${confidenceColor}`}>
                        {confidenceScore}%
                    </span>
                </div>

                {/* User Email */}
                {user && (
                    <span className="hidden lg:block text-sm text-gray-400 truncate max-w-[200px]">
                        {user.email}
                    </span>
                )}

                {/* Logout */}
                <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </header>
    );
}
