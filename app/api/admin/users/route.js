import { NextResponse } from "next/server";
import { getAllUsers, createUser, getUserStats, getActivityLog } from "@/lib/users";
import { getAllRoles } from "@/lib/rbac";

/**
 * GET /api/admin/users
 * Returns list of all users with optional filtering
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const status = searchParams.get("status");
        const search = searchParams.get("search")?.toLowerCase();

        let users = getAllUsers();

        // Apply filters
        if (role) {
            users = users.filter(u => u.role === role);
        }
        if (status) {
            users = users.filter(u => u.status === status);
        }
        if (search) {
            users = users.filter(u =>
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }

        // Get stats and activity
        const stats = getUserStats();
        const activity = getActivityLog(10);
        const roles = getAllRoles();

        return NextResponse.json({
            success: true,
            data: {
                users,
                stats,
                activity,
                roles,
            },
        });
    } catch (error) {
        console.error("Admin users GET error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/users
 * Creates a new user
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, role } = body;

        // Validation
        if (!email || !name || !role) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: email, name, role" },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUsers = getAllUsers();
        if (existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return NextResponse.json(
                { success: false, error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Create user
        const newUser = createUser({ email, name, role });

        return NextResponse.json({
            success: true,
            data: newUser,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Admin users POST error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
