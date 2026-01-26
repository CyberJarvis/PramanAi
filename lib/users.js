/**
 * Mock User Database
 * In production, replace with actual database calls
 */

// In-memory user store (would be database in production)
let users = [
    {
        id: "usr_001",
        email: "admin@praman.ai",
        name: "System Admin",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-26T05:30:00Z",
        avatar: null,
    },
    {
        id: "usr_002",
        email: "sarah.chen@undp.org",
        name: "Sarah Chen",
        role: "policy_designer",
        status: "active",
        createdAt: "2024-01-15T00:00:00Z",
        lastLogin: "2024-01-25T14:20:00Z",
        avatar: null,
    },
    {
        id: "usr_003",
        email: "james.oko@unhcr.org",
        name: "James Okonkwo",
        role: "analyst",
        status: "active",
        createdAt: "2024-02-01T00:00:00Z",
        lastLogin: "2024-01-26T03:15:00Z",
        avatar: null,
    },
    {
        id: "usr_004",
        email: "maria.santos@worldbank.org",
        name: "Maria Santos",
        role: "analyst",
        status: "active",
        createdAt: "2024-02-10T00:00:00Z",
        lastLogin: "2024-01-24T09:45:00Z",
        avatar: null,
    },
    {
        id: "usr_005",
        email: "ahmed.hassan@iom.int",
        name: "Ahmed Hassan",
        role: "user",
        status: "active",
        createdAt: "2024-03-01T00:00:00Z",
        lastLogin: "2024-01-23T16:30:00Z",
        avatar: null,
    },
    {
        id: "usr_006",
        email: "elena.petrov@eu.europa.eu",
        name: "Elena Petrov",
        role: "viewer",
        status: "active",
        createdAt: "2024-03-15T00:00:00Z",
        lastLogin: "2024-01-20T11:00:00Z",
        avatar: null,
    },
    {
        id: "usr_007",
        email: "david.kim@usaid.gov",
        name: "David Kim",
        role: "policy_designer",
        status: "inactive",
        createdAt: "2024-01-20T00:00:00Z",
        lastLogin: "2024-01-01T08:00:00Z",
        avatar: null,
    },
    {
        id: "usr_008",
        email: "fatima.al-rashid@wfp.org",
        name: "Fatima Al-Rashid",
        role: "analyst",
        status: "active",
        createdAt: "2024-04-01T00:00:00Z",
        lastLogin: "2024-01-26T04:00:00Z",
        avatar: null,
    },
];

// Activity log
let activityLog = [
    { id: 1, userId: "usr_001", action: "user.role_change", target: "usr_005", details: "Changed role from viewer to user", timestamp: "2024-01-26T05:30:00Z" },
    { id: 2, userId: "usr_002", action: "scenario.create", target: null, details: "Created scenario 'Horn of Africa Drought 2024'", timestamp: "2024-01-26T04:15:00Z" },
    { id: 3, userId: "usr_003", action: "analysis.export", target: null, details: "Exported displacement data for Ethiopia", timestamp: "2024-01-26T03:00:00Z" },
    { id: 4, userId: "usr_001", action: "user.create", target: "usr_008", details: "Created new user account", timestamp: "2024-01-25T14:00:00Z" },
    { id: 5, userId: "usr_007", action: "user.deactivate", target: "usr_007", details: "User account deactivated", timestamp: "2024-01-20T10:00:00Z" },
];

/**
 * Get all users
 */
export function getAllUsers() {
    return [...users];
}

/**
 * Get user by ID
 */
export function getUserById(id) {
    return users.find(u => u.id === id) || null;
}

/**
 * Get user by email
 */
export function getUserByEmail(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Create new user
 */
export function createUser({ email, name, role, status = "active" }) {
    const id = `usr_${String(users.length + 1).padStart(3, "0")}`;
    const newUser = {
        id,
        email,
        name,
        role,
        status,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: null,
    };
    users.push(newUser);

    // Log activity
    activityLog.unshift({
        id: activityLog.length + 1,
        userId: "system",
        action: "user.create",
        target: id,
        details: `Created user ${name} (${email})`,
        timestamp: new Date().toISOString(),
    });

    return newUser;
}

/**
 * Update user
 */
export function updateUser(id, updates) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const oldUser = { ...users[index] };
    users[index] = { ...users[index], ...updates };

    // Log role change
    if (updates.role && updates.role !== oldUser.role) {
        activityLog.unshift({
            id: activityLog.length + 1,
            userId: "system",
            action: "user.role_change",
            target: id,
            details: `Changed role from ${oldUser.role} to ${updates.role}`,
            timestamp: new Date().toISOString(),
        });
    }

    // Log status change
    if (updates.status && updates.status !== oldUser.status) {
        activityLog.unshift({
            id: activityLog.length + 1,
            userId: "system",
            action: updates.status === "active" ? "user.activate" : "user.deactivate",
            target: id,
            details: `User ${updates.status === "active" ? "activated" : "deactivated"}`,
            timestamp: new Date().toISOString(),
        });
    }

    return users[index];
}

/**
 * Delete user (soft delete - sets status to deleted)
 */
export function deleteUser(id) {
    return updateUser(id, { status: "deleted" });
}

/**
 * Get activity log
 */
export function getActivityLog(limit = 20) {
    return activityLog.slice(0, limit);
}

/**
 * Get user statistics
 */
export function getUserStats() {
    const total = users.filter(u => u.status !== "deleted").length;
    const active = users.filter(u => u.status === "active").length;
    const byRole = {};

    users.forEach(u => {
        if (u.status !== "deleted") {
            byRole[u.role] = (byRole[u.role] || 0) + 1;
        }
    });

    return { total, active, inactive: total - active, byRole };
}
