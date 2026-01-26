"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { PAGE_ACCESS, ROLES } from "@/lib/rbac";

/**
 * Role-based welcome banner showing user's access level
 */
export default function RoleWelcomeBanner() {
    const { user, roleInfo } = useAuth();

    if (!user) return null;

    const role = user.role || "viewer";
    const info = ROLES[role] || ROLES.viewer;

    // Get accessible pages for this role
    const accessiblePages = Object.entries(PAGE_ACCESS)
        .filter(([path, roles]) => roles.includes(role) && path.startsWith("/dashboard") && path !== "/dashboard")
        .map(([path]) => {
            const name = path.split("/").pop().replace(/-/g, " ");
            return { path, name: name.charAt(0).toUpperCase() + name.slice(1) };
        });

    // Get restricted pages for this role
    const restrictedPages = Object.entries(PAGE_ACCESS)
        .filter(([path, roles]) => !roles.includes(role) && path.startsWith("/dashboard") && path !== "/dashboard" && path !== "/dashboard/access-denied")
        .map(([path]) => {
            const name = path.split("/").pop().replace(/-/g, " ");
            return { path, name: name.charAt(0).toUpperCase() + name.slice(1) };
        });

    return (
        <div className={`rounded-2xl border p-6 mb-8 ${info.bgColor} ${info.borderColor}`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${role === "admin" ? "bg-gradient-to-br from-rose-500 to-pink-600" :
                            role === "policy_designer" ? "bg-gradient-to-br from-purple-500 to-violet-600" :
                                role === "analyst" ? "bg-gradient-to-br from-blue-500 to-cyan-600" :
                                    role === "user" ? "bg-gradient-to-br from-emerald-500 to-green-600" :
                                        "bg-gradient-to-br from-gray-500 to-gray-600"
                        }`}>
                        {info.icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            Welcome, {info.name}!
                        </h2>
                        <p className="text-sm text-gray-400">{info.description}</p>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border ${info.borderColor} ${info.bgColor}`}>
                    <span className={`text-sm font-semibold ${info.textColor}`}>
                        Access Level: {info.level}/5
                    </span>
                </div>
            </div>

            {/* Access Summary */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
                {/* Can Access */}
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>✅</span> You can access ({accessiblePages.length} pages)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {accessiblePages.slice(0, 6).map((page) => (
                            <Link
                                key={page.path}
                                href={page.path}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                            >
                                {page.name}
                            </Link>
                        ))}
                        {accessiblePages.length > 6 && (
                            <span className="px-3 py-1.5 text-xs text-gray-500">
                                +{accessiblePages.length - 6} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Cannot Access */}
                {restrictedPages.length > 0 && (
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span>🔒</span> Restricted ({restrictedPages.length} pages)
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {restrictedPages.slice(0, 4).map((page) => (
                                <span
                                    key={page.path}
                                    className="px-3 py-1.5 rounded-lg bg-gray-500/10 text-gray-500 text-xs line-through"
                                >
                                    {page.name}
                                </span>
                            ))}
                            {restrictedPages.length > 4 && (
                                <span className="px-3 py-1.5 text-xs text-gray-600">
                                    +{restrictedPages.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Admin has full access */}
                {restrictedPages.length === 0 && (
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                        <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span>🛡️</span> Full System Access
                        </p>
                        <p className="text-sm text-gray-400">
                            You have unrestricted access to all dashboard features and admin controls.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
