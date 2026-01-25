import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import LogoutButton from "./LogoutButton";

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch {
        return null;
    }
}

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="dashboard-container">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="dashboard-nav-inner">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-900 font-medium">{user.email}</p>
                                <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            <main className="dashboard-main">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome back! 👋
                    </h2>
                    <p className="text-gray-500">Here&apos;s what&apos;s happening with your account.</p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid mb-8">
                    {[
                        { label: "Projects", value: "12", icon: "📁" },
                        { label: "Tasks", value: "48", icon: "✅" },
                        { label: "Messages", value: "8", icon: "💬" },
                        { label: "Reports", value: "3", icon: "📊" },
                    ].map((stat, index) => (
                        <div key={index} className="dashboard-card" style={{ padding: '20px' }}>
                            <span className="text-2xl block mb-2">{stat.icon}</span>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="content-grid">
                    {/* Profile Card */}
                    <div className="dashboard-card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile</h3>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                                }`}>
                                {user.role.toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <span className="text-gray-500 text-sm">User ID</span>
                                <span className="text-gray-700 text-xs font-mono truncate max-w-[120px]">
                                    {user.userId}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <span className="text-gray-500 text-sm">Status</span>
                                <span className="flex items-center gap-2 text-green-600 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Card */}
                    <div className="dashboard-card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

                        <div className="space-y-3">
                            {[
                                { action: "Logged in successfully", time: "Just now", icon: "🔐" },
                                { action: "Profile viewed", time: "2 minutes ago", icon: "👤" },
                                { action: "Session started", time: "5 minutes ago", icon: "🚀" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <span className="text-xl">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium text-sm">{activity.action}</p>
                                        <p className="text-gray-500 text-xs">{activity.time}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Success Banner */}
                        <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-green-800 font-semibold text-sm">Authentication Active</h4>
                                    <p className="text-green-600 text-xs">Your session is secure and protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

                    <div className="actions-grid">
                        {[
                            { label: "Settings", icon: "⚙️" },
                            { label: "Help", icon: "❓" },
                            { label: "Updates", icon: "🔔" },
                            { label: "Security", icon: "🛡️" },
                        ].map((action, index) => (
                            <button key={index} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group">
                                <span className="text-xl block mb-2">{action.icon}</span>
                                <span className="text-gray-700 text-sm font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
