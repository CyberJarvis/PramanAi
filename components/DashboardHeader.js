"use client";

import Link from "next/link";
import { useData } from "@/lib/DataContext";

export default function DashboardHeader({ user }) {
    const { data } = useData();

    const confidenceScore = data?.confidence?.score || 0;
    const confidenceColor = confidenceScore >= 85
        ? "text-emerald-400"
        : confidenceScore >= 65
            ? "text-amber-400"
            : "text-red-400";

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
                {/* Confidence Level Indicator - Now uses real data */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-xs text-gray-500">Model Confidence:</span>
                    <span className={`text-sm font-semibold ${confidenceColor}`}>
                        {confidenceScore}%
                    </span>
                </div>

                {/* Logout */}
                <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
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
