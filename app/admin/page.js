"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROLES } from "@/lib/rbac";

export default function AdminOverviewPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const stats = data?.stats || { total: 0, active: 0, inactive: 0, byRole: {} };
    const activity = data?.activity || [];
    const recentUsers = (data?.users || []).slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={stats.total}
                    icon="👥"
                    color="blue"
                />
                <StatCard
                    label="Active Users"
                    value={stats.active}
                    icon="✅"
                    color="emerald"
                />
                <StatCard
                    label="Roles"
                    value={Object.keys(ROLES).length}
                    icon="🔐"
                    color="purple"
                />
                <StatCard
                    label="Recent Activity"
                    value={activity.length}
                    icon="📋"
                    color="amber"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Users */}
                <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Users</h2>
                        <Link href="/admin/users" className="text-sm text-blue-400 hover:text-blue-300">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <RoleBadge role={user.role} />
                            </div>
                        ))}
                        {recentUsers.length === 0 && (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No users found
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Activity */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/admin/users?action=create"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all"
                            >
                                <span>➕</span>
                                <span className="text-sm font-medium">Add New User</span>
                            </Link>
                            <Link
                                href="/admin/roles"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 transition-all"
                            >
                                <span>🔐</span>
                                <span className="text-sm font-medium">Manage Roles</span>
                            </Link>
                            <Link
                                href="/admin/activity"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-all"
                            >
                                <span>📊</span>
                                <span className="text-sm font-medium">View Activity Log</span>
                            </Link>
                        </div>
                    </div>

                    {/* Role Distribution */}
                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Role Distribution</h2>
                        <div className="space-y-3">
                            {Object.entries(stats.byRole).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between">
                                    <RoleBadge role={role} />
                                    <span className="text-sm text-gray-400">{count} users</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <Link href="/admin/activity" className="text-sm text-blue-400 hover:text-blue-300">
                        View all →
                    </Link>
                </div>
                <div className="divide-y divide-white/[0.05]">
                    {activity.slice(0, 5).map((item) => (
                        <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">
                                    {item.action.includes("create") ? "➕" :
                                        item.action.includes("role") ? "🔄" :
                                            item.action.includes("delete") || item.action.includes("deactivate") ? "🗑️" : "📋"}
                                </span>
                                <p className="text-sm text-gray-300">{item.details}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colors = {
        blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
        emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400",
        purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400",
        amber: "from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400",
        rose: "from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400",
    };

    return (
        <div className={`rounded-2xl bg-gradient-to-br ${colors[color]} border p-6`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

function RoleBadge({ role }) {
    const roleInfo = ROLES[role] || ROLES.viewer;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor} border ${roleInfo.borderColor}`}>
            {roleInfo.icon} {roleInfo.name}
        </span>
    );
}
