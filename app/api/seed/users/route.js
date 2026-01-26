import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

// Demo users for all 5 roles
const DEMO_USERS = [
    {
        email: "admin@praman.ai",
        password: "Admin@123",
        role: "admin",
    },
    {
        email: "designer@praman.ai",
        password: "Designer@123",
        role: "policy_designer",
    },
    {
        email: "analyst@praman.ai",
        password: "Analyst@123",
        role: "analyst",
    },
    {
        email: "user@praman.ai",
        password: "User@123",
        role: "user",
    },
    {
        email: "viewer@praman.ai",
        password: "Viewer@123",
        role: "viewer",
    },
];

/**
 * GET /api/seed/users
 * Seeds the database with demo users for all 5 roles
 * If users already exist, updates their passwords
 */
export async function GET() {
    try {
        await connectDB();

        const results = [];

        for (const demoUser of DEMO_USERS) {
            // Hash password using same function as auth (12 rounds)
            const hashedPassword = await hashPassword(demoUser.password);

            // Check if user already exists
            const existingUser = await User.findOne({ email: demoUser.email });

            if (existingUser) {
                // Update password in case it was different
                await User.updateOne(
                    { email: demoUser.email },
                    { password: hashedPassword, role: demoUser.role }
                );
                results.push({
                    email: demoUser.email,
                    role: demoUser.role,
                    status: "updated",
                });
            } else {
                // Create new user
                const newUser = await User.create({
                    email: demoUser.email,
                    password: hashedPassword,
                    role: demoUser.role,
                });

                results.push({
                    email: demoUser.email,
                    role: demoUser.role,
                    status: "created",
                    id: newUser._id,
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Demo users seeded/updated successfully!",
            users: results,
            credentials: DEMO_USERS.map(u => ({
                email: u.email,
                password: u.password,
                role: u.role,
            })),
            instructions: "You can now login with any of the credentials above.",
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
