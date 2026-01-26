import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

/**
 * GET /api/auth/me
 * Returns the current authenticated user from JWT
 */
export async function GET(request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.userId,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get user" },
            { status: 500 }
        );
    }
}
