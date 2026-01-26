import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/users";

/**
 * GET /api/admin/users/[id]
 * Get single user details
 */
export async function GET(request, { params }) {
    try {
        const user = getUserById(params.id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Admin user GET error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user (role, status, name)
 */
export async function PATCH(request, { params }) {
    try {
        const body = await request.json();
        const { role, status, name } = body;

        // Check user exists
        const existingUser = getUserById(params.id);
        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Build updates object
        const updates = {};
        if (role) updates.role = role;
        if (status) updates.status = status;
        if (name) updates.name = name;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, error: "No valid updates provided" },
                { status: 400 }
            );
        }

        const updatedUser = updateUser(params.id, updates);

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
        });
    } catch (error) {
        console.error("Admin user PATCH error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/users/[id]
 * Soft delete user (sets status to deleted)
 */
export async function DELETE(request, { params }) {
    try {
        const existingUser = getUserById(params.id);
        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Prevent deleting admin
        if (existingUser.role === "admin") {
            return NextResponse.json(
                { success: false, error: "Cannot delete admin user" },
                { status: 403 }
            );
        }

        deleteUser(params.id);

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Admin user DELETE error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
