/**
 * RBAC (Role-Based Access Control) Library
 * Defines roles, permissions, and access control helpers
 */

// Role definitions with hierarchy levels (higher = more access)
export const ROLES = {
    admin: {
        name: "Admin",
        level: 5,
        color: "rose",
        bgColor: "bg-rose-500/20",
        textColor: "text-rose-400",
        borderColor: "border-rose-500/30",
        description: "Full system access - manage users, roles, and all features",
        icon: "🛡️",
    },
    policy_designer: {
        name: "Policy Designer",
        level: 4,
        color: "purple",
        bgColor: "bg-purple-500/20",
        textColor: "text-purple-400",
        borderColor: "border-purple-500/30",
        description: "Create and modify policies, scenarios, and interventions",
        icon: "📋",
    },
    analyst: {
        name: "Analyst",
        level: 3,
        color: "blue",
        bgColor: "bg-blue-500/20",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/30",
        description: "View all data, run analyses, export reports",
        icon: "📊",
    },
    user: {
        name: "User",
        level: 2,
        color: "emerald",
        bgColor: "bg-emerald-500/20",
        textColor: "text-emerald-400",
        borderColor: "border-emerald-500/30",
        description: "Standard dashboard access with basic features",
        icon: "👤",
    },
    viewer: {
        name: "Viewer",
        level: 1,
        color: "gray",
        bgColor: "bg-gray-500/20",
        textColor: "text-gray-400",
        borderColor: "border-gray-500/30",
        description: "Read-only access to dashboard and reports",
        icon: "👁️",
    },
};

// Permission definitions
export const PERMISSIONS = {
    // Dashboard permissions
    "dashboard.view": { name: "View Dashboard", category: "Dashboard" },
    "dashboard.edit": { name: "Edit Dashboard", category: "Dashboard" },

    // Analysis permissions
    "analysis.view": { name: "View Analyses", category: "Analysis" },
    "analysis.create": { name: "Create Analyses", category: "Analysis" },
    "analysis.export": { name: "Export Data", category: "Analysis" },

    // Scenario permissions
    "scenarios.view": { name: "View Scenarios", category: "Scenarios" },
    "scenarios.create": { name: "Create Scenarios", category: "Scenarios" },
    "scenarios.edit": { name: "Edit Scenarios", category: "Scenarios" },

    // User management
    "users.view": { name: "View Users", category: "Admin" },
    "users.create": { name: "Create Users", category: "Admin" },
    "users.edit": { name: "Edit Users", category: "Admin" },
    "users.delete": { name: "Delete Users", category: "Admin" },

    // Role management
    "roles.view": { name: "View Roles", category: "Admin" },
    "roles.manage": { name: "Manage Roles", category: "Admin" },

    // System
    "system.settings": { name: "System Settings", category: "System" },
    "system.audit": { name: "View Audit Logs", category: "System" },
};

// Role-Permission mappings
export const ROLE_PERMISSIONS = {
    admin: Object.keys(PERMISSIONS), // Admin has all permissions

    policy_designer: [
        "dashboard.view", "dashboard.edit",
        "analysis.view", "analysis.create", "analysis.export",
        "scenarios.view", "scenarios.create", "scenarios.edit",
        "users.view",
    ],

    analyst: [
        "dashboard.view",
        "analysis.view", "analysis.create", "analysis.export",
        "scenarios.view",
    ],

    user: [
        "dashboard.view",
        "analysis.view",
        "scenarios.view",
    ],

    viewer: [
        "dashboard.view",
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role, permission) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
}

/**
 * Check if roleA has higher or equal access level than roleB
 */
export function hasMinimumRole(userRole, requiredRole) {
    const userLevel = ROLES[userRole]?.level || 0;
    const requiredLevel = ROLES[requiredRole]?.level || 0;
    return userLevel >= requiredLevel;
}

/**
 * Get role info by role key
 */
export function getRoleInfo(roleKey) {
    return ROLES[roleKey] || ROLES.viewer;
}

/**
 * Get all permissions for a role organized by category
 */
export function getPermissionsByCategory(role) {
    const rolePerms = ROLE_PERMISSIONS[role] || [];
    const categories = {};

    rolePerms.forEach(perm => {
        const permInfo = PERMISSIONS[perm];
        if (permInfo) {
            if (!categories[permInfo.category]) {
                categories[permInfo.category] = [];
            }
            categories[permInfo.category].push({
                key: perm,
                ...permInfo,
            });
        }
    });

    return categories;
}

/**
 * Get list of all roles
 */
export function getAllRoles() {
    return Object.entries(ROLES).map(([key, value]) => ({
        key,
        ...value,
        permissions: ROLE_PERMISSIONS[key] || [],
    }));
}

/**
 * Page-level access control matrix
 * Defines which roles can access which pages
 */
export const PAGE_ACCESS = {
    // Dashboard pages
    "/dashboard": ["admin", "policy_designer", "analyst", "user", "viewer"],
    "/dashboard/map": ["admin", "policy_designer", "analyst", "user"],
    "/dashboard/risk": ["admin", "policy_designer", "analyst"],
    "/dashboard/timeline": ["admin", "policy_designer", "analyst", "user"],
    "/dashboard/attribution": ["admin", "policy_designer", "analyst", "user"],
    "/dashboard/intelligence": ["admin", "policy_designer", "analyst"],
    "/dashboard/scenarios": ["admin", "policy_designer"],
    "/dashboard/causal-graph": ["admin", "policy_designer"],
    "/dashboard/council": ["admin", "policy_designer"],
    // Admin pages
    "/admin": ["admin"],
    "/admin/users": ["admin"],
    "/admin/roles": ["admin"],
    "/admin/activity": ["admin"],
};

/**
 * Check if a role can access a specific page
 */
export function canAccessPage(role, pathname) {
    // Find exact match first
    if (PAGE_ACCESS[pathname]) {
        return PAGE_ACCESS[pathname].includes(role);
    }

    // Check for parent path match (e.g., /admin/users/123 -> /admin)
    const pathParts = pathname.split('/').filter(Boolean);
    while (pathParts.length > 0) {
        const parentPath = '/' + pathParts.join('/');
        if (PAGE_ACCESS[parentPath]) {
            return PAGE_ACCESS[parentPath].includes(role);
        }
        pathParts.pop();
    }

    // Default: allow access if no rule defined
    return true;
}

/**
 * Get accessible pages for a role
 */
export function getAccessiblePages(role) {
    return Object.entries(PAGE_ACCESS)
        .filter(([, roles]) => roles.includes(role))
        .map(([path]) => path);
}
