"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROLES } from "@/lib/rbac";

export default function AccessDeniedPage() {
    const searchParams = useSearchParams();
    const attemptedPage = searchParams.get("page") || "/dashboard";
    const userRole = searchParams.get("role") || "viewer";

    const roleInfo = ROLES[userRole] || ROLES.viewer;

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="max-w-md w-full text-center">
                {/* Lock Icon */}
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
                <p className="text-gray-400 mb-8">
                    You don&apos;t have permission to access this page.
                </p>

                {/* Role Info */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 mb-8">
                    <p className="text-sm text-gray-500 mb-3">Your current role:</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${roleInfo.bgColor} ${roleInfo.textColor} border ${roleInfo.borderColor}`}>
                        <span className="text-lg">{roleInfo.icon}</span>
                        <span className="font-semibold">{roleInfo.name}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.05]">
                        <p className="text-xs text-gray-500 mb-1">Attempted to access:</p>
                        <code className="text-sm text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg">
                            {attemptedPage}
                        </code>
                    </div>
                </div>

                {/* Description based on role */}
                <div className="text-left bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                            <p className="text-sm text-amber-400 font-medium mb-1">What you can access:</p>
                            <p className="text-sm text-gray-400">{roleInfo.description}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/api/auth/logout"
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                    >
                        Switch Account
                    </Link>
                </div>

                {/* Contact Admin */}
                <p className="mt-8 text-sm text-gray-500">
                    Need more access? Contact your administrator.
                </p>
            </div>
        </div>
    );
}
