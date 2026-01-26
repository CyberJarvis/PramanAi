"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslate from "@/components/GoogleTranslate";

// Menu items with role-based access matching PAGE_ACCESS in middleware
const menuItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst", "user", "viewer"], // All roles
    },
    {
        title: "Map",
        href: "/dashboard/map",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst", "user"], // No viewer
    },
    {
        title: "Impact Timeline",
        href: "/dashboard/timeline",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst", "user"], // No viewer
    },
    {
        title: "Causal Attribution",
        href: "/dashboard/attribution",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst", "user"], // No viewer
    },
    {
        title: "Quick Risk",
        href: "/dashboard/risk",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst"], // Analyst+
    },
    {
        title: "Deep Intel",
        href: "/dashboard/intelligence",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        roles: ["admin", "policy_designer", "analyst"], // Analyst+
    },
    {
        title: "Scenario Simulator",
        href: "/dashboard/scenarios",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        roles: ["admin", "policy_designer"], // Policy Designer+
    },
    {
        title: "Causal Graph",
        href: "/dashboard/causal-graph",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        roles: ["admin", "policy_designer"], // Policy Designer+
    },
    {
        title: "Situation Room",
        href: "/dashboard/council",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        roles: ["admin", "policy_designer"], // Policy Designer+
    },
];

const adminItems = [
    {
        title: "Admin Panel",
        href: "/admin",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        roles: ["admin"], // Admin only
    },
];

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const userRole = user?.role || "viewer";

    const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole));
    const filteredAdmin = adminItems.filter((item) => item.roles.includes(userRole));

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0b0c15]/80 backdrop-blur-xl border-r border-white/[0.05] flex flex-col z-40 supports-[backdrop-filter]:bg-[#0b0c15]/60">
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-white/[0.05]">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/Logo.png" alt="PRAMAN AI" className="w-8 h-8 rounded-full object-cover shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-300" />
                    <span className="text-lg font-bold text-white tracking-wide">PRAMAN AI</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
                {/* Main Menu */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Analytics</p>
                    <ul className="space-y-1">
                        {filteredMenu.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                                            }`}
                                    >
                                        <span className={isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-400"}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">{item.title}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Admin Section */}
                {filteredAdmin.length > 0 && (
                    <div className="pt-4 border-t border-white/[0.05]">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Administration</p>
                        <ul className="space-y-1">
                            {filteredAdmin.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                                ? "bg-gradient-to-r from-rose-500/10 to-pink-500/10 text-white border border-rose-500/20"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                                                }`}
                                        >
                                            <span className={isActive ? "text-rose-400" : "text-gray-500 group-hover:text-gray-400"}>
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium">{item.title}</span>
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Language Selector */}
            <div className="px-4 py-3 border-t border-white/[0.05]">
                <GoogleTranslate />
            </div>

            {/* User Info */}
            <div className="p-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${getRoleGradient(userRole)}`}>
                        {user?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.email || "Guest"}</p>
                        <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize mt-1 ${getRoleBadgeStyle(userRole)}`}>
                            {getRoleIcon(userRole)} {userRole.replace("_", " ")}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function getRoleGradient(role) {
    switch (role) {
        case "admin": return "bg-gradient-to-br from-rose-500 to-pink-600";
        case "policy_designer": return "bg-gradient-to-br from-purple-500 to-violet-600";
        case "analyst": return "bg-gradient-to-br from-blue-500 to-cyan-600";
        case "user": return "bg-gradient-to-br from-emerald-500 to-green-600";
        default: return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
}

function getRoleBadgeStyle(role) {
    switch (role) {
        case "admin": return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
        case "policy_designer": return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
        case "analyst": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
        case "user": return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        default: return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
}

function getRoleIcon(role) {
    switch (role) {
        case "admin": return "🛡️";
        case "policy_designer": return "📋";
        case "analyst": return "📊";
        case "user": return "👤";
        default: return "👁️";
    }
}
