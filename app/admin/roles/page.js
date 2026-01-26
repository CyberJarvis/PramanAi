"use client";

import { ROLES, PERMISSIONS, ROLE_PERMISSIONS, getPermissionsByCategory } from "@/lib/rbac";

export default function AdminRolesPage() {
    const roles = Object.entries(ROLES);
    const permissionCategories = Object.keys(
        Object.values(PERMISSIONS).reduce((acc, p) => ({ ...acc, [p.category]: true }), {})
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Role Management</h1>
                <p className="text-gray-400 text-sm mt-1">View and understand role permissions hierarchy</p>
            </div>

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(([key, role]) => {
                    const permissions = ROLE_PERMISSIONS[key] || [];
                    const permsByCategory = getPermissionsByCategory(key);

                    return (
                        <div
                            key={key}
                            className={`rounded-2xl bg-white/[0.02] border ${role.borderColor} overflow-hidden`}
                        >
                            {/* Role Header */}
                            <div className={`px-6 py-4 ${role.bgColor} border-b ${role.borderColor}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{role.icon}</span>
                                    <div>
                                        <h3 className={`text-lg font-bold ${role.textColor}`}>{role.name}</h3>
                                        <p className="text-xs text-gray-400">Level {role.level}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="px-6 py-4 border-b border-white/[0.05]">
                                <p className="text-sm text-gray-400">{role.description}</p>
                            </div>

                            {/* Permissions */}
                            <div className="px-6 py-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Permissions ({permissions.length})
                                </h4>
                                <div className="space-y-3">
                                    {Object.entries(permsByCategory).map(([category, perms]) => (
                                        <div key={category}>
                                            <p className="text-xs text-gray-500 mb-1">{category}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {perms.map((perm) => (
                                                    <span
                                                        key={perm.key}
                                                        className="px-2 py-0.5 rounded text-xs bg-white/[0.05] text-gray-300"
                                                    >
                                                        {perm.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {permissions.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No specific permissions</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Permission Matrix */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05]">
                    <h2 className="text-lg font-semibold text-white">Permission Matrix</h2>
                    <p className="text-sm text-gray-400 mt-1">Overview of all permissions by role</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.05]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider sticky left-0 bg-[#0f1019]">
                                    Permission
                                </th>
                                {roles.map(([key, role]) => (
                                    <th key={key} className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                        <span className={role.textColor}>{role.icon}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {Object.entries(PERMISSIONS).map(([permKey, perm]) => (
                                <tr key={permKey} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-3 text-sm text-gray-300 sticky left-0 bg-[#0f1019]">
                                        <span className="text-xs text-gray-500 mr-2">[{perm.category}]</span>
                                        {perm.name}
                                    </td>
                                    {roles.map(([roleKey]) => {
                                        const hasPermission = (ROLE_PERMISSIONS[roleKey] || []).includes(permKey);
                                        return (
                                            <td key={roleKey} className="px-4 py-3 text-center">
                                                {hasPermission ? (
                                                    <span className="text-emerald-400">✓</span>
                                                ) : (
                                                    <span className="text-gray-600">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hierarchy Info */}
            <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-6">
                <div className="flex items-start gap-4">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <h3 className="text-blue-400 font-semibold mb-2">Role Hierarchy</h3>
                        <p className="text-sm text-gray-400">
                            Roles are hierarchical. Higher-level roles inherit access capabilities of lower-level roles.
                            <strong className="text-white"> Admin (Level 5)</strong> has full system access, while
                            <strong className="text-white"> Viewer (Level 1)</strong> has read-only access.
                        </p>
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                            {roles.sort((a, b) => b[1].level - a[1].level).map(([key, role]) => (
                                <span key={key} className={`px-3 py-1 rounded-full text-xs font-medium ${role.bgColor} ${role.textColor} border ${role.borderColor}`}>
                                    {role.icon} {role.name} (L{role.level})
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
