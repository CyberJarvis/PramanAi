"use client";

import { useState, useEffect } from "react";
import { ROLES } from "@/lib/rbac";

export default function AdminActivityPage() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const result = await res.json();
            if (result.success) {
                setActivity(result.data.activity || []);
            }
        } catch (err) {
            console.error("Failed to fetch activity:", err);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        if (action.includes("create")) return { icon: "➕", color: "text-emerald-400", bg: "bg-emerald-500/10" };
        if (action.includes("role")) return { icon: "🔄", color: "text-blue-400", bg: "bg-blue-500/10" };
        if (action.includes("delete") || action.includes("deactivate")) return { icon: "🗑️", color: "text-rose-400", bg: "bg-rose-500/10" };
        if (action.includes("activate")) return { icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10" };
        if (action.includes("export")) return { icon: "📤", color: "text-purple-400", bg: "bg-purple-500/10" };
        if (action.includes("scenario")) return { icon: "🎯", color: "text-amber-400", bg: "bg-amber-500/10" };
        return { icon: "📋", color: "text-gray-400", bg: "bg-gray-500/10" };
    };

    const formatAction = (action) => {
        return action.split(".").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Activity Log</h1>
                <p className="text-gray-400 text-sm mt-1">Track all user actions and system events</p>
            </div>

            {/* Activity Timeline */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                <div className="divide-y divide-white/[0.05]">
                    {activity.map((item, index) => {
                        const actionStyle = getActionIcon(item.action);
                        const timestamp = new Date(item.timestamp);
                        const isToday = timestamp.toDateString() === new Date().toDateString();
                        const isYesterday = timestamp.toDateString() === new Date(Date.now() - 86400000).toDateString();

                        return (
                            <div key={item.id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl ${actionStyle.bg} flex items-center justify-center shrink-0`}>
                                        <span className="text-lg">{actionStyle.icon}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-white font-medium">{item.details}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs font-medium ${actionStyle.color}`}>
                                                        {formatAction(item.action)}
                                                    </span>
                                                    <span className="text-gray-600">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {item.userId}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm text-gray-400">
                                                    {isToday ? "Today" : isYesterday ? "Yesterday" : timestamp.toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {activity.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No activity recorded yet
                        </div>
                    )}
                </div>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-6">
                <div className="flex items-start gap-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="text-amber-400 font-semibold mb-2">Activity Retention</h3>
                        <p className="text-sm text-gray-400">
                            Activity logs are retained for 90 days. For compliance purposes,
                            critical actions (user creation, role changes, deletions) are
                            archived permanently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
