import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Please define JWT_SECRET in .env.local");
}

// Hash password
export async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

// Compare password with hash
export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Sign JWT token
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Get user from token (for API routes)
export async function getUserFromToken(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
}
